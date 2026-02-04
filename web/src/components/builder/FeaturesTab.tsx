import React from 'react';
import { Settings, Lock, Unlock } from 'lucide-react';
import { FeatureFlags } from '@/types/builder';

interface FeaturesTabProps {
    flags: FeatureFlags;
    onToggle: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<FeatureFlags[keyof FeatureFlags]>) => void; // For updating minTier if we add that ability
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({ flags, onToggle, onUpdate }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="border-l-2 border-indigo-500 pl-4 py-1">
                <h3 className="text-sm font-bold text-white">Feature Matrix</h3>
                <p className="text-[11px] text-slate-500 mt-1">Manage feature availability per tier</p>
            </div>

            <div className="space-y-3">
                {Object.values(flags).map((flag) => (
                    <div key={flag.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${flag.enabled ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                                    <Settings size={14} />
                                </div>
                                <div>
                                    <div className={`text-xs font-semibold ${flag.enabled ? 'text-slate-200' : 'text-slate-500'}`}>{flag.label}</div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                        {flag.minTier === 'FREE' ? <Unlock size={10} /> : <Lock size={10} />}
                                        <span className={flag.minTier !== 'FREE' ? 'text-indigo-400 font-mono ' : 'font-mono'}>{flag.minTier}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onToggle(flag.id)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${flag.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${flag.enabled ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Advanced Controls */}
                        <div className={`grid grid-cols-1 gap-2 overflow-hidden transition-all text-[10px] ${flag.enabled ? 'h-auto opacity-100 mt-2 pt-2 border-t border-slate-800/50' : 'h-0 opacity-0'}`}>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center justify-between px-2 py-1.5 bg-black/20 rounded">
                                    <span className="text-slate-500">Min Tier</span>
                                    <select
                                        value={flag.minTier}
                                        onChange={(e) => onUpdate && onUpdate(flag.id, { minTier: e.target.value })}
                                        className="bg-transparent text-slate-300 font-mono text-right outline-none cursor-pointer hover:text-white"
                                    >
                                        <option value="FREE" className="bg-slate-900 text-slate-300">FREE</option>
                                        <option value="PREMIUM" className="bg-slate-900 text-slate-300">PREMIUM</option>
                                        <option value="ELITE" className="bg-slate-900 text-slate-300">ELITE</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between px-2 py-1.5 bg-black/20 rounded">
                                    <span className="text-slate-500">Visible</span>
                                    <span className="text-slate-300">{flag.availableTo?.length === 4 ? 'All' : `${flag.availableTo?.length || 0} Roles`}</span>
                                </div>
                            </div>

                            {/* Role Selector */}
                            <div className="px-2 py-1.5 bg-black/20 rounded flex items-center justify-between">
                                <span className="text-slate-500">Roles</span>
                                <div className="flex gap-1">
                                    {(['FAN', 'PLAYER', 'COACH', 'ADMIN'] as const).map(role => (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                const current = flag.availableTo || [];
                                                const updated = current.includes(role)
                                                    ? current.filter((r: string) => r !== role)
                                                    : [...current, role];
                                                onUpdate && onUpdate(flag.id, { availableTo: updated });
                                            }}
                                            className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold border transition-colors ${flag.availableTo?.includes(role)
                                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                                : 'bg-slate-800 text-slate-600 border-slate-700 hover:border-slate-600'
                                                }`}
                                            title={role}
                                        >
                                            {role[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
