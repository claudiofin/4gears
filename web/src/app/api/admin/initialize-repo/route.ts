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

        const { submissionId, repoName, description } = await req.json();

        // 1. Fetch GitHub PAT
        const { data: setting } = await supabase
            .from('admin_settings')
            .select('value')
            .eq('key', 'github_pat')
            .single();

        if (!setting?.value) {
            return NextResponse.json({ error: 'GitHub PAT non configurato nelle impostazioni' }, { status: 400 });
        }

        // 2. Fetch Submission details for config
        const { data: submission } = await supabase
            .from('submission_requests')
            .select('*, profiles(email)')
            .eq('id', submissionId)
            .single();

        if (!submission) {
            return NextResponse.json({ error: 'Richiesta non trovata' }, { status: 404 });
        }

        const PAT = setting.value;

        // 3. Create Repository
        const createRepoResponse = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify({
                name: repoName,
                description: description || `4Gears Project: ${repoName}`,
                private: true,
                auto_init: true // Create an initial commit with a README
            })
        });

        const repoData = await createRepoResponse.json();
        if (!createRepoResponse.ok) {
            return NextResponse.json({ error: `GitHub: ${repoData.message}` }, { status: createRepoResponse.status });
        }

        const repoFullUrl = repoData.html_url;
        const [owner, name] = repoData.full_name.split('/');

        // 4. Create config.json in the repo
        const configContent = JSON.stringify(submission.config, null, 2);
        const createConfigResponse = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/config.json`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify({
                message: 'Initialize project config',
                content: Buffer.from(configContent).toString('base64'),
                branch: 'main'
            })
        });

        if (!createConfigResponse.ok) {
            console.error('Failed to create config.json', await createConfigResponse.json());
        }

        // 5. Update submission in database
        const { error: updateError } = await supabase
            .from('submission_requests')
            .update({
                github_repo_url: repoFullUrl,
                github_repo_name: repoData.full_name,
                status: 'in_progress'
            })
            .eq('id', submissionId);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            repoUrl: repoFullUrl,
            repoName: repoData.full_name
        });

    } catch (error: any) {
        console.error('Error initializing repo:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
