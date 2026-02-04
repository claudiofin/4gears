import React from 'react';
import { EditableProperty } from '@/types/inspector';
import { TextControl } from './controls/TextControl';
import { ColorControl } from './controls/ColorControl';
import { SliderControl } from './controls/SliderControl';
import { SelectControl } from './controls/SelectControl';
import { ToggleControl } from './controls/ToggleControl';

interface PropertyEditorProps {
    properties: EditableProperty[];
    onUpdate: (key: string, value: any) => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ properties, onUpdate }) => {
    return (
        <div className="space-y-6">
            {properties.map((prop) => {
                const controlId = `prop-${prop.key}`;
                switch (prop.type) {
                    case 'text':
                        return (
                            <TextControl
                                key={prop.key}
                                id={controlId}
                                label={prop.label}
                                value={prop.value}
                                onChange={(val) => onUpdate(prop.key, val)}
                            />
                        );
                    case 'color':
                        return (
                            <ColorControl
                                key={prop.key}
                                id={controlId}
                                label={prop.label}
                                value={prop.value}
                                onChange={(val) => onUpdate(prop.key, val)}
                            />
                        );
                    case 'slider':
                    case 'number':
                        return (
                            <SliderControl
                                key={prop.key}
                                id={controlId}
                                label={prop.label}
                                value={prop.value}
                                min={prop.min}
                                max={prop.max}
                                step={prop.step}
                                unit={prop.unit}
                                onChange={(val) => onUpdate(prop.key, val)}
                            />
                        );
                    case 'select':
                        return (
                            <SelectControl
                                key={prop.key}
                                id={controlId}
                                label={prop.label}
                                value={prop.value}
                                options={prop.options || []}
                                onChange={(val) => onUpdate(prop.key, val)}
                            />
                        );
                    case 'toggle':
                        return (
                            <ToggleControl
                                key={prop.key}
                                id={controlId}
                                label={prop.label}
                                value={prop.value}
                                onChange={(val) => onUpdate(prop.key, val)}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};
