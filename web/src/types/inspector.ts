export type ComponentType =
    | 'text'           // Testo modificabile
    | 'icon'           // Icona con colore/dimensione
    | 'card'           // Card con stili
    | 'button'         // Bottone con azioni
    | 'image'          // Immagine con URL
    | 'container'      // Container con layout
    | 'navigation'     // Elemento di navigazione
    | 'header'         // Header con titolo/sottotitolo
    | 'list-item'      // Elemento di lista
    | 'badge'          // Badge/tag
    | 'input'          // Campo input
    | 'tab-bar'        // Tab bar completa
    | 'burger-menu';   // Burger menu

export interface EditableProperty {
    key: string;
    label: string;
    type: 'text' | 'color' | 'number' | 'select' | 'toggle' | 'slider' | 'icon-picker' | 'image-upload';
    value: any;
    options?: any[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}

export interface ComponentMetadata {
    id: string;
    type: ComponentType;
    label: string;
    path?: string;
    editableProps: EditableProperty[];
    parent?: string;
    children?: string[];
}

export interface ComponentUpdate {
    id: string;
    key: string;
    value: any;
}

export const COMPONENT_PROPERTY_CONFIGS: Record<string, Omit<EditableProperty, 'value'>[]> = {
    text: [
        { key: 'content', label: 'Testo', type: 'text' },
        { key: 'fontSize', label: 'Dimensione', type: 'select', options: ['text-[10px]', 'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'] },
        { key: 'fontWeight', label: 'Peso', type: 'select', options: ['font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-black'] },
        { key: 'textColor', label: 'Colore', type: 'color' },
        { key: 'visible', label: 'Visibile', type: 'toggle' }
    ],
    icon: [
        { key: 'icon', label: 'Icona (Lucide)', type: 'text' },
        { key: 'color', label: 'Colore', type: 'color' },
        { key: 'size', label: 'Dimensione', type: 'slider', min: 12, max: 48, step: 2, unit: 'px' },
        { key: 'visible', label: 'Visibile', type: 'toggle' }
    ],
    card: [
        { key: 'backgroundColor', label: 'Sfondo', type: 'color' },
        { key: 'borderColor', label: 'Colore Bordo', type: 'color' },
        { key: 'borderRadius', label: 'Arrotondamento', type: 'select', options: ['rounded-none', 'rounded', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full'] },
        { key: 'visible', label: 'Visibile', type: 'toggle' }
    ],
    button: [
        { key: 'text', label: 'Etichetta', type: 'text' },
        { key: 'backgroundColor', label: 'Sfondo', type: 'color' },
        { key: 'textColor', label: 'Colore Testo', type: 'color' },
        { key: 'visible', label: 'Visibile', type: 'toggle' }
    ]
};
