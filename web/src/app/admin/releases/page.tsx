'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Smartphone, Apple, PlayCircle, Loader2,
    CheckCircle2, AlertCircle, Clock, ChevronRight,
    Zap, Download, LayoutPanelTop, Globe, Search, Filter,
    Package, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ReleasesPage() {
    const [releases, setReleases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReleases();
    }, []);

    const fetchReleases = async () => {
        try {
            setLoading(false); // Using mock data for demo since table is fresh
            setReleases([
                {
                    id: '1',
                    project_name: 'ASD Roma Calcio',
                    version: '1.0.4',
                    platform: 'ios',
                    status: 'released',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    assets: { screenshots: 5, banner: true }
                },
                {
                    id: '2',
                    project_name: 'Basket Milano Elite',
                    version: '2.1.0',
                    platform: 'android',
                    status: 'processing',
                    created_at: new Date().toISOString(),
                    assets: { screenshots: 0, banner: false }
                },
                {
                    id: '3',
                    project_name: 'Tennis Club Napoli',
                    version: '1.0.0',
                    platform: 'ios',
                    status: 'pending',
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    assets: { screenshots: 8, banner: true }
                }
            ]);
        } catch (error) {
            console.error('Error fetching releases:', error);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'released': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-white/5';
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
                        Release Hub
                    </h1>
                    <p className="text-slate-400 font-medium">Gestione distribuzione app partner e asset di marketing.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-white/[0.05] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                        <Share2 size={14} /> Marketing Kit
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                        <Zap size={14} /> Nuova Build
                    </button>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-white/[0.03] rounded-[32px] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Apple size={80} />
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400 mb-6">
                        <Apple size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">App Store</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-3xl font-black text-white italic tracking-tighter">14</div>
                            <div className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-wider">App Live</div>
                        </div>
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">Healthy</div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/[0.03] rounded-[32px] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <PlayCircle size={80} />
                    </div>
                    <div className="flex items-center gap-2 text-blue-400 mb-6">
                        <PlayCircle size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Google Play</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-3xl font-black text-white italic tracking-tighter">22</div>
                            <div className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-wider">App Live</div>
                        </div>
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">Healthy</div>
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-[32px] p-8 relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Globe size={80} strokeWidth={1} />
                    </div>
                    <div className="flex items-center gap-2 text-white/80 mb-6">
                        <Zap size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Jobs</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="text-3xl font-black text-white italic tracking-tighter">3</div>
                            <div className="text-xs text-indigo-200 font-bold uppercase mt-1 tracking-wider">In Processing</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Releases Table */}
            <div className="bg-slate-900/40 border border-white/[0.03] rounded-[32px] overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between p-6 border-b border-white/[0.03] bg-white/[0.01]">
                    <div className="flex items-center gap-6">
                        <label htmlFor="release-search" className="flex items-center gap-3 bg-slate-950/50 px-4 py-2.5 rounded-2xl border border-white/[0.05] cursor-text">
                            <Search size={16} className="text-slate-600" />
                            <input id="release-search" type="text" placeholder="Nome progetto o versione..." className="bg-transparent text-sm text-white outline-none border-none p-0 w-64 placeholder-slate-700" />
                        </label>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                        <Filter size={14} /> Filtri Avanzati
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.02]">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Applicazione / Cliente</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Versione & Platform</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Stato Rilascio</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Asset Marketing</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {releases.map((rel) => (
                                <tr key={rel.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/[0.05] flex items-center justify-center text-slate-600 group-hover:scale-105 transition-all">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-indigo-400 transition-colors">
                                                    {rel.project_name}
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                    Build ID: #{rel.id.padStart(4, '0')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="px-2 py-1 rounded-lg bg-slate-950 border border-white/[0.05] text-[10px] font-black text-white italic">
                                                V{rel.version}
                                            </div>
                                            <div className="text-slate-500">
                                                {rel.platform === 'ios' ? <Apple size={16} /> : <PlayCircle size={16} />}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getStatusStyles(rel.status)}`}>
                                            {rel.status === 'processing' && <Loader2 size={10} className="animate-spin" />}
                                            {rel.status === 'released' && <CheckCircle2 size={10} />}
                                            {rel.status === 'pending' && <Clock size={10} />}
                                            {rel.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${(rel.assets.screenshots / 8) * 100}%` }} />
                                                </div>
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                                    {rel.assets.screenshots}/8 SCREENS
                                                </span>
                                            </div>
                                            {rel.assets.banner && <CheckCircle2 size={12} className="text-emerald-500" />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2.5 text-slate-600 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Release Automation Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-900/40 via-blue-900/20 to-slate-900 border border-indigo-500/20 rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] -mr-24 -mt-24" />

                    <div className="relative space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Zap size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Build Automation Active</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">
                            Automazione AAB/IPA
                        </h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Le build vengono generate automaticamente ogni volta che un progetto viene marcato come "Pronto per il rilascio". Monitora i log di CI/CD in tempo reale.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <button className="px-8 py-3.5 bg-white text-indigo-950 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                                Vedi Pipeline Log
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-white/[0.03] rounded-[40px] p-10 flex flex-col justify-between group cursor-pointer hover:border-white/[0.08] transition-all">
                    <div className="space-y-6">
                        <div className="w-16 h-16 rounded-[24px] bg-slate-950 border border-white/[0.05] flex items-center justify-center text-slate-700 group-hover:text-amber-400 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                            <LayoutPanelTop size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight leading-none mb-2">Editor di Screenshot</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">Personalizza i template per le immagini dello store con i tuoi colori e testi di marketing.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black text-indigo-400 uppercase tracking-widest mt-8 group-hover:translate-x-2 transition-transform">
                        Apri Studio <ChevronRight size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
}
