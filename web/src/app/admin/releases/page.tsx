'use client';

import { useState, useEffect } from 'react';
import {
    Smartphone, Globe, Zap, Search, Filter,
    ChevronRight, MoreHorizontal, Layout, Type, Palette,
    Plus, History, ShieldCheck, ArrowRightLeft, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface ReleaseAsset {
    screenshots: number;
    banner: boolean;
}

interface ApplicationRelease {
    id: string;
    project_name: string;
    version: string;
    platform: 'iOS' | 'Android' | 'Web';
    status: 'completed' | 'pending' | 'rejected' | 'processing';
    assets: ReleaseAsset;
    created_at: string;
}

export default function AdminReleasesPage() {
    const [releases, setReleases] = useState<ApplicationRelease[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [platformFilter, setPlatformFilter] = useState<'all' | 'iOS' | 'Android'>('all');

    useEffect(() => {
        const fetchReleases = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/releases');
                const data = await response.json();
                if (data.releases) {
                    setReleases(data.releases);
                }
            } catch (error) {
                console.error('Error fetching releases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReleases();
    }, []);

    const filteredReleases = releases.filter(rel => {
        const matchesPlatform = platformFilter === 'all' || rel.platform === platformFilter;
        const matchesSearch = rel.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rel.version.includes(searchQuery);
        return matchesPlatform && matchesSearch;
    });

    // Dynamic stats based on actual data
    const platformStats = {
        ios: releases.filter(r => r.platform === 'iOS').length,
        android: releases.filter(r => r.platform === 'Android').length,
        activePipelines: releases.filter(r => r.status === 'processing' || r.status === 'pending').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                        <span>/</span>
                        <span className="text-white font-medium">Release Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Release Coordination
                    </h1>
                    <p className="text-slate-400 font-medium">Gestione globale delle versioni e distribuzione asset marketing.</p>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl">
                        <History size={14} /> Pipeline Log
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                        <Plus size={14} /> Nuova Build
                    </button>
                </div>
            </header>

            {/* Quick Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 border border-white/[0.03] rounded-[32px] p-6 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-inner">
                            <Smartphone size={20} />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active iOS Apps</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white italic tracking-tighter">{platformStats.ios}</span>
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">+2 this month</span>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-white/[0.03] rounded-[32px] p-6 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-inner">
                            <Globe size={20} />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Android Apps</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white italic tracking-tighter">{platformStats.android}</span>
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Stable</span>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-white/[0.03] rounded-[32px] p-6 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20 shadow-inner">
                            <Zap size={20} className="animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pipeline Jobs</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white italic tracking-tighter">{platformStats.activePipelines}</span>
                        <span className="text-xs font-black text-amber-500 uppercase tracking-widest italic animate-pulse">Running</span>
                    </div>
                </div>
            </div>

            {/* Core Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Release List Control */}
                <div className="lg:col-span-8 bg-slate-900/50 border border-white/[0.03] rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                    <div className="p-8 border-b border-white/[0.03] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.01]">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Active Deployments</h2>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2.5 rounded-2xl border border-white/[0.05] shadow-inner">
                                <Search size={14} className="text-slate-600" />
                                <input
                                    type="text"
                                    placeholder="Search project..."
                                    className="bg-transparent text-xs text-white outline-none placeholder:text-slate-700 w-32 md:w-48"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-white/[0.05] shadow-inner">
                                <button
                                    onClick={() => setPlatformFilter('all')}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${platformFilter === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setPlatformFilter('iOS')}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${platformFilter === 'iOS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    iOS
                                </button>
                                <button
                                    onClick={() => setPlatformFilter('Android')}
                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${platformFilter === 'Android' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Android
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/40 text-[10px] uppercase font-black tracking-widest text-slate-600 border-b border-white/[0.02]">
                                <tr>
                                    <th className="px-8 py-4">Project Name</th>
                                    <th className="px-8 py-4 text-center">Version</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Assets</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {filteredReleases.map((release) => (
                                    <motion.tr
                                        key={release.id}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl ${release.platform === 'iOS' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'} shadow-inner border border-white/[0.03]`}>
                                                    {release.platform === 'iOS' ? <Smartphone size={16} /> : <Globe size={16} />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white uppercase italic tracking-tight">{release.project_name}</div>
                                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                        {format(new Date(release.created_at), 'd MMM yyyy', { locale: it })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono font-bold text-slate-400">
                                                {release.version}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full animate-pulse ${release.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                        release.status === 'processing' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                                                            'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                                    }`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${release.status === 'completed' ? 'text-emerald-400' :
                                                        release.status === 'processing' ? 'text-blue-400' :
                                                            'text-amber-400'
                                                    }`}>
                                                    {release.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950/50 rounded-lg border border-white/[0.03]">
                                                    <Smartphone size={10} className="text-slate-600" />
                                                    <span className="text-[9px] font-black text-slate-400">{release.assets.screenshots}</span>
                                                </div>
                                                {release.assets.banner && (
                                                    <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
                                                        <Zap size={10} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Studio & Automation Cards */}
                <div className="lg:col-span-4 space-y-6">
                    <Link href="/admin/releases/studio" className="block group">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 h-full min-h-[300px] flex flex-col justify-between border border-white/10 hover:scale-[1.01] transition-transform">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                                <Palette size={120} strokeWidth={1} />
                            </div>

                            <div className="relative space-y-4">
                                <div className="p-3 bg-white/10 rounded-[20px] backdrop-blur-md border border-white/20 w-fit">
                                    <Smartphone size={28} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic italic leading-none tracking-tighter">
                                    Screenshot Editor
                                </h3>
                                <p className="text-indigo-100/70 text-sm font-medium leading-relaxed max-w-[200px]">
                                    Progetta asset grafici per App Store e Play Store in pochi secondi.
                                </p>
                            </div>

                            <button className="relative w-full py-4 bg-white text-indigo-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors shadow-2xl shadow-black/20">
                                Open Studio <ChevronRight size={14} />
                            </button>
                        </div>
                    </Link>

                    <div className="bg-slate-900 border border-white/[0.03] rounded-[40px] p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Build Automation</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase">Live</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.05] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ArrowRightLeft size={14} className="text-slate-600" />
                                    <span className="text-xs font-bold text-slate-300">GitHub Actions</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">Synced</span>
                            </div>

                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/[0.05] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Zap size={14} className="text-slate-600" />
                                    <span className="text-xs font-bold text-slate-300">Cloud Build</span>
                                </div>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Idle</span>
                            </div>
                        </div>

                        <Link href="/admin/logs" className="block w-full py-4 bg-slate-950 border border-white/[0.05] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-center hover:text-white hover:border-white/10 transition-all">
                            View Pipeline Logs
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
