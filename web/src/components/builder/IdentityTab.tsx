import React from 'react';
import { Image as ImageIcon, Smartphone, Palette, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Zap } from 'lucide-react';
import { TeamConfig, DEFAULT_TEAMS } from '@/constants/teams';
import { ImageUploadControl } from '../inspector/controls/ImageUploadControl';

import { ColorControl } from '../inspector/controls/ColorControl';
import { ButtonGroupControl } from '../inspector/controls/ButtonGroupControl';

import { MemberCardDesigner } from './identity/MemberCardDesigner';
import { RegistrationFormBuilder } from './identity/RegistrationFormBuilder';
import { ThemeConfig } from '@/types/builder';

interface IdentityTabProps {
    currentTeam: TeamConfig;
    onTeamChange: (teamId: string) => void;
    onUpdate: (updates: Partial<TeamConfig>) => void;
    themeConfig: ThemeConfig;
    onThemeUpdate: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({ currentTeam, onTeamChange, onUpdate, themeConfig, onThemeUpdate }) => {
    const [subTab, setSubTab] = React.useState<'IDENTITY' | 'INFO' | 'CARD' | 'FORM'>('IDENTITY');

    // Helper to get app icon (fallback to 4G placeholder if not set)
    const appIcon = currentTeam.branding?.appIcon;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Sub-tab Navigation */}
            <div className="flex p-1 bg-slate-800/50 rounded-lg mb-6">
                <button
                    onClick={() => setSubTab('IDENTITY')}
                    className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${subTab === 'IDENTITY' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Brand & Assets
                </button>
                <button
                    onClick={() => setSubTab('INFO')}
                    className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${subTab === 'INFO' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Info & Socials
                </button>
                <button
                    onClick={() => setSubTab('CARD')}
                    className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${subTab === 'CARD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Member Card
                </button>
                <button
                    onClick={() => setSubTab('FORM')}
                    className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${subTab === 'FORM' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Registration
                </button>
            </div>

            {subTab === 'IDENTITY' && (
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

                        {/* AI Logo Processing Button */}
                        <button
                            className="w-full py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center gap-2 group hover:bg-indigo-600/20 transition-all"
                            onClick={() => console.log('Processing Logo with AI...')}
                        >
                            <Zap size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Generate Brand Identity with AI</span>
                        </button>
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
            )}

            {subTab === 'INFO' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                    {/* Contact Info */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={12} />
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-bold uppercase">Public Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-slate-500" size={14} />
                                    <input
                                        type="email"
                                        value={currentTeam.contacts?.email || ''}
                                        onChange={(e) => onUpdate({ contacts: { ...currentTeam.contacts, email: e.target.value } })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                        placeholder="info@club.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 text-slate-500" size={14} />
                                    <input
                                        type="tel"
                                        value={currentTeam.contacts?.phone || ''}
                                        onChange={(e) => onUpdate({ contacts: { ...currentTeam.contacts, phone: e.target.value } })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                        placeholder="+39 02 1234567"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-bold uppercase">Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 text-slate-500" size={14} />
                                    <input
                                        type="url"
                                        value={currentTeam.contacts?.website || ''}
                                        onChange={(e) => onUpdate({ contacts: { ...currentTeam.contacts, website: e.target.value } })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                        placeholder="https://www.club.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-slate-800" />

                    {/* Social Media */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Globe size={12} />
                            Social Media
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-600/20 text-blue-500 rounded-lg"><Facebook size={16} /></div>
                                <input
                                    type="text"
                                    value={currentTeam.socials?.facebook || ''}
                                    onChange={(e) => onUpdate({ socials: { ...currentTeam.socials, facebook: e.target.value } })}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                    placeholder="Facebook Page URL"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-pink-600/20 text-pink-500 rounded-lg"><Instagram size={16} /></div>
                                <input
                                    type="text"
                                    value={currentTeam.socials?.instagram || ''}
                                    onChange={(e) => onUpdate({ socials: { ...currentTeam.socials, instagram: e.target.value } })}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                    placeholder="Instagram Profile URL"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg"><Twitter size={16} /></div>
                                <input
                                    type="text"
                                    value={currentTeam.socials?.twitter || ''}
                                    onChange={(e) => onUpdate({ socials: { ...currentTeam.socials, twitter: e.target.value } })}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                    placeholder="X / Twitter Handle"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-600/20 text-red-500 rounded-lg"><Youtube size={16} /></div>
                                <input
                                    type="text"
                                    value={currentTeam.socials?.youtube || ''}
                                    onChange={(e) => onUpdate({ socials: { ...currentTeam.socials, youtube: e.target.value } })}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                    placeholder="YouTube Channel URL"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {subTab === 'CARD' && (
                <MemberCardDesigner
                    config={themeConfig}
                    onUpdate={onThemeUpdate}
                />
            )}

            {subTab === 'FORM' && (
                <RegistrationFormBuilder
                    config={themeConfig}
                    onUpdate={onThemeUpdate}
                />
            )}
        </div>
    );
};
