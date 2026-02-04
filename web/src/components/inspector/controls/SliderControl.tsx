import React from 'react';

interface SliderControlProps {
    id: string;
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
}

export const SliderControl: React.FC<SliderControlProps> = ({
    id,
    label,
    value,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    onChange
}) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center">
            <label htmlFor={id} className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{label}</label>
            <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                {value}{unit}
            </span>
        </div>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all hover:accent-indigo-400"
        />
    </div>
);
