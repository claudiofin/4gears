'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types/database';
import { useProjectSave } from '@/hooks/useProjectSave';
import { AppTier, UserPersona, ViewMode, NotchStyle, DeviceType, FeatureFlags, ThemeConfig, EditorSelection } from '@/types/builder';
import { DEFAULT_TEAMS, TeamConfig } from '@/constants/teams';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';
import { TopBar } from '@/components/builder/TopBar';
import { PreviewPane } from '@/components/preview/PreviewPane';
import { ComponentMetadata } from '@/types/inspector';
import SubmissionModal from '@/components/builder/SubmissionModal';
import {
    generateEvents,
    generatePlayers,
    generateStaff,
    generateChants,
    generateSponsors,
    generateHistory,
    generateNotifications,
    generateConversations
} from '@/constants/sports';
import { ArrowLeft, Save, Send, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuilderPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const projectId = params.projectId as string;

    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [error, setError] = useState('');
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);

    // Builder State
    const [teams, setTeams] = useState<TeamConfig[]>(DEFAULT_TEAMS);
    const [currentTeamId, setCurrentTeamId] = useState<string>(teams[0].id);
    const currentTeam = teams.find(t => t.id === currentTeamId) || teams[0];

    const [activeTab, setActiveTab] = useState('home');
    const [previewPage, setPreviewPage] = useState('home');
    const [appTier, setAppTier] = useState<AppTier>('FREE');
    const [userPersona, setUserPersona] = useState<UserPersona>('FAN');
    const [viewMode, setViewMode] = useState<ViewMode>('USER');
    const [notchStyle, setNotchStyle] = useState<NotchStyle>('STANDARD');
    const [deviceType, setDeviceType] = useState<DeviceType>('IPHONE');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [activeChat, setActiveChat] = useState<any>(null);
    const [cart, setCart] = useState<any[]>([]);
    const [isInspectorActive, setIsInspectorActive] = useState(false);
    const [editorSelection, setEditorSelection] = useState<EditorSelection>({ type: 'global', id: null });

    const [themeConfig, setThemeConfigState] = useState<ThemeConfig>({
        fontFamily: 'Inter',
        borderRadius: '8px',
        supportLightMode: true,
        supportDarkMode: true,
        buttonStyle: 'flat',
        cardStyle: 'minimal',
        spacingLevel: 'comfortable',
        iconStyle: 'outline',
        navStyle: 'classic',
        burgerMenuStyling: {
            style: 'sidebar',
            animation: 'slide',
            backgroundColor: '#0f172a',
            accentColor: '#6366f1',
            textColor: '#ffffff'
        },
        navigation: [
            { id: 'home', label: 'Home', icon: 'Layout', enabled: true, order: 0 },
            { id: 'events', label: 'Events', icon: 'Calendar', enabled: true, order: 1 },
            { id: 'roster', label: 'Roster', icon: 'Users', enabled: true, order: 2 },
            { id: 'shop', label: 'Shop', icon: 'ShoppingBag', enabled: true, order: 3 },
            { id: 'menu', label: 'Menu', icon: 'Menu', enabled: true, order: 4 },
        ],
        componentOverrides: {}
    });

    const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
        news: { id: 'news', label: 'News Feed', enabled: true, minTier: 'FREE', availableTo: ['FAN', 'PLAYER', 'COACH', 'ADMIN'] },
        tactics: { id: 'tactics', label: 'Lavagna Tattica', enabled: true, minTier: 'PREMIUM', availableTo: ['COACH', 'PLAYER', 'ADMIN'] },
        video: { id: 'video', label: 'Video Analisi', enabled: true, minTier: 'FREE', availableTo: ['COACH', 'PLAYER', 'ADMIN'] },
        shop: { id: 'shop', label: 'Merchandising', enabled: true, minTier: 'PREMIUM', availableTo: ['FAN', 'PLAYER', 'COACH', 'ADMIN'] },
        events: { id: 'events', label: 'Gestione Eventi', enabled: true, minTier: 'FREE', availableTo: ['FAN', 'PLAYER', 'COACH', 'ADMIN'] },
        chat: { id: 'chat', label: 'Team Chat', enabled: true, minTier: 'PREMIUM', availableTo: ['PLAYER', 'COACH', 'ADMIN'] },
        lineup: { id: 'lineup', label: 'Formazioni', enabled: true, minTier: 'FREE', availableTo: ['FAN', 'PLAYER', 'COACH', 'ADMIN'] },
        sponsors: { id: 'sponsors', label: 'Sponsor & Partner', enabled: true, minTier: 'FREE', availableTo: ['FAN', 'PLAYER', 'COACH', 'ADMIN'] },
        chants: { id: 'chants', label: 'Cori & Tifoseria', enabled: true, minTier: 'FREE', availableTo: ['FAN', 'PLAYER'] },
        staff: { id: 'staff', label: 'Staff Tecnico', enabled: true, minTier: 'FREE', availableTo: ['FAN', 'PLAYER', 'COACH', 'ADMIN'] },
    });

    // Mock data
    const [mockPlayers, setMockPlayers] = useState<any[]>([]);
    const [mockEvents, setMockEvents] = useState<any[]>([]);
    const [mockStaff] = useState<any[]>(generateStaff());
    const [mockChants] = useState<any[]>(generateChants());
    const [mockSponsors] = useState<any[]>(generateSponsors());
    const [mockHistory] = useState<any>(generateHistory());
    const [mockNotifications, setMockNotifications] = useState<any[]>([]);
    const [mockConversations, setMockConversations] = useState<any[]>([]);

    // Build current config for saving
    const currentConfig = {
        team: currentTeam,
        theme: themeConfig,
        features: featureFlags,
        simulator: { appTier, userPersona, viewMode, notchStyle, deviceType, isDarkMode }
    };

    // Use save hook
    const { saving, lastSaved, error: saveError, manualSave } = useProjectSave({
        projectId,
        config: currentConfig
    });

    // Load project
    useEffect(() => {
        if (projectId && projectId !== 'new') {
            loadProject();
        } else {
            setLoading(false);
        }
    }, [projectId]);

    // Regenerate mock data when sport changes
    useEffect(() => {
        setMockPlayers(generatePlayers(currentTeam.sportType));
        setMockEvents(generateEvents(currentTeam.sportType));
        setMockNotifications(generateNotifications(currentTeam.sportType));
        setMockConversations(generateConversations(currentTeam.sportType));
    }, [currentTeam.sportType]);

    const loadProject = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .eq('user_id', user?.id)
                .single();

            if (error) throw error;

            setProject(data);

            // Load config
            if (data.config) {
                if (data.config.team) {
                    setTeams([data.config.team]);
                    setCurrentTeamId(data.config.team.id);
                }
                if (data.config.theme) setThemeConfigState(data.config.theme);
                if (data.config.features) setFeatureFlags(data.config.features);
                if (data.config.simulator) {
                    const sim = data.config.simulator;
                    if (sim.appTier) setAppTier(sim.appTier);
                    if (sim.userPersona) setUserPersona(sim.userPersona);
                    if (sim.viewMode) setViewMode(sim.viewMode);
                    if (sim.notchStyle) setNotchStyle(sim.notchStyle);
                    if (sim.deviceType) setDeviceType(sim.deviceType);
                    if (sim.isDarkMode !== undefined) setIsDarkMode(sim.isDarkMode);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Errore nel caricamento del progetto');
        } finally {
            setLoading(false);
        }
    };

    const handleTeamUpdate = (updates: Partial<TeamConfig>) => {
        setTeams(prevTeams => prevTeams.map(t =>
            t.id === currentTeamId ? { ...t, ...updates } : t
        ));
    };

    const handleFeatureToggle = (flagId: string) => {
        setFeatureFlags((prev: FeatureFlags) => {
            const flag = prev[flagId as keyof FeatureFlags];
            return {
                ...prev,
                [flagId]: { ...flag, enabled: !flag.enabled }
            };
        });
    };

    const handleFeatureUpdate = (flagId: string, updates: any) => {
        setFeatureFlags((prev: FeatureFlags) => {
            const flag = prev[flagId as keyof FeatureFlags];
            return {
                ...prev,
                [flagId]: { ...flag, ...updates }
            };
        });
    };

    const handleElementSelect = (metadata: ComponentMetadata) => {
        setEditorSelection({ type: 'component', id: metadata.id });
    };

    const setThemeConfig = (newConfig: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => {
        const resolvedConfig = typeof newConfig === 'function' ? newConfig(themeConfig) : newConfig;
        setThemeConfigState(resolvedConfig);
    };

    const canAccess = (featureId: string) => {
        const flag = featureFlags[featureId as keyof FeatureFlags];
        if (flag && !flag.enabled) return false;

        const tiers = ['FREE', 'PREMIUM', 'ELITE'];
        const currentTierIdx = tiers.indexOf(appTier);
        const requiredTierIdx = tiers.indexOf(flag.minTier);

        if (currentTierIdx < requiredTierIdx) return false;
        if (flag.availableTo && !flag.availableTo.includes(userPersona)) return false;

        return true;
    };

    const activeFeatures = Object.fromEntries(
        Object.entries(featureFlags).map(([k, v]) => [k, canAccess(k)])
    ) as any;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Caricamento progetto...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-3xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Errore</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                    >
                        Torna alla Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                {/* Custom Top Bar with Save Status */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Dashboard
                        </button>
                        <div className="h-6 w-px bg-slate-800"></div>
                        <h1 className="text-lg font-semibold text-white">{project?.name || 'Nuovo Progetto'}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Save Status */}
                        <AnimatePresence mode="wait">
                            {saving ? (
                                <motion.div
                                    key="saving"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-sm text-slate-400"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Salvataggio...
                                </motion.div>
                            ) : lastSaved ? (
                                <motion.div
                                    key="saved"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-sm text-green-400"
                                >
                                    <Check className="w-4 h-4" />
                                    Salvato {lastSaved.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        {saveError && (
                            <div className="text-sm text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Errore salvataggio
                            </div>
                        )}

                        <button
                            onClick={manualSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Salva
                        </button>

                        <button
                            onClick={() => setShowSubmissionModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            Invia per Creazione
                        </button>
                    </div>
                </div>

                {/* Original TopBar for simulator controls */}
                <TopBar
                    userPersona={userPersona}
                    onPersonaChange={setUserPersona}
                    appTier={appTier}
                    onTierChange={setAppTier}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    notchStyle={notchStyle}
                    onNotchStyleChange={setNotchStyle}
                    deviceType={deviceType}
                    onDeviceChange={setDeviceType}
                    isDarkMode={isDarkMode}
                    onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
                    onExport={() => { }}
                />

                <div className="flex flex-1 overflow-hidden">
                    <BuilderSidebar
                        currentTeam={currentTeam}
                        onTeamChange={setCurrentTeamId}
                        onTeamUpdate={handleTeamUpdate}
                        editorSelection={editorSelection}
                        onSelectionChange={setEditorSelection}
                        themeConfig={themeConfig}
                        onThemeUpdate={setThemeConfig}
                        featureFlags={featureFlags}
                        onFeatureToggle={handleFeatureToggle}
                        onFeatureUpdate={handleFeatureUpdate}
                    />

                    <div className="flex-1 flex overflow-hidden">
                        <div className="flex-1 relative flex flex-col bg-slate-900/50 backdrop-blur-sm">
                            <div className="flex h-full w-full">
                                <PreviewPane
                                    currentTeam={currentTeam}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    previewPage={previewPage}
                                    setPreviewPage={setPreviewPage}
                                    appTier={appTier}
                                    userPersona={userPersona}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                    notchStyle={notchStyle}
                                    deviceType={deviceType}
                                    isDarkMode={isDarkMode}
                                    activeFeatures={activeFeatures}
                                    allFeatures={featureFlags}
                                    mockData={{
                                        players: mockPlayers,
                                        events: mockEvents,
                                        staff: mockStaff,
                                        chants: mockChants,
                                        sponsors: mockSponsors,
                                        history: mockHistory,
                                        notifications: mockNotifications,
                                        conversations: mockConversations,
                                        activeChat,
                                        cart,
                                    }}
                                    setMockData={{
                                        setActiveChat,
                                        setCart,
                                    }}
                                    themeConfig={themeConfig}
                                    isInspectorActive={isInspectorActive}
                                    activeSelectionId={editorSelection.id}
                                    onElementSelect={handleElementSelect}
                                    onThemeUpdate={(updates) => setThemeConfig(prev => ({ ...prev, ...updates }))}
                                    onInspectorToggle={() => setIsInspectorActive(!isInspectorActive)}
                                    onInspectorClose={() => {
                                        setIsInspectorActive(false);
                                        setEditorSelection({ type: 'global', id: null });
                                    }}
                                    onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
                                    onUndo={() => { }}
                                    onRedo={() => { }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Modal */}
            <SubmissionModal
                isOpen={showSubmissionModal}
                onClose={() => setShowSubmissionModal(false)}
                projectId={projectId}
                projectName={project?.name || 'Progetto'}
                config={currentConfig}
            />
        </main>
    );
}
