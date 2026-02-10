import React from 'react';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';
import { ChevronLeft, Trophy, Users, Circle, Shield } from 'lucide-react';

export const MatchDetailScreen: React.FC<InteractiveScreenProps> = ({
    isDarkMode,
    currentTeam,
    topPaddingValue,
    setPreviewPage,
    mockData,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride
}) => {
    const liveMatch = mockData?.liveMatch || {
        opponent_name: 'FC VALENCIA',
        score_home: 2,
        score_away: 1,
        minute: 74,
        events: [
            { type: 'goal', minute: 23, player: 'L. MARTINEZ', team: 'home' },
            { type: 'yellow_card', minute: 41, player: 'G. ROSSI', team: 'home' },
            { type: 'goal', minute: 58, player: 'S. RAMIREZ', team: 'away' },
            { type: 'goal', minute: 67, player: 'M. KHAN', team: 'home' }
        ]
    };

    const renderEventIcon = (type: string) => {
        switch (type) {
            case 'goal': return <Trophy size={14} className="text-emerald-500" />;
            case 'yellow_card': return <div className="w-3 h-4 bg-amber-400 rounded-sm" />;
            case 'red_card': return <div className="w-3 h-4 bg-rose-500 rounded-sm" />;
            case 'substitution': return <Users size={14} className="text-blue-500" />;
            default: return <Circle size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className={`flex flex-col h-full bg-slate-50 dark:bg-slate-950 animate-in fade-in slide-in-from-right-4 duration-500`} style={{ paddingTop: `${topPaddingValue}px` }}>
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button onClick={() => setPreviewPage('home')} className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <ChevronLeft size={16} /> Indietro
                </button>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Live</div>
                <div className="w-12" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-6 mt-4">
                {/* Main Scoreboard */}
                <div className={`p-8 rounded-[32px] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border flex flex-col items-center shadow-xl`}>
                    <div className="flex items-center gap-2 mb-6 text-rose-500 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">LIVE • {liveMatch.minute}'</span>
                    </div>

                    <div className="flex justify-between items-center w-full">
                        <div className="text-center flex-1">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-3 mb-3 mx-auto">
                                <img src={currentTeam.logo} alt="Home" className="w-full h-full object-contain" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-tight truncate px-1">{currentTeam.name}</div>
                        </div>

                        <div className="text-5xl font-[1000] italic tracking-tighter px-4 dark:text-white text-slate-900">
                            {liveMatch.score_home}:{liveMatch.score_away}
                        </div>

                        <div className="text-center flex-1">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-4 mb-3 mx-auto">
                                <Shield size={32} className="text-slate-300" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-tight truncate px-1">{liveMatch.opponent_name}</div>
                        </div>
                    </div>
                </div>

                <SectionHeader
                    id="match_timeline_header"
                    label="Header Timeline"
                    title="Cronologia Live"
                    isDarkMode={isDarkMode}
                    isInspectorActive={isInspectorActive}
                    activeSelectionId={activeSelectionId}
                    onSelect={onSelect}
                    getOverride={getOverride}
                />
                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800 pb-4">
                    {(liveMatch.events || []).map((ev: any, i: number) => (
                        <div key={i} className="flex gap-4 items-center relative pl-8">
                            <div className="absolute left-0 w-6 h-6 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center z-10 shadow-sm">
                                {renderEventIcon(ev.type)}
                            </div>
                            <div className={`flex-1 p-3 rounded-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black">{ev.player}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{ev.minute}'</span>
                                </div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                    {ev.type.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                    )).reverse()}
                </div>
            </div>
        </div>
    );
};
