import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const { projectId, status } = await request.json();

        if (!projectId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Update the quote status
        const { data, error } = await supabase
            .from('project_quotes')
            .update({ status: status })
            .eq('project_id', projectId)
            .select()
            .single();

        if (error) throw error;

        // 2. If accepted, we could also update the project status or send a webhook
        // For now just return the updated quote

        return NextResponse.json({ success: true, quote: data });
    } catch (error: any) {
        console.error('Accept Quote Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
