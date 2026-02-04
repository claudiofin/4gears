'use client';

import { Project } from '@/types/database';
import { Calendar, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectCardProps {
    project: Project;
    onOpen: () => void;
    onDelete: () => void;
}

export default function ProjectCard({ project, onOpen, onDelete }: ProjectCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const config = project.config as any;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
        setShowDeleteConfirm(false);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -4 }}
                className="relative group cursor-pointer"
                onClick={onOpen}
            >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                                {project.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span>Aggiornato {formatDate(project.updated_at)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="p-2 hover:bg-red-500/10 rounded-xl transition-colors group/delete"
                        >
                            <Trash2 className="w-4 h-4 text-slate-500 group-hover/delete:text-red-400" />
                        </button>
                    </div>

                    {/* Project Preview */}
                    <div className="mb-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                                style={{
                                    background: `linear-gradient(135deg, ${config?.team?.colors?.primary || '#3b82f6'}, ${config?.team?.colors?.secondary || '#1e40af'})`
                                }}
                            >
                                {config?.team?.name?.charAt(0) || 'T'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    {config?.team?.name || 'Team'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {config?.team?.sportType || 'Sport'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Open Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen();
                        }}
                        className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group/open"
                    >
                        Apri Progetto
                        <ExternalLink className="w-4 h-4 group-hover/open:translate-x-1 group-hover/open:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={cancelDelete}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                                <Trash2 className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Elimina Progetto</h3>
                            <p className="text-slate-400 mb-6">
                                Sei sicuro di voler eliminare <span className="font-semibold text-white">{project.name}</span>?
                                Questa azione non può essere annullata.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Elimina
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
