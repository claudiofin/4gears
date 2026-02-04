'use client';

import { useState, useEffect } from 'react';
import { Github, Key, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
    const [pat, setPat] = useState('');
    const [hasPat, setHasPat] = useState(false);
    const [maskedPat, setMaskedPat] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/git-config');
            const data = await res.json();
            if (data.hasPat) {
                setHasPat(true);
                setMaskedPat(data.maskedPat);
            }
        } catch (err) {
            console.error('Failed to fetch config');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            const res = await fetch('/api/admin/git-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pat })
            });

            if (res.ok) {
                setStatus({ type: 'success', message: 'Configurazione salvata con successo!' });
                setPat('');
                fetchConfig();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Errore durante il salvataggio');
            }
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-400">Caricamento impostazioni...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-8">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight">Impostazioni Admin</h1>
                <p className="text-slate-400">Configura le integrazioni esterne e le chiavi API.</p>
            </header>

            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-white">
                        <Github size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">GitHub Integration</h2>
                        <p className="text-sm text-slate-400">Inserisci il tuo Personal Access Token per automatizzare la creazione dei repository.</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {hasPat && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
                            <CheckCircle size={18} />
                            <span>GitHub PAT configurato: <strong>{maskedPat}</strong></span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Nuovo Personal Access Token (PAT)</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="password"
                                    value={pat}
                                    onChange={(e) => setPat(e.target.value)}
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-xl text-sm flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                    }`}
                            >
                                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                {status.message}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={saving || !pat}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Salva Configurazione
                        </button>
                    </form>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <h4 className="text-sm font-semibold text-amber-500 mb-1 flex items-center gap-2">
                            <AlertCircle size={14} />
                            Nota di Sicurezza
                        </h4>
                        <p className="text-xs text-amber-200/70 leading-relaxed">
                            Il token deve avere gli scope <code>repo</code> per creare repository privati.
                            Assicurati di conservarlo in modo sicuro. Attualmente viene salvato direttamente nel database public.admin_settings.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
