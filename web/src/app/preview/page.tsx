'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

function PreviewLandingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCode = searchParams.get('code') || '';

    const [code, setCode] = useState(initialCode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialCode && initialCode.length === 6) {
            handleVerify(initialCode);
        }
    }, [initialCode]);

    const handleVerify = async (entryCode: string) => {
        const targetCode = entryCode.toUpperCase();
        if (targetCode.length !== 6) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('projects')
                .select('id')
                .eq('preview_code', targetCode)
                .single();

            if (fetchError || !data) {
                setError('Codice non valido o scaduto');
                return;
            }

            // Redirect to the actual preview page
            router.push(`/preview/${data.id}`);
        } catch (err) {
            setError('Si è verificato un errore durante la verifica');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        setCode(val);
        if (val.length === 6) {
            handleVerify(val);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden text-slate-100">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 rotate-3">
                        <Smartphone className="text-white" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Live Preview</h1>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Inserisci il codice di 6 cifre per visualizzare l'anteprima del tuo progetto.
                    </p>
                </div>

                <div className="relative mb-8">
                    <div className="flex gap-2 justify-between mb-4">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all duration-300 ${code[i]
                                        ? 'bg-white text-slate-950 border-white shadow-xl scale-105'
                                        : 'bg-slate-900/50 border-slate-800 text-slate-700'
                                    }`}
                            >
                                {code[i] || ''}
                            </div>
                        ))}
                    </div>

                    <input
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                        autoFocus
                        className="absolute inset-0 opacity-0 cursor-default"
                        disabled={loading}
                    />

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    disabled={code.length !== 6 || loading}
                    onClick={() => handleVerify(code)}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-3xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 overflow-hidden group"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Verifica in corso...
                        </>
                    ) : (
                        <>
                            Accedi all'Anteprima
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <p className="mt-12 text-[10px] text-center text-slate-500 uppercase tracking-[0.3em] font-bold">
                    4Gears Cloud Presence
                </p>
            </motion.div>
        </div>
    );
}

export default function PreviewLandingPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
                <Loader2 className="text-indigo-500 animate-spin" size={32} />
            </div>
        }>
            <PreviewLandingContent />
        </Suspense>
    );
}
