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
    const isVisible = override?.visible !== false;
    if (!isVisible && !isInspectorActive) return null;

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
        const blurAmount = themeConfig.glassIntensity !== undefined ? `${themeConfig.glassIntensity}px` : '12px'; // Default to 12px if not set
        const backdrop = effectiveVariant === 'glass' ? '' : ''; // We'll apply this via style for dynamic intensity

        // Shadow
        const shadow = effectiveVariant === 'minimal' ? 'shadow-sm hover:shadow-md'
            : effectiveVariant === 'glass' ? 'shadow-lg hover:shadow-xl'
                : 'shadow-sm';

        return `${base} ${bg} border ${border} ${shadow}`;
    };

    // Custom Style Object for Overrides
    const customStyle: React.CSSProperties = {};

    // Apply dynamic glass blur if variant is glass
    if (effectiveVariant === 'glass') {
        const blurAmount = themeConfig.glassIntensity !== undefined ? `${themeConfig.glassIntensity}px` : '12px';
        customStyle.backdropFilter = `blur(${blurAmount})`;
        customStyle.WebkitBackdropFilter = `blur(${blurAmount})`;
    }
    if (override?.backgroundColor) customStyle.backgroundColor = override.backgroundColor;
    if (override?.borderColor) {
        customStyle.borderColor = override.borderColor;
        customStyle.borderWidth = '2px';
        customStyle.borderStyle = 'solid';
    }
    if (override?.opacity !== undefined) customStyle.opacity = override.opacity;
    if (override?.padding) customStyle.padding = override.padding;
    if (override?.margin) customStyle.margin = override.margin;
    if (override?.width) customStyle.width = override.width;
    if (override?.height) customStyle.height = override.height;
    if (override?.borderRadius) customStyle.borderRadius = override.borderRadius === 'rounded-full' ? '9999px' : override.borderRadius === 'rounded-none' ? '0px' : '';

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
            traits={['background', 'border', 'spacing', 'glass']}
        >
            <motion.div
                whileHover={isInteractive ? { y: -2, scale: 1.01 } : {}}
                whileTap={isInteractive ? { scale: 0.98 } : {}}
                onClick={onClick}
                className={`${getVariantStyles()} ${radiusClass} ${isInteractive ? 'cursor-pointer' : ''} h-full ${className} ${override?.backdropBlur || ''} ${!isVisible ? 'opacity-30 grayscale-[0.8] border-dashed' : ''}`}
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
