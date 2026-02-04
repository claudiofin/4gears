import React from 'react';

interface ColorControlProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const ColorControl: React.FC<ColorControlProps> = ({ id, label, value, onChange }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div className="relative w-6 h-6 rounded overflow-hidden shadow-sm shrink-0 border border-white/10">
                <input
                    id={id}
                    type="color"
                    value={value || '#ffffff'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                />
            </div>
            <input
                id={`${id}-text`}
                type="text"
                value={value || ''}
                placeholder="#HEX"
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent text-xs text-white w-full outline-none font-mono uppercase"
            />
        </div>
    </div>
);
