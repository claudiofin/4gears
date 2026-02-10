'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Calendar, MapPin, Clock, Plus,
    MoreHorizontal, Trophy, Activity, Users, Search,
    Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function EventsHubPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('team_events')
                .select('*')
                .order('start_time', { ascending: true });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                        <span>/</span>
                        <span className="text-white font-medium">Event Hub</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Programmazione</h1>
                    <p className="text-sm text-slate-500 font-medium">Gestione match, allenamenti e raduni team.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button className="px-4 py-2 bg-slate-800 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-inner">Lista</button>
                        <button className="px-4 py-2 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest hover:text-slate-300">Calendario</button>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                        <Plus size={14} />
                        Nuovo Evento
                    </button>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-4 scrollbar-hide overflow-x-auto pb-2">
                {[
                    { label: 'Tutti', count: events.length },
                    { label: 'Partite', count: events.filter(e => e.event_type === 'match').length },
                    { label: 'Allenamenti', count: events.filter(e => e.event_type === 'training').length },
                    { label: 'Social', count: 0 },
                    { label: 'Clinic', count: 0 },
                ].map((filter, i) => (
                    <button
                        key={i}
                        className={`group px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap flex items-center gap-3 ${i === 0
                                ? 'bg-white text-black border-white'
                                : 'bg-slate-900/50 text-slate-500 border-white/[0.05] hover:border-white/10 hover:text-slate-300'
                            }`}
                    >
                        {filter.label}
                        <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${i === 0 ? 'bg-black/10 text-black' : 'bg-white/5 text-slate-600 group-hover:text-slate-400'
                            }`}>
                            {filter.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Events Content */}
            <div className="bg-slate-900/40 border border-white/[0.03] rounded-[32px] overflow-hidden backdrop-blur-xl">
                {/* Search / Context Bar */}
                <div className="flex items-center justify-between p-5 border-b border-white/[0.03] bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-xl border border-white/[0.05]">
                            <Search size={14} className="text-slate-600" />
                            <input type="text" placeholder="Cerca evento..." className="bg-transparent text-xs text-white outline-none border-none p-0 w-32 placeholder-slate-700" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest px-2">Ottobre 2023</span>
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="relative inline-block w-10 h-10">
                                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="mt-4 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Sincronizzazione calendario...</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="py-20 text-center">
                                <Calendar className="mx-auto text-slate-800 mb-4" size={56} strokeWidth={1} />
                                <div className="text-xl font-black text-slate-500 uppercase italic tracking-tight">Nessun evento in programma</div>
                                <p className="text-xs text-slate-700 mt-2 max-w-[240px] mx-auto font-medium leading-relaxed">
                                    Il tuo calendario è vuoto. Inizia a pianificare la stagione aggiungendo il primo evento.
                                </p>
                                <button className="mt-8 px-8 py-3 bg-slate-800 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-700 transition-all active:scale-95">
                                    Pianifica Ora
                                </button>
                            </div>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="group bg-slate-950/40 border border-white/[0.03] rounded-[28px] overflow-hidden hover:border-indigo-500/30 transition-all hover:bg-slate-950/60 flex h-36">
                                    {/* Date Badge */}
                                    <div className="w-36 bg-slate-950/80 flex flex-col items-center justify-center border-r border-white/[0.03] shrink-0 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                                        <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
                                            {new Date(event.start_time).toLocaleDateString('it-IT', { month: 'short' })}
                                        </span>
                                        <span className="text-4xl font-black text-white italic tracking-tighter leading-none">
                                            {new Date(event.start_time).getDate()}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase mt-2 tracking-widest">
                                            {new Date(event.start_time).toLocaleDateString('it-IT', { weekday: 'short' })}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-8 flex flex-col justify-center relative">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    {event.event_type === 'match' ? (
                                                        <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/5">
                                                            <Trophy size={11} /> Partita Di Campionato
                                                        </div>
                                                    ) : (
                                                        <div className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-indigo-500/5">
                                                            <Activity size={11} /> Allenamento Tecnico
                                                        </div>
                                                    )}
                                                    <div className="h-4 w-px bg-white/[0.05]" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prima Squadra</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors leading-none">
                                                    {event.title}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-10">
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                                            <Clock size={12} className="text-indigo-400" />
                                                        </div>
                                                        <span className="text-sm font-black italic tracking-tight">
                                                            {new Date(event.start_time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <MapPin size={12} />
                                                        <span className="text-[11px] font-bold uppercase tracking-tighter">{event.location || 'Stadio Comunale'}</span>
                                                    </div>
                                                </div>
                                                <button className="w-12 h-12 border border-white/[0.05] rounded-[18px] flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:rotate-90">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className="w-7 h-7 rounded-xl bg-slate-800 border-2 border-slate-950 overflow-hidden text-[9px] flex items-center justify-center font-black text-slate-500 shadow-xl">
                                                            {i}
                                                        </div>
                                                    ))}
                                                    <div className="w-7 h-7 rounded-xl bg-indigo-600 border-2 border-slate-950 flex items-center justify-center text-[7px] font-black text-white shadow-xl">
                                                        +14
                                                    </div>
                                                </div>
                                                <div className="h-4 w-px bg-white/[0.05]" />
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">18 Convocati confermati</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex h-1.5 w-24 bg-slate-900 rounded-full overflow-hidden border border-white/[0.03]">
                                                    <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                </div>
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">85% RSVP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
