import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge, Info, BookOpen, Music, Award, Bell, MessageSquare, Menu } from 'lucide-react';
import { ThemeConfig, NavItem, ViewMode } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';
import { ComponentMetadata } from '@/types/inspector';
import { Selectable } from '../../builder/VisualInspector';

interface SimulatorBottomNavProps {
    themeConfig: ThemeConfig;
    currentTeam: TeamConfig;
    previewPage: string;
    setPreviewPage: (page: string) => void;
    isDarkMode: boolean;
    viewMode: ViewMode;
    isInspectorActive: boolean;
    activeSelectionId?: string | null;
    onSelect: (metadata: ComponentMetadata) => void;
    isStandalone?: boolean;
}

export const SimulatorBottomNav: React.FC<SimulatorBottomNavProps> = ({
    themeConfig,
    currentTeam,
    previewPage,
    setPreviewPage,
    isDarkMode,
    viewMode,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    isStandalone = false
}) => {
    const { getOverride } = useSimulatorStyles(themeConfig, isDarkMode);

    const renderIcon = (item: NavItem, isActive: boolean, color: string, size: number = 24) => {
        const override = getOverride(`nav_tab_${item.id}`);
        const iconUrl = override?.customIconUrl || item.customIconUrl;

        if (iconUrl) {
            return (
                <div className="relative" style={{ width: size, height: size }}>
                    <img
                        src={iconUrl}
                        alt={item.label}
                        className={`w-full h-full object-contain transition-all duration-500 ${isActive ? 'scale-110 brightness-110' : 'opacity-80'}`}
                        style={{ filter: isActive ? `drop-shadow(0 0 8px ${color}60)` : 'none' }}
                    />
                </div>
            );
        }

        const iconMap: Record<string, React.ElementType> = {
            Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
            Info, BookOpen, Music, Award, Bell, MessageSquare, Menu
        };

        // Special case for Admin/Home in Admin View
        let iconName = item.icon;
        if (viewMode === 'ADMIN' && (item.id === 'home' || item.id === 'admin')) {
            iconName = 'Gauge';
        }

        const IconComponent = iconMap[iconName] || Layout;

        return (
            <IconComponent
                size={size}
                className={`transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'} ${isActive && !iconUrl ? 'drop-shadow-sm' : ''}`}
                style={{ color }}
                strokeWidth={isActive ? 2.5 : 2}
            />
        );
    };

    const navStyle = themeConfig.navStyle || 'modern';
    const isClassic = navStyle === 'classic';
    const isLiquid = navStyle === 'liquid';
    const isModern = navStyle === 'modern';
    const isGlass = navStyle === 'glass';

    const getNavBarStyles = () => {
        const safeAreaBottom = isStandalone ? 'var(--safe-area-bottom, 0px)' : '0px';

        switch (navStyle) {
            case 'classic':
                return `w-full px-4 pt-3 pb-8 flex items-center justify-around border-t shadow-lg transition-all duration-500 ${!isDarkMode ? 'bg-white border-slate-200' : ''}`;
            case 'glass':
            case 'modern':
                // Premium floating pill
                return `mx-4 mb-4 flex items-center justify-around px-4 py-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-all duration-500`;
            case 'liquid':
                // Liquid style - squircle shape
                return `mx-4 mb-6 flex items-center justify-around px-4 py-3 rounded-[2rem] border shadow-[0_-20px_60px_rgba(0,0,0,0.15)] ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/80 border-slate-200/50'} backdrop-blur-2xl`;
            default:
                return `mx-4 mb-4 flex items-center justify-around px-4 py-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t transition-all duration-500`;
        }
    };

    const getNavBarInlineStyles = () => {
        const baseStyles: React.CSSProperties = {};
        const safeAreaBottom = isStandalone ? 'var(--safe-area-bottom, 0px)' : '0px';

        if (isClassic) {
            baseStyles.paddingBottom = `calc(32px + ${safeAreaBottom})`;
        } else {
            baseStyles.marginBottom = `calc(16px + ${safeAreaBottom})`;
        }

        if (isDarkMode) {
            baseStyles.backgroundColor = 'rgba(15, 23, 42, 0.95)';
            baseStyles.borderColor = 'rgba(255, 255, 255, 0.15)';
        } else {
            baseStyles.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            baseStyles.borderColor = 'rgba(0, 0, 0, 0.05)';
        }
        return baseStyles;
    };

    return (
        <div className={`px-0 pb-0 pt-2 transition-all duration-500 pointer-events-none w-full`}>
            <div className={`flex flex-col items-center w-full`}>
                <div
                    className={`${getNavBarStyles()} pointer-events-auto transition-all duration-500 relative overflow-hidden`}
                    style={getNavBarInlineStyles()}
                >
                    {(themeConfig.navigation || [])
                        .filter(item => item.enabled)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .slice(0, 5)
                        .map((item) => {
                            const isActive = previewPage === item.id;
                            const activeColor = themeConfig.tabBarStyling?.useTeamColorForActive
                                ? currentTeam.colors.primary
                                : (themeConfig.tabBarStyling?.labelActiveColor || currentTeam.colors.primary);

                            const inactiveColor = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.4)';

                            return (
                                <Selectable
                                    key={item.id}
                                    id={`nav_tab_${item.id}`}
                                    type="icon"
                                    label={`Tab ${item.label}`}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === `nav_tab_${item.id}`}
                                    onSelect={onSelect}
                                    overrides={getOverride(`nav_tab_${item.id}`)}
                                    traits={['content', 'interaction', 'icon']}
                                >
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setPreviewPage(item.id)}
                                        className={`relative flex flex-col items-center justify-center gap-0.5 z-10 transition-all duration-500 min-w-[60px] p-2`}
                                    >
                                        <div
                                            className={`relative rounded-xl transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
                                            style={{
                                                transform: isActive && !isClassic ? 'translateY(-2px)' : 'none'
                                            }}
                                        >
                                            {renderIcon(item, isActive, isActive ? activeColor : inactiveColor, isClassic ? 24 : 22)}
                                        </div>

                                        {/* Show labels ONLY on Classic style, or if explicitly requested in sub-styles (can add later) */}
                                        {isClassic && (
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-tight transition-colors duration-300"
                                                style={{
                                                    fontSize: `calc(10px * ${themeConfig.fontScale || 1})`,
                                                    color: isActive ? activeColor : inactiveColor
                                                }}
                                            >
                                                {getOverride(`nav_tab_${item.id}`)?.text || item.label}
                                            </span>
                                        )}

                                        {isActive && !isClassic && (
                                            <motion.div
                                                layoutId="active-nav-dot"
                                                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: activeColor }}
                                            />
                                        )}
                                    </motion.button>
                                </Selectable>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
