export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            admin_settings: {
                Row: {
                    created_at: string | null
                    id: string
                    key: string
                    updated_at: string | null
                    value: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    key: string
                    updated_at?: string | null
                    value: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    key?: string
                    updated_at?: string | null
                    value?: string
                }
                Relationships: []
            }
            app_tiers: {
                Row: {
                    created_at: string
                    description: string | null
                    features: Json | null
                    id: string
                    interval: string | null
                    is_active: boolean | null
                    name: string
                    price: number
                    project_id: string | null
                    revenuecat_id: string | null
                    stripe_price_id: string | null
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    features?: Json | null
                    id?: string
                    interval?: string | null
                    is_active?: boolean | null
                    name: string
                    price: number
                    project_id?: string | null
                    revenuecat_id?: string | null
                    stripe_price_id?: string | null
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    features?: Json | null
                    id?: string
                    interval?: string | null
                    is_active?: boolean | null
                    name?: string
                    price?: number
                    project_id?: string | null
                    revenuecat_id?: string | null
                    stripe_price_id?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "app_tiers_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            event_attendance: {
                Row: {
                    event_id: string
                    notes: string | null
                    status: Database["public"]["Enums"]["attendance_status"] | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    event_id: string
                    notes?: string | null
                    status?: Database["public"]["Enums"]["attendance_status"] | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    event_id?: string
                    notes?: string | null
                    status?: Database["public"]["Enums"]["attendance_status"] | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "event_attendance_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "team_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "event_attendance_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            invite_codes: {
                Row: {
                    code: string
                    created_at: string | null
                    id: string
                    role: string | null
                    used: boolean | null
                    used_at: string | null
                    used_by: string | null
                }
                Insert: {
                    code: string
                    created_at?: string | null
                    id?: string
                    role?: string | null
                    used?: boolean | null
                    used_at?: string | null
                    used_by?: string | null
                }
                Update: {
                    code?: string
                    created_at?: string | null
                    id?: string
                    role?: string | null
                    used?: boolean | null
                    used_at?: string | null
                    used_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "invite_codes_used_by_fkey"
                        columns: ["used_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kanban_columns: {
                Row: {
                    color: string
                    created_at: string
                    id: string
                    name: string
                    position: number
                    project_id: string | null
                    updated_at: string
                }
                Insert: {
                    color?: string
                    created_at?: string
                    id?: string
                    name: string
                    position: number
                    project_id?: string | null
                    updated_at?: string
                }
                Update: {
                    color?: string
                    created_at?: string
                    id?: string
                    name?: string
                    position?: number
                    project_id?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "kanban_columns_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "kanban_projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kanban_labels: {
                Row: {
                    color: string
                    created_at: string
                    id: string
                    name: string
                }
                Insert: {
                    color: string
                    created_at?: string
                    id?: string
                    name: string
                }
                Update: {
                    color?: string
                    created_at?: string
                    id?: string
                    name?: string
                }
                Relationships: []
            }
            kanban_projects: {
                Row: {
                    created_at: string
                    description: string | null
                    github_repo_name: string | null
                    github_repo_url: string | null
                    id: string
                    name: string
                    status: string
                    submission_id: string | null
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    github_repo_name?: string | null
                    github_repo_url?: string | null
                    id?: string
                    name: string
                    status?: string
                    submission_id?: string | null
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    github_repo_name?: string | null
                    github_repo_url?: string | null
                    id?: string
                    name?: string
                    status?: string
                    submission_id?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "kanban_projects_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "submission_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kanban_task_labels: {
                Row: {
                    label_id: string
                    task_id: string
                }
                Insert: {
                    label_id: string
                    task_id: string
                }
                Update: {
                    label_id?: string
                    task_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "kanban_task_labels_label_id_fkey"
                        columns: ["label_id"]
                        isOneToOne: false
                        referencedRelation: "kanban_labels"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kanban_task_labels_task_id_fkey"
                        columns: ["task_id"]
                        isOneToOne: false
                        referencedRelation: "kanban_tasks"
                        referencedColumns: ["id"]
                    },
                ]
            }
            kanban_tasks: {
                Row: {
                    actual_hours: number | null
                    assigned_to: string | null
                    auto_commit: boolean | null
                    column_id: string | null
                    completed_at: string | null
                    created_at: string
                    description: string | null
                    due_date: string | null
                    estimated_hours: number | null
                    git_branch: string | null
                    git_commit_hash: string | null
                    github_issue_number: number | null
                    id: string
                    position: number
                    priority: Database["public"]["Enums"]["task_priority"]
                    project_id: string | null
                    status: Database["public"]["Enums"]["task_status"]
                    submission_request_id: string | null
                    title: string
                    updated_at: string
                }
                Insert: {
                    actual_hours?: number | null
                    assigned_to?: string | null
                    auto_commit?: boolean | null
                    column_id?: string | null
                    completed_at?: string | null
                    created_at?: string
                    description?: string | null
                    due_date?: string | null
                    estimated_hours?: number | null
                    git_branch?: string | null
                    git_commit_hash?: string | null
                    github_issue_number?: number | null
                    id?: string
                    position: number
                    priority?: Database["public"]["Enums"]["task_priority"]
                    project_id?: string | null
                    status?: Database["public"]["Enums"]["task_status"]
                    submission_request_id?: string | null
                    title: string
                    updated_at?: string
                }
                Update: {
                    actual_hours?: number | null
                    assigned_to?: string | null
                    auto_commit?: boolean | null
                    column_id?: string | null
                    completed_at?: string | null
                    created_at?: string
                    description?: string | null
                    due_date?: string | null
                    estimated_hours?: number | null
                    git_branch?: string | null
                    git_commit_hash?: string | null
                    github_issue_number?: number | null
                    id?: string
                    position?: number
                    priority?: Database["public"]["Enums"]["task_priority"]
                    project_id?: string | null
                    status?: Database["public"]["Enums"]["task_status"]
                    submission_request_id?: string | null
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "kanban_tasks_column_id_fkey"
                        columns: ["column_id"]
                        isOneToOne: false
                        referencedRelation: "kanban_columns"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kanban_tasks_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "kanban_projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "kanban_tasks_submission_request_id_fkey"
                        columns: ["submission_request_id"]
                        isOneToOne: false
                        referencedRelation: "submission_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            matches: {
                Row: {
                    created_at: string | null
                    event_id: string | null
                    id: string
                    is_home_game: boolean | null
                    opponent_name: string
                    project_id: string | null
                    score_away: number | null
                    score_home: number | null
                    status: Database["public"]["Enums"]["match_status"] | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    event_id?: string | null
                    id?: string
                    is_home_game?: boolean | null
                    opponent_name: string
                    project_id?: string | null
                    score_away?: number | null
                    score_home?: number | null
                    status?: Database["public"]["Enums"]["match_status"] | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    event_id?: string | null
                    id?: string
                    is_home_game?: boolean | null
                    opponent_name?: string
                    project_id?: string | null
                    score_away?: number | null
                    score_home?: number | null
                    status?: Database["public"]["Enums"]["match_status"] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "matches_event_id_fkey"
                        columns: ["event_id"]
                        isOneToOne: false
                        referencedRelation: "team_events"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "matches_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    email: string | null
                    first_name: string | null
                    id: string
                    last_name: string | null
                    role: Database["public"]["Enums"]["user_role"]
                    role_details: Json | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    first_name?: string | null
                    id: string
                    last_name?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    role_details?: Json | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string | null
                    first_name?: string | null
                    id?: string
                    last_name?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    role_details?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            project_quotes: {
                Row: {
                    created_at: string
                    hypothetical_market_price: number | null
                    id: string
                    notes: string | null
                    project_id: string | null
                    status: string
                    submission_id: string | null
                    total_amount: number
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    hypothetical_market_price?: number | null
                    id?: string
                    notes?: string | null
                    project_id?: string | null
                    status?: string
                    submission_id?: string | null
                    total_amount: number
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    hypothetical_market_price?: number | null
                    id?: string
                    notes?: string | null
                    project_id?: string | null
                    status?: string
                    submission_id?: string | null
                    total_amount?: number
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "project_quotes_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_quotes_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "submission_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            project_tasks: {
                Row: {
                    completed: boolean | null
                    created_at: string
                    id: string
                    submission_id: string
                    title: string
                }
                Insert: {
                    completed?: boolean | null
                    created_at?: string
                    id?: string
                    submission_id: string
                    title: string
                }
                Update: {
                    completed?: boolean | null
                    created_at?: string
                    id?: string
                    submission_id?: string
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "project_tasks_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "submission_requests"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    config: Json
                    created_at: string
                    id: string
                    monetization_config: Json
                    name: string
                    updated_at: string
                    user_id: string
                    user_notes: string | null
                }
                Insert: {
                    config: Json
                    created_at?: string
                    id?: string
                    monetization_config?: Json
                    name: string
                    updated_at?: string
                    user_id: string
                    user_notes?: string | null
                }
                Update: {
                    config?: Json
                    created_at?: string
                    id?: string
                    monetization_config?: Json
                    name?: string
                    updated_at?: string
                    user_id?: string
                    user_notes?: string | null
                }
                Relationships: []
            }
            submission_requests: {
                Row: {
                    config: Json
                    created_at: string
                    github_repo_name: string | null
                    github_repo_url: string | null
                    id: string
                    notes: string
                    phone_number: string | null
                    project_id: string
                    status: string
                    test_email: string | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    config: Json
                    created_at?: string
                    github_repo_name?: string | null
                    github_repo_url?: string | null
                    id?: string
                    notes: string
                    phone_number?: string | null
                    project_id: string
                    status?: string
                    test_email?: string | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    config?: Json
                    created_at?: string
                    github_repo_name?: string | null
                    github_repo_url?: string | null
                    id?: string
                    notes?: string
                    phone_number?: string | null
                    project_id?: string
                    status?: string
                    test_email?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "submission_requests_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            team_events: {
                Row: {
                    created_at: string | null
                    description: string | null
                    end_time: string
                    event_type: Database["public"]["Enums"]["event_type"] | null
                    id: string
                    location: string | null
                    project_id: string | null
                    start_time: string
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    end_time: string
                    event_type?: Database["public"]["Enums"]["event_type"] | null
                    id?: string
                    location?: string | null
                    project_id?: string | null
                    start_time: string
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    end_time?: string
                    event_type?: Database["public"]["Enums"]["event_type"] | null
                    id?: string
                    location?: string | null
                    project_id?: string | null
                    start_time?: string
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "team_events_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: {
                Args: {
                    user_id: string
                }
                Returns: boolean
            }
        }
        Enums: {
            attendance_status: "pending" | "going" | "not_going" | "maybe"
            event_type: "training" | "match" | "meeting" | "other"
            match_status: "scheduled" | "live" | "potential" | "final"
            task_priority: "low" | "medium" | "high" | "urgent"
            task_status: "todo" | "in_progress" | "review" | "done"
            user_role: "admin" | "user" | "coach" | "athlete" | "fan"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for convenience
export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type InviteCode = Database["public"]["Tables"]["invite_codes"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type SubmissionRequest = Database["public"]["Tables"]["submission_requests"]["Row"]
export type KanbanProject = Database["public"]["Tables"]["kanban_projects"]["Row"]
export type KanbanColumn = Database["public"]["Tables"]["kanban_columns"]["Row"]
export type KanbanLabel = Database["public"]["Tables"]["kanban_labels"]["Row"]
export type KanbanTask = Database["public"]["Tables"]["kanban_tasks"]["Row"]
export type KanbanTaskLabel = Database["public"]["Tables"]["kanban_task_labels"]["Row"]
export type ProjectQuote = Database["public"]["Tables"]["project_quotes"]["Row"]
export type AppTier = Database["public"]["Tables"]["app_tiers"]["Row"]
export type TeamEvent = Database["public"]["Tables"]["team_events"]["Row"]
export type EventAttendance = Database["public"]["Tables"]["event_attendance"]["Row"]
export type Match = Database["public"]["Tables"]["matches"]["Row"]

export type UserRole = Database["public"]["Enums"]["user_role"]
export type TaskStatus = Database["public"]["Enums"]["task_status"]
export type TaskPriority = Database["public"]["Enums"]["task_priority"]
