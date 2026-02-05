import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard, ShieldCheck, Sparkles, Settings2 } from 'lucide-react';

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
            name: 'Nuovo Piano',
            description: 'Accesso a funzionalità esclusive...',
            price: 9.99,
            interval: 'monthly',
            features: ['Sblocca contenuti premium', 'Supporto prioritario']
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

    if (loading) return <div className="p-8 text-center text-slate-500">Caricamento configurazione...</div>;

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-emerald-400" />
                        Monetizzazione App
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Configura i piani di abbonamento per i membri del tuo club.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                >
                    {saving ? 'Salvataggio...' : 'Pubblica Piani'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {tiers.map((tier, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative group hover:border-emerald-500/30 transition-all">
                        <button
                            onClick={() => removeTier(idx)}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Nome del Piano</label>
                                    <input
                                        value={tier.name}
                                        onChange={(e) => updateTier(idx, { name: e.target.value })}
                                        className="w-full bg-transparent border-b border-slate-700 py-1 text-white text-lg font-bold outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Prezzo (€)</label>
                                    <input
                                        type="number"
                                        value={tier.price}
                                        onChange={(e) => updateTier(idx, { price: parseFloat(e.target.value) })}
                                        className="w-full bg-transparent border-b border-slate-700 py-1 text-white font-mono outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Intervallo</label>
                                    <select
                                        value={tier.interval}
                                        onChange={(e) => updateTier(idx, { interval: e.target.value as any })}
                                        className="w-full bg-transparent border-b border-slate-700 py-1 text-slate-300 outline-none focus:border-emerald-500 appearance-none shadow-none"
                                        style={{ backgroundColor: 'transparent' }}
                                    >
                                        <option value="monthly" className="bg-slate-900">Mensile</option>
                                        <option value="yearly" className="bg-slate-900">Annuale</option>
                                        <option value="one_time" className="bg-slate-900">Una Tantum</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-2">Benefit Inclusi</label>
                                <div className="space-y-2">
                                    {tier.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                                            <input
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...tier.features];
                                                    newFeatures[fIdx] = e.target.value;
                                                    updateTier(idx, { features: newFeatures });
                                                }}
                                                className="bg-transparent text-slate-300 text-sm outline-none flex-1 border-none focus:ring-0"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => updateTier(idx, { features: [...tier.features, ''] })}
                                        className="text-xs text-emerald-400/70 hover:text-emerald-400 font-medium py-1"
                                    >
                                        + Aggiungi benefit
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1 mb-2">
                                    <Settings2 className="w-3 h-3" /> Configurazione Tecnica
                                </label>
                                <input
                                    placeholder="RevenueCat Product ID"
                                    value={tier.revenuecat_id || ''}
                                    onChange={(e) => updateTier(idx, { revenuecat_id: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-xs text-slate-400 outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addTier}
                    className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/30 group transition-all min-h-[150px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all text-slate-500">
                        <Plus className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 group-hover:text-emerald-400 font-medium">Aggiungi nuovo piano</p>
                </button>
            </div>

            {/* Global Settings Section */}
            <div className="pt-8 border-t border-slate-800 space-y-6">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Integrazione Provider</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">RevenueCat API Key</label>
                        <input
                            type="password"
                            placeholder="goog_... o appl_..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Stripe Public Key (Web)</label>
                        <input
                            type="password"
                            placeholder="pk_live_..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6 flex gap-4 items-start">
                    <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-white font-semibold">Configurazione Sicura</h4>
                        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                            I tuoi piani verranno sincronizzati automaticamente con l'app finale.
                            Le chiavi API sono necessarie per abilitare i pagamenti reali.
                            I dati sensibili vengono crittografati prima del salvataggio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
