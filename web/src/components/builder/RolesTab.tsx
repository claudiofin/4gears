import React from 'react';
import { Shield, Lock, Check, Plus, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleConfig {
    id: string;
    name: string;
    description: string;
    color: string;
    permissions: { id: string; label: string; enabled: boolean }[];
}

interface RolesTabProps {
    // Current app configuration for roles
    onUpdate: (updates: any) => void;
}

const DEFAULT_ROLES: RoleConfig[] = [
    {
        id: 'ADMIN',
        name: 'Admin Club',
        description: 'Controllo totale su brand, fatturazione e permessi.',
        color: 'text-amber-400 bg-amber-500/10',
        permissions: [
            { id: 'view_stats', label: 'Statistiche Globali', enabled: true },
            { id: 'manage_team', label: 'Gestione Team', enabled: true },
            { id: 'manage_billing', label: 'Fatturazione', enabled: true },
        ]
    },
    {
        id: 'PLAYER',
        name: 'Atleta',
        description: 'Visualizzazione dati personali e team.',
        color: 'text-emerald-400 bg-emerald-500/10',
        permissions: [
            { id: 'view_own_data', label: 'Dati Personali', enabled: true },
            { id: 'view_team', label: 'Info Team', enabled: true },
        ]
    }
];

export const RolesTab: React.FC<RolesTabProps> = ({ onUpdate }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h3 className="text-sm font-black text-white uppercase italic tracking-tight mb-1">Governance & Ruoli</h3>
                <p className="text-[11px] text-slate-500 font-medium">Definisci i permessi granulari per ogni tipo di utenza nell'App.</p>
            </div>

            <div className="space-y-4">
                {DEFAULT_ROLES.map((role) => (
                    <div key={role.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${role.color}`}>
                                {role.name}
                            </div>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>

                        <div>
                            <p className="text-[11px] text-slate-400 font-medium mb-4">{role.description}</p>

                            <div className="space-y-2">
                                {role.permissions.map((perm) => (
                                    <div key={perm.id} className="flex items-center justify-between px-3 py-2 bg-slate-950/50 rounded-xl border border-white/[0.03]">
                                        <div className="flex items-center gap-2">
                                            {perm.enabled ? <Check size={12} className="text-emerald-500" /> : <Lock size={12} className="text-slate-600" />}
                                            <span className={`text-[10px] font-bold ${perm.enabled ? 'text-slate-200' : 'text-slate-600'}`}>{perm.label}</span>
                                        </div>
                                        <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${perm.enabled ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${perm.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3">
                <Info size={16} className="text-indigo-400 shrink-0" />
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    I ruoli configurati qui saranno quelli disponibili per gli amministratori del club quando gestiranno i tesserati.
                </p>
            </div>
        </div>
    );
};
