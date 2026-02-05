import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/user/app-tiers
 * Fetches tiers for the user's project
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const { data: tiers, error } = await supabase
            .from('app_tiers')
            .select('*')
            .eq('project_id', projectId)
            .order('price', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ tiers });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/user/app-tiers
 * Saves tiers for the project
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const body = await request.json();
        const { projectId, tiers } = body;

        if (!projectId || !Array.isArray(tiers)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Delete existing and bulk insert sounds risky if they want to update
        // Using upsert would be better if we had IDs

        // For simplicity in this iteration, we'll clear and re-insert 
        // OR better: handle them one by one if they have IDs

        const preparedTiers = tiers.map((tier: any) => ({
            ...tier,
            project_id: projectId,
            updated_at: new Date().toISOString()
        }));

        const { data: savedTiers, error } = await supabase
            .from('app_tiers')
            .upsert(preparedTiers)
            .select();

        if (error) throw error;

        return NextResponse.json({ tiers: savedTiers });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
