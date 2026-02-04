import React from 'react';
import { Smartphone, Moon, Sun, Monitor, User, Shield, Lock, Download } from 'lucide-react';
import { AppTier, UserPersona, ViewMode, NotchStyle, DeviceType } from '@/types/builder';

interface TopBarProps {
    userPersona: UserPersona;
    onPersonaChange: (persona: UserPersona) => void;
    appTier: AppTier;
    onTierChange: (tier: AppTier) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    notchStyle: NotchStyle;
    onNotchStyleChange: (style: NotchStyle) => void;
    deviceType: 'IPHONE' | 'ANDROID';
    onDeviceChange: (type: 'IPHONE' | 'ANDROID') => void;
    isDarkMode: boolean;
    onDarkModeToggle: () => void;
    onExport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
    userPersona,
    onPersonaChange,
    appTier,
    onTierChange,
    viewMode,
    onViewModeChange,
    notchStyle,
    onNotchStyleChange,
    deviceType,
    onDeviceChange,
    isDarkMode,
    onDarkModeToggle,
    onExport
}) => {
    return (
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-40">
            <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700">
                    {['USER', 'ADMIN'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => onViewModeChange(mode as ViewMode)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${viewMode === mode
                                ? 'bg-indigo-600 text-white shadow'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {mode === 'USER' ? <User size={12} /> : <Shield size={12} />}
                            {mode}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-slate-800 mx-2" />

                <div className="flex items-center gap-2">
                    <label htmlFor="persona-select" className="text-xs text-slate-500 font-medium uppercase tracking-wider">Persona:</label>
                    <select
                        id="persona-select"
                        value={userPersona}
                        onChange={(e) => onPersonaChange(e.target.value as UserPersona)}
                        className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-blue-500"
                    >
                        {['ADMIN', 'COACH', 'PLAYER', 'FAN'].map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Plan:</span>
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                        {['FREE', 'PREMIUM', 'ELITE'].map((tier) => (
                            <button
                                key={tier}
                                onClick={() => onTierChange(tier as AppTier)}
                                className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${appTier === tier
                                    ? tier === 'ELITE'
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white'
                                        : 'bg-slate-700 text-white'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Simulator Settings */}
                <div className="flex items-center gap-3 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/50">
                    <span className="text-[10px] text-slate-500 font-bold px-1 uppercase tracking-wider">Device Simulator</span>
                    <div className="w-px h-3 bg-slate-800" />
                    {/* Device Selector */}
                    <label htmlFor="device-select" className="sr-only">Device Type</label>
                    <select
                        id="device-select"
                        value={deviceType}
                        onChange={(e) => onDeviceChange(e.target.value as 'IPHONE' | 'ANDROID')}
                        className="bg-transparent text-[10px] text-slate-400 outline-none cursor-pointer hover:text-slate-200"
                    >
                        <option value="IPHONE">iPhone 15 Pro</option>
                        <option value="ANDROID">Pixel 8 Pro</option>
                    </select>

                    <div className="w-px h-3 bg-slate-800" />

                    <label htmlFor="notch-select" className="sr-only">Notch Style</label>
                    <select
                        id="notch-select"
                        value={notchStyle}
                        onChange={(e) => onNotchStyleChange(e.target.value as NotchStyle)}
                        className="bg-transparent text-[10px] text-slate-400 outline-none cursor-pointer hover:text-slate-200"
                    >
                        <option value="NONE">No Notch</option>
                        <option value="STANDARD">Standard</option>
                        <option value="FLOATING">Dynamic Island</option>
                    </select>

                    <div className="w-px h-3 bg-slate-800" />

                    <button
                        onClick={onDarkModeToggle}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Toggle Dark Mode"
                    >
                        {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-800 mx-2" />

                {/* Export Button */}
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                    <Download size={14} />
                    Export
                </button>
            </div>
        </div>
    );
};
