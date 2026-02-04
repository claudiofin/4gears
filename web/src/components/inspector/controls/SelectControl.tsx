import React from 'react';

interface SelectControlProps {
    id: string;
    label: string;
    value: string;
    options: { label: string; value: string }[] | string[];
    onChange: (value: string) => void;
}

export const SelectControl: React.FC<SelectControlProps> = ({ id, label, value, options, onChange }) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</label>
        <div className="flex flex-wrap gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
            {options.map((option) => {
                const optLabel = typeof option === 'string' ? option : option.label;
                const optValue = typeof option === 'string' ? option : option.value;
                const isActive = value === optValue;

                return (
                    <button
                        key={optValue}
                        onClick={() => onChange(optValue)}
                        className={`flex-1 min-w-[60px] px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-tight ${isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
                            }`}
                    >
                        {optLabel}
                    </button>
                );
            })}
        </div>
    </div>
);
