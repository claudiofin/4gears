-- Migration: Add project-specific Kanban support
-- Description: Creates kanban_projects table and links existing tables to projects

-- 1. Create kanban_projects table
CREATE TABLE IF NOT EXISTS kanban_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES submission_requests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    github_repo_url TEXT,
    github_repo_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add project_id to kanban_columns
ALTER TABLE kanban_columns 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES kanban_projects(id) ON DELETE CASCADE;

-- 3. Add project_id to kanban_tasks
ALTER TABLE kanban_tasks 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES kanban_projects(id) ON DELETE CASCADE;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kanban_projects_submission_id ON kanban_projects(submission_id);
CREATE INDEX IF NOT EXISTS idx_kanban_projects_status ON kanban_projects(status);
CREATE INDEX IF NOT EXISTS idx_kanban_columns_project_id ON kanban_columns(project_id);
CREATE INDEX IF NOT EXISTS idx_kanban_tasks_project_id ON kanban_tasks(project_id);

-- 5. Create updated_at trigger for kanban_projects
CREATE OR REPLACE FUNCTION update_kanban_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_kanban_projects_updated_at
    BEFORE UPDATE ON kanban_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_kanban_projects_updated_at();

-- 6. Add RLS policies for kanban_projects
ALTER TABLE kanban_projects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all projects
CREATE POLICY "Allow authenticated users to read kanban_projects"
    ON kanban_projects FOR SELECT
    TO authenticated
    USING (true);

-- Allow admins to insert/update/delete projects
CREATE POLICY "Allow admins to manage kanban_projects"
    ON kanban_projects FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 7. Update existing RLS policies for kanban_columns and kanban_tasks
-- to include project_id checks (optional, for future multi-tenancy)

COMMENT ON TABLE kanban_projects IS 'Kanban projects linked to submission requests';
COMMENT ON COLUMN kanban_projects.submission_id IS 'Reference to the approved submission request';
COMMENT ON COLUMN kanban_projects.status IS 'Project status: active, archived, or completed';
