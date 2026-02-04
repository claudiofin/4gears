import React from 'react';

interface ToggleControlProps {
    id: string;
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export const ToggleControl: React.FC<ToggleControlProps> = ({ id, label, value, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-slate-800/50">
        <label htmlFor={id} className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</label>
        <button
            id={id}
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
        >
            <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    </div>
);
