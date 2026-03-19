import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      tenderTitle,
      authority,
      section,
      questionText,
      wordLimit,
      companyProfile,
      evidenceLibrary,
    } = req.body;

    if (!questionText || !section) {
      return res.status(400).json({
        error: "Missing required fields: questionText and section",
      });
    }

    const systemPrompt = `You are an expert UK local authority tender response writer.

Write professional, bid-ready responses for UK social care tenders.

CRITICAL REQUIREMENTS:
- Use formal, professional tone suitable for local authority procurement
- Structure with clear headings and concise paragraphs
- Focus on evidence-based claims only
- NEVER invent experience, qualifications, or capabilities
- Use bullet points for clarity where appropriate
- Include specific examples from evidence library when available
- Follow UK social care regulations and best practices
- Keep within word limits

SECTIONS TO COVER (when relevant):
1. Service Delivery - How services will be delivered, methodology, approach
2. Mobilisation - Implementation plan, timeline, resource allocation
3. Safeguarding - Adult and child safeguarding procedures, training, reporting
4. Staffing - Recruitment, retention, training, supervision, DBS checks
5. Quality Assurance - Monitoring, audits, continuous improvement, CQC compliance

FORMAT:
- Start with a brief overview paragraph
- Use clear subheadings (e.g., "1.1 Service Delivery Model")
- Write concise paragraphs (3-4 sentences)
- Use bullet points for lists
- End with a summary statement
- Professional, confident but not arrogant tone

DO NOT:
- Invent case studies or experience
- Exaggerate capabilities
- Use generic corporate jargon
- Make unsubstantiated claims
- Include pricing (unless specifically requested)
- Use first-person pronouns excessively

Return ONLY the response text, formatted in Markdown.`;

    const userPrompt = `
TENDER DETAILS:
- Title: ${tenderTitle || "Not specified"}
- Authority: ${authority || "Not specified"}
- Section: ${section}
- Question: ${questionText}
- Word Limit: ${wordLimit || "No limit specified"}

COMPANY PROFILE:
${JSON.stringify(companyProfile, null, 2)}

EVIDENCE LIBRARY (use only what's relevant):
${JSON.stringify(evidenceLibrary, null, 2)}

Write a professional, bid-ready response for this tender question.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Count words for validation
    const wordCount = responseText.split(/\s+/).length;

    return res.status(200).json({
      success: true,
      response: responseText,
      wordCount,
      section,
    });
  } catch (error: unknown) {
    console.error("Error generating tender response:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return res.status(500).json({
      error: "Failed to generate tender response",
      details: errorMessage,
    });
  }
}