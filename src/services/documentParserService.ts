// Document parsing service for extracting text from various file formats
import { supabase } from "@/lib/supabase";

export interface ParsedDocument {
  text: string;
  sections: DocumentSection[];
  questions: ExtractedQuestion[];
  metadata: DocumentMetadata;
}

export interface DocumentSection {
  title: string;
  content: string;
  pageNumber?: number;
}

export interface ExtractedQuestion {
  question: string;
  section: string;
  required: boolean;
  weight?: number;
}

export interface DocumentMetadata {
  pageCount?: number;
  wordCount: number;
  fileType: string;
  fileName: string;
}

export async function parseDocument(
  fileUrl: string,
  fileName: string,
  fileType: string
): Promise<ParsedDocument> {
  try {
    // Call API route to parse document
    const response = await fetch("/api/parse-document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileUrl,
        fileName,
        fileType,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to parse document");
    }

    const parsed = await response.json();
    return parsed;
  } catch (error) {
    console.error("Error parsing document:", error);
    throw error;
  }
}

export async function extractTenderQuestions(
  text: string
): Promise<ExtractedQuestion[]> {
  try {
    const response = await fetch("/api/extract-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to extract questions");
    }

    const { questions } = await response.json();
    return questions;
  } catch (error) {
    console.error("Error extracting questions:", error);
    return [];
  }
}

export async function saveParsedContent(
  tenderId: string,
  fileId: string,
  parsed: ParsedDocument
): Promise<void> {
  // Update tender_files with parsed text
  const { error: fileError } = await supabase
    .from("tender_files")
    .update({
      parsed_text: parsed.text,
    })
    .eq("id", fileId);

  if (fileError) throw fileError;

  // Save extracted questions to tender_questions
  if (parsed.questions.length > 0) {
    const questionsData = parsed.questions.map((q) => ({
      tender_id: tenderId,
      question_text: q.question,
      section: q.section,
      required: q.required,
      weight: q.weight || null,
    }));

    const { error: questionsError } = await supabase
      .from("tender_questions")
      .insert(questionsData);

    if (questionsError) {
      console.error("Error saving questions:", questionsError);
    }
  }
}