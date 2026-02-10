import { supabase } from '@/lib/supabase';

export const HealthService = {
    /**
     * Get medical certificate status for a user
     */
    async getCertificate(userId: string) {
        const { data, error } = await supabase
            .from('medical_certificates' as any)
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    /**
     * Upload and register a new certificate
     */
    async uploadCertificate(userId: string, expiryDate: string, file: File) {
        // 1. Upload file to Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `certificates/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        // 3. Update Database
        const { data, error } = await supabase
            .from('medical_certificates' as any)
            .upsert({
                user_id: userId,
                expiry_date: expiryDate,
                file_url: publicUrl,
                status: 'pending',
                updated_at: new Date().toISOString()
            } as any)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Admin: Verify/Approve a certificate
     */
    async verifyCertificate(certificateId: string, status: 'valid' | 'rejected', notes?: string) {
        const { data, error } = await supabase
            .from('medical_certificates' as any)
            .update({
                status,
                notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', certificateId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
