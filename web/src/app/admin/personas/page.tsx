'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, Star, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function PersonasPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activePermissions: 14, // We can keep this as a logical placeholder or fetch from a perms table if it exists
        customRoles: 3
    });

    const [personas, setPersonas] = useState([
        { id: 'coach', name: 'Coach', users: 0, description: 'Accesso completo alla gestione squadra, allenamenti e statistiche match.', color: 'text-indigo-400 bg-indigo-500/10' },
        { id: 'athlete', name: 'Atleta', users: 0, description: 'Visualizzazione statistiche personali, calendario e comunicazione col team.', color: 'text-emerald-400 bg-emerald-500/10' },
        { id: 'admin', name: 'Admin Club', users: 0, description: 'Gestione abbonamenti, anagrafiche soci e configurazione brand societario.', color: 'text-amber-400 bg-amber-500/10' },
        { id: 'fan', name: 'Fan', users: 0, description: 'Accesso ai contenuti premium, news e live tracking della squadra preferita.', color: 'text-rose-400 bg-rose-500/10' },
    ]);

    useEffect(() => {
        const fetchPersonaData = async () => {
            try {
                setLoading(true);
                // Get total users
                const { count: total } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // Get counts for each role
                const personaCounts = await Promise.all(
                    personas.map(async (p) => {
                        const { count } = await supabase
                            .from('profiles')
                            .select('*', { count: 'exact', head: true })
                            .eq('role', p.id as any);
                        return { ...p, users: count || 0 };
                    })
                );

                setPersonas(personaCounts);
                setStats(prev => ({ ...prev, totalUsers: total || 0 }));
            } catch (error) {
                console.error('Error fetching personas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonaData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
                        User Personas
                    </h1>
                    <p className="text-slate-400 font-medium">Gestione dei ruoli e dei permessi granulari della piattaforma.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                        Crea Nuovo Ruolo
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <Users size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Totale Utenti</span>
                    </div>
                    <div className="text-3xl font-black text-white italic">{stats.totalUsers}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <Shield size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Permessi Attivi</span>
                    </div>
                    <div className="text-3xl font-black text-white italic">{stats.activePermissions}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                            <Star size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Custom Roles</span>
                    </div>
                    <div className="text-3xl font-black text-white italic">{stats.customRoles}</div>
                </div>
            </div>

            {/* Grid of Personas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personas.map((persona) => (
                    <div key={persona.id} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <UserCheck size={64} />
                        </div>

                        <div className="flex items-start justify-between mb-6">
                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${persona.color}`}>
                                {persona.name}
                            </div>
                            <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">{persona.name}</h3>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">{persona.description}</p>

                        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-500" />
                                <span className="text-xs font-bold text-slate-300">{persona.users} Utenti</span>
                            </div>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Dettagli Permessi →
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
