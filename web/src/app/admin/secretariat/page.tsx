'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Users, Search, Filter, Download,
    CheckCircle2, AlertCircle, Clock,
    MoreVertical, FileText, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SecretariatPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    *,
                    member_documents (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (member: any) => {
        const docs = member.member_documents || [];
        if (docs.length === 0) return 'text-slate-500 bg-slate-900/50';

        const hasPending = docs.some((d: any) => d.status === 'pending');
        const hasExpired = docs.some((d: any) => d.status === 'expired');
        const hasRejected = docs.some((d: any) => d.status === 'rejected');

        if (hasRejected) return 'text-rose-400 bg-rose-500/10';
        if (hasExpired) return 'text-amber-400 bg-amber-500/10';
        if (hasPending) return 'text-blue-400 bg-blue-500/10';

        return 'text-emerald-400 bg-emerald-500/10';
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                        <span>/</span>
                        <span className="text-white font-medium">Segreteria</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Gestione Soci</h1>
                    <p className="text-sm text-slate-500 font-medium">Anagrafiche, documenti e stati di tesseramento.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-slate-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all border border-slate-800">
                        <Download size={14} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                        <Users size={14} />
                        Aggiungi Socio
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Totale Soci', value: members.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
                    { label: 'Documenti Scaduti', value: members.filter(m => m.member_documents?.some((d: any) => d.status === 'expired')).length, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/5' },
                    { label: 'In Attesa Review', value: members.filter(m => m.member_documents?.some((d: any) => d.status === 'pending')).length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/5' },
                    { label: 'Tesserati Elite', value: members.filter(m => m.tier === 'elite').length, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
                ].map((stat, i) => (
                    <div key={i} className="relative overflow-hidden bg-slate-900/50 border border-white/[0.03] p-5 rounded-3xl hover:border-white/[0.08] transition-all group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:scale-110`} />
                        <div className="relative flex justify-between items-start mb-3">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            <div className={`${stat.bg} p-2 rounded-xl border border-white/[0.05]`}>
                                <stat.icon size={14} className={stat.color} />
                            </div>
                        </div>
                        <div className="relative text-3xl font-black text-white tracking-tighter italic">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-slate-900/40 border border-white/[0.03] rounded-[32px] overflow-hidden backdrop-blur-xl">
                {/* Filter Bar */}
                <div className="flex items-center gap-4 p-5 border-b border-white/[0.03] bg-white/[0.01]">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        <input
                            type="text"
                            placeholder="Cerca soci per nome, email o documento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/[0.05] rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:border-indigo-500/50 outline-none transition-all placeholder-slate-700"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/[0.03] hover:text-white transition-all">
                        <Filter size={14} />
                        Filtri Avanzati
                    </button>
                    <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/[0.03]">
                        <button className="px-4 py-2 bg-slate-800 text-white text-[9px] font-black rounded-lg shadow-inner uppercase tracking-wider">Tutti</button>
                        <button className="px-4 py-2 text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-wider hover:text-slate-300">Pendenti</button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01] border-b border-white/[0.03] text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <th className="px-8 py-5">Identità Socio</th>
                                <th className="px-8 py-5">Livello Tier</th>
                                <th className="px-8 py-5">Dossier Documenti</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="relative inline-block w-10 h-10">
                                            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <p className="mt-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Sincronizzazione Database...</p>
                                    </td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Users className="mx-auto text-slate-800 mb-4" size={48} strokeWidth={1} />
                                        <div className="text-sm font-bold text-slate-600">Nessun socio nel database</div>
                                        <p className="text-xs text-slate-700 mt-1">Invita i membri a iscriversi per vederli qui.</p>
                                    </td>
                                </tr>
                            ) : members
                                .filter(m => {
                                    const search = searchTerm.toLowerCase();
                                    return (m.first_name?.toLowerCase().includes(search) ||
                                        m.last_name?.toLowerCase().includes(search) ||
                                        m.email?.toLowerCase().includes(search));
                                })
                                .map((member) => (
                                    <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors relative">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.05] p-0.5 shadow-xl shrink-0">
                                                    <div className="w-full h-full rounded-[14px] overflow-hidden flex items-center justify-center bg-slate-950 font-black text-slate-500">
                                                        {member.avatar_url ? (
                                                            <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            member.first_name?.[0] || '?'
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white tracking-tight uppercase group-hover:text-indigo-400 transition-colors">
                                                        {member.first_name} {member.last_name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 font-mono tracking-tighter">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.1em]">{member.role}</span>
                                                <div className={`text-[8px] font-black px-2 py-0.5 rounded-md w-fit uppercase border tracking-widest ${member.tier === 'elite' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        member.tier === 'premium' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                            'bg-slate-800/50 text-slate-500 border-slate-700/50'
                                                    }`}>
                                                    {member.tier || 'Standard'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {(member.member_documents || []).length > 0 ? (
                                                    <div className="flex -space-x-1.5">
                                                        {member.member_documents.map((doc: any, i: number) => (
                                                            <div key={i} className={`w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 hover:z-10 ${doc.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                    doc.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                                                                        'bg-amber-500/20 text-amber-400'
                                                                }`}>
                                                                <FileText size={14} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] font-bold text-slate-700 uppercase italic">Vuoto</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${getStatusColor(member)}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                {member.member_documents?.length > 0 ? member.member_documents[0].status : 'Verifica'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2.5 rounded-xl bg-slate-950/50 text-slate-600 hover:text-white hover:bg-slate-800 border border-white/[0.03] transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
