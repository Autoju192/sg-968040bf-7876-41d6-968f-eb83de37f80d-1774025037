import type { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    // Call OpenAI to extract questions from tender text
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert at analyzing tender documents. Extract all questions that bidders need to answer. For each question, identify:
- The question text
- The section it belongs to
- Whether it's required/mandatory
- The scoring weight (if mentioned)

Return JSON array format:
[
  {
    "question": "string",
    "section": "string",
    "required": boolean,
    "weight": number or null
  }
]`,
          },
          {
            role: "user",
            content: `Extract all questions from this tender document:\n\n${text.slice(0, 8000)}`,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI API error");
    }

    const content = data.choices[0]?.message?.content;
    const parsed = JSON.parse(content || "{}");

    res.status(200).json({
      questions: parsed.questions || [],
    });
  } catch (error) {
    console.error("Error extracting questions:", error);
    res.status(500).json({
      error: "Failed to extract questions",
      questions: [],
    });
  }
}