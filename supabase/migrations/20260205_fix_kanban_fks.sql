-- Add foreign key for assigned_to
ALTER TABLE kanban_tasks 
ADD CONSTRAINT fk_kanban_tasks_assigned_to 
FOREIGN KEY (assigned_to) 
REFERENCES profiles(id) 
ON DELETE SET NULL;

-- Ensure submission_request_id has correct foreign key
ALTER TABLE kanban_tasks
DROP CONSTRAINT IF EXISTS kanban_tasks_submission_request_id_fkey,
ADD CONSTRAINT fk_kanban_tasks_submission_request 
FOREIGN KEY (submission_request_id) 
REFERENCES submission_requests(id) 
ON DELETE SET NULL;
