import React, { useState } from 'react';
import { Target } from 'lucide-react';

interface VisualInspectorProps {
    isActive: boolean;
    onToggle: () => void;
    activeSelectionId: string | null;
}

export const VisualInspector: React.FC<VisualInspectorProps> = ({
    isActive,
    onToggle,
    activeSelectionId
}) => {
    return (
        <div className="flex items-center gap-2 mb-4">
            <button
                onClick={onToggle}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${isActive
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
            >
                <Target size={14} className={isActive ? 'animate-pulse' : ''} />
                {isActive ? 'Inspect Mode On' : 'Inspect UI'}
            </button>

            {isActive && (
                <span className="text-[10px] text-slate-500 flex items-center gap-1 ml-2">
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400 font-mono">Alt</span>
                    + Click to Interact
                </span>
            )}
        </div>
    );
};

// Wrapper component to make elements selectable
import { ComponentType, ComponentMetadata, EditableProperty, COMPONENT_PROPERTY_CONFIGS, PropertyTrait, TRAIT_CONFIGS } from '@/types/inspector';

interface SelectableProps {
    id: string;
    type: ComponentType;
    label: string;
    isInspectorActive: boolean;
    isSelected: boolean;
    onSelect: (metadata: ComponentMetadata) => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    path?: string;
    overrides?: Record<string, any>; // Current values that override defaults
    traits?: PropertyTrait[]; // New: Specific traits for this instance
}

export const Selectable = React.forwardRef<HTMLDivElement, SelectableProps>(({
    id,
    type,
    label,
    isInspectorActive,
    isSelected,
    onSelect,
    children,
    className = "",
    style = {},
    path,
    overrides = {},
    traits = []
}, ref) => {
    if (!isInspectorActive) return <div ref={ref} className={className} style={style}>{children}</div>;

    const handleClick = (e: React.MouseEvent) => {
        // If modifier key is held (Alt/Option), allow interaction (pass through)
        if (e.altKey || (e.nativeEvent as MouseEvent).altKey) {
            return;
        }

        // Otherwise intercept for selection
        e.preventDefault();
        e.stopPropagation();

        // Construct metadata with current values
        // 1. Get base props from type (legacy)
        const baseProps = COMPONENT_PROPERTY_CONFIGS[type] || [];

        // 2. Get props from traits (new system)
        const traitProps = traits.flatMap(trait => TRAIT_CONFIGS[trait] || []);

        // 3. Merge and deduplicate (last one wins)
        const allConfigs = [...baseProps, ...traitProps];
        const uniqueConfigs = Array.from(new Map(allConfigs.map(item => [item.key, item])).values());

        const editableProps = uniqueConfigs.map(prop => ({
            ...prop,
            value: overrides[prop.key] !== undefined ? overrides[prop.key] : ''
        })) as EditableProperty[];

        onSelect({
            id,
            type,
            label,
            path,
            editableProps,
            traits
        });
    };

    // Only add 'relative' if no other positioning class is present
    const hasPositioning = /absolute|fixed|relative/.test(className);
    const positionClass = hasPositioning ? "" : "relative";

    return (
        <div
            ref={ref}
            onClick={handleClick}
            className={`${positionClass} group ${className} ${isInspectorActive ? 'cursor-crosshair' : ''}`}
            style={style}
        >
            {/* Selection Overlay */}
            <div className={`absolute inset-0 z-[60] rounded-[inherit] pointer-events-none transition-all duration-200 border-2
                ${isSelected
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : overrides.visible === false
                        ? 'border-rose-500/50 border-dashed bg-rose-500/5'
                        : 'border-transparent group-hover:border-indigo-400/50 group-hover:bg-indigo-400/5'
                }
            `} />

            {/* Label Tag (Visible on Hover/Select) */}
            <div className={`absolute -top-5 left-0 z-[70] px-1.5 py-0.5 ${overrides.visible === false ? 'bg-rose-500' : 'bg-indigo-500'} text-white text-[9px] rounded font-mono pointer-events-none transition-opacity duration-200 shadow-lg shadow-indigo-500/20
                ${isSelected || 'opacity-0 group-hover:opacity-100'}
            `}>
                <span className="opacity-70 mr-1">{type}:</span>
                {label}
                {overrides.visible === false && <span className="ml-1 px-1 bg-white/20 rounded-sm font-black">HIDDEN</span>}
            </div>

            {children}
        </div>
    );
});

Selectable.displayName = 'Selectable';

