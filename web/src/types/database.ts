export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            invite_codes: {
                Row: {
                    id: string
                    code: string
                    used: boolean
                    used_by: string | null
                    created_at: string
                    used_at: string | null
                }
                Insert: {
                    id?: string
                    code: string
                    used?: boolean
                    used_by?: string | null
                    created_at?: string
                    used_at?: string | null
                }
                Update: {
                    id?: string
                    code?: string
                    used?: boolean
                    used_by?: string | null
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
                    notes: string | null
                    status: 'pending' | 'in_progress' | 'completed' | 'rejected'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    project_id: string
                    config: Json
                    notes?: string | null
                    status?: 'pending' | 'in_progress' | 'completed' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    project_id?: string
                    config?: Json
                    notes?: string | null
                    status?: 'pending' | 'in_progress' | 'completed' | 'rejected'
                    created_at?: string
                    updated_at?: string
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
