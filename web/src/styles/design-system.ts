import { ThemeConfig } from '@/types/builder';

export const Colors = {
    light: {
        background: '#f8fafc', // Slate-50
        surface: '#ffffff',
        surfaceHighlight: '#f1f5f9', // Slate-100
        text: '#0f172a', // Slate-900
        textSecondary: '#64748b', // Slate-500
        textTertiary: '#94a3b8', // Slate-400
        border: '#e2e8f0', // Slate-200
        borderHighlight: '#cbd5e1', // Slate-300
        primary: '#22c55e', // Green-500 (Default, overrideable)
        primaryForeground: '#ffffff',
        success: '#10b981', // Emerald-500
        warning: '#f59e0b', // Amber-500
        error: '#ef4444', // Red-500
        info: '#3b82f6', // Blue-500

        // Specialized
        calendarItem: '#ffffff',
        calendarItemActive: '#22c55e', // Match primary
        glass: 'rgba(255, 255, 255, 0.7)',
        glassBorder: 'rgba(255, 255, 255, 0.5)',
    },
    dark: {
        background: '#020617', // Slate-950
        surface: '#0f172a', // Slate-900
        surfaceHighlight: '#1e293b', // Slate-800
        text: '#f8fafc', // Slate-50
        textSecondary: '#94a3b8', // Slate-400
        textTertiary: '#64748b', // Slate-500
        border: '#1e293b', // Slate-800
        borderHighlight: '#334155', // Slate-700
        primary: '#4ade80', // Green-400 (Default)
        primaryForeground: '#020617',
        success: '#34d399', // Emerald-400
        warning: '#fbbf24', // Amber-400
        error: '#f87171', // Red-400
        info: '#60a5fa', // Blue-400

        // Specialized
        calendarItem: '#1e293b',
        calendarItemActive: '#4ade80',
        glass: 'rgba(15, 23, 42, 0.6)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
    }
};

export const Spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
};

export const Radius = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
};

export const Shadows = {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    glow: (color: string) => `0 0 15px ${color}66`, // Dynamic glow
};

export const Typography = {
    h1: { fontSize: '32px', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '24px', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '20px', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '16px', fontWeight: '400', lineHeight: '1.5' },
    caption: { fontSize: '12px', fontWeight: '500', lineHeight: '1.5' },
    button: { fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' },
};

// Helper hook to consume the system with current theme context
export const getDesignTokens = (mode: 'light' | 'dark', themeConfig?: ThemeConfig) => {
    const tokens = {
        colors: { ...Colors[mode] }, // Copy base colors
        radius: { ...Radius },
        spacing: { ...Spacing },
    };

    // Apply ThemeConfig overrides if present
    if (themeConfig) {
        // Radius override
        if (themeConfig.borderRadius) {
            tokens.radius.md = themeConfig.borderRadius; // Map main radius
            // Logic to scale other radii could go here
        }
    }

    return tokens;
};
