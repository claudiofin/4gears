import React, { useState } from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { SmartText, SmartCard } from '../SmartElements';
import { PremiumCard } from '@/components/ui/PremiumCard';
import {
    Heart, Trophy, Users, Star,
    MessageCircle, Share2, Timer, Activity, Zap
} from 'lucide-react';

export const FanDashboardScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    onLockedAction,
    currentScenario,
    currentTeam
}) => {
    const [voted, setVoted] = useState<string | null>(null);
    const [showMemberCard, setShowMemberCard] = useState(false);

    // MATCHDAY MODE
    if (currentScenario === 'LIVE_MATCH') {
        return (
            <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
                <SectionHeader
                    id="fan_match_header"
                    label="Header Matchday"
                    title="Live Match"
                    isFirst={true}
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    activeSelectionId={activeSelectionId}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />

                {/* LIVE SCOREBOARD */}
                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="fan_live_score"
                    label="Live Scoreboard"
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'fan_live_score'}
                    onElementSelect={onSelect}
                    className="p-6 bg-slate-900 border-slate-800 text-white relative overflow-hidden"
                    traits={['background', 'border', 'spacing']}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/50 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">LIVE 75'</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-6">
                            <div className="flex flex-col items-center gap-2">
                                <img src={currentTeam?.logo} className="w-12 h-12 object-contain drop-shadow-lg" alt="Home" />
                                <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">{currentTeam?.name.substring(0, 3)}</span>
                            </div>
                            <div className="text-4xl font-black tracking-tight tabular-nums flex gap-3 text-white">
                                <span>2</span>
                                <span className="text-slate-600">:</span>
                                <span>1</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-white">
                                    <span className="text-xs font-bold text-slate-400">RIV</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Rivals</span>
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex items-center gap-3 text-xs border-b border-white/5 pb-2">
                                <span className="font-bold text-emerald-400 w-6">72'</span>
                                <Activity size={12} className="text-emerald-400" />
                                <span className="font-medium text-slate-300">Gol! Marco Rossi (Assist: Verdi)</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs border-b border-white/5 pb-2">
                                <span className="font-bold text-amber-400 w-6">68'</span>
                                <Zap size={12} className="text-amber-400" />
                                <span className="font-medium text-slate-300">Ammonizione (Bianchi)</span>
                            </div>
                        </div>
                    </div>
                </PremiumCard>

                {/* MVP VOTING (Prominent during match) */}
                <SectionHeader
                    id="fan_mvp_live_header"
                    label="Header MVP Live"
                    title="Vota il migliore in campo"
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />
                <div className="grid grid-cols-2 gap-3">
                    {['Marco Rossi', 'Giuseppe Verdi'].map((name, i) => (
                        <button
                            key={i}
                            onClick={() => setVoted(`live_${i}`)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${voted === `live_${i}`
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${voted === `live_${i}` ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                {name.charAt(0)}
                            </div>
                            <span className="text-[10px] font-black uppercase text-center">{name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 pb-32 space-y-6" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="fan_header"
                label="Titolo Dashboard Fan"
                title="Fan Zone"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            {/* MEMBER CARD TOGGLE VIEW */}
            {showMemberCard ? (
                <PremiumCard
                    themeConfig={themeConfig}
                    isDarkMode={isDarkMode}
                    id="fan_digital_card"
                    className="p-8 bg-slate-900 text-white relative overflow-hidden aspect-[1/1.4] flex flex-col items-center justify-center text-center"
                    onClick={() => setShowMemberCard(false)}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                    <div className="mb-6">
                        <img src={currentTeam?.logo} className="w-20 h-20 mx-auto drop-shadow-2xl" alt="Logo" />
                        <div className="mt-4 text-2xl font-black italic uppercase tracking-tighter">Gold Member</div>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Digital Access Pass</div>
                    </div>

                    {/* SIMULATED QR CODE */}
                    <div className="p-4 bg-white rounded-2xl mb-6 shadow-2xl shadow-indigo-500/20">
                        <div className="grid grid-cols-4 gap-1 w-32 h-32">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="text-xs font-bold text-slate-400">ID: 4G-992-KFC</div>
                    <button className="mt-8 text-[9px] font-black uppercase tracking-widest text-slate-500">Tocca per Chiudere</button>
                </PremiumCard>
            ) : (
                <SmartCard
                    id="fan_loyalty_card"
                    label="Card Fedeltà"
                    traits={['background', 'border', 'spacing']}
                    isInspectorActive={isInspectorActive}
                    isSelected={activeSelectionId === 'fan_loyalty_card'}
                    onSelect={onSelect}
                    overrides={getOverride('fan_loyalty_card')}
                    className="p-5 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl shadow-indigo-500/10 relative overflow-hidden cursor-pointer group"
                    onClick={() => setShowMemberCard(true)}
                >
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 text-white">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100 opacity-80">Gold Member</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <Activity size={16} className="text-indigo-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-black italic leading-none mb-1 text-white block">LIVELLO 15</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-4">Mostra la tua tessera digitale</div>

                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: '65%' }} />
                        </div>
                    </div>
                </SmartCard>
            )}

            {/* MATCH POSTER CARD */}
            <PremiumCard
                themeConfig={themeConfig}
                isDarkMode={isDarkMode}
                id="fan_next_match_poster"
                className="p-0 overflow-hidden relative aspect-video group cursor-pointer"
            >
                <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Next Match"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="px-2 py-0.5 rounded bg-indigo-600 text-[8px] font-black uppercase tracking-widest">Prossima Partita</div>
                        <span className="text-[10px] font-bold text-slate-300">Domenica ore 15:00</span>
                    </div>
                    <div className="text-2xl font-black italic uppercase tracking-tighter shadow-sm">{currentTeam?.name} vs Rivals</div>
                </div>
            </PremiumCard>

            <SectionHeader
                id="fan_voting_header"
                label="Header Votazioni"
                title="Vota il Tuo MVP"
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                onSelect={onSelect}
                getOverride={getOverride}
            />
            <div className="grid grid-cols-1 gap-3">
                {[
                    { id: 'mvp_p1', name: 'Marco Rossi', pos: 'Attaccante', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
                    { id: 'mvp_p2', name: 'Luca Verdi', pos: 'Centrocampista', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }
                ].map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setVoted(p.id)}
                        className={`p-3 rounded-2xl flex items-center justify-between transition-all border ${voted === p.id
                            ? 'bg-indigo-500/10 border-indigo-500 shadow-lg'
                            : `bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700`
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <img src={p.img} className="w-10 h-10 rounded-xl object-cover" alt={p.name} />
                            <div className="text-left text-black dark:text-white">
                                <div className="text-sm font-bold">{p.name}</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">{p.pos}</div>
                            </div>
                        </div>
                        {voted === p.id ? (
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                <Heart size={14} fill="white" />
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-800" />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                <button className="flex-1 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-black dark:text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                    <MessageCircle size={16} />
                    Community
                </button>
                <button
                    onClick={() => onLockedAction?.('shop', 'Club Official Shop')}
                    className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                    <Trophy size={16} />
                    Shop
                </button>
            </div>
        </div>
    );
};
