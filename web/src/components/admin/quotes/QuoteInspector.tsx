import React, { useState, useEffect } from 'react';
import { Calculator, Send, CheckCircle2, AlertCircle, TrendingDown, ExternalLink } from 'lucide-react';

interface QuoteAnalysis {
    totalHours: number;
    marketPrice: number;
    ourPrice: number;
    savings: number;
    breakdown: {
        base: number;
        hours: number;
        surcharge: number;
    };
}

interface QuoteInspectorProps {
    projectId: string;
    submissionId: string | null;
}

export function QuoteInspector({ projectId, submissionId }: QuoteInspectorProps) {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<QuoteAnalysis | null>(null);
    const [status, setStatus] = useState<'draft' | 'sent' | 'accepted' | 'rejected'>('draft');
    const [customPrice, setCustomPrice] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchQuote();
    }, [projectId]);

    const fetchQuote = async () => {
        try {
            const res = await fetch(`/api/admin/kanban/project/quote?projectId=${projectId}`);
            const data = await res.json();
            if (data.analysis) {
                setAnalysis(data.analysis);
                setCustomPrice(data.analysis.ourPrice.toString());
            }
            if (data.quote) {
                setStatus(data.quote.status);
                setNotes(data.quote.notes || '');
            }
        } catch (error) {
            console.error('Failed to fetch quote:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (newStatus?: string) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/kanban/project/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: projectId,
                    submission_id: submissionId,
                    total_amount: parseFloat(customPrice),
                    hypothetical_market_price: analysis?.marketPrice,
                    notes,
                    status: newStatus || status
                })
            });

            if (res.ok) {
                if (newStatus) setStatus(newStatus as any);
                alert('Preventivo salvato con successo');
            } else {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Errore durante il salvataggio');
            }
        } catch (error: any) {
            alert(error.message || 'Errore durante il salvataggio');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="animate-pulse h-64 bg-slate-800/50 rounded-xl" />;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-semibold text-white">Analisi Preventivo</h3>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                    status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-700 text-slate-300'
                    }`}>
                    {status}
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Market Price Analysis */}
                <div className="relative p-6 rounded-xl bg-slate-800/50 border border-slate-800 overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium mb-1">Stima Prezzo di Mercato</p>
                        <p className="text-3xl font-bold text-white">€{analysis?.marketPrice.toLocaleString()}</p>
                        <p className="text-slate-500 text-[10px] mt-2 italic leading-relaxed">
                            Analisi basata su: Setup base (€{analysis?.breakdown.base.toLocaleString()}),
                            sviluppo custom (€120/h) e surcharges per urgenze.
                        </p>
                    </div>
                </div>

                {analysis?.totalHours === 0 && (
                    <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-orange-300/80 leading-relaxed">
                            <p className="font-bold text-orange-400 mb-1 caps">Nessun Task Identificato</p>
                            Il calcolo è basato solo sui costi fissi di setup. Aggiungi dei Task nel Kanban per generare una stima accurata delle ore di sviluppo.
                        </div>
                    </div>
                )}

                {/* Savings Indicator */}
                {analysis && analysis.savings > 0 && (
                    <div className="flex items-center gap-4 py-2">
                        <div className="h-[1px] flex-1 bg-slate-800" />
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            <TrendingDown className="w-4 h-4" />
                            Risparmio Stimato: €{analysis.savings.toLocaleString()}
                        </div>
                        <div className="h-[1px] flex-1 bg-slate-800" />
                    </div>
                )}

                {/* Our Price Setup */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Prezzo 4Gears (Il tuo preventivo)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                            <input
                                type="number"
                                value={customPrice}
                                onChange={(e) => setCustomPrice(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white font-bold text-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Note per il Club</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Inserisci dettagli sui costi scommessi, hosting, o sconti applicati..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                        />
                    </div>
                </div>

                {/* Metadata Breakdown */}
                <div className="bg-slate-800/30 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ore Stimate</p>
                        <p className="text-sm text-slate-200 font-medium">{analysis?.totalHours}h</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Task Urgenti</p>
                        <p className="text-sm text-slate-200 font-medium">
                            {analysis?.breakdown.surcharge! / 150} identificati
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-800/50 border-t border-slate-800 flex gap-3">
                <button
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    Salva Bozza
                </button>
                <button
                    onClick={() => handleSave('sent')}
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                    Invia Preventivo
                </button>
            </div>
        </div>
    );
}
