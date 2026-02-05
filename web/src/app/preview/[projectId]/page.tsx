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

import { Maximize, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StandalonePreviewPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [mockData, setMockData] = useState<any>({});
    const [previewPage, setPreviewPage] = useState('home');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPWA, setIsPWA] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        if (projectId) {
            loadProject();
        }

        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsPWA(!!isStandalone);

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [projectId]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                // If Fullscreen API fails (like on iOS Safari), show PWA instructions
                setShowInstructions(true);
            });
        } else {
            document.exitFullscreen();
        }
    };

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
        <div className="fixed inset-0 bg-slate-950 overflow-hidden select-none">
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

            {/* Fullscreen Tool for Mobile Browsers */}
            {!isPWA && !isFullscreen && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={toggleFullscreen}
                    className="fixed bottom-24 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white z-[9999] shadow-2xl"
                >
                    <Maximize size={20} />
                </motion.button>
            )}

            {/* PWA Instructions Overlay (Mainly for iOS) */}
            <AnimatePresence>
                {showInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowInstructions(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-end justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[32px] p-8 relative"
                        >
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                                    <Share className="text-white" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Esperienza Fullscreen</h2>
                                <p className="text-slate-400 text-sm mb-8">
                                    Per visualizzare l'app a tutto schermo su iPhone, tocca l'icona <span className="text-white font-bold inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700"><Share size={12} /> Condividi</span> e seleziona <span className="text-white font-bold">"Aggiungi a Home"</span>.
                                </p>
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest"
                                >
                                    Ho capito
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
