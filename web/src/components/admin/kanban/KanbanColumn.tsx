'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanTaskCard } from './KanbanTaskCard';
import type { KanbanColumn as ColumnType, KanbanTask } from '@/types/database';

interface KanbanColumnProps {
    column: ColumnType;
    tasks: KanbanTask[];
    onTaskClick: (task: KanbanTask) => void;
}

export function KanbanColumn({ column, tasks, onTaskClick }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col h-full bg-slate-900/50 rounded-2xl border transition-all ${isOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800/50'
                }`}
        >
            {/* Column Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: column.color }}
                    />
                    <h3 className="font-bold text-white text-sm">
                        {column.name}
                    </h3>
                </div>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full font-medium">
                    {tasks.length}
                </span>
            </div>

            {/* Tasks List */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                <SortableContext
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map(task => (
                        <KanbanTaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
                        No tasks
                    </div>
                )}
            </div>
        </div>
    );
}
