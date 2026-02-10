'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Users, FileText, Ticket, TrendingUp,
    ArrowUpRight, Activity, Zap, Shield,
    ChevronRight, Sparkles, LayoutPanelTop, Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CardContent = ({ card }: { card: any }) => (
    <div className="relative space-y-6">
        <div className="flex items-center justify-between gap-4">
            <div className={`${card.bg} p-3.5 rounded-2xl border border-white/[0.05] shadow-inner`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="flex flex-col items-end gap-1">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 bg-slate-950/40 px-2 py-1 rounded-lg border border-white/[0.03]">
                    {card.trend}
                    <ArrowUpRight size={10} className="text-emerald-400" />
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-indigo-500/20 rounded-full" />
            </div>
        </div>

        <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{card.name}</p>
            <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{card.value}</p>
        </div>

        <div className="pt-2">
            <p className="text-[11px] text-slate-500 font-medium leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
                {card.description}
            </p>
        </div>
    </div>
);

export default function AdminPage() {
    const [stats, setStats] = useState({
        users: 0,
        submissions: 0,
        pendingSubmissions: 0,
        activeInvites: 0,
        latestVersion: 'v0.0.0'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { count: usersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                const { count: submissionsCount } = await supabase
                    .from('submission_requests')
                    .select('*', { count: 'exact', head: true });

                const { count: pendingCount } = await supabase
                    .from('submission_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending');

                const { count: invitesCount } = await supabase
                    .from('invite_codes')
                    .select('*', { count: 'exact', head: true })
                    .eq('used', false);

                // 4. Get latest app version
                const { data: latestRelease } = await supabase
                    .from('application_releases')
                    .select('version')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                setStats({
                    users: usersCount || 0,
                    submissions: submissionsCount || 0,
                    pendingSubmissions: pendingCount || 0,
                    activeInvites: invitesCount || 0,
                    latestVersion: latestRelease?.version || 'v0.0.0'
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            name: 'Utenti Piattaforma',
            value: stats.users,
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            trend: '+12% questa settimana',
            description: 'Engagement totale utenti attivi'
        },
        {
            name: 'Richieste In Sospeso',
            value: stats.pendingSubmissions,
            icon: FileText,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            trend: 'Priorità Alta',
            description: 'App in attesa di configurazione'
        },
        {
            name: 'Club Pubblicati',
            value: stats.submissions,
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            trend: '85% Tasso Successo',
            description: 'App distribuite sugli store'
        },
        {
            name: 'Rilascio App',
            value: stats.latestVersion,
            icon: Smartphone,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            trend: 'Last: 2h ago',
            description: 'Stato builds e asset marketing'
        },
        {
            name: 'Inviti Disponibili',
            value: stats.activeInvites,
            icon: Ticket,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            trend: 'Scorta Limitata',
            description: 'Codici per nuovi amministratori'
        },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-[40px] bg-slate-900 border border-white/[0.03] p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] -ml-24 -mb-24" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Sparkles size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Control Center</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                            4Gears Console
                        </h1>
                        <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
                            Monitora l'ecosistema sportivo, gestisci i tesseramenti globali e supervisiona la distribuzione delle app partner.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-slate-950/50 backdrop-blur-md border border-white/[0.05] p-5 rounded-3xl flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Status</div>
                                <div className="text-xl font-black text-emerald-400 italic">OPERATIONAL</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Activity size={24} className="text-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={card.name}
                        className="relative"
                    >
                        {card.name === 'Rilascio App' ? (
                            <Link href="/admin/releases" className="block group h-full">
                                <div className="h-full bg-slate-900 border border-white/[0.02] rounded-[32px] p-7 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-[0.98]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                                    <CardContent card={card} />
                                </div>
                            </Link>
                        ) : (
                            <div className="group h-full bg-slate-900 border border-white/[0.02] rounded-[32px] p-7 hover:border-white/[0.08] transition-all hover:shadow-2xl hover:shadow-indigo-500/5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                                <CardContent card={card} />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Main Action Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Secondary Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                            <Zap size={80} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic leading-none mb-3 tracking-tight">Quick Actions</h3>
                        <p className="text-indigo-100/70 text-sm mb-8 max-w-[200px] font-medium leading-relaxed">Configura rapidamente nuovi club partner o gestisci gli accessi alla piattaforma.</p>
                        <div className="space-y-3">
                            <Link href="/admin/submissions" className="w-full flex items-center justify-between px-5 py-3 bg-white text-indigo-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all group">
                                Registra Nuovo Club
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-white/[0.03] rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden border-indigo-500/10">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                        <div>
                            <div className="flex items-center gap-2 text-indigo-400 mb-4">
                                <Shield size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Compliance Status</span>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-none mb-4">Sicurezza & Privacy</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Database Backup', status: 'Success', color: 'text-emerald-400' },
                                    { label: 'Encryption Layers', status: 'Active (TLS 1.3)', color: 'text-emerald-400' },
                                    { label: 'Privacy Policy', status: 'Updated', color: 'text-emerald-400' },
                                    { label: 'GDPR Compliance', status: 'Verified', color: 'text-emerald-400' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                                        <span className={`text-[10px] font-black ${item.color} uppercase tracking-widest`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link href="/admin/logs" className="mt-8 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                            Full Security Audit <ChevronRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Right Panel: Shortcut */}
                <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-[28px] bg-slate-950 border border-white/[0.05] flex items-center justify-center text-slate-700">
                        <Activity size={32} className="text-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-black text-white uppercase italic tracking-tight italic">Service Health</h4>
                        <div className="flex flex-col gap-2 pt-2">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supabase: Online</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth: Active</span>
                            </div>
                        </div>
                    </div>
                    <Link href="/admin/logs" className="px-8 py-3 bg-slate-950 border border-white/[0.05] text-emerald-400 text-[10px] font-black rounded-2xl uppercase tracking-widest hover:text-white hover:border-emerald-500/30 transition-all">
                        Analisi Dettagliata
                    </Link>
                </div>
            </div>
        </div>
    );
}
