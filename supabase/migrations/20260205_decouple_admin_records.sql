-- Migration to decouple Submissions and Kanban Projects from the source Builder Project
-- This ensures that deleting a project in the builder doesn't destroy the admin's record of the request or the resulting work board.

-- 1. Make project_id nullable in submission_requests
ALTER TABLE submission_requests 
ALTER COLUMN project_id DROP NOT NULL;

-- 2. Update submission_requests foreign key to projects
ALTER TABLE submission_requests
DROP CONSTRAINT IF EXISTS submission_requests_project_id_fkey,
ADD CONSTRAINT submission_requests_project_id_fkey 
    FOREIGN KEY (project_id) 
    REFERENCES projects(id) 
    ON DELETE SET NULL;

-- 3. Update kanban_projects foreign key to submission_requests
ALTER TABLE kanban_projects
DROP CONSTRAINT IF EXISTS kanban_projects_submission_id_fkey,
ADD CONSTRAINT kanban_projects_submission_id_fkey 
    FOREIGN KEY (submission_id) 
    REFERENCES submission_requests(id) 
    ON DELETE SET NULL;
