'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/database';
import { PreviewPane } from '@/components/preview/PreviewPane';
import { DEFAULT_TEAMS } from '@/constants/teams';
import {
    generateEvents,
    generatePlayers,
    generateNotifications,
    generateConversations,
    generateSponsors,
    generateStaff,
    generateChants,
    generateHistory
} from '@/constants/sports';

export default function StandalonePreviewPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [mockData, setMockData] = useState<any>({});
    const [previewPage, setPreviewPage] = useState('home');

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const loadProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (error) throw error;
            setProject(data);

            const config = (data as any).config;
            const sportType = config?.team?.sportType || 'Calcio';

            // Initialize mock data
            setMockData({
                players: generatePlayers(sportType),
                events: generateEvents(sportType),
                notifications: generateNotifications(sportType),
                conversations: generateConversations(sportType),
                sponsors: generateSponsors(),
                staff: generateStaff(),
                chants: generateChants(),
                history: generateHistory(),
                cart: []
            });

        } catch (err) {
            console.error('Error loading preview:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium animate-pulse">Caricamento Anteprima...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Ops! Progetto non trovato</h1>
                    <p className="text-slate-400">Il link potrebbe essere scaduto o non valido.</p>
                </div>
            </div>
        );
    }

    const config = (project as any).config;

    return (
        <div className="fixed inset-0 bg-slate-950 overflow-hidden">
            <PreviewPane
                isStandalone={true}
                deviceType={config.simulator?.deviceType || 'IPHONE'}
                notchStyle={config.simulator?.notchStyle || 'STANDARD'}
                isDarkMode={config.simulator?.isDarkMode || false}
                viewMode="USER"
                themeConfig={config.theme}
                currentTeam={config.team || DEFAULT_TEAMS[0]}
                activeFeatures={Object.fromEntries(
                    Object.entries(config.features || {}).map(([k, v]: [string, any]) => [k, v.enabled])
                )}
                allFeatures={config.features}
                mockData={mockData}
                setMockData={setMockData}
                previewPage={previewPage}
                setPreviewPage={setPreviewPage}
                onElementSelect={() => { }}
                onThemeUpdate={() => { }}
                isInspectorActive={false}
            />
        </div>
    );
}
