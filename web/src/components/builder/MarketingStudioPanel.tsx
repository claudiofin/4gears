'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Type, Palette, Camera, Download, LayoutTemplate, Zap } from 'lucide-react';

interface MarketingStudioPanelProps {
    isOpen: boolean;
    onClose: () => void;
    quote: string;
    bg: string;
    template: '3d' | 'front';
    currentTeam: any;
    onUpdate: (updates: any) => void;
}

export const MarketingStudioPanel: React.FC<MarketingStudioPanelProps> = ({
    isOpen,
    onClose,
    quote,
    bg,
    template,
    currentTeam,
    onUpdate
}) => {
    const gradients = [
        { name: 'Indigo Deep', value: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)' },
        { name: 'Sunset Fusion', value: 'linear-gradient(135deg, #f59e0b 0%, #be123c 100%)' },
        { name: 'Emerald Night', value: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)' },
        { name: 'Midnight Blue', value: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)' },
        { name: 'Dark Slate', value: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)' },
    ];

    return (
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 w-[320px] bg-slate-950/95 border border-slate-800 shadow-2xl z-[150] flex flex-col rounded-[32px] overflow-hidden backdrop-blur-xl transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-8 pointer-events-none'}`}>
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Camera size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Marketing Hub</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Asset Generator</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                    <X size={16} className="text-slate-400" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[600px] hide-scrollbar">
                {/* Quote Editor */}
                <div className="space-y-3">
                    <label htmlFor="marketing-quote" className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer">
                        <Type size={12} /> Testo Promozionale
                    </label>
                    <textarea
                        id="marketing-quote"
                        value={quote}
                        onChange={(e) => onUpdate({ quote: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
                        placeholder="Inserisci uno slogan d'impatto..."
                    />
                </div>

                {/* Background Selector */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Palette size={12} /> Background Stage
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {gradients.map((g) => (
                            <button
                                key={g.name}
                                onClick={() => onUpdate({ bg: g.value })}
                                title={g.name}
                                className={`w-10 h-10 rounded-xl border-2 transition-all ${bg === g.value ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                style={{ background: g.value }}
                            />
                        ))}
                    </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <LayoutTemplate size={12} /> Template Layout
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onUpdate({ template: '3d' })}
                            className={`p-4 rounded-2xl flex flex-col items-center gap-2 group transition-all ${template === '3d' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-white/10 hover:border-white/20'}`}
                        >
                            <div className="w-8 h-12 bg-slate-800 rounded-md border border-white/5 rotate-[-5deg] group-hover:rotate-0 transition-transform" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">3D Perspective</span>
                        </button>
                        <button
                            onClick={() => onUpdate({ template: 'front' })}
                            className={`p-4 rounded-2xl flex flex-col items-center gap-2 group transition-all ${template === 'front' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-900 border-white/10 hover:border-white/20'}`}
                        >
                            <div className="w-8 h-12 bg-slate-800 rounded-md border border-white/5" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Front View</span>
                        </button>
                    </div>
                </div>

                {/* Brand Identity Preview */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Palette size={12} /> App Identity (AI Gen)
                    </div>

                    <div className="flex gap-4">
                        {/* App Icon Preview */}
                        <div className="flex-1 space-y-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">App Icon</span>
                            <div
                                className="aspect-square rounded-2xl border border-white/10 flex flex-col items-center justify-center p-2 text-center"
                                style={{ background: `linear-gradient(45deg, ${currentTeam.colors.primary}, ${currentTeam.colors.secondary})` }}
                            >
                                <div className="w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center font-black text-white text-xl shadow-lg">
                                    {currentTeam.name.charAt(0)}
                                </div>
                                <span className="text-[8px] text-white/50 mt-2 font-mono uppercase">1024x1024</span>
                            </div>
                        </div>

                        {/* Splash Preview */}
                        <div className="flex-1 space-y-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Splash Screen</span>
                            <div
                                className="aspect-[9/16] rounded-xl border border-white/10 flex flex-col items-center justify-center p-2 relative overflow-hidden"
                                style={{ backgroundColor: currentTeam.colors.primary }}
                            >
                                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, white, transparent)` }} />
                                <div className="w-8 h-8 rounded-lg bg-white shadow-xl flex items-center justify-center font-bold text-xs" style={{ color: currentTeam.colors.primary }}>
                                    {currentTeam.name.charAt(0)}
                                </div>
                                <div className="mt-4 w-6 h-0.5 bg-white/30 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        <Zap size={12} /> Rigenera con AI
                    </button>
                </div>

                {/* Store Presence (AI Metadata) */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Type size={12} /> Store Presence (AI)
                        </div>
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                            {['IT', 'EN'].map((lang) => (
                                <button
                                    key={lang}
                                    className={`px-2 py-1 rounded text-[8px] font-black transition-all ${lang === 'IT' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-bold uppercase">Store Title</label>
                            <input
                                type="text"
                                value={`${currentTeam.name} - Official App`}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                readOnly
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-500 font-bold uppercase">Description</label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 min-h-[80px] resize-none"
                                defaultValue={`L'app ufficiale del ${currentTeam.name}. Risultati, news e shop integrato.`}
                            />
                        </div>
                    </div>
                </div>

                {/* Export Checklist */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Download size={12} /> Export Manifest
                    </div>
                    <ul className="space-y-2">
                        {[
                            'App Icon (1024x1024)',
                            'Splash Screen (1242x2436)',
                            'iPhone 6.5" Screenshots (x5)',
                            'Android Feature Graphic',
                            'Store Metadata (.json)'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                    <Download size={16} /> Scarica Batch Asset
                </button>
                <p className="mt-3 text-[9px] text-slate-500 text-center font-bold uppercase tracking-widest italic">
                    Generazione mockup ad alta risoluzione
                </p>
            </div>
        </div>
    );
};
