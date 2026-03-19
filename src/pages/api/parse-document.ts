import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileUrl, fileName, fileType } = req.body;

    // For now, return a mock parsed document
    // In production, you would use libraries like pdf-parse, mammoth, xlsx
    // or call a document processing service

    const mockParsed = {
      text: `This is the extracted text from ${fileName}. In production, this would contain the full document content parsed from the ${fileType} file.`,
      sections: [
        {
          title: "Introduction",
          content: "Welcome to this tender opportunity...",
          pageNumber: 1,
        },
        {
          title: "Service Requirements",
          content: "The service provider must demonstrate...",
          pageNumber: 2,
        },
        {
          title: "Quality Standards",
          content: "All services must meet CQC requirements...",
          pageNumber: 3,
        },
      ],
      questions: [
        {
          question: "Describe your approach to safeguarding vulnerable adults",
          section: "Safeguarding",
          required: true,
          weight: 15,
        },
        {
          question: "Detail your quality assurance processes",
          section: "Quality",
          required: true,
          weight: 20,
        },
      ],
      metadata: {
        pageCount: 10,
        wordCount: 5420,
        fileType,
        fileName,
      },
    };

    res.status(200).json(mockParsed);
  } catch (error) {
    console.error("Error parsing document:", error);
    res.status(500).json({
      error: "Failed to parse document",
    });
  }
}