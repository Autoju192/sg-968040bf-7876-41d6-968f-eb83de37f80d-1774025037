import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tenderId, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return res.status(200).json({
        reply: "I'm your AI assistant for this tender. I can help you:\n\n• Summarise tender requirements\n• Identify risks and opportunities\n• Draft responses to questions\n• Suggest evidence from your library\n• Generate document sections\n\nWhat would you like help with?",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant for TenderFlow AI, helping UK care providers with bid management. You analyse tenders, identify requirements, suggest evidence, and help draft responses. Be concise, professional, and focused on actionable insights.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Failed to process message",
      reply: "I encountered an error processing your request. Please try again.",
    });
  }
}