import React, { useState } from 'react';
import { Activity, Shield, Palette, Layout, Settings } from 'lucide-react';
import { TeamConfig } from '@/constants/teams';
import { ThemeConfig, EditorSelection, FeatureFlags } from '@/types/builder';
import { IdentityTab } from './IdentityTab';
import { DesignTab } from './DesignTab';
import { FeaturesTab } from './FeaturesTab';
import { SportTab } from './SportTab';
import { SplashSettingsPanel } from './settings/SplashSettingsPanel';
import { LoginSettingsPanel } from './settings/LoginSettingsPanel'; // Import fixed
import { ViewMode } from '@/types/builder';

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
    viewMode?: ViewMode; // New Prop
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
    viewMode = 'USER'
}) => {
    const [activeTab, setActiveTab] = useState<'IDENTITY' | 'THEME' | 'CONTENT' | 'SPORT'>('THEME');

    // Context-Aware Render: Splash
    if (viewMode === 'SPLASH') {
        return (
            <div className="w-[360px] flex flex-col border-r border-slate-800 bg-slate-900 z-30 shadow-2xl h-full">
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
            <div className="w-[360px] flex flex-col border-r border-slate-800 bg-slate-900 z-30 shadow-2xl h-full">
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
        <div className="w-[360px] flex flex-col border-r border-slate-800 bg-slate-900 z-30 shadow-2xl h-full">
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
                <div className="flex p-1 bg-slate-800/50 rounded-lg">
                    <button
                        onClick={() => setActiveTab('THEME')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'THEME' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Palette size={14} />
                        DESIGN
                    </button>
                    <button
                        onClick={() => setActiveTab('IDENTITY')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'IDENTITY' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Settings size={14} />
                        BRAND
                    </button>
                    <button
                        onClick={() => setActiveTab('SPORT')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'SPORT' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Activity size={14} />
                        SPORT
                    </button>
                    <button
                        onClick={() => setActiveTab('CONTENT')}
                        className={`flex-1 py-2 rounded-md text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${activeTab === 'CONTENT' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Layout size={14} />
                        FEATURES
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
                    />
                )}

                {activeTab === 'SPORT' && (
                    <SportTab
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

            </div>
        </div>
    );
};
