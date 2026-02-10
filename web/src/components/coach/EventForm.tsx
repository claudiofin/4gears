'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Type, AlignLeft, Save, X } from 'lucide-react';
import { TeamEvent, Profile } from '@/types/database';
import { AthleteSelector } from './AthleteSelector';

interface EventFormProps {
    initialData?: Partial<TeamEvent>;
    athletes: Profile[];
    onSubmit: (data: any, athleteIds: string[]) => void;
    onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ initialData, athletes, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        event_type: initialData?.event_type || 'training',
        location: initialData?.location || '',
        start_time: initialData?.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
        end_time: initialData?.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : '',
    });

    const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, selectedAthletes);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <Calendar className="text-indigo-500" />
                    {initialData?.id ? 'Modifica Evento' : 'Nuovo Evento'}
                </h3>
                <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                        <Type size={12} /> Titolo
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Es: Allenamento Tecnico"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Event Type & Location */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                            <Calendar size={12} /> Tipo
                        </label>
                        <select
                            value={formData.event_type}
                            onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                        >
                            <option value="training">Allenamento</option>
                            <option value="match">Partita</option>
                            <option value="meeting">Riunione</option>
                            <option value="other">Altro</option>
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                            <MapPin size={12} /> Luogo
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Es: Stadio Comunale"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Time range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                            <Clock size={12} /> Inizio
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                            <Clock size={12} /> Fine
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.end_time}
                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Convocations */}
                <AthleteSelector
                    athletes={athletes}
                    selectedIds={selectedAthletes}
                    onChange={setSelectedAthletes}
                />

                {/* Description */}
                <div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                        <AlignLeft size={12} /> Descrizione (opzionale)
                    </label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Note o focus dell'allenamento..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                >
                    Annulla
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    Salva Evento
                </button>
            </div>
        </form>
    );
};
