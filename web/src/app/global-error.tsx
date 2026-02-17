'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to console (and potentially to a service like Sentry/PostHog later)
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className={outfit.className}>
                <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-md w-full">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 mx-auto shadow-2xl rotate-3">
                            <AlertCircle className="text-rose-500" size={40} />
                        </div>

                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                            Qualcosa è andato storto
                        </h1>
                        <p className="text-slate-400 font-medium leading-relaxed mb-10">
                            Si è verificato un errore inaspettato. Il nostro team è stato notificato.<br />
                            Prova a ricaricare la pagina.
                        </p>

                        <button
                            onClick={() => reset()}
                            className="w-full py-4 bg-white hover:bg-slate-200 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-white/10 uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
                        >
                            <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                            Riprova
                        </button>

                        <div className="mt-12 pt-8 border-t border-slate-800/50">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                                Error Code: {error.digest || 'UNKNOWN_ERROR'}
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
