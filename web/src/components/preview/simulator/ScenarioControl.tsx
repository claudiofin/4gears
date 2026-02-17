import React from 'react';
import { Play, Flame, AlertTriangle } from 'lucide-react';

interface ScenarioControlProps {
    current: 'DEFAULT' | 'LIVE_MATCH' | 'EVENT';
    onChange: (scenario: 'DEFAULT' | 'LIVE_MATCH' | 'EVENT') => void;
}

export const ScenarioControl: React.FC<ScenarioControlProps> = ({ current, onChange }) => {
    return (
        <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
            <button
                onClick={() => onChange('DEFAULT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
                    ${current === 'DEFAULT'
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'}`}
            >
                <Play size={12} />
                Normal
            </button>
            <button
                onClick={() => onChange('LIVE_MATCH')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
                    ${current === 'LIVE_MATCH'
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                        : 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'}`}
            >
                <Flame size={12} />
                Live Match
            </button>
            <button
                onClick={() => onChange('EVENT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
                    ${current === 'EVENT'
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                        : 'text-slate-500 hover:text-amber-400 hover:bg-amber-500/10'}`}
            >
                <AlertTriangle size={12} />
                Event
            </button>
        </div>
    );
};
