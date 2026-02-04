import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get current user
        return NextResponse.json(
            { error: 'Missing authorization header' },
            { status: 401 }
        );
    }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Non autenticato' },
            { status: 401 }
        );
    }

    // Parse request body
    const { projectId, notes, config } = await request.json();

    // Validate input
    if (!projectId || !notes || !config) {
        return NextResponse.json(
            { error: 'Dati mancanti' },
            { status: 400 }
        );
    }

    if (notes.trim().length < 10) {
        return NextResponse.json(
            { error: 'Le note devono contenere almeno 10 caratteri' },
            { status: 400 }
        );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, user_id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (projectError || !project) {
        return NextResponse.json(
            { error: 'Progetto non trovato' },
            { status: 404 }
        );
    }

    // Create submission request
    const { data: submission, error: submissionError } = await supabase
        .from('submission_requests')
        .insert([
            {
                user_id: user.id,
                project_id: projectId,
                config,
                notes: notes.trim(),
                status: 'pending'
            }
        ])
        .select()
        .single();

    if (submissionError) {
        console.error('Submission error:', submissionError);
        return NextResponse.json(
            { error: 'Errore nella creazione della richiesta' },
            { status: 500 }
        );
    }

    // TODO: Send email notification to admin
    // This can be implemented later using a service like SendGrid or Resend

    return NextResponse.json(
        {
            success: true,
            submission
        },
        { status: 200 }
    );

} catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
        { error: 'Errore del server' },
        { status: 500 }
    );
}
}
