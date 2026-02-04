import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing authorization header' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Create a temporary client for this request to verify token and respect RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: { headers: { Authorization: authHeader } }
            }
        );

        // Verify token and get user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { projectId, notes, config } = body;

        // Validation
        if (!projectId || !notes || !config) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (notes.trim().length < 5) {
            return NextResponse.json(
                { error: 'Le note devono contenere almeno 5 caratteri' },
                { status: 400 }
            );
        }

        // Verify project ownership
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('user_id')
            .eq('id', projectId)
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        if (project.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Unauthorized access to project' },
                { status: 403 }
            );
        }

        // Create submission request
        const { data, error } = await supabase
            .from('submission_requests')
            .insert({
                user_id: user.id,
                project_id: projectId,
                config,
                notes: notes.trim(),
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            console.error('Submission error:', error);
            return NextResponse.json(
                { error: 'Failed to create submission' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, submission: data });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
