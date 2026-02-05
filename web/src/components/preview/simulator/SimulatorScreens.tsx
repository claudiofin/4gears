import React from 'react';
import {
    Settings, Calendar, Users, ShoppingBag, Layout, Video, Shield,
    ChevronRight, Bell, Search, Plus, User, MapPin, Clock, Trophy,
    CreditCard, BarChart3, MessageSquare, Menu, Sun, Moon, X, LogOut,
    Package, Send, Gauge, Info, BookOpen, Music, Award, Edit2, Trash2, Play, Lock,
    ArrowLeft, Reply, CheckCheck, Newspaper, PlaySquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Selectable } from '../../builder/VisualInspector';
import { AppTier, UserPersona, ViewMode, FeatureFlags, ThemeConfig, ComponentOverride, NavItem, DeviceType } from '@/types/builder';
import { ComponentMetadata } from '@/types/inspector';
import { PremiumCard } from '../../ui/PremiumCard';
import { SmartCalendar } from '../../ui/SmartCalendar';
import { TacticsBoard } from '../../ui/TacticsBoard';
import { SPORT_CONFIG, SportConfig } from '@/constants/sports';
import { TeamConfig } from '@/constants/teams';
import { useSimulatorStyles } from '@/hooks/useSimulatorStyles';
import { SimulatorHero } from './SimulatorHero';

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
        deviceType = 'IPHONE'
    } = props;

    const { getCardClass, getSpacingClass, getIconProps, getOverride } = useSimulatorStyles(themeConfig, isDarkMode);

    const SectionHeader = ({ id, label, title, isFirst }: { id: string; label: string; title: string, isFirst?: boolean }) => (
        <Selectable
            id={id}
            type="text"
            label={label}
            isInspectorActive={isInspectorActive}
            isSelected={activeSelectionId === id}
            onSelect={onSelect}
            overrides={getOverride(id)}
            traits={['content', 'typography', 'interaction']}
            className={`${isFirst ? 'mt-0' : 'mt-6'} mb-3 px-1`}
        >
            {(getOverride(id)?.visible !== false || isInspectorActive) && (
                <h3
                    className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} ${getOverride(id)?.fontSize || ''} ${getOverride(id)?.visible === false ? 'opacity-30 grayscale' : ''}`}
                    style={{ color: getOverride(id)?.textColor }}
                >
                    {getOverride(id)?.text || title}
                </h3>
            )}
        </Selectable>
    );

    const renderIcon = (item: NavItem, isActive: boolean, color: string, size: number = 24) => {
        const override = themeConfig.componentOverrides?.[`nav_tab_${item.id}`];
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
            Info, BookOpen, Music, Award, Bell, MessageSquare, Newspaper, PlaySquare, Send, Trophy
        };

        let iconName = item.icon;
        if (viewMode === 'ADMIN' && (item.id === 'home' || item.id === 'admin')) {
            iconName = 'Gauge';
        }

        const IconComponent = iconMap[iconName] || Layout;

        return (
            <IconComponent
                size={size}
                className="transition-all duration-500"
                style={{ color }}
                strokeWidth={isActive ? 2.5 : 2}
            />
        );
    };

    const renderAdminDashboard = (padding: number) => {
        const primaryColor = currentTeam.colors.primary;
        const secondaryColor = currentTeam.colors.secondary;

        return (

            <div className={`p-4 pb-32 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500`} style={{ paddingTop: `${padding}px` }}>
                <SectionHeader id="admin_header" label="Titolo Dashboard" title="Statistiche Generali" isFirst={true} />

                {/* KPI Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="admin_kpi_fans"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'admin_kpi_fans'}
                        onElementSelect={onSelect}
                        className="p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="p-1.5 rounded-lg w-fit transition-all duration-300"
                                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                            >
                                <Users size={14} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fan Coin</span>
                        </div>
                        <div className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{getOverride('admin_kpi_fans')?.text || '45.2K'}</div>
                        <div className="text-emerald-500 text-[9px] font-black flex items-center gap-1 mt-2 tracking-wide">
                            <Plus size={10} /> +12% VS IERI
                        </div>
                    </PremiumCard>


                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="admin_kpi_revenue"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'admin_kpi_revenue'}
                        onElementSelect={onSelect}
                        className="p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="p-1.5 rounded-lg w-fit"
                                style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
                            >
                                <ShoppingBag size={14} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Entrate</span>
                        </div>
                        <div className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{getOverride('admin_kpi_revenue')?.text || '€8.2K'}</div>
                        <div className="text-emerald-500 text-[9px] font-black flex items-center gap-1 mt-2 tracking-wide">
                            <Plus size={10} /> +5% VS TARGET
                        </div>
                    </PremiumCard>
                </div>

                {/* Team Health / Status */}
                <Selectable
                    id="admin_team_status"
                    type="card"
                    label="Status Team"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'admin_team_status'}
                    onSelect={onSelect}
                    overrides={getOverride('admin_team_status')}
                    traits={['background', 'border', 'spacing', 'interaction']}
                    className={`p-4 ${getCardClass(true)} ${getOverride('admin_team_status')?.visible === false ? 'opacity-30 grayscale border-dashed' : ''}`}
                >
                    {(getOverride('admin_team_status')?.visible !== false || isInspectorActive) && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stato del Team</h3>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold border border-emerald-500/20">OPERATIVO</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center">
                                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mockData?.players?.length}</div>
                                    <div className="text-[9px] text-slate-500 uppercase font-medium">Atleti</div>
                                </div>
                                <div className="text-center border-x border-slate-700/30">
                                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>2</div>
                                    <div className="text-[9px] text-slate-500 uppercase font-medium">Infortunati</div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>5</div>
                                    <div className="text-[9px] text-slate-500 uppercase font-medium">Eventi Mese</div>
                                </div>
                            </div>
                        </>
                    )}
                </Selectable>

                {/* Quick Management Actions */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Manutenzione Rapida</h3>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-[8px] font-bold text-slate-500">SYSTEM LIVE</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="admin_action_athlete"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'admin_action_athlete'}
                            onElementSelect={onSelect}
                            className="p-4 group cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div
                                className="p-2 rounded-xl w-fit mb-3 transition-colors group-hover:brightness-110"
                                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                            >
                                <Plus size={16} />
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                {getOverride('admin_action_athlete')?.text || 'Aggiungi Atleta'}
                            </div>
                        </PremiumCard>

                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="admin_action_event"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'admin_action_event'}
                            onElementSelect={onSelect}
                            className="p-4 group cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div
                                className="p-2 rounded-xl w-fit mb-3 transition-colors group-hover:brightness-110"
                                style={{ backgroundColor: `${secondaryColor}15`, color: secondaryColor }}
                            >
                                <Calendar size={16} />
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                {getOverride('admin_action_event')?.text || 'Crea Evento'}
                            </div>
                        </PremiumCard>

                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="admin_action_product"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'admin_action_product'}
                            onElementSelect={onSelect}
                            className="p-4 group cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div
                                className="p-2 rounded-xl w-fit mb-3 transition-colors group-hover:brightness-110"
                                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                            >
                                <Package size={16} />
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                {getOverride('admin_action_product')?.text || 'Nuovo Prodotto'}
                            </div>
                        </PremiumCard>

                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="admin_action_push"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'admin_action_push'}
                            onElementSelect={onSelect}
                            className="p-4 group cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div
                                className="p-2 rounded-xl w-fit mb-3 transition-colors group-hover:brightness-110"
                                style={{ backgroundColor: `${secondaryColor}15`, color: secondaryColor }}
                            >
                                <Send size={16} />
                            </div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                {getOverride('admin_action_push')?.text || 'Notifica Push'}
                            </div>
                        </PremiumCard>
                    </div>

                </div>

                {/* Shop Orders List */}
                <Selectable
                    id="admin_orders_list"
                    type="card"
                    label="Lista Ordini"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'admin_orders_list'}
                    onSelect={onSelect}
                    overrides={getOverride('admin_orders_list')}
                    traits={['background', 'border', 'spacing', 'interaction']}
                    className={`p-4 ${getCardClass(true)}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gestione Ordini</h3>
                        <button className="text-indigo-500 text-[10px] font-extrabold hover:underline flex items-center gap-1">
                            VEDI TUTTI <ChevronRight size={10} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-indigo-500/20">
                                        #{1000 + i}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cliente #{i}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">In elaborazione</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>€{(45.50 * i).toFixed(2)}</div>
                                    <div className="text-[8px] text-slate-500 font-medium">Oggi, 12:45</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Selectable>

                {/* Sponsor Management */}
                <Selectable
                    id="admin_sponsor_mgmt"
                    type="card"
                    label="Gestione Sponsor"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'admin_sponsor_mgmt'}
                    onSelect={onSelect}
                    overrides={getOverride('admin_sponsor_mgmt')}
                    traits={['background', 'border', 'spacing', 'interaction']}
                    className={`p-4 ${getCardClass(true)}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gestione Sponsor</h3>
                        <button
                            className="p-2 rounded-lg transition-colors hover:brightness-110"
                            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {mockData?.sponsors?.slice(0, 3).map((s: any) => (
                            <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-100/10 border border-white/5">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1">
                                    <img src={s.image} alt={s.name} className="max-h-full max-w-full grayscale" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold">{s.name}</div>
                                    <div className="text-[9px] text-blue-500 font-bold uppercase">{s.tier}</div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1.5 rounded-md hover:bg-white/10 text-slate-400">
                                        <Edit2 size={12} />
                                    </button>
                                    <button className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-500">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Selectable>
            </div>
        );
    };

    const currentPage = previewPage;
    const showHeaderTabs = themeConfig.navigationType === 'header_tabs';
    const hasUniversalMenu = currentPage === 'home' &&
        themeConfig.header?.enableUniversalMenu &&
        (themeConfig.header?.universalMenuItems?.length ?? 0) > 0;

    // Calculate top padding to match header height
    const getTopPadding = () => {
        // Fallback predictive logic that matches SimulatorHeader
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
            return height;
        };

        const predictedHeight = getHeaderHeight();

        // Use the dynamic measured height if available, otherwise use prediction
        const baseHeight = headerHeight || predictedHeight;

        // Fixed at exactly 20px below the header Y end as requested
        const extraPadding = 20;
        return baseHeight + extraPadding;
    };

    const topPaddingValue = getTopPadding();

    if (viewMode === 'ADMIN' && (currentPage === 'home' || currentPage === 'admin')) {
        return renderAdminDashboard(topPaddingValue);
    }

    const renderSplashScreen = () => {
        const splash = themeConfig?.splash || {
            style: 'minimal',
            backgroundType: 'gradient',
            logoSize: 'medium',
            animationType: 'fade',
            showLoader: true,
            loaderStyle: 'spinner',
            poweredByVisible: true,
            backgroundColor: undefined,
            backgroundImage: undefined,
            gradientStart: undefined,
            gradientEnd: undefined,
            customSubtitle: undefined
        };

        const getBgStyle = () => {
            if (splash.backgroundType === 'solid') return { backgroundColor: splash.backgroundColor || '#ffffff' };
            if (splash.backgroundType === 'image') return { backgroundImage: `url(${splash.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
            return { background: `linear-gradient(135deg, ${splash.gradientStart || '#4f46e5'}, ${splash.gradientEnd || '#06b6d4'})` };
        };

        const logoSizeMap = {
            small: 'w-20 h-20',
            medium: 'w-32 h-32',
            large: 'w-48 h-48',
            huge: 'w-64 h-64'
        };

        const animClass = splash.animationType === 'bounce' ? 'animate-bounce'
            : splash.animationType === 'zoom' ? 'animate-ping'
                : splash.animationType === 'fade' ? 'opacity-100'
                    : '';

        const logoPosition = currentTeam.branding?.logoPosition || 'center';
        const logoAlignment =
            logoPosition === 'top' ? 'justify-start pt-20' :
                logoPosition === 'bottom' ? 'justify-end pb-20' :
                    'justify-center';

        return (
            <div className={`h-full w-full flex flex-col items-center ${logoAlignment} p-8 relative overflow-hidden`} style={getBgStyle()}>
                <div className={`
                    bg-white rounded-[32px] shadow-2xl flex items-center justify-center p-6 mb-6 mx-auto overflow-hidden
                    ${logoSizeMap[splash.logoSize as keyof typeof logoSizeMap] || 'w-32 h-32'}
                    ${animClass}
                `}>
                    <img
                        src={currentTeam.branding?.appIcon || currentTeam.logo || sportConfig.heroImage}
                        alt={currentTeam.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="text-center text-white space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">{currentTeam.name}</h1>
                    <p className="text-white/80 font-medium uppercase tracking-widest text-xs">
                        {splash.customSubtitle || 'Official App'}
                    </p>
                </div>

                {splash.showLoader && (
                    <div className="mt-12">
                        {splash.loaderStyle === 'dots' ? (
                            <div className="flex space-x-1"><div className="w-2 h-2 bg-white rounded-full animate-bounce" /><div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75" /><div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" /></div>
                        ) : splash.loaderStyle === 'lines' ? (
                            <div className="flex space-x-1 items-end h-8">
                                <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                                <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                                <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '80%', animationDelay: '300ms' }} />
                            </div>
                        ) : (
                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                    </div>
                )}

                {splash.poweredByVisible && (
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Powered by 4Gears</p>
                    </div>
                )}
            </div>
        );
    };

    const renderLoginScreen = () => {
        const login = themeConfig?.login || {
            viewType: 'modern_card',
            heroStyle: 'logo',
            socialProviders: { google: true, apple: true, facebook: false, email: true },
            formStyle: {
                inputRadius: '12px',
                buttonRadius: '12px',
                inputBackground: 'white',
                shadowLevel: 'soft'
            },
            texts: {
                actionButtonText: 'ACCEDI',
                welcomeTitle: '',
                welcomeSubtitle: '',
                forgotPasswordText: ''
            }
        };

        const primaryColor = currentTeam.colors?.primary || '#4f46e5';

        // ViewType styling
        const isSplitScreen = login.viewType === 'split_screen';
        const isModernCard = login.viewType === 'modern_card';
        const isClassic = login.viewType === 'classic';

        const containerBg = isClassic ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-950';
        const formCardClass = isModernCard ? 'bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8' : '';

        return (
            <div className={`h-full w-full flex ${isSplitScreen ? 'flex-row' : 'flex-col'} overflow-hidden ${containerBg}`}>
                {/* Split Screen Left Panel (Hero) */}
                {isSplitScreen && (
                    <div
                        className="w-2/5 flex flex-col items-center justify-center p-12 relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${currentTeam.colors?.secondary || '#06b6d4'})`
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
                        }} />

                        <div className="relative z-10 text-center space-y-8">
                            <div className="w-28 h-28 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl flex items-center justify-center mx-auto p-0 overflow-hidden ring-1 ring-white/20">
                                <img
                                    src={currentTeam.branding?.appIcon || currentTeam.logo || sportConfig.heroImage}
                                    className="w-full h-full object-cover"
                                    alt="App Logo"
                                />
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                                    {currentTeam.name}
                                </h1>
                                <p className="text-white/90 text-base font-semibold tracking-wide">
                                    La tua passione, ovunque.
                                </p>
                            </div>

                            <div className="pt-8 space-y-2">
                                <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                                    <span className="font-medium">Accesso sicuro</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                                    <span className="font-medium">Sempre aggiornato</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Container */}
                <div className={`${isSplitScreen ? 'w-3/5' : 'w-full'} flex flex-col p-6 overflow-y-auto`}>
                    {/* Hero / Logo Area (non-split) */}
                    {!isSplitScreen && (
                        <div className="mt-8 mb-8 text-center flex-shrink-0">
                            {(login.heroStyle === 'logo' || login.heroStyle === 'none') && (
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 p-0 overflow-hidden">
                                    <img src={currentTeam.branding?.appIcon || currentTeam.logo || sportConfig.heroImage} className="w-full h-full object-cover" alt="App Logo" />
                                </div>
                            )}
                            {login.heroStyle === 'image' && login.heroImageUrl && (
                                <div className="w-full h-40 rounded-2xl bg-cover bg-center mb-6 shadow-lg" style={{ backgroundImage: `url(${login.heroImageUrl})` }} />
                            )}

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                {login.texts?.welcomeTitle || `Benvenuto in ${currentTeam.name}`}
                            </h2>
                            <p className="text-slate-500 text-sm mt-2">{login.texts?.welcomeSubtitle || 'Accedi per gestire il tuo profilo'}</p>
                        </div>
                    )}

                    {/* Form Area */}
                    <div className={`w-full space-y-4 max-w-sm mx-auto ${formCardClass}`}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Email</label>
                            <input
                                type="email"
                                className="w-full p-4 bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                style={{ borderRadius: login.formStyle?.inputRadius || '12px' }}
                                placeholder="mario.rossi@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Password</label>
                            <input
                                type="password"
                                className="w-full p-4 bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                style={{ borderRadius: login.formStyle?.inputRadius || '12px' }}
                                placeholder="••••••••"
                            />
                            <div className="text-right">
                                <span className="text-xs font-bold text-indigo-500 cursor-pointer">{login.texts?.forgotPasswordText || 'Password dimenticata?'}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setPreviewPage('home');
                                if (onViewModeChange) {
                                    onViewModeChange('USER');
                                }
                            }}
                            className="w-full py-4 font-bold text-white shadow-lg shadow-indigo-500/30 mt-4 transition-transform active:scale-95 text-sm"
                            style={{
                                backgroundColor: primaryColor,
                                borderRadius: login.formStyle?.buttonRadius || '12px'
                            }}
                        >
                            {login.texts?.actionButtonText || 'ACCEDI'}
                        </button>

                        <button
                            className={`w-full py-3.5 font-bold border mt-2 transition-transform active:scale-95 text-sm ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                        >
                            CREA UN ACCOUNT
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-400">
                            Continuando accetti i <span className="underline cursor-pointer">Termini di Servizio</span>
                        </p>
                    </div>

                    <div className="w-full space-y-3 mt-6">
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">Oppure</span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        </div>

                        {login.socialProviders?.google && (
                            <button
                                className="w-full py-3 border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2"
                                style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                Continua con Google
                            </button>
                        )}

                        {login.socialProviders?.apple && (deviceType === 'IPHONE') && (
                            <button
                                className="w-full py-3 bg-black text-white font-bold hover:bg-gray-900 transition-colors text-sm flex items-center justify-center gap-2"
                                style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                            >
                                <img src="https://www.svgrepo.com/show/508757/apple.svg" className="w-5 h-5 invert" alt="Apple" />
                                Continua con Apple
                            </button>
                        )}
                        {login.socialProviders?.facebook && (
                            <button
                                className="w-full py-3 bg-[#1877F2] text-white font-bold hover:bg-[#155fc4] transition-colors text-sm flex items-center justify-center gap-2"
                                style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                            >
                                <span className="font-bold">f</span>
                                Continua con Facebook
                            </button>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-slate-400">
                            Continuando accetti i <span className="underline cursor-pointer">Termini di Servizio</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (previewPage) {
            case 'home':
                return (
                    <div className={`${getSpacingClass()} px-4 pb-32`} style={{ paddingTop: `${topPaddingValue}px` }}>
                        {/* Next Match */}
                        <Selectable
                            id="next_match_card"
                            type="card"
                            label="Card Prossimo Match"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'next_match_card'}
                            onSelect={onSelect}
                            className={`p-5 ${getCardClass(true)}`}
                            overrides={getOverride('next_match_card')}
                            traits={['background', 'border', 'spacing', 'interaction']}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Prossimo {sportConfig.scoring.term === 'Goal' ? 'Match' : 'Evento'}</span>
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 uppercase tracking-tighter">
                                    {sportConfig.federation} • {sportConfig.scoring.period}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-center flex flex-col items-center">
                                    <Selectable
                                        id="home_team_logo"
                                        type="icon"
                                        label="Logo Casa"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === 'home_team_logo'}
                                        onSelect={onSelect}
                                        overrides={getOverride('home_team_logo')}
                                        traits={['icon', 'interaction']}
                                    >
                                        <div className="w-12 h-12 bg-slate-100 rounded-full mb-2 border border-slate-200 flex items-center justify-center">
                                            <sportConfig.icon {...getIconProps(20, "text-slate-400")} />
                                        </div>
                                    </Selectable>
                                    <Selectable
                                        id="home_team_label"
                                        type="text"
                                        label="Etichetta Casa"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === 'home_team_label'}
                                        onSelect={onSelect}
                                        overrides={getOverride('home_team_label')}
                                        traits={['content', 'typography', 'interaction']}
                                    >
                                        {(getOverride('home_team_label')?.visible !== false || isInspectorActive) && (
                                            <span
                                                className={`text-[10px] font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('home_team_label')?.fontSize || ''} ${getOverride('home_team_label')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                style={{ color: getOverride('home_team_label')?.textColor }}
                                            >
                                                {getOverride('home_team_label')?.text || 'CASA'}
                                            </span>
                                        )}
                                    </Selectable>
                                </div>
                                <div className="text-center px-4">
                                    <Selectable
                                        id="match_vs_text"
                                        type="text"
                                        label="Testo VS"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === 'match_vs_text'}
                                        onSelect={onSelect}
                                        overrides={getOverride('match_vs_text')}
                                        traits={['content', 'typography', 'interaction']}
                                    >
                                        {(getOverride('match_vs_text')?.visible !== false || isInspectorActive) && (
                                            <span
                                                className={`text-3xl font-black block tracking-tighter w-full ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('match_vs_text')?.fontSize || ''} ${getOverride('match_vs_text')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                style={{ color: getOverride('match_vs_text')?.textColor }}
                                            >
                                                {getOverride('match_vs_text')?.text || 'VS'}
                                            </span>
                                        )}
                                    </Selectable>
                                    <Selectable
                                        id="match_time_text"
                                        type="text"
                                        label="Orario Match"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === 'match_time_text'}
                                        onSelect={onSelect}
                                        overrides={getOverride('match_time_text')}
                                        traits={['content', 'typography', 'interaction']}
                                    >
                                        {(getOverride('match_time_text')?.visible !== false || isInspectorActive) && (
                                            <span
                                                className={`text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block ${getOverride('match_time_text')?.fontSize || ''} ${getOverride('match_time_text')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                style={{ color: getOverride('match_time_text')?.textColor }}
                                            >
                                                {getOverride('match_time_text')?.text || '15:00'}
                                            </span>
                                        )}
                                    </Selectable>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                    <Selectable
                                        id="away_team_logo"
                                        type="icon"
                                        label="Logo Trasferta"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === 'away_team_logo'}
                                        onSelect={onSelect}
                                        overrides={getOverride('away_team_logo')}
                                        traits={['icon', 'interaction']}
                                    >
                                        <div className="w-12 h-12 bg-slate-100 rounded-full mb-2 border border-slate-200 flex items-center justify-center">
                                            <Shield {...getIconProps(20, "text-slate-400")} />
                                        </div>
                                    </Selectable>
                                    <Selectable
                                        id="away_team_label"
                                        type="text"
                                        label="Etichetta Trasferta"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === 'away_team_label'}
                                        onSelect={onSelect}
                                        overrides={getOverride('away_team_label')}
                                        traits={['content', 'typography', 'interaction']}
                                    >
                                        {(getOverride('away_team_label')?.visible !== false || isInspectorActive) && (
                                            <span
                                                className={`text-[10px] font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('away_team_label')?.fontSize || ''} ${getOverride('away_team_label')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                style={{ color: getOverride('away_team_label')?.textColor }}
                                            >
                                                {getOverride('away_team_label')?.text || 'TRASFERTA'}
                                            </span>
                                        )}
                                    </Selectable>
                                </div>
                            </div>
                        </Selectable>

                        {/* Quick Actions Grid - Dynamic from Nav items */}
                        <div className={`grid grid-cols-2 ${themeConfig.spacingLevel === 'compact' ? 'gap-2' : 'gap-3'}`}>
                            {(themeConfig.navigation || [])
                                .filter(item => item.id !== 'home' && item.id !== 'menu' && item.enabled)
                                .map(item => (
                                    <div key={item.id} onClick={() => setPreviewPage(item.id)} className={`aspect-[4/3] flex flex-col items-center justify-center gap-3 group ${getCardClass(true)}`}>
                                        <div className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 group-hover:bg-slate-600' : 'bg-slate-50 group-hover:bg-blue-50'}`}>
                                            {renderIcon(item, false, isDarkMode ? '#cbd5e1' : '#475569', 20)}
                                        </div>
                                        <Selectable
                                            id={`home_quick_${item.id}`}
                                            type="text"
                                            label={`Etichetta ${item.label}`}
                                            isInspectorActive={isInspectorActive}
                                            isSelected={activeSelectionId === `home_quick_${item.id}`}
                                            onSelect={onSelect}
                                            overrides={getOverride(`home_quick_${item.id}`)}
                                            traits={['content', 'typography', 'interaction']}
                                        >
                                            {(getOverride(`home_quick_${item.id}`)?.visible !== false || isInspectorActive) && (
                                                <span
                                                    className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} ${getOverride(`home_quick_${item.id}`)?.fontSize || ''} ${getOverride(`home_quick_${item.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                    style={{ color: getOverride(`home_quick_${item.id}`)?.textColor }}
                                                >
                                                    {getOverride(`home_quick_${item.id}`)?.text || item.label}
                                                </span>
                                            )}
                                        </Selectable>
                                    </div>
                                ))}
                        </div>

                        {/* Additional Layout Elements (Widgets) */}
                        {activeFeatures.video && (
                            <>
                                <SectionHeader id="home_video_section" label="Sezione Video Home" title="Focus Video" />
                                <PremiumCard themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-0 overflow-hidden" id="home_video_widget" isInspectorActive={isInspectorActive} isSelected={activeSelectionId === 'home_video_widget'} onElementSelect={onSelect}>
                                    <div className="relative aspect-video">
                                        <img
                                            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80"
                                            className="w-full h-full object-cover"
                                            alt="Ultimi Risultati"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                                            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Highlight Match</div>
                                            <div className="text-sm font-bold text-white leading-tight">Rivivi le emozioni dell'ultima vittoria</div>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                                            <Play className="text-white ml-0.5" size={20} fill="white" />
                                        </div>
                                    </div>
                                </PremiumCard>
                            </>
                        )}

                        {activeFeatures.sponsors && (
                            <>
                                <SectionHeader id="home_sponsor_section" label="Sezione Sponsor Home" title="Main Sponsors" />
                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                    {mockData?.sponsors?.map((s: any, i: number) => (
                                        <PremiumCard
                                            key={s.id}
                                            themeConfig={themeConfig}
                                            isDarkMode={isDarkMode}
                                            className="min-w-[120px] aspect-square flex items-center justify-center p-4 shrink-0"
                                            id={`home_sponsor_${s.id}`}
                                            isInspectorActive={isInspectorActive}
                                            isSelected={activeSelectionId === `home_sponsor_${s.id}`}
                                            onElementSelect={onSelect}
                                        >
                                            <img src={s.image} alt={s.name} className="max-w-full max-h-full grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                        </PremiumCard>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeFeatures.chants && (
                            <>
                                <SectionHeader id="home_chants_section" label="Sezione Cori Home" title="Cori & Identità" />
                                <PremiumCard
                                    themeConfig={themeConfig}
                                    isDarkMode={isDarkMode}
                                    className="p-4"
                                    id="home_chants_widget"
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === 'home_chants_widget'}
                                    onElementSelect={onSelect}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                            <Music size={24} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">Inno Ufficiale</div>
                                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Sempre con te</div>
                                        </div>
                                        <button className="ml-auto w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Play size={14} fill="currentColor" />
                                        </button>
                                    </div>
                                </PremiumCard>
                            </>
                        )}

                        {activeFeatures.news && (
                            <>
                                <SectionHeader id="home_news_section" label="Sezione News Home" title="Ultime Notizie" />
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <PremiumCard key={i} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-3" id={`home_news_card_${i}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `home_news_card_${i}`} onElementSelect={onSelect}>
                                            <div className="flex gap-3 text-left">
                                                <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                                                    <img
                                                        src={`https://images.unsplash.com/photo-${i === 1 ? '1508098682722-e99c43a406b2' : '1552667466-07f70cdba9f3'}?w=200&h=200&fit=crop`}
                                                        className="w-full h-full object-cover"
                                                        alt={i === 1 ? "Evento 1" : "Evento 2"}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-[10px] text-blue-500 font-bold uppercase mb-1">Società</div>
                                                    <div className="text-xs font-bold leading-snug line-clamp-2">Aggiornamento importante per tutti i membri di {currentTeam.name}</div>
                                                </div>
                                            </div>
                                        </PremiumCard>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeFeatures.events && (
                            <>
                                <SectionHeader id="home_events_section" label="Sezione Eventi Home" title="Prossimi Appuntamenti" />
                                <PremiumCard themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-4" id="home_events_widget" isInspectorActive={isInspectorActive} isSelected={activeSelectionId === 'home_events_widget'} onElementSelect={onSelect}>
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex flex-col items-center justify-center font-bold">
                                            <Calendar size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold">Cena Sociale</div>
                                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Domenica 15 Giugno</div>
                                        </div>
                                        <ChevronRight className="ml-auto text-slate-400" size={16} />
                                    </div>
                                </PremiumCard>
                            </>
                        )}
                    </div>
                );

            case 'roster':
                return (
                    <div className="p-4 pb-24 space-y-4" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="roster_header_main" label="Titolo Rosa" title="La Tua Rosa" isFirst={true} />

                        {/* Search & Filter */}
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cerca atleta..."
                                    className={`w-full pl-10 pr-4 py-2.5 text-xs font-medium border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20`}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {sportConfig.roleFilters.map((filter: string, i: number) => (
                                    <button
                                        key={filter}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-all ${i === 0
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <SectionHeader id="roster_header_first" label="Header Sezione Rosa" title="Rosa Attuale" />

                        <div className="space-y-3">
                            {mockData?.players?.map((player: any) => {
                                const playerId = `player_${player.id}`;
                                return (
                                    <motion.div key={player.id} className="mb-3">
                                        <PremiumCard
                                            themeConfig={themeConfig}
                                            isDarkMode={isDarkMode}
                                            className="flex items-center gap-4 p-3"
                                            id={playerId}
                                            isInspectorActive={isInspectorActive}
                                            isSelected={activeSelectionId === playerId}
                                            onElementSelect={onSelect}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative">
                                                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <Selectable
                                                    id={`player_name_${player.id}`}
                                                    type="text"
                                                    label={`Nome ${player.name}`}
                                                    isInspectorActive={isInspectorActive}
                                                    isSelected={activeSelectionId === `player_name_${player.id}`}
                                                    onSelect={onSelect}
                                                    overrides={getOverride(`player_name_${player.id}`)}
                                                    traits={['content', 'typography', 'interaction']}
                                                >
                                                    {(getOverride(`player_name_${player.id}`)?.visible !== false || isInspectorActive) && (
                                                        <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride(`player_name_${player.id}`)?.fontSize || ''} ${getOverride(`player_name_${player.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`player_name_${player.id}`)?.textColor }}>
                                                            {getOverride(`player_name_${player.id}`)?.text || player.name}
                                                        </div>
                                                    )}
                                                </Selectable>

                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Selectable
                                                        id={`player_role_${player.id}`}
                                                        type="text"
                                                        label={`Ruolo ${player.role}`}
                                                        isInspectorActive={isInspectorActive}
                                                        isSelected={activeSelectionId === `player_role_${player.id}`}
                                                        onSelect={onSelect}
                                                        overrides={getOverride(`player_role_${player.id}`)}
                                                        traits={['content', 'typography', 'interaction']}
                                                    >
                                                        {(getOverride(`player_role_${player.id}`)?.visible !== false || isInspectorActive) && (
                                                            <div className={`text-[10px] text-slate-500 font-bold uppercase tracking-tight ${getOverride(`player_role_${player.id}`)?.fontSize || ''} ${getOverride(`player_role_${player.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`player_role_${player.id}`)?.textColor }}>
                                                                {getOverride(`player_role_${player.id}`)?.text || player.role}
                                                            </div>
                                                        )}
                                                    </Selectable>
                                                    {Object.entries(player.stats).filter(([key]) => key !== 'performance' && key !== 'presenze').slice(0, 1).map(([key, val]) => (
                                                        <div key={key} className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1">
                                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                            {String(val)} {key}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-xl font-black text-slate-200">#{player.number}</div>
                                        </PremiumCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'events':
                return (
                    // Use dynamic spacing from theme config
                    <div className={`px-4 pb-12 ${getSpacingClass()}`} style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="events_header" label="Titolo Calendario" title="Calendario Eventi" isFirst={true} />
                        <SmartCalendar
                            selectedDate={new Date()}
                            onDateSelect={(d) => console.log(d)}
                            eventDates={[new Date()]}
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            isInspectorActive={isInspectorActive}
                            activeSelectionId={activeSelectionId || null}
                            onElementSelect={onSelect}
                        />

                        <div className="mt-6">
                            <Selectable
                                id="upcoming_events_title"
                                type="text"
                                label="Titolo Prossimi Eventi"
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'upcoming_events_title'}
                                onSelect={onSelect}
                                overrides={getOverride('upcoming_events_title')}
                                traits={['content', 'typography', 'interaction']}
                            >
                                {(getOverride('upcoming_events_title')?.visible !== false || isInspectorActive) && (
                                    <h3
                                        className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('upcoming_events_title')?.fontSize || ''} ${getOverride('upcoming_events_title')?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                        style={{ color: getOverride('upcoming_events_title')?.textColor }}
                                    >
                                        {getOverride('upcoming_events_title')?.text || 'Prossimi Eventi'}
                                    </h3>
                                )}
                            </Selectable>
                            {mockData?.events?.map((event: any) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-3"
                                >
                                    <PremiumCard
                                        themeConfig={themeConfig}
                                        isDarkMode={isDarkMode}
                                        className="p-4"
                                        id={`event_${event.id}`}
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === `event_${event.id}`}
                                        onElementSelect={onSelect}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex flex-col items-center justify-center font-bold">
                                                <span className="text-[10px] uppercase">{event.date.split(' ')[0]}</span>
                                                <span className="text-lg leading-none">{event.date.split(' ')[1]}</span>
                                            </div>
                                            <div className="flex-1">
                                                <Selectable
                                                    id={`event_title_${event.id}`}
                                                    type="text"
                                                    label={`Titolo ${event.title}`}
                                                    isInspectorActive={isInspectorActive}
                                                    isSelected={activeSelectionId === `event_title_${event.id}`}
                                                    onSelect={onSelect}
                                                    overrides={getOverride(`event_title_${event.id}`)}
                                                    traits={['content', 'typography', 'interaction']}
                                                >
                                                    {(getOverride(`event_title_${event.id}`)?.visible !== false || isInspectorActive) && (
                                                        <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride(`event_title_${event.id}`)?.fontSize || ''} ${getOverride(`event_title_${event.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`event_title_${event.id}`)?.textColor }}>
                                                            {getOverride(`event_title_${event.id}`)?.text || event.title}
                                                        </div>
                                                    )}
                                                </Selectable>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock {...getIconProps(12)} /> {event.time}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin {...getIconProps(12)} /> {event.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                                                <ChevronRight {...getIconProps(16, "text-slate-400")} />
                                            </div>
                                        </div>
                                    </PremiumCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            case 'tactics':
                return (
                    <div className="px-4 flex flex-col h-full overflow-hidden" style={{ paddingTop: `${topPaddingValue}px`, paddingBottom: '90px' }}>
                        <div className="shrink-0">
                            <SectionHeader id="tactics_header" label="Titolo Tattica" title="Lavagna Tattica" isFirst={true} />
                        </div>
                        <div className="flex-1 min-h-0 py-2">
                            <TacticsBoard
                                sportType={currentTeam.sportType}
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>
                );

            case 'shop':
                const shopProducts = [
                    { id: 1, name: 'Kit Gara Home 24/25', price: '€89.90', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80' },
                    { id: 2, name: 'Sciarpa Ufficiale', price: '€19.90', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80' },
                    { id: 3, name: 'Cappellino Team', price: '€24.90', image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=400&q=80' },
                    { id: 4, name: 'Zaino Tecnico', price: '€49.90', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80' }
                ];

                const handleAddToCart = (product: any) => {
                    if (isInspectorActive) return;
                    setMockData?.setCart((prev: any[]) => [...prev, product]);
                };

                const cartCount = mockData?.cart?.length || 0;

                return (
                    <div className="px-4 pb-24 relative" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="shop_header" label="Titolo Shop" title="Official Store" isFirst={true} />

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {shopProducts.map((product, i) => {
                                const itemId = `shop_item_${i}`;
                                const override = getOverride(itemId);
                                const isInCart = mockData?.cart?.some((item: any) => item.id === product.id);

                                if (override?.visible === false) return null;

                                return (
                                    <PremiumCard
                                        key={product.id}
                                        themeConfig={themeConfig}
                                        isDarkMode={isDarkMode}
                                        className={`p-0 overflow-hidden relative group ${override?.fontSize || ''}`}
                                        id={itemId}
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === itemId}
                                        onElementSelect={onSelect}
                                    >
                                        <div
                                            className="aspect-square bg-slate-100 relative overflow-hidden"
                                            style={{
                                                backgroundColor: override?.backgroundColor,
                                                borderColor: override?.borderColor,
                                                borderWidth: override?.borderColor ? '2px' : undefined
                                            }}
                                        >
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                                            <Selectable
                                                id={`shop_add_${i}`}
                                                type="icon"
                                                label="Aggiungi al Carrello"
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `shop_add_${i}`}
                                                onSelect={onSelect}
                                                overrides={getOverride(`shop_add_${i}`)}
                                                traits={['interaction', 'icon']}
                                            >
                                                {(getOverride(`shop_add_${i}`)?.visible !== false || isInspectorActive) && (
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300
                                                        ${isInCart ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-900 group-hover:bg-blue-600 group-hover:text-white'}
                                                        ${getOverride(`shop_add_${i}`)?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                        style={{
                                                            backgroundColor: isInCart ? undefined : getOverride(`shop_add_${i}`)?.backgroundColor,
                                                            color: isInCart ? undefined : getOverride(`shop_add_${i}`)?.textColor
                                                        }}
                                                    >
                                                        {isInCart ? <CheckCheck size={16} /> : <Plus size={16} />}
                                                    </button>
                                                )}
                                            </Selectable>
                                        </div>
                                        <div className="p-3">
                                            <Selectable
                                                id={`shop_title_${i}`}
                                                type="text"
                                                label="Titolo Prodotto"
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `shop_title_${i}`}
                                                onSelect={onSelect}
                                                overrides={getOverride(`shop_title_${i}`)}
                                                traits={['content', 'typography', 'interaction']}
                                            >
                                                {(getOverride(`shop_title_${i}`)?.visible !== false || isInspectorActive) && (
                                                    <div
                                                        className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride(`shop_title_${i}`)?.fontSize || ''} ${getOverride(`shop_title_${i}`)?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                        style={{ color: getOverride(`shop_title_${i}`)?.textColor }}
                                                    >
                                                        {getOverride(`shop_title_${i}`)?.text || product.name}
                                                    </div>
                                                )}
                                            </Selectable>
                                            <Selectable
                                                id={`shop_suffix_${i}`}
                                                type="text"
                                                label="Sottotitolo Prodotto"
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `shop_suffix_${i}`}
                                                onSelect={onSelect}
                                                overrides={getOverride(`shop_suffix_${i}`)}
                                                traits={['content', 'typography', 'interaction']}
                                            >
                                                {(getOverride(`shop_suffix_${i}`)?.visible !== false || isInspectorActive) && (
                                                    <div
                                                        className={`text-[9px] mt-0.5 font-medium tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${getOverride(`shop_suffix_${i}`)?.fontSize || ''} ${getOverride(`shop_suffix_${i}`)?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                        style={{ color: getOverride(`shop_suffix_${i}`)?.textColor }}
                                                    >
                                                        {getOverride(`shop_suffix_${i}`)?.text || 'Official Merchandise'}
                                                    </div>
                                                )}
                                            </Selectable>
                                            <Selectable
                                                id={`shop_price_${i}`}
                                                type="text"
                                                label="Prezzo Prodotto"
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `shop_price_${i}`}
                                                onSelect={onSelect}
                                                overrides={getOverride(`shop_price_${i}`)}
                                                traits={['content', 'typography', 'interaction']}
                                            >
                                                {(getOverride(`shop_price_${i}`)?.visible !== false || isInspectorActive) && (
                                                    <div
                                                        className={`mt-2 font-black text-blue-600 ${getOverride(`shop_price_${i}`)?.fontSize || ''} ${getOverride(`shop_price_${i}`)?.visible === false ? 'opacity-30 grayscale' : ''}`}
                                                        style={{ color: getOverride(`shop_price_${i}`)?.textColor }}
                                                    >
                                                        {getOverride(`shop_price_${i}`)?.text || product.price}
                                                    </div>
                                                )}
                                            </Selectable>
                                        </div>
                                    </PremiumCard>
                                );
                            })}
                        </div>


                    </div>
                );

            case 'staff':
                return (
                    <div className="px-4 pb-24 space-y-4" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="staff_header" label="Titolo Organigramma" title="Staff Societario" isFirst={true} />
                        <div className="space-y-3">
                            {mockData?.staff?.map((s: any) => (
                                <PremiumCard key={s.id} themeConfig={themeConfig} isDarkMode={isDarkMode} className="flex items-center gap-4 p-3" id={`staff_${s.id}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `staff_${s.id}`} onElementSelect={onSelect}>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden relative border border-slate-700/30">
                                        <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <Selectable
                                            id={`staff_name_${s.id}`}
                                            type="text"
                                            label={`Nome ${s.name}`}
                                            isInspectorActive={isInspectorActive}
                                            isSelected={activeSelectionId === `staff_name_${s.id}`}
                                            onSelect={onSelect}
                                            overrides={getOverride(`staff_name_${s.id}`)}
                                            traits={['content', 'typography', 'interaction']}
                                        >
                                            {(getOverride(`staff_name_${s.id}`)?.visible !== false || isInspectorActive) && (
                                                <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride(`staff_name_${s.id}`)?.fontSize || ''} ${getOverride(`staff_name_${s.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`staff_name_${s.id}`)?.textColor }}>
                                                    {getOverride(`staff_name_${s.id}`)?.text || s.name}
                                                </div>
                                            )}
                                        </Selectable>
                                        <Selectable
                                            id={`staff_role_${s.id}`}
                                            type="text"
                                            label={`Ruolo ${s.name}`}
                                            isInspectorActive={isInspectorActive}
                                            isSelected={activeSelectionId === `staff_role_${s.id}`}
                                            onSelect={onSelect}
                                            overrides={getOverride(`staff_role_${s.id}`)}
                                            traits={['content', 'typography', 'interaction']}
                                        >
                                            {(getOverride(`staff_role_${s.id}`)?.visible !== false || isInspectorActive) && (
                                                <div className={`text-[10px] font-bold uppercase tracking-wider text-blue-500 ${getOverride(`staff_role_${s.id}`)?.fontSize || ''} ${getOverride(`staff_role_${s.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`staff_role_${s.id}`)?.textColor }}>
                                                    {getOverride(`staff_role_${s.id}`)?.text || s.role}
                                                </div>
                                            )}
                                        </Selectable>
                                    </div>
                                    <button className="p-2 rounded-full bg-slate-100/10 text-slate-500">
                                        <MessageSquare size={14} />
                                    </button>
                                </PremiumCard>
                            ))}
                        </div>
                    </div>
                );

            case 'history':
                return (
                    <div className="px-4 pb-24 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 border border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
                                className="w-full h-full object-cover"
                                alt="Live Match"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">DAL {mockData.history.founded}</span>
                            </div>
                        </div>
                        <SectionHeader id="history_header" label="Titolo Storia" title="La Nostra Storia" />
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {mockData.history.story}
                        </p>
                        <SectionHeader id="history_achievements" label="Titolo Successi" title="Palmarès" />
                        <div className="space-y-3">
                            {mockData?.history?.achievements?.map((item: any, i: number) => (
                                <Selectable
                                    key={i}
                                    id={`achievement_${i}`}
                                    type="text"
                                    label={`Achievement ${item.year}`}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === `achievement_${i}`}
                                    onSelect={onSelect}
                                    overrides={getOverride(`achievement_${i}`)}
                                    traits={['content', 'typography', 'interaction']}
                                >
                                    {(getOverride(`achievement_${i}`)?.visible !== false || isInspectorActive) && (
                                        <div className={`flex items-center gap-4 p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'} ${getOverride(`achievement_${i}`)?.visible === false ? 'opacity-30 grayscale' : ''}`}>
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
                                                <Trophy size={18} />
                                            </div>
                                            <div>
                                                <div className={`text-[10px] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.year}</div>
                                                <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ color: getOverride(`achievement_${i}`)?.textColor }}>
                                                    {getOverride(`achievement_${i}`)?.text || item.title}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Selectable>
                            ))}
                        </div>
                    </div>
                );

            case 'chants':
                return (
                    <div className="px-4 pb-24 space-y-6 flex-1 flex flex-col" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader
                            id="chants_header"
                            label="Titolo Cori"
                            isFirst={true}
                            title={sportConfig.scoring.term === 'Goal' ? 'Cori & Identità' : (sportConfig.scoring.term === 'Punti' ? 'Hype & Inni' : 'Identità & Team')}
                        />
                        <div className="space-y-4">
                            {mockData?.chants?.map((chant: any) => (
                                <PremiumCard key={chant.id} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-4" id={`chant_${chant.id}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `chant_${chant.id}`} onElementSelect={onSelect}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <Music size={18} />
                                            </div>
                                            <Selectable
                                                id={`chant_title_${chant.id}`}
                                                type="text"
                                                label={`Titolo ${chant.title}`}
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `chant_title_${chant.id}`}
                                                onSelect={onSelect}
                                                overrides={getOverride(`chant_title_${chant.id}`)}
                                                traits={['content', 'typography', 'interaction']}
                                            >
                                                {(getOverride(`chant_title_${chant.id}`)?.visible !== false || isInspectorActive) && (
                                                    <div className={`font-bold text-sm ${getOverride(`chant_title_${chant.id}`)?.fontSize || ''} ${getOverride(`chant_title_${chant.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`chant_title_${chant.id}`)?.textColor }}>
                                                        {getOverride(`chant_title_${chant.id}`)?.text || chant.title}
                                                    </div>
                                                )}
                                            </Selectable>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-500">{chant.duration}</span>
                                    </div>
                                    <Selectable
                                        id={`chant_lyric_${chant.id}`}
                                        type="text"
                                        label={`Testo ${chant.title}`}
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === `chant_lyric_${chant.id}`}
                                        onSelect={onSelect}
                                        overrides={getOverride(`chant_lyric_${chant.id}`)}
                                        traits={['content', 'typography', 'interaction']}
                                    >
                                        {(getOverride(`chant_lyric_${chant.id}`)?.visible !== false || isInspectorActive) && (
                                            <div className={`p-3 bg-slate-950/30 rounded-xl border border-white/5 text-[11px] italic text-slate-400 leading-relaxed ${getOverride(`chant_lyric_${chant.id}`)?.fontSize || ''} ${getOverride(`chant_lyric_${chant.id}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`chant_lyric_${chant.id}`)?.textColor }}>
                                                "{getOverride(`chant_lyric_${chant.id}`)?.text || chant.lyric}"
                                            </div>
                                        )}
                                    </Selectable>
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 py-2 bg-blue-600 rounded-lg text-white text-[10px] font-bold">RIPRODUCI</button>
                                        <button className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-[10px] font-bold text-white">TESTO</button>
                                    </div>
                                </PremiumCard>
                            ))}
                        </div>
                    </div>
                );

            case 'sponsors':
                return (
                    <div className="px-4 pb-24 space-y-4" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="sponsors_header_main" label="Titolo Sponsor Main" title="Main Sponsors" isFirst={true} />
                        <div className="grid grid-cols-1 gap-3">
                            {mockData?.sponsors?.filter((s: any) => s.tier === 'Gold').map((s: any) => (
                                <Selectable
                                    key={s.id}
                                    id={`sponsor_${s.id}`}
                                    type="container"
                                    label={`Sponsor ${s.name}`}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === `sponsor_${s.id}`}
                                    onSelect={onSelect}
                                    overrides={getOverride(`sponsor_${s.id}`)}
                                    traits={['background', 'border', 'spacing']}
                                >
                                    {(getOverride(`sponsor_${s.id}`)?.visible !== false || isInspectorActive) && (
                                        <div className={`p-6 rounded-3xl border border-dashed flex items-center justify-center min-h-[140px] ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'} ${getOverride(`sponsor_${s.id}`)?.visible === false ? 'opacity-30 grayscale border-dashed' : ''}`}>
                                            <img src={s.image} alt={s.name} className="max-h-16 opacity-80 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                                        </div>
                                    )}
                                </Selectable>
                            ))}
                        </div>
                        <SectionHeader id="sponsors_header_partners" label="Titolo Sponsor Partner" title="Official Partners" />
                        <div className="grid grid-cols-2 gap-3">
                            {mockData?.sponsors?.filter((s: any) => s.tier !== 'Gold').map((s: any) => (
                                <div key={s.id} className={`p-4 rounded-2xl border flex items-center justify-center aspect-video ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <img src={s.image} alt={s.name} className="max-h-8 opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </div>
                );


            case 'menu':
                return (
                    <div className="px-4 pb-32 flex-1 flex flex-col space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="menu_header" label="Titolo Menu" title="Esplora Funzioni" isFirst={true} />

                        <div className="grid grid-cols-2 gap-4">
                            {(themeConfig.navigation || [])
                                .filter(item => item.id !== 'home' && item.id !== 'menu')
                                .map((item) => {
                                    const isEnabled = item.enabled;
                                    const primaryColor = currentTeam.colors.primary;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setPreviewPage(item.id)}
                                            className="relative group h-32 text-left"
                                        >
                                            <PremiumCard
                                                themeConfig={themeConfig}
                                                isDarkMode={isDarkMode}
                                                className={`h-full flex flex-col items-center justify-center gap-3 p-4 transition-all duration-300 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'} ${!isEnabled ? 'opacity-60' : ''}`}
                                                id={`menu_card_${item.id}`}
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `menu_card_${item.id}`}
                                                onElementSelect={onSelect}
                                            >
                                                <div
                                                    className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-500 group-hover:scale-110`}
                                                    style={{
                                                        backgroundColor: `${primaryColor}${isEnabled ? '15' : '10'}`,
                                                        border: `1px solid ${primaryColor}${isEnabled ? '20' : '10'}`
                                                    }}
                                                >
                                                    {renderIcon(item, false, isEnabled ? primaryColor : (isDarkMode ? '#475569' : '#94a3b8'), 24)}
                                                </div>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span
                                                        className={`text-[10px] font-black uppercase tracking-[0.1em] transition-colors duration-300 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'} ${!isEnabled ? 'text-slate-400' : ''}`}
                                                    >
                                                        {getOverride(`menu_card_${item.id}`)?.text || item.label}
                                                    </span>
                                                    <span className={`text-[8px] font-bold uppercase tracking-widest opacity-40 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {isEnabled ? 'Accedi' : 'Bloccato'}
                                                    </span>
                                                </div>
                                                {!isEnabled && (
                                                    <div className="absolute top-3 right-3 p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <Lock size={8} className="text-slate-500" />
                                                    </div>
                                                )}
                                            </PremiumCard>
                                        </button>
                                    );
                                })}
                        </div>

                        {/* Additional Quick Cards */}
                        <SectionHeader id="menu_info" label="Info Società" title="Istituzionale" />
                        <div className="grid grid-cols-1 gap-3">
                            <PremiumCard
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                                className="flex items-center gap-4 p-4"
                                id="menu_info_contacts"
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'menu_info_contacts'}
                                onElementSelect={onSelect}
                            >
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                    <MessageSquare size={18} />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold">Contatti & Supporto</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Ricevi assistenza immediata</div>
                                </div>
                                <ChevronRight className="ml-auto text-slate-400" size={16} />
                            </PremiumCard>
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="px-4 pb-24 flex-1 flex flex-col space-y-4" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="video_header" label="Titolo Video" title="Analisi Video" isFirst={true} />

                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-black flex items-center justify-center group cursor-pointer border border-white/10 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
                                className="w-full h-full object-cover opacity-60"
                                alt="Video Analysis Background"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner group-hover:scale-110 transition-transform">
                                <Play className="text-white ml-1" size={32} fill="white" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                <span className="text-[10px] font-black text-white px-2 py-1 bg-rose-600 rounded">LIVE ANALISI</span>
                                <span className="text-[10px] font-bold text-white/80">ULTIMA PARTITA</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                                <div className="text-[10px] font-bold text-blue-500 uppercase mb-1">Sessioni Archiviate</div>
                                <div className="text-xl font-black text-blue-600">24</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/20">
                                <div className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Clip Ritagliate</div>
                                <div className="text-xl font-black text-emerald-600">156</div>
                            </div>
                        </div>

                        <SectionHeader id="video_recent" label="Recenti" title="Video Recenti" />
                        {[1, 2].map(i => (
                            <PremiumCard key={i} themeConfig={themeConfig} isDarkMode={isDarkMode} className="flex gap-4 p-3" id={`video_item_${i}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `video_item_${i}`} onElementSelect={onSelect}>
                                <div className="w-24 aspect-video rounded-xl bg-slate-200 overflow-hidden relative">
                                    <img
                                        src={`https://images.unsplash.com/photo-1522778119026-d647f0565c6d?auto=format&fit=crop&w=200&q=80&sig=${i}`}
                                        className="w-full h-full object-cover"
                                        alt={`Video thumbnail ${i}`}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play size={16} className="text-white" fill="white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Selectable
                                        id={`video_category_${i}`}
                                        type="text"
                                        label="Categoria Video"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === `video_category_${i}`}
                                        onSelect={onSelect}
                                        overrides={getOverride(`video_category_${i}`)}
                                        traits={['content', 'typography', 'interaction']}
                                    >
                                        {(getOverride(`video_category_${i}`)?.visible !== false || isInspectorActive) && (
                                            <div className={`text-[10px] font-bold text-blue-500 mb-1 uppercase ${getOverride(`video_category_${i}`)?.fontSize || ''} ${getOverride(`video_category_${i}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`video_category_${i}`)?.textColor }}>
                                                {getOverride(`video_category_${i}`)?.text || 'Allenamento'}
                                            </div>
                                        )}
                                    </Selectable>
                                    <Selectable
                                        id={`video_title_${i}`}
                                        type="text"
                                        label="Titolo Video"
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === `video_title_${i}`}
                                        onSelect={onSelect}
                                        overrides={getOverride(`video_title_${i}`)}
                                        traits={['content', 'typography', 'interaction']}
                                    >
                                        {(getOverride(`video_title_${i}`)?.visible !== false || isInspectorActive) && (
                                            <div className={`text-xs font-bold leading-tight ${getOverride(`video_title_${i}`)?.fontSize || ''} ${getOverride(`video_title_${i}`)?.visible === false ? 'opacity-30 grayscale' : ''}`} style={{ color: getOverride(`video_title_${i}`)?.textColor }}>
                                                {getOverride(`video_title_${i}`)?.text || 'Analisi Tattica Fase Difensiva'}
                                            </div>
                                        )}
                                    </Selectable>
                                    <div className="text-[9px] text-slate-500 mt-2">2 GG FA • 12:45</div>
                                </div>
                            </PremiumCard>
                        ))}
                    </div>
                );

            case 'news':
            case 'news-feed':
            case 'news-media':
                return (
                    <div className="px-4 pb-24 space-y-4" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <SectionHeader id="news_header" label="Titolo News" title="News & Media" isFirst={true} />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <PremiumCard key={i} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-0 overflow-hidden" id={`news_post_${i}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `news_post_${i}`} onElementSelect={onSelect}>
                                    <div className="aspect-video relative">
                                        <img
                                            src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1508098682722-e99c43a406b2' : '1552667466-07f70cdba9f3'}?w=800&fit=crop`}
                                            className="w-full h-full object-cover"
                                            alt="News"
                                        />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded">SOCIETÀ</div>
                                    </div>
                                    <div className="p-4 text-left">
                                        <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">{i} ORA FA • NEWS</div>
                                        <div className={`text-sm font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Importante aggiornamento per la stagione 2024/25 di {currentTeam.name}</div>
                                        <div className="text-[10px] text-slate-500 mt-2 line-clamp-2">Scopri tutte le novità riguardanti il nuovo kit gara e le date dei prossimi incontri istituzionali...</div>
                                    </div>
                                </PremiumCard>
                            ))}
                        </div>
                    </div>
                );

            case 'chat':
            case 'team-chat':
                return (
                    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950" style={{ paddingTop: `${topPaddingValue}px` }}>
                        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">T</div>
                                <div>
                                    <div className="text-sm font-bold">Team Chat</div>
                                    <div className="text-[10px] text-emerald-500 font-bold uppercase">12 Online</div>
                                </div>
                            </div>
                            <Settings size={18} className="text-slate-400" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="flex justify-center">
                                <span className="text-[10px] px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500 font-bold uppercase">Oggi</span>
                            </div>
                            <div className="flex gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-slate-300 shrink-0" />
                                <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800">
                                    <div className="text-[9px] font-black text-blue-600 mb-1">Mister Rossi</div>
                                    <div className="text-xs">Ragazzi, ricordatevi l'allenamento delle 18:30. Puntuali! ⚽️</div>
                                </div>
                            </div>
                            <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 shrink-0" />
                                <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-white">
                                    <div className="text-xs">Ricevuto Mister, ci saremo tutti! 🫡</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mb-20">
                            <div className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <input placeholder="Scrivi un messaggio..." className="flex-1 bg-transparent text-xs px-2 outline-none" />
                                <button className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'lineup':
            case 'formazioni':
                return (
                    <div className="px-4 flex flex-col h-full overflow-hidden" style={{ paddingTop: `${topPaddingValue}px`, paddingBottom: '90px' }}>
                        <div className="shrink-0">
                            <SectionHeader id="lineup_header" label="Titolo Formazioni" title="Probabile Formazione" isFirst={true} />
                        </div>
                        <div className="flex-1 min-h-0 py-2">
                            <div className="aspect-[3/4] bg-emerald-600/10 rounded-3xl border-2 border-dashed border-emerald-500/20 relative flex items-center justify-center overflow-hidden">
                                <TacticsBoard
                                    sportType={currentTeam.sportType}
                                    themeConfig={themeConfig}
                                    isDarkMode={isDarkMode}
                                />
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-lg">MODALITÀ CAMPO</div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div className="p-4" style={{ paddingTop: `${topPaddingValue}px` }}>Pagina non trovata</div>;
        }
    };

    const showNavigation = previewPage !== 'intro' && previewPage !== 'auth' && previewPage !== 'splash' && previewPage !== 'login';
    const isBurger = themeConfig.navigationType === 'burger';
    const activeColor = themeConfig.tabBarStyling?.useTeamColorForActive ? (currentTeam.colors?.primary || '#4f46e5') : (themeConfig.tabBarStyling?.labelActiveColor || '#000');
    const inactiveColor = themeConfig.tabBarStyling?.labelColor || '#94a3b8';

    // Helper map for icons
    const IconMap: Record<string, any> = {
        'Layout': Layout, 'Calendar': Calendar, 'Users': Users, 'ShoppingBag': ShoppingBag,
        'Menu': Menu, 'Home': Layout, 'Newspaper': Newspaper, 'Music': Music,
        'Video': Video, 'Shield': Shield, 'PlaySquare': PlaySquare, 'Send': Send, 'Trophy': Trophy
    };

    return (
        <div className={`w-full h-full relative bg-white dark:bg-slate-950 flex flex-col overflow-hidden transition-all duration-300 ${isDarkMode ? 'dark' : ''} ${themeConfig.fontFamily ? `font-${themeConfig.fontFamily.toLowerCase().replace(' ', '-')}` : 'font-sans'}`}>

            {/* Header / StatusBar area could go here if needed */}

            {/* Main Content */}
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
                {(previewPage === 'intro' || previewPage === 'splash') ? renderSplashScreen() :
                    (previewPage === 'auth' || previewPage === 'login') ? renderLoginScreen() :
                        renderContent()}
            </div>

            {/* Navigation Bar */}
            {showNavigation && !isBurger && (
                <div className={`shrink-0 relative z-30 transition-all duration-500 ${themeConfig.navStyle !== 'classic' ? 'absolute bottom-0 left-0 right-0 p-4 pointer-events-none' :
                    'bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]'
                    }`}>
                    <div className={`flex items-center justify-around relative transition-all duration-300 pointer-events-auto ${themeConfig.navStyle === 'modern' ? 'bg-slate-900/95 backdrop-blur-2xl text-white rounded-[2.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20 mx-2 mb-2' :
                        themeConfig.navStyle === 'liquid' ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl pt-4 pb-8 px-6 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] border-t border-white/20' :
                            'py-2'
                        }`}>
                        {themeConfig.navigation
                            .filter(item => item.enabled)
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .slice(0, 5)
                            .map(item => {
                                const isActive = previewPage === item.id;
                                const Icon = IconMap[item.icon] || Layout;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setPreviewPage(item.id)}
                                        className="flex flex-col items-center justify-center p-2 relative group transition-all"
                                        style={{ gap: themeConfig.tabBarStyling?.iconSpacing || '0px' }}
                                    >
                                        <div className={`transition-all duration-500 ${isActive && themeConfig.navStyle !== 'classic' ? '-translate-y-1.5 scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`}
                                            style={{ color: isActive ? activeColor : inactiveColor }}>
                                            <Icon size={themeConfig.navStyle === 'modern' ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                        {themeConfig.navStyle === 'classic' && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider transition-colors" style={{ color: isActive ? activeColor : inactiveColor }}>
                                                {item.label}
                                            </span>
                                        )}
                                        {isActive && themeConfig.navStyle !== 'classic' && (
                                            <motion.div
                                                layoutId="activeNavTab"
                                                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: activeColor }}
                                            />
                                        )}
                                    </button>
                                );
                            })
                        }
                    </div>
                </div>
            )}
        </div>
    );
};
