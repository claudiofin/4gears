import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Download, CheckCircle2, Copy, Github,
    ArrowRight, CreditCard, Box, Zap,
    Smartphone, FileCode, CheckCheck, Loader2
} from 'lucide-react';
import { TeamConfig } from '@/constants/teams';

interface HandoverModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectConfig: any;
    currentTeam: TeamConfig;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
    isOpen,
    onClose,
    projectConfig,
    currentTeam
}) => {
    const [step, setStep] = useState<'ANALYSIS' | 'QUOTE' | 'PROCESSING' | 'SUCCESS'>('ANALYSIS');

    // Calcolo preventivo dinamico basato sui moduli attivi
    const activeFeatures = Object.values(projectConfig.features || {}).filter((f: any) => f.enabled);
    const basePrice = 499; // Prezzo base per app standard
    const featurePrice = activeFeatures.length * 50;
    const totalPrice = basePrice + featurePrice;

    const handleStartProcessing = () => {
        setStep('PROCESSING');
        setTimeout(() => setStep('SUCCESS'), 3000); // Mock generation time
    };

    const modules = [
        { name: 'Core Expo Architecture', status: 'Ready' },
        { name: 'Dual-State Data Provider', status: 'Ready' },
        { name: 'Multi-Language Support (i18n)', status: 'Ready' },
        { name: 'Prisma Schema & Migrations', status: 'Ready' },
        { name: 'Maestro E2E Tests', status: 'Ready' },
        { name: 'Agent AI Skills (.agent)', status: 'Ready' },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                <Box className="text-indigo-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white leading-tight">Handover Mobile Package</h2>
                                <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Digital Twin Service</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        {step === 'ANALYSIS' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap size={16} className="text-indigo-400" />
                                        <span className="text-xs font-black text-indigo-400 uppercase">Analisi Configurazione</span>
                                    </div>
                                    <p className="text-sm text-slate-300">Ho analizzato il progetto <span className="text-white font-bold">{currentTeam.name}</span>. Sono pronti i seguenti moduli per l'attivazione:</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {modules.map((m, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span className="text-sm font-medium text-slate-300">{m.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase">{m.status}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setStep('QUOTE')}
                                    className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border-b-4 border-slate-300"
                                >
                                    GENERA PREVENTIVO <ArrowRight size={18} />
                                </button>
                            </div>
                        )}

                        {step === 'QUOTE' && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <p className="text-sm text-slate-500 uppercase font-black tracking-widest mb-2">Totale Investimento</p>
                                    <div className="text-5xl font-black text-white flex items-center justify-center gap-2">
                                        €{totalPrice} <span className="text-lg text-slate-500 line-through">€{totalPrice + 200}</span>
                                    </div>
                                    <p className="text-xs text-indigo-400 mt-2 font-bold">Incluso 1 anno di manutenzione AI (Agent Skills)</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="text-slate-400" size={18} />
                                            <span className="text-sm font-medium text-slate-300">Bundle iOS/Android (Expo)</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">€{basePrice}</span>
                                    </div>
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Zap className="text-slate-400" size={18} />
                                            <span className="text-sm font-medium text-slate-300">Moduli Attivati ({activeFeatures.length})</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">€{featurePrice}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('ANALYSIS')}
                                        className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all"
                                    >
                                        INDIETRO
                                    </button>
                                    <button
                                        onClick={handleStartProcessing}
                                        className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        ACCETTA E GENERA REPO <CreditCard size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'PROCESSING' && (
                            <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                                <div className="relative">
                                    <Loader2 className="text-indigo-500 animate-spin" size={64} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileCode className="text-indigo-400" size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Generazione in corso...</h3>
                                    <p className="text-sm text-slate-400 max-w-xs mx-auto">Sto assemblando il core Expo, generando i test Maestro e configurando le Agent Skills.</p>
                                </div>
                                <div className="w-full max-w-xs bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 3 }}
                                        className="h-full bg-indigo-500"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="py-6 space-y-6 text-center">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/30">
                                    <CheckCheck className="text-emerald-500" size={40} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2">Workspace Pronto!</h3>
                                    <p className="text-sm text-slate-400">La repository Git è stata creata. Il tuo "Digital Twin" mobile è ora attivo.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-left">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <Github size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                            <code className="text-[10px] text-slate-300 font-mono">github.com/4gears/{currentTeam.slug}-mobile</code>
                                        </div>
                                        <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                    <div className="h-px bg-slate-800 my-1" />
                                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase">
                                        <CheckCheck size={12} className="text-emerald-500" />
                                        Localizzazione: IT, EN generata con successo
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all"
                                    >
                                        CHIUDI
                                    </button>
                                    <button
                                        className="flex-[2] py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all border-b-4 border-slate-300"
                                    >
                                        APRI REPOSITORY <Github size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
