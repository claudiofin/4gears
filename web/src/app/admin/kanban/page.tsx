'use client';

import { KanbanBoard } from '@/components/admin/KanbanBoard';
import { LayoutGrid, ListTodo, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminKanbanPage() {
    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Project Kanban</h2>
                    <p className="text-slate-400">Monitora e gestisci lo stato di avanzamento dei progetti.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50"
                    >
                        <Settings size={18} />
                        <span className="text-sm font-medium">Impostazioni Git</span>
                    </Link>
                </div>
            </header>

            <KanbanBoard />
        </div>
    );
}
