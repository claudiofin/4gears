import React from 'react';
import { ComponentMetadata } from '@/types/inspector';
import { SmartText } from '../SmartElements';

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
    <SmartText
        id={id}
        label={label}
        fallback={title}
        type="text"
        traits={['content', 'typography', 'interaction']}
        isInspectorActive={isInspectorActive}
        isSelected={activeSelectionId === id}
        onSelect={onSelect}
        overrides={getOverride(id)}
        as="h3"
        className={`text-[10px] font-black uppercase tracking-[0.2em] ${isFirst ? 'mt-0' : 'mt-6'} mb-3 px-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
    />
);
