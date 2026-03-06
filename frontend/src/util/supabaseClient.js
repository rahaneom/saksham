import { createClient } from '@supabase/supabase-js';

// make sure you set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are missing. Please add them to .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a file to the `resources` bucket (you may need to create it in the Supabase dashboard).
 * Returns public url that can be stored in the backend.
 */
export async function uploadResourceFile(file, folder = '') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const path = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from('resources')
    .upload(path, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from('resources')
    .getPublicUrl(path);

  return data.publicUrl;
}
