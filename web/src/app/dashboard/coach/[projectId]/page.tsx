'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
    Users, Calendar, Trophy, ChevronLeft, Plus,
    LayoutDashboard, Settings, Loader2, Clock, MapPin, Copy
} from 'lucide-react';
import { RosterTable } from '@/components/coach/RosterTable';
import { EventForm } from '@/components/coach/EventForm';
import { ConvocationsModal } from '@/components/coach/ConvocationsModal';
import { MatchManagementModal } from '@/components/coach/MatchManagementModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile, TeamEvent, Project } from '@/types/database';

export default function CoachDashboardPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const router = useRouter();
    const { user } = useAuth();

    const [project, setProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<Profile[]>([]);
    const [events, setEvents] = useState<TeamEvent[]>([]);
    const [matches, setMatches] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [inviteCode, setInviteCode] = useState<string | null>(null);

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'roster' | 'calendar' | 'matches'>('roster');

    useEffect(() => {
        if (user && projectId) {
            loadData();
        }
    }, [user, projectId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: projData } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();
            setProject(projData);
            if ((projData as any)?.invite_code) {
                setInviteCode((projData as any).invite_code);
            }

            const { data: profData } = await supabase
                .from('profiles')
                .select('*')
                .neq('role', 'admin');
            setMembers(profData || []);

            const { data: evData } = await supabase
                .from('team_events')
                .select('*')
                .eq('project_id', projectId)
                .order('start_time', { ascending: true });

            const fetchedEvents = evData || [];
            setEvents(fetchedEvents);

            const eventIds = fetchedEvents.map(e => e.id);
            if (eventIds.length > 0) {
                const { data: attData } = await supabase
                    .from('event_attendance')
                    .select('*, profiles(*)')
                    .in('event_id', eventIds);
                setAttendance(attData || []);
            }

            const { data: matchData } = await supabase
                .from('matches')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });
            setMatches(matchData || []);

        } catch (error) {
            console.error('Error loading coach dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (formData: any, athleteIds: string[]) => {
        try {
            const { data: event, error: eventError } = await supabase
                .from('team_events')
                .insert([{ ...formData, project_id: projectId }])
                .select()
                .single();

            if (eventError) throw eventError;

            if (athleteIds.length > 0) {
                const attendanceRecords = athleteIds.map(id => ({
                    event_id: event.id,
                    user_id: id,
                    status: 'pending' as any
                }));

                await supabase.from('event_attendance').insert(attendanceRecords);
            }

            setIsAddingEvent(false);
            loadData();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleUpdateAttendance = async (userId: string, status: string) => {
        if (!selectedEventId) return;
        try {
            await supabase
                .from('event_attendance')
                .update({ status: status as any })
                .eq('event_id', selectedEventId)
                .eq('user_id', userId);
            loadData();
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    const generateInviteCode = async () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        try {
            await supabase
                .from('projects')
                .update({ invite_code: code } as any)
                .eq('id', projectId);
            setInviteCode(code);
        } catch (error) {
            console.error('Error generating invite code:', error);
        }
    };

    const handleStartMatch = async (eventId: string) => {
        // Find if match already exists
        let existingMatch = matches.find(m => m.event_id === eventId);

        if (existingMatch) {
            setSelectedMatchId(existingMatch.id);
            setActiveTab('matches');
            return;
        }

        // Create new match
        const event = events.find(e => e.id === eventId);
        try {
            const { data: newMatch, error } = await supabase
                .from('matches')
                .insert([{
                    project_id: projectId,
                    event_id: eventId,
                    opponent_name: event?.title || 'Avversario',
                    is_home_game: true, // Default
                    score_home: 0,
                    score_away: 0,
                    status: 'live'
                } as any])
                .select()
                .single();

            if (error) throw error;

            await loadData(); // Refresh matches list
            setSelectedMatchId(newMatch.id);
            setActiveTab('matches');
        } catch (error) {
            console.error('Error starting match:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col p-6 z-20">
                <div className="flex items-center gap-3 mb-10">
                    <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Trophy size={16} className="text-white" />
                    </div>
                    <span className="font-black text-white tracking-tighter">COACH PANEL</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('roster')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'roster' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Users size={18} />
                        <span className="text-sm font-bold">Roster Squadra</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Calendar size={18} />
                        <span className="text-sm font-bold">Calendario Eventi</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('matches')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'matches' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Trophy size={18} />
                        <span className="text-sm font-bold">Partite & Risultati</span>
                    </button>
                </nav>
            </aside>

            <main className="lg:ml-64 p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2 px-1">Gestione Squadra</div>
                        <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">
                            {activeTab === 'roster' ? 'Il Tuo Roster' : activeTab === 'calendar' ? 'Calendario' : 'Partite'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-3 font-medium max-w-sm">
                            {project?.name || 'Caricamento...'} • {members.length} Atleti Registrati
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {activeTab === 'calendar' && (
                            <button
                                onClick={() => setIsAddingEvent(true)}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} /> NUOVO EVENTO
                            </button>
                        )}
                        {activeTab === 'roster' && (
                            <div className="flex items-center gap-3">
                                {inviteCode ? (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Codice Invito</span>
                                            <span className="text-sm font-black text-indigo-400 font-mono tracking-wider">{inviteCode}</span>
                                        </div>
                                        <button onClick={() => { navigator.clipboard.writeText(inviteCode); alert('Copiato!'); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={generateInviteCode} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700">
                                        GENERA CODICE
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {activeTab === 'roster' && (
                            <RosterTable
                                members={members.filter(m => m.role === 'athlete')}
                                attendance={attendance}
                                loading={loading}
                            />
                        )}

                        {activeTab === 'calendar' && (
                            <div className="space-y-3">
                                {events.map((event) => (
                                    <div key={event.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex flex-col items-center justify-center font-bold">
                                                <span className="text-xs uppercase opacity-60">{new Date(event.start_time).toLocaleDateString('it', { month: 'short' })}</span>
                                                <span className="text-xl">{new Date(event.start_time).getDate()}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{event.title}</h4>
                                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                    <span><Clock size={12} className="inline mr-1" /> {new Date(event.start_time).toLocaleTimeString('it', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {event.event_type === 'match' && (
                                                <button
                                                    onClick={() => handleStartMatch(event.id)}
                                                    className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-indigo-600/20"
                                                >
                                                    Gestisci Match
                                                </button>
                                            )}
                                            <button onClick={() => setSelectedEventId(event.id)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">
                                                Vedi Presenze
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'matches' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {matches.map((match) => (
                                    <div key={match.id} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl relative group overflow-hidden">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className={`px-2 py-1 ${match.status === 'live' ? 'bg-rose-500' : 'bg-slate-700'} text-white text-[10px] font-black rounded uppercase`}>
                                                {match.status === 'live' ? 'LIVE' : 'FINALE'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-4">
                                            <div className="text-center flex-1">
                                                <div className="text-2xl font-black text-white italic">{match.is_home_game ? project?.name : match.opponent_name}</div>
                                            </div>
                                            <div className="text-5xl font-black text-white px-8">{match.score_home} - {match.score_away}</div>
                                            <div className="text-center flex-1">
                                                <div className="text-2xl font-black text-white italic">{match.is_home_game ? match.opponent_name : project?.name}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedMatchId(match.id)}
                                            className="w-full mt-8 py-3 bg-slate-800 hover:bg-white hover:text-black text-white font-bold rounded-xl transition-all text-xs uppercase"
                                        >
                                            {match.status === 'live' ? 'GESTISCI LIVE' : 'Dettagli Match'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {isAddingEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingEvent(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <div className="relative w-full max-w-lg">
                            <EventForm athletes={members.filter(m => m.role === 'athlete')} onSubmit={handleCreateEvent} onCancel={() => setIsAddingEvent(false)} />
                        </div>
                    </div>
                )}

                {selectedEventId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEventId(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <div className="relative w-full max-w-2xl px-4">
                            <ConvocationsModal
                                event={events.find(e => e.id === selectedEventId)}
                                attendance={attendance.filter(a => a.event_id === selectedEventId)}
                                onClose={() => setSelectedEventId(null)}
                                onUpdateStatus={handleUpdateAttendance}
                            />
                        </div>
                    </div>
                )}

                {selectedMatchId && (
                    <MatchManagementModal
                        match={{
                            ...matches.find(m => m.id === selectedMatchId)!,
                            home_team_name: matches.find(m => m.id === selectedMatchId)?.is_home_game ? project?.name || 'Home' : matches.find(m => m.id === selectedMatchId)?.opponent_name,
                            away_team_name: matches.find(m => m.id === selectedMatchId)?.is_home_game ? matches.find(m => m.id === selectedMatchId)?.opponent_name : project?.name || 'Away',
                        } as any}
                        roster={members}
                        onClose={() => setSelectedMatchId(null)}
                        onUpdate={() => loadData()}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
