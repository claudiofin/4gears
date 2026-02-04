import React from 'react';
import { Type, Layout, Grid, Moon, Sun, Upload, X, Palette } from 'lucide-react';
import { ThemeConfig, FeatureFlags } from '@/types/builder';

interface DesignTabProps {
    config: ThemeConfig;
    onUpdate: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
    featureFlags: FeatureFlags;
}

export const DesignTab: React.FC<DesignTabProps> = ({ config, onUpdate, featureFlags }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">



            {/* Typography */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Type size={12} />
                    Typography & Icons
                </h3>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="heading-font-select" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Headings</label>
                            <select
                                id="heading-font-select"
                                value={config.fontFamily}
                                onChange={(e) => onUpdate({ ...config, fontFamily: e.target.value })}
                                className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
                            >
                                <option value="Inter">Inter</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Outfit">Outfit</option>
                                <option value="Playfair Display">Playfair</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="body-font-select" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Body</label>
                            <select
                                id="body-font-select"
                                value={config.bodyFont || 'Inter'}
                                onChange={(e) => onUpdate({ ...config, bodyFont: e.target.value })}
                                className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
                            >
                                <option value="Inter">Inter</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Open Sans">Open Sans</option>
                                <option value="Lato">Lato</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="font-scale-slider" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Base Size Scale</label>
                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                {(config.fontScale || 1).toFixed(2)}x
                            </span>
                        </div>
                        <input
                            id="font-scale-slider"
                            type="range"
                            min="0.8"
                            max="1.2"
                            step="0.05"
                            value={config.fontScale || 1}
                            onChange={(e) => onUpdate({ ...config, fontScale: parseFloat(e.target.value) })}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Icon Style</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700/50">
                            {[
                                { id: 'outline', label: 'Outline' },
                                { id: 'filled', label: 'Filled' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => onUpdate({ ...config, iconStyle: opt.id as ThemeConfig['iconStyle'] })}
                                    className={`py-2 text-[10px] font-bold rounded-lg transition-all ${config.iconStyle === opt.id
                                        ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/5'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Layout & Shapes */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Layout size={12} />
                    Layout System
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="border-radius-select" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Radius</label>
                        <select
                            id="border-radius-select"
                            value={config.borderRadius}
                            onChange={(e) => onUpdate({ ...config, borderRadius: e.target.value })}
                            className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        >
                            <option value="0px">Sharp (0px)</option>
                            <option value="4px">Small (4px)</option>
                            <option value="8px">Medium (8px)</option>
                            <option value="16px">Large (16px)</option>
                            <option value="full">Round (Full)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="spacing-level-select" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Spacing</label>
                        <select
                            id="spacing-level-select"
                            value={config.spacingLevel}
                            onChange={(e) => onUpdate({ ...config, spacingLevel: e.target.value as ThemeConfig['spacingLevel'] })}
                            className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700/50 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        >
                            <option value="compact">Compact</option>
                            <option value="comfortable">Comfortable</option>
                            <option value="spacious">Spacious</option>
                        </select>
                    </div>
                </div>

                <div className="pt-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3 flex items-center justify-between">
                        Theme Support
                        <span className="text-[8px] bg-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-400 font-bold border border-indigo-500/30 animate-pulse">Select at least one</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                if (config.supportLightMode && !config.supportDarkMode) return;
                                onUpdate({ ...config, supportLightMode: !config.supportLightMode });
                            }}
                            className={`p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-3 ${config.supportLightMode
                                ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${config.supportLightMode ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-600'}`}>
                                <Sun size={18} />
                            </div>
                            Light Mode
                        </button>
                        <button
                            onClick={() => {
                                if (!config.supportLightMode && config.supportDarkMode) return;
                                onUpdate({ ...config, supportDarkMode: !config.supportDarkMode });
                            }}
                            className={`p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-3 ${config.supportDarkMode
                                ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${config.supportDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                                <Moon size={18} />
                            </div>
                            Dark Mode
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Card Material</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700/50 mb-4">
                        {['minimal', 'bordered', 'glass'].map((style) => (
                            <button
                                key={style}
                                onClick={() => onUpdate({ ...config, cardStyle: style as ThemeConfig['cardStyle'] })}
                                className={`py-2 text-[10px] font-bold capitalize rounded-lg transition-all ${config.cardStyle === style
                                    ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/5'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                    }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>

                    {config.cardStyle === 'glass' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex justify-between items-center">
                                <label htmlFor="glass-intensity-slider" className="text-[10px] text-slate-400 font-medium">Glass Blur Intensity</label>
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                    {config.glassIntensity || 10}px
                                </span>
                            </div>
                            <input
                                id="glass-intensity-slider"
                                type="range"
                                min="0"
                                max="20"
                                step="1"
                                value={config.glassIntensity || 10}
                                onChange={(e) => onUpdate({ ...config, glassIntensity: parseInt(e.target.value) })}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                    )}
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Universal Menu in Header */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Grid size={12} />
                    Universal Menu
                </h3>

                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                    <div>
                        <div className="text-xs font-bold text-slate-200 mb-0.5">Abilita Menu Header</div>
                        <div className="text-[9px] text-slate-500">Mostra menu di accesso rapido sotto la tagline</div>
                    </div>
                    <button
                        onClick={() => onUpdate({
                            ...config,
                            header: {
                                ...config.header,
                                showNotifications: config.header?.showNotifications ?? true,
                                showSupport: config.header?.showSupport ?? true,
                                enableUniversalMenu: !config.header?.enableUniversalMenu
                            }
                        })}
                        className={`w-8 h-4 rounded-full relative transition-colors ${config.header?.enableUniversalMenu ? 'bg-indigo-500' : 'bg-slate-600'}`}
                    >
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${config.header?.enableUniversalMenu ? 'left-[calc(100%-14px)]' : 'left-0.5'}`} />
                    </button>
                </div>

                {config.header?.enableUniversalMenu && (
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                        <div className="text-[10px] text-slate-400 font-medium mb-3">
                            Seleziona gli elementi da mostrare nel menu universale:
                            {(!config.header?.universalMenuItems || config.header.universalMenuItems.length === 0) && (
                                <span className="block mt-1 text-amber-400 text-[9px]">
                                    ⚠️ Seleziona almeno un elemento per vedere il menu nell'header
                                </span>
                            )}
                        </div>

                        {/* Navigation Items */}
                        <div className="space-y-2">
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Navigation</div>
                            <div className="grid grid-cols-2 gap-2">
                                {config.navigation.filter(item => item.enabled).map(item => {
                                    const itemId = `nav:${item.id}`;
                                    const isSelected = config.header?.universalMenuItems?.includes(itemId) ?? false;
                                    return (
                                        <button
                                            key={itemId}
                                            onClick={() => {
                                                const current = config.header?.universalMenuItems || [];
                                                const updated = isSelected
                                                    ? current.filter(id => id !== itemId)
                                                    : [...current, itemId];
                                                onUpdate({
                                                    ...config,
                                                    header: {
                                                        ...config.header,
                                                        showNotifications: config.header?.showNotifications ?? true,
                                                        showSupport: config.header?.showSupport ?? true,
                                                        enableUniversalMenu: true,
                                                        universalMenuItems: updated
                                                    }
                                                });
                                            }}
                                            className={`p-2.5 rounded-xl text-[10px] font-bold transition-all border ${isSelected
                                                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Features</div>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.values(featureFlags).filter(feature => feature.enabled).map(feature => {
                                    const itemId = `feature:${feature.id}`;
                                    const isSelected = config.header?.universalMenuItems?.includes(itemId) ?? false;
                                    return (
                                        <button
                                            key={itemId}
                                            onClick={() => {
                                                const current = config.header?.universalMenuItems || [];
                                                const updated = isSelected
                                                    ? current.filter(id => id !== itemId)
                                                    : [...current, itemId];
                                                onUpdate({
                                                    ...config,
                                                    header: {
                                                        ...config.header,
                                                        showNotifications: config.header?.showNotifications ?? true,
                                                        showSupport: config.header?.showSupport ?? true,
                                                        enableUniversalMenu: true,
                                                        universalMenuItems: updated
                                                    }
                                                });
                                            }}
                                            className={`p-2.5 rounded-xl text-[10px] font-bold transition-all border flex flex-col items-start ${isSelected
                                                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }`}
                                        >
                                            <span>{feature.label}</span>
                                            <span className={`text-[8px] mt-0.5 ${feature.minTier === 'FREE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {feature.minTier}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <div className="h-px bg-slate-800" />

            {/* Header Styling */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={12} />
                    Header Styling
                </h3>

                <div className="space-y-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                    <div className="text-[10px] text-slate-400 font-medium mb-2">Personalizza il background dell'header</div>

                    {/* Gradient Colors */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="header-gradient-start" className="text-[10px] text-slate-400 font-medium mb-1.5 block">Gradient Start</label>
                            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1.5 border border-slate-700">
                                <div className="relative w-5 h-5 rounded overflow-hidden shadow-sm shrink-0">
                                    <input
                                        id="header-gradient-start"
                                        type="color"
                                        value={config.header?.customGradientStart || ''}
                                        onChange={e => onUpdate({
                                            ...config,
                                            header: {
                                                ...config.header,
                                                showNotifications: config.header?.showNotifications ?? true,
                                                showSupport: config.header?.showSupport ?? true,
                                                customGradientStart: e.target.value
                                            }
                                        })}
                                        className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={config.header?.customGradientStart || ''}
                                    onChange={e => onUpdate({
                                        ...config,
                                        header: {
                                            ...config.header,
                                            showNotifications: config.header?.showNotifications ?? true,
                                            showSupport: config.header?.showSupport ?? true,
                                            customGradientStart: e.target.value
                                        }
                                    })}
                                    placeholder="Auto (Team Color)"
                                    className="flex-1 bg-transparent text-[9px] text-slate-300 font-mono outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="header-gradient-end" className="text-[10px] text-slate-400 font-medium mb-1.5 block">Gradient End</label>
                            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1.5 border border-slate-700">
                                <div className="relative w-5 h-5 rounded overflow-hidden shadow-sm shrink-0">
                                    <input
                                        id="header-gradient-end"
                                        type="color"
                                        value={config.header?.customGradientEnd || ''}
                                        onChange={e => onUpdate({
                                            ...config,
                                            header: {
                                                ...config.header,
                                                showNotifications: config.header?.showNotifications ?? true,
                                                showSupport: config.header?.showSupport ?? true,
                                                customGradientEnd: e.target.value
                                            }
                                        })}
                                        className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={config.header?.customGradientEnd || ''}
                                    onChange={e => onUpdate({
                                        ...config,
                                        header: {
                                            ...config.header,
                                            showNotifications: config.header?.showNotifications ?? true,
                                            showSupport: config.header?.showSupport ?? true,
                                            customGradientEnd: e.target.value
                                        }
                                    })}
                                    placeholder="Auto (Secondary)"
                                    className="flex-1 bg-transparent text-[9px] text-slate-300 font-mono outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Background Image */}
                    <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1.5 block">Background Image</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            onUpdate((prev: any) => ({
                                                ...prev,
                                                header: {
                                                    ...(prev.header || {}),
                                                    backgroundImage: reader.result as string
                                                }
                                            }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="hidden"
                                id="header-bg-upload"
                            />
                            <label
                                htmlFor="header-bg-upload"
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-[10px] text-slate-300 hover:border-slate-600 cursor-pointer transition-colors"
                            >
                                <Upload size={14} />
                                {config.header?.backgroundImage ? 'Cambia Immagine' : 'Carica Immagine'}
                            </label>
                            {config.header?.backgroundImage && (
                                <button
                                    onClick={() => onUpdate({
                                        ...config,
                                        header: {
                                            ...config.header,
                                            showNotifications: config.header?.showNotifications ?? true,
                                            showSupport: config.header?.showSupport ?? true,
                                            backgroundImage: undefined
                                        }
                                    })}
                                    className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Navigation System */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Grid size={12} />
                    Navigation System
                </h3>

                <div className="space-y-3">
                    {/* Navigation Type Toggle */}
                    <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-700/50 mb-6">
                        <button
                            onClick={() => onUpdate({ ...config, navigationType: 'tabbar' })}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${config.navigationType !== 'burger' ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                        >
                            Tab Bar
                        </button>
                        <button
                            onClick={() => onUpdate({ ...config, navigationType: 'burger' })}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${config.navigationType === 'burger' ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                        >
                            Burger Menu
                        </button>
                    </div>

                    {/* Tab Bar Specific Settings */}
                    {config.navigationType !== 'burger' && (
                        <>
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 block">Tab Bar Style</label>
                            <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700/50 mb-6">
                                {[
                                    { id: 'classic', label: 'Classic' },
                                    { id: 'modern', label: 'Floating' },
                                    { id: 'liquid', label: 'Liquid' }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => onUpdate({ ...config, navStyle: opt.id as ThemeConfig['navStyle'] })}
                                        className={`py-2 text-[10px] font-bold rounded-lg transition-all ${config.navStyle === opt.id
                                            ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/5'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Bar Typography & Spacing */}
                            <div className="space-y-4 mb-4">
                                {/* Team Color Toggle */}
                                <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-300">Usa Colori Team</span>
                                        <span className="text-[9px] text-slate-500">Sincronizza stato attivo con il brand</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const currentValue = config.tabBarStyling?.useTeamColorForActive ?? true;
                                            onUpdate({
                                                ...config,
                                                tabBarStyling: {
                                                    ...config.tabBarStyling,
                                                    useTeamColorForActive: !currentValue
                                                }
                                            });
                                        }}
                                        className={`w-8 h-4 rounded-full relative transition-colors ${(config.tabBarStyling?.useTeamColorForActive ?? true) ? 'bg-indigo-500' : 'bg-slate-600'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${(config.tabBarStyling?.useTeamColorForActive ?? true) ? 'left-[calc(100%-14px)]' : 'left-0.5'}`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="tabbar-inactive-color" className="text-[10px] text-slate-400 font-medium mb-1.5 block">Inactive Color</label>
                                        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1.5 border border-slate-700">
                                            <div className="relative w-5 h-5 rounded overflow-hidden shadow-sm shrink-0">
                                                <input
                                                    id="tabbar-inactive-color"
                                                    type="color"
                                                    value={config.tabBarStyling?.labelColor || '#94a3b8'}
                                                    onChange={e => onUpdate({ ...config, tabBarStyling: { ...config.tabBarStyling, labelColor: e.target.value } })}
                                                    className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                                                />
                                            </div>
                                            <input
                                                id="tabbar-inactive-color-hex"
                                                type="text"
                                                value={config.tabBarStyling?.labelColor || '#94a3b8'}
                                                onChange={e => onUpdate({ ...config, tabBarStyling: { ...config.tabBarStyling, labelColor: e.target.value } })}
                                                className="bg-transparent text-[10px] text-slate-300 outline-none w-full font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className={(config.tabBarStyling?.useTeamColorForActive ?? true) ? 'opacity-50 pointer-events-none' : ''}>
                                        <label htmlFor="tabbar-active-color" className="text-[10px] text-slate-400 font-medium mb-1.5 block">Active Color (Override)</label>
                                        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1.5 border border-slate-700">
                                            <div className="relative w-5 h-5 rounded overflow-hidden shadow-sm shrink-0">
                                                <input
                                                    id="tabbar-active-color"
                                                    type="color"
                                                    value={config.tabBarStyling?.labelActiveColor || '#ffffff'}
                                                    onChange={e => onUpdate({ ...config, tabBarStyling: { ...config.tabBarStyling, labelActiveColor: e.target.value } })}
                                                    className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                                                />
                                            </div>
                                            <input
                                                id="tabbar-active-color-hex"
                                                type="text"
                                                value={config.tabBarStyling?.labelActiveColor || '#ffffff'}
                                                onChange={e => onUpdate({ ...config, tabBarStyling: { ...config.tabBarStyling, labelActiveColor: e.target.value } })}
                                                className="bg-transparent text-[10px] text-slate-300 outline-none w-full font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="tabbar-icon-spacing" className="text-[10px] text-slate-400 font-medium mb-1.5 block">Icon Spacing</label>
                                    <select
                                        id="tabbar-icon-spacing"
                                        value={config.tabBarStyling?.iconSpacing || '0px'}
                                        onChange={(e) => onUpdate({ ...config, tabBarStyling: { ...config.tabBarStyling, iconSpacing: e.target.value } })}
                                        className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2 py-2 outline-none"
                                    >
                                        <option value="0px">Tight (0px)</option>
                                        <option value="2px">Compact (2px)</option>
                                        <option value="3px">Normal (3px)</option>
                                        <option value="4px">Wide (4px)</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Burger Menu Specific Settings */}
                    {config.navigationType === 'burger' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Menu Style</label>
                                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700/50">
                                    {[
                                        { id: 'sidebar', label: 'Sidebar' },
                                        { id: 'fullscreen', label: 'Full' },
                                        { id: 'minimal', label: 'Pop' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => onUpdate({
                                                ...config,
                                                burgerMenuStyling: {
                                                    ...(config.burgerMenuStyling || { animation: 'slide' }),
                                                    style: opt.id as any
                                                }
                                            })}
                                            className={`py-2 text-[10px] font-bold rounded-lg transition-all ${((config.burgerMenuStyling?.style || 'sidebar') === opt.id)
                                                ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/5'
                                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Animation Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'slide', label: 'Slide Elastic' },
                                        { id: 'scale', label: 'Scale Bounce' },
                                        { id: 'fade', label: 'Soft Fade' },
                                        { id: 'liquid', label: 'Liquid Flow' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => onUpdate({
                                                ...config,
                                                burgerMenuStyling: {
                                                    ...(config.burgerMenuStyling || { style: 'sidebar' }),
                                                    animation: opt.id as any
                                                }
                                            })}
                                            className={`py-2 px-3 text-[10px] font-bold rounded-xl border transition-all ${((config.burgerMenuStyling?.animation || 'slide') === opt.id)
                                                ? 'bg-white/10 border-white/20 text-white'
                                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="burger-bg-color" className="text-[10px] text-slate-400 font-medium mb-1.5 block">Background</label>
                                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1.5 border border-slate-700">
                                        <div className="relative w-5 h-5 rounded overflow-hidden shadow-sm shrink-0">
                                            <input
                                                id="burger-bg-color"
                                                type="color"
                                                value={config.burgerMenuStyling?.backgroundColor || '#0f172a'}
                                                onChange={e => onUpdate({
                                                    ...config,
                                                    burgerMenuStyling: { ...config.burgerMenuStyling!, backgroundColor: e.target.value }
                                                })}
                                                className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                                            />
                                        </div>
                                        <input
                                            id="burger-bg-color-hex"
                                            type="text"
                                            value={config.burgerMenuStyling?.backgroundColor || '#0f172a'}
                                            onChange={e => onUpdate({
                                                ...config,
                                                burgerMenuStyling: { ...config.burgerMenuStyling!, backgroundColor: e.target.value }
                                            })}
                                            className="bg-transparent text-[10px] text-slate-300 outline-none w-full font-mono uppercase"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="burger-accent-color" className="text-[10px] text-slate-400 font-medium mb-1.5 block">Accent Color</label>
                                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1.5 border border-slate-700">
                                        <div className="relative w-5 h-5 rounded overflow-hidden shadow-sm shrink-0">
                                            <input
                                                id="burger-accent-color"
                                                type="color"
                                                value={config.burgerMenuStyling?.accentColor || '#6366f1'}
                                                onChange={e => onUpdate({
                                                    ...config,
                                                    burgerMenuStyling: { ...config.burgerMenuStyling!, accentColor: e.target.value }
                                                })}
                                                className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                                            />
                                        </div>
                                        <input
                                            id="burger-accent-color-hex"
                                            type="text"
                                            value={config.burgerMenuStyling?.accentColor || '#6366f1'}
                                            onChange={e => onUpdate({
                                                ...config,
                                                burgerMenuStyling: { ...config.burgerMenuStyling!, accentColor: e.target.value }
                                            })}
                                            className="bg-transparent text-[10px] text-slate-300 outline-none w-full font-mono uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="h-px bg-slate-800 my-4" />

                    {/* Header Customization */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Moon size={12} />
                            Custom Header
                        </h3>
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            <button
                                onClick={() => onUpdate({ ...config, header: { ...config.header, showNotifications: !config.header?.showNotifications, showSupport: config.header?.showSupport || false } })}
                                className={`p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-3 ${config.header?.showNotifications
                                    ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${config.header?.showNotifications ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                                    <span className="text-[10px] font-bold">🔔</span>
                                </div>
                                Notifications
                            </button>
                            <button
                                onClick={() => onUpdate({ ...config, header: { ...config.header, showSupport: !config.header?.showSupport, showNotifications: config.header?.showNotifications || false } })}
                                className={`p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-3 ${config.header?.showSupport
                                    ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${config.header?.showSupport ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                                    <span className="text-[10px] font-bold">💬</span>
                                </div>
                                Support Chat
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Menu Items</label>
                        <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(config.navigation || []).filter(n => n.enabled).length > 5 ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                {(config.navigation || []).filter(n => n.enabled).length}/5 Attivi
                            </span>
                            <button
                                onClick={() => {
                                    onUpdate((prev: any) => ({
                                        ...prev,
                                        navigation: [
                                            { id: 'home', label: 'Home', icon: 'Layout', enabled: true, order: 0 },
                                            { id: 'events', label: 'Events', icon: 'Calendar', enabled: true, order: 1 },
                                            { id: 'roster', label: 'Roster', icon: 'Users', enabled: true, order: 2 },
                                            { id: 'shop', label: 'Shop', icon: 'ShoppingBag', enabled: true, order: 3 },
                                            { id: 'menu', label: 'Menu', icon: 'Menu', enabled: true, order: 4 },
                                        ]
                                    }));
                                }}
                                className="text-[10px] text-slate-500 hover:text-indigo-400 transition-colors uppercase font-bold"
                            >
                                Ripristina Defaults
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {(config.navigation || [])
                            .sort((a, b) => a.order - b.order)
                            .map((item, index) => (
                                <div key={item.id} className="group relative flex items-center justify-between p-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id={`nav-item-toggle-${item.id}`}
                                            type="checkbox"
                                            checked={item.enabled}
                                            onChange={(e) => {
                                                const activeCount = config.navigation.filter(n => n.enabled).length;
                                                if (e.target.checked && activeCount >= 5) {
                                                    alert("Puoi avere al massimo 5 elementi attivi nella barra di navigazione.");
                                                    return;
                                                }
                                                onUpdate((prev: any) => ({
                                                    ...prev,
                                                    navigation: (prev.navigation || []).map((n: any) =>
                                                        n.id === item.id ? { ...n, enabled: e.target.checked } : n
                                                    )
                                                }));
                                            }}
                                            className="rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-offset-slate-800"
                                        />
                                        <label htmlFor={`nav-item-toggle-${item.id}`} className="text-xs text-slate-300 font-medium cursor-pointer">{item.label}</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Icon Upload Button */}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id={`icon-upload-${item.id}`}
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            onUpdate((prev: any) => ({
                                                                ...prev,
                                                                navigation: (prev.navigation || []).map((n: any) =>
                                                                    n.id === item.id ? { ...n, customIconUrl: reader.result as string } : n
                                                                )
                                                            }));
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={`icon-upload-${item.id}`}
                                                className="cursor-pointer p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1.5"
                                                title="Upload custom icon"
                                            >
                                                {item.customIconUrl ? (
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                ) : (
                                                    <Upload size={10} />
                                                )}
                                            </label>
                                            {item.customIconUrl && (
                                                <button
                                                    onClick={() => {
                                                        const newNav = config.navigation.map(n =>
                                                            n.id === item.id ? { ...n, customIconUrl: undefined } : n
                                                        );
                                                        onUpdate({ ...config, navigation: newNav });
                                                    }}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                                >
                                                    <X size={8} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                disabled={index === 0}
                                                onClick={() => {
                                                    const newNav = [...config.navigation];
                                                    const currentIdx = newNav.findIndex(n => n.id === item.id);
                                                    if (currentIdx > 0) {
                                                        const temp = newNav[currentIdx].order;
                                                        newNav[currentIdx].order = newNav[currentIdx - 1].order;
                                                        newNav[currentIdx - 1].order = temp;
                                                        onUpdate({ ...config, navigation: newNav });
                                                    }
                                                }}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                disabled={index === config.navigation.length - 1}
                                                onClick={() => {
                                                    const newNav = [...config.navigation];
                                                    const currentIdx = newNav.findIndex(n => n.id === item.id);
                                                    if (currentIdx < newNav.length - 1) {
                                                        const temp = newNav[currentIdx].order;
                                                        newNav[currentIdx].order = newNav[currentIdx + 1].order;
                                                        newNav[currentIdx + 1].order = temp;
                                                        onUpdate({ ...config, navigation: newNav });
                                                    }
                                                }}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                                            >
                                                ↓
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

            </section >

        </div >
    );
};
