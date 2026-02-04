import React, { useState } from 'react';
import {
    Settings, Shield, Edit3, Clock, Plus, Trash2, RotateCcw,
    Trophy, Users, Activity
} from 'lucide-react';
import { TeamConfig } from '@/constants/teams';
import { SPORT_CONFIG } from '@/constants/sports';

interface SportTabProps {
    config: TeamConfig;
    onUpdate: (updates: Partial<TeamConfig>) => void;
}

export const SportTab: React.FC<SportTabProps> = ({ config, onUpdate }) => {
    const defaultConfig = SPORT_CONFIG[config.sportType] || SPORT_CONFIG['Calcio'];
    const overrides = config.sportOverrides || {};

    const [newRole, setNewRole] = useState('');

    const updateOverride = (section: 'roles' | 'scoring' | 'clock', value: any) => {
        onUpdate({
            sportOverrides: {
                ...overrides,
                [section]: value
            }
        });
    };

    const currentRoles = overrides.roles || defaultConfig.roles;

    // Scoring overrides
    const currentScoringTerm = overrides.scoring?.term || defaultConfig.scoring.term;
    const currentScoringPeriod = overrides.scoring?.period || defaultConfig.scoring.period;
    // Points isn't in default config, assume 1 if not set
    const currentPoints = overrides.scoring?.points || 1;

    // Clock overrides (defaults to 2 periods of 45 mins if not set)
    const currentPeriods = overrides.clock?.periods || 2;
    const currentDuration = overrides.clock?.durationMinutes || 45;

    const handleAddRole = () => {
        if (!newRole.trim()) return;
        const updatedRoles = [...currentRoles, newRole.trim()];
        updateOverride('roles', updatedRoles);
        setNewRole('');
    };

    const handleRemoveRole = (roleToRemove: string) => {
        const updatedRoles = currentRoles.filter(r => r !== roleToRemove);
        updateOverride('roles', updatedRoles);
    };

    const handleReset = () => {
        onUpdate({ sportOverrides: undefined });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-200 tracking-tight">Sport & Regole</h2>
                {config.sportOverrides && (
                    <button
                        onClick={handleReset}
                        className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw size={10} /> RIPRISTINA DEFAULT
                    </button>
                )}
            </div>

            {/* Sport Info Card */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${defaultConfig.bgGradient} flex items-center justify-center border border-white/10 shadow-lg`}>
                    <defaultConfig.icon className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">{config.sportType}</h3>
                    <div className="text-xs text-slate-400">Federazione: <span className="text-indigo-400 font-bold">{defaultConfig.federation || 'N/A'}</span></div>
                </div>
            </div>

            <div className="h-px bg-slate-800" />

            {/* Roles Editor */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Users size={12} />
                    Ruoli & Posizioni
                </h3>

                <div className="grid grid-cols-1 gap-2">
                    {currentRoles.map((role, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700 group">
                            <span className="text-sm font-medium text-slate-300">{role}</span>
                            <button
                                onClick={() => handleRemoveRole(role)}
                                className="text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="Aggiungi nuovo ruolo..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                    />
                    <button
                        onClick={handleAddRole}
                        disabled={!newRole.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Scoring & Terminology */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={12} />
                    Punteggio
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1.5 block">Terminologia Goal</label>
                        <input
                            type="text"
                            value={currentScoringTerm}
                            onChange={(e) => updateOverride('scoring', { ...overrides.scoring, term: e.target.value, period: currentScoringPeriod, points: currentPoints })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1.5 block">Valore Punto</label>
                        <input
                            type="number"
                            value={currentPoints}
                            onChange={(e) => updateOverride('scoring', { ...overrides.scoring, points: parseInt(e.target.value) || 1, term: currentScoringTerm, period: currentScoringPeriod })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Clock & Periods */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} />
                    Tempo di Gioco
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1.5 block">Nome Periodo (Display)</label>
                        <input
                            type="text"
                            value={currentScoringPeriod}
                            onChange={(e) => updateOverride('scoring', { ...overrides.scoring, period: e.target.value, term: currentScoringTerm, points: currentPoints })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 ps-3"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1.5 block">Numero Periodi</label>
                        <input
                            type="number"
                            value={currentPeriods}
                            onChange={(e) => updateOverride('clock', { ...overrides.clock, periods: parseInt(e.target.value) || 1, durationMinutes: currentDuration })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1.5 block">Durata (Minuti)</label>
                        <input
                            type="number"
                            value={currentDuration}
                            onChange={(e) => updateOverride('clock', { ...overrides.clock, durationMinutes: parseInt(e.target.value) || 1, periods: currentPeriods })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
