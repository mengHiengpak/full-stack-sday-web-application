const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const storageUrl = supabaseUrl
  ? supabaseUrl.replace(/\/?$/, '') + '/storage/v1'
  : 'https://placeholder.supabase.co/storage/v1';

const headers = {
  apiKey: supabaseKey || '',
  Authorization: `Bearer ${supabaseKey || ''}`,
};

export { storageUrl, headers };
export default { storageUrl, headers };
