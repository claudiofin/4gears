import React from 'react';
import {
    Settings, Calendar, Users, ShoppingBag, Layout, Video, Shield,
    ChevronRight, Bell, Search, Plus, User, MapPin, Clock, Trophy,
    CreditCard, BarChart3, MessageSquare, Menu, Sun, Moon, X, LogOut,
    Package, Send, Gauge, Info, BookOpen, Music, Award, Edit2, Trash2, Play, Lock,
    ArrowLeft, Reply, CheckCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Selectable } from '../../builder/VisualInspector';
import { AppTier, UserPersona, ViewMode, FeatureFlags, ThemeConfig, ComponentOverride, NavItem } from '@/types/builder';
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
        headerHeight
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
            className={`${isFirst ? 'mt-0' : 'mt-6'} mb-3 px-1`}
        >
            <h3
                className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} ${getOverride(id)?.fontSize || ''}`}
                style={{ color: getOverride(id)?.textColor }}
            >
                {getOverride(id)?.text || title}
            </h3>
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
            Info, BookOpen, Music, Award, Bell, MessageSquare
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

    const renderAdminDashboard = (padding: number) => (
        <div className={`p-4 pb-32 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500`} style={{ paddingTop: `${padding}px` }}>
            <SectionHeader id="admin_header" label="Titolo Dashboard" title="Statistiche Generali" isFirst={true} />

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Selectable
                    id="admin_kpi_fans"
                    type="card"
                    label="KPI Fan Coin"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'admin_kpi_fans'}
                    onSelect={onSelect}
                    overrides={getOverride('admin_kpi_fans')}
                    className={`p-4 ${getCardClass(true)}`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                            <Users size={14} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Fan Coin</span>
                    </div>
                    <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>45.2K</div>
                    <div className="text-emerald-500 text-[10px] font-bold flex items-center gap-1 mt-2">
                        <Plus size={10} /> +12% rispetto a ieri
                    </div>
                </Selectable>

                <Selectable
                    id="admin_kpi_revenue"
                    type="card"
                    label="KPI Entrate"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'admin_kpi_revenue'}
                    onSelect={onSelect}
                    overrides={getOverride('admin_kpi_revenue')}
                    className={`p-4 ${getCardClass(true)}`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <ShoppingBag size={14} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Entrate</span>
                    </div>
                    <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>€8.2K</div>
                    <div className="text-emerald-500 text-[10px] font-bold flex items-center gap-1 mt-2">
                        <Plus size={10} /> +5% vs target
                    </div>
                </Selectable>
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
                className={`p-4 ${getCardClass(true)}`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stato del Team</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold border border-emerald-500/20">OPERATIVO</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mockData.players.length}</div>
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
                <div className="grid grid-cols-2 gap-2">
                    <button className={`flex flex-col gap-2 p-3 rounded-2xl border text-[10px] font-bold transition-all text-left ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 w-fit">
                            <Plus size={14} />
                        </div>
                        AGGIUNGI ATLETA
                    </button>
                    <button className={`flex flex-col gap-2 p-3 rounded-2xl border text-[10px] font-bold transition-all text-left ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 w-fit">
                            <Calendar size={14} />
                        </div>
                        CREA EVENTO
                    </button>
                    <button className={`flex flex-col gap-2 p-3 rounded-2xl border text-[10px] font-bold transition-all text-left ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 w-fit">
                            <Package size={14} />
                        </div>
                        NUOVO PRODOTTO
                    </button>
                    <button className={`flex flex-col gap-2 p-3 rounded-2xl border text-[10px] font-bold transition-all text-left ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 w-fit">
                            <Send size={14} />
                        </div>
                        NOTIFICA PUSH
                    </button>
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
                className={`p-4 ${getCardClass(true)}`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Gestione Sponsor</h3>
                    <button className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="space-y-3">
                    {mockData.sponsors.slice(0, 3).map((s: any) => (
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

    switch (currentPage) {
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
                                >
                                    <span
                                        className={`text-[10px] font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('home_team_label')?.fontSize || ''}`}
                                        style={{ color: getOverride('home_team_label')?.textColor }}
                                    >
                                        {getOverride('home_team_label')?.text || 'CASA'}
                                    </span>
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
                                >
                                    <span
                                        className={`text-3xl font-black block tracking-tighter w-full ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('match_vs_text')?.fontSize || ''}`}
                                        style={{ color: getOverride('match_vs_text')?.textColor }}
                                    >
                                        {getOverride('match_vs_text')?.text || 'VS'}
                                    </span>
                                </Selectable>
                                <Selectable
                                    id="match_time_text"
                                    type="text"
                                    label="Orario Match"
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === 'match_time_text'}
                                    onSelect={onSelect}
                                    overrides={getOverride('match_time_text')}
                                >
                                    <span
                                        className={`text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block ${getOverride('match_time_text')?.fontSize || ''}`}
                                        style={{ color: getOverride('match_time_text')?.textColor }}
                                    >
                                        {getOverride('match_time_text')?.text || '15:00'}
                                    </span>
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
                                >
                                    <span
                                        className={`text-[10px] font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('away_team_label')?.fontSize || ''}`}
                                        style={{ color: getOverride('away_team_label')?.textColor }}
                                    >
                                        {getOverride('away_team_label')?.text || 'TRASFERTA'}
                                    </span>
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
                                    >
                                        <span
                                            className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} ${getOverride(`home_quick_${item.id}`)?.fontSize || ''}`}
                                            style={{ color: getOverride(`home_quick_${item.id}`)?.textColor }}
                                        >
                                            {getOverride(`home_quick_${item.id}`)?.text || item.label}
                                        </span>
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
                                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" />
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
                                {mockData.sponsors.map((s: any, i: number) => (
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
                                                <img src={`https://images.unsplash.com/photo-${i === 1 ? '1508098682722-e99c43a406b2' : '1552667466-07f70cdba9f3'}?w=200&h=200&fit=crop`} className="w-full h-full object-cover" />
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
                        {mockData.players.map((player: any) => {
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
                                            <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{player.name}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{player.role}</div>
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
                        >
                            <h3
                                className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride('upcoming_events_title')?.fontSize || ''}`}
                                style={{ color: getOverride('upcoming_events_title')?.textColor }}
                            >
                                {getOverride('upcoming_events_title')?.text || 'Prossimi Eventi'}
                            </h3>
                        </Selectable>
                        {mockData.events.map((event: any) => (
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
                                            <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</div>
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
                                        >
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300
                                                    ${isInCart ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-900 group-hover:bg-blue-600 group-hover:text-white'}`}
                                                style={{
                                                    backgroundColor: isInCart ? undefined : getOverride(`shop_add_${i}`)?.backgroundColor,
                                                    color: isInCart ? undefined : getOverride(`shop_add_${i}`)?.textColor
                                                }}
                                            >
                                                {isInCart ? <CheckCheck size={16} /> : <Plus size={16} />}
                                            </button>
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
                                        >
                                            <div
                                                className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} ${getOverride(`shop_title_${i}`)?.fontSize || ''}`}
                                                style={{ color: getOverride(`shop_title_${i}`)?.textColor }}
                                            >
                                                {getOverride(`shop_title_${i}`)?.text || product.name}
                                            </div>
                                        </Selectable>
                                        <Selectable
                                            id={`shop_suffix_${i}`}
                                            type="text"
                                            label="Sottotitolo Prodotto"
                                            isInspectorActive={isInspectorActive}
                                            isSelected={activeSelectionId === `shop_suffix_${i}`}
                                            onSelect={onSelect}
                                            overrides={getOverride(`shop_suffix_${i}`)}
                                        >
                                            <div
                                                className={`text-[9px] mt-0.5 font-medium tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${getOverride(`shop_suffix_${i}`)?.fontSize || ''}`}
                                                style={{ color: getOverride(`shop_suffix_${i}`)?.textColor }}
                                            >
                                                {getOverride(`shop_suffix_${i}`)?.text || 'Official Merchandise'}
                                            </div>
                                        </Selectable>
                                        <Selectable
                                            id={`shop_price_${i}`}
                                            type="text"
                                            label="Prezzo Prodotto"
                                            isInspectorActive={isInspectorActive}
                                            isSelected={activeSelectionId === `shop_price_${i}`}
                                            onSelect={onSelect}
                                            overrides={getOverride(`shop_price_${i}`)}
                                        >
                                            <div
                                                className={`mt-2 font-black text-blue-600 ${getOverride(`shop_price_${i}`)?.fontSize || ''}`}
                                                style={{ color: getOverride(`shop_price_${i}`)?.textColor }}
                                            >
                                                {getOverride(`shop_price_${i}`)?.text || product.price}
                                            </div>
                                        </Selectable>
                                    </div>
                                </PremiumCard>
                            );
                        })}
                    </div>

                    {/* Cart Tooltip/Button if items exist */}
                    {cartCount > 0 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="fixed bottom-24 right-8 z-[60]"
                        >
                            <button className="relative p-4 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-110 transition-all group">
                                <ShoppingBag size={24} />
                                <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                                    {cartCount}
                                </span>
                            </button>
                        </motion.div>
                    )}
                </div>
            );

        case 'staff':
            return (
                <div className="px-4 pb-24 space-y-4" style={{ paddingTop: `${topPaddingValue}px` }}>
                    <SectionHeader id="staff_header" label="Titolo Organigramma" title="Staff Societario" isFirst={true} />
                    <div className="space-y-3">
                        {mockData.staff.map((s: any) => (
                            <PremiumCard key={s.id} themeConfig={themeConfig} isDarkMode={isDarkMode} className="flex items-center gap-4 p-3" id={`staff_${s.id}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `staff_${s.id}`} onElementSelect={onSelect}>
                                <div className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden relative border border-slate-700/30">
                                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{s.name}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500">{s.role}</div>
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
                        <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
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
                        {mockData.history.achievements.map((item: any, i: number) => (
                            <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
                                    <Trophy size={18} />
                                </div>
                                <div>
                                    <div className={`text-[10px] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.year}</div>
                                    <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</div>
                                </div>
                            </div>
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
                        {mockData.chants.map((chant: any) => (
                            <PremiumCard key={chant.id} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-4" id={`chant_${chant.id}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `chant_${chant.id}`} onElementSelect={onSelect}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                            <Music size={18} />
                                        </div>
                                        <div className="font-bold text-sm">{chant.title}</div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">{chant.duration}</span>
                                </div>
                                <div className="p-3 bg-slate-950/30 rounded-xl border border-white/5 text-[11px] italic text-slate-400 leading-relaxed">
                                    "{chant.lyric}"
                                </div>
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
                        {mockData.sponsors.filter((s: any) => s.tier === 'Gold').map((s: any) => (
                            <div key={s.id} className={`p-6 rounded-3xl border border-dashed flex items-center justify-center min-h-[140px] ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <img src={s.image} alt={s.name} className="max-h-16 opacity-80 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                            </div>
                        ))}
                    </div>
                    <SectionHeader id="sponsors_header_partners" label="Titolo Sponsor Partner" title="Official Partners" />
                    <div className="grid grid-cols-2 gap-3">
                        {mockData.sponsors.filter((s: any) => s.tier !== 'Gold').map((s: any) => (
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
                            .map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setPreviewPage(item.id)}
                                    className="relative group h-32 text-left"
                                >
                                    <PremiumCard
                                        themeConfig={themeConfig}
                                        isDarkMode={isDarkMode}
                                        className="h-full flex flex-col items-center justify-center gap-3 p-4 group-hover:scale-[1.02] transition-transform"
                                        id={`menu_card_${item.id}`}
                                        isInspectorActive={isInspectorActive}
                                        isSelected={activeSelectionId === `menu_card_${item.id}`}
                                        onElementSelect={onSelect}
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                            {renderIcon(item, false, item.enabled ? (isDarkMode ? '#818cf8' : '#4f46e5') : '#475569', 24)}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                                        {!item.enabled && (
                                            <div className="absolute top-2 right-2">
                                                <Lock size={10} className="text-slate-500" />
                                            </div>
                                        )}
                                    </PremiumCard>
                                </button>
                            ))}
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
                        <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-60" />
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
                                <img src={`https://images.unsplash.com/photo-1522778119026-d647f0565c6d?auto=format&fit=crop&w=200&q=80&sig=${i}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play size={16} className="text-white" fill="white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-bold text-blue-500 mb-1 uppercase">Allenamento</div>
                                <div className="text-xs font-bold leading-tight">Analisi Tattica Fase Difensiva</div>
                                <div className="text-[9px] text-slate-500 mt-2">2 GG FA • 12:45</div>
                            </div>
                        </PremiumCard>
                    ))}
                </div>
            );

        default:
            return <div className="p-4" style={{ paddingTop: `${topPaddingValue}px` }}>Pagina non trovata</div>;
    }
};
