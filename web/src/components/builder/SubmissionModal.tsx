'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react';

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectName: string;
    config: any;
}

export default function SubmissionModal({ isOpen, onClose, projectId, projectName, config }: SubmissionModalProps) {
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!notes.trim()) {
            setError('Le note sono obbligatorie');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    notes,
                    config
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Errore nell\'invio della richiesta');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setNotes('');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Errore nell\'invio della richiesta');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {success ? (
                            <div className="text-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', duration: 0.5 }}
                                >
                                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Richiesta Inviata!</h3>
                                <p className="text-slate-400">Il tuo progetto è stato inviato per la creazione.</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Invia per Creazione</h2>
                                        <p className="text-slate-400">Progetto: <span className="font-semibold text-white">{projectName}</span></p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Notes Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Note e Richieste <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Descrivi le tue richieste, preferenze di design, funzionalità specifiche, o qualsiasi altra informazione utile per la creazione dell'app..."
                                        className="w-full h-48 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                        required
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Sii il più dettagliato possibile per aiutarci a creare l'app perfetta per te.
                                    </p>
                                </div>

                                {/* Config Preview */}
                                <div className="mb-6 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Configurazione Inclusa</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Team:</span>
                                            <span className="text-white font-medium">{config?.team?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Sport:</span>
                                            <span className="text-white font-medium">{config?.team?.sportType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Tema:</span>
                                            <span className="text-white font-medium">{config?.theme?.fontFamily || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Funzionalità:</span>
                                            <span className="text-white font-medium">
                                                {Object.values(config?.features || {}).filter((f: any) => f.enabled).length} attive
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        disabled={submitting}
                                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !notes.trim()}
                                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Invio...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Invia Richiesta
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
