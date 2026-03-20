import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

/**
 * Contracts Finder API Integration
 * Fetches tenders from UK Contracts Finder API
 * https://www.contractsfinder.service.gov.uk/
 */

interface ContractsFinderNotice {
  id: string;
  title: string;
  description: string;
  organisationName: string;
  publishedDate: string;
  closingDate: string;
  value?: number;
  location?: string;
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

    console.log("🔍 Fetching from Contracts Finder API...", {
      keywords,
      location,
      connectionId,
    });

    // Update connection status
    await supabase
      .from("portal_connections")
      .update({ status: "syncing" })
      .eq("id", connectionId);

    // Build API query
    const apiUrl = buildContractsFinderUrl(keywords, location);
    console.log("📡 API URL:", apiUrl);

    // Fetch from Contracts Finder API
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Contracts Finder API error: ${response.status}`);
    }

    const data = await response.json();
    const notices: ContractsFinderNotice[] = data.results || [];

    console.log(`✅ Fetched ${notices.length} notices from Contracts Finder`);

    let itemsFetched = 0;
    let itemsCreated = 0;
    let itemsUpdated = 0;
    const errors: string[] = [];

    // Process each notice
    for (const notice of notices) {
      itemsFetched++;

      try {
        const externalId = `contracts-finder-${notice.id}`;

        // Check if tender exists
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
              value: notice.value || null,
              location: notice.location || null,
              source_metadata: notice,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          itemsUpdated++;

          // Create inbox item
          await supabase.from("tender_inbox").insert({
            organisation_id: organisationId,
            tender_id: existing.id,
            connection_id: connectionId,
            source: "API",
            source_type: "contracts_finder",
            type: "update",
            title: `Updated: ${notice.title}`,
            summary: `Tender updated on Contracts Finder.`,
            action_required: false,
            priority: "medium",
            status: "unread",
            external_id: `${externalId}-update-${Date.now()}`,
            external_link: notice.url,
            metadata: { notice: notice as any },
          });
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
              value: notice.value || null,
              location: notice.location || null,
              status: "new",
              source: "API",
              source_type: "contracts_finder",
              external_id: externalId,
              external_link: notice.url,
              source_metadata: notice,
            })
            .select()
            .single();

          itemsCreated++;

          if (newTender) {
            // Create inbox item
            await supabase.from("tender_inbox").insert({
              organisation_id: organisationId,
              tender_id: newTender.id,
              connection_id: connectionId,
              source: "API",
              source_type: "contracts_finder",
              type: "new_tender",
              title: `New Tender: ${notice.title}`,
              summary: `New tender from ${notice.organisationName}. Deadline: ${new Date(notice.closingDate).toLocaleDateString()}.`,
              action_required: true,
              action_text: "Review tender and assess fit",
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
              title: "New tender from Contracts Finder",
              message: notice.title,
              tender_id: newTender.id,
              is_read: false,
            });
          }
        }
      } catch (error: any) {
        console.error(`❌ Error processing notice:`, error);
        errors.push(`${notice.title}: ${error.message}`);
      }
    }

    // Log sync
    await supabase.from("connection_logs").insert({
      connection_id: connectionId,
      organisation_id: organisationId,
      run_status: errors.length > 0 ? "partial_success" : "success",
      items_fetched: itemsFetched,
      items_created: itemsCreated,
      items_updated: itemsUpdated,
      error_message: errors.length > 0 ? errors.join("; ") : null,
      metadata: { keywords, location, apiUrl },
    });

    // Update connection
    await supabase
      .from("portal_connections")
      .update({
        status: errors.length > 0 ? "error" : "connected",
        last_sync_at: new Date().toISOString(),
        error_message: errors.length > 0 ? errors[0] : null,
      })
      .eq("id", connectionId);

    return res.status(200).json({
      success: true,
      itemsFetched,
      itemsCreated,
      itemsUpdated,
      errors,
    });
  } catch (error: any) {
    console.error("❌ Contracts Finder error:", error);

    if (req.body.connectionId) {
      await supabase.from("connection_logs").insert({
        connection_id: req.body.connectionId,
        organisation_id: req.body.organisationId,
        run_status: "failed",
        error_message: error.message,
      });

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

function buildContractsFinderUrl(keywords?: string, location?: string): string {
  const baseUrl = "https://www.contractsfinder.service.gov.uk/api/rest/2/searches";
  const params = new URLSearchParams();

  if (keywords) {
    params.append("keywords", keywords);
  }

  if (location) {
    params.append("postcode", location);
  }

  // Recent notices only
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  params.append("publishedFrom", thirtyDaysAgo.toISOString().split("T")[0]);

  params.append("limit", "50");

  return `${baseUrl}?${params.toString()}`;
}