'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, Star, Search, Filter, MoreHorizontal, Loader2, X, Check, Lock, Eye, Plus } from 'lucide-react';
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
        {
            id: 'PLAYER',
            name: 'Atleta',
            users: 0,
            description: 'Visualizzazione statistiche personali e documenti.',
            color: 'text-emerald-400 bg-emerald-500/10',
            permissions: [
                { id: 'view_own_data', label: 'I Miei Documenti', enabled: true },
                { id: 'view_stats', label: 'Mie Statistiche', enabled: true },
                { id: 'manage_team', label: 'Gestione Squadra', enabled: false },
                { id: 'view_federation', label: 'Export Federazione', enabled: false },
            ]
        },
        {
            id: 'ADMIN',
            name: 'Admin Club',
            users: 0,
            description: 'Controllo totale su brand, fatturazione e permessi.',
            color: 'text-amber-400 bg-amber-500/10',
            permissions: [
                { id: 'view_stats', label: 'Statistiche Globali', enabled: true },
                { id: 'manage_team', label: 'Gestione Team', enabled: true },
                { id: 'view_federation', label: 'Export Federazione', enabled: true },
                { id: 'view_secretariat', label: 'Segreteria', enabled: true },
            ]
        },
        {
            id: 'FAN',
            name: 'Fan',
            users: 0,
            description: 'Accesso ai contenuti pubblici e store.',
            color: 'text-rose-400 bg-rose-500/10',
            permissions: [
                { id: 'view_stats', label: 'Risultati Live', enabled: true },
                { id: 'view_own_data', label: 'Profilo Personalizzato', enabled: true },
                { id: 'view_federation', label: 'Dati Federazione', enabled: false },
            ]
        },
    ]);

    const [selectedPersona, setSelectedPersona] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

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

    const handleTogglePermission = (personaId: string, permId: string) => {
        setPersonas(prev => prev.map(p => {
            if (p.id !== personaId) return p;
            return {
                ...p,
                permissions: p.permissions.map(perm => {
                    if (perm.id !== permId) return perm;
                    return { ...perm, enabled: !perm.enabled };
                })
            };
        }));
    };

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
                    <div
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona)}
                        className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 hover:border-indigo-500/30 transition-all group cursor-pointer relative overflow-hidden"
                    >
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

            {/* Permission Detail Modal */}
            {selectedPersona && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${selectedPersona.color}`}>
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Permessi {selectedPersona.name}</h2>
                                    <p className="text-sm text-slate-500 font-medium">Configura le capacità granulari di questo ruolo.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPersona(null)}
                                className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                            {selectedPersona.permissions?.map((perm: any) => (
                                <div key={perm.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        {perm.enabled ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-slate-500">
                                                <Lock size={12} />
                                            </div>
                                        )}
                                        <span className={`text-sm font-bold ${perm.enabled ? 'text-white' : 'text-slate-500'}`}>
                                            {perm.label}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleTogglePermission(selectedPersona.id, perm.id)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${perm.enabled ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                            }`}
                                    >
                                        {perm.enabled ? 'Disabilita' : 'Abilita'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedPersona(null)}
                                className="px-6 py-3 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => setSelectedPersona(null)}
                                className="px-8 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-lg"
                            >
                                Salva Modifiche
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            {/* Create Role Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Nuovo Ruolo</h2>
                                    <p className="text-sm text-slate-500 font-medium">Crea una nuova categoria di utenza.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-800 rounded-xl"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Ruolo</label>
                                <input
                                    type="text"
                                    placeholder="es. Scout, Preparatore..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white font-bold placeholder:text-slate-600 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Descrizione</label>
                                <textarea
                                    placeholder="Cosa può fare questo utente?"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white font-bold placeholder:text-slate-600 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-6 py-3 text-slate-400 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-8 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-lg"
                            >
                                Crea Ruolo
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
