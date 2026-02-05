import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard, ShieldCheck, Sparkles, Settings2, HelpCircle, CheckCircle2, Lock, ChevronRight, Zap, Globe, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tier {
    id?: string;
    name: string;
    description: string;
    price: number;
    interval: 'monthly' | 'yearly' | 'one_time';
    features: string[];
    revenuecat_id?: string;
}

interface TierConfigPanelProps {
    projectId: string;
}

export function TierConfigPanel({ projectId }: TierConfigPanelProps) {
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTiers();
    }, [projectId]);

    const fetchTiers = async () => {
        try {
            const res = await fetch(`/api/user/app-tiers?projectId=${projectId}`);
            const data = await res.json();
            if (data.tiers) setTiers(data.tiers);
        } catch (error) {
            console.error('Failed to fetch tiers:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTier = () => {
        setTiers([...tiers, {
            name: 'Pro Members',
            description: 'Massime prestazioni per il tuo team',
            price: 19.99,
            interval: 'monthly',
            features: ['Live data access', 'Advanced analytics', 'Priority support']
        }]);
    };

    const removeTier = (index: number) => {
        setTiers(tiers.filter((_, i) => i !== index));
    };

    const updateTier = (index: number, updates: Partial<Tier>) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], ...updates };
        setTiers(newTiers);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/app-tiers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, tiers })
            });
            if (res.ok) alert('Piani salvati correttamente');
        } catch (error) {
            alert('Errore durante il salvataggio');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sincronizzazione in corso...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900/40 border border-slate-800 p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="relative flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Zap size={10} className="text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live Monetization Enabled</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={saving}
                            className="shrink-0 whitespace-nowrap relative group overflow-hidden bg-white text-slate-950 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] disabled:opacity-50"
                        >
                            <span className="relative z-10">{saving ? 'Sync...' : 'Pubblica Piani'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                        </motion.button>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                            Piani di <span className="text-emerald-400">Abbonamento</span>
                        </h2>
                        <p className="text-slate-400 text-[11px] leading-relaxed max-w-[280px]">
                            Definisci l'offerta commerciale del tuo club. I prezzi verranno gestiti automaticamente in base alla piattaforma.
                        </p>
                    </div>
                </div>
            </div>

            {/* Plans List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Piani Attivi</h3>
                    <div className="h-px bg-slate-800 flex-1 mx-4 opacity-50" />
                </div>

                <AnimatePresence>
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 hover:bg-slate-900/60 transition-all border-b-emerald-500/30"
                        >
                            <button
                                onClick={() => removeTier(idx)}
                                className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-800/50 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="space-y-8">
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-8">
                                        <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2 block">Identificativo Piano</label>
                                        <input
                                            value={tier.name}
                                            placeholder="E.g. Squadra Oro"
                                            onChange={(e) => updateTier(idx, { name: e.target.value })}
                                            className="w-full bg-transparent border-none p-0 text-2xl font-black text-white placeholder-slate-800 focus:ring-0 outline-none"
                                        />
                                    </div>
                                    <div className="col-span-4 text-right">
                                        <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2 block">Prezzo Finale</label>
                                        <div className="flex items-baseline justify-end gap-1">
                                            <span className="text-xl font-black text-emerald-400">€</span>
                                            <input
                                                type="number"
                                                value={tier.price}
                                                onChange={(e) => updateTier(idx, { price: parseFloat(e.target.value) })}
                                                className="bg-transparent border-none p-0 text-3xl font-black text-white w-20 text-right focus:ring-0 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                                        <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-3 block">Riquorrenza Pagamento</label>
                                        <div className="flex gap-2">
                                            {['monthly', 'yearly', 'one_time'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateTier(idx, { interval: opt as any })}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tier.interval === opt
                                                        ? 'bg-white text-slate-950 shadow-lg'
                                                        : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'
                                                        }`}
                                                >
                                                    {opt === 'monthly' ? 'Mese' : opt === 'yearly' ? 'Anno' : 'Unica'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
                                        <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-3 block">ID Store (RevenueCat)</label>
                                        <div className="flex items-center gap-2 bg-slate-950/50 rounded-lg px-3 py-1.5 border border-white/[0.05]">
                                            <Smartphone size={12} className="text-slate-500" />
                                            <input
                                                placeholder="prod_xxxx"
                                                value={tier.revenuecat_id || ''}
                                                onChange={(e) => updateTier(idx, { revenuecat_id: e.target.value })}
                                                className="w-full bg-transparent text-[11px] text-emerald-400 font-mono border-none p-0 focus:ring-0 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[9px] text-slate-500 uppercase font-black tracking-widest block">Benefit & Esclusive</label>
                                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">In-App Purchase Content</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {tier.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="group/feat flex items-center gap-3 bg-white/[0.02] border border-white/[0.03] rounded-xl px-3 py-2.5 hover:border-white/10 transition-all">
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                                <input
                                                    value={feature}
                                                    placeholder="Aggiungi una funzionalità..."
                                                    onChange={(e) => {
                                                        const newFeatures = [...tier.features];
                                                        newFeatures[fIdx] = e.target.value;
                                                        updateTier(idx, { features: newFeatures });
                                                    }}
                                                    className="bg-transparent text-slate-300 text-xs font-bold outline-none flex-1 border-none p-0 focus:ring-0"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newFeatures = tier.features.filter((_, i) => i !== fIdx);
                                                        updateTier(idx, { features: newFeatures });
                                                    }}
                                                    className="opacity-0 group-hover/feat:opacity-100 p-1 text-slate-600 hover:text-rose-500"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => updateTier(idx, { features: [...tier.features, ''] })}
                                            className="flex items-center justify-center gap-2 p-3 mt-2 rounded-xl border-2 border-dashed border-slate-800 text-slate-500 hover:border-indigo-500/30 hover:text-indigo-400 transition-all group"
                                        >
                                            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Aggiungi Benefit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    onClick={addTier}
                    className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-3xl group hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all gap-4"
                >
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all text-slate-500">
                        <Plus className="w-7 h-7" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-black text-xs uppercase tracking-widest">Nuovo Piano di Abbonamento</p>
                        <p className="text-slate-500 text-[10px] mt-1 font-bold">Crea una nuova offerta commerciale</p>
                    </div>
                </button>
            </div>

            {/* Provider Settings */}
            <div className="space-y-8 pt-12 border-t border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Integrazione Provider</h3>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Connection & Keys</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-slate-900/40 border border-white/[0.05] rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">RevenueCat API Key</label>
                            <span className="text-[9px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">Mobile Pay</span>
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="goog_... o appl_..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-400 text-xs font-mono outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                            />
                            <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400" />
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-white/[0.05] rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Stripe Public Key (Web)</label>
                            <span className="text-[9px] font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10">Web Billing</span>
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="pk_live_..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-blue-400 text-xs font-mono outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                            />
                            <CreditCard size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400" />
                        </div>
                    </div>
                </div>

                {/* Enhanced Security Box */}
                <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative bg-slate-950/80 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl p-6 flex gap-6 items-start shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
                            <ShieldCheck size={120} />
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                            <ShieldCheck size={28} className="animate-pulse" />
                        </div>

                        <div className="space-y-2 relative z-10">
                            <h4 className="text-lg font-black text-white tracking-tight">Sicurezza & Crittografia</h4>
                            <div className="space-y-3">
                                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                    Tutti i dati sensibili, comprese le API Key, vengono crittografati con standard AES-256 prima della persistenza nel Cloud 4Gears.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                        Sync automatico finale
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                        PCI Compliance Ready
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
