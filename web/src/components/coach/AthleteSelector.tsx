'use client';

import React, { useState } from 'react';
import { User, Check, Search, Users } from 'lucide-react';
import { Profile } from '@/types/database';

interface AthleteSelectorProps {
    athletes: Profile[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}

export const AthleteSelector: React.FC<AthleteSelectorProps> = ({ athletes, selectedIds, onChange }) => {
    const [search, setSearch] = useState('');

    const filteredAthletes = athletes.filter(a =>
        `${a.first_name} ${a.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase())
    );

    const toggleAthlete = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(i => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const toggleAll = () => {
        if (selectedIds.length === athletes.length) {
            onChange([]);
        } else {
            onChange(athletes.map(a => a.id));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    <Users size={12} /> Convocati ({selectedIds.length} selezionati)
                </label>
                <button
                    type="button"
                    onClick={toggleAll}
                    className="text-[10px] font-black text-indigo-500 uppercase tracking-tight hover:text-white transition-colors"
                >
                    {selectedIds.length === athletes.length ? 'Deseleziona Tutti' : 'Seleziona Tutti'}
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                    type="text"
                    placeholder="Cerca atleta..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            <div className="max-h-48 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                {filteredAthletes.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                        Nessun atleta trovato
                    </div>
                ) : (
                    filteredAthletes.map(athlete => {
                        const isSelected = selectedIds.includes(athlete.id);
                        return (
                            <button
                                key={athlete.id}
                                type="button"
                                onClick={() => toggleAthlete(athlete.id)}
                                className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${isSelected
                                        ? 'bg-indigo-500/10 border-indigo-500/50'
                                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                                        {athlete.avatar_url ? (
                                            <img src={athlete.avatar_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={14} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                            {athlete.first_name} {athlete.last_name}
                                        </div>
                                        <div className="text-[9px] text-slate-500 uppercase font-black">
                                            {(athlete.role_details as any)?.position || 'Atleta'}
                                        </div>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
