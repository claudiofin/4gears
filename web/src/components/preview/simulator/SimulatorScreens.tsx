import React, { useEffect } from 'react';
import { Layout, Calendar, ShoppingBag, Video, Newspaper, Target, Users, Shield, Award } from 'lucide-react';
import { ViewMode, ThemeConfig, FeatureFlags, DeviceType, NavItem } from '@/types/builder';
import { ComponentMetadata } from '@/types/inspector';
import { SportConfig } from '@/constants/sports';
import { TeamConfig } from '@/constants/teams';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';

// Extracted Screens
import { HomeScreen } from './screens/HomeScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { SecretariatScreen, FederationToolsScreen } from './screens/ManagementScreens';
import { AthleteDashboardScreen } from './screens/AthleteDashboardScreen';
import { NewsScreen, EventsScreen, ShopScreen, SponsorsScreen, ChantsScreen, RosterScreen } from './screens/FeatureScreens';
import { MatchDetailScreen } from './screens/MatchDetailScreen';
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { AdminPersonasScreen } from './screens/AdminPersonasScreen';
import { MenuScreen } from './screens/MenuScreen';

interface SimulatorScreensProps {
    previewPage: string;
    setPreviewPage: (page: string) => void;
    viewMode: ViewMode;
    themeConfig: ThemeConfig;
    isDarkMode: boolean;
    currentTeam: TeamConfig;
    activeFeatures: Record<string, boolean>;
    mockData: any;
    isInspectorActive: boolean;
    activeSelectionId?: string | null;
    onSelect: (metadata: ComponentMetadata) => void;
    sportConfig: SportConfig;
    onViewModeChange?: (mode: ViewMode) => void;
    setMockData: any;
    headerHeight?: number;
    deviceType?: DeviceType;
    multiTeamMode?: boolean;
    rolePreview?: 'athlete' | 'fan' | 'admin' | null;
    isStandalone?: boolean;
    featureFlags?: FeatureFlags;
}

export const SimulatorScreens: React.FC<SimulatorScreensProps> = (props) => {
    const {
        previewPage,
        setPreviewPage,
        viewMode,
        themeConfig,
        isDarkMode,
        currentTeam,
        activeFeatures,
        mockData,
        isInspectorActive,
        activeSelectionId,
        onSelect,
        sportConfig,
        onViewModeChange,
        setMockData,
        headerHeight,
        deviceType = 'IPHONE',
        rolePreview,
        isStandalone = false,
        featureFlags
    } = props;

    const { getCardClass, getIconProps, getOverride } = useSimulatorStyles(themeConfig, isDarkMode);

    const currentPage = previewPage;
    const showHeaderTabs = themeConfig.navigationType === 'header_tabs';
    const hasUniversalMenu = currentPage === 'home' &&
        themeConfig.header?.enableUniversalMenu &&
        (themeConfig.header?.universalMenuItems?.length ?? 0) > 0;

    // Calculate top padding to match header height
    const getTopPadding = () => {
        const isHome = currentPage === 'home';

        // Home page ALWAYS uses the unified mega-header (340px)
        if (isHome) {
            return headerHeight || 180;
        }

        const getHeaderHeight = () => {
            // Match logic in SimulatorHeader.tsx for non-home pages
            let height = 110;

            if (showHeaderTabs) height += 50;

            const enableUniversalMenu = themeConfig.header?.enableUniversalMenu && (themeConfig.header?.universalMenuItems?.length ?? 0) > 0;
            const showUniversalMenuInHeader = enableUniversalMenu && (
                themeConfig.header?.universalMenuPlacement === 'header' || !isHome
            );

            if (showUniversalMenuInHeader) height += 70;

            if (isStandalone) height += 44;
            return height;
        };

        const predictedHeight = getHeaderHeight();
        const baseHeight = headerHeight || predictedHeight;
        return baseHeight;
    };

    const topPaddingValue = getTopPadding() + 16; // +16px gap between header and body content

    const screenProps = {
        themeConfig,
        isDarkMode,
        currentTeam,
        topPaddingValue,
        isInspectorActive,
        activeSelectionId,
        onSelect,
        getOverride,
        getCardClass,
        setPreviewPage,
        mockData,
        setMockData,
        sportConfig,
        rolePreview,
        activeFeatures,
        getIconProps,
        deviceType,
        onViewModeChange,
        viewMode,
        featureFlags
    };

    const renderContent = () => {
        if (viewMode === 'ADMIN') {
            if (currentPage === 'home' || currentPage === 'admin') {
                return <AdminDashboardScreen {...screenProps} />;
            }
            if (currentPage === 'admin_personas') {
                return <AdminPersonasScreen {...screenProps} />;
            }
            if (currentPage === 'admin_secretariat') {
                return <SecretariatScreen {...screenProps} />;
            }
            if (currentPage === 'admin_federation') {
                return <FederationToolsScreen {...screenProps} />;
            }
        }

        switch (currentPage) {
            case 'home':
                return <HomeScreen {...screenProps} />;
            case 'menu':
                return <MenuScreen {...screenProps} />;
            case 'news':
                return <NewsScreen {...screenProps} />;
            case 'calendar':
            case 'events':
                return <EventsScreen {...screenProps} />;
            case 'shop':
                return <ShopScreen {...screenProps} />;
            case 'sponsors':
                return <SponsorsScreen {...screenProps} />;
            case 'chants':
                return <ChantsScreen {...screenProps} />;
            case 'roster':
                return <RosterScreen {...screenProps} />;
            case 'match_detail':
                return <MatchDetailScreen {...screenProps} />;
            case 'admin_secretariat':
            case 'secretariat':
                return <SecretariatScreen {...screenProps} />;
            case 'admin_federation':
            case 'federation':
                return <FederationToolsScreen {...screenProps} />;
            case 'admin_personas':
                return <AdminPersonasScreen {...screenProps} />;
            case 'athlete_dashboard':
                return <AthleteDashboardScreen {...screenProps} />;
            default:
                return <HomeScreen {...screenProps} />;
        }
    };

    return (
        <div className={`w-full h-full relative flex flex-col overflow-hidden transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
                {(currentPage === 'intro' || currentPage === 'splash') ? (
                    <SplashScreen {...screenProps} />
                ) : (currentPage === 'auth' || currentPage === 'login') ? (
                    <LoginScreen {...screenProps} />
                ) : (
                    renderContent()
                )}
            </div>
        </div>
    );
};
