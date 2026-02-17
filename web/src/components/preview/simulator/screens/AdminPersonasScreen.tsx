import React, { useState } from 'react';
import { Users, Shield, Lock, Check, X, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { InteractiveScreenProps } from './types';
import { SectionHeader } from './SharedComponents';

export const AdminPersonasScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    isDarkMode,
    currentTeam,
    topPaddingValue,
    isInspectorActive,
    activeSelectionId,
    onSelect,
    getOverride,
    mockData
}) => {
    const primaryColor = currentTeam.colors.primary;

    const [personas, setPersonas] = useState([
        {
            id: 'PLAYER',
            name: 'Atleta',
            users: 45,
            description: 'Visualizzazione statistiche personali e documenti.',
            color: 'text-emerald-400 bg-emerald-500/10',
            permissions: [
                { id: 'view_own_data', label: 'I Miei Documenti', enabled: true },
                { id: 'view_stats', label: 'Mie Statistiche', enabled: true },
            ]
        },
        {
            id: 'ADMIN',
            name: 'Admin Club',
            users: 3,
            description: 'Controllo totale su brand, fatturazione e permessi.',
            color: 'text-amber-400 bg-amber-500/10',
            permissions: [
                { id: 'view_stats', label: 'Statistiche Globali', enabled: true },
                { id: 'manage_team', label: 'Gestione Team', enabled: true },
            ]
        },
        {
            id: 'FAN',
            name: 'Fan',
            users: 1200,
            description: 'Accesso ai contenuti pubblici e store.',
            color: 'text-rose-400 bg-rose-500/10',
            permissions: [
                { id: 'view_stats', label: 'Risultati Live', enabled: true },
                { id: 'view_own_data', label: 'Profilo Personalizzato', enabled: true },
            ]
        },
        {
            id: 'COACH',
            name: 'Coach / Allenatore',
            users: 8,
            description: 'Gestione tecnica della squadra e convocazioni.',
            color: 'text-blue-400 bg-blue-500/10',
            permissions: [
                { id: 'manage_team', label: 'Gestione Convocazioni', enabled: true },
                { id: 'edit_content', label: 'Caricamento Video Tattici', enabled: true },
            ]
        },
    ]);

    const [selectedPersona, setSelectedPersona] = useState<any>(null);

    return (
        <div className="p-6 pb-32 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ paddingTop: `${topPaddingValue}px` }}>
            <SectionHeader
                id="admin_personas_header"
                label="Gestione Ruoli"
                title="Personas & Permessi"
                isFirst={true}
                isDarkMode={isDarkMode}
                isInspectorActive={isInspectorActive}
                activeSelectionId={activeSelectionId}
                onSelect={onSelect}
                getOverride={getOverride}
            />

            <div className="grid grid-cols-1 gap-4">
                {personas.map((persona) => (
                    <div
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona)}
                        className={`p-4 rounded-[2rem] border transition-all cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/30' : 'bg-white border-slate-100 shadow-sm hover:border-indigo-500/30'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${persona.color}`}>
                                {persona.name}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users size={12} className="text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-500">{persona.users}</span>
                            </div>
                        </div>

                        <h3 className={`text-sm font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{persona.name}</h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">{persona.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100/10">
                            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Configura Permesssi</span>
                            <MoreHorizontal size={14} className="text-slate-400" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Permission Detail Sheet (Simulated) */}
            {selectedPersona && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="absolute inset-0" onClick={() => setSelectedPersona(null)} />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        className={`w-full max-w-md relative rounded-t-[3rem] p-8 pb-12 shadow-2xl ${isDarkMode ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-slate-100'}`}
                    >
                        <div className="w-12 h-1.5 bg-slate-400/20 rounded-full mx-auto mb-8 cursor-pointer" onClick={() => setSelectedPersona(null)} />

                        <div className="flex items-center gap-4 mb-8">
                            <div className={`p-3 rounded-2xl ${selectedPersona.color}`}>
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className={`text-xl font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedPersona.name}</h2>
                                <p className="text-xs text-slate-500 font-medium font-inter">Personalizza i permessi del ruolo</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            {selectedPersona.permissions.map((perm: any) => (
                                <div key={perm.id} className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                    <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{perm.label}</span>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Simulated toggle
                                        }}
                                        className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${perm.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${perm.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedPersona(null)}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                        >
                            Salva Configurazione
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
