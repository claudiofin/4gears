import React from 'react';
import { X, Box, Target } from 'lucide-react';
import { ThemeConfig } from '@/types/builder';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentMetadata } from '@/types/inspector';
import { PropertyEditor } from '../inspector/PropertyEditor';

interface FloatingInspectorPanelProps {
    metadata: ComponentMetadata | null;
    config: ThemeConfig;
    onUpdate: (id: string, key: string, value: any) => void;
    onClose: () => void;
}

export const FloatingInspectorPanel: React.FC<FloatingInspectorPanelProps> = ({
    metadata,
    config,
    onUpdate,
    onClose
}) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Box size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                                {metadata ? metadata.label : 'Inspector'}
                            </h3>
                            <p className="text-[10px] text-blue-300 font-mono">
                                {metadata ? metadata.type : 'No selection'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {metadata ? (
                        <>
                            <PropertyEditor
                                properties={metadata.editableProps}
                                onUpdate={(key, value) => onUpdate(metadata.id, key, value)}
                            />

                            <div className="h-px bg-slate-800/50 my-6" />

                            {/* Reset Action */}
                            <button
                                onClick={() => {
                                    onUpdate(metadata.id, 'RESET', null);
                                }}
                                className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <X size={14} />
                                Reset Customizations
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <Target size={48} className="text-slate-600 mb-4" />
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">
                                No Element Selected
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Click on any element in the simulator to inspect and customize its properties.
                            </p>
                            <p className="text-xs text-slate-600 mt-4">
                                Hold <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">Alt</kbd> to interact normally
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
