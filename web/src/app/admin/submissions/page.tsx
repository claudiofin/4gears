'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SubmissionRequest } from '@/types/database';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Check, X, FileText, Loader2 } from 'lucide-react';

// Extend type to include joined profile email and new contact fields
export type ExtendedSubmission = SubmissionRequest & {
    profiles: { email: string | null } | null;
    test_email?: string;
    phone_number?: string;
    github_repo_url?: string;
    github_repo_name?: string;
};

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<ExtendedSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<ExtendedSubmission | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        try {
            setError(null);
            const { data, error } = await supabase
                .from('submission_requests')
                .select('*, profiles!user_id(email)')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching submissions:', error);
                setError(error.message);
                return;
            }
            setSubmissions(data as ExtendedSubmission[]);
        } catch (err: any) {
            console.error('Error in fetchSubmissions:', err);
            setError(err.message || 'Errore sconosciuto');
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
            const { error } = await supabase
                .from('submission_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) {
                console.error('DATABASE ERROR:', error);
                throw error;
            }

            // Refresh local state
            setSubmissions((prev) =>
                prev.map((sub) =>
                    sub.id === id ? { ...sub, status: newStatus } : sub
                )
            );
            setSelectedSubmission(null);
        } catch (error: any) {
            console.error('Error updating status:', error);
            alert(`Errore: ${error.message || 'Errore durante l\'aggiornamento dello stato.'}\n\nVerifica i log della console per i dettagli.`);
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20 text-amber-500';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                    Errore: {error}
                </div>
            )}
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Richieste di Creazione</h2>
                <p className="text-slate-400">Gestisci le richieste di deploy inviate dagli utenti.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-500">
                                <th className="p-4 font-semibold">Utente</th>
                                <th className="p-4 font-semibold">Progetto / Data</th>
                                <th className="p-4 font-semibold">Stato</th>
                                <th className="p-4 font-semibold text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white truncate max-w-[200px]" title={sub.profiles?.email || ''}>
                                            {sub.profiles?.email || 'N/A'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 space-y-0.5">
                                            {sub.test_email && <div className="flex items-center gap-1"><span>Test:</span> <span className="text-blue-400">{sub.test_email}</span></div>}
                                            {sub.phone_number && <div className="flex items-center gap-1"><span>Tel:</span> <span className="text-emerald-400">{sub.phone_number}</span></div>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-white">
                                            {(sub.config as any)?.team?.name || 'Senza Nome'}
                                        </div>
                                        <div className="text-[11px] text-slate-500 uppercase font-mono">
                                            {format(new Date(sub.created_at), 'd MMM yyyy, HH:mm', { locale: it })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(sub.status)} uppercase tracking-wider`}>
                                            {sub.status === 'pending' ? 'In Attesa' : sub.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedSubmission(sub)}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 ml-auto"
                                        >
                                            <FileText size={14} />
                                            Analizza
                                        </button>
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

            {/* MODAL ANALIZZA E CONFERMA */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                            <div>
                                <h3 className="text-xl font-bold text-white">Analisi Richiesta</h3>
                                <p className="text-xs text-slate-400">ID: {selectedSubmission.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Utente</p>
                                    <p className="text-sm text-white font-bold">{selectedSubmission.profiles?.email}</p>
                                </div>
                                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Contatto</p>
                                    <p className="text-sm text-white font-bold">{selectedSubmission.phone_number || '-'}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                <p className="text-[10px] text-slate-500 uppercase font-black mb-1 text-blue-400">Note Utente</p>
                                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{selectedSubmission.notes || 'Nessuna nota fornita.'}</p>
                            </div>

                            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 text-indigo-400">Configurazione JSON</p>
                                <pre className="text-[10px] bg-black/50 p-4 rounded-xl text-indigo-300 overflow-x-auto border border-indigo-500/10 h-48 custom-scrollbar">
                                    {JSON.stringify(selectedSubmission.config, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-800 flex gap-4 bg-slate-950/50">
                            {selectedSubmission.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                                        disabled={!!processingId}
                                        className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-black rounded-2xl border border-red-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {processingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <X size={18} />}
                                        RIFIUTA
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'completed')}
                                        disabled={!!processingId}
                                        className="flex-2 py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 px-8"
                                    >
                                        {processingId ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} />}
                                        CONFERMA E COMPLETA
                                    </button>
                                </>
                            ) : (
                                <div className="w-full text-center py-2 text-slate-400 italic text-sm">
                                    Questa richiesta è già stata processata (Stato: {selectedSubmission.status})
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
