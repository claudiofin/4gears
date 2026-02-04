import React from 'react';
import { X, Box, Layers, History, Settings2, Trash2, Copy } from 'lucide-react';
import { ComponentMetadata } from '@/types/inspector';
import { PropertyEditor } from './PropertyEditor';

interface InspectorPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedComponent: ComponentMetadata | null;
    onUpdate: (id: string, key: string, value: any) => void;
    onReset?: (id: string) => void;
    onCopyStyle?: (id: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
    isOpen,
    onClose,
    selectedComponent,
    onUpdate,
    onReset,
    onCopyStyle
}) => {
    if (!isOpen) return null;

    return (
        <div className={`absolute left-[calc(100%+12px)] top-0 h-[812px] w-[300px] bg-slate-950/95 border border-slate-800 shadow-2xl z-[100] flex flex-col transition-all duration-300 rounded-[32px] overflow-hidden backdrop-blur-xl ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Settings2 size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white leading-tight">Inspector</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Visual Editor</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {selectedComponent ? (
                    <div className="p-4 space-y-6">
                        {/* Component Summary Card */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                                        <Box size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-200">{selectedComponent.label}</h3>
                                        <code className="text-[10px] text-indigo-400 font-mono">{selectedComponent.type}</code>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onCopyStyle?.(selectedComponent.id)}
                                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors"
                                        title="Copia Stile"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <button
                                        onClick={() => onReset?.(selectedComponent.id)}
                                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                                        title="Reset"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {selectedComponent.path && (
                                <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                                    {selectedComponent.path.split('>').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            <span className="text-[9px] text-slate-500 whitespace-nowrap bg-slate-800/50 px-1.5 py-0.5 rounded italic">
                                                {part.trim()}
                                            </span>
                                            {i < arr.length - 1 && <span className="text-[9px] text-slate-700">/</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Property Tabs (Simplified for now) */}
                        <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                            <button className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center gap-1.5">
                                <Layers size={12} />
                                PROPRIETÀ
                            </button>
                            <button disabled className="flex-1 py-2 rounded-lg text-slate-500 text-[10px] font-bold flex items-center justify-center gap-1.5 opacity-50">
                                <History size={12} />
                                STORIA
                            </button>
                        </div>

                        {/* Property Editor */}
                        <PropertyEditor
                            properties={selectedComponent.editableProps}
                            onUpdate={(key, val) => onUpdate(selectedComponent.id, key, val)}
                        />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 animate-pulse">
                            <Box size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Nessun elemento selezionato</p>
                            <p className="text-xs text-slate-600 mt-1">Clicca su un componente nel preview per iniziare l'editing dinamico.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl">
                <button
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={() => onClose()}
                >
                    SALVA MODIFICHE
                </button>
            </div>
        </div>
    );
};
