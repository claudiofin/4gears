'use client';

import { useState } from 'react';
import { X, Plus, GitBranch, Calendar, Clock } from 'lucide-react';
import type { KanbanColumn, KanbanLabel, TaskPriority } from '@/types/database';

interface CreateTaskModalProps {
    columns: KanbanColumn[];
    labels: KanbanLabel[];
    onClose: () => void;
    onTaskCreated: () => void;
}

export function CreateTaskModal({ columns, labels, onClose, onTaskCreated }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [columnId, setColumnId] = useState(columns[0]?.id || '');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [dueDate, setDueDate] = useState('');
    const [estimatedHours, setEstimatedHours] = useState('');
    const [autoCommit, setAutoCommit] = useState(true);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [creating, setCreating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setCreating(true);

        try {
            const token = localStorage.getItem('supabase.auth.token');
            const response = await fetch('/api/admin/kanban/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                    column_id: columnId,
                    priority,
                    due_date: dueDate || null,
                    estimated_hours: estimatedHours ? parseFloat(estimatedHours) : null,
                    auto_commit: autoCommit,
                    label_ids: selectedLabels
                })
            });

            if (!response.ok) throw new Error('Failed to create task');

            onTaskCreated();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        } finally {
            setCreating(false);
        }
    };

    const toggleLabel = (labelId: string) => {
        setSelectedLabels(prev =>
            prev.includes(labelId)
                ? prev.filter(id => id !== labelId)
                : [...prev, labelId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-xl font-bold text-white">Create New Task</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add task description..."
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Column & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Column
                            </label>
                            <select
                                value={columnId}
                                onChange={(e) => setColumnId(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                {columns.map(col => (
                                    <option key={col.id} value={col.id}>{col.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date & Estimated Hours */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <Calendar size={16} />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                <Clock size={16} />
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                value={estimatedHours}
                                onChange={(e) => setEstimatedHours(e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Labels */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                            Labels
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {labels.map(label => (
                                <button
                                    key={label.id}
                                    type="button"
                                    onClick={() => toggleLabel(label.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedLabels.includes(label.id)
                                        ? 'ring-2 ring-offset-2 ring-offset-slate-900'
                                        : 'opacity-60 hover:opacity-100'
                                        }`}
                                    style={{
                                        backgroundColor: `${label.color}20`,
                                        borderColor: `${label.color}40`,
                                        color: label.color
                                    }}
                                >
                                    {label.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Git Auto-Commit */}
                    <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <input
                            type="checkbox"
                            id="autoCommit"
                            checked={autoCommit}
                            onChange={(e) => setAutoCommit(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                        />
                        <label htmlFor="autoCommit" className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <GitBranch size={16} />
                            <span>Auto-create Git branch and commits</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creating || !title.trim()}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                        >
                            {creating ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
