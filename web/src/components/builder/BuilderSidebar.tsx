import React, { useState } from 'react';
import { Activity, Shield, Palette, Layout, Settings, CreditCard, StickyNote, Mail } from 'lucide-react';
import { TeamConfig } from '@/constants/teams';
import { ThemeConfig, EditorSelection, FeatureFlags } from '@/types/builder';
import { IdentityTab } from './IdentityTab';
import { DesignTab } from './DesignTab';
import { FeaturesTab } from './FeaturesTab';
import { SportTab } from './SportTab';
import { SplashSettingsPanel } from './settings/SplashSettingsPanel';
import { LoginSettingsPanel } from './settings/LoginSettingsPanel'; // Import fixed
import { ViewMode } from '@/types/builder';
import { TierConfigPanel } from './monetization/TierConfigPanel';
import { SponsorConfigPanel } from './monetization/SponsorConfigPanel';
import { ShopConfigPanel } from './monetization/ShopConfigPanel';
import { BriefTab } from './BriefTab';
import { CommunicationTab } from './CommunicationTab';
import { ClubTab } from './ClubTab';
import { RolesTab } from './RolesTab';
import { Building2, Gavel } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BuilderSidebarProps {
    currentTeam: TeamConfig;
    onTeamChange: (teamId: string) => void;
    onTeamUpdate: (updates: Partial<TeamConfig>) => void;

    // Lovable Editor Props
    editorSelection: EditorSelection;
    onSelectionChange: (selection: EditorSelection) => void;
    themeConfig: ThemeConfig;
    onThemeUpdate: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;

    featureFlags: FeatureFlags;
    onFeatureToggle: (id: string) => void;
    onFeatureUpdate: (id: string, updates: Partial<FeatureFlags[keyof FeatureFlags]>) => void;
    viewMode: ViewMode; // New Prop
    projectId: string;
    userNotes: string;
    onNotesUpdate: (notes: string) => void;

    // Club/Team Multi-management
    teams: TeamConfig[];
    multiTeamMode: boolean;
    onToggleMultiTeam: (enabled: boolean) => void;
    onAddTeam: () => void;
    onRemoveTeam: (id: string) => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
    currentTeam,
    onTeamChange,
    onTeamUpdate,
    editorSelection,
    onSelectionChange,
    themeConfig,
    onThemeUpdate,
    featureFlags,
    onFeatureToggle,
    onFeatureUpdate,
    viewMode,
    projectId,
    userNotes,
    onNotesUpdate,
    teams,
    multiTeamMode,
    onToggleMultiTeam,
    onAddTeam,
    onRemoveTeam
}) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'THEME' | 'IDENTITY' | 'CLUB' | 'SPORT' | 'CONTENT' | 'FEATURES' | 'MONETIZATION' | 'BRIEF' | 'COMMUNICATION' | 'ROLES'>('THEME');
    const [monetizationSubTab, setMonetizationSubTab] = useState<'TIERS' | 'SPONSORS' | 'SHOP'>('TIERS');

    // Context-Aware Render: Splash
    if (viewMode === 'SPLASH') {
        return (
            <div className="w-[420px] flex flex-col border-r border-slate-800 bg-slate-900 z-30 shadow-2xl h-full">
                <div className="p-4 border-b border-slate-800 bg-slate-950">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Palette size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white tracking-tight leading-none">Splash Screen</h1>
                            <span className="text-[10px] text-slate-500 font-medium">Configuration</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <SplashSettingsPanel config={themeConfig} onUpdate={onThemeUpdate} />
                </div>
            </div>
        );
    }

    // Context-Aware Render: Login
    if (viewMode === 'LOGIN') {
        return (
            <div className="w-[420px] flex flex-col border-r border-slate-800 bg-slate-900 z-30 shadow-2xl h-full">
                <div className="p-4 border-b border-slate-800 bg-slate-950">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center">
                            <Shield size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white tracking-tight leading-none">Login Screen</h1>
                            <span className="text-[10px] text-slate-500 font-medium">Authentication UI</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <LoginSettingsPanel config={themeConfig} onUpdate={onThemeUpdate} />
                </div>
            </div>
        );
    }

    return (
        <div className="w-[420px] flex flex-col border-r border-slate-800 bg-slate-900 z-30 shadow-2xl h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-600 flex items-center justify-center">
                        <Shield size={16} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-tight leading-none">4Gears</h1>
                        <span className="text-[10px] text-slate-500 font-medium">Visual Editor</span>
                    </div>
                </div>

                {/* Editor Tabs */}
                <div className="flex p-1 bg-slate-800/50 rounded-lg overflow-x-auto hide-scrollbar gap-0.5">
                    <button
                        onClick={() => setActiveTab('THEME')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'THEME' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Palette size={14} />
                        {t('tabs.design')}
                    </button>
                    <button
                        onClick={() => setActiveTab('IDENTITY')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'IDENTITY' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Settings size={14} />
                        {t('tabs.brand')}
                    </button>
                    <button
                        onClick={() => setActiveTab('CLUB')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'CLUB' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Building2 size={14} />
                        {t('tabs.club')}
                    </button>
                    <button
                        onClick={() => setActiveTab('SPORT')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'SPORT' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Activity size={14} />
                        {t('tabs.sport')}
                    </button>
                    <button
                        onClick={() => setActiveTab('COMMUNICATION')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'COMMUNICATION' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Mail size={14} />
                        COMMS
                    </button>
                    <button
                        onClick={() => setActiveTab('CONTENT')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'CONTENT' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Layout size={14} />
                        FEATURES
                    </button>
                    <button
                        onClick={() => setActiveTab('MONETIZATION')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'MONETIZATION' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <CreditCard size={14} />
                        PLANS
                    </button>
                    <button
                        onClick={() => setActiveTab('ROLES')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'ROLES' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Gavel size={14} />
                        ROLES
                    </button>
                    <button
                        onClick={() => setActiveTab('BRIEF')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'BRIEF' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <StickyNote size={14} />
                        BRIEF
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">



                {activeTab === 'THEME' && (
                    <DesignTab
                        config={themeConfig}
                        onUpdate={onThemeUpdate}
                        featureFlags={featureFlags}
                    />
                )}

                {activeTab === 'IDENTITY' && (
                    <IdentityTab
                        currentTeam={currentTeam}
                        onTeamChange={onTeamChange}
                        onUpdate={onTeamUpdate}
                        themeConfig={themeConfig}
                        onThemeUpdate={onThemeUpdate}
                    />
                )}

                {activeTab === 'CLUB' && (
                    <ClubTab
                        teams={teams}
                        currentTeamId={currentTeam.id}
                        onTeamChange={onTeamChange}
                        onAddTeam={onAddTeam}
                        onRemoveTeam={onRemoveTeam}
                        multiTeamMode={multiTeamMode}
                        onToggleMultiTeam={onToggleMultiTeam}
                    />
                )}

                {activeTab === 'SPORT' && (
                    <SportTab
                        config={currentTeam}
                        onUpdate={onTeamUpdate}
                    />
                )}

                {activeTab === 'COMMUNICATION' && (
                    <CommunicationTab
                        config={currentTeam}
                        onUpdate={onTeamUpdate}
                    />
                )}

                {activeTab === 'CONTENT' && (
                    <FeaturesTab
                        flags={featureFlags}
                        onToggle={onFeatureToggle}
                        onUpdate={onFeatureUpdate}
                    />
                )}

                {activeTab === 'ROLES' && (
                    <RolesTab
                        onUpdate={(updates) => {
                            console.log('Roles update:', updates);
                            // This would update project config
                        }}
                    />
                )}

                {activeTab === 'MONETIZATION' && (
                    <div className="space-y-6">
                        <div className="flex p-1 bg-slate-800/50 rounded-lg">
                            <button
                                onClick={() => setMonetizationSubTab('TIERS')}
                                className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${monetizationSubTab === 'TIERS' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Piani Abbonamento
                            </button>
                            <button
                                onClick={() => setMonetizationSubTab('SPONSORS')}
                                className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${monetizationSubTab === 'SPONSORS' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Sponsor & Partner
                            </button>
                            <button
                                onClick={() => setMonetizationSubTab('SHOP')}
                                className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${monetizationSubTab === 'SHOP' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Store
                            </button>
                        </div>

                        {monetizationSubTab === 'TIERS' && projectId && (
                            <TierConfigPanel projectId={projectId} />
                        )}

                        {monetizationSubTab === 'SPONSORS' && (
                            <SponsorConfigPanel
                                config={themeConfig}
                                onUpdate={onThemeUpdate}
                            />
                        )}

                        {monetizationSubTab === 'SHOP' && (
                            <ShopConfigPanel
                                config={themeConfig}
                                onUpdate={onThemeUpdate}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'BRIEF' && (
                    <BriefTab
                        notes={userNotes}
                        onUpdate={onNotesUpdate}
                    />
                )}
            </div>
        </div>
    );
};
