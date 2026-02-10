import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

        const { data: releases, error } = await supabase
            .from('application_releases')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ releases });
    } catch (error: any) {
        console.error('Error fetching releases:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch releases' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
        const body = await request.json();

        const { projectName, version, platform, status, assets } = body;

        const { data: release, error } = await supabase
            .from('application_releases')
            .insert({
                project_name: projectName,
                version,
                platform,
                status: status || 'pending',
                assets: assets || { screenshots: 0, banner: false }
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ release }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating release:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create release' },
            { status: 500 }
        );
    }
}
