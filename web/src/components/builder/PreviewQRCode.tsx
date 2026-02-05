'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, ExternalLink, QrCode } from 'lucide-react';

interface PreviewQRCodeProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export const PreviewQRCode: React.FC<PreviewQRCodeProps> = ({ isOpen, onClose, projectId }) => {
    // Generate the full URL for preview
    const previewUrl = `${window.location.origin}/preview/${projectId}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                        <Smartphone className="text-indigo-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Vedi sul Telefono</h3>
                                        <p className="text-xs text-slate-500">Inquadra per l'anteprima live</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="bg-white p-6 rounded-2xl flex items-center justify-center mb-6">
                                <QRCodeSVG
                                    value={previewUrl}
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                    imageSettings={{
                                        src: "/favicon.ico", // Attempt to use favicon as logo in QR
                                        x: undefined,
                                        y: undefined,
                                        height: 40,
                                        width: 40,
                                        excavate: true,
                                    }}
                                />
                            </div>

                            <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 group"
                            >
                                <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                Apri in una Nuova Scheda
                            </a>

                            <p className="mt-4 text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                                4Gears Live Preview System
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
