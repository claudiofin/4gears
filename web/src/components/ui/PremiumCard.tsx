import React from 'react';
import { ThemeConfig } from '@/types/builder';
import { ComponentMetadata, PropertyTrait } from '@/types/inspector';
import { SmartCard } from '../preview/simulator/SmartElements';

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
    traits?: PropertyTrait[];
    label?: string;
    style?: React.CSSProperties;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
    children,
    themeConfig,
    isDarkMode = false,
    onClick,
    className = "",
    id,
    isInspectorActive,
    isSelected,
    onElementSelect,
    traits,
    label,
    style
}) => {
    // 1. Get Overrides
    const override = id && themeConfig.componentOverrides ? themeConfig.componentOverrides[id] : undefined;

    // 2. Base Styles from Theme
    const effectiveVariant = themeConfig.cardStyle;

    // Radii from theme
    const radiusClass = themeConfig.borderRadius === 'full' ? 'rounded-3xl' :
        themeConfig.borderRadius === 'none' ? 'rounded-none' :
            themeConfig.borderRadius === 'sm' ? 'rounded-md' :
                'rounded-xl';

    // Base classes based on variant
    const getVariantClasses = () => {
        if (effectiveVariant === 'glass') {
            return isDarkMode
                ? 'bg-slate-900/60 border-white/10 backdrop-blur-md shadow-lg shadow-black/20'
                : 'bg-white/60 border-white/40 backdrop-blur-md shadow-lg shadow-slate-200/50';
        }
        if (effectiveVariant === 'bordered') {
            return isDarkMode
                ? 'bg-slate-900 border-slate-700 shadow-sm'
                : 'bg-white border-slate-200 shadow-sm';
        }
        // Minimal (Default)
        return isDarkMode
            ? 'bg-slate-800 border-slate-700 shadow-sm'
            : 'bg-white border-slate-100 shadow-sm';
    };

    return (
        <SmartCard
            id={id || 'card'}
            label={label || id?.replace(/_/g, ' ') || 'Card Container'}
            traits={traits || ['background', 'border', 'spacing', 'glass']}
            isInspectorActive={isInspectorActive ?? false}
            isSelected={isSelected ?? false}
            onSelect={onElementSelect || (() => { })}
            overrides={override}
            onClick={onClick}
            isInteractive={!!onClick}
            style={style}
            className={`border ${getVariantClasses()} ${radiusClass} ${className}`}
        >
            {children}
        </SmartCard>
    );
};
