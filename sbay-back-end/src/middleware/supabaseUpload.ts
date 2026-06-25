import fs from 'fs';
import path from 'path';
import { storageUrl, headers } from '../config/supabase';

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

    const url = `${storageUrl}/object/${BUCKET}/${storagePath}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': contentType },
      body: buffer,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`Supabase upload failed (${res.status}): ${text}`);
      return null;
    }

    const publicUrl = `${storageUrl}/object/public/${BUCKET}/${storagePath}`;
    return publicUrl;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('Supabase upload error:', msg);
    return null;
  }
};
