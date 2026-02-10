'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Calendar, Activity, ClipboardList,
    ShieldCheck, ShoppingBag, Bell, ChevronRight
} from 'lucide-react';

interface RoleBasedExperienceProps {
    role: 'coach' | 'athlete' | 'fan' | 'admin';
    clubName: string;
}

export const RoleBasedExperience: React.FC<RoleBasedExperienceProps> = ({ role, clubName }) => {
    return (
        <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
            {/* Nav Header */}
            <div className="p-6 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black tracking-tighter uppercase italic">{clubName}</h2>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{role} Portal</p>
                </div>
                <div className="relative">
                    <Bell size={20} className="text-slate-400" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                {role === 'coach' && <CoachView />}
                {role === 'athlete' && <AthleteView />}
                {role === 'fan' && <FanView />}
                {role === 'admin' && <AdminSystemView />}
            </div>

            {/* Tab Bar */}
            <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-around items-center">
                <Users size={20} className="text-indigo-400" />
                <Calendar size={20} className="text-slate-500" />
                <ShoppingBag size={20} className="text-slate-500" />
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
                    JD
                </div>
            </div>
        </div>
    );
};

const CoachView = () => {
    const [showAttendance, setShowAttendance] = useState(false);
    const [attendanceList, setAttendanceList] = useState([
        { name: 'Marco Rossi', status: 'pending' },
        { name: 'Luca Bianchi', status: 'pending' },
        { name: 'Simone Verdi', status: 'pending' },
    ]);

    const markAttendance = (index: number, status: 'present' | 'absent') => {
        const newList = [...attendanceList];
        newList[index].status = status;
        setAttendanceList(newList);
    };

    return (
        <div className="space-y-6">
            <AnimatePresence mode="wait">
                {!showAttendance ? (
                    <motion.div
                        key="coach-dashboard"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-5 rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-600/20"
                    >
                        <h3 className="text-lg font-black uppercase italic leading-none mb-1">Allenamento Oggi</h3>
                        <p className="text-xs text-indigo-100/70 font-medium tracking-wide">18:00 - Campo A</p>
                        <button
                            onClick={() => setShowAttendance(true)}
                            className="mt-4 w-full py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                            Segna Presenze
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="attendance-list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black uppercase">Appello Operativo</h3>
                            <button onClick={() => setShowAttendance(false)} className="text-[10px] text-slate-500 font-bold uppercase">Chiudi</button>
                        </div>
                        {attendanceList.map((player, i) => (
                            <div key={i} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold">{player.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => markAttendance(i, 'present')}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${player.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                    >
                                        P
                                    </button>
                                    <button
                                        onClick={() => markAttendance(i, 'absent')}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${player.status === 'absent' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                    >
                                        A
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <section className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Azioni Rapide</h4>
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex flex-col gap-2">
                        <ClipboardList size={18} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase">Formazione</span>
                    </button>
                    <button className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex flex-col gap-2">
                        <Activity size={18} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase">Test Fisici</span>
                    </button>
                </div>
            </section>
        </div>
    );
};

const AthleteView = () => {
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'expired' | 'pending' | 'valid'>('expired');

    const handleUpload = () => {
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setStatus('pending');
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className={`p-5 rounded-3xl border transition-colors duration-500 ${status === 'expired' ? 'bg-slate-900 border-amber-500/20' : status === 'pending' ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-emerald-900/20 border-emerald-500/20'}`}>
                <div className={`flex items-center gap-3 mb-3 ${status === 'expired' ? 'text-amber-500' : status === 'pending' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest tracking-widest">
                        {status === 'expired' ? 'Compliance Alert' : status === 'pending' ? 'Verifica in Corso' : 'Status: OK'}
                    </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-tight">
                    {status === 'expired' ? 'Certificato Medico in Scadenza' : status === 'pending' ? 'Certificato Caricato' : 'Documentazione Valida'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 mb-4">
                    {status === 'expired' ? 'Carica il nuovo documento per evitare sospensioni.' : status === 'pending' ? 'L\'amministratore verificherà il file nelle prossime 24 ore.' : 'Il tuo certificato è valido fino al 24/05/2026.'}
                </p>
                {status === 'expired' && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-3 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/20 disabled:opacity-50"
                    >
                        {uploading ? 'Caricamento...' : 'Carica Documento'}
                    </button>
                )}
            </div>

            <section className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prossimo Match</h4>
                <div className="p-5 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-white italic tracking-tight">VS AS ROMA CALCIO</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Stadio Olimpico • Dom 15:00</p>
                    </div>
                    <div className="px-3 py-1 rounded bg-indigo-500 text-[8px] font-black uppercase">Convocato</div>
                </div>
            </section>
        </div>
    );
};

const FanView = () => {
    const [purchased, setPurchased] = useState(false);

    const handlePurchase = () => {
        setPurchased(true);
        setTimeout(() => setPurchased(false), 3000);
    };

    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Official Store</h4>
                <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] group">
                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Club Jersey" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-6 flex flex-col justify-end">
                        <h5 className="text-lg font-black uppercase italic leading-none mb-1">Maglia Home 24/25</h5>
                        <p className="text-sm font-bold text-indigo-400">€ 75.00</p>
                        <button
                            onClick={handlePurchase}
                            className={`mt-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${purchased ? 'bg-emerald-500 text-white' : 'bg-white text-slate-950'}`}
                        >
                            {purchased ? 'Ordine Inviato!' : 'Acquista Ora'}
                        </button>
                    </div>
                </div>
            </section>

            <section className="space-y-2">
                <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-tight italic">Abbonamento Match Pass</span>
                    <ChevronRight size={14} className="text-slate-600" />
                </div>
            </section>
        </div>
    );
};

const AdminSystemView = () => (
    <div className="space-y-6">
        <section className="space-y-3">
            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Live
            </h4>
            <div className="grid grid-cols-1 gap-3">
                {[
                    { label: 'Cloud Builds', value: 'Ready', color: 'text-indigo-400' },
                    { label: 'Stripe API', value: 'Connected', color: 'text-emerald-400' },
                    { label: 'Medical Audit', value: '3 Pending', color: 'text-amber-400' }
                ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.value}</span>
                    </div>
                ))}
            </div>
        </section>
    </div>
);
