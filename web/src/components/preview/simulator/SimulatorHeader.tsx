import React from 'react';
import {
    Menu, MessageSquare, Bell, ArrowLeft, MoreVertical,
    Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
    Info, BookOpen, Music, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Selectable } from '../../builder/VisualInspector';
import { ThemeConfig, ComponentOverride, ViewMode, FeatureFlags } from '@/types/builder';
import { TeamConfig } from '@/constants/teams';
import { SportConfig } from '@/constants/sports';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';
import { ComponentMetadata } from '@/types/inspector';

interface SimulatorHeaderProps {
    themeConfig: ThemeConfig;
    currentTeam: TeamConfig;
    sportConfig: SportConfig;
    isScrolled: boolean;
    isDarkMode: boolean;
    isInspectorActive: boolean;
    activeSelectionId?: string | null;
    onSelect: (metadata: ComponentMetadata) => void;
    getOverride: (id: string) => ComponentOverride;
    featureFlags: FeatureFlags; // Full objects
    activeFeatures: Record<string, boolean>; // Boolean check
    onHeightChange?: (height: number) => void;

    // Actions
    onBurgerClick: () => void;
    onChatClick: () => void;
    onNotificationsClick: () => void;
    viewMode: ViewMode;
    onBackClick?: () => void;
    canGoBack?: boolean;
    pageTitle?: string;
    previewPage: string;
    setPreviewPage: (page: string) => void;
    isStandalone?: boolean;
}

