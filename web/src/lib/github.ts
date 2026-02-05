import { Octokit } from 'octokit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Gets the GitHub Personal Access Token from Admin Settings
 */
async function getGitHubToken() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: setting } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'github_pat')
        .single();

    return setting?.value;
}

/**
 * Creates a new GitHub repository for a project
 */
export async function createGitHubRepo(name: string, description?: string) {
    const token = await getGitHubToken();
    if (!token) {
        console.warn('⚠️ GitHub PAT not configured. Skipping repo creation.');
        return null;
    }

    const octokit = new Octokit({ auth: token });

    try {
        // Create the repository
        const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
            name: name.toLowerCase().replace(/\s+/g, '-'),
            description: description || `4Gears Project: ${name}`,
            private: true,
            auto_init: true, // Creates an initial commit with a README
        });

        return {
            url: repo.html_url,
            name: repo.name,
            owner: repo.owner.login
        };
    } catch (error: unknown) {
        console.error('❌ Error creating GitHub repository:', error);
        throw error;
    }
}

/**
 * Creates a new branch in a repository
 */
export async function createGitHubBranch(repoName: string, branchName: string) {
    const token = await getGitHubToken();
    if (!token) return null;

    const octokit = new Octokit({ auth: token });

    try {
        // Get the authenticated user
        const { data: user } = await octokit.rest.users.getAuthenticated();
        const owner = user.login;

        // Get the default branch (usually main) to get the latest SHA
        const { data: repo } = await octokit.rest.repos.get({
            owner,
            repo: repoName
        });

        const { data: ref } = await octokit.rest.git.getRef({
            owner,
            repo: repoName,
            ref: `heads/${repo.default_branch}`
        });

        // Create the new branch
        await octokit.rest.git.createRef({
            owner,
            repo: repoName,
            ref: `refs/heads/${branchName}`,
            sha: ref.object.sha
        });

        return branchName;
    } catch (error: unknown) {
        console.error(`❌ Error creating branch ${branchName} in ${repoName}:`, error);
        return null;
    }
}

/**
 * Creates a GitHub Issue for a task
 */
export async function createGitHubIssue(repoName: string, title: string, body: string) {
    const token = await getGitHubToken();
    if (!token) return null;

    const octokit = new Octokit({ auth: token });

    try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        const { data: issue } = await octokit.rest.issues.create({
            owner: user.login,
            repo: repoName,
            title,
            body
        });
        return issue.number;
    } catch (error) {
        console.error('❌ Error creating GitHub issue:', error);
        return null;
    }
}

/**
 * Adds a comment to a GitHub Issue
 */
export async function commentGitHubIssue(repoName: string, issueNumber: number, comment: string) {
    const token = await getGitHubToken();
    if (!token) return null;

    const octokit = new Octokit({ auth: token });

    try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        await octokit.rest.issues.createComment({
            owner: user.login,
            repo: repoName,
            issue_number: issueNumber,
            body: comment
        });
        return true;
    } catch (error) {
        console.error('❌ Error commenting on GitHub issue:', error);
        return false;
    }
}

