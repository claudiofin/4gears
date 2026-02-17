import React, { useState, useEffect } from 'react';
import { DeviceType, NotchStyle, ViewMode, ThemeConfig, FeatureFlags } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { SPORT_CONFIG } from '@/constants/sports';
import { ComponentMetadata } from '@/types/inspector';
import { FloatingInspectorPanel } from '../builder/FloatingInspectorPanel';
import { VisualInspector } from '../builder/VisualInspector';
import { SimulatorLayout } from './simulator/SimulatorLayout';
import { SimulatorHeader } from './simulator/SimulatorHeader';
import { SimulatorScreens } from './simulator/SimulatorScreens';
import { SimulatorBottomNav } from './simulator/SimulatorBottomNav';
import {
    BurgerMenuOverlay,
    ChatOverlay,
    NotificationsOverlay,
    FloatingCartButton,
    LockedFeatureOverlay
} from './simulator/SimulatorOverlays';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';
import { MarketingStudioPanel } from '../builder/MarketingStudioPanel';
import { FEATURE_LIMITS } from '@/lib/tierSystem';
import { ScenarioControl } from './simulator/ScenarioControl';

interface PreviewPaneProps {
    deviceType: DeviceType;
    notchStyle: NotchStyle;
    isDarkMode: boolean;
    viewMode: ViewMode;
    themeConfig: ThemeConfig;
    currentTeam: TeamConfig;
    isStandalone?: boolean;
    activeSelectionId?: string | null | undefined;
    onElementSelect: (metadata: ComponentMetadata) => void;
    onThemeUpdate: (updates: Partial<ThemeConfig>) => void;
    isInspectorActive: boolean;
    onInspectorClose?: () => void;
    onInspectorToggle?: () => void;
    activeFeatures: Record<string, boolean>;
    allFeatures: FeatureFlags;
    mockData: any;
    setMockData: any;
    previewPage: string;
    setPreviewPage: (page: string) => void;
    userPersona?: 'ADMIN' | 'PLAYER' | 'FAN' | 'COACH';
    multiTeamMode?: boolean;
    marketingMode?: boolean;
    marketingQuote?: string;
    marketingBg?: string;
    marketingTemplate?: '3d' | 'front';
    onMarketingUpdate?: (updates: any) => void;
    [key: string]: any;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
    isStandalone = false,
    deviceType,
    notchStyle,
    isDarkMode,
    viewMode,
    themeConfig,
    currentTeam,
    activeSelectionId,
    onElementSelect,
    onThemeUpdate,
    isInspectorActive,
    onInspectorClose,
    onInspectorToggle,
    activeFeatures,
    allFeatures,
    mockData,
    setMockData,
    previewPage,
    setPreviewPage,
    userPersona,
    marketingMode,
    marketingQuote,
    marketingBg,
    marketingTemplate,
    onMarketingUpdate,
    multiTeamMode
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [headerHeight, setHeaderHeight] = useState<number | undefined>(undefined);
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [selectedMetadata, setSelectedMetadata] = useState<ComponentMetadata | null>(null);
    const [lockedFeature, setLockedFeature] = useState<{ id: string; name: string; tier: 'PREMIUM' | 'ELITE' } | null>(null);
    const [currentScenario, setCurrentScenario] = useState<'DEFAULT' | 'LIVE_MATCH' | 'EVENT'>('DEFAULT');

    const { getOverride } = useSimulatorStyles(themeConfig, isDarkMode);
    const sportConfig = SPORT_CONFIG[currentTeam.sportType] || SPORT_CONFIG['Calcio'];

    useEffect(() => {
        setIsScrolled(false);
    }, [previewPage]);

    const handleElementClick = (metadata: ComponentMetadata) => {
        setSelectedMetadata(metadata);
        onElementSelect(metadata);
    };

