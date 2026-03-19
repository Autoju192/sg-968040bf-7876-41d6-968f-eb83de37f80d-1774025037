import type { NextApiRequest, NextApiResponse } from "next";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";

interface ExportRequest {
  title: string;
  authority: string;
  deadline: string;
  content: string;
  companyName?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, authority, deadline, content, companyName } =
      req.body as ExportRequest;

    if (!title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse markdown content and convert to Word document
    const sections = parseMarkdownToSections(content);

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header with company name
            new Paragraph({
              text: companyName || "TenderFlow AI",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Tender details
            new Paragraph({
              text: "TENDER RESPONSE",
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Tender: ", bold: true }),
                new TextRun(title),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Authority: ", bold: true }),
                new TextRun(authority),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Deadline: ", bold: true }),
                new TextRun(deadline),
              ],
              spacing: { after: 400 },
              border: {
                bottom: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
            }),

            // Content sections
            ...sections,
          ],
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tender-response-${Date.now()}.docx"`
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Word export error:", error);
    return res.status(500).json({
      error: "Failed to export document",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function parseMarkdownToSections(markdown: string): Paragraph[] {
  const lines = markdown.split("\n");
  const paragraphs: Paragraph[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }

    // H2 headings (##)
    if (line.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: line.replace("## ", ""),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );
      continue;
    }

    // H3 headings (###)
    if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: line.replace("### ", ""),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 300, after: 150 },
        })
      );
      continue;
    }

    // Bullet points
    if (line.startsWith("- ") || line.startsWith("* ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(2),
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
      continue;
    }

    // Bold text (**text**)
    if (line.includes("**")) {
      const parts = line.split("**");
      const children: TextRun[] = [];

      parts.forEach((part, index) => {
        if (index % 2 === 0) {
          children.push(new TextRun(part));
        } else {
          children.push(new TextRun({ text: part, bold: true }));
        }
      });

      paragraphs.push(
        new Paragraph({
          children,
          spacing: { after: 150 },
        })
      );
      continue;
    }

    // Regular paragraphs
    paragraphs.push(
      new Paragraph({
        text: line,
        spacing: { after: 150 },
      })
    );
  }

  return paragraphs;
}