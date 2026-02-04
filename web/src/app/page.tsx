"use client";

import React, { useState, useEffect } from "react";
import { AppTier, UserPersona, ViewMode, NotchStyle, ThemeConfig, EditorSelection, DeviceType, FeatureFlags, FeatureFlag } from "@/types/builder";
import { ComponentMetadata } from "@/types/inspector";
import { DEFAULT_TEAMS, TeamConfig } from "@/constants/teams";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { TopBar } from "@/components/builder/TopBar";
import { PreviewPane } from "@/components/preview/PreviewPane";
import {
  SPORT_CONFIG,
  generateEvents,
  generatePlayers,
  generateStaff,
  generateChants,
  generateSponsors,
  generateHistory,
  generateNotifications,
  generateConversations
} from "@/constants/sports";
import { Download, Save } from "lucide-react";

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [teams, setTeams] = useState<TeamConfig[]>(DEFAULT_TEAMS);
  const [currentTeamId, setCurrentTeamId] = useState<string>(teams[0].id);
  const currentTeam = teams.find(t => t.id === currentTeamId) || teams[0];

  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [previewPage, setPreviewPage] = useState('home');

  // App Configuration State
  const [appTier, setAppTier] = useState<AppTier>('FREE');
  const [userPersona, setUserPersona] = useState<UserPersona>('FAN');
  const [viewMode, setViewMode] = useState<ViewMode>('USER');
  const [notchStyle, setNotchStyle] = useState<NotchStyle>('STANDARD');
  const [deviceType, setDeviceType] = useState<DeviceType>('IPHONE');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dynamic Data State
  const [activeChat, setActiveChat] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Editor State (Lovable Style)
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [editorSelection, setEditorSelection] = useState<EditorSelection>({ type: 'global', id: null });

  const handleElementSelect = (metadata: ComponentMetadata) => {
    setEditorSelection({ type: 'component', id: metadata.id });
  };

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
      { id: 'staff', label: 'Staff', icon: 'Info', enabled: false, order: 5 },
      { id: 'history', label: 'Storia', icon: 'BookOpen', enabled: false, order: 6 },
      { id: 'chants', label: 'Cori', icon: 'Music', enabled: false, order: 7 },
      { id: 'sponsors', label: 'Sponsor', icon: 'Award', enabled: false, order: 8 },
      { id: 'tactics', label: 'Tactics', icon: 'Shield', enabled: false, order: 9 },
      { id: 'video', label: 'Video', icon: 'Video', enabled: false, order: 10 },
    ],
    componentOverrides: {}
  });

  // --- HISTORY SYSTEM ---
  const [history, setHistory] = useState<ThemeConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const setThemeConfig = (newConfig: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => {
    const resolvedConfig = typeof newConfig === 'function' ? newConfig(themeConfig) : newConfig;

    // Only push to history if it's a real change (not initialization)
    setHistory(prev => {
      const nextHistory = prev.slice(0, historyIndex + 1);
      return [...nextHistory, resolvedConfig].slice(-20); // Keep last 20 changes
    });
    setHistoryIndex(prev => prev + 1);
    setThemeConfigState(resolvedConfig);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevConfig = history[historyIndex - 1];
      setThemeConfigState(prevConfig);
      setHistoryIndex(prev => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextConfig = history[historyIndex + 1];
      setThemeConfigState(nextConfig);
      setHistoryIndex(prev => prev + 1);
    }
  };

  // Initial history push
  useEffect(() => {
    if (history.length === 0) {
      setHistory([themeConfig]);
      setHistoryIndex(0);
    }
  }, []);

  // MOCK DATA GENERATION
  const [mockPlayers, setMockPlayers] = useState<any[]>([]);
  const [mockEvents, setMockEvents] = useState<any[]>([]);
  const [mockStaff] = useState<any[]>(generateStaff());
  const [mockChants] = useState<any[]>(generateChants());
  const [mockSponsors] = useState<any[]>(generateSponsors());
  const [mockHistory] = useState<any>(generateHistory());
  const [mockNotifications, setMockNotifications] = useState<any[]>([]);
  const [mockConversations, setMockConversations] = useState<any[]>([]);

  useEffect(() => {
    // Regenerate data when sport changes
    setMockPlayers(generatePlayers(currentTeam.sportType));
    setMockEvents(generateEvents(currentTeam.sportType));
    setMockNotifications(generateNotifications(currentTeam.sportType));
    setMockConversations(generateConversations(currentTeam.sportType));
  }, [currentTeam.sportType]);


  // Feature Flags State
  // Feature Flags State
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

  // --- ACCESS CONTROL LOGIC ---
  const canAccess = (featureId: string) => {
    // 2. App-Level Feature Flag check (Overrides Persona)
    const flag = featureFlags[featureId as keyof FeatureFlags];
    if (flag && !flag.enabled) return false;

    // Admin passes everything locally for preview? Or strict simulation?
    // Let's do strict simulation based on current settings
    const tiers = ['FREE', 'PREMIUM', 'ELITE'];
    const currentTierIdx = tiers.indexOf(appTier);
    const requiredTierIdx = tiers.indexOf(flag.minTier);

    if (currentTierIdx < requiredTierIdx) return false;

    // Persona checks
    if (flag.availableTo && !flag.availableTo.includes(userPersona)) return false;
    if (userPersona === 'PLAYER' && ['admin'].includes(featureId)) return false;

    return true;
  };

  // --- HANDLERS ---
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

  const handleFeatureUpdate = (flagId: string, updates: Partial<FeatureFlag>) => {
    setFeatureFlags((prev: FeatureFlags) => {
      const flag = prev[flagId as keyof FeatureFlags];
      return {
        ...prev,
        [flagId]: { ...flag, ...updates }
      };
    });
  };

  // --- EXPORT CONFIG ---
  const handleExport = () => {
    const config = {
      team: currentTeam,
      theme: themeConfig,
      features: featureFlags,
      simulator: { appTier, userPersona, viewMode, notchStyle, deviceType, isDarkMode }
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `4gears-config-${currentTeam.slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Computed props for child components
  const activeFeatures = Object.fromEntries(
    Object.entries(featureFlags).map(([k, v]) => [k, canAccess(k)])
  ) as any;

  return (
    <main className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* --- TOP BAR (Simulation Controls) --- */}
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
          onExport={handleExport}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* --- BUILDER SIDEBAR --- */}
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

          {/* --- MAIN CONTENT AREA --- */}
          <div className="flex-1 flex overflow-hidden">
            {/* CENTER: PREVIEW */}
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
                  onUndo={undo}
                  onRedo={redo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
