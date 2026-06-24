import fs from 'fs';
import supabase from '../config/supabase';

const BUCKET = 'sbay-media';

let _ready: boolean | null = null;

const checkBucket = async (): Promise<boolean> => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    return buckets?.some(b => b.name === BUCKET) ?? false;
  } catch {
    return false;
  }
};

export const tryUploadToSupabase = async (localPath: string, storagePath: string): Promise<string | null> => {
  if (_ready === null) _ready = await checkBucket();
  if (!_ready) {
    console.warn(`⚠️ Create Supabase bucket "${BUCKET}" for permanent storage`);
    return null;
  }

  try {
    const buffer = fs.readFileSync(localPath);
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, { upsert: true, contentType: 'application/octet-stream' });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return urlData.publicUrl;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('Supabase upload error:', msg);
    return null;
  }
};
