import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function NotFound() {
    return (
        <div className={`fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden ${outfit.className}`}>
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">

                {/* 404 Graphic */}
                <div className="relative mb-12 group">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-700" />
                    <h1 className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-tr from-white to-slate-600 leading-[0.8] select-none tracking-tighter mix-blend-overlay">
                        404
                    </h1>
                </div>

                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                    Pagina non trovata
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                    La pagina che stai cercando potrebbe essere stata rimossa, rinominata o è temporaneamente non disponibile.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Torna alla Home
                    </Link>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800/50 w-full max-w-xs">
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
                        4Gears Console
                    </p>
                </div>
            </div>
        </div>
    );
}
