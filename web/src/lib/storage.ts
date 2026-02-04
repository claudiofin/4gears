import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage in the 'builder-assets' bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadBuilderAsset(file: File, path: string): Promise<string> {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fullPath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('builder-assets')
        .upload(fullPath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading asset:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('builder-assets')
        .getPublicUrl(fullPath);

    return publicUrl;
}
