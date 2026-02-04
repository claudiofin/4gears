import React from 'react';
import { Image as ImageIcon, Smartphone, Palette } from 'lucide-react';
import { TeamConfig, DEFAULT_TEAMS } from '@/constants/teams';
import { ImageUploadControl } from '../inspector/controls/ImageUploadControl';

import { ColorControl } from '../inspector/controls/ColorControl';
import { ButtonGroupControl } from '../inspector/controls/ButtonGroupControl';

interface IdentityTabProps {
    currentTeam: TeamConfig;
    onTeamChange: (teamId: string) => void;
    onUpdate: (updates: Partial<TeamConfig>) => void;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({ currentTeam, onTeamChange, onUpdate }) => {

    // Helper to get app icon (fallback to 4G placeholder if not set)
    const appIcon = currentTeam.branding?.appIcon;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">

            {/* Project/Team Selection */}
            <section>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                    Active Project
                </label>
                <div className="space-y-2">
                    {DEFAULT_TEAMS.map(team => (
                        <button
                            key={team.id}
                            onClick={() => onTeamChange(team.id)}
                            className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all border ${currentTeam.id === team.id
                                ? 'bg-slate-800 border-indigo-500 text-white shadow-lg'
                                : 'bg-transparent border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{team.name}</span>
                                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-500 font-mono">{team.sportType}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Team Colors */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={12} />
                    Team Palette
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <ColorControl
                        id="primary-color"
                        label="Primary"
                        value={currentTeam.colors.primary}
                        onChange={(val) => onUpdate({ colors: { ...currentTeam.colors, primary: val } })}
                    />
                    <ColorControl
                        id="secondary-color"
                        label="Secondary"
                        value={currentTeam.colors.secondary}
                        onChange={(val) => onUpdate({ colors: { ...currentTeam.colors, secondary: val } })}
                    />
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Logo & Identity */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={12} />
                    Brand Assets
                </h3>

                {/* Team Name Input */}
                <div className="space-y-2 mb-4">
                    <label htmlFor="team-name-input" className="text-[10px] text-slate-400 font-medium">Team Name</label>
                    <input
                        id="team-name-input"
                        type="text"
                        value={currentTeam.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className="w-full bg-slate-800 text-sm text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none placeholder-slate-600 transition-all font-bold"
                        placeholder="Enter team name..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Club Logo */}
                    <ImageUploadControl
                        label="Club Logo"
                        value={currentTeam.logo}
                        onChange={(url) => onUpdate({ logo: url })}
                        placeholder="SVG or PNG"
                    />

                    {/* App Icon */}
                    <ImageUploadControl
                        label="App Icon"
                        value={appIcon}
                        onChange={(url) => {
                            const currentBranding = currentTeam.branding || {};
                            onUpdate({ branding: { ...currentBranding, appIcon: url } });
                        }}
                        placeholder="1024x1024"
                        className="rounded-[10px]" // Hint for app icon shape
                    />
                </div>
            </section>

            {/* Splash & Global Background */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Smartphone size={12} />
                        Simulator Setup
                    </h3>
                </div>


                <div className="grid grid-cols-1 gap-4">
                    {/* Splash Screen Preview */}
                    <ImageUploadControl
                        label="Splash Screen"
                        value={currentTeam.branding?.splashImage}
                        onChange={(url) => {
                            const currentBranding = currentTeam.branding || {};
                            onUpdate({ branding: { ...currentBranding, splashImage: url } });
                        }}
                        placeholder="Vertical Splash"
                        aspectRatio="banner" // Using banner as proxy for custom ratio if needed, or stick to square/custom
                    />

                    <ButtonGroupControl
                        label="Logo Position on Splash"
                        value={currentTeam.branding?.logoPosition || 'center'}
                        options={['top', 'center', 'bottom']}
                        onChange={(val) => {
                            const currentBranding = currentTeam.branding || {};
                            onUpdate({ branding: { ...currentBranding, logoPosition: val as any } });
                        }}
                    />

                    {/* UI Global Background */}
                    <ImageUploadControl
                        label="Global UI Background"
                        value={currentTeam.branding?.uiBackground}
                        onChange={(url) => {
                            const currentBranding = currentTeam.branding || {};
                            onUpdate({ branding: { ...currentBranding, uiBackground: url } });
                        }}
                        placeholder="Texture or Pattern"
                        aspectRatio="banner"
                    />

                    {/* Watermark (New) */}
                    <ImageUploadControl
                        label="Photo Watermark (Optional)"
                        value={currentTeam.branding?.watermark}
                        onChange={(url) => {
                            const currentBranding = currentTeam.branding || {};
                            onUpdate({ branding: { ...currentBranding, watermark: url } });
                        }}
                        placeholder="Transparent PNG"
                        aspectRatio="banner"
                    />
                </div>
            </section>
        </div>
    );
};
