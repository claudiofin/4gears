import React from 'react';
import { Mail, MessageSquare, Bell, Image as ImageIcon } from 'lucide-react';
import { TeamConfig } from '@/constants/teams';
import { ImageUploadControl } from '../inspector/controls/ImageUploadControl';
import { ColorControl } from '../inspector/controls/ColorControl';

interface CommunicationTabProps {
    config: TeamConfig;
    onUpdate: (updates: Partial<TeamConfig>) => void;
}

export const CommunicationTab: React.FC<CommunicationTabProps> = ({ config, onUpdate }) => {
    // Defaults ensuring safety
    const channels = config.communication?.channels || { email: true, push: true, sms: false };
    const newsletter = config.communication?.templates?.newsletter || {};

    const updateChannels = (key: keyof typeof channels, value: boolean) => {
        onUpdate({
            communication: {
                ...config.communication,
                channels: { ...channels, [key]: value },
                templates: config.communication?.templates || { newsletter: {} }
            }
        });
    };

    const updateNewsletter = (updates: Partial<typeof newsletter>) => {
        onUpdate({
            communication: {
                ...config.communication,
                channels: channels,
                templates: {
                    ...(config.communication?.templates || {}),
                    newsletter: { ...newsletter, ...updates }
                }
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Channels */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Bell size={12} />
                    Active Channels
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {/* Email */}
                    <button
                        onClick={() => updateChannels('email', !channels.email)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${channels.email ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                        <Mail size={20} />
                        <span className="text-[10px] font-bold">EMAIL</span>
                    </button>
                    {/* Push */}
                    <button
                        onClick={() => updateChannels('push', !channels.push)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${channels.push ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                        <Bell size={20} />
                        <span className="text-[10px] font-bold">PUSH</span>
                    </button>
                    {/* SMS */}
                    <button
                        onClick={() => updateChannels('sms', !channels.sms)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${channels.sms ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                    >
                        <MessageSquare size={20} />
                        <span className="text-[10px] font-bold">SMS</span>
                    </button>
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Newsletter Template */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} />
                    Newsletter Template
                </h3>

                <ImageUploadControl
                    label="Email Header Image"
                    value={newsletter.headerImage}
                    onChange={(url) => updateNewsletter({ headerImage: url })}
                    placeholder="W: 600px H: 200px"
                    aspectRatio="video"
                />

                <ColorControl
                    id="newsletter-color"
                    label="Button & Accent Color"
                    value={newsletter.primaryColor || config.colors.primary}
                    onChange={(color: string) => updateNewsletter({ primaryColor: color })}
                />

                <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Footer Text</label>
                    <textarea
                        value={newsletter.footerText || ''}
                        onChange={(e) => updateNewsletter({ footerText: e.target.value })}
                        placeholder="© 2024 Your Club Name. Unsubscribe..."
                        className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none"
                    />
                </div>
            </section>
        </div>
    );
};
