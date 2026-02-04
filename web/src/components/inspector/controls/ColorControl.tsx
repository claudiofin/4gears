import React from 'react';

interface ColorControlProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const ColorControl: React.FC<ColorControlProps> = ({ id, label, value, onChange }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            <div className="relative w-5 h-5 rounded overflow-hidden shadow-sm shrink-0">
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
                className="bg-transparent text-[10px] text-slate-300 w-full outline-none font-mono uppercase"
            />
        </div>
    </div>
);
