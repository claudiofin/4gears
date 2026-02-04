'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, FileText, Ticket, TrendingUp } from 'lucide-react';

export default function AdminPage() {
    const [stats, setStats] = useState({
        users: 0,
        submissions: 0,
        pendingSubmissions: 0,
        activeInvites: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch users count (approximate via profiles)
                const { count: usersCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // Fetch submissions
                const { count: submissionsCount } = await supabase
                    .from('submission_requests')
                    .select('*', { count: 'exact', head: true });

                const { count: pendingCount } = await supabase
                    .from('submission_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending');

                // Fetch invites
                const { count: invitesCount } = await supabase
                    .from('invite_codes')
                    .select('*', { count: 'exact', head: true })
                    .eq('used', false);

                setStats({
                    users: usersCount || 0,
                    submissions: submissionsCount || 0,
                    pendingSubmissions: pendingCount || 0,
                    activeInvites: invitesCount || 0,
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
            name: 'Utenti Totali',
            value: stats.users,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            name: 'Richieste Pendenti',
            value: stats.pendingSubmissions,
            icon: FileText,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
        },
        {
            name: 'Progetti Totali',
            value: stats.submissions, // Using submissions as proxy for now or could fetch projects
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
        },
        {
            name: 'Codici Attivi',
            value: stats.activeInvites,
            icon: Ticket,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
    ];

    if (loading) return null;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
                <p className="text-slate-400 mt-2">Panoramica della piattaforma 4Gears.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.name} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.bg} p-3 rounded-lg`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400">{card.name}</p>
                        <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
