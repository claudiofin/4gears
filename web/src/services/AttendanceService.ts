import { supabase } from '@/lib/supabase';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'justified';

export const AttendanceService = {
    /**
     * Fetch upcoming training sessions for a club
     */
    async getSessions(clubId: string) {
        const { data, error } = await supabase
            .from('training_sessions' as any)
            .select('*')
            .eq('club_id', clubId)
            .order('start_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Fetch attendance for a specific session
     */
    async getSessionAttendance(sessionId: string) {
        const { data, error } = await supabase
            .from('attendances' as any)
            .select(`
                *,
                profiles (
                    id,
                    full_name,
                    email,
                    avatar_url
                )
            `)
            .eq('session_id', sessionId);

        if (error) throw error;
        return data;
    },

    /**
     * Submit or update attendance for an athlete
     */
    async markAttendance(sessionId: string, userId: string, status: AttendanceStatus, notes?: string) {
        const { data, error } = await supabase
            .from('attendances' as any)
            .upsert({
                session_id: sessionId,
                user_id: userId,
                status,
                notes,
                updated_at: new Date().toISOString()
            } as any, {
                onConflict: 'session_id,user_id'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
