import React from 'react';
import { ThemeConfig, LoginConfig } from '@/types/builder';
import { SliderControl } from '@/components/inspector/controls/SliderControl';
import { SelectControl } from '@/components/inspector/controls/SelectControl';
import { ToggleControl } from '@/components/inspector/controls/ToggleControl';
import { TextControl } from '@/components/inspector/controls/TextControl';

interface LoginSettingsPanelProps {
    config: ThemeConfig;
    onUpdate: (config: ThemeConfig) => void;
}

const DEFAULT_LOGIN: LoginConfig = {
    viewType: 'modern_card',
    heroStyle: 'logo',
    socialProviders: {
        google: true,
        apple: true,
        facebook: false,
        email: true
    },
    formStyle: {
        inputRadius: '12px',
        buttonRadius: '12px',
        inputBackground: 'white',
        shadowLevel: 'soft'
    },
    texts: {
        actionButtonText: 'ACCEDI'
    }
};

export const LoginSettingsPanel: React.FC<LoginSettingsPanelProps> = ({ config, onUpdate }) => {
    const login = config.login || DEFAULT_LOGIN;

    const updateLogin = (key: keyof LoginConfig, value: any) => {
        onUpdate({
            ...config,
            login: {
                ...login,
                [key]: value
            }
        });
    };

    const updateNested = (section: keyof LoginConfig, key: string, value: any) => {
        onUpdate({
            ...config,
            login: {
                ...login,
                [section]: {
                    ...(login[section] as object),
                    [key]: value
                }
            }
        });
    };

    return (
        <div className="space-y-6 p-1">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Layout</h3>

                <SelectControl
                    id="login-view-type"
                    label="View Style"
                    value={login.viewType || 'modern_card'}
                    options={[
                        { label: 'Modern Card', value: 'modern_card' },
                        { label: 'Classic', value: 'classic' },
                        { label: 'Split Screen', value: 'split_screen' }
                    ]}
                    onChange={(val) => updateLogin('viewType', val)}
                />

                <SelectControl
                    id="login-hero-style"
                    label="Hero Element"
                    value={login.heroStyle || 'logo'}
                    options={[
                        { label: 'App Logo', value: 'logo' },
                        { label: 'Illustration', value: 'illustration' },
                        { label: 'Image', value: 'image' },
                        { label: 'None', value: 'none' }
                    ]}
                    onChange={(val) => updateLogin('heroStyle', val)}
                />
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Social Providers</h3>

                <ToggleControl
                    id="login-google"
                    label="Google Login"
                    value={login.socialProviders?.google ?? true}
                    onChange={(val) => updateNested('socialProviders', 'google', val)}
                />
                <ToggleControl
                    id="login-apple"
                    label="Apple Login"
                    value={login.socialProviders?.apple ?? true}
                    onChange={(val) => updateNested('socialProviders', 'apple', val)}
                />
                <ToggleControl
                    id="login-facebook"
                    label="Facebook Login"
                    value={login.socialProviders?.facebook ?? false}
                    onChange={(val) => updateNested('socialProviders', 'facebook', val)}
                />
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Styling</h3>

                <SelectControl
                    id="login-input-radius"
                    label="Input Radius"
                    value={login.formStyle?.inputRadius || '12px'}
                    options={[
                        { label: 'Square', value: '0px' },
                        { label: 'Small', value: '4px' },
                        { label: 'Medium', value: '8px' },
                        { label: 'Large', value: '12px' },
                        { label: 'Pill', value: '24px' }
                    ]}
                    onChange={(val) => updateNested('formStyle', 'inputRadius', val)}
                />

                <SelectControl
                    id="login-btn-radius"
                    label="Button Radius"
                    value={login.formStyle?.buttonRadius || '12px'}
                    options={[
                        { label: 'Square', value: '0px' },
                        { label: 'Small', value: '4px' },
                        { label: 'Medium', value: '8px' },
                        { label: 'Large', value: '12px' },
                        { label: 'Pill', value: '24px' }
                    ]}
                    onChange={(val) => updateNested('formStyle', 'buttonRadius', val)}
                />
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Texts</h3>
                <TextControl
                    id="login-txt-action"
                    label="Action Button"
                    value={login.texts?.actionButtonText || 'ACCEDI'}
                    onChange={(val) => updateNested('texts', 'actionButtonText', val)}
                />
                <TextControl
                    id="login-txt-welcome"
                    label="Welcome Title"
                    value={login.texts?.welcomeTitle || ''}
                    onChange={(val) => updateNested('texts', 'welcomeTitle', val)}
                />
            </div>
        </div>
    );
};
