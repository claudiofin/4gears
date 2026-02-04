import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/admin/kanban - Fetch all kanban data (columns, tasks, labels)
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

        // Get project_id from query params
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('project_id');

        // Fetch columns (filtered by project if specified)
        let columnsQuery = supabase
            .from('kanban_columns')
            .select('*')
            .order('position', { ascending: true });

        if (projectId) {
            columnsQuery = columnsQuery.eq('project_id', projectId);
        }

        const { data: columns, error: columnsError } = await columnsQuery;

        if (columnsError) {
            console.error('Error fetching columns:', columnsError);
            return NextResponse.json({ error: columnsError.message }, { status: 500 });
        }

        // Fetch tasks with relations (filtered by project if specified)
        let tasksQuery = supabase
            .from('kanban_tasks')
            .select(`
                *,
                column:kanban_columns(*),
                assigned_user:profiles!assigned_to(id, email),
                labels:kanban_task_labels(label:kanban_labels(*)),
                submission:submission_requests(*)
            `)
            .order('position', { ascending: true });

        if (projectId) {
            tasksQuery = tasksQuery.eq('project_id', projectId);
        }

        const { data: tasks, error: tasksError } = await tasksQuery;

        if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
            return NextResponse.json({ error: tasksError.message }, { status: 500 });
        }

        // Fetch labels
        const { data: labels, error: labelsError } = await supabase
            .from('kanban_labels')
            .select('*')
            .order('name', { ascending: true });

        if (labelsError) {
            console.error('Error fetching labels:', labelsError);
            return NextResponse.json({ error: labelsError.message }, { status: 500 });
        }

        return NextResponse.json({ columns, tasks, labels }, { status: 200 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
