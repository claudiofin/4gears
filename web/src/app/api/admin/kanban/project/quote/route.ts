import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/kanban/project/quote
 * Fetches or calculates a hypothetical quote for a project
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        // 1. Get existing quote if any
        const { data: existingQuote } = await supabase
            .from('project_quotes')
            .select('*')
            .eq('project_id', projectId)
            .maybeSingle();

        // 2. Get tasks to calculate hypothetical price
        const { data: tasks } = await supabase
            .from('kanban_tasks')
            .select('estimated_hours, priority')
            .eq('project_id', projectId);

        const totalEstimatedHours = (tasks || []).reduce((acc, task) => acc + (task.estimated_hours || 0), 0);
        const hasTasks = (tasks || []).length > 0;

        // MARKET RATES (Hypothetical)
        const MARKET_HOURLY_RATE = 120;
        const MARKET_BASE_FEE = 3500;
        const URGENT_TASKS_COUNT = (tasks || []).filter(t => t.priority === 'urgent' || t.priority === 'high').length;
        const URGENT_SURCHARGE = URGENT_TASKS_COUNT * 150;

        // Base fee is only applied if there are tasks or if a quote already exists
        const marketBase = hasTasks || existingQuote ? MARKET_BASE_FEE : 0;
        const calculatedMarketPrice = marketBase + (totalEstimatedHours * MARKET_HOURLY_RATE) + URGENT_SURCHARGE;

        // OUR RATES (Actual)
        const OUR_HOURLY_RATE = 60;
        const OUR_BASE_FEE = 900;
        const ourBase = hasTasks || existingQuote ? OUR_BASE_FEE : 0;
        const calculatedOurPrice = ourBase + (totalEstimatedHours * OUR_HOURLY_RATE);

        return NextResponse.json({
            quote: existingQuote,
            analysis: {
                totalHours: totalEstimatedHours,
                marketPrice: calculatedMarketPrice,
                ourPrice: existingQuote?.total_amount || calculatedOurPrice,
                savings: Math.max(0, calculatedMarketPrice - (existingQuote?.total_amount || calculatedOurPrice)),
                breakdown: {
                    base: marketBase,
                    hours: totalEstimatedHours * MARKET_HOURLY_RATE,
                    surcharge: URGENT_SURCHARGE
                }
            }
        });

    } catch (error: any) {
        console.error('Quote GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/admin/kanban/project/quote
 * Saves a formal quote
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createClient<any>(supabaseUrl, supabaseServiceKey);
        const body = await request.json();
        const { project_id, submission_id, total_amount, hypothetical_market_price, notes, status } = body;

        if (!project_id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const validStatuses = ['draft', 'sent', 'accepted', 'rejected'];
        const quoteStatus = status && validStatuses.includes(status) ? status : 'draft';

        const { data: quote, error } = await supabase
            .from('project_quotes')
            .upsert({
                project_id,
                submission_id: submission_id || null,
                total_amount,
                hypothetical_market_price,
                notes,
                status: quoteStatus,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'project_id',
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) {
            console.error('Database Error:', error);
            throw error;
        }

        return NextResponse.json({ quote });
    } catch (error: any) {
        console.error('Quote Save Error:', error);
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
    }
}
