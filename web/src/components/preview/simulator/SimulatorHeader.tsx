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

    // Dynamic height based on Home mode and Navigation Type
    const getHeaderHeight = () => {
        let height = isHome ? 230 : 130;

        if (isHome) {
            if (enableUniversalMenu) height += 60;
            if (showHeaderTabs) height += 50;
        } else {
            if (enableUniversalMenu) height += 45;
            if (showHeaderTabs) height += 50;
        }

        // Add safe area if standalone
        if (isStandalone) {
            return `calc(${height}px + var(--safe-area-top, 0px))`;
        }

        return height;
    };

    const targetHeight = getHeaderHeight();

    // Use ResizeObserver to detect the REAL height
    React.useLayoutEffect(() => {
        if (!headerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // Use getBoundingClientRect for the full border-box height including padding
                const height = entry.target.getBoundingClientRect().height;
                onHeightChange?.(height);
            }
        });

        observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, [onHeightChange, enableUniversalMenu, showHeaderTabs, isHome, isStandalone]);

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
            className="absolute top-0 left-0 right-0 z-40 overflow-hidden shadow-2xl"
            overrides={headerOverride}
            traits={['background', 'layout']}
        >
            <motion.header
                ref={headerRef}
                animate={{
                    height: targetHeight,
                    minHeight: targetHeight
                }}
                className={`relative w-full pb-3 px-6 flex flex-col overflow-hidden backdrop-blur-md ${isStandalone ? 'pt-[calc(14px+var(--safe-area-top,0px))]' : 'pt-14'}`}
                style={{
                    borderRadius: themeConfig.borderRadius === 'full' ? '0 0 40px 40px' : '0'
                }}
            >
                <div className="absolute inset-0 z-0">
                    {/* Primary Gradient Layer */}
                    <div
                        className="absolute inset-0 transition-colors duration-500"
                        style={{
                            background: `linear-gradient(135deg, 
                                ${headerOverride?.customGradientStart || themeConfig.header?.customGradientStart || currentTeam.colors.primary}, 
                                ${headerOverride?.customGradientEnd || themeConfig.header?.customGradientEnd || currentTeam.colors.secondary || currentTeam.colors.primary}${!!(headerOverride?.backgroundImage || themeConfig.header?.backgroundImage || currentTeam.branding?.customHeroImage) ? 'dd' : ''})`
                        }}
                    />

                    {/* Gradient Mesh / Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    {/* Background Image Layer (Custom or Team) */}
                    {(headerOverride?.backgroundImage || themeConfig.header?.backgroundImage || currentTeam.branding?.customHeroImage) && (
                        <motion.img
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: (headerOverride?.backgroundImage || themeConfig.header?.backgroundImage) ? 0.6 : 0.5 }}
                            src={headerOverride?.backgroundImage || themeConfig.header?.backgroundImage || currentTeam.branding?.customHeroImage}
                            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay brightness-110"
                            alt="Header Background"
                        />
                    )}

                    {/* Texture / Noise Layer */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                </div>


                {/* Top Row: Brand & Actions */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {themeConfig.navigationType === 'burger' && (
                            <button
                                onClick={onBurgerClick}
                                className="p-2 -ml-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                        )}
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg overflow-hidden">
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
                                        className={`text-sm font-black text-white tracking-tight leading-none uppercase ${getOverride('header_team_name')?.fontSize || ''} ${getOverride('header_team_name')?.visible === false ? 'opacity-30 grayscale' : ''}`}
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
                                            className={`text-[10px] font-bold text-white/70 uppercase tracking-widest ${getOverride('header_sport_type')?.fontSize || ''} ${getOverride('header_sport_type')?.visible === false ? 'opacity-30 grayscale' : ''}`}
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
                            <button onClick={onChatClick} className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all">
                                <MessageSquare size={16} />
                            </button>
                        )}
                        {!!themeConfig.header?.showNotifications && (
                            <button onClick={onNotificationsClick} className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all">
                                <Bell size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Welcome Text (Home Only) */}
                <AnimatePresence mode="wait">
                    {isHome && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-10 mb-2 mt-2"
                        >
                            <Selectable
                                id="header_welcome_title"
                                type="text"
                                label="Titolo Benvenuto"
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'header_welcome_title'}
                                onSelect={onSelect}
                                overrides={getOverride('header_welcome_title')}
                                traits={['content', 'typography', 'interaction']}
                            >
                                {(getOverride('header_welcome_title')?.visible !== false || isInspectorActive) && (
                                    <h2
                                        className={`text-2xl font-black text-white leading-tight ${getOverride('header_welcome_title')?.fontSize || ''} ${getOverride('header_welcome_title')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                        style={{ color: getOverride('header_welcome_title')?.textColor }}
                                    >
                                        {getOverride('header_welcome_title')?.text || "Benvenuto nel Club Digital"}
                                    </h2>
                                )}
                            </Selectable>

                            <Selectable
                                id="header_welcome_subtitle"
                                type="text"
                                label="Sottotitolo Benvenuto"
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'header_welcome_subtitle'}
                                onSelect={onSelect}
                                overrides={getOverride('header_welcome_subtitle')}
                                traits={['content', 'typography', 'interaction']}
                            >
                                {(getOverride('header_welcome_subtitle')?.visible !== false || isInspectorActive) && (
                                    <p
                                        className={`text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mt-2 mb-4 ${getOverride('header_welcome_subtitle')?.fontSize || ''} ${getOverride('header_welcome_subtitle')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                        style={{ color: getOverride('header_welcome_subtitle')?.textColor }}
                                    >
                                        {getOverride('header_welcome_subtitle')?.text || "La tua passione, ovunque."}
                                    </p>
                                )}
                            </Selectable>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Universal Menu - Persistent */}
                {enableUniversalMenu && themeConfig.header?.universalMenuItems && (
                    <div className="relative z-10 my-1 flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
                        {themeConfig.header.universalMenuItems.map(itemId => {
                            let type = 'nav';
                            let id = itemId;

                            if (itemId.includes(':')) {
                                const parts = itemId.split(':');
                                type = parts[0];
                                id = parts[1];
                            } else {
                                // Guess if no prefix
                                const featureExists = Object.values(featureFlags).some(f => f.id === itemId);
                                type = featureExists ? 'feature' : 'nav';
                                id = itemId;
                            }

                            if (type === 'nav') {
                                // Use the full list of navigation items from config, not just the enabled filters
                                // to allow "Home" or other items even if they are special-cased elsewhere
                                const navItemData = (themeConfig.navigation || []).find(item => item.id === id);
                                if (!navItemData) return null;

                                return (
                                    <button
                                        key={itemId}
                                        onClick={() => {
                                            if (isInspectorActive) return;
                                            setPreviewPage(id);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border transition-all shrink-0 pointer-events-auto ${previewPage === id
                                            ? 'bg-white text-slate-900 border-white shadow-lg'
                                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                            }`}
                                    >
                                        <span className={previewPage === id ? 'text-slate-900' : 'text-white'}>
                                            {renderIcon(navItemData, previewPage === id)}
                                        </span>
                                        <span className="text-[9px] font-bold uppercase tracking-wide">{navItemData.label}</span>
                                    </button>
                                );
                            } else if (type === 'feature') {
                                const featureData = Object.values(featureFlags || {}).find(f => f && typeof f === 'object' && f.id === id);
                                const isAccessible = activeFeatures[id] !== false; // Check boolean map

                                if (!featureData) return null;
                                // Still show the button if it's explicitly enabled in the Universal Menu, 
                                // but we might want to grey it out or hide if not accessible.
                                // The user wants to SEE the icons they selected.
                                if (!featureData.enabled) return null;

                                const featureIconMap: Record<string, string> = {
                                    news: 'BookOpen', tactics: 'Gauge', video: 'Video', shop: 'ShoppingBag',
                                    events: 'Calendar', chat: 'MessageSquare', lineup: 'Users',
                                    sponsors: 'Shield', chants: 'Music', staff: 'Users'
                                };
                                const iconName = featureIconMap[id] || 'Layout';

                                return (
                                    <button
                                        key={itemId}
                                        onClick={() => {
                                            if (isInspectorActive) return;
                                            if (!isAccessible) return; // Disable click if not accessible
                                            setPreviewPage(id);
                                        }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border transition-all shrink-0 pointer-events-auto ${previewPage === id
                                            ? 'bg-white text-slate-900 border-white shadow-lg'
                                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                            } ${!isAccessible ? 'opacity-40 grayscale' : ''}`}
                                    >
                                        <span className={previewPage === id ? 'text-slate-900' : 'text-white'}>
                                            {renderIcon({ icon: iconName }, previewPage === id)}
                                        </span>
                                        <div className="flex flex-col items-start leading-none text-left">
                                            <span className="text-[9px] font-bold uppercase tracking-wide">{featureData.label}</span>
                                            <span className={`text-[6px] font-black uppercase tracking-widest mt-0.5 ${previewPage === id ? 'opacity-50' : (featureData.minTier === 'FREE' ? 'text-emerald-400' : 'text-amber-400')
                                                }`}>
                                                {featureData.minTier}
                                            </span>
                                        </div>
                                    </button>
                                );
                            }
                            return null;
                        })}
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
