import React from 'react';
import { Selectable } from '../../builder/VisualInspector';
import { ComponentType, ComponentMetadata, PropertyTrait } from '@/types/inspector';
import { ComponentOverride } from '@/types/builder';

export interface SmartElementBaseProps {
    id: string;
    label: string;
    type?: ComponentType;
    traits: PropertyTrait[];
    isInspectorActive: boolean;
    isSelected: boolean;
    onSelect: (metadata: ComponentMetadata) => void;
    overrides?: ComponentOverride;
}

export const SmartText: React.FC<SmartElementBaseProps & {
    fallback: string,
    className?: string,
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div',
    onClick?: () => void,
    style?: React.CSSProperties
}> = ({
    id, label, type, traits, isInspectorActive, isSelected, onSelect, overrides = {}, fallback, className = "", as = 'span', onClick, style = {}
}) => {
        const Component = as;

        // Separate overrides into styles and classes
        const isTailwindClass = (val: any) => typeof val === 'string' && (val.startsWith('text-') || val.startsWith('font-'));

        const overrideClasses = [
            overrides.fontSize && isTailwindClass(overrides.fontSize) ? overrides.fontSize : '',
            overrides.fontWeight && isTailwindClass(overrides.fontWeight) ? overrides.fontWeight : '',
            overrides.textAlign ? `text-${overrides.textAlign}` : ''
        ].filter(Boolean).join(' ');

        const textStyle: React.CSSProperties = {
            color: overrides.textColor || overrides.color || undefined,
            fontSize: overrides.fontSize && !isTailwindClass(overrides.fontSize) ? (typeof overrides.fontSize === 'number' ? `${overrides.fontSize}px` : overrides.fontSize) : undefined,
            fontWeight: overrides.fontWeight && !isTailwindClass(overrides.fontWeight) ? overrides.fontWeight : undefined,
            letterSpacing: overrides.letterSpacing !== undefined ? `${overrides.letterSpacing}px` : undefined,
            lineHeight: overrides.lineHeight !== undefined ? overrides.lineHeight : undefined,
            opacity: overrides.visible === false ? 0.3 : (overrides.opacity !== undefined ? overrides.opacity : undefined),
            ...style
        };

        return (
            <Selectable
                id={id}
                type={type || 'text'}
                label={label}
                traits={traits}
                isInspectorActive={isInspectorActive}
                isSelected={isSelected}
                onSelect={onSelect}
                overrides={overrides}
                className={`${className} ${overrideClasses}`}
            >
                <Component
                    className={`${className} ${overrideClasses}`}
                    style={textStyle}
                    onClick={onClick}
                >
                    {overrides.content !== undefined ? overrides.content : fallback}
                </Component>
            </Selectable>
        );
    };

export const SmartCard: React.FC<SmartElementBaseProps & {
    children: React.ReactNode,
    className?: string,
    onClick?: () => void,
    isInteractive?: boolean,
    overrides?: ComponentOverride,
    style?: React.CSSProperties
}> = ({
    id, label, type, traits, isInspectorActive, isSelected, onSelect, overrides = {}, children, className = "", onClick, isInteractive, style = {}
}) => {
        // Separate overrides into styles and classes
        const isTailwindClass = (val: any) => typeof val === 'string' && (val.startsWith('rounded') || val.startsWith('backdrop-blur'));

        const overrideClasses = [
            overrides.borderRadius && isTailwindClass(overrides.borderRadius) ? overrides.borderRadius : '',
            overrides.backdropBlur ? overrides.backdropBlur : '',
        ].filter(Boolean).join(' ');

        const cardStyle: React.CSSProperties = {
            backgroundColor: overrides.backgroundColor || overrides.bg || undefined,
            borderColor: overrides.borderColor || undefined,
            borderWidth: overrides.borderWidth !== undefined ? `${overrides.borderWidth}px` : undefined,
            padding: overrides.padding !== undefined ? (typeof overrides.padding === 'number' ? `${overrides.padding}px` : overrides.padding) : undefined,
            borderRadius: overrides.borderRadius && !isTailwindClass(overrides.borderRadius) ? `${overrides.borderRadius}px` : undefined,
            opacity: overrides.visible === false ? 0.3 : (overrides.opacity !== undefined ? overrides.opacity : undefined),
            backgroundImage: overrides.backgroundImage ? `url(${overrides.backgroundImage})` : undefined,
            ...style
        };

        return (
            <Selectable
                id={id}
                type={type || 'card'}
                label={label}
                traits={traits}
                isInspectorActive={isInspectorActive}
                isSelected={isSelected}
                onSelect={onSelect}
                overrides={overrides}
                className={`${className} ${overrideClasses}`}
            >
                <div
                    className={`${className} ${overrideClasses} ${isInteractive ? 'cursor-pointer active:scale-[0.98] transition-all' : ''}`}
                    style={cardStyle}
                    onClick={onClick}
                >
                    {children}
                </div>
            </Selectable>
        );
    };

export const SmartContainer: React.FC<SmartElementBaseProps & {
    children: React.ReactNode,
    className?: string
}> = ({
    id, label, traits, isInspectorActive, isSelected, onSelect, overrides = {}, className = "", children
}) => {
        const containerStyle: React.CSSProperties = {
            opacity: overrides.visible === false ? 0.3 : (overrides.opacity !== undefined ? overrides.opacity : undefined),
            display: overrides.visible === false ? 'none' : undefined // Optional: strictly hide if requested
        };

        return (
            <Selectable
                id={id}
                type="container"
                label={label}
                traits={traits}
                isInspectorActive={isInspectorActive}
                isSelected={isSelected}
                onSelect={onSelect}
                overrides={overrides}
                className={className}
            >
                <div className={className} style={containerStyle}>
                    {children}
                </div>
            </Selectable>
        );
    };
