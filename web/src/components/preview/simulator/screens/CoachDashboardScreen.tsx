import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { TacticsBoard } from '@/components/ui/TacticsBoard';
import { Gauge, Users, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const CoachDashboardScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    currentTeam,
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
                id="coach_header"
                label="Titolo Dashboard Coach"
                title="Status Squadra"
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
                    id="coach_readiness"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'coach_readiness'}
                    onElementSelect={onSelect}
                    className="p-4"
                    traits={['background', 'border', 'spacing', 'content']}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Gauge size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Readiness</span>
                    </div>
                    <div className="text-2xl font-black italic">94%</div>
                </PremiumCard>

                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="coach_attendance"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'coach_attendance'}
                    onElementSelect={onSelect}
                    className="p-4"
                    traits={['background', 'border', 'spacing', 'content']}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Presenti</span>
                    </div>
                    <div className="text-2xl font-black italic">18/22</div>
                </PremiumCard>
            </div>

            <SectionHeader
                id="coach_tactics_header"
                label="Header Tattiche"
                title="Lavagna Tattica"
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />
            <div className={`aspect-[4/3] rounded-[32px] overflow-hidden border shadow-xl ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <TacticsBoard
                    sportType={currentTeam.sportType}
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                />
            </div>

            <SectionHeader
                id="coach_session_header"
                label="Header Allenamento"
                title="Sessione Odierna"
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />
            <div className={`p-5 ${getCardClass(true)} `}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Clock size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold">Training #42</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Oggi, 17:30 - Campo A</div>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-500 text-[9px] font-black uppercase">Pronto</div>
                </div>
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <CheckCircle2 size={12} className="text-emerald-500" /> Riscaldamento (15')
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 opacity-50">
                        <Calendar size={12} /> Esercitazione Tattica (30')
                    </div>
                </div>
            </div>
        </div>
    );
};
