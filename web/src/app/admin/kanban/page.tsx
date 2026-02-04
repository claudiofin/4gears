'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KanbanProject } from '@/types/database';
import { Plus, Loader2, FolderKanban, Github, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

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

export default function KanbanProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'archived' | 'completed'>('active');

    const fetchProjects = async () => {
        try {
            const url = filter === 'all'
                ? '/api/admin/kanban/project'
                : `/api/admin/kanban/project?status=${filter}`;

            const response = await fetch(url);
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [filter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getProgressPercentage = (stats: ProjectWithStats['stats']) => {
        if (stats.total === 0) return 0;
        return Math.round((stats.completed / stats.total) * 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Kanban Projects</h1>
                    <p className="text-slate-400 mt-1">Gestisci i progetti approvati e le loro board</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 bg-slate-950/50 p-1 rounded-xl border border-slate-800 w-fit">
                {(['all', 'active', 'archived', 'completed'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${filter === status
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <FolderKanban className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">Nessun progetto</h3>
                    <p className="text-slate-500">
                        {filter === 'all'
                            ? 'Approva una richiesta per creare il primo progetto Kanban'
                            : `Nessun progetto ${filter}`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => {
                        const progress = getProgressPercentage(project.stats);

                        return (
                            <button
                                key={project.id}
                                onClick={() => router.push(`/admin/kanban/${project.id}`)}
                                className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:shadow-indigo-500/10"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                                            {project.name}
                                        </h3>
                                        {project.submission_requests && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                {project.submission_requests.team_name} • {project.submission_requests.sport_type}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>

                                {/* Description */}
                                {project.description && (
                                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>
                                )}

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-500 font-medium">Progresso</span>
                                        <span className="text-xs text-indigo-400 font-bold">{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800">
                                        <div className="flex items-center gap-1 mb-1">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                            <span className="text-[10px] text-slate-500 font-medium">Done</span>
                                        </div>
                                        <span className="text-lg font-black text-white">{project.stats.completed}</span>
                                    </div>
                                    <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Clock className="w-3 h-3 text-indigo-400" />
                                            <span className="text-[10px] text-slate-500 font-medium">Active</span>
                                        </div>
                                        <span className="text-lg font-black text-white">{project.stats.inProgress}</span>
                                    </div>
                                    <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800">
                                        <div className="flex items-center gap-1 mb-1">
                                            <AlertCircle className="w-3 h-3 text-amber-400" />
                                            <span className="text-[10px] text-slate-500 font-medium">Blocked</span>
                                        </div>
                                        <span className="text-lg font-black text-white">{project.stats.blocked}</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                    {project.github_repo_url ? (
                                        <a
                                            href={project.github_repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                                        >
                                            <Github className="w-3 h-3" />
                                            <span className="font-mono">{project.github_repo_name}</span>
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-600">No repo</span>
                                    )}
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(project.created_at), 'dd MMM yyyy', { locale: it })}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
