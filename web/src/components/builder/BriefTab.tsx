import React from 'react';
import { StickyNote, Info, HelpCircle } from 'lucide-react';

interface BriefTabProps {
    notes: string;
    onUpdate: (notes: string) => void;
}

export const BriefTab: React.FC<BriefTabProps> = ({ notes, onUpdate }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <StickyNote size={12} />
                        Project Briefing
                    </h3>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-3 items-start mb-6">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-400 leading-relaxed">
                        Utilizza questo spazio per descrivere la tua visione. Queste note verranno inviate ai nostri sviluppatori insieme alla configurazione visuale.
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Note di Sviluppo & Design</label>
                    <textarea
                        value={notes}
                        onChange={(e) => onUpdate(e.target.value)}
                        placeholder="Esempio: Vorrei che l'app avesse un feeling molto moderno, con un focus particolare sulla sezione News. I colori devono essere esattamente quelli sociali..."
                        className="w-full h-80 bg-slate-800 text-sm text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none placeholder-slate-600 transition-all resize-none leading-relaxed"
                    />
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle size={12} />
                    Consigli per un buon brief
                </h3>
                <ul className="space-y-3">
                    {[
                        'Specifica preferenze di navigazione',
                        'Descrivi il target principale (giovani, fan storici)',
                        'Menziona eventuali integrazioni esterne desiderate',
                        'Indica se hai già materiali grafici pronti'
                    ].map((tip, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};
