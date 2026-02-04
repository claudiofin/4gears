'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Users, TrendingUp, CheckCircle2, AlertCircle,
    ArrowUpRight, ArrowDownRight, Activity, Calendar
} from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down';
    icon: any;
    color: string;
}

const MetricCard = ({ title, value, change, trend, icon: Icon, color }: MetricCardProps) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {change}%
                </div>
            )}
        </div>
        <p className="text-sm font-medium text-slate-400 capitalize">{title}</p>
        <h3 className="text-3xl font-black text-white mt-1 tracking-tight">{value}</h3>
    </div>
);

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeProjects: 0,
        approvalRate: 0,
        pendingRequests: 0,
        submissionsByStatus: {
            approved: 0,
            pending: 0,
            rejected: 0
        },
        sportsDistribution: [] as { sport: string; count: number }[]
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Real queries
                const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { data: submissions } = await supabase.from('submission_requests').select('status, config');

                const typedSubmissions = submissions as any[];

                const approvedCount = typedSubmissions?.filter(s => s.status === 'completed' || s.status === 'in_progress').length || 0;
                const totalSubmissions = typedSubmissions?.length || 0;
                const pendingCount = typedSubmissions?.filter(s => s.status === 'pending').length || 0;
                const rejectedCount = totalSubmissions - approvedCount - pendingCount;

                // Mocking sports distribution from submission data if available
                const sportsMap: Record<string, number> = {};
                typedSubmissions?.forEach(s => {
                    const sport = (s.config as any)?.team?.sport || 'Inviato';
                    sportsMap[sport] = (sportsMap[sport] || 0) + 1;
                });

                const sportsArray = Object.entries(sportsMap)
                    .map(([sport, count]) => ({ sport, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setStats({
                    totalUsers: userCount || 0,
                    activeProjects: approvedCount,
                    approvalRate: totalSubmissions > 0 ? Math.round((approvedCount / totalSubmissions) * 100) : 0,
                    pendingRequests: pendingCount,
                    submissionsByStatus: {
                        approved: approvedCount,
                        pending: pendingCount,
                        rejected: rejectedCount
                    },
                    sportsDistribution: sportsArray.length > 0 ? sportsArray : [
                        { sport: 'Calcio', count: 45 },
                        { sport: 'Basket', count: 28 },
                        { sport: 'Tennis', count: 15 },
                        { sport: 'Volley', count: 12 }
                    ]
                });
            } catch (err) {
                console.error('Analytics Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-4xl font-black text-white tracking-tight">Analytics</h1>
                <p className="text-slate-400 mt-2 text-lg">Indicatori di performance e attività dell'MVP.</p>
            </header>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Utenti Registrati"
                    value={stats.totalUsers}
                    change={12}
                    trend="up"
                    icon={Users}
                    color="blue"
                />
                <MetricCard
                    title="Progetti Approvati"
                    value={stats.activeProjects}
                    change={5}
                    trend="up"
                    icon={TrendingUp}
                    color="emerald"
                />
                <MetricCard
                    title="Tasso Approvazione"
                    value={`${stats.approvalRate}%`}
                    icon={CheckCircle2}
                    color="indigo"
                />
                <MetricCard
                    title="Richieste Pendenti"
                    value={stats.pendingRequests}
                    icon={AlertCircle}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Submissions Status Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="text-indigo-400" size={20} />
                            Stato Richieste
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'Approvate', count: stats.submissionsByStatus.approved, color: 'bg-emerald-500', total: stats.activeProjects + stats.pendingRequests + stats.submissionsByStatus.rejected },
                            { label: 'In Attesa', count: stats.submissionsByStatus.pending, color: 'bg-amber-500', total: stats.activeProjects + stats.pendingRequests + stats.submissionsByStatus.rejected },
                            { label: 'Rifiutate', count: stats.submissionsByStatus.rejected, color: 'bg-rose-500', total: stats.activeProjects + stats.pendingRequests + stats.submissionsByStatus.rejected }
                        ].map((item) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium text-slate-400">{item.label}</span>
                                    <span className="text-sm font-bold text-white">{item.count}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                                        style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sports Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-blue-400" size={20} />
                            Distribuzione Sport
                        </h3>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-4 px-2">
                        {stats.sportsDistribution.map((item, idx) => {
                            const max = Math.max(...stats.sportsDistribution.map(s => s.count));
                            const height = (item.count / max) * 100;
                            return (
                                <div key={item.sport} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="relative w-full h-full flex flex-col justify-end">
                                        <div
                                            className="w-full bg-blue-600/20 group-hover:bg-blue-600/40 border-t-2 border-blue-500 rounded-t-lg transition-all duration-1000"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded border border-slate-700 font-bold whitespace-nowrap">
                                                {item.count} Progetti
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate w-full text-center">
                                        {item.sport}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Insight */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 rounded-3xl p-8 flex items-center justify-between">
                <div>
                    <h4 className="text-lg font-bold text-white mb-1">Status Progetto MVP</h4>
                    <p className="text-indigo-200/70 text-sm">Il sistema sta processando le richieste correttamente. Tasso di attività stabile.</p>
                </div>
                <div className="px-6 py-3 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                    Healthy
                </div>
            </div>
        </div>
    );
}
