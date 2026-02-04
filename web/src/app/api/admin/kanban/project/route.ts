import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('id');
        const status = searchParams.get('status');

        if (projectId) {
            // Get single project with stats
            const { data: project, error: projectError } = await supabase
                .from('kanban_projects')
                .select('*, submission_requests(*)')
                .eq('id', projectId)
                .single();

            if (projectError) throw projectError;

            // Get task stats
            const { data: tasks } = await supabase
                .from('kanban_tasks')
                .select('status')
                .eq('project_id', projectId);

            const taskList = (tasks || []) as Array<{ status: string }>;
            const stats = {
                total: taskList.length,
                completed: taskList.filter(t => t.status === 'done').length,
                inProgress: taskList.filter(t => t.status === 'in_progress').length,
                blocked: taskList.filter(t => t.status === 'blocked').length,
            };

            return NextResponse.json({ project, stats });
        }

        // Get all projects
        let query = supabase
            .from('kanban_projects')
            .select('*, submission_requests(*)');

        if (status) {
            query = query.eq('status', status);
        }

        const { data: projects, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Get stats for each project
        const projectsWithStats = await Promise.all(
            (projects || []).map(async (project) => {
                // @ts-ignore - Supabase type inference issue
                const { data: tasks } = await supabase
                    .from('kanban_tasks')
                    .select('status')
                    .eq('project_id', project.id);

                const taskList = (tasks || []) as Array<{ status: string }>;
                return {
                    // @ts-ignore - Supabase type inference issue
                    ...project,
                    stats: {
                        total: taskList.length,
                        completed: taskList.filter(t => t.status === 'done').length,
                        inProgress: taskList.filter(t => t.status === 'in_progress').length,
                        blocked: taskList.filter(t => t.status === 'blocked').length,
                    }
                };
            })
        );

        return NextResponse.json({ projects: projectsWithStats });
    } catch (error: any) {
        console.error('Error fetching kanban projects:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const body = await request.json();

        const { submission_id, name, description, github_repo_url, github_repo_name } = body;

        // Create project
        // @ts-ignore - Supabase type inference issue
        const { data: project, error: projectError } = await supabase
            .from('kanban_projects')
            .insert({
                submission_id,
                name,
                description,
                github_repo_url,
                github_repo_name,
                status: 'active'
            })
            .select()
            .single();

        if (projectError) throw projectError;

        // Create default columns
        const defaultColumns = [
            { name: 'Backlog', position: 0, color: '#64748b' },
            { name: 'In Progress', position: 1, color: '#3b82f6' },
            { name: 'Review', position: 2, color: '#f59e0b' },
            { name: 'Done', position: 3, color: '#10b981' },
        ];

        // @ts-ignore - Supabase type inference issue
        const { error: columnsError } = await supabase
            .from('kanban_columns')
            .insert(
                defaultColumns.map(col => ({
                    ...col,
                    // @ts-ignore - Supabase type inference issue
                    project_id: project.id
                }))
            );

        if (columnsError) throw columnsError;

        return NextResponse.json({ project }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating kanban project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create project' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const body = await request.json();

        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // @ts-ignore - Supabase type inference issue
        const { data: project, error } = await supabase
            .from('kanban_projects')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ project });
    } catch (error: any) {
        console.error('Error updating kanban project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('kanban_projects')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting kanban project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete project' },
            { status: 500 }
        );
    }
}
