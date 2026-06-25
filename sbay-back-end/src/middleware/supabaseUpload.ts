import fs from 'fs';
import path from 'path';
import supabase from '../config/supabase';

const BUCKET = 'sbay-media';

const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  gif: 'image/gif', webp: 'image/webp',
  mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska',
  pdf: 'application/pdf',
};

export const tryUploadToSupabase = async (localPath: string, storagePath: string): Promise<string | null> => {
  try {
    const buffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).slice(1).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, { upsert: true, contentType });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return urlData.publicUrl;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('Supabase upload error:', msg);
    return null;
  }
};
