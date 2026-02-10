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
import { CoachDashboardScreen } from './screens/CoachDashboardScreen';
import { AthleteDashboardScreen } from './screens/AthleteDashboardScreen';
import { NewsScreen, EventsScreen, TacticsScreen, ShopScreen } from './screens/FeatureScreens';
import { MatchDetailScreen } from './screens/MatchDetailScreen';
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';

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
    rolePreview?: 'coach' | 'athlete' | 'fan' | 'admin' | null;
    isStandalone?: boolean;
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
        isStandalone = false
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
        const getHeaderHeight = () => {
            let height = isHome ? 230 : 130;
            if (isHome) {
                if (hasUniversalMenu) height += 60;
                if (showHeaderTabs) height += 50;
            } else {
                if (hasUniversalMenu) height += 45;
                if (showHeaderTabs) height += 50;
            }
            if (isStandalone) height += 44;
            return height;
        };

        const predictedHeight = getHeaderHeight();
        const baseHeight = headerHeight || predictedHeight;
        return baseHeight + 20;
    };

    const topPaddingValue = getTopPadding();

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
        onViewModeChange
    };

    const renderContent = () => {
        // Special case for Admin Dashboard
        if (viewMode === 'ADMIN' && (currentPage === 'home' || currentPage === 'admin')) {
            return <AdminDashboardScreen {...screenProps} />;
        }

        switch (currentPage) {
            case 'home':
                return <HomeScreen {...screenProps} />;
            case 'news':
                return <NewsScreen {...screenProps} />;
            case 'calendar':
            case 'events':
                return <EventsScreen {...screenProps} />;
            case 'tactics':
                return <TacticsScreen {...screenProps} />;
            case 'shop':
                return <ShopScreen {...screenProps} />;
            case 'match_detail':
                return <MatchDetailScreen {...screenProps} />;
            case 'secretariat':
                return <SecretariatScreen {...screenProps} />;
            case 'federation':
                return <FederationToolsScreen {...screenProps} />;
            case 'coach_dashboard':
                return <CoachDashboardScreen {...screenProps} />;
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
