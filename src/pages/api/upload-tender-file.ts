import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const tenderId = Array.isArray(fields.tenderId)
      ? fields.tenderId[0]
      : fields.tenderId;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!tenderId || !file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Read file
    const fileBuffer = fs.readFileSync(file.filepath);
    const fileName = file.originalFilename || "file";
    const fileType = file.mimetype || "application/octet-stream";

    // Upload to Supabase Storage
    const fileExt = fileName.split(".").pop();
    const storagePath = `${tenderId}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("tender-files")
      .upload(storagePath, fileBuffer, {
        contentType: fileType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("tender-files")
      .getPublicUrl(storagePath);

    // Save file record to database
    const { data: fileRecord, error: dbError } = await supabase
      .from("tender_files")
      .insert({
        tender_id: tenderId,
        file_name: fileName,
        file_type: fileType,
        file_url: urlData.publicUrl,
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    res.status(200).json({
      fileId: fileRecord.id,
      fileUrl: urlData.publicUrl,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Failed to upload file",
    });
  }
}