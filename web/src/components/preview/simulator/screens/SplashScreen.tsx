import React from 'react';
import { InteractiveScreenProps } from './types';

export const SplashScreen: React.FC<InteractiveScreenProps> = ({
    themeConfig,
    currentTeam,
    sportConfig
}) => {
    const splash = themeConfig?.splash || {
        style: 'minimal',
        backgroundType: 'gradient',
        logoSize: 'medium',
        animationType: 'fade',
        showLoader: true,
        loaderStyle: 'spinner',
        poweredByVisible: true,
        backgroundColor: undefined,
        backgroundImage: undefined,
        gradientStart: undefined,
        gradientEnd: undefined,
        customSubtitle: undefined
    };

    const getBgStyle = () => {
        if (splash.backgroundType === 'solid') return { backgroundColor: splash.backgroundColor || '#ffffff' };
        if (splash.backgroundType === 'image') return { backgroundImage: `url(${splash.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        return { background: `linear-gradient(135deg, ${splash.gradientStart || '#4f46e5'}, ${splash.gradientEnd || '#06b6d4'})` };
    };

    const logoSizeMap = {
        small: 'w-20 h-20',
        medium: 'w-32 h-32',
        large: 'w-48 h-48',
        huge: 'w-64 h-64'
    };

    const animClass = splash.animationType === 'bounce' ? 'animate-bounce'
        : splash.animationType === 'zoom' ? 'animate-ping'
            : splash.animationType === 'fade' ? 'opacity-100'
                : '';

    const logoPosition = currentTeam.branding?.logoPosition || 'center';
    const logoAlignment =
        logoPosition === 'top' ? 'justify-start pt-20' :
            logoPosition === 'bottom' ? 'justify-end pb-20' :
                'justify-center';

    return (
        <div className={`h-full w-full flex flex-col items-center ${logoAlignment} p-8 relative overflow-hidden`} style={getBgStyle()}>
            <div className={`
bg-white rounded-[32px] shadow-2xl flex items-center justify-center p-6 mb-6 mx-auto overflow-hidden
                ${logoSizeMap[splash.logoSize as keyof typeof logoSizeMap] || 'w-32 h-32'}
                ${animClass}
`}>
                <img
                    src={currentTeam.branding?.appIcon || currentTeam.logo || sportConfig.heroImage}
                    alt={currentTeam.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="text-center text-white space-y-2">
                <h1 className="text-3xl font-black tracking-tight">{currentTeam.name}</h1>
                <p className="text-white/80 font-medium uppercase tracking-widest text-xs">
                    {splash.customSubtitle || 'Official App'}
                </p>
            </div>

            {splash.showLoader && (
                <div className="mt-12">
                    {splash.loaderStyle === 'dots' ? (
                        <div className="flex space-x-1"><div className="w-2 h-2 bg-white rounded-full animate-bounce" /><div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75" /><div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" /></div>
                    ) : splash.loaderStyle === 'lines' ? (
                        <div className="flex space-x-1 items-end h-8">
                            <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                            <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                            <div className="w-1 bg-white rounded-full animate-pulse" style={{ height: '80%', animationDelay: '300ms' }} />
                        </div>
                    ) : (
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                </div>
            )}

            {splash.poweredByVisible && (
                <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Powered by 4Gears</p>
                </div>
            )}
        </div>
    );
};
