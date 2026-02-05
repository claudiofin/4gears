'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, Euro, Calculator, Info, Loader2 } from 'lucide-react';

interface QuoteViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    quote: any;
    onStatusUpdate: (newStatus: 'accepted' | 'rejected') => void;
}

export default function QuoteViewerModal({ isOpen, onClose, projectId, quote, onStatusUpdate }: QuoteViewerModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAction = async (action: 'accepted' | 'rejected') => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/project/quote/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, status: action })
            });

            if (!res.ok) throw new Error('Errore durante l\'operazione');

            onStatusUpdate(action);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!quote) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <Calculator size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Preventivo Progetto</h3>
                                    <p className="text-xs text-slate-400">Offerta riservata da 4Gears</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            {/* Main Price Card */}
                            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl shadow-indigo-500/20 overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Euro size={120} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-indigo-100 text-sm font-medium mb-1">Investimento Totale</p>
                                    <h2 className="text-5xl font-black text-white">€{quote.total_amount.toLocaleString()}</h2>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold text-white">COSTO UNICO</div>
                                        <div className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold text-white">SCONTO EARLY BIRD</div>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Section (If applicable) */}
                            {quote.hypothetical_market_price && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Prezzo Mercato</p>
                                        <p className="text-lg font-bold text-slate-400 line-through decoration-red-500/50 decoration-2">€{quote.hypothetical_market_price.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                        <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Il tuo Risparmio</p>
                                        <p className="text-lg font-bold text-emerald-400">€{(quote.hypothetical_market_price - quote.total_amount).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {quote.notes && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Info size={16} />
                                        <span className="text-sm font-bold uppercase tracking-wider">Note Dello Sviluppatore</span>
                                    </div>
                                    <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-800/50 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                        {quote.notes}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 bg-slate-800/50 border-t border-slate-800 flex gap-4">
                            {quote.status === 'sent' ? (
                                <>
                                    <button
                                        disabled={loading}
                                        onClick={() => handleAction('rejected')}
                                        className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} />
                                        Rifiuta
                                    </button>
                                    <button
                                        disabled={loading}
                                        onClick={() => handleAction('accepted')}
                                        className="flex-[2] py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                                        Accetta Preventivo
                                    </button>
                                </>
                            ) : (
                                <div className={`w-full py-4 text-center font-bold rounded-2xl border uppercase tracking-widest text-xs
                                    ${quote.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}
                                `}>
                                    {quote.status === 'accepted' ? 'Preventivo Accettato' : 'Preventivo Rifiutato'}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
