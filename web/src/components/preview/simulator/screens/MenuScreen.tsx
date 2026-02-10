import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import {
    Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
    BookOpen, Music, Award, MessageSquare, Menu, Newspaper,
    Settings, Bell, Heart, Star, Info, UserCheck
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
    BookOpen, Music, Award, MessageSquare, Menu, Newspaper,
    Settings, Bell, Heart, Star, Info, UserCheck
};

const renderIcon = (iconName: string, size = 22) => {
    const Icon = iconMap[iconName] || Layout;
    return <Icon size={size} />;
};

export const MenuScreen: React.FC<InteractiveScreenProps & { activeFeatures: any; featureFlags?: any }> = ({
    themeConfig,
    isDarkMode,
    currentTeam,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    activeFeatures,
    setPreviewPage,
    featureFlags
}) => {
    // Collect all navigable items (nav items + features)
    const navItems = (themeConfig.navigation || [])
        .filter(n => n.enabled && n.id !== 'home' && n.id !== 'menu')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const featureItems = Object.entries(featureFlags || {})
        .filter(([_, f]: [string, any]) => f && f.enabled)
        .filter(([id]) => !navItems.some(n => n.id === id)) // avoid duplicates
        .map(([id, f]: [string, any]) => ({
            id,
            label: f.label,
            icon: getFeatureIcon(id),
            accessible: activeFeatures[id] !== false
        }));

    return (
        <div className="pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
            <div className="px-6 space-y-6">
                {/* Section: Navigation Pages */}
                <SectionHeader
                    id="menu_nav_section"
                    label="Sezioni App"
                    title="Sezioni"
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    activeSelectionId={activeSelectionId}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />

                <div className="grid grid-cols-3 gap-3">
                    {navItems.map((item) => (
                        <PremiumCard
                            key={item.id}
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            className="p-4 flex flex-col items-center gap-3 group cursor-pointer hover:scale-[1.03] active:scale-95 transition-all"
                            id={`menu_item_${item.id}`}
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === `menu_item_${item.id}`}
                            onElementSelect={onSelect}
                        >
                            <div
                                onClick={() => setPreviewPage(item.id)}
                                className="flex flex-col items-center gap-3 w-full"
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${isDarkMode
                                        ? 'bg-slate-700/50 text-slate-300 group-hover:bg-primary/20 group-hover:text-primary'
                                        : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'
                                    }`}>
                                    {renderIcon(item.icon)}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider text-center leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                    {item.label}
                                </span>
                            </div>
                        </PremiumCard>
                    ))}
                </div>

                {/* Section: Features */}
                {featureItems.length > 0 && (
                    <>
                        <SectionHeader
                            id="menu_features_section"
                            label="Funzionalità"
                            title="Funzionalità"
                            isDarkMode={isDarkMode}
                            isInspectorActive={isInspectorActive}
                            activeSelectionId={activeSelectionId}
                            onSelect={onSelect}
                            getOverride={getOverride}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            {featureItems.map((item) => (
                                <PremiumCard
                                    key={item.id}
                                    themeConfig={themeConfig}
                                    isDarkMode={isDarkMode}
                                    className={`p-4 flex flex-col items-center gap-3 group cursor-pointer hover:scale-[1.03] active:scale-95 transition-all ${!item.accessible ? 'opacity-40 grayscale' : ''
                                        }`}
                                    id={`menu_feature_${item.id}`}
                                    isInspectorActive={isInspectorActive}
                                    isSelected={activeSelectionId === `menu_feature_${item.id}`}
                                    onElementSelect={onSelect}
                                >
                                    <div
                                        onClick={() => item.accessible && setPreviewPage(item.id)}
                                        className="flex flex-col items-center gap-3 w-full"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${isDarkMode
                                                ? 'bg-slate-700/50 text-slate-300 group-hover:bg-primary/20 group-hover:text-primary'
                                                : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'
                                            }`}>
                                            {renderIcon(item.icon)}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider text-center leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </PremiumCard>
                            ))}
                        </div>
                    </>
                )}

                {/* Club Info Footer */}
                <div className={`rounded-2xl p-5 mt-4 text-center ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                    }`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        {currentTeam.logo && (
                            <img src={currentTeam.logo} alt="" className="w-10 h-10 rounded-xl object-contain" />
                        )}
                        <div>
                            <div className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {currentTeam.name}
                            </div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                App Ufficiale
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function getFeatureIcon(featureId: string): string {
    const map: Record<string, string> = {
        news: 'BookOpen',
        tactics: 'Gauge',
        video: 'Video',
        shop: 'ShoppingBag',
        events: 'Calendar',
        chat: 'MessageSquare',
        lineup: 'Users',
        sponsors: 'Shield',
        chants: 'Music',
        staff: 'UserCheck'
    };
    return map[featureId] || 'Layout';
}
