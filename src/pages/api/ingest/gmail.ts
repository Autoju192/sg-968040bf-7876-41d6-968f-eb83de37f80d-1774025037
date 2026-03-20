import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import { decrypt, needsTokenRefresh, refreshGmailTokens, encrypt } from "@/lib/encryption";

/**
 * Gmail Integration API
 * Parses tender-related emails and creates inbox items
 * Uses Gmail API with OAuth authentication
 */

interface ParsedEmail {
  subject: string;
  from: string;
  body: string;
  date: string;
  attachments: string[];
  messageId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { connectionId, organisationId } = req.body;

    if (!connectionId || !organisationId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    console.log("📧 Fetching emails from Gmail...");

    // Get connection details
    const { data: connection } = await supabase
      .from("portal_connections")
      .select("*")
      .eq("id", connectionId)
      .single();

    if (!connection || !connection.credentials) {
      throw new Error("Gmail connection not found or not authenticated");
    }

    // Decrypt tokens
    let tokens = decrypt(connection.credentials as string);

    // Refresh tokens if needed
    if (needsTokenRefresh(tokens)) {
      console.log("🔄 Refreshing Gmail tokens...");
      tokens = await refreshGmailTokens(tokens.refresh_token);
      
      // Store refreshed tokens
      await supabase
        .from("portal_connections")
        .update({
          credentials: encrypt(tokens) as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId);
    }

    // Update connection status
    await supabase
      .from("portal_connections")
      .update({ status: "syncing" })
      .eq("id", connectionId);

    // Fetch emails from Gmail API
    const emails = await fetchGmailMessages(tokens.access_token);

    console.log(`✅ Fetched ${emails.length} emails`);

    let itemsFetched = 0;
    let itemsCreated = 0;
    const errors: string[] = [];

    for (const email of emails) {
      itemsFetched++;

      try {
        // Use AI to analyze email
        const analysis = await analyzeEmailWithAI(email);

        if (!analysis.isTenderRelated) {
          console.log(`⏭️ Skipping non-tender email: ${email.subject}`);
          continue;
        }

        // Check for duplicate
        const externalId = `gmail-${email.messageId}`;
        const { data: existing } = await supabase
          .from("tender_inbox")
          .select("id")
          .eq("external_id", externalId)
          .eq("organisation_id", organisationId)
          .single();

        if (existing) {
          console.log(`⏭️ Skipping duplicate email: ${email.subject}`);
          continue;
        }

        // Try to match to existing tender
        const matchedTender = await matchEmailToTender(
          email,
          analysis,
          organisationId
        );

        // Create inbox item
        await supabase.from("tender_inbox").insert({
          organisation_id: organisationId,
          tender_id: matchedTender?.id || null,
          connection_id: connectionId,
          source: "EMAIL",
          source_type: "gmail",
          type: analysis.emailType,
          title: email.subject,
          summary: analysis.summary,
          raw_content: email.body,
          action_required: analysis.actionRequired,
          action_text: analysis.actionText,
          action_deadline: analysis.deadline,
          suggested_owner: null,
          priority: analysis.priority,
          status: "unread",
          external_id: externalId,
          metadata: {
            from: email.from,
            date: email.date,
            attachments: email.attachments,
            analysis,
          },
        });

        itemsCreated++;

        // Create notification
        await supabase.from("notifications").insert({
          organisation_id: organisationId,
          type: analysis.emailType === "new_tender" ? "new_tender" : "message",
          title: `Email: ${analysis.emailType.replace("_", " ")}`,
          message: email.subject,
          tender_id: matchedTender?.id || null,
          is_read: false,
        });

        console.log(`✨ Created inbox item: ${email.subject}`);
      } catch (error: any) {
        console.error(`❌ Error processing email:`, error);
        errors.push(`${email.subject}: ${error.message}`);
      }
    }

    // Log sync
    await supabase.from("connection_logs").insert({
      connection_id: connectionId,
      organisation_id: organisationId,
      run_status: errors.length > 0 ? "partial_success" : "success",
      items_fetched: itemsFetched,
      items_created: itemsCreated,
      items_updated: 0,
      error_message: errors.length > 0 ? errors.join("; ") : null,
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
      errors,
    });
  } catch (error: any) {
    console.error("❌ Gmail sync error:", error);

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
 * Fetch messages from Gmail API
 */
async function fetchGmailMessages(accessToken: string): Promise<ParsedEmail[]> {
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=newer_than:7d",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status}`);
  }

  const data = await response.json();
  const messages = data.messages || [];

  // Fetch full message details
  const emails: ParsedEmail[] = [];

  for (const msg of messages.slice(0, 20)) {
    const msgResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (msgResponse.ok) {
      const msgData = await msgResponse.json();
      const headers = msgData.payload.headers;

      const getHeader = (name: string) =>
        headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
          ?.value || "";

      emails.push({
        subject: getHeader("Subject"),
        from: getHeader("From"),
        body: extractEmailBody(msgData.payload),
        date: getHeader("Date"),
        attachments: extractAttachments(msgData.payload),
        messageId: msgData.id,
      });
    }
  }

  return emails;
}

/**
 * Extract email body from Gmail payload
 */
function extractEmailBody(payload: any): string {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }
  }

  return "";
}

/**
 * Extract attachment filenames
 */
function extractAttachments(payload: any): string[] {
  const attachments: string[] = [];

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.filename) {
        attachments.push(part.filename);
      }
    }
  }

  return attachments;
}

/**
 * Use AI to analyze email and extract tender information
 */
async function analyzeEmailWithAI(email: ParsedEmail) {
  const prompt = `Analyze this email and determine if it's tender-related.

Subject: ${email.subject}
From: ${email.from}
Body: ${email.body.substring(0, 1000)}

Respond in JSON format:
{
  "isTenderRelated": boolean,
  "emailType": "new_tender" | "update" | "clarification" | "amendment" | "deadline_change" | "message",
  "summary": "Brief summary",
  "actionRequired": boolean,
  "actionText": "What action is needed" | null,
  "deadline": "YYYY-MM-DD" | null,
  "priority": "low" | "medium" | "high" | "urgent",
  "tenderTitle": "Extracted tender title" | null,
  "authority": "Extracted authority name" | null
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
            content:
              "You are an AI assistant that analyzes tender-related emails.",
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
    const analysis = JSON.parse(data.choices[0].message.content);

    return analysis;
  } catch (error) {
    // Fallback if AI fails
    return {
      isTenderRelated: true,
      emailType: "message",
      summary: email.subject,
      actionRequired: false,
      actionText: null,
      deadline: null,
      priority: "medium",
      tenderTitle: null,
      authority: null,
    };
  }
}

/**
 * Try to match email to existing tender
 */
async function matchEmailToTender(
  email: ParsedEmail,
  analysis: any,
  organisationId: string
) {
  if (!analysis.tenderTitle && !analysis.authority) {
    return null;
  }

  // Try to find matching tender
  let query = supabase
    .from("tenders")
    .select("id, title, authority")
    .eq("organisation_id", organisationId);

  if (analysis.tenderTitle) {
    query = query.ilike("title", `%${analysis.tenderTitle}%`);
  }

  if (analysis.authority) {
    query = query.ilike("authority", `%${analysis.authority}%`);
  }

  const { data: matches } = await query.limit(1);

  return matches && matches.length > 0 ? matches[0] : null;
}