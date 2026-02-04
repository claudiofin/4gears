import React from 'react';

interface TextControlProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const TextControl: React.FC<TextControlProps> = ({ id, label, value, onChange }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</label>
        <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-blue-500 transition-colors"
        />
    </div>
);
