'use client';

import React, { useState } from 'react';
import {
    ChevronLeft, Download, Layout, Type, Palette,
    Smartphone, Monitor, Layers, Save, Share2,
    CheckCircle2, Plus, Trash2, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function ScreenshotStudio() {
    const [activeTab, setActiveTab] = useState('design');
    const [selectedDevice, setSelectedDevice] = useState('iphone15');
    const [isSaving, setIsSaving] = useState(false);

    // In a real app, this would come from the project assets
    const [screenshots, setScreenshots] = useState([
        { id: 1, title: 'Dashboard', url: '/app_screenshot_mockup_1770715214080.png' },
        { id: 2, title: 'Squadra', url: '/app_screenshot_mockup_1770715214080.png' },
        { id: 3, title: 'Match Day', url: '/app_screenshot_mockup_1770715214080.png' },
    ]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 2000);
    };

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
            {/* Top Bar */}
            <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-xl z-50">
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin/releases"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black uppercase italic tracking-tighter leading-none">Studio Screenshots</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Editor Asset App Store & Play Store</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                        <Share2 size={14} /> Export All
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {isSaving ? <CheckCircle2 size={14} className="animate-bounce" /> : <Save size={14} />}
                        {isSaving ? 'Saving...' : 'Salva Modifiche'}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Navigation/Tools */}
                <aside className="w-20 border-r border-white/[0.05] flex flex-col items-center py-8 gap-8 bg-slate-900/30">
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`p-3.5 rounded-2xl transition-all ${activeTab === 'design' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Layout size={22} />
                    </button>
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`p-3.5 rounded-2xl transition-all ${activeTab === 'text' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Type size={22} />
                    </button>
                    <button
                        onClick={() => setActiveTab('style')}
                        className={`p-3.5 rounded-2xl transition-all ${activeTab === 'style' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Palette size={22} />
                    </button>
                    <div className="mt-auto flex flex-col gap-6 items-center">
                        <button className="p-3 text-slate-600 hover:text-indigo-400 transition-colors">
                            <Plus size={24} />
                        </button>
                    </div>
                </aside>

                {/* Main Canvas Area */}
                <main className="flex-1 bg-slate-950 p-12 overflow-y-auto custom-scrollbar flex flex-col items-center">
                    <div className="max-w-4xl w-full">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex bg-slate-900 rounded-2xl p-1 border border-white/[0.05]">
                                <button
                                    onClick={() => setSelectedDevice('iphone15')}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedDevice === 'iphone15' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    iPhone 15 Pro
                                </button>
                                <button
                                    onClick={() => setSelectedDevice('pixel8')}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedDevice === 'pixel8' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Pixel 8 Pro
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all">
                                    <Smartphone size={18} />
                                </button>
                                <button className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all">
                                    <Monitor size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Screenshot Grid Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {screenshots.map((s, idx) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="aspect-[9/19.5] rounded-[40px] border-[8px] border-slate-900 bg-black overflow-hidden shadow-2xl relative group-hover:scale-105 transition-all duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <img
                                            src={s.url}
                                            alt={s.title}
                                            className="w-full h-full object-cover group-hover:blur-sm transition-all"
                                        />

                                        <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Slide #{s.id}</p>
                                            <h4 className="text-sm font-black text-white uppercase italic">{s.title}</h4>
                                            <div className="flex gap-2 mt-4">
                                                <button className="flex-1 py-2 bg-white text-black text-[9px] font-black uppercase rounded-lg">Edit</button>
                                                <button className="p-2 bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Screenshot {s.id}</p>
                                    </div>
                                </motion.div>
                            ))}

                            <button className="aspect-[9/19.5] rounded-[40px] border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-4 text-slate-600 hover:text-indigo-400 hover:border-indigo-500/30 transition-all bg-white/[0.01]">
                                <Plus size={32} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Add Screenshot</span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Panel - Settings */}
                <aside className="w-80 border-l border-white/[0.05] bg-slate-900/40 backdrop-blur-3xl overflow-y-auto">
                    <div className="p-8 space-y-10">
                        {/* Tab Content: Design */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">Settings Generale</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Background Palette</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['#6366f1', '#10b981', '#f59e0b', '#0f172a'].map(c => (
                                            <button key={c} className="w-10 h-10 rounded-xl border border-white/10" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Frame Style</label>
                                    <select className="w-full bg-slate-950 border border-white/[0.05] rounded-xl px-4 py-3 text-xs font-bold text-slate-300 outline-none focus:border-indigo-500/50">
                                        <option>iPhone 15 Pro Max</option>
                                        <option>iPhone 14 (Clay)</option>
                                        <option>No Frame (Standard)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-white/[0.03]">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">Marketing Text</h3>
                            <div className="space-y-4">
                                <textarea
                                    className="w-full bg-slate-950 border border-white/[0.05] rounded-xl px-4 py-3 text-xs font-medium text-slate-300 outline-none focus:border-indigo-500/50 min-h-[100px]"
                                    placeholder="Inserisci il testo di marketing..."
                                    defaultValue="Gestisci la tua squadra come mai prima d'ora. Tutto in un'unica piattaforma."
                                />
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest">Apply Font</button>
                                    <button className="p-3 bg-slate-800 rounded-xl"><Palette size={16} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Magic Actions */}
                        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <Wand2 size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">AI Magic Studio</span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                                Genera automaticamente banner e post social basati sui colori e lo stile dei tuoi screenshot.
                            </p>
                            <button className="w-full py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all">
                                Genera Asset Social
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
