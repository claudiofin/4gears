import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { Award, Target, Zap, Heart, TrendingUp, ChevronRight } from 'lucide-react';

export const AthleteDashboardScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    getCardClass
}) => {
    return (
        <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="athlete_header"
                label="Titolo Dashboard Atleta"
                title="Il Mio Stato"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            <div className="grid grid-cols-2 gap-3">
                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="athlete_form"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'athlete_form'}
                    onElementSelect={onSelect}
                    className="p-4"
                    traits={['background', 'border', 'spacing', 'content']}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Forma</span>
                    </div>
                    <div className="text-2xl font-black italic">OTTIMA</div>
                </PremiumCard>

                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="athlete_heart"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'athlete_heart'}
                    onElementSelect={onSelect}
                    className="p-4"
                    traits={['background', 'border', 'spacing', 'content']}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Heart size={16} className="text-rose-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recupero</span>
                    </div>
                    <div className="text-2xl font-black italic">88%</div>
                </PremiumCard>
            </div>

            <SectionHeader
                id="athlete_stats_header"
                label="Header Statistiche"
                title="Performance"
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />
            <div className={`p-5 ${getCardClass(true)} `}>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Gol</div>
                        <div className="text-xl font-black">12</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Assist</div>
                        <div className="text-xl font-black">8</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Rating</div>
                        <div className="text-xl font-black">7.4</div>
                    </div>
                </div>
            </div>

            <SectionHeader
                id="athlete_mentoring_header"
                label="Header Mentoring"
                title="Obiettivi Stagionali"
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />
            <div className="space-y-3">
                {[
                    { title: "Migliora Forza", progress: 65, icon: TrendingUp },
                    { title: "Precisione Tiri", progress: 40, icon: Target },
                    { title: "Leadership", progress: 85, icon: Award }
                ].map((goal, i) => (
                    <div key={i} className={`p-4 ${getCardClass(true)} flex items-center gap-4`}>
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <goal.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-xs font-bold">{goal.title}</span>
                                <span className="text-[10px] font-bold text-slate-500">{goal.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${goal.progress}%` }} />
                            </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                    </div>
                ))}
            </div>
        </div>
    );
};
