import React, { useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Star, LayoutGrid, List, Layers, MoveHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeConfig, Sponsor, SponsorConfig } from '@/types/builder';
import { ImageUploadControl } from '@/components/inspector/controls/ImageUploadControl';

interface SponsorConfigPanelProps {
    config: ThemeConfig;
    onUpdate: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
}

export const SponsorConfigPanel: React.FC<SponsorConfigPanelProps> = ({ config, onUpdate }) => {
    const sponsors = config.sponsors || {
        enabled: true,
        layout: 'grid',
        items: [],
        scrollingText: ''
    };

    const updateSponsorConfig = (updates: Partial<SponsorConfig>) => {
        onUpdate((prev) => ({
            ...prev,
            sponsors: {
                ...sponsors,
                ...updates
            }
        }));
    };

    const addSponsor = () => {
        const newSponsor: Sponsor = {
            id: crypto.randomUUID(),
            name: 'Nuovo Sponsor',
            tier: 'silver',
            enabled: true
        };
        updateSponsorConfig({ items: [...sponsors.items, newSponsor] });
    };

    const updateSponsor = (id: string, updates: Partial<Sponsor>) => {
        const newItems = sponsors.items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        updateSponsorConfig({ items: newItems });
    };

    const removeSponsor = (id: string) => {
        updateSponsorConfig({ items: sponsors.items.filter(item => item.id !== id) });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sponsor Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-900/20 border border-slate-800 p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />

                <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                            <Star size={10} className="text-amber-400" />
                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Sponsorship Manager</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateSponsorConfig({ enabled: !sponsors.enabled })}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sponsors.enabled
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {sponsors.enabled ? 'Attivo' : 'Disabilitato'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-white tracking-tight leading-none uppercase">Partner Commerciali</h2>
                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed max-w-[240px]">
                            Gestisci la visibilità dei tuoi sponsor all'interno dell'app.
                        </p>
                    </div>
                </div>
            </div>

            {/* Layout Configuration */}
            <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Layers size={12} className="text-indigo-400" />
                    Layout di Visualizzazione
                </h3>

                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'grid', label: 'Griglia', icon: LayoutGrid },
                        { id: 'list', label: 'Elenco', icon: List },
                        { id: 'carousel', label: 'Slide', icon: MoveHorizontal }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => updateSponsorConfig({ layout: mode.id as any })}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${sponsors.layout === mode.id
                                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 scale-[1.02] shadow-lg shadow-indigo-500/5'
                                : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                }`}
                        >
                            <mode.icon size={20} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{mode.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Scrolling Banner */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <MoveHorizontal size={12} className="text-indigo-400" />
                        Ticker Testuale
                    </h3>
                    <div className="text-[8px] font-bold text-slate-600 uppercase">Banner Scorrevole</div>
                </div>

                <div className="relative group">
                    <input
                        type="text"
                        value={sponsors.scrollingText || ''}
                        onChange={(e) => updateSponsorConfig({ scrollingText: e.target.value })}
                        placeholder="E.g. Grazie ai nostri partner per il supporto..."
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all group-hover:border-slate-700"
                    />
                </div>
            </section>

            {/* List of Sponsors */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Star size={12} className="text-amber-400" />
                        Partner Correnti
                    </h3>
                    <button
                        onClick={addSponsor}
                        className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1.5 transition-all"
                    >
                        <Plus size={12} /> Aggiungi Partner
                    </button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {sponsors.items.map((sponsor) => (
                            <motion.div
                                key={sponsor.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-slate-900/40 border border-white/[0.03] rounded-3xl p-5 hover:bg-slate-900/60 transition-all hover:border-white/[0.08]"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-1">
                                            <input
                                                value={sponsor.name}
                                                onChange={(e) => updateSponsor(sponsor.id, { name: e.target.value })}
                                                className="bg-transparent border-none p-0 text-sm font-black text-white placeholder-slate-800 focus:ring-0 outline-none w-full"
                                                placeholder="Nome Sponsor"
                                            />
                                            <div className="flex gap-2 pt-1">
                                                {(['gold', 'silver', 'bronze'] as const).map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => updateSponsor(sponsor.id, { tier: t })}
                                                        className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter transition-all ${sponsor.tier === t
                                                            ? t === 'gold' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                                : t === 'silver' ? 'bg-slate-400/20 text-slate-300 border border-slate-500/30'
                                                                    : 'bg-orange-700/20 text-orange-400 border border-orange-700/30'
                                                            : 'bg-slate-800 text-slate-600 hover:bg-slate-700'
                                                            }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeSponsor(sponsor.id)}
                                            className="p-2 rounded-xl bg-slate-800/50 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest pl-1">Logo Partner</label>
                                            <ImageUploadControl
                                                label="Upload Logo"
                                                value={sponsor.logoUrl || ''}
                                                onChange={(url: string | undefined) => updateSponsor(sponsor.id, { logoUrl: url })}
                                                aspectRatio="square"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest pl-1">Link Destinazione</label>
                                                <div className="flex items-center gap-2 bg-slate-950/50 rounded-xl px-3 py-2 border border-white/[0.05] focus-within:border-indigo-500/50 transition-all">
                                                    <LinkIcon size={12} className="text-slate-600" />
                                                    <input
                                                        value={sponsor.link || ''}
                                                        onChange={(e) => updateSponsor(sponsor.id, { link: e.target.value })}
                                                        placeholder="https://..."
                                                        className="w-full bg-transparent text-[10px] text-indigo-400 font-medium border-none p-0 focus:ring-0 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sponsor.enabled}
                                                        onChange={(e) => updateSponsor(sponsor.id, { enabled: e.target.checked })}
                                                        className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500/20"
                                                    />
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Attivo in App</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {sponsors.items.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800/50 rounded-3xl text-slate-600 space-y-2">
                            <ImageIcon size={32} strokeWidth={1} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Nessun partner configurato</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Commercial Preview Info */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <LayoutGrid size={20} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight">Posizionamento Premium</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed font-medium">
                        Gli sponsor di livello <span className="text-amber-400 font-black">GOLD</span> appariranno in primo piano nella home screen e durante le dirette dei match.
                    </p>
                </div>
            </div>
        </div>
    );
};
