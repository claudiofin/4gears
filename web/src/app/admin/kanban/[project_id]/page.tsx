'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { KanbanProject } from '@/types/database';
import { ArrowLeft, Github, Calendar, Settings, Archive, CheckCircle2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { KanbanBoard } from '@/components/admin/KanbanBoard';

interface ProjectWithStats extends KanbanProject {
    stats: {
        total: number;
        completed: number;
        inProgress: number;
        blocked: number;
    };
    submission_requests?: {
        team_name: string;
        sport_type: string;
    } | null;
}

export default function ProjectKanbanPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.project_id as string;

    const [project, setProject] = useState<ProjectWithStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false); // Added for editing name
    const [newName, setNewName] = useState(''); // Added for editing name
    const [isSaving, setIsSaving] = useState(false); // Added for saving state

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/admin/kanban/project?id=${projectId}`);
                const data = await response.json();
                setProject(data.project);
                setNewName(data.project.name); // Set initial new name
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const handleArchive = async () => {
        if (!confirm('Archiviare questo progetto?')) return;

        try {
            await fetch('/api/admin/kanban/project', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: projectId,
                    status: 'archived',
                }),
            });

            router.push('/admin/kanban');
        } catch (error) {
            console.error('Error archiving project:', error);
            alert('Errore durante l\'archiviazione del progetto');
        }
    };

    const handleComplete = async () => {
        if (!confirm('Segnare questo progetto come completato?')) return;

        try {
            await fetch('/api/admin/kanban/project', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: projectId,
                    status: 'completed',
                }),
            });

            router.push('/admin/kanban');
        } catch (error) {
            console.error('Error completing project:', error);
            alert('Errore durante il completamento del progetto');
        }
    };
    const handleUpdateName = async () => {
        if (!newName.trim() || newName === project?.name) {
            setIsEditingName(false);
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/kanban/project', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: projectId,
                    name: newName.trim(),
                }),
            });

            if (!response.ok) throw new Error('Failed to update name');

            setProject(prev => prev ? { ...prev, name: newName.trim() } : null);
            setIsEditingName(false);
        } catch (error) {
            console.error('Error updating name:', error);
            alert('Errore durante l\'aggiornamento del nome');
        } finally {
            setIsSaving(false);
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-slate-400">Caricamento...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-slate-400">Progetto non trovato</div>
                <button
                    onClick={() => router.push('/admin/kanban')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Torna ai progetti
                </button>
            </div>
        );
    }

    const progress = project.stats && project.stats.total > 0
        ? Math.round((project.stats.completed / project.stats.total) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => router.push('/admin/kanban')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Torna ai progetti</span>
                </button>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            {isEditingName ? (
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="text-3xl font-black text-white tracking-tight bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 outline-none focus:border-indigo-500 transition-all"
                                        autoFocus
                                        disabled={isSaving}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleUpdateName();
                                            if (e.key === 'Escape') setIsEditingName(false);
                                        }}
                                        onBlur={handleUpdateName}
                                    />
                                    {isSaving && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
                                </div>
                            ) : (
                                <h1
                                    className="text-3xl font-black text-white tracking-tight mb-2 hover:text-indigo-400 cursor-pointer transition-colors"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    {project.name}
                                </h1>
                            )}
                            {project.description && (
                                <p className="text-slate-400">{project.description}</p>
                            )}
                            {project.submission_requests && (
                                <p className="text-sm text-slate-500 mt-2">
                                    {project.submission_requests.team_name} • {project.submission_requests.sport_type}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {project.status === 'active' && (
                                <>
                                    <button
                                        onClick={handleComplete}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Completa
                                    </button>
                                    <button
                                        onClick={handleArchive}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <Archive className="w-4 h-4" />
                                        Archivia
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                            <div className="text-xs text-slate-500 font-medium mb-1">Totale Task</div>
                            <div className="text-2xl font-black text-white">{project.stats?.total || 0}</div>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                            <div className="text-xs text-emerald-400 font-medium mb-1">Completate</div>
                            <div className="text-2xl font-black text-white">{project.stats?.completed || 0}</div>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                            <div className="text-xs text-indigo-400 font-medium mb-1">In Corso</div>
                            <div className="text-2xl font-black text-white">{project.stats?.inProgress || 0}</div>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                            <div className="text-xs text-amber-400 font-medium mb-1">Bloccate</div>
                            <div className="text-2xl font-black text-white">{project.stats?.blocked || 0}</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-500 font-medium">Progresso Complessivo</span>
                            <span className="text-xs text-indigo-400 font-bold">{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800">
                        {project.github_repo_url && (
                            <a
                                href={project.github_repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                <span className="font-mono">{project.github_repo_name}</span>
                            </a>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            Creato il {format(new Date(project.created_at), 'dd MMMM yyyy', { locale: it })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <KanbanBoard projectId={projectId} />
        </div>
    );
}
