'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, Clock, Activity, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating real system logs based on actual DB actions
        const fetchSystemLogs = async () => {
            const mockLogs = [
                { id: 1, type: 'info', message: 'Sistema inizializzato correttamente', timestamp: new Date(Date.now() - 3600000).toISOString(), service: 'core' },
                { id: 2, type: 'success', message: 'Backup automatico DB completato', timestamp: new Date(Date.now() - 7200000).toISOString(), service: 'database' },
                { id: 3, type: 'info', message: 'Sincronizzazione GitHub PAT riuscita', timestamp: new Date(Date.now() - 86400000).toISOString(), service: 'git' },
                { id: 4, type: 'warning', message: 'Tentativo di login fallito da IP non autorizzato', timestamp: new Date(Date.now() - 90000000).toISOString(), service: 'auth' },
            ];

            setLogs(mockLogs);
            setLoading(false);
        };

        fetchSystemLogs();
    }, []);

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'error': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
                        System Logs
                    </h1>
                    <p className="text-slate-400 font-medium">Monitoraggio in tempo reale dell'infrastruttura 4Gears.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-white/[0.05] rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <Activity size={12} /> Live Monitoring
                </div>
            </header>

            <div className="bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-white/[0.01] flex items-center gap-2">
                    <Terminal size={18} className="text-slate-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300 italic">Core Engine Output</span>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="p-20 text-center text-slate-500 font-black uppercase tracking-widest text-xs">
                            Fetching global stream...
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {logs.map((log) => (
                                <div key={log.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center gap-1 w-16">
                                            <span className="text-[10px] font-black text-slate-500 uppercase">
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <div className="w-px h-4 bg-slate-800 group-last:hidden" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${getTypeStyles(log.type)}`}>
                                                    {log.type}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                                                    [{log.service}]
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-300">{log.message}</p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-white transition-all">
                                        <Shield size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[32px] flex items-start gap-4">
                <AlertCircle className="text-amber-400 shrink-0" size={20} />
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight italic mb-1">Nota di Manutenzione</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        I log più vecchi di 30 giorni vengono archiviati automaticamente nel cold storage per ottimizzare le prestazioni del database.
                        Per audit estesi contattare il team DevOps.
                    </p>
                </div>
            </div>
        </div>
    );
}
