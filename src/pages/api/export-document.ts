import type { NextApiRequest, NextApiResponse } from "next";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, sections, format } = req.body;

    if (format === "docx") {
      // Create Word document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({ text: "" }),
              ...sections.flatMap((section: { heading: string; content: string }) => [
                new Paragraph({
                  text: section.heading,
                  heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({ text: "" }),
                ...section.content.split("\n").map(
                  (line: string) =>
                    new Paragraph({
                      children: [new TextRun(line)],
                    })
                ),
                new Paragraph({ text: "" }),
              ]),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader("Content-Disposition", `attachment; filename="${title}.docx"`);
      res.send(buffer);
    } else {
      // Return as plain text for other formats
      const textContent = `${title}\n\n${sections
        .map((s: { heading: string; content: string }) => `${s.heading}\n\n${s.content}`)
        .join("\n\n")}`;

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", `attachment; filename="${title}.txt"`);
      res.send(textContent);
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      error: "Failed to export document",
    });
  }
}