import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const createServerSupabase = async () => {
    const cookieStore = await cookies();
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')
                }
            }
        }
    );
};

export async function GET(req: Request) {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get('submissionId');

    try {
        let query = supabase.from('project_tasks').select('*').order('created_at', { ascending: true });
        if (submissionId) {
            query = query.eq('submission_id', submissionId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const supabase = await createServerSupabase();

    try {
        const { submissionId, title } = await req.json();
        const { data, error } = await supabase
            .from('project_tasks')
            .insert({ submission_id: submissionId, title })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const supabase = await createServerSupabase();

    try {
        const { id, completed, title } = await req.json();
        const { data, error } = await supabase
            .from('project_tasks')
            .update({ completed, title, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const supabase = await createServerSupabase();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const { error } = await supabase
            .from('project_tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
