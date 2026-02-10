import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SimulatorHero } from '../SimulatorHero';
import { Selectable } from '@/components/builder/VisualInspector';
import { Play, Music, Clock, MapPin, ChevronRight } from 'lucide-react';

export const HomeScreen: React.FC<InteractiveScreenProps & { activeFeatures: any; getIconProps: any }> = ({
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
    sportConfig
}) => {
    return (
        <div className="pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
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
                {/* Universal Menu Items in Home */}
                {themeConfig.header?.enableUniversalMenu && (themeConfig.header?.universalMenuItems?.length ?? 0) > 0 && (
                    <div className="grid grid-cols-4 gap-4 py-2">
                        {themeConfig.header.universalMenuItems?.map((item: any) => (
                            <div key={item.id} className="flex flex-col items-center gap-2">
                                <div
                                    onClick={() => setPreviewPage(item.pageId)}
                                    className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/10"
                                >
                                    <span className="text-xl">{item.icon}</span>
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
                                        <span className={`text-[10px] font-bold text-center leading-tight uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} `}>
                                            {getOverride(`home_quick_${item.id}`)?.text || item.label}
                                        </span>
                                    )}
                                </Selectable>
                            </div>
                        ))}
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
