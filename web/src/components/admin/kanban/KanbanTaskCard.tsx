'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanTask } from '@/types/database';
import { Clock, GitBranch, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanTaskCardProps {
    task: KanbanTask;
    onClick: () => void;
}

const priorityColors = {
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    urgent: 'bg-red-500/10 text-red-400 border-red-500/20'
};

const priorityIcons = {
    low: '○',
    medium: '◐',
    high: '◉',
    urgent: '⚠'
};

export function KanbanTaskCard({ task, onClick }: KanbanTaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:bg-slate-800 hover:border-indigo-500/30 transition-all group"
        >
            {/* Title */}
            <h4 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                {task.title}
            </h4>

            {/* Description */}
            {task.description && (
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between gap-2 text-xs">
                {/* Priority Badge */}
                <div className={`px-2 py-1 rounded-md border font-medium ${priorityColors[task.priority]}`}>
                    <span className="mr-1">{priorityIcons[task.priority]}</span>
                    {task.priority.toUpperCase()}
                </div>

                {/* Git Branch */}
                {task.git_branch && (
                    <div className="flex items-center gap-1 text-slate-500">
                        <GitBranch size={12} />
                        <span className="truncate max-w-[80px]">{task.git_branch.split('/').pop()}</span>
                    </div>
                )}
            </div>

            {/* Due Date */}
            {task.due_date && (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                    <Clock size={12} />
                    <span>{format(new Date(task.due_date), 'MMM d')}</span>
                </div>
            )}

            {/* Status Indicator */}
            {task.status === 'done' && (
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
                    <CheckCircle2 size={12} />
                    <span>Completed</span>
                </div>
            )}
        </div>
    );
}
