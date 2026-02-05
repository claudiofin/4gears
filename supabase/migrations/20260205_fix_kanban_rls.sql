-- Fix RLS policies for kanban_projects to work with service role
-- This allows the API to create projects using service role key

-- Drop existing admin policy
DROP POLICY IF EXISTS "Allow admins to manage kanban_projects" ON kanban_projects;

-- Create new policy that works with service role
-- Service role bypasses RLS, but we add this for clarity
CREATE POLICY "Allow service role to manage kanban_projects"
    ON kanban_projects FOR ALL
    USING (true)
    WITH CHECK (true);

-- Also allow authenticated admins (for direct DB access)
CREATE POLICY "Allow authenticated admins to manage kanban_projects"
    ON kanban_projects FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
