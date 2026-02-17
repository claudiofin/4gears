import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SmartText } from '../SmartElements';
import {
    Users, ClipboardList, TrendingUp, Calendar,
    MessageSquare, AlertCircle, ChevronRight, Activity, Target, Shirt, Timer, Zap
} from 'lucide-react';

export const CoachDashboardScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    onLockedAction,
    currentScenario
}) => {
    const [activeTab, setActiveTab] = React.useState<'overview' | 'playbook' | 'squad'>('overview');

    // MATCHDAY MODE
    if (currentScenario === 'LIVE_MATCH') {
        return (
            <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
                <SectionHeader
                    id="coach_match_header"
                    label="Header Matchday"
                    title="Live Match Control"
                    isFirst={true}
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    activeSelectionId={activeSelectionId}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />

                {/* LIVE TACTICAL BOARD */}
                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="coach_live_tactics"
                    label="Lavagna Tattica Live"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'coach_live_tactics'}
                    onElementSelect={onSelect}
                    className="p-5 bg-slate-900 text-white relative overflow-hidden"
                    traits={['background', 'border', 'spacing']}
                >
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">In Corso - 2° Tempo</span>
                        </div>
                        <div className="text-xl font-black">2 - 1</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        <div className="p-3 rounded-xl bg-white/10 border border-white/5 text-center">
                            <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Possesso</div>
                            <div className="text-lg font-black">58%</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/10 border border-white/5 text-center">
                            <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Tiri</div>
                            <div className="text-lg font-black">12 (5)</div>
                        </div>
                    </div>
                </PremiumCard>

                {/* BENCH MANAGEMENT */}
                <SectionHeader
                    id="coach_bench_header"
                    label="Header Panchina"
                    title="Gestione Panchina"
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    activeSelectionId={activeSelectionId}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />

                <div className="space-y-3">
                    {[
                        { id: 'sub_1', name: 'M. Rinaldi', role: 'ATT', cond: 92 },
                        { id: 'sub_2', name: 'L. Moretti', role: 'CEN', cond: 88 }
                    ].map((player, i) => (
                        <PremiumCard
                            key={i}
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id={`coach_sub_${i}`}
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === `coach_sub_${i}`}
                            onElementSelect={onSelect}
                            className="p-3"
                            onClick={() => onLockedAction?.('substitution', 'Effettua Sostituzione')}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                        <Shirt size={14} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold">{player.name}</div>
                                        <div className="text-[9px] text-slate-500 font-black uppercase">{player.role} • {player.cond}% Cond.</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-md bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider">
                                    Entra
                                </div>
                            </div>
                        </PremiumCard>
                    ))}
                </div>

                {/* LIVE INSIGHTS */}
                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="coach_live_insight"
                    className="p-4 border-amber-500/20 bg-amber-500/5 mt-4"
                >
                    <div className="flex gap-3">
                        <Zap size={18} className="text-amber-500 shrink-0" />
                        <div>
                            <div className="text-xs font-bold text-amber-500 mb-1">Insight Tattico</div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                La squadra avversaria sta lasciando spazi sulla fascia sinistra. Considera di inserire un esterno veloce.
                            </p>
                        </div>
                    </div>
                </PremiumCard>

            </div>
        );
    }

    return (
        <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="coach_header"
                label="Titolo Dashboard Coach"
                title="Centro Tecnico"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            {/* TAB SELECTOR */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'playbook', label: 'Playbook' },
                    { id: 'squad', label: 'Squadra' }
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isActive ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="coach_attendance_card"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'coach_attendance_card'}
                            onElementSelect={onSelect}
                            className="p-4"
                            traits={['background', 'border', 'spacing']}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={16} className="text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Presenze</span>
                            </div>
                            <SmartText
                                id="coach_attendance_val"
                                label="Valore Presenze"
                                fallback="18/22"
                                type="text"
                                traits={['typography', 'content']}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'coach_attendance_val'}
                                onSelect={onSelect}
                                overrides={getOverride('coach_attendance_val')}
                                className="text-2xl font-black italic"
                            />
                        </PremiumCard>

                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="coach_readiness_card"
                            isInspectorActive={isInspectorActive}
                            isSelected={activeSelectionId === 'coach_readiness_card'}
                            onElementSelect={onSelect}
                            className="p-4"
                            traits={['background', 'border', 'spacing']}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Readiness</span>
                            </div>
                            <SmartText
                                id="coach_readiness_val"
                                label="Valore Readiness"
                                fallback="84%"
                                type="text"
                                traits={['typography', 'content']}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'coach_readiness_val'}
                                onSelect={onSelect}
                                overrides={getOverride('coach_readiness_val')}
                                className="text-2xl font-black italic"
                            />
                        </PremiumCard>
                    </div>

                    <SectionHeader
                        id="coach_focus_header"
                        label="Header Focus"
                        title="Focus Allenamento"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="coach_focus_card"
                        label="Card Focus Giornaliero"
                        isInspectorActive={isInspectorActive}
                        isSelected={activeSelectionId === 'coach_focus_card'}
                        onElementSelect={onSelect}
                        className="p-5 relative overflow-hidden group"
                        traits={['background', 'border', 'spacing']}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Target size={14} className="text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Obiettivo Oggi</span>
                            </div>
                            <SmartText
                                id="coach_focus_title"
                                label="Titolo Focus"
                                fallback="Transizione Difensiva 4-3-3"
                                type="text"
                                traits={['typography', 'content']}
                                isInspectorActive={isInspectorActive}
                                isSelected={activeSelectionId === 'coach_focus_title'}
                                onSelect={onSelect}
                                overrides={getOverride('coach_focus_title')}
                                className="text-lg font-black italic mb-2 block"
                            />
                        </div>
                    </PremiumCard>

                    <SectionHeader
                        id="coach_alerts_header"
                        label="Header Avvisi"
                        title="Criticità"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        activeSelectionId={activeSelectionId}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />
                    <div className="space-y-3">
                        <PremiumCard
                            themeConfig={themeConfig}
                            isDarkMode={isDarkMode}
                            id="coach_alert_1"
                            className="p-4 border-rose-500/20 bg-rose-500/5"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                                    <AlertCircle size={18} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-rose-500">3 Certificati Medici Scaduti</div>
                                    <p className="text-[10px] text-slate-400 mt-1">Rossi, Bianchi e Verdi non possono allenarsi.</p>
                                </div>
                            </div>
                        </PremiumCard>
                    </div>

                    <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                        <MessageSquare size={16} />
                        Comunica con la Squadra
                    </button>
                </div>
            )}

            {activeTab === 'playbook' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <div>
                            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Modulo Attuale</div>
                            <div className="text-xl font-black italic">4-3-3 Attaccante</div>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest">
                            Cambia
                        </button>
                    </div>

                    {/* TACTICAL BOARD EDITOR PREVIEW */}
                    <PremiumCard
                        themeConfig={themeConfig}
                        isDarkMode={isDarkMode}
                        id="coach_playbook_board"
                        className="p-0 overflow-hidden relative aspect-[4/5] bg-emerald-600 border-4 border-white/20"
                    >
                        <div className="absolute inset-0 opacity-20 flex flex-col">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-transparent'}`} />
                            ))}
                        </div>

                        {/* THE FIELD */}
                        <div className="absolute inset-4 border border-white/40 border-b-0 rounded-t-sm" />
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16 border border-white/40 border-t-0" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full h-1/2 border-t border-white/40 rounded-t-full opacity-40" />

                        {/* PLAYERS (MOVABLE IN REAL APP) */}
                        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-500 border-2 border-white shadow-xl flex items-center justify-center text-[10px] font-black text-white shadow-indigo-500/50">9</div>
                        <div className="absolute top-[25%] left-[20%] w-8 h-8 rounded-full bg-indigo-500 border-2 border-white shadow-xl flex items-center justify-center text-[10px] font-black text-white">11</div>
                        <div className="absolute top-[25%] left-[80%] -translate-x-full w-8 h-8 rounded-full bg-indigo-500 border-2 border-white shadow-xl flex items-center justify-center text-[10px] font-black text-white">7</div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
                            <span className="text-white text-[10px] font-black uppercase tracking-tighter">Editor Tattico Attivo</span>
                        </div>
                    </PremiumCard>

                    <div className="space-y-4">
                        <SectionHeader
                            id="coach_schemes_header"
                            label="Header Schemi"
                            title="Schemi Salvati"
                            isDarkMode={isDarkMode}
                            isInspectorActive={isInspectorActive}
                            onSelect={onSelect}
                            getOverride={getOverride}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            {['Angolo Corto', 'Uscita Bassa', 'Pressione Alta', 'Blocchi'].map((scheme) => (
                                <div key={scheme} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tattica</div>
                                    <div className="text-xs font-bold">{scheme}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'squad' && (
                <div className="space-y-6">
                    <SectionHeader
                        id="coach_squad_header"
                        label="Header Squadra"
                        title="Stato Rosa"
                        isDarkMode={isDarkMode}
                        isInspectorActive={isInspectorActive}
                        onSelect={onSelect}
                        getOverride={getOverride}
                    />

                    <div className="space-y-3">
                        {[
                            { name: 'G. Buffon', pos: 'POR', status: 'ok', load: 'Basso' },
                            { name: 'G. Chiellini', pos: 'DIF', status: 'warn', load: 'ALTO' },
                            { name: 'L. Bonucci', pos: 'DIF', status: 'ok', load: 'Medio' },
                            { name: 'F. Chiesa', pos: 'ATT', status: 'error', load: 'FERMO' },
                        ].map((player, i) => (
                            <PremiumCard
                                key={i}
                                themeConfig={themeConfig}
                                isDarkMode={isDarkMode}
                                id={`player_row_${i}`}
                                className="p-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${player.status === 'ok' ? 'bg-emerald-500' :
                                            player.status === 'warn' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`} />
                                        <div>
                                            <div className="text-sm font-bold">{player.name}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase">{player.pos}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-500 uppercase mb-0.5">Carico</div>
                                        <div className={`text-[10px] font-bold ${player.load === 'ALTO' ? 'text-rose-500' :
                                            player.load === 'Basso' ? 'text-emerald-500' : 'text-slate-700'
                                            }`}>{player.load}</div>
                                    </div>
                                </div>
                            </PremiumCard>
                        ))}
                    </div>

                    <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-500 transition-all">
                        Aggiungi Giocatore
                    </button>
                </div>
            )}
        </div>
    );
};
