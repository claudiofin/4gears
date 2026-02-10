'use client';

import React from 'react';
import { X, Check, XCircle, HelpCircle, User } from 'lucide-react';
import { Profile } from '@/types/database';

interface ConvocationsModalProps {
    event: any;
    attendance: any[];
    onClose: () => void;
    onUpdateStatus?: (userId: string, status: string) => void;
}

export const ConvocationsModal: React.FC<ConvocationsModalProps> = ({
    event,
    attendance,
    onClose,
    onUpdateStatus
}) => {
    const statuses = [
        { id: 'going', label: 'Presenti', icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'not_going', label: 'Assenti', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { id: 'maybe', label: 'In Dubbio', icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { id: 'pending', label: 'In Attesa', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-500/10' },
    ];

    const getStatusIcon = (status: string) => {
        const s = statuses.find(x => x.id === status);
        return s ? s.icon : HelpCircle;
    };

    const getStatusColor = (status: string) => {
        const s = statuses.find(x => x.id === status);
        return s ? s.color : 'text-slate-500';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                <div>
                    <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Convocazioni: {event.title}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Gestione Presenze Atleti</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {attendance.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Nessun atleta convocato</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {attendance.map((record) => {
                            const profile = record.profiles;
                            const Icon = getStatusIcon(record.status);

                            return (
                                <div
                                    key={record.user_id}
                                    className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden border border-slate-700">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600 font-black text-xs uppercase">
                                                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">
                                                {profile?.first_name} {profile?.last_name}
                                            </div>
                                            <div className={`flex items-center gap-1.5 text-[10px] uppercase font-black tracking-tight ${getStatusColor(record.status)}`}>
                                                <Icon size={10} />
                                                {record.status === 'going' ? 'Presente' :
                                                    record.status === 'not_going' ? 'Assente' :
                                                        record.status === 'maybe' ? 'In Dubbio' : 'In Attesa'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions (Dropdown or buttons could go here) */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onUpdateStatus?.(record.user_id, 'going')}
                                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition-all"
                                            title="Imposta come Presente"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={() => onUpdateStatus?.(record.user_id, 'not_going')}
                                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all"
                                            title="Imposta come Assente"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer Summary */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 grid grid-cols-4 gap-2">
                {statuses.map(s => (
                    <div key={s.id} className={`${s.bg} rounded-xl p-2 text-center`}>
                        <div className={`text-[10px] font-black uppercase tracking-tighter ${s.color}`}>{s.label}</div>
                        <div className="text-lg font-black text-white leading-none mt-1">
                            {attendance.filter(a => a.status === s.id).length}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

import { Clock } from 'lucide-react';
