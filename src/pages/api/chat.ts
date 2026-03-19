import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, tenderId, userId } = req.body;

    if (!message || !tenderId) {
      return res.status(400).json({
        error: "Missing required fields: message and tenderId",
      });
    }

    // Fetch tender details
    const { data: tender, error: tenderError } = await supabase
      .from("tenders")
      .select("*")
      .eq("id", tenderId)
      .single();

    if (tenderError || !tender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    // Fetch tender files
    const { data: tenderFiles } = await supabase
      .from("tender_files")
      .select("*")
      .eq("tender_id", tenderId);

    // Fetch tender questions
    const { data: questions } = await supabase
      .from("tender_questions")
      .select("*")
      .eq("tender_id", tenderId);

    // Fetch evidence library for the organization
    const { data: evidence } = await supabase
      .from("evidence_library")
      .select("*")
      .eq("organisation_id", tender.organisation_id);

    // Fetch historical bids
    const { data: historicalBids } = await supabase
      .from("historical_bids")
      .select("*")
      .eq("organisation_id", tender.organisation_id)
      .limit(5);

    // Fetch previous messages for context
    const { data: previousMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: true })
      .limit(10);

    // Build context for AI
    const systemPrompt = `You are an AI bid assistant helping a UK care provider with tender ${tender.title}.

CRITICAL INSTRUCTIONS:
- Answer questions clearly and practically
- Identify risks and missing evidence
- Suggest improvements based on evidence library
- NEVER invent compliance claims or certifications
- Always use structured, well-formatted answers
- Highlight key requirements and deadlines
- Reference specific documents when available

AVAILABLE CONTEXT:

TENDER INFORMATION:
- Title: ${tender.title}
- Authority: ${tender.authority}
- Location: ${tender.location}
- Service Type: ${tender.service_type}
- Value: ${tender.value}
- Deadline: ${new Date(tender.deadline).toLocaleDateString()}
- Description: ${tender.description || "No description available"}

${questions && questions.length > 0 ? `
TENDER QUESTIONS (${questions.length} questions):
${questions.map((q: any, i: number) => `${i + 1}. ${q.question_text}\n   Category: ${q.category}\n   Required: ${q.is_mandatory ? "Yes" : "No"}`).join("\n")}
` : ""}

${evidence && evidence.length > 0 ? `
EVIDENCE LIBRARY (${evidence.length} items available):
${evidence.map((e: any) => `- ${e.title} (${e.category}): ${e.content?.substring(0, 150)}...`).join("\n")}
` : "No evidence library items available."}

${historicalBids && historicalBids.length > 0 ? `
HISTORICAL BIDS (${historicalBids.length} past bids):
${historicalBids.map((b: any) => `- ${b.tender_title}: ${b.outcome} - ${b.notes?.substring(0, 100)}...`).join("\n")}
` : "No historical bid data available."}

${tenderFiles && tenderFiles.length > 0 ? `
UPLOADED DOCUMENTS (${tenderFiles.length} files):
${tenderFiles.map((f: any) => `- ${f.file_name} (${f.file_type})`).join("\n")}
` : "No documents uploaded yet."}

RESPONSE FORMAT:
- Use clear headings and bullet points
- Highlight key requirements with **bold text**
- Flag risks with ⚠️ WARNING:
- Suggest evidence with 📚 EVIDENCE NEEDED:
- Use numbered steps for complex answers
- Reference specific documents when applicable

Remember: Be helpful, practical, and never make up compliance information.`;

    // Build message history
    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add previous conversation for context
    if (previousMessages && previousMessages.length > 0) {
      previousMessages.forEach((msg: any) => {
        messages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from OpenAI");
    }

    // Save messages to database
    await supabase.from("messages").insert([
      {
        tender_id: tenderId,
        user_id: userId,
        sender: "user",
        content: message,
      },
      {
        tender_id: tenderId,
        user_id: userId,
        sender: "assistant",
        content: aiResponse,
      },
    ]);

    return res.status(200).json({
      success: true,
      response: aiResponse,
    });
  } catch (error: unknown) {
    console.error("Error in chat API:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return res.status(500).json({
      error: "Failed to process chat message",
      details: errorMessage,
    });
  }
}