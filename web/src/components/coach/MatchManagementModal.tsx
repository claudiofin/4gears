import React, { useState, useEffect } from 'react';
import {
    X, Trophy, Timer, Plus, Minus, Shield, Users,
    AlertCircle, CheckCircle, Flame, History
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Match, Profile, TeamEvent } from '@/types/database';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchManagementModalProps {
    match: Match & { home_team_name?: string, away_team_name?: string };
    roster: Profile[];
    onClose: () => void;
    onUpdate: () => void;
}

export const MatchManagementModal: React.FC<MatchManagementModalProps> = ({
    match,
    roster,
    onClose,
    onUpdate
}) => {
    const [scoreHome, setScoreHome] = useState(match.score_home || 0);
    const [scoreAway, setScoreAway] = useState(match.score_away || 0);
    const [status, setStatus] = useState(match.status || 'scheduled');
    const [events, setEvents] = useState<any[]>([]);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
    const [eventType, setEventType] = useState<string>('goal');
    const [minute, setMinute] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadEvents();

        // Subscribe to match updates
        const matchSubscription = supabase
            .channel(`match:${match.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'matches',
                filter: `id=eq.${match.id}`
            }, (payload) => {
                setScoreHome(payload.new.score_home);
                setScoreAway(payload.new.score_away);
                setStatus(payload.new.status);
            })
            .subscribe();

        // Subscribe to events updates
        const eventsSubscription = (supabase as any)
            .channel(`match_events:${match.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'match_events',
                filter: `match_id=eq.${match.id}`
            }, () => {
                loadEvents();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(matchSubscription);
            supabase.removeChannel(eventsSubscription);
        };
    }, [match.id]);

    const loadEvents = async () => {
        const { data } = await (supabase as any)
            .from('match_events')
            .select(`
                *,
                profiles (first_name, last_name, avatar_url)
            `)
            .eq('match_id', match.id)
            .order('minute', { ascending: false });

        setEvents(data || []);
    };

    const handleUpdateScore = async (side: 'home' | 'away', delta: number) => {
        const newScore = side === 'home' ? Math.max(0, scoreHome + delta) : Math.max(0, scoreAway + delta);
        if (side === 'home') setScoreHome(newScore); else setScoreAway(newScore);

        try {
            const { error } = await supabase
                .from('matches')
                .update({
                    [side === 'home' ? 'score_home' : 'score_away']: newScore
                })
                .eq('id', match.id);
            if (error) throw error;
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        setStatus(newStatus as any);
        try {
            const { error } = await supabase
                .from('matches')
                .update({ status: newStatus as any })
                .eq('id', match.id);
            if (error) throw error;
            onUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleAddEvent = async () => {
        if (!eventType) return;
        setLoading(true);
        try {
            const { error } = await (supabase as any)
                .from('match_events')
                .insert({
                    match_id: match.id,
                    player_id: selectedPlayerId || null,
                    event_type: eventType as any,
                    minute: minute || 0,
                });

            if (error) throw error;

            // Auto-update score for goals
            if (eventType === 'goal') {
                const newScoreHome = scoreHome + 1;
                setScoreHome(newScoreHome);
                await supabase
                    .from('matches')
                    .update({ score_home: newScoreHome })
                    .eq('id', match.id);
                onUpdate();
            }

            setIsAddingEvent(false);
            setSelectedPlayerId('');
            setMinute(0);
            loadEvents();
        } catch (error) {
            console.error('Error adding event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await (supabase as any).from('match_events').delete().eq('id', eventId);
            loadEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
            >
                {/* Left Panel: Score & Status */}
                <div className="md:w-1/2 p-8 bg-gradient-to-br from-indigo-900/20 to-slate-900 border-b md:border-b-0 md:border-r border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <Trophy size={16} className="text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Console</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-12">
                        {/* Status Toggle */}
                        <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
                            {['scheduled', 'live', 'final'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleUpdateStatus(s)}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${status === s
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {s === 'scheduled' ? 'Programmata' : s === 'live' ? 'LIVE NOW' : 'Terminata'}
                                </button>
                            ))}
                        </div>

                        {/* Scoreboard */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-center gap-4 flex-1">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center h-8 flex items-center">
                                    {match.home_team_name}
                                </div>
                                <div className="text-7xl font-black text-white italic tracking-tighter">
                                    {scoreHome}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateScore('home', -1)}
                                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateScore('home', 1)}
                                        className="p-3 bg-slate-800 hover:bg-indigo-600 rounded-2xl text-white transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="px-4 text-3xl font-black text-slate-700 italic">VS</div>

                            <div className="flex flex-col items-center gap-4 flex-1">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center h-8 flex items-center">
                                    {match.away_team_name}
                                </div>
                                <div className="text-7xl font-black text-white italic tracking-tighter">
                                    {scoreAway}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateScore('away', -1)}
                                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateScore('away', 1)}
                                        className="p-3 bg-slate-800 hover:bg-indigo-600 rounded-2xl text-white transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => { setEventType('goal'); setIsAddingEvent(true); }}
                                className="p-4 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 rounded-3xl flex flex-col items-center gap-2 transition-all group"
                            >
                                <Flame size={24} className="text-emerald-400 group-hover:text-white" />
                                <span className="text-[10px] font-black uppercase text-emerald-400 group-hover:text-white">Registra Goal</span>
                            </button>
                            <button
                                onClick={() => { setEventType('yellow_card'); setIsAddingEvent(true); }}
                                className="p-4 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 rounded-3xl flex flex-col items-center gap-2 transition-all group"
                            >
                                <AlertCircle size={24} className="text-amber-400 group-hover:text-white" />
                                <span className="text-[10px] font-black uppercase text-amber-400 group-hover:text-white">Ammonizione</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Event Timeline */}
                <div className="md:w-1/2 flex flex-col h-full bg-slate-900/50">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-slate-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-300">Timeline Eventi</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded uppercase">Live Feed</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div className="space-y-4">
                            {events.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                                    <History size={40} className="mb-4 text-slate-700" />
                                    <p className="text-sm font-medium text-slate-400">Nessun evento registrato per questa partita.</p>
                                </div>
                            ) : (
                                events.map((event) => (
                                    <div key={event.id} className="flex items-start gap-4 p-4 bg-slate-950/30 border border-slate-800/50 rounded-2xl group relative">
                                        <div className="text-sm font-black text-indigo-500 w-8">
                                            {event.minute}'
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${event.event_type === 'goal' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                    event.event_type === 'yellow_card' ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`} />
                                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-200">
                                                    {event.event_type === 'goal' ? 'GOAL!' :
                                                        event.event_type === 'yellow_card' ? 'Ammonizione' : 'Espulsione'}
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold mt-1 text-slate-400">
                                                {event.profiles ? `${event.profiles.first_name} ${event.profiles.last_name}` : 'Evento Team'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer Add Event Form */}
                    <AnimatePresence>
                        {isAddingEvent && (
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                className="absolute inset-x-0 bottom-0 p-8 bg-slate-950 border-t border-slate-800 rounded-t-[2.5rem] shadow-2xl z-20"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black uppercase italic tracking-tighter">Registra Nuovo Evento</h3>
                                    <button onClick={() => setIsAddingEvent(false)} className="p-2 hover:bg-slate-800 rounded-full">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Tipo Evento</label>
                                            <select
                                                value={eventType}
                                                onChange={(e) => setEventType(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all text-white appearance-none"
                                            >
                                                <option value="goal">Goal</option>
                                                <option value="yellow_card">Ammonizione</option>
                                                <option value="red_card">Espulsione</option>
                                                <option value="sub">Sostituzione</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Minuto</label>
                                            <input
                                                type="number"
                                                value={minute}
                                                onChange={(e) => setMinute(parseInt(e.target.value))}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all text-white"
                                                placeholder="Es: 45"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Atleta Coinvolto</label>
                                        <select
                                            value={selectedPlayerId}
                                            onChange={(e) => setSelectedPlayerId(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all text-white appearance-none"
                                        >
                                            <option value="">Nessun atleta (Evento Generico)</option>
                                            {roster.map(player => (
                                                <option key={player.id} value={player.id}>
                                                    {player.first_name} {player.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        disabled={loading}
                                        onClick={handleAddEvent}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-xs"
                                    >
                                        {loading ? 'Salvataggio...' : 'Conferma Evento'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
