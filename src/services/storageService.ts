import { supabase } from "@/lib/supabase";

const TENDER_FILES_BUCKET = "tender-files";

export async function uploadTenderFile(
  tenderId: string,
  file: File
): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${tenderId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  // Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(TENDER_FILES_BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(TENDER_FILES_BUCKET)
    .getPublicUrl(fileName);

  return {
    url: urlData.publicUrl,
    path: fileName,
  };
}

export async function deleteTenderFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(TENDER_FILES_BUCKET)
    .remove([filePath]);

  if (error) throw error;
}

export async function downloadTenderFile(filePath: string): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from(TENDER_FILES_BUCKET)
    .download(filePath);

  if (error) throw error;
  return data;
}

export async function listTenderFiles(tenderId: string) {
  const { data, error } = await supabase.storage
    .from(TENDER_FILES_BUCKET)
    .list(tenderId, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) throw error;
  return data;
}