import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import {
    Play, Clock, MapPin, Calendar, ShoppingBag, Video
} from 'lucide-react';


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
    return (
        <div className="pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue + 16}px` }}>
            {/* Hero content is always integrated into the SimulatorHeader mega-header */}

            <div className="px-6 space-y-6">
                {/* Universal menu is always shown in the header on home — no duplication here */}

                {/* WIDGET: NEXT MATCH (Only for Fans/Users if events active) */}
                {activeFeatures.events && (
                    <>
                        <SectionHeader id="home_next_match_header" label="Header Prossimo Match" title="Prossimo Match" isFirst={true} isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
                        <PremiumCard themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-0 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10" id="home_match_card" isInspectorActive={isInspectorActive} isSelected={activeSelectionId === 'home_match_card'} onElementSelect={onSelect}>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center p-2 shadow-inner">
                                            <img src={currentTeam.logo} className="w-10 h-10 object-contain" alt="Home Team" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-center w-16 truncate">{currentTeam.name}</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full mb-2 tracking-widest">LIVE IN 2 DAYS</div>
                                        <div className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                            <span>--</span>
                                            <span className="text-slate-300 dark:text-slate-600">:</span>
                                            <span>--</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{sportConfig.scoring.period}</div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center p-2 shadow-inner">
                                            <img src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop&q=80" className="w-10 h-10 object-contain opacity-50 grayscale" alt="Away Team" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-center w-16 truncate">Real Rival</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-500/10">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                        <Calendar size={12} className="text-primary" /> Dom 12 Mag
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                        <MapPin size={12} className="text-primary" /> Stadio Olimpico
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>
                    </>
                )}

                {/* WIDGET: LATEST NEWS (Only if news active) */}
                {activeFeatures.news && (
                    <>
                        <SectionHeader id="home_news_header" label="Header Ultime News" title="Notizie dal Campo" isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <PremiumCard key={i} themeConfig={themeConfig} isDarkMode={isDarkMode} className="p-0 overflow-hidden hover:translate-x-1 transition-transform" id={`home_news_row_${i}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `home_news_row_${i}`} onElementSelect={onSelect}>
                                    <div className="flex gap-4 p-3" onClick={() => setPreviewPage('news')}>
                                        <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden shrink-0 shadow-sm">
                                            <img src={`https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=200&q=80&sig=${i + 10}`} className="w-full h-full object-cover" alt="News" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center gap-1">
                                            <div className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">News Società</div>
                                            <h4 className="text-sm font-bold leading-tight line-clamp-2">L'allenamento a porte aperte di questo pomeriggio</h4>
                                            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                                                <Clock size={10} /> 45 min fa
                                            </div>
                                        </div>
                                    </div>
                                </PremiumCard>
                            ))}
                            <button
                                onClick={() => setPreviewPage('news')}
                                className="w-full py-3 rounded-xl border border-dotted border-slate-300 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors hover:border-primary/30"
                            >
                                Vedi tutte le notizie
                            </button>
                        </div>
                    </>
                )}

                {/* WIDGET: SHOP HIGHLIGHT (Only if shop active) */}
                {activeFeatures.shop && (
                    <>
                        <SectionHeader id="home_shop_header" label="Header Shop Home" title="Official Store" isDarkMode={isDarkMode} isInspectorActive={isInspectorActive} activeSelectionId={activeSelectionId} onSelect={onSelect} getOverride={getOverride} />
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
                            {[
                                { name: 'Kit Gara Home', price: '€89.90', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80' },
                                { name: 'Sciarpa Team', price: '€19.90', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=200&q=80' },
                                { name: 'Zaino Tecnico', price: '€49.90', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80' }
                            ].map((p, i) => (
                                <PremiumCard key={i} themeConfig={themeConfig} isDarkMode={isDarkMode} className="min-w-[140px] p-0 overflow-hidden shrink-0 group border-transparent hover:border-primary/20" id={`home_shop_item_${i}`} isInspectorActive={isInspectorActive} isSelected={activeSelectionId === `home_shop_item_${i}`} onElementSelect={onSelect}>
                                    <div className="aspect-[4/5] relative overflow-hidden bg-slate-100 dark:bg-slate-900" onClick={() => setPreviewPage('shop')}>
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ShoppingBag size={12} />
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="text-[10px] font-black tracking-tight truncate uppercase leading-none">{p.name}</div>
                                        <div className="text-xs font-black text-primary mt-1.5 leading-none">{p.price}</div>
                                    </div>
                                </PremiumCard>
                            ))}
                        </div>
                    </>
                )}
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