    const handleInspectorUpdate = (id: string, key: string, value: any) => {
        if (key === 'RESET') {
            const newOverrides = { ...themeConfig.componentOverrides };
            delete newOverrides[id];
            onThemeUpdate({ componentOverrides: newOverrides });
            if (selectedMetadata && selectedMetadata.id === id) {
                const refreshedProps = selectedMetadata.editableProps.map(prop => ({ ...prop, value: '' }));
                setSelectedMetadata({ ...selectedMetadata, editableProps: refreshedProps });
            }
        } else {
            onThemeUpdate({
                componentOverrides: {
                    ...themeConfig.componentOverrides,
                    [id]: { ...themeConfig.componentOverrides[id], [key]: value }
                }
            });
            if (selectedMetadata && selectedMetadata.id === id) {
                const refreshedProps = selectedMetadata.editableProps.map(prop =>
                    prop.key === key ? { ...prop, value } : prop
                );
                setSelectedMetadata({ ...selectedMetadata, editableProps: refreshedProps });
            }
        }
    };

    const handleLockedAction = (featureId: string, featureName: string) => {
        const requirement = FEATURE_LIMITS[featureId];
        if (requirement) {
            setLockedFeature({
                id: featureId,
                name: featureName,
                tier: requirement.minTier as 'PREMIUM' | 'ELITE'
            });
        }
    };


    const rolePreviewMap = {
        'ADMIN': 'admin',
        'PLAYER': 'athlete',
        'COACH': 'coach',
        'FAN': 'fan'
    } as const;

    const currentRolePreview = userPersona ? rolePreviewMap[userPersona] : null;

