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

export async function GET() {
    const supabase = await createServerSupabase();

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: setting, error } = await supabase
            .from('admin_settings')
            .select('value')
            .eq('key', 'github_pat')
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // Return masked PAT if it exists
        return NextResponse.json({
            hasPat: !!setting?.value,
            maskedPat: setting?.value ? `ghp_****${setting.value.slice(-4)}` : null
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const supabase = await createServerSupabase();

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { pat } = await req.json();
        if (!pat) {
            return NextResponse.json({ error: 'PAT is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('admin_settings')
            .upsert({
                key: 'github_pat',
                value: pat,
                updated_at: new Date().toISOString() // Force updated_at
            }, { onConflict: 'key' });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
