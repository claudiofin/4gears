import React from 'react';
import { motion } from 'framer-motion';
import { ThemeConfig } from '@/types/builder';
import { Selectable } from '../builder/VisualInspector';
import { ComponentMetadata } from '@/types/inspector';
import { getDesignTokens } from '@/styles/design-system';

interface PremiumCardProps {
    children: React.ReactNode;
    themeConfig: ThemeConfig;
    isDarkMode?: boolean;
    variant?: 'minimal' | 'bordered' | 'glass' | 'solid';
    onClick?: () => void;
    className?: string;
    // Inspector Props
    id?: string;
    isInspectorActive?: boolean;
    isSelected?: boolean;
    onElementSelect?: (metadata: ComponentMetadata) => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
    children,
    themeConfig,
    isDarkMode = false,
    variant = 'minimal', // Default to minimal if not overridden
    onClick,
    className = "",
    id,
    isInspectorActive,
    isSelected,
    onElementSelect
}) => {
    // 1. Get Overrides
    const override = id && themeConfig.componentOverrides ? themeConfig.componentOverrides[id] : undefined;

    // 2. Visibility Check
    if (override?.visible === false) return null;

    // Determine effective variant from themeConfig if 'minimal' (default) is passed, 
    // OR allow explicit override via prop.
    const effectiveVariant = themeConfig.cardStyle;

    // Base styles
    const radiusClass = themeConfig.borderRadius === 'full' ? 'rounded-3xl' :
        themeConfig.borderRadius === 'none' ? 'rounded-none' :
            themeConfig.borderRadius === 'sm' ? 'rounded-sm' :
                themeConfig.borderRadius === 'md' ? 'rounded-md' :
                    'rounded-xl'; // Default

    const isInteractive = !!onClick;

    // Variant Styles
    const getVariantStyles = () => {
        const base = "transition-all duration-300 relative overflow-hidden";

        // Dark Mode Logic
        const defaultBg = isDarkMode
            ? effectiveVariant === 'glass' ? 'bg-slate-900/40'
                : effectiveVariant === 'bordered' ? 'bg-slate-900'
                    : 'bg-slate-800'
            : effectiveVariant === 'glass' ? 'bg-white/60'
                : 'bg-white';
        // Override Background if present
        const bg = override?.backgroundColor ? '' : defaultBg;

        const defaultBorder = isDarkMode
            ? effectiveVariant === 'glass' ? 'border-white/10'
                : effectiveVariant === 'bordered' ? 'border-slate-700'
                    : 'border-slate-800' // Minimal has subtle border in dark mode
            : effectiveVariant === 'glass' ? 'border-white/40'
                : effectiveVariant === 'bordered' ? 'border-slate-200'
                    : 'border-slate-100'; // Minimal has subtle border in light mode
        // Override Border if present
        const border = override?.borderColor ? '' : defaultBorder;

        // Glass Blur
        const backdrop = effectiveVariant === 'glass' ? 'backdrop-blur-md' : '';

        // Shadow
        const shadow = effectiveVariant === 'minimal' ? 'shadow-sm hover:shadow-md'
            : effectiveVariant === 'glass' ? 'shadow-lg hover:shadow-xl'
                : 'shadow-sm';

        return `${base} ${bg} border ${border} ${backdrop} ${shadow}`;
    };

    // Custom Style Object for Overrides
    const customStyle: React.CSSProperties = {};
    if (override?.backgroundColor) customStyle.backgroundColor = override.backgroundColor;
    if (override?.borderColor) {
        customStyle.borderColor = override.borderColor;
        customStyle.borderWidth = '2px';
        customStyle.borderStyle = 'solid';
    }

    return (
        <Selectable
            id={id || 'card'}
            type="card"
            label={id?.replace(/_/g, ' ') || 'Card Container'}
            isInspectorActive={isInspectorActive ?? false}
            isSelected={isSelected ?? false}
            onSelect={onElementSelect || (() => { })}
            className="block h-full"
            overrides={override}
        >
            <motion.div
                whileHover={isInteractive ? { y: -2, scale: 1.01 } : {}}
                whileTap={isInteractive ? { scale: 0.98 } : {}}
                onClick={onClick}
                className={`${getVariantStyles()} ${radiusClass} ${isInteractive ? 'cursor-pointer' : ''} h-full ${className}`}
                style={customStyle}
            >
                {/* Optional: Add a subtle gradient overlay for "Premium" feel if Glass */}
                {effectiveVariant === 'glass' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                )}

                {children}
            </motion.div>
        </Selectable>
    );
};
