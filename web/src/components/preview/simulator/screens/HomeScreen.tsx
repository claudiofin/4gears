import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SimulatorHero } from '../SimulatorHero';
import { Selectable } from '@/components/builder/VisualInspector';
import {
    Play, Music, Clock, MapPin, ChevronRight,
    Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
    Info, BookOpen, MessageSquare, Menu, Award
} from 'lucide-react';

// Help helper for icons
const renderMenuIcon = (iconName: string, isDarkMode: boolean) => {
    const iconMap: Record<string, React.ElementType> = {
        Layout, Calendar, Users, ShoppingBag, Shield, Video, Gauge,
        Info, BookOpen, Music, Award, MessageSquare, Menu
    };
    const IconComponent = iconMap[iconName] || Layout;
    return <IconComponent size={20} />;
};

export const HomeScreen: React.FC<InteractiveScreenProps & { activeFeatures: any; getIconProps: any; featureFlags?: any }> = ({
    themeConfig,
    isDarkMode,
    currentTeam,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    mockData,
    activeFeatures,
    getIconProps,
    setPreviewPage,
    sportConfig,
    featureFlags
}) => {
    const isUnified = themeConfig.header?.headerStyle === 'unified';

    return (
        <div className="pb-32 space-y-6" style={{ paddingTop: isUnified ? '0px' : `${topPaddingValue}px` }}>
            <SimulatorHero
                themeConfig={themeConfig}
                currentTeam={currentTeam}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
                sportConfig={sportConfig}
            />

            <div className="px-6 space-y-6">
                {/* Universal Menu Items in Home (Widget Mode) */}
                {themeConfig.header?.enableUniversalMenu &&
                    themeConfig.header?.universalMenuPlacement === 'body' &&
                    (themeConfig.header?.universalMenuItems?.length ?? 0) > 0 && (
                        <div className="space-y-4">
                            <SectionHeader
                                id="home_quick_access"
                                label="Menu Rapido Home"
                                title="Accesso Rapido"
                                isDarkMode={isDarkMode}
                                isInspectorActive={isInspectorActive}
                                activeSelectionId={activeSelectionId}
                                onSelect={onSelect}
                                getOverride={getOverride}
                            />

                            <div className="grid grid-cols-4 gap-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {themeConfig.header.universalMenuItems?.map((itemId: any) => {
                                    let type = 'nav';
                                    let id = itemId;
                                    let label = '';
                                    let iconName = 'Layout';
                                    let pageId = '';

                                    if (typeof itemId === 'string' && itemId.includes(':')) {
                                        const parts = itemId.split(':');
                                        type = parts[0];
                                        id = parts[1];
                                    }

                                    if (type === 'nav') {
                                        const navItem = (themeConfig.navigation || []).find(n => n.id === id);
                                        if (!navItem) return null;
                                        label = navItem.label;
                                        iconName = navItem.icon;
                                        pageId = navItem.id;
                                    } else {
                                        const feature = Object.values(featureFlags || {}).find((f: any) => f && typeof f === 'object' && f.id === id);
                                        if (!feature) return null;
                                        label = (feature as any).label;
                                        const featureIconMap: Record<string, string> = {
                                            news: 'BookOpen', tactics: 'Gauge', video: 'Video', shop: 'ShoppingBag',
                                            events: 'Calendar', chat: 'MessageSquare', lineup: 'Users',
                                            sponsors: 'Shield', chants: 'Music', staff: 'Users'
                                        };
                                        iconName = featureIconMap[id] || 'Layout';
                                        pageId = id;
                                    }

                                    return (
                                        <div key={itemId} className="flex flex-col items-center gap-2 group">
                                            <div
                                                onClick={() => pageId && setPreviewPage(pageId)}
                                                className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-all cursor-pointer border ${isDarkMode
                                                    ? 'bg-slate-800/50 backdrop-blur-md text-slate-300 border-white/5 group-hover:border-white/20'
                                                    : 'bg-white text-slate-600 border-slate-100 group-hover:border-slate-200 shadow-md'
                                                    }`}
                                            >
                                                <div className="transition-transform duration-300 group-hover:rotate-6">
                                                    {renderMenuIcon(iconName, isDarkMode)}
                                                </div>
                                            </div>
                                            <Selectable
                                                id={`home_quick_${id}`}
                                                type="text"
                                                label={`Etichetta ${label}`}
                                                isInspectorActive={isInspectorActive}
                                                isSelected={activeSelectionId === `home_quick_${id}`}
                                                onSelect={onSelect}
                                                overrides={getOverride(`home_quick_${id}`)}
                                                traits={['content', 'typography', 'interaction']}
                                            >
                                                {(getOverride(`home_quick_${id}`)?.visible !== false || isInspectorActive) && (
                                                    <span className={`text-[9px] font-black text-center leading-tight uppercase tracking-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} transition-colors group-hover:text-primary`}>
                                                        {getOverride(`home_quick_${id}`)?.text || label}
                                                    </span>
                                                )}
                                            </Selectable>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                {/* Additional Layout Elements (Widgets) */}
                {activeFeatures.video && (
                    <>
                        <SectionHeader id="home_video_section" label="Sezione Video Home" title="Focus Video" isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
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
                        <SectionHeader id="home_sponsor_section" label="Sezione Sponsor Home" title="Main Sponsors" isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
                        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                            {mockData?.sponsors?.map((s: any) => (
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
                                    <img src={s.image} alt={s.name} className="max-w-full max-h-full grayscale opacity-50 transition-all" />
                                </PremiumCard>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