    return (
        <div className={`relative w-full h-full ${isStandalone ? 'bg-black' : 'bg-[#020617]'} overflow-hidden transition-colors duration-300 flex items-center justify-center`}>
            <div className={`relative flex items-center justify-center ${isStandalone ? 'p-0 w-full h-full' : 'p-4'}`}>
                <SimulatorLayout
                    isStandalone={isStandalone}
                    deviceType={deviceType}
                    notchStyle={notchStyle}
                    isDarkMode={isDarkMode}
                    themeConfig={themeConfig}
                    currentTeam={currentTeam}
                    onScrollChange={setIsScrolled}
                    marketingMode={marketingMode}
                    marketingQuote={marketingQuote}
                    marketingBg={marketingBg}
                    marketingTemplate={marketingTemplate}
                    rolePreview={currentRolePreview as any}
                    inspector={
                        <div className="flex items-center gap-4">
                            {onInspectorToggle && (
                                <VisualInspector
                                    isActive={isInspectorActive}
                                    onToggle={onInspectorToggle}
                                    activeSelectionId={activeSelectionId ?? null}
                                />
                            )}
                            <ScenarioControl current={currentScenario} onChange={setCurrentScenario} />
                        </div>
                    }
                    header={
                        previewPage !== 'splash' && previewPage !== 'login' && (
                            <SimulatorHeader
                                themeConfig={themeConfig}
                                currentTeam={currentTeam}
                                sportConfig={sportConfig}
                                isScrolled={isScrolled}
                                isDarkMode={isDarkMode}
                                isInspectorActive={isInspectorActive}
                                activeSelectionId={activeSelectionId}
                                onSelect={handleElementClick}
                                getOverride={getOverride}
                                featureFlags={allFeatures}
                                activeFeatures={activeFeatures}
                                onHeightChange={setHeaderHeight}
                                onBurgerClick={() => setShowBurgerMenu(true)}
                                onChatClick={() => setIsChatOpen(true)}
                                onNotificationsClick={() => setIsNotificationsOpen(true)}
                                onBackClick={() => setPreviewPage('home')}
                                canGoBack={previewPage !== 'home' && themeConfig.navigationType === 'header_tabs'}
                                pageTitle={previewPage === 'home' ? 'Home' : (previewPage || '').charAt(0).toUpperCase() + (previewPage || '').slice(1)}
                                viewMode={viewMode}
                                previewPage={previewPage}
                                setPreviewPage={setPreviewPage}
                                isStandalone={isStandalone}
                            />
                        )
                    }
                    bottomNav={
                        previewPage !== 'splash' && previewPage !== 'login' && (themeConfig.navigationType === 'tabbar' || !themeConfig.navigationType) && (
                            <SimulatorBottomNav
                                themeConfig={themeConfig}
                                currentTeam={currentTeam}
                                previewPage={previewPage}
                                setPreviewPage={setPreviewPage}
                                isDarkMode={isDarkMode}
                                viewMode={viewMode}
                                isInspectorActive={isInspectorActive}
                                activeSelectionId={activeSelectionId}
                                onSelect={handleElementClick}
                                isStandalone={isStandalone}
                                rolePreview={currentRolePreview as any}
                            />
                        )
                    }
                    overlays={
                        <>
                            <BurgerMenuOverlay
                                isOpen={showBurgerMenu}
                                onClose={() => setShowBurgerMenu(false)}
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                                currentTeam={currentTeam}
                                previewPage={previewPage}
                                setPreviewPage={setPreviewPage}
                                isInspectorActive={isInspectorActive}
                                activeSelectionId={activeSelectionId}
                                onSelect={handleElementClick}
                            />
                            <NotificationsOverlay
                                isOpen={isNotificationsOpen}
                                onClose={() => setIsNotificationsOpen(false)}
                                notifications={mockData.notifications || []}
                                isDarkMode={isDarkMode}
                            />
                            <ChatOverlay
                                isOpen={isChatOpen}
                                onClose={() => setIsChatOpen(false)}
                                conversations={mockData.conversations || []}
                                activeConversationId={activeConversationId}
                                setActiveConversationId={setActiveConversationId}
                                isDarkMode={isDarkMode}
                            />
                            <FloatingCartButton
                                isVisible={previewPage === 'shop'}
                                count={mockData.cart?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0}
                                onClick={() => { }}
                                currentTeam={currentTeam}
                            />
                            <LockedFeatureOverlay
                                isOpen={!!lockedFeature}
                                onClose={() => setLockedFeature(null)}
                                tierRequired={lockedFeature?.tier || 'PREMIUM'}
                                featureName={lockedFeature?.name || ''}
                                isDarkMode={isDarkMode}
                            />
                        </>
                    }
                >
                    <SimulatorScreens
                        previewPage={previewPage}
                        setPreviewPage={setPreviewPage}
                        viewMode={viewMode}
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        currentTeam={currentTeam}
                        activeFeatures={activeFeatures}
                        featureFlags={allFeatures}
                        mockData={mockData}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId ?? null}
                        onSelect={handleElementClick}
                        sportConfig={sportConfig}
                        setMockData={setMockData}
                        headerHeight={headerHeight}
                        deviceType={deviceType}
                        multiTeamMode={multiTeamMode}
                        onLockedAction={handleLockedAction}
                        rolePreview={currentRolePreview as any}
                        currentScenario={currentScenario}
                    />
                </SimulatorLayout>
            </div>

            <div className={`absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-300 w-[320px] h-[min(812px,90%)] bg-slate-950/95 border border-slate-800 shadow-2xl z-[100] flex flex-col rounded-[32px] overflow-hidden backdrop-blur-xl ${isInspectorActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <FloatingInspectorPanel
                    metadata={selectedMetadata}
                    config={themeConfig}
                    onUpdate={handleInspectorUpdate}
                    onClose={onInspectorClose || (() => { })}
                />
            </div>

            <MarketingStudioPanel
                isOpen={!!marketingMode}
                onClose={() => onMarketingUpdate?.({ mode: false })}
                quote={marketingQuote || ''}
                bg={marketingBg || ''}
                template={marketingTemplate || '3d'}
                currentTeam={currentTeam}
                onUpdate={onMarketingUpdate || (() => { })}
            />
        </div>
    );
};
