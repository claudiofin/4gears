import { ThemeConfig, ComponentOverride } from '@/types/builder';

export const useSimulatorStyles = (themeConfig: ThemeConfig, isDarkMode: boolean = false) => {

    const getFontVariable = (fontName?: string) => {
        switch (fontName) {
            case 'Inter': return 'var(--font-inter)';
            case 'Roboto': return 'var(--font-roboto)';
            case 'Open Sans': return 'var(--font-open-sans)';
            case 'Montserrat': return 'var(--font-montserrat)';
            case 'Lato': return 'var(--font-lato)';
            case 'Poppins': return 'var(--font-poppins)';
            case 'Oswald': return 'var(--font-oswald)';
            case 'Raleway': return 'var(--font-raleway)';
            case 'Nunito': return 'var(--font-nunito)';
            case 'Outfit': return 'var(--font-outfit)';
            case 'Playfair Display': return 'var(--font-playfair-display)';
            case 'Merriweather': return 'var(--font-merriweather)';
            case 'Fira Sans': return 'var(--font-fira-sans)';
            case 'Fira Code': return 'var(--font-fira-code)';
            default: return 'var(--font-fira-sans)'; // Default fallback
        }
    };

    const getHeadingFont = () => getFontVariable(themeConfig.fontFamily);
    const getBodyFont = () => getFontVariable(themeConfig.bodyFont || themeConfig.fontFamily);

    const getIconProps = (baseSize: number = 20, className: string = "") => {
        const isFilled = themeConfig.iconStyle === 'filled';
        return {
            size: baseSize,
            className: className,
            fill: isFilled ? "currentColor" : "none",
            strokeWidth: isFilled ? 1.5 : 2,
        };
    };

    const getRadiusClass = (override?: string) => {
        if (override) return override;
        switch (themeConfig.borderRadius) {
            case '0px': return 'rounded-none';
            case '4px': return 'rounded';
            case '8px': return 'rounded-lg';
            case '16px': return 'rounded-2xl';
            case 'full': return 'rounded-3xl';
            default: return 'rounded-xl';
        }
    };

    const getShadowClass = (isInteractive: boolean = false) => {
        const baseShadow = isInteractive ? 'hover:shadow-lg' : '';

        switch (themeConfig.shadowStyle) {
            case 'none': return 'shadow-none';
            case 'crisp': return isDarkMode ? 'shadow-[4px_4px_0px_rgba(255,255,255,0.1)]' : 'shadow-[4px_4px_0px_rgba(0,0,0,0.1)]';
            case 'diffusion': return isDarkMode ? 'shadow-[0_0_25px_rgba(255,255,255,0.05)]' : 'shadow-[0_0_25px_rgba(0,0,0,0.05)]';
            case 'soft':
            default: return isInteractive ? 'shadow-md hover:shadow-xl' : 'shadow-md';
        }
    };

    const getAnimationDuration = () => {
        switch (themeConfig.animationSpeed) {
            case 'slow': return 'duration-700';
            case 'fast': return 'duration-150';
            case 'instant': return 'duration-0';
            case 'normal':
            default: return 'duration-300';
        }
    };

    const getCardClass = (isInteractive: boolean = false) => {
        const duration = getAnimationDuration();
        const shadow = getShadowClass(isInteractive);
        const base = `transition-all ${duration} ${getRadiusClass()}`;
        const hover = isInteractive ? 'hover:-translate-y-1 cursor-pointer' : '';

        if (themeConfig.cardStyle === 'bordered') {
            return `${base} border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} ${shadow} ${hover}`;
        }
        if (themeConfig.cardStyle === 'glass') {
            return `${base} backdrop-blur-md border ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/60 border-white/40'} shadow-lg ${hover}`; // Glass always has some shadow/glow usually
        }
        // Minimal (Default)
        return `${base} border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} ${shadow} ${hover}`;
    };

    const getSpacingClass = () => {
        switch (themeConfig.spacingLevel) {
            case 'compact': return 'space-y-3';
            case 'spacious': return 'space-y-8';
            default: return 'space-y-6';
        }
    };

    const getOverride = (id: string): ComponentOverride => {
        return themeConfig.componentOverrides?.[id] || {};
    };

    return {
        getFontVariable,
        getHeadingFont,
        getBodyFont,
        getIconProps,
        getRadiusClass,
        getCardClass,
        getShadowClass,
        getAnimationDuration,
        getSpacingClass,
        getOverride
    };
};
