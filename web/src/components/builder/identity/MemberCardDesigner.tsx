import React from 'react';
import { CreditCard, QrCode, Image as ImageIcon, Check, Palette } from 'lucide-react';
import { ThemeConfig, MemberCardConfig } from '@/types/builder';
import { ImageUploadControl } from '@/components/inspector/controls/ImageUploadControl';
import { ColorControl } from '@/components/inspector/controls/ColorControl';

interface MemberCardDesignerProps {
    config: ThemeConfig;
    onUpdate: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
}

export const MemberCardDesigner: React.FC<MemberCardDesignerProps> = ({ config, onUpdate }) => {
    const cardConfig = config.memberCard || {
        enabled: true,
        style: 'modern',
        showPhoto: true,
        showQrCode: true,
        showLogo: true,
        backgroundColor: '#1e293b',
        textColor: '#ffffff',
        accentColor: '#3b82f6'
    };

    const updateCardConfig = (updates: Partial<MemberCardConfig>) => {
        onUpdate((prev) => ({
            ...prev,
            memberCard: {
                ...(prev.memberCard || cardConfig),
                ...updates
            }
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-200 tracking-tight">Digital Membership Card</h2>
                    <p className="text-xs text-slate-500 mt-1">Design the digital pass for your members</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Enable</span>
                    <button
                        onClick={() => updateCardConfig({ enabled: !cardConfig.enabled })}
                        className={`w-12 h-6 rounded-full relative transition-colors ${cardConfig.enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${cardConfig.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="relative w-full aspect-[1.586] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                {/* Background Layer */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundColor: cardConfig.backgroundColor,
                        backgroundImage: cardConfig.backgroundImage ? `url(${cardConfig.backgroundImage})` : undefined
                    }}
                />

                {/* Glass Effect Overlay */}
                {cardConfig.style === 'glass' && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20" />
                )}

                {/* Card Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        {cardConfig.showLogo && (
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="text-xs font-bold">LOGO</span>
                            </div>
                        )}
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-widest opacity-70" style={{ color: cardConfig.textColor }}>Member Card</div>
                            <div className="text-lg font-black" style={{ color: cardConfig.textColor }}>2024/25</div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-4">
                            {cardConfig.showPhoto && (
                                <div className="w-16 h-16 rounded-xl bg-slate-200 border-2 border-white/30 overflow-hidden">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Member" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div>
                                <div className="text-lg font-bold leading-none mb-1" style={{ color: cardConfig.textColor }}>Mario Rossi</div>
                                <div className="text-xs opacity-80" style={{ color: cardConfig.textColor }}>Atleta • Prima Squadra</div>
                            </div>
                        </div>

                        {cardConfig.showQrCode && (
                            <div className="bg-white p-2 rounded-lg shadow-lg">
                                <QrCode size={40} className="text-black" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">

                {/* Style Selector */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Palette size={12} /> Card Style
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {['classic', 'modern', 'glass'].map((style) => (
                            <button
                                key={style}
                                onClick={() => updateCardConfig({ style: style as any })}
                                className={`p-3 rounded-lg border text-xs font-bold capitalize transition-all ${cardConfig.style === style
                                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                                    }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="h-px bg-slate-800" />

                {/* Visibility Toggles */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Elements</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'showPhoto', label: 'Member Photo' },
                            { id: 'showQrCode', label: 'QR Code' },
                            { id: 'showLogo', label: 'Club Logo' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => updateCardConfig({ [item.id]: !cardConfig[item.id as keyof MemberCardConfig] })}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${cardConfig[item.id as keyof MemberCardConfig]
                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-500'
                                    }`}
                            >
                                <span className="text-xs font-bold">{item.label}</span>
                                {cardConfig[item.id as keyof MemberCardConfig] && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="h-px bg-slate-800" />

                {/* Colors & Background */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Appearance</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <ColorControl
                            id="card-bg"
                            label="Background"
                            value={cardConfig.backgroundColor || '#1e293b'}
                            onChange={(val) => updateCardConfig({ backgroundColor: val })}
                        />
                        <ColorControl
                            id="card-text"
                            label="Text Color"
                            value={cardConfig.textColor || '#ffffff'}
                            onChange={(val) => updateCardConfig({ textColor: val })}
                        />
                    </div>

                    <ImageUploadControl
                        label="Background Pattern"
                        value={cardConfig.backgroundImage}
                        onChange={(url) => updateCardConfig({ backgroundImage: url })}
                        aspectRatio="video"
                    />
                </section>
            </div>
        </div>
    );
};
