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

    const getCardClass = (isInteractive: boolean = false) => {
        const base = `transition-all duration-300 ${getRadiusClass()}`;
        const hover = isInteractive ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

        if (themeConfig.cardStyle === 'bordered') {
            return `${base} border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} shadow-sm ${hover}`;
        }
        if (themeConfig.cardStyle === 'glass') {
            return `${base} backdrop-blur-md border ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/60 border-white/40'} shadow-lg ${hover}`;
        }
        // Minimal (Default)
        return `${base} border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} shadow-md ${hover}`;
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
        getSpacingClass,
        getOverride
    };
};
