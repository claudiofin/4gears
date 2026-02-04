'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SubmissionRequest } from '@/types/database';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Check, X, FileText, Loader2 } from 'lucide-react';

// Extend type to include joined profile email
type ExtendedSubmission = SubmissionRequest & {
    profiles: { email: string | null } | null;
};

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<ExtendedSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        try {
            const { data, error } = await supabase
                .from('submission_requests')
                .select('*, profiles(email)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubmissions((data as unknown) as ExtendedSubmission[]);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: 'completed' | 'rejected') => {
        setProcessingId(id);
        try {
            const { error } = await (supabase as any)
                .from('submission_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Refresh local state
            setSubmissions((prev) =>
                prev.map((sub) =>
                    sub.id === id ? { ...sub, status: newStatus } : sub
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Errore durante aggiornamento stato.');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    if (loading) return <div className="text-slate-400">Caricamento richieste...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Richieste di Creazione</h2>
                <p className="text-slate-400">Gestisci le richieste di deploy inviate dagli utenti.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-500">
                                <th className="p-4 font-semibold">Utente</th>
                                <th className="p-4 font-semibold">Progetto / Data</th>
                                <th className="p-4 font-semibold">Note</th>
                                <th className="p-4 font-semibold">Stato</th>
                                <th className="p-4 font-semibold text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">
                                            {sub.profiles?.email || 'Email non disponibile'}
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">
                                            {sub.user_id.substring(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-white">
                                            {(sub.config as any)?.team?.name || 'Senza Nome'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {format(new Date(sub.created_at), 'd MMM yyyy, HH:mm', { locale: it })}
                                        </div>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="text-sm text-slate-300 truncate" title={sub.notes || ''}>
                                            {sub.notes || '-'}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(sub.status)} capitalize`}>
                                            {sub.status === 'pending' ? 'In Attesa' : sub.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {sub.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(sub.id, 'completed')}
                                                    disabled={!!processingId}
                                                    className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Approva"
                                                >
                                                    {processingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                                                    disabled={!!processingId}
                                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Rifiuta"
                                                >
                                                    {processingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                </button>
                                            </>
                                        )}
                                        {sub.status !== 'pending' && (
                                            <span className="text-xs text-slate-600 italic">
                                                Processata
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        Nessuna richiesta trovata.
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
