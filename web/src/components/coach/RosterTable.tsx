'use client';

import React from 'react';
import { User, Users, Mail, Shield, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Profile } from '@/types/database';

interface RosterTableProps {
    members: Profile[];
    attendance?: any[];
    loading?: boolean;
    onEdit?: (profile: Profile) => void;
    onDelete?: (id: string) => void;
}

export const RosterTable: React.FC<RosterTableProps> = ({ members, attendance = [], loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-400">Nessun membro nel roster</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">Inizia ad aggiungere atleti o invita membri al tuo team.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-slate-900/50 border border-slate-800 rounded-2xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Membro</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ruolo</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Affidabilità</th>
                        <th className="px-6 py-4 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {members.map((member) => {
                        const memberAtt = attendance.filter(a => a.user_id === member.id);
                        const confirmed = memberAtt.filter(a => a.status === 'going').length;
                        const reliability = memberAtt.length > 0 ? Math.round((confirmed / memberAtt.length) * 100) : 100;

                        return (
                            <tr key={member.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 flex items-center justify-center border border-indigo-500/20">
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-indigo-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">
                                                {member.first_name && member.last_name ? `${member.first_name} ${member.last_name}` : 'Membro senza nome'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                                <Mail size={10} />
                                                {member.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${member.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                        member.role === 'coach' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        }`}>
                                        <Shield size={10} />
                                        {member.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 rounded-full ${reliability > 80 ? 'bg-emerald-500' :
                                                        reliability > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                                    }`}
                                                style={{ width: `${reliability}%` }}
                                            />
                                        </div>
                                        <span className={`text-[10px] font-black ${reliability > 80 ? 'text-emerald-500' :
                                                reliability > 50 ? 'text-amber-500' : 'text-rose-500'
                                            }`}>
                                            {reliability}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit?.(member)}
                                            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(member.id)}
                                            className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
