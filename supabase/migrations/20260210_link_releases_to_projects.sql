-- Migration: Link Application Releases to Kanban Projects and Submission Requests
-- Description: Adds project_id and submission_id columns to application_releases table

-- 1. Add project_id column
ALTER TABLE application_releases 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES kanban_projects(id) ON DELETE SET NULL;

-- 2. Add submission_id column
ALTER TABLE application_releases 
ADD COLUMN IF NOT EXISTS submission_id UUID REFERENCES submission_requests(id) ON DELETE SET NULL;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_application_releases_project_id ON application_releases(project_id);
CREATE INDEX IF NOT EXISTS idx_application_releases_submission_id ON application_releases(submission_id);

-- 4. Add comments
COMMENT ON COLUMN application_releases.project_id IS 'Reference to the project this release belongs to';
COMMENT ON COLUMN application_releases.submission_id IS 'Reference to the submission request associated with this release';
