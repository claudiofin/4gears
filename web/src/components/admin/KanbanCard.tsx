'use client';

import { useState, useEffect } from 'react';
import { ExtendedSubmission } from '@/app/admin/submissions/page';
import { Github, Plus, Check, Square, CheckSquare, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Task = {
    id: string;
    title: string;
    completed: boolean;
};

export function KanbanCard({ submission, onUpdate }: { submission: ExtendedSubmission; onUpdate: () => void }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isInitializing, setIsInitializing] = useState(false);
    const [showTasks, setShowTasks] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [submission.id]);

    const fetchTasks = async () => {
        const res = await fetch(`/api/admin/tasks?submissionId=${submission.id}`);
        const data = await res.json();
        if (Array.isArray(data)) setTasks(data);
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const res = await fetch('/api/admin/tasks', {
            method: 'POST',
            body: JSON.stringify({ submissionId: submission.id, title: newTaskTitle })
        });

        if (res.ok) {
            setNewTaskTitle('');
            fetchTasks();
        }
    };

    const toggleTask = async (task: Task) => {
        await fetch('/api/admin/tasks', {
            method: 'PATCH',
            body: JSON.stringify({ id: task.id, completed: !task.completed })
        });
        fetchTasks();
    };

    const initializeGit = async () => {
        if (!confirm(`Inizializzare repository GitHub per ${submission.notes || 'questo progetto'}?`)) return;

        setIsInitializing(true);
        try {
            const res = await fetch('/api/admin/initialize-repo', {
                method: 'POST',
                body: JSON.stringify({
                    submissionId: submission.id,
                    repoName: `4gears-project-${submission.id.slice(0, 8)}`,
                    description: `Progetto 4Gears: ${submission.notes || 'Nessuna nota'}`
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Repository inizializzato con successo!');
                onUpdate();
            } else {
                alert(`Errore: ${data.error}`);
            }
        } catch (err) {
            alert('Errore durante l\'inizializzazione');
        } finally {
            setIsInitializing(false);
        }
    };

    const completedPercentage = tasks.length > 0
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
        : 0;

    return (
        <motion.div
            layout
            className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl hover:border-slate-600 transition-colors group"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-sm font-medium text-white truncate max-w-[180px]">
                        {submission.notes || 'Senza Note'}
                    </h4>
                    <div className="text-[10px] text-slate-500 space-y-0.5 mt-1">
                        <span className="block truncate">User: {submission.profiles?.email}</span>
                        {(submission as any).test_email && <span className="block text-blue-400/80 truncate">Test: {(submission as any).test_email}</span>}
                        {(submission as any).phone_number && <span className="block text-emerald-400/80 truncate">Tel: {(submission as any).phone_number}</span>}
                    </div>
                </div>
                {submission.github_repo_url ? (
                    <a
                        href={submission.github_repo_url}
                        target="_blank"
                        className="p-1.5 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Vedi Repo su GitHub"
                    >
                        <Github size={14} />
                    </a>
                ) : (
                    <button
                        onClick={initializeGit}
                        disabled={isInitializing}
                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                        title="Inizializza Git"
                    >
                        {isInitializing ? <Loader2 size={14} className="animate-spin" /> : <Github size={14} />}
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Task Avanzamento</span>
                    <span>{completedPercentage}%</span>
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completedPercentage}%` }}
                        className="h-full bg-blue-500"
                    />
                </div>
            </div>

            {/* Task Section */}
            <button
                onClick={() => setShowTasks(!showTasks)}
                className="w-full py-1 text-[10px] text-slate-400 hover:text-slate-200 transition-colors border-t border-slate-700/50 pt-2 flex items-center justify-center gap-1"
            >
                {showTasks ? 'Nascondi Task' : `Mostra Task (${tasks.length})`}
            </button>

            <AnimatePresence>
                {showTasks && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 space-y-2">
                            {tasks.map(task => (
                                <button
                                    key={task.id}
                                    onClick={() => toggleTask(task)}
                                    className="flex items-center gap-2 w-full text-left group/task"
                                >
                                    {task.completed ? (
                                        <CheckSquare size={14} className="text-blue-500 shrink-0" />
                                    ) : (
                                        <Square size={14} className="text-slate-600 shrink-0" />
                                    )}
                                    <span className={`text-[11px] truncate ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                        {task.title}
                                    </span>
                                </button>
                            ))}
                            <form onSubmit={addTask} className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Nuovo task..."
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-[11px] text-white focus:outline-none focus:border-blue-500"
                                />
                                <button type="submit" className="p-1 bg-slate-700 rounded-md text-white hover:bg-slate-600">
                                    <Plus size={12} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
