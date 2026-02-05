import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// POST /api/admin/kanban/task - Create a new kanban task
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            title,
            description,
            column_id,
            project_id, // Added project_id
            priority,
            assigned_to,
            due_date,
            estimated_hours,
            submission_request_id,
            label_ids,
            auto_commit = true
        } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

        // Get max position in column for THIS project
        let maxPosQuery = (supabase as any)
            .from('kanban_tasks')
            .select('position')
            .eq('column_id', column_id || '');

        if (project_id) {
            maxPosQuery = maxPosQuery.eq('project_id', project_id);
        }

        const { data: maxPosData } = await maxPosQuery
            .order('position', { ascending: false })
            .limit(1)
            .maybeSingle();

        const position = (maxPosData?.position ?? 0) + 1;

        // Create task
        const { data: task, error: taskError } = await (supabase as any)
            .from('kanban_tasks')
            .insert({
                title,
                description,
                column_id,
                project_id, // Added project_id
                position,
                priority: priority || 'medium',
                assigned_to,
                due_date,
                estimated_hours,
                submission_request_id,
                auto_commit
            })
            .select()
            .single();

        if (taskError) {
            console.error('Error creating task:', taskError);
            return NextResponse.json({ error: taskError.message }, { status: 500 });
        }

        // Add labels if provided
        if (label_ids && label_ids.length > 0) {
            const labelInserts = label_ids.map((label_id: string) => ({
                task_id: task.id,
                label_id
            }));

            const { error: labelError } = await supabase
                .from('kanban_task_labels')
                .insert(labelInserts);

            if (labelError) {
                console.error('Error adding labels:', labelError);
            }
        }

        // If auto_commit is enabled, create Git branch
        if (auto_commit) {
            const branchName = `task/${task.id.slice(0, 8)}/${title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`;

            // Update task with branch name
            await (supabase as any)
                .from('kanban_tasks')
                .update({ git_branch: branchName })
                .eq('id', task.id);

            // TODO: Call Git API to create branch
            // This will be implemented in Phase 2
        }

        return NextResponse.json({ task }, { status: 201 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/admin/kanban/task - Update a kanban task
export async function PATCH(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { task_id, updates } = body;

        if (!task_id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

        // Check if task is being moved to a different column
        if (updates.column_id) {
            const { data: task } = await (supabase as any)
                .from('kanban_tasks')
                .select('column_id')
                .eq('id', task_id)
                .single();

            if (task && task.column_id !== updates.column_id) {
                // Get max position in new column
                const { data: maxPosData } = await (supabase as any)
                    .from('kanban_tasks')
                    .select('position')
                    .eq('column_id', updates.column_id)
                    .order('position', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                updates.position = (maxPosData?.position ?? 0) + 1;

                // Update status based on column
                const { data: column } = await (supabase as any)
                    .from('kanban_columns')
                    .select('name')
                    .eq('id', updates.column_id)
                    .single();

                if (column) {
                    if (column.name.includes('Done') || column.name.includes('✅')) {
                        updates.status = 'done';
                        updates.completed_at = new Date().toISOString();
                    } else if (column.name.includes('Progress') || column.name.includes('⚡')) {
                        updates.status = 'in_progress';
                    } else if (column.name.includes('Review') || column.name.includes('👀')) {
                        updates.status = 'review';
                    } else {
                        updates.status = 'todo';
                    }
                }
            }
        }

        // Update task
        const { data: updatedTask, error } = await (supabase as any)
            .from('kanban_tasks')
            .update(updates)
            .eq('id', task_id)
            .select()
            .single();

        if (error) {
            console.error('Error updating task:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // If auto_commit is enabled and status changed, create Git commit
        if (updatedTask.auto_commit && updates.status) {
            // TODO: Call Git API to create commit
            // This will be implemented in Phase 2
            console.log(`[Git] Task ${task_id} moved to ${updates.status}`);
        }

        return NextResponse.json({ task: updatedTask }, { status: 200 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/kanban/task - Delete a kanban task
export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const task_id = searchParams.get('id');

        if (!task_id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

        const { error } = await supabase
            .from('kanban_tasks')
            .delete()
            .eq('id', task_id);

        if (error) {
            console.error('Error deleting task:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
