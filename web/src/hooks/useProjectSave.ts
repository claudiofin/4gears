import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeConfig } from '@/types/builder';

interface UseProjectSaveProps {
    projectId: string;
    config: any;
}

export function useProjectSave({ projectId, config }: UseProjectSaveProps) {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (!projectId || projectId === 'new' || !config) return;

        const timer = setTimeout(() => {
            saveProject();
        }, 30000); // 30 seconds debounce

        return () => clearTimeout(timer);
    }, [config, projectId]);

    const saveProject = async () => {
        if (!user || !projectId || projectId === 'new') return;

        try {
            setSaving(true);
            setError(null);

            const { error: saveError } = await supabase
                .from('projects')
                .update({
                    config,
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId)
                .eq('user_id', user.id);

            if (saveError) throw saveError;

            setLastSaved(new Date());
        } catch (err: any) {
            setError(err.message || 'Errore nel salvataggio');
            console.error('Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const manualSave = async () => {
        await saveProject();
    };

    return {
        saving,
        lastSaved,
        error,
        manualSave
    };
}
