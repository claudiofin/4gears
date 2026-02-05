export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Database {
    public: {
        Tables: {
            invite_codes: {
                Row: {
                    id: string
                    code: string
                    used: boolean
                    used_by: string | null
                    role: string | null
                    created_at: string
                    used_at: string | null
                }
                Insert: {
                    id?: string
                    code: string
                    used?: boolean
                    used_by?: string | null
                    role?: string | null
                    created_at?: string
                    used_at?: string | null
                }
                Update: {
                    id?: string
                    code?: string
                    used?: boolean
                    used_by?: string | null
                    role?: string | null
                    created_at?: string
                    used_at?: string | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    role: 'admin' | 'user'
                    email: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    role?: 'admin' | 'user'
                    email?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    role?: 'admin' | 'user'
                    email?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            projects: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    config: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    config: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    config?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            submission_requests: {
                Row: {
                    id: string
                    user_id: string
                    project_id: string
                    config: Json
                    notes: string
                    status: 'pending' | 'completed' | 'rejected'
                    test_email: string | null
                    phone_number: string | null
                    github_repo_url: string | null
                    github_repo_name: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    project_id: string
                    config: Json
                    notes: string
                    status?: 'pending' | 'completed' | 'rejected'
                    test_email?: string | null
                    phone_number?: string | null
                    github_repo_url?: string | null
                    github_repo_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    project_id?: string
                    config?: Json
                    notes?: string
                    status?: 'pending' | 'completed' | 'rejected'
                    test_email?: string | null
                    phone_number?: string | null
                    github_repo_url?: string | null
                    github_repo_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            kanban_projects: {
                Row: {
                    id: string
                    submission_id: string | null
                    name: string
                    description: string | null
                    github_repo_url: string | null
                    github_repo_name: string | null
                    status: 'active' | 'archived' | 'completed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    submission_id?: string | null
                    name: string
                    description?: string | null
                    github_repo_url?: string | null
                    github_repo_name?: string | null
                    status?: 'active' | 'archived' | 'completed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    submission_id?: string | null
                    name?: string
                    description?: string | null
                    github_repo_url?: string | null
                    github_repo_name?: string | null
                    status?: 'active' | 'archived' | 'completed'
                    created_at?: string
                    updated_at?: string
                }
            }
            kanban_columns: {
                Row: {
                    id: string
                    project_id: string | null
                    name: string
                    position: number
                    color: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    name: string
                    position: number
                    color?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    name?: string
                    position?: number
                    color?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            kanban_labels: {
                Row: {
                    id: string
                    name: string
                    color: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    color: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    color?: string
                    created_at?: string
                }
            }
            kanban_tasks: {
                Row: {
                    id: string
                    project_id: string | null
                    title: string
                    description: string | null
                    column_id: string | null
                    position: number
                    priority: TaskPriority
                    status: TaskStatus
                    git_branch: string | null
                    git_commit_hash: string | null
                    auto_commit: boolean
                    assigned_to: string | null
                    due_date: string | null
                    estimated_hours: number | null
                    actual_hours: number | null
                    submission_request_id: string | null
                    created_at: string
                    updated_at: string
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    title: string
                    description?: string | null
                    column_id?: string | null
                    position?: number
                    priority?: TaskPriority
                    status?: TaskStatus
                    git_branch?: string | null
                    git_commit_hash?: string | null
                    auto_commit?: boolean
                    assigned_to?: string | null
                    due_date?: string | null
                    estimated_hours?: number | null
                    actual_hours?: number | null
                    submission_request_id?: string | null
                    created_at?: string
                    updated_at?: string
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    title?: string
                    description?: string | null
                    column_id?: string | null
                    position?: number
                    priority?: TaskPriority
                    status?: TaskStatus
                    git_branch?: string | null
                    git_commit_hash?: string | null
                    auto_commit?: boolean
                    assigned_to?: string | null
                    due_date?: string | null
                    estimated_hours?: number | null
                    actual_hours?: number | null
                    submission_request_id?: string | null
                    created_at?: string
                    updated_at?: string
                    completed_at?: string | null
                }
            }
            kanban_task_labels: {
                Row: {
                    task_id: string
                    label_id: string
                }
                Insert: {
                    task_id: string
                    label_id: string
                }
                Update: {
                    task_id?: string
                    label_id?: string
                }
            }
            admin_settings: {
                Row: {
                    id: string
                    key: string
                    value: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    value: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    value?: string
                    updated_at?: string
                }
            }
            project_tasks: {
                Row: {
                    id: string
                    submission_id: string
                    title: string
                    completed: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    submission_id: string
                    title: string
                    completed?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    submission_id?: string
                    title?: string
                    completed?: boolean
                    created_at?: string
                }
            }
        }
    }
}

// Helper types for convenience
export type Project = Database['public']['Tables']['projects']['Row'];
export type InviteCode = Database['public']['Tables']['invite_codes']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SubmissionRequest = Database['public']['Tables']['submission_requests']['Row'];
export type KanbanProject = Database['public']['Tables']['kanban_projects']['Row'];
export type KanbanColumn = Database['public']['Tables']['kanban_columns']['Row'];
export type KanbanLabel = Database['public']['Tables']['kanban_labels']['Row'];
export type KanbanTask = Database['public']['Tables']['kanban_tasks']['Row'];
export type KanbanTaskLabel = Database['public']['Tables']['kanban_task_labels']['Row'];
