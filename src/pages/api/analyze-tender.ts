import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalyzeRequest {
  tenderText: string;
  tenderTitle?: string;
}

interface AnalysisResult {
  summary: string;
  key_requirements: string[];
  evaluation_criteria: Array<{
    criterion: string;
    weighting: string;
    description: string;
  }>;
  risks: Array<{
    risk: string;
    severity: "high" | "medium" | "low";
    mitigation: string;
  }>;
  mandatory_elements: Array<{
    element: string;
    deadline?: string;
    details: string;
  }>;
  deadlines: Array<{
    type: string;
    date: string;
    description: string;
  }>;
  question_count: number;
  estimated_effort_hours: number;
  recommended_team_size: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tenderText, tenderTitle } = req.body as AnalyzeRequest;

    if (!tenderText) {
      return res.status(400).json({ error: "Tender text is required" });
    }

    const prompt = `You are an expert UK local authority procurement analyst. Analyze this tender document and extract structured information.

Tender Title: ${tenderTitle || "Not provided"}

Tender Document:
${tenderText}

Extract and return a JSON object with the following structure:

{
  "summary": "Brief 2-3 sentence executive summary of the tender",
  "key_requirements": ["Array of 5-10 key requirements"],
  "evaluation_criteria": [
    {
      "criterion": "Name of criterion (e.g., Quality, Price, Social Value)",
      "weighting": "Percentage or points (e.g., 60%, 40 points)",
      "description": "What will be assessed"
    }
  ],
  "risks": [
    {
      "risk": "Description of risk",
      "severity": "high|medium|low",
      "mitigation": "How to address this risk"
    }
  ],
  "mandatory_elements": [
    {
      "element": "What must be provided (e.g., Public Liability Insurance, DBS checks)",
      "deadline": "When it's needed (if specified)",
      "details": "Additional requirements"
    }
  ],
  "deadlines": [
    {
      "type": "Type of deadline (e.g., Clarification Questions, Tender Submission)",
      "date": "Date in YYYY-MM-DD format or 'Not specified'",
      "description": "What's due"
    }
  ],
  "question_count": "Estimated number of questions to answer",
  "estimated_effort_hours": "Estimated hours to complete bid",
  "recommended_team_size": "Number of people recommended for bid team"
}

IMPORTANT:
- Extract actual deadlines from the document
- Identify high-risk areas (tight deadlines, complex requirements, missing information)
- Focus on mandatory compliance requirements (CQC, DBS, insurance, accreditations)
- Be specific and factual - don't invent information
- If information is not in the document, use "Not specified" or empty array

Return ONLY valid JSON, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert UK local authority procurement analyst. Extract structured tender information accurately. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const analysisText = completion.choices[0].message.content;
    if (!analysisText) {
      return res.status(500).json({ error: "No analysis generated" });
    }

    const analysis: AnalysisResult = JSON.parse(analysisText);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Tender analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze tender",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}