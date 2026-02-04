'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SubmissionRequest } from '@/types/database';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
    Check, X, FileText, Loader2, Users, Trophy,
    Palette, Layers, Code, Mail, Phone, Layout,
    Activity, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [activeTab, setTab] = useState<'info' | 'team' | 'design' | 'features' | 'raw'>('info');

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
            // Update submission status
            const { error } = await (supabase as any)
                .from('submission_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) {
                console.error('DATABASE ERROR:', error);
                throw error;
            }

            // If approved, create Kanban project
            if (newStatus === 'completed') {
                const submission = submissions.find(s => s.id === id);
                if (submission) {
                    try {
                        // Extract data from config
                        const config = submission.config as any;
                        const teamName = config?.identity?.teamName || config?.team_name || 'Nuovo Progetto';
                        const sportType = config?.identity?.sportType || config?.sport_type || 'Sport';

                        const response = await fetch('/api/admin/kanban/project', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                submission_id: id,
                                name: teamName,
                                description: `Progetto ${sportType} per ${teamName}`,
                                github_repo_url: submission.github_repo_url,
                                github_repo_name: submission.github_repo_name,
                            }),
                        });

                        if (!response.ok) {
                            throw new Error('Failed to create Kanban project');
                        }

                        const { project } = await response.json();

                        // Show success message and redirect
                        alert(`✅ Progetto approvato!\n\nKanban board creata con successo.\nVerrai reindirizzato alla board del progetto.`);

                        // Redirect to project board
                        window.location.href = `/admin/kanban/${project.id}`;
                        return; // Don't continue with normal flow
                    } catch (kanbanError: any) {
                        console.error('Error creating Kanban project:', kanbanError);
                        alert(`⚠️ Progetto approvato, ma errore nella creazione della Kanban board:\n${kanbanError.message}\n\nPuoi crearla manualmente dalla sezione Kanban.`);
                    }
                }
            }

            // Refresh local state (only if not redirecting)
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
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Status Header */}
                        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <FileText className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight uppercase">Analisi Dettagliata</h3>
                                    <p className="text-[10px] text-slate-500 font-mono">REQ_{selectedSubmission.id.slice(0, 8)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusColor(selectedSubmission.status)}`}>
                                    {selectedSubmission.status}
                                </span>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="p-2 hover:bg-slate-800 rounded-full transition-all hover:rotate-90"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex px-8 bg-slate-950/30 border-b border-slate-800/50">
                            {[
                                { id: 'info', label: 'Utente', icon: Users },
                                { id: 'team', label: 'Team & Sport', icon: Trophy },
                                { id: 'design', label: 'Design System', icon: Palette },
                                { id: 'features', label: 'Funzionalità', icon: Layers },
                                { id: 'raw', label: 'Dati JSON', icon: Code },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id as any)}
                                    className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 ${activeTab === t.id
                                        ? 'border-blue-500 text-white bg-blue-500/5'
                                        : 'border-transparent text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    <t.icon size={14} />
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'info' && (
                                    <motion.div
                                        key="info"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl group hover:border-blue-500/30 transition-all">
                                                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                                                    <Mail size={12} className="text-blue-500" /> Email Account
                                                </p>
                                                <p className="text-lg text-white font-bold">{selectedSubmission.profiles?.email}</p>
                                            </div>
                                            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl group hover:border-emerald-500/30 transition-all">
                                                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                                                    <Phone size={12} className="text-emerald-500" /> Contatto Telefonico
                                                </p>
                                                <p className="text-lg text-white font-bold">{selectedSubmission.phone_number || 'Non fornito'}</p>
                                            </div>
                                            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl group md:col-span-2">
                                                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                                                    <Mail size={12} className="text-purple-500" /> Email per i Test
                                                </p>
                                                <p className="text-lg text-white font-bold">{selectedSubmission.test_email || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
                                            <p className="text-[10px] text-blue-400 uppercase font-black mb-3 flex items-center gap-2">
                                                <FileText size={12} /> Note dell'utente
                                            </p>
                                            <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap italic">
                                                "{selectedSubmission.notes || 'Nessuna nota fornita.'}"
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'team' && (
                                    <motion.div
                                        key="team"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div
                                                className="w-20 h-20 rounded-[24px] border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden bg-slate-950"
                                                style={{ borderLeft: `4px solid ${(selectedSubmission.config as any)?.team?.colors?.primary || '#3b82f6'}` }}
                                            >
                                                <Trophy className="w-10 h-10 text-slate-700" />
                                            </div>
                                            <div>
                                                <h4 className="text-3xl font-black text-white">{(selectedSubmission.config as any)?.team?.name}</h4>
                                                <p className="text-slate-500 font-mono text-xs">{(selectedSubmission.config as any)?.team?.slug}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Sport</p>
                                                <p className="text-sm text-white font-bold">{(selectedSubmission.config as any)?.team?.sportType || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">ID Team</p>
                                                <p className="text-sm text-white font-bold">{(selectedSubmission.config as any)?.team?.id || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Piattaforma</p>
                                                <p className="text-sm text-white font-bold">App Mobile</p>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl">
                                            <p className="text-[10px] text-slate-500 uppercase font-black mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Colore Brand Primario
                                            </p>
                                            <div className="flex items-center gap-6">
                                                <div
                                                    className="w-24 h-24 rounded-2xl border border-white/10 shadow-xl"
                                                    style={{ backgroundColor: (selectedSubmission.config as any)?.team?.colors?.primary }}
                                                />
                                                <div className="space-y-2">
                                                    <p className="text-white font-mono font-bold">{(selectedSubmission.config as any)?.team?.colors?.primary}</p>
                                                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 w-full" style={{ backgroundColor: (selectedSubmission.config as any)?.team?.colors?.primary }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'design' && (
                                    <motion.div
                                        key="design"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Tipografia</p>
                                                    <p className="text-xl font-bold text-white" style={{ fontFamily: (selectedSubmission.config as any)?.theme?.fontFamily }}>
                                                        {(selectedSubmission.config as any)?.theme?.fontFamily}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Stile Navigazione</p>
                                                    <div className="flex items-center gap-2 text-white font-bold">
                                                        <Layout size={16} className="text-blue-500" />
                                                        {(selectedSubmission.config as any)?.theme?.navStyle}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Border Radius</p>
                                                    <p className="text-lg font-bold text-white uppercase tracking-wider">
                                                        {(selectedSubmission.config as any)?.theme?.borderRadius}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Supporto Dark/Light</p>
                                                    <div className="flex gap-2">
                                                        {(selectedSubmission.config as any)?.theme?.supportDarkMode && <div className="px-2 py-1 bg-slate-800 rounded-lg text-[10px] text-white">DARK</div>}
                                                        {(selectedSubmission.config as any)?.theme?.supportLightMode && <div className="px-2 py-1 bg-white rounded-lg text-[10px] text-black">LIGHT</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl">
                                            <p className="text-[10px] text-slate-500 uppercase font-black mb-4">Navigazione Bottom Bar</p>
                                            <div className="flex gap-4">
                                                {(selectedSubmission.config as any)?.theme?.navigation?.map((nav: any) => (
                                                    <div key={nav.id} className={`flex flex-col items-center gap-2 p-3 border rounded-xl ${nav.enabled ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-800 opacity-30 text-slate-600'}`}>
                                                        <Activity size={18} className={nav.enabled ? 'text-blue-400' : ''} />
                                                        <span className="text-[10px] font-bold">{nav.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'features' && (
                                    <motion.div
                                        key="features"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries((selectedSubmission.config as any)?.features || {}).map(([key, feat]: [string, any]) => (
                                                <div key={key} className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${feat.enabled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-950/50 border-slate-800 grayscale'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl ${feat.enabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-600'}`}>
                                                            <ShieldCheck size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{feat.label}</p>
                                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{feat.minTier}</p>
                                                        </div>
                                                    </div>
                                                    {feat.enabled ? (
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                    ) : (
                                                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'raw' && (
                                    <motion.div
                                        key="raw"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="p-1 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
                                            <pre className="text-[11px] p-6 text-indigo-300 overflow-x-auto h-[450px] custom-scrollbar selection:bg-indigo-500/30">
                                                {JSON.stringify(selectedSubmission.config, null, 2)}
                                            </pre>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Bar */}
                        <div className="p-8 border-t border-slate-800 flex gap-4 bg-slate-950/80 backdrop-blur-xl">
                            {selectedSubmission.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                                        disabled={!!processingId}
                                        className="px-8 py-5 bg-slate-900 hover:bg-red-500 group rounded-[20px] border border-slate-800 hover:border-red-500 transition-all flex items-center gap-3"
                                    >
                                        <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-white/20">
                                            <X size={18} className="text-red-500 group-hover:text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] text-slate-500 group-hover:text-white/70 font-black uppercase">Annulla</p>
                                            <p className="text-white font-bold text-sm">RIFIUTA ORDINE</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'completed')}
                                        disabled={!!processingId}
                                        className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] active:scale-[0.98] text-white rounded-[20px] shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-4 group"
                                    >
                                        <div className="flex flex-col items-center">
                                            {processingId ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <p className="text-[10px] text-blue-200/70 font-black uppercase tracking-[0.2em]">Processo Automatizzato</p>
                                                    <div className="flex items-center gap-2">
                                                        <Check size={24} className="group-hover:translate-x-1 transition-transform" />
                                                        <span className="text-xl font-black">CONFERMA E COMPLETA</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </>
                            ) : (
                                <div className="w-full text-center py-4 text-slate-500 font-bold border border-slate-800 rounded-2xl bg-slate-950/20">
                                    Richiesta già processata in data {format(new Date(selectedSubmission.updated_at), 'd MMMM yyyy', { locale: it })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
