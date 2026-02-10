import React from 'react';
import { Selectable } from '../../builder/VisualInspector';
import { ComponentMetadata } from '@/types/inspector';

interface SectionHeaderProps {
    id: string;
    label: string;
    title: string;
    isFirst?: boolean;
    isDarkMode: boolean;
    isInspectorActive: boolean;
    activeSelectionId?: string | null;
    onSelect: (metadata: ComponentMetadata) => void;
    getOverride: (id: string) => any;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    id, label, title, isFirst, isDarkMode, isInspectorActive, activeSelectionId, onSelect, getOverride
}) => (
    <Selectable
        id={id}
        type="text"
        label={label}
        isInspectorActive={isInspectorActive}
        isSelected={activeSelectionId === id}
        onSelect={onSelect}
        overrides={getOverride(id)}
        traits={['content', 'typography', 'interaction']}
        className={`${isFirst ? 'mt-0' : 'mt-6'} mb-3 px-1`}
    >
        {(getOverride(id)?.visible !== false || isInspectorActive) && (
            <h3
                className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ${getOverride(id)?.fontSize || ''} ${getOverride(id)?.visible === false ? 'opacity-30 grayscale' : ''}`}
                style={{ color: getOverride(id)?.textColor }}
            >
                {getOverride(id)?.text || title}
            </h3>
        )}
    </Selectable>
);
