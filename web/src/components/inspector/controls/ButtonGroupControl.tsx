import React from 'react';

interface ButtonGroupControlProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

export const ButtonGroupControl: React.FC<ButtonGroupControlProps> = ({
    label,
    value,
    options,
    onChange
}) => {
    return (
        <div className="space-y-2 px-1 py-2">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {label}
            </label>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${value === option
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};
