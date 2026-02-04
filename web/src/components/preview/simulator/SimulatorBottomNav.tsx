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
    onSelect
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
    const isGlass = navStyle === 'glass';

    const getNavBarStyles = () => {
        switch (navStyle) {
            case 'classic':
                return `w-full px-4 pt-3 pb-8 flex items-center justify-around border-t shadow-lg transition-all duration-500 ${!isDarkMode ? 'bg-white border-slate-200' : ''}`;
            case 'glass':
            case 'modern':
                // Balanced floating style: less horizontal margin, more compact, pill shape, INCREASED GAP
                return `mx-8 mb-8 flex items-center justify-around gap-6 px-8 py-3 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.25)] border backdrop-blur-xl transition-all duration-500`;
            case 'liquid':
                // Liquid style - moderate margins, squircle shape, INCREASED GAP
                return `mx-8 mb-10 flex items-center justify-around gap-6 px-6 py-3 rounded-[28px] border shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/80 border-slate-200/50'} backdrop-blur-2xl`;
            default:
                return `mx-8 mb-8 flex items-center justify-around gap-6 px-8 py-3 rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.25)] border-2 backdrop-blur-xl transition-all duration-500`;
        }
    };

    const getNavBarInlineStyles = () => {
        const baseStyles: React.CSSProperties = {};
        if (isDarkMode) {
            baseStyles.backgroundColor = 'rgba(15, 23, 42, 0.9)';
            baseStyles.borderColor = 'rgba(255, 255, 255, 0.1)';
        } else {
            baseStyles.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            baseStyles.borderColor = 'rgba(0, 0, 0, 0.08)';
        }
        return baseStyles;
    };

    return (
        <div className={`px-0 pb-0 pt-2 transition-all duration-500 pointer-events-none`}>
            {/* The actual bar should be pointer-events-auto */}
            <div className={`flex flex-col items-center w-full`}>
                <div
                    className={`${getNavBarStyles()} pointer-events-auto transition-all duration-500 relative overflow-hidden`}
                    style={getNavBarInlineStyles()}
                >
                    {(themeConfig.navigation || [])
                        .filter(item => item.enabled && (item.id === 'home' || item.id === 'menu' || (themeConfig.navigation || []).filter(t => t.enabled).length <= 5))
                        .slice(0, 5)
                        .map((item) => {
                            const isActive = previewPage === item.id;
                            const activeColor = currentTeam.colors.primary;
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
                                >
                                    <button
                                        onClick={() => setPreviewPage(item.id)}
                                        className={`relative flex flex-col items-center gap-0.5 z-10 transition-all duration-500 flex-1`}
                                    >
                                        {isLiquid && isActive && (
                                            <motion.div
                                                layoutId="liquid-bg"
                                                className={`absolute inset-0 rounded-2xl z-0 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'}`}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        <div
                                            className={`relative rounded-xl transition-all duration-300 ${isActive ? 'p-2' : 'p-2'}`}
                                            style={{
                                                backgroundColor: !isLiquid && isActive && !isClassic
                                                    ? (isDarkMode ? 'rgba(255,255,255,0.1)' : `${currentTeam.colors.primary}15`)
                                                    : 'transparent'
                                            }}
                                        >
                                            {renderIcon(item, isActive, isActive ? activeColor : inactiveColor, 20)}
                                        </div>
                                        {!isLiquid && (
                                            <span
                                                className="text-[8px] font-bold uppercase tracking-tight transition-colors duration-300"
                                                style={{
                                                    fontSize: `calc(8px * ${themeConfig.fontScale || 1})`,
                                                    color: isActive ? activeColor : inactiveColor
                                                }}
                                            >
                                                {getOverride(`nav_tab_${item.id}`)?.text || item.label}
                                            </span>
                                        )}
                                    </button>
                                </Selectable>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
