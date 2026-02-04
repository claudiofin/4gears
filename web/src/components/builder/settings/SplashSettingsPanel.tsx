import React from 'react';
import { ThemeConfig, SplashConfig } from '@/types/builder';
import { SliderControl } from '@/components/inspector/controls/SliderControl';
import { SelectControl } from '@/components/inspector/controls/SelectControl';
import { ToggleControl } from '@/components/inspector/controls/ToggleControl';
import { ColorControl } from '@/components/inspector/controls/ColorControl';
import { ImageUploadControl } from '@/components/inspector/controls/ImageUploadControl';

interface SplashSettingsPanelProps {
    config: ThemeConfig;
    onUpdate: (config: ThemeConfig) => void;
}

const DEFAULT_SPLASH: SplashConfig = {
    style: 'branded',
    backgroundType: 'gradient',
    logoSize: 'medium',
    animationType: 'fade',
    showLoader: true,
    loaderStyle: 'spinner',
    poweredByVisible: true
};

export const SplashSettingsPanel: React.FC<SplashSettingsPanelProps> = ({ config, onUpdate }) => {
    const splash = config.splash || DEFAULT_SPLASH;

    const updateSplash = (key: keyof SplashConfig, value: any) => {
        onUpdate({
            ...config,
            splash: {
                ...splash,
                [key]: value
            }
        });
    };

    return (
        <div className="space-y-6 p-1">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Background</h3>

                <SelectControl
                    id="splash-bg-type"
                    label="Type"
                    value={splash.backgroundType || 'gradient'}
                    options={[
                        { label: 'Gradient', value: 'gradient' },
                        { label: 'Solid Color', value: 'solid' },
                        { label: 'Image', value: 'image' }
                    ]}
                    onChange={(val) => updateSplash('backgroundType', val)}
                />

                {splash.backgroundType === 'solid' && (
                    <ColorControl
                        id="splash-bg-color"
                        label="Color"
                        value={splash.backgroundColor || '#ffffff'}
                        onChange={(val) => updateSplash('backgroundColor', val)}
                    />
                )}

                {splash.backgroundType === 'gradient' && (
                    <div className="grid grid-cols-2 gap-2">
                        <ColorControl
                            id="splash-grad-start"
                            label="Start"
                            value={splash.gradientStart || '#4f46e5'}
                            onChange={(val) => updateSplash('gradientStart', val)}
                        />
                        <ColorControl
                            id="splash-grad-end"
                            label="End"
                            value={splash.gradientEnd || '#06b6d4'}
                            onChange={(val) => updateSplash('gradientEnd', val)}
                        />
                    </div>
                )}

                {splash.backgroundType === 'image' && (
                    <ImageUploadControl
                        label="Background Image"
                        value={splash.backgroundImage}
                        onChange={(url) => updateSplash('backgroundImage', url || '')}
                    />
                )}
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logo & Animation</h3>

                <SelectControl
                    id="splash-logo-size"
                    label="Logo Size"
                    value={splash.logoSize || 'medium'}
                    options={[
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                        { label: 'Huge', value: 'huge' }
                    ]}
                    onChange={(val) => updateSplash('logoSize', val)}
                />

                <SelectControl
                    id="splash-anim-type"
                    label="Animation"
                    value={splash.animationType || 'fade'}
                    options={[
                        { label: 'Fade In', value: 'fade' },
                        { label: 'Zoom', value: 'zoom' },
                        { label: 'Bounce', value: 'bounce' },
                        { label: 'Slide Up', value: 'slide_up' },
                        { label: 'None', value: 'none' }
                    ]}
                    onChange={(val) => updateSplash('animationType', val)}
                />
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loader</h3>

                <ToggleControl
                    id="splash-show-loader"
                    label="Show Loader"
                    value={splash.showLoader ?? true}
                    onChange={(val) => updateSplash('showLoader', val)}
                />

                {(splash.showLoader ?? true) && (
                    <SelectControl
                        id="splash-loader-style"
                        label="Style"
                        value={splash.loaderStyle || 'spinner'}
                        options={[
                            { label: 'Spinner', value: 'spinner' },
                            { label: 'Dots', value: 'dots' },
                            { label: 'Lines', value: 'lines' }
                        ]}
                        onChange={(val) => updateSplash('loaderStyle', val)}
                    />
                )}
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Footer</h3>
                <ToggleControl
                    id="splash-powered-by"
                    label="Show 'Powered By'"
                    value={splash.poweredByVisible ?? true}
                    onChange={(val) => updateSplash('poweredByVisible', val)}
                />
            </div>
        </div>
    );
};
