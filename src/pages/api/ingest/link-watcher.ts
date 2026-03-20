import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

/**
 * Link Watcher API
 * Monitors tender URLs for changes
 * Detects new documents, deadline changes, and content updates
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { connectionId, url, organisationId, tenderId } = req.body;

    if (!connectionId || !url || !organisationId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    console.log("🔗 Watching URL for changes:", url);

    // Update connection status
    await supabase
      .from("portal_connections")
      .update({ status: "syncing" })
      .eq("id", connectionId);

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "TenderFlow-LinkWatcher/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const contentHash = crypto.createHash("md5").update(html).digest("hex");

    console.log("📄 Content fetched, hash:", contentHash);

    // Get connection config to compare with previous hash
    const { data: connection } = await supabase
      .from("portal_connections")
      .select("config")
      .eq("id", connectionId)
      .single();

    const config = connection?.config as Record<string, any> | undefined;
    const previousHash = config?.lastContentHash;
    const hasChanged = previousHash && previousHash !== contentHash;

    let itemsCreated = 0;

    if (hasChanged) {
      console.log("🔔 Change detected!");

      // Analyze changes with AI
      const changes = await analyzeChangesWithAI(html);

      // Create inbox item for change
      await supabase.from("tender_inbox").insert({
        organisation_id: organisationId,
        tender_id: tenderId || null,
        connection_id: connectionId,
        source: "LINK_WATCHER",
        source_type: "url",
        type: changes.changeType,
        title: changes.title,
        summary: changes.summary,
        action_required: changes.actionRequired,
        action_text: changes.actionText,
        action_deadline: changes.deadline,
        priority: changes.priority,
        status: "unread",
        external_id: `link-watcher-${connectionId}-${Date.now()}`,
        external_link: url,
        metadata: {
          previousHash,
          currentHash: contentHash,
          changes,
        },
      });

      itemsCreated = 1;

      // Create notification
      await supabase.from("notifications").insert({
        organisation_id: organisationId,
        type: "tender_update",
        title: "Tender page updated",
        message: changes.title,
        tender_id: tenderId || null,
        is_read: false,
      });

      console.log("✨ Created inbox item for change");
    } else {
      console.log("✅ No changes detected");
    }

    // Update connection config with new hash
    await supabase
      .from("portal_connections")
      .update({
        config: {
          ...(config || {}),
          lastContentHash: contentHash,
          lastCheckedAt: new Date().toISOString(),
        },
      })
      .eq("id", connectionId);

    // Log sync
    await supabase.from("connection_logs").insert({
      connection_id: connectionId,
      organisation_id: organisationId,
      run_status: "success",
      items_fetched: 1,
      items_created: itemsCreated,
      items_updated: 0,
      metadata: {
        url,
        contentHash,
        previousHash,
        hasChanged,
      },
    });

    // Update connection status
    await supabase
      .from("portal_connections")
      .update({
        status: "connected",
        last_sync_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", connectionId);

    return res.status(200).json({
      success: true,
      hasChanged,
      itemsCreated,
      contentHash,
    });
  } catch (error: any) {
    console.error("❌ Link watcher error:", error);

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

/**
 * Use AI to analyze what changed on the page
 */
async function analyzeChangesWithAI(html: string) {
  // Extract visible text from HTML
  const text = html
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 3000);

  const prompt = `Analyze this tender page content and identify what type of change occurred.

Content: ${text}

Respond in JSON format:
{
  "changeType": "update" | "deadline_change" | "document_added" | "clarification" | "amendment",
  "title": "Brief title describing the change",
  "summary": "2-3 sentence summary of what changed",
  "actionRequired": boolean,
  "actionText": "What action is needed" | null,
  "deadline": "YYYY-MM-DD" | null,
  "priority": "low" | "medium" | "high" | "urgent"
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You analyze tender page changes and classify updates.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    // Fallback
    return {
      changeType: "update",
      title: "Tender page updated",
      summary: "The tender page content has changed.",
      actionRequired: true,
      actionText: "Review the changes to the tender page",
      deadline: null,
      priority: "medium",
    };
  }
}