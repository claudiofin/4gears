import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

import { DeviceType, NotchStyle, ViewMode, ThemeConfig, FeatureFlags } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { SPORT_CONFIG } from '@/constants/sports'; // Import SPORT_CONFIG
import { ComponentMetadata, EditableProperty } from '@/types/inspector';
import { FloatingInspectorPanel } from '../builder/FloatingInspectorPanel';
import { VisualInspector } from '../builder/VisualInspector';
import { SimulatorLayout } from './simulator/SimulatorLayout';
import { SimulatorHeader } from './simulator/SimulatorHeader';
import { SimulatorHero } from './simulator/SimulatorHero';
import { SimulatorScreens } from './simulator/SimulatorScreens';
import { SimulatorBottomNav } from './simulator/SimulatorBottomNav';
import { BurgerMenuOverlay, ChatOverlay, NotificationsOverlay, FloatingCartButton } from './simulator/SimulatorOverlays';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';

interface PreviewPaneProps {
    deviceType: DeviceType;
    notchStyle: NotchStyle;
    isDarkMode: boolean;
    viewMode: ViewMode;
    themeConfig: ThemeConfig;
    currentTeam: TeamConfig;

    activeSelectionId?: string | null | undefined;
    onElementSelect: (metadata: ComponentMetadata) => void; // Matched page.tsx
    onThemeUpdate: (updates: Partial<ThemeConfig>) => void;

    isInspectorActive: boolean;
    onInspectorClose?: () => void;
    onInspectorToggle?: () => void;

    // State props from page.tsx
    activeFeatures: Record<string, boolean>;
    allFeatures: FeatureFlags;
    mockData: any;
    setMockData: any;
    previewPage: string;
    setPreviewPage: (page: string) => void;

    // Ignored props or add if needed: appTier, userPersona, etc.
    [key: string]: any; // Allow other props to pass through without error
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
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
}) => {
    // Scroll state is local
    const [isScrolled, setIsScrolled] = useState(false);
    const [headerHeight, setHeaderHeight] = useState<number | undefined>(undefined); // Use undefined to let screens predict initially
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [selectedMetadata, setSelectedMetadata] = useState<ComponentMetadata | null>(null);

    const { getOverride } = useSimulatorStyles(themeConfig, isDarkMode);

    // Derive SportConfig
    const sportConfig = SPORT_CONFIG[currentTeam.sportType] || SPORT_CONFIG['Calcio'];

    // Reset scroll when changing pages
    useEffect(() => {
        setIsScrolled(false);
    }, [previewPage]);

    const handleElementClick = (metadata: ComponentMetadata) => {
        setSelectedMetadata(metadata);
        onElementSelect(metadata);
    };

    const handleInspectorUpdate = (id: string, key: string, value: any) => {
        if (key === 'RESET') {
            // Reset: remove overrides for this component
            const newOverrides = { ...themeConfig.componentOverrides };
            delete newOverrides[id];
            onThemeUpdate({ componentOverrides: newOverrides });

            // Refresh metadata to show default values
            if (selectedMetadata && selectedMetadata.id === id) {
                const refreshedProps = selectedMetadata.editableProps.map(prop => ({
                    ...prop,
                    value: '' // Reset to default
                }));
                setSelectedMetadata({
                    ...selectedMetadata,
                    editableProps: refreshedProps
                });
            }
        } else {
            // Update specific property
            onThemeUpdate({
                componentOverrides: {
                    ...themeConfig.componentOverrides,
                    [id]: {
                        ...themeConfig.componentOverrides[id],
                        [key]: value
                    }
                }
            });

            // Update local metadata state to keep values in sync (Critical for text inputs)
            if (selectedMetadata && selectedMetadata.id === id) {
                const refreshedProps = selectedMetadata.editableProps.map(prop =>
                    prop.key === key ? { ...prop, value } : prop
                );
                setSelectedMetadata({
                    ...selectedMetadata,
                    editableProps: refreshedProps
                });
            }
        }
    };

    return (
        <div className="relative w-full h-full bg-slate-900/50 backdrop-blur-sm overflow-hidden transition-colors duration-300 flex items-center justify-center">
            {/* Simulator + Inspector Container */}
            <div className="relative flex items-center justify-center p-8">
                <SimulatorLayout
                    deviceType={deviceType}
                    notchStyle={notchStyle}
                    isDarkMode={isDarkMode}
                    themeConfig={themeConfig}
                    currentTeam={currentTeam}
                    onScrollChange={setIsScrolled}
                    inspector={
                        onInspectorToggle && (
                            <VisualInspector
                                isActive={isInspectorActive}
                                onToggle={onInspectorToggle}
                                activeSelectionId={activeSelectionId ?? null}
                            />
                        )
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
                                canGoBack={
                                    previewPage !== 'home' &&
                                    themeConfig.navigationType === 'header_tabs'
                                }
                                pageTitle={
                                    previewPage === 'home'
                                        ? 'Home'
                                        : previewPage.charAt(0).toUpperCase() + previewPage.slice(1)
                                }
                                viewMode={viewMode}
                                previewPage={previewPage}
                                setPreviewPage={setPreviewPage}
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
                        mockData={mockData}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId ?? null}
                        onSelect={handleElementClick}
                        sportConfig={sportConfig}
                        setMockData={setMockData}
                        headerHeight={headerHeight}
                        deviceType={deviceType}
                    />
                </SimulatorLayout>

                {/* Unified Inspector Panel */}
                <div className={`absolute left-[calc(100%+24px)] top-1/2 -translate-y-1/2 transition-all duration-300 w-[320px] h-[812px] bg-slate-950/95 border border-slate-800 shadow-2xl z-[100] flex flex-col rounded-[32px] overflow-hidden backdrop-blur-xl ${isInspectorActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <FloatingInspectorPanel
                        metadata={selectedMetadata}
                        config={themeConfig}
                        onUpdate={handleInspectorUpdate}
                        onClose={onInspectorClose || (() => { })}
                    />
                </div>
            </div>
        </div>
    );
};
