'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban/KanbanColumn';
import { KanbanTaskCard } from './kanban/KanbanTaskCard';
import { CreateTaskModal } from './kanban/CreateTaskModal';
import { TaskDetailModal } from './kanban/TaskDetailModal';
import type { KanbanColumn as ColumnType, KanbanTask, KanbanLabel } from '@/types/database';
import { Plus, Loader2 } from 'lucide-react';

export function KanbanBoard({ projectId }: { projectId?: string }) {
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [labels, setLabels] = useState<KanbanLabel[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const fetchKanbanData = async () => {
        try {
            const token = localStorage.getItem('supabase.auth.token');
            const url = projectId
                ? `/api/admin/kanban?project_id=${projectId}`
                : '/api/admin/kanban';

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch kanban data');

            const data = await response.json();
            setColumns(data.columns || []);
            setTasks(data.tasks || []);
            setLabels(data.labels || []);
        } catch (error) {
            console.error('Error fetching kanban data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKanbanData();
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id);
        setActiveTask(task || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as string;
        const newColumnId = over.id as string;

        const task = tasks.find(t => t.id === taskId);
        if (!task || task.column_id === newColumnId) return;

        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, column_id: newColumnId } : t
        ));

        // Update in database
        try {
            const token = localStorage.getItem('supabase.auth.token');
            const response = await fetch('/api/admin/kanban/task', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    task_id: taskId,
                    updates: { column_id: newColumnId }
                })
            });

            if (!response.ok) {
                // Revert on error
                setTasks(prev => prev.map(t =>
                    t.id === taskId ? { ...t, column_id: task.column_id } : t
                ));
                throw new Error('Failed to update task');
            }

            // Refresh to get updated status and timestamps
            await fetchKanbanData();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleTaskCreated = () => {
        setShowCreateModal(false);
        fetchKanbanData();
    };

    const handleTaskUpdated = () => {
        setSelectedTask(null);
        fetchKanbanData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800">
                        <span className="text-sm text-slate-400">Total Tasks:</span>
                        <span className="text-lg font-bold text-white">{tasks.length}</span>
                    </div>
                    <div className="flex gap-2">
                        {labels.slice(0, 5).map(label => (
                            <div
                                key={label.id}
                                className="px-3 py-1 rounded-full text-xs font-medium border"
                                style={{
                                    backgroundColor: `${label.color}20`,
                                    borderColor: `${label.color}40`,
                                    color: label.color
                                }}
                            >
                                {label.name}
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[calc(100vh-300px)]">
                    {columns.map(column => {
                        const columnTasks = tasks.filter(t => t.column_id === column.id);
                        return (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                tasks={columnTasks}
                                onTaskClick={setSelectedTask}
                            />
                        );
                    })}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="opacity-50">
                            <KanbanTaskCard task={activeTask} onClick={() => { }} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {showCreateModal && (
                <CreateTaskModal
                    projectId={projectId} // Added projectId
                    columns={columns}
                    labels={labels}
                    onClose={() => setShowCreateModal(false)}
                    onTaskCreated={handleTaskCreated}
                />
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    labels={labels}
                    onClose={() => setSelectedTask(null)}
                    onTaskUpdated={handleTaskUpdated}
                />
            )}
        </>
    );
}
