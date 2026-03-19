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
      tenderDescription,
      authority,
      location,
      value,
      serviceType,
      deadline,
      companyProfile,
    } = req.body;

    if (!tenderTitle || !companyProfile) {
      return res.status(400).json({
        error: "Missing required fields: tenderTitle and companyProfile",
      });
    }

    const systemPrompt = `You are an expert UK social care procurement consultant.

Evaluate whether this tender is suitable for the given domiciliary care provider.

Return ONLY valid JSON in this exact format:

{
  "decision": "Bid" | "No Bid" | "Review",
  "score": 0-100,
  "service_fit": 0-25,
  "geography_fit": 0-15,
  "compliance_fit": 0-20,
  "evidence_fit": 0-20,
  "commercial_viability": 0-10,
  "effort": 0-10,
  "why": ["reason 1", "reason 2", "reason 3"],
  "risks": ["risk 1", "risk 2"],
  "missing_evidence": ["evidence 1", "evidence 2"],
  "next_steps": ["step 1", "step 2", "step 3"]
}

Scoring guidelines:
- Service Fit (0-25): How well do services match tender requirements?
- Geography Fit (0-15): Is the location within service area?
- Compliance Fit (0-20): CQC rating, accreditations, certifications
- Evidence Fit (0-20): Do they have case studies, past performance data?
- Commercial Viability (0-10): Is the contract value and duration suitable?
- Effort (0-10): Low effort = higher score, High effort = lower score

Decision logic:
- Score 80-100: "Bid" - Strong fit, recommend pursuing
- Score 60-79: "Review" - Moderate fit, needs consideration
- Score 0-59: "No Bid" - Poor fit, not recommended

Be thorough, realistic, and base recommendations on UK social care procurement standards.`;

    const userPrompt = `
TENDER DETAILS:
- Title: ${tenderTitle}
- Authority: ${authority || "Not specified"}
- Location: ${location || "Not specified"}
- Service Type: ${serviceType || "Not specified"}
- Value: ${value || "Not specified"}
- Deadline: ${deadline || "Not specified"}
- Description: ${tenderDescription || "No description provided"}

COMPANY PROFILE:
${JSON.stringify(companyProfile, null, 2)}

Evaluate this tender and return the JSON assessment.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    const evaluation = JSON.parse(responseText);

    // Validate the response structure
    if (
      !evaluation.decision ||
      typeof evaluation.score !== "number" ||
      !Array.isArray(evaluation.why) ||
      !Array.isArray(evaluation.risks) ||
      !Array.isArray(evaluation.missing_evidence) ||
      !Array.isArray(evaluation.next_steps)
    ) {
      throw new Error("Invalid response format from AI");
    }

    return res.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error: unknown) {
    console.error("Error evaluating tender:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return res.status(500).json({
      error: "Failed to evaluate tender",
      details: errorMessage,
    });
  }
}