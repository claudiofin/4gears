import React from 'react';
import { InteractiveScreenProps } from './types';
import { Shield, Lock, Smartphone } from 'lucide-react';

export const LoginScreen: React.FC<InteractiveScreenProps & { deviceType?: string; onViewModeChange?: (mode: any) => void }> = ({
    themeConfig,
    isDarkMode,
    currentTeam,
    setPreviewPage,
    onViewModeChange,
    deviceType,
    sportConfig
}) => {
    const login = themeConfig?.login || {
        viewType: 'modern_card',
        heroStyle: 'logo',
        socialProviders: { google: true, apple: true, facebook: false, email: true },
        formStyle: {
            inputRadius: '12px',
            buttonRadius: '12px',
            inputBackground: 'white',
            shadowLevel: 'soft'
        },
        texts: {
            actionButtonText: 'ACCEDI',
            welcomeTitle: '',
            welcomeSubtitle: '',
            forgotPasswordText: ''
        }
    };

    const primaryColor = currentTeam.colors?.primary || '#4f46e5';

    // ViewType styling
    const isSplitScreen = login.viewType === 'split_screen';
    const isModernCard = login.viewType === 'modern_card';
    const isClassic = login.viewType === 'classic';

    const containerBg = isClassic ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-950';
    const formCardClass = isModernCard ? 'bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8' : '';

    return (
        <div className={`h-full w-full flex ${isSplitScreen ? 'flex-row' : 'flex-col'} overflow-hidden ${containerBg} `}>
            {/* Split Screen Left Panel (Hero) */}
            {isSplitScreen && (
                <div
                    className="w-2/5 flex flex-col items-center justify-center p-12 relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${currentTeam.colors?.secondary || '#06b6d4'})`
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
                    }} />

                    <div className="relative z-10 text-center space-y-8">
                        <div className="w-28 h-28 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl flex items-center justify-center mx-auto p-0 overflow-hidden ring-1 ring-white/20">
                            <img
                                src={currentTeam.branding?.appIcon || currentTeam.logo || sportConfig.heroImage}
                                className="w-full h-full object-cover"
                                alt="App Logo"
                            />
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                                {currentTeam.name}
                            </h1>
                            <p className="text-white/90 text-base font-semibold tracking-wide">
                                La tua passione, ovunque.
                            </p>
                        </div>

                        <div className="pt-8 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                                <span className="font-medium">Accesso sicuro</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                                <span className="font-medium">Sempre aggiornato</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Container */}
            <div className={`${isSplitScreen ? 'w-3/5' : 'w-full'} flex flex-col p-6 overflow-y-auto`}>
                {/* Hero /Logo Area (non-split) */}
                {!isSplitScreen && (
                    <div className="mt-8 mb-8 text-center flex-shrink-0">
                        {(login.heroStyle === 'logo' || login.heroStyle === 'none') && (
                            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 p-0 overflow-hidden">
                                <img src={currentTeam.branding?.appIcon || currentTeam.logo || sportConfig.heroImage} className="w-full h-full object-cover" alt="App Logo" />
                            </div>
                        )}
                        {login.heroStyle === 'image' && login.heroImageUrl && (
                            <div className="w-full h-40 rounded-2xl bg-cover bg-center mb-6 shadow-lg" style={{ backgroundImage: `url(${login.heroImageUrl})` }} />
                        )}

                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            {login.texts?.welcomeTitle || `Benvenuto in ${currentTeam.name} `}
                        </h2>
                        <p className="text-slate-500 text-sm mt-2">{login.texts?.welcomeSubtitle || 'Accedi per gestire il tuo profilo'}</p>
                    </div>
                )}

                {/* Form Area */}
                <div className={`w-full space-y-4 max-w-sm mx-auto ${formCardClass} `}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Email</label>
                        <input
                            type="email"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            style={{ borderRadius: login.formStyle?.inputRadius || '12px' }}
                            placeholder="mario.rossi@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-slate-100 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            style={{ borderRadius: login.formStyle?.inputRadius || '12px' }}
                            placeholder="••••••••"
                        />
                        <div className="text-right">
                            <span className="text-xs font-bold text-indigo-500 cursor-pointer">{login.texts?.forgotPasswordText || 'Password dimenticata?'}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setPreviewPage('home');
                            if (onViewModeChange) {
                                onViewModeChange('USER');
                            }
                        }}
                        className="w-full py-4 font-bold text-white shadow-lg shadow-indigo-500/30 mt-4 transition-transform active:scale-95 text-sm"
                        style={{
                            backgroundColor: primaryColor,
                            borderRadius: login.formStyle?.buttonRadius || '12px'
                        }}
                    >
                        {login.texts?.actionButtonText || 'ACCEDI'}
                    </button>

                    <button
                        className={`w-full py-3.5 font-bold border mt-2 transition-transform active:scale-95 text-sm ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} `}
                        style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                    >
                        CREA UN ACCOUNT
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-400">
                        Continuando accetti i <span className="underline cursor-pointer">Termini di Servizio</span>
                    </p>
                </div>

                <div className="w-full space-y-3 mt-6">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">Oppure</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    </div>

                    {login.socialProviders?.google && (
                        <button
                            className="w-full py-3 border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2"
                            style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continua con Google
                        </button>
                    )}

                    {login.socialProviders?.apple && (deviceType === 'IPHONE') && (
                        <button
                            className="w-full py-3 bg-black text-white font-bold hover:bg-gray-900 transition-colors text-sm flex items-center justify-center gap-2"
                            style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                        >
                            <img src="https://www.svgrepo.com/show/508757/apple.svg" className="w-5 h-5 invert" alt="Apple" />
                            Continua con Apple
                        </button>
                    )}
                    {login.socialProviders?.facebook && (
                        <button
                            className="w-full py-3 bg-[#1877F2] text-white font-bold hover:bg-[#155fc4] transition-colors text-sm flex items-center justify-center gap-2"
                            style={{ borderRadius: login.formStyle?.buttonRadius || '12px' }}
                        >
                            <span className="font-bold">f</span>
                            Continua con Facebook
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
