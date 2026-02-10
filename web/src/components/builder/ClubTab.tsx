import React from 'react';
import { Users, Plus, Trash2, FileDown, ShieldCheck, ChevronRight } from 'lucide-react';
import { TeamConfig } from '@/constants/teams';
import { FederationReportService } from '@/services/FederationReportService';

interface ClubTabProps {
    teams: TeamConfig[];
    currentTeamId: string;
    onTeamChange: (id: string) => void;
    onAddTeam: () => void;
    onRemoveTeam: (id: string) => void;
    multiTeamMode: boolean;
    onToggleMultiTeam: (enabled: boolean) => void;
}

export const ClubTab: React.FC<ClubTabProps> = ({
    teams,
    currentTeamId,
    onTeamChange,
    onAddTeam,
    onRemoveTeam,
    multiTeamMode,
    onToggleMultiTeam
}) => {
    return (
        <div className="space-y-6">
            {/* Header / Toggle */}
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Configurazione Società</h3>
                    <button
                        onClick={() => onToggleMultiTeam(!multiTeamMode)}
                        className={`w-10 h-5 rounded-full transition-all relative ${multiTeamMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${multiTeamMode ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                    Attiva il modulo multi-squadra per gestire diverse categorie (es. Prima Squadra, Juniores, Allievi) sotto un unico club.
                </p>
            </div>

            {/* Team List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Squadre Attive</h4>
                    {multiTeamMode && (
                        <button
                            onClick={onAddTeam}
                            className="p-1 hover:bg-slate-800 rounded-md text-emerald-500 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className={`group p-3 border rounded-xl transition-all cursor-pointer flex items-center justify-between ${currentTeamId === team.id
                                ? 'bg-slate-800 border-indigo-500/50 shadow-lg'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                            onClick={() => onTeamChange(team.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                    style={{ backgroundColor: `${team.colors.primary}20`, color: team.colors.primary }}
                                >
                                    {team.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">{team.name}</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-mono">{team.sportType}</p>
                                </div>
                            </div>

                            {multiTeamMode && teams.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveTeam(team.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Federation Tools */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Strumenti Federazione</h4>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => FederationReportService.exportMatchList(teams.find(t => t.id === currentTeamId)?.name || 'Team', [])}
                        className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-left"
                    >
                        <div className="flex items-center gap-3">
                            <FileDown size={14} className="text-blue-400" />
                            <div>
                                <p className="text-[11px] font-bold text-white">Esporta Liste Gara</p>
                                <p className="text-[9px] text-slate-500">Formato PDF conforme FIGC/FIP</p>
                            </div>
                        </div>
                        <ChevronRight size={12} className="text-slate-600" />
                    </button>
                    <button
                        onClick={() => FederationReportService.exportMedicalCertificates([])}
                        className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-left"
                    >
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <div>
                                <p className="text-[11px] font-bold text-white">Report Certificati</p>
                                <p className="text-[9px] text-slate-500">Analisi scadenza globale</p>
                            </div>
                        </div>
                        <ChevronRight size={12} className="text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Club Identity (Settings potentially shared) */}
            <div className="p-4 bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-[9px] text-slate-500 text-center uppercase font-black tracking-widest">
                    Modulo Federazione v1.0 • 2025
                </p>
            </div>
        </div>
    );
};
