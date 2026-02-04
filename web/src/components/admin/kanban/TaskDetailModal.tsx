'use client';

import { useState } from 'react';
import { X, Trash2, GitBranch, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import type { KanbanTask, KanbanLabel, TaskPriority } from '@/types/database';
import { format } from 'date-fns';

interface TaskDetailModalProps {
    task: KanbanTask;
    labels: KanbanLabel[];
    onClose: () => void;
    onTaskUpdated: () => void;
}

const priorityColors = {
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    urgent: 'bg-red-500/10 text-red-400 border-red-500/20'
};

export function TaskDetailModal({ task, labels, onClose, onTaskUpdated }: TaskDetailModalProps) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('supabase.auth.token');
            const response = await fetch('/api/admin/kanban/task', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    task_id: task.id,
                    updates: {
                        title: title.trim(),
                        description: description.trim() || null,
                        priority
                    }
                })
            });

            if (!response.ok) throw new Error('Failed to update task');

            setEditing(false);
            onTaskUpdated();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        setDeleting(true);
        try {
            const token = localStorage.getItem('supabase.auth.token');
            const response = await fetch(`/api/admin/kanban/task?id=${task.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete task');

            onTaskUpdated();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-md border text-xs font-medium ${priorityColors[task.priority]}`}>
                            {task.priority.toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-500">
                            {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        {editing ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xl font-bold focus:outline-none focus:border-indigo-500"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                        {editing ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 resize-none"
                                placeholder="Add description..."
                            />
                        ) : (
                            <p className="text-slate-300 whitespace-pre-wrap">
                                {task.description || <span className="text-slate-600 italic">No description</span>}
                            </p>
                        )}
                    </div>

                    {/* Priority (when editing) */}
                    {editing && (
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Git Branch */}
                        {task.git_branch && (
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <GitBranch size={16} />
                                    <span>Git Branch</span>
                                </div>
                                <p className="text-white font-mono text-sm">{task.git_branch}</p>
                            </div>
                        )}

                        {/* Due Date */}
                        {task.due_date && (
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <Calendar size={16} />
                                    <span>Due Date</span>
                                </div>
                                <p className="text-white font-medium">
                                    {format(new Date(task.due_date), 'MMM d, yyyy')}
                                </p>
                            </div>
                        )}

                        {/* Estimated Hours */}
                        {task.estimated_hours && (
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <Clock size={16} />
                                    <span>Estimated</span>
                                </div>
                                <p className="text-white font-medium">{task.estimated_hours}h</p>
                            </div>
                        )}

                        {/* Actual Hours */}
                        {task.actual_hours && (
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <Clock size={16} />
                                    <span>Actual</span>
                                </div>
                                <p className="text-white font-medium">{task.actual_hours}h</p>
                            </div>
                        )}
                    </div>

                    {/* Timestamps */}
                    <div className="flex gap-4 text-xs text-slate-500">
                        <div>
                            Created: {format(new Date(task.created_at), 'MMM d, yyyy HH:mm')}
                        </div>
                        <div>
                            Updated: {format(new Date(task.updated_at), 'MMM d, yyyy HH:mm')}
                        </div>
                        {task.completed_at && (
                            <div className="text-emerald-400">
                                Completed: {format(new Date(task.completed_at), 'MMM d, yyyy HH:mm')}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                        {editing ? (
                            <>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setTitle(task.title);
                                        setDescription(task.description || '');
                                        setPriority(task.priority);
                                    }}
                                    className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !title.trim()}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                            >
                                Edit Task
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
