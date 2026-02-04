'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { InviteCode } from '@/types/database';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Plus, Copy, Check, Ticket } from 'lucide-react';

export default function InvitesPage() {
    const [invites, setInvites] = useState<InviteCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchInvites = async () => {
        try {
            const { data, error } = await supabase
                .from('invite_codes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvites(data || []);
        } catch (error) {
            console.error('Error fetching invites:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const generateCode = async () => {
        setGenerating(true);
        try {
            const code = `4G-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const { data, error } = await (supabase as any)
                .from('invite_codes')
                .insert([{
                    code,
                    used: false,
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setInvites([data, ...invites]);
            }
        } catch (error) {
            console.error('Error generating code:', error);
            alert('Errore generazione codice.');
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) return <div className="text-slate-400">Caricamento inviti...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Codici Invito</h2>
                    <p className="text-slate-400">Genera codici per permettere la registrazione.</p>
                </div>
                <button
                    onClick={generateCode}
                    disabled={generating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    {generating ? 'Generazione...' : 'Nuovo Codice'}
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-500">
                                <th className="p-4 font-semibold">Codice</th>
                                <th className="p-4 font-semibold">Stato</th>
                                <th className="p-4 font-semibold">Generato il</th>
                                <th className="p-4 font-semibold">Usato da</th>
                                <th className="p-4 font-semibold text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {invites.map((invite) => (
                                <tr key={invite.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-mono text-white text-lg font-bold tracking-wider">
                                        {invite.code}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${invite.used
                                            ? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {invite.used ? 'Usato' : 'Disponibile'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-400">
                                        {format(new Date(invite.created_at), 'd MMM yyyy, HH:mm', { locale: it })}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 font-mono">
                                        {invite.used_by ? `${invite.used_by.substring(0, 8)}...` : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => copyToClipboard(invite.code, invite.id)}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                            title="Copia codice"
                                        >
                                            {copiedId === invite.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {invites.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Nessun codice generato.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
