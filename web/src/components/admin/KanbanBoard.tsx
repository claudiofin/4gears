'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { KanbanCard } from './KanbanCard';
import { ExtendedSubmission } from '@/app/admin/submissions/page';

const COLUMNS = [
    { id: 'pending', title: 'Da Iniziare', color: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
    { id: 'in_progress', title: 'In Sviluppo', color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
    { id: 'completed', title: 'Completati', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
    { id: 'rejected', title: 'Rifiutati', color: 'bg-rose-500/10 border-rose-500/20 text-rose-500' }
];

export function KanbanBoard() {
    const [submissions, setSubmissions] = useState<ExtendedSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('submission_requests')
            .select('*, profiles!user_id(email)')
            .order('updated_at', { ascending: false });

        if (!error && data) {
            setSubmissions(data as unknown as ExtendedSubmission[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdate = () => {
        fetchData();
    };

    if (loading) return <div className="text-slate-400">Caricamento Board...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)] overflow-hidden">
            {COLUMNS.map(column => (
                <div key={column.id} className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800/50">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${column.color.split(' ')[2].replace('text-', 'bg-')}`} />
                            <h3 className="font-semibold text-white uppercase text-xs tracking-wider">{column.title}</h3>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                            {submissions.filter(s => s.status === column.id).length}
                        </span>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                        {submissions
                            .filter(s => s.status === column.id)
                            .map(submission => (
                                <KanbanCard
                                    key={submission.id}
                                    submission={submission}
                                    onUpdate={handleUpdate}
                                />
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    );
}