export const SimulatorHeader: React.FC<SimulatorHeaderProps> = ({
    themeConfig,
    currentTeam,
    sportConfig,
    isDarkMode,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    featureFlags,
    activeFeatures,
    onHeightChange,
    onBurgerClick,
    onChatClick,
    onNotificationsClick,
    onBackClick,
    canGoBack,
    pageTitle,
    viewMode,
    previewPage,
    setPreviewPage,
    isStandalone = false
}) => {
    const headerRef = React.useRef<HTMLDivElement>(null);
    const { getIconProps } = useSimulatorStyles(themeConfig, isDarkMode);

    const showNotif = themeConfig.header?.showNotifications;
    const showSupport = themeConfig.header?.showSupport;

    const isHome = previewPage === 'home';
    const showHeaderTabs = themeConfig.navigationType === 'header_tabs';
    const enableUniversalMenu = themeConfig.header?.enableUniversalMenu && (themeConfig.header?.universalMenuItems?.length ?? 0) > 0;
    const headerOverride = getOverride('header_main');

    const isUnified = themeConfig.header?.headerStyle === 'unified';
    const isUnifiedHome = isUnified && isHome;

    // Dynamic height based on mode
    const getHeaderHeight = () => {
        if (isUnifiedHome) {
            // Mega Header: StatusBar (44) + LogoRow (66) + Menu (70) + Hero (160)
            return 340;
        }

        // Standard logic
        let height = 110;
        if (showHeaderTabs) height += 50;
        const showUniversalMenuInHeader = enableUniversalMenu && (
            themeConfig.header?.universalMenuPlacement === 'header' || !isHome
        );
        if (showUniversalMenuInHeader) height += 80; // Extra room for standard
        return height;
    };

    const targetHeight = getHeaderHeight();
    const showUniversalMenuInHeader = enableUniversalMenu && (
        themeConfig.header?.universalMenuPlacement === 'header' || !isHome
    );

    // Use ResizeObserver... (same logic)
    React.useLayoutEffect(() => {
        if (!headerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const height = entry.target.getBoundingClientRect().height;
                onHeightChange?.(height);
            }
        });

        observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, [onHeightChange, enableUniversalMenu, themeConfig.header?.universalMenuPlacement, showHeaderTabs, isHome, isStandalone, isUnified]);

    const renderIcon = (item: any, isActive: boolean) => {
        const iconMap: Record<string, React.ElementType> = {
            Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
            Info, BookOpen, Music, Award, Bell, MessageSquare, Menu
        };
        const iconKey = typeof item === 'string' ? item : item.icon;
        const IconComponent = iconMap[iconKey] || Layout;
        return <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />;
    };

    const navItems = (themeConfig.navigation || []).filter(item => item.enabled);

    return (
        <Selectable
            id="header_main"
            ref={headerRef}
            type="header"
            label="Header Principale"
            isInspectorActive={isInspectorActive}
            isSelected={activeSelectionId === 'header_main'}
            onSelect={onSelect}
            className="absolute top-0 left-0 right-0 z-40"
            overrides={headerOverride}
            traits={['background', 'layout']}
        >
            <motion.header
                ref={headerRef}
                animate={{
                    height: targetHeight,
                    minHeight: targetHeight
                }}
                className={`relative w-full px-6 flex flex-col justify-end transition-all duration-300 ${isStandalone ? 'pt-[calc(14px+var(--safe-area-top,0px))]' : 'pt-14'
                    } ${!isUnifiedHome ? (isUnified ? '' : 'backdrop-blur-md shadow-2xl overflow-hidden') : ''}`}
                style={{
                    borderRadius: (themeConfig.borderRadius === 'full' && !isUnifiedHome) ? '0 0 40px 40px' : '0'
                }}
            >
                {/* SINGLE MASTER BACKGROUND LAYER */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{
                            background: `linear-gradient(135deg, 
                                ${headerOverride?.customGradientStart || themeConfig.header?.customGradientStart || currentTeam.colors.primary}, 
                                ${headerOverride?.customGradientEnd || themeConfig.header?.customGradientEnd || currentTeam.colors.secondary || currentTeam.colors.primary})`
                        }}
                    />

                    {/* Unified Shadow/Overlay Mesh */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    {/* Background Texture - Unified opacity */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                </div>

                {/* Top Row: Brand & Actions */}
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {themeConfig.navigationType === 'burger' && (
                            <button
                                onClick={onBurgerClick}
                                className="p-2 -ml-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                        <div className={`w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg overflow-hidden transition-all duration-300 ${!isUnified ? 'backdrop-blur-md border border-white/30' : 'border border-white/10'}`}>
                            {canGoBack ? (
                                <button onClick={onBackClick} className="text-white hover:scale-110"><ArrowLeft size={18} /></button>
                            ) : (
                                currentTeam.logo ? (
                                    <img
                                        src={currentTeam.logo}
                                        className="w-7 h-7 object-contain"
                                        alt="Logo"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                                            if (fallback) fallback.classList.remove('hidden');
                                        }}
                                    />
                                ) : (
                                    <sportConfig.icon size={20} className="text-white" />
                                )
                            )}
                            <div className="fallback-icon hidden">
                                <sportConfig.icon size={20} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <Selectable
                                id="header_team_name"
                                type="text"
                                label="Nome Team (Header)"
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'header_team_name'}
                                onSelect={onSelect}
                                overrides={getOverride('header_team_name')}
                                traits={['content', 'typography', 'interaction']}
                            >
                                {(getOverride('header_team_name')?.visible !== false || isInspectorActive) && (
                                    <h1
                                        className={`text-sm font-black text-white tracking-tight leading-none uppercase drop-shadow-sm ${getOverride('header_team_name')?.fontSize || ''} ${getOverride('header_team_name')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                        style={{ color: getOverride('header_team_name')?.textColor }}
                                    >
                                        {getOverride('header_team_name')?.text || currentTeam.name}
                                    </h1>
                                )}
                            </Selectable>

                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                                <Selectable
                                    id="header_sport_type"
                                    type="text"
                                    label="Tipo Sport (Header)"
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === 'header_sport_type'}
                                    onSelect={onSelect}
                                    overrides={getOverride('header_sport_type')}
                                    traits={['content', 'typography', 'interaction']}
                                >
                                    {(getOverride('header_sport_type')?.visible !== false || isInspectorActive) && (
                                        <p
                                            className={`text-[10px] font-bold text-white/70 uppercase tracking-widest drop-shadow-sm ${getOverride('header_sport_type')?.fontSize || ''} ${getOverride('header_sport_type')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                            style={{ color: getOverride('header_sport_type')?.textColor }}
                                        >
                                            {getOverride('header_sport_type')?.text || currentTeam.sportType}
                                        </p>
                                    )}
                                </Selectable>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!!themeConfig.header?.showSupport && (
                            <button onClick={onChatClick} className={`p-2 rounded-xl text-white transition-all ${!isUnified ? 'bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'}`}>
                                <MessageSquare size={16} />
                            </button>
                        )}
                        {!!themeConfig.header?.showNotifications && (
                            <button onClick={onNotificationsClick} className={`p-2 rounded-xl text-white transition-all ${!isUnified ? 'bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'}`}>
                                <Bell size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="h-4 shrink-0" />

                {/* UNIFIED HERO CONTENT (Only here if isUnifiedHome) */}
                {isUnifiedHome && (
                    <div className="relative z-10 px-0 pb-10 mt-2">
                        <Selectable
                            id="header_welcome"
                            type="text"
                            label="Welcome Text"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'header_welcome'}
                            onSelect={onSelect}
                            overrides={getOverride('welcome_text')}
                            traits={['content', 'typography', 'interaction']}
                        >
                            <h2 className="text-xs font-bold uppercase tracking-widest mb-1 text-white/80">
                                {getOverride('welcome_text')?.text || 'Benvenuto'}
                            </h2>
                        </Selectable>
                        <Selectable
                            id="header_team_mega"
                            type="text"
                            label="Team Name (Mega)"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'header_team_mega'}
                            onSelect={onSelect}
                            overrides={getOverride('team_name')}
                            traits={['content', 'typography', 'interaction']}
                        >
                            <h1 className="text-4xl font-black leading-tight tracking-tight text-white uppercase">
                                {getOverride('team_name')?.text || currentTeam.name}
                            </h1>
                        </Selectable>
                    </div>
                )}

                {/* Universal Menu - Persistent */}
                {showUniversalMenuInHeader && themeConfig.header?.universalMenuItems && (
                    <div className="relative z-10 pb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto touch-pan-x">
                        <AnimatePresence mode="popLayout">
                            <motion.div className="flex items-center gap-2 px-1 min-w-max">
                                {themeConfig.header.universalMenuItems.map(itemId => {
                                    let type = 'nav';
                                    let id = itemId;

                                    if (itemId.includes(':')) {
                                        const parts = itemId.split(':');
                                        type = parts[0];
                                        id = parts[1];
                                    }

                                    if (type === 'nav') {
                                        const navItemData = (themeConfig.navigation || []).find(item => item.id === id);
                                        if (!navItemData) return null;

                                        return (
                                            <motion.button
                                                key={itemId}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => {
                                                    if (isInspectorActive) return;
                                                    id && setPreviewPage(id);
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md border transition-all shrink-0 pointer-events-auto shadow-sm ${previewPage === id
                                                    ? 'bg-white text-slate-900 border-white shadow-lg scale-105'
                                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                                    }`}
                                            >
                                                <span className={previewPage === id ? 'text-slate-900' : 'text-white'}>
                                                    {renderIcon(navItemData, previewPage === id)}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{navItemData.label}</span>
                                            </motion.button>
                                        );
                                    } else if (type === 'feature') {
                                        const featureData = Object.values(featureFlags || {}).find(f => f && typeof f === 'object' && f.id === id);
                                        const isAccessible = activeFeatures[id] !== false;

                                        if (!featureData || !featureData.enabled) return null;

                                        const featureIconMap: Record<string, string> = {
                                            news: 'BookOpen', tactics: 'Gauge', video: 'Video', shop: 'ShoppingBag',
                                            events: 'Calendar', chat: 'MessageSquare', lineup: 'Users',
                                            sponsors: 'Shield', chants: 'Music', staff: 'Users'
                                        };
                                        const iconName = featureIconMap[id] || 'Layout';

                                        return (
                                            <motion.button
                                                key={itemId}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => {
                                                    if (isInspectorActive) return;
                                                    if (!isAccessible) return;
                                                    id && setPreviewPage(id);
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md border transition-all shrink-0 pointer-events-auto shadow-sm ${previewPage === id
                                                    ? 'bg-white text-slate-900 border-white shadow-lg scale-105'
                                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                                    } ${!isAccessible ? 'opacity-40 grayscale' : ''}`}
                                            >
                                                <span className={previewPage === id ? 'text-slate-900' : 'text-white'}>
                                                    {renderIcon({ icon: iconName }, previewPage === id)}
                                                </span>
                                                <div className="flex flex-col items-start leading-none text-left">
                                                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{featureData.label}</span>
                                                </div>
                                            </motion.button>
                                        );
                                    }
                                    return null;
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

                {/* Tabs Navigation */}
                {showHeaderTabs && (
                    <div className="relative z-10 mt-auto pt-1 mb-1 flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
                        {navItems.map(item => {
                            const isActive = previewPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setPreviewPage(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${isActive
                                        ? 'bg-white text-slate-900 shadow-xl scale-105'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    <span className={isActive ? 'text-slate-900' : 'text-white'}>
                                        {renderIcon(item, isActive)}
                                    </span>
                                    {isActive && <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </motion.header>
        </Selectable>
    );
};
