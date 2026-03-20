import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

/**
 * Find a Tender API Integration
 * Fetches tenders from UK Find a Tender API
 * https://www.find-tender.service.gov.uk/
 */

interface FindATenderNotice {
  id: string;
  title: string;
  description: string;
  organisationName: string;
  publishedDate: string;
  closingDate: string;
  value?: {
    amount: number;
    currency: string;
  };
  location?: string;
  cpvCodes?: string[];
  url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { connectionId, keywords, location, organisationId } = req.body;

    if (!connectionId || !organisationId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    console.log("🔍 Fetching from Find a Tender API...", {
      keywords,
      location,
      connectionId,
    });

    // Update connection status to syncing
    await supabase
      .from("portal_connections")
      .update({ status: "syncing" })
      .eq("id", connectionId);

    // Build API query
    const apiUrl = buildFindATenderUrl(keywords, location);
    console.log("📡 API URL:", apiUrl);

    // Fetch from Find a Tender API
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Find a Tender API error: ${response.status}`);
    }

    const data = await response.json();
    const notices: FindATenderNotice[] = data.results || [];

    console.log(`✅ Fetched ${notices.length} notices from Find a Tender`);

    let itemsFetched = 0;
    let itemsCreated = 0;
    let itemsUpdated = 0;
    const errors: string[] = [];

    // Process each notice
    for (const notice of notices) {
      itemsFetched++;

      try {
        // Generate external_id for deduplication
        const externalId = `find-a-tender-${notice.id}`;

        // Check if tender already exists
        const { data: existing } = await supabase
          .from("tenders")
          .select("id, title")
          .eq("external_id", externalId)
          .eq("organisation_id", organisationId)
          .single();

        if (existing) {
          // Update existing tender
          await supabase
            .from("tenders")
            .update({
              title: notice.title,
              description: notice.description,
              authority: notice.organisationName,
              deadline: notice.closingDate,
              value: notice.value?.amount || null,
              location: notice.location || null,
              source_metadata: notice,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          itemsUpdated++;

          // Create inbox item for update
          await supabase.from("tender_inbox").insert({
            organisation_id: organisationId,
            tender_id: existing.id,
            connection_id: connectionId,
            source: "API",
            source_type: "find_a_tender",
            type: "update",
            title: `Updated: ${notice.title}`,
            summary: `Tender "${notice.title}" has been updated.`,
            action_required: false,
            priority: "medium",
            status: "unread",
            external_id: `${externalId}-update-${Date.now()}`,
            external_link: notice.url,
            metadata: { notice: notice as any },
          });

          console.log(`🔄 Updated tender: ${notice.title}`);
        } else {
          // Create new tender
          const { data: newTender } = await supabase
            .from("tenders")
            .insert({
              organisation_id: organisationId,
              title: notice.title,
              description: notice.description,
              authority: notice.organisationName,
              deadline: notice.closingDate,
              value: notice.value?.amount || null,
              location: notice.location || null,
              status: "new",
              source: "API",
              source_type: "find_a_tender",
              external_id: externalId,
              external_link: notice.url,
              source_metadata: notice,
            })
            .select()
            .single();

          itemsCreated++;

          if (newTender) {
            // Create inbox item for new tender
            await supabase.from("tender_inbox").insert({
              organisation_id: organisationId,
              tender_id: newTender.id,
              connection_id: connectionId,
              source: "API",
              source_type: "find_a_tender",
              type: "new_tender",
              title: `New Tender: ${notice.title}`,
              summary: `New tender opportunity from ${notice.organisationName}. Deadline: ${new Date(notice.closingDate).toLocaleDateString()}.`,
              action_required: true,
              action_text: "Review tender eligibility and AI score",
              priority: "high",
              status: "unread",
              external_id: externalId,
              external_link: notice.url,
              metadata: { notice: notice as any },
            });

            // Create notification
            await supabase.from("notifications").insert({
              organisation_id: organisationId,
              type: "new_tender",
              title: "New tender matched your criteria",
              message: notice.title,
              tender_id: newTender.id,
              is_read: false,
            });

            console.log(`✨ Created new tender: ${notice.title}`);
          }
        }
      } catch (error: any) {
        console.error(`❌ Error processing notice ${notice.id}:`, error);
        errors.push(`${notice.title}: ${error.message}`);
      }
    }

    // Log the sync operation
    const logResult = await supabase.from("connection_logs").insert({
      connection_id: connectionId,
      organisation_id: organisationId,
      run_status: errors.length > 0 ? "partial_success" : "success",
      items_fetched: itemsFetched,
      items_created: itemsCreated,
      items_updated: itemsUpdated,
      error_message: errors.length > 0 ? errors.join("; ") : null,
      metadata: {
        keywords,
        location,
        apiUrl,
        totalNotices: notices.length,
      },
    });

    // Update connection status
    await supabase
      .from("portal_connections")
      .update({
        status: errors.length > 0 ? "error" : "connected",
        last_sync_at: new Date().toISOString(),
        error_message: errors.length > 0 ? errors[0] : null,
      })
      .eq("id", connectionId);

    console.log("🎉 Find a Tender sync completed", {
      itemsFetched,
      itemsCreated,
      itemsUpdated,
      errors: errors.length,
    });

    return res.status(200).json({
      success: true,
      itemsFetched,
      itemsCreated,
      itemsUpdated,
      errors,
    });
  } catch (error: any) {
    console.error("❌ Find a Tender API error:", error);

    // Log error
    if (req.body.connectionId) {
      await supabase.from("connection_logs").insert({
        connection_id: req.body.connectionId,
        organisation_id: req.body.organisationId,
        run_status: "failed",
        items_fetched: 0,
        items_created: 0,
        items_updated: 0,
        error_message: error.message,
      });

      // Update connection with error
      await supabase
        .from("portal_connections")
        .update({
          status: "error",
          error_message: error.message,
        })
        .eq("id", req.body.connectionId);
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Build Find a Tender API URL with filters
 */
function buildFindATenderUrl(keywords?: string, location?: string): string {
  const baseUrl = "https://www.find-tender.service.gov.uk/api/1.0/notices";
  const params = new URLSearchParams();

  // Add keywords filter
  if (keywords) {
    params.append("q", keywords);
  }

  // Add location filter (UK regions)
  if (location) {
    params.append("location", location);
  }

  // Only fetch recent notices (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  params.append("publishedFrom", thirtyDaysAgo.toISOString().split("T")[0]);

  // Sort by published date (newest first)
  params.append("sort", "-publishedDate");

  // Limit results
  params.append("limit", "50");

  return `${baseUrl}?${params.toString()}`;
}