import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, tenderId, context } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    // Fetch tender data for context
    const { data: tender } = await supabase
      .from("tenders")
      .select("*, tender_scores(*), tender_files(*), tender_questions(*)")
      .eq("id", tenderId)
      .single();

    // Fetch evidence library for context
    const { data: evidence } = await supabase
      .from("evidence_library")
      .select("*")
      .limit(10);

    // Fetch conversation history
    const { data: history } = await supabase
      .from("messages")
      .select("*")
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: true })
      .limit(20);

    // Build context-rich system prompt
    const systemPrompt = `You are TenderFlow AI, an expert bid management assistant for UK care providers. You help users analyze tenders, identify risks, draft responses, and make bid/no-bid decisions.

TENDER CONTEXT:
Title: ${tender?.title || "Unknown"}
Authority: ${tender?.authority || "Unknown"}
Deadline: ${tender?.deadline || "Unknown"}
Value: £${tender?.value ? Number(tender.value).toLocaleString() : "Unknown"}
Location: ${tender?.location || "Unknown"}
Service Type: ${tender?.service_type || "Unknown"}

${tender?.tender_scores?.[0] ? `
AI ANALYSIS:
- Overall Score: ${tender.tender_scores[0].total_score}/100
- Decision: ${tender.tender_scores[0].decision}
- Service Fit: ${tender.tender_scores[0].service_fit}/100
- Geography Fit: ${tender.tender_scores[0].geography_fit}/100
- Compliance Fit: ${tender.tender_scores[0].compliance_fit}/100
- Evidence Fit: ${tender.tender_scores[0].evidence_fit}/100
- Reasoning: ${tender.tender_scores[0].reasoning}
` : ""}

${tender?.tender_questions?.length ? `
KEY QUESTIONS (${tender.tender_questions.length} total):
${tender.tender_questions.slice(0, 5).map((q: any, i: number) => `${i + 1}. ${q.question_text} (Section: ${q.section})`).join("\n")}
` : ""}

${evidence?.length ? `
AVAILABLE EVIDENCE LIBRARY:
${evidence.map((e: any) => `- ${e.category}: ${e.title}`).join("\n")}
` : ""}

YOUR CAPABILITIES:
1. Summarize and analyze tender requirements
2. Identify risks and opportunities
3. Assess bid/no-bid decisions
4. Draft responses using evidence library
5. Suggest missing evidence or documentation
6. Answer questions about CQC compliance, safeguarding, quality standards
7. Help with mobilization plans and method statements

Be concise, practical, and focused on winning bids. Use UK care sector terminology. Reference specific evidence when drafting responses.`;

    // Build conversation history
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history?.map((m: any) => ({
        role: m.is_ai ? "assistant" : "user",
        content: m.content,
      })) || []),
      { role: "user", content: message },
    ];

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI API error");
    }

    const aiReply = data.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";

    res.status(200).json({
      reply: aiReply,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      reply: "I encountered an error processing your request. Please try again.",
    });
  }
}