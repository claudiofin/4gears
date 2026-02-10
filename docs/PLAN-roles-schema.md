# Plan: Update Database Schema for User Roles

**Goal**: Update the Supabase database schema to support new user roles (Fan, Coach, Athlete) and their core operational data (Events, Matches).

## Context
- **Current State**: `user_roles` enum only has `admin`, `user`. `profiles` table is minimal.
- **Target State**: robust schema supporting team management features.

## Task Breakdown

### Phase 1: Enums & Profiles
- [ ] **Migration 1**: Update `user_roles` enum
  - Add: `'coach'`, `'athlete'`, `'fan'`
- [ ] **Migration 2**: Update `profiles` table
  - Add `first_name`, `last_name` (split from raw metadata if needed, or just new columns)
  - Add `avatar_url` (if not present or rely on storage)
  - Add `role_details` (JSONB) for role-specific data (e.g., position, certifications)

### Phase 2: Core Team Tables
- [ ] **Migration 3**: Create `team_events` table
  - `id` (UUID, PK)
  - `project_id` (FK to projects)
  - `title`, `description`
  - `start_time`, `end_time`
  - `event_type` (enum: 'training', 'match', 'meeting', 'other')
  - `location` (text or JSON)
- [ ] **Migration 4**: Create `event_attendance` table
  - `event_id` (FK)
  - `user_id` (FK)
  - `status` (enum: 'pending', 'going', 'not_going', 'maybe')
  - `notes` (text)

### Phase 3: Match Data (Initial)
- [ ] **Migration 5**: Create `matches` table
  - `id` (UUID, PK)
  - `project_id` (FK)
  - `opponent_name`
  - `is_home_game` (boolean)
  - `score_home`, `score_away`
  - `status` (scheduled, live, potential, final)

### Phase 4: TypeScript Integration
- [ ] Run `npx supabase gen types typescript`
- [ ] Update `src/types/database.ts`

## Verification
- [ ] Verify new roles can be assigned in `profiles`.
- [ ] Verify foreign keys work for events and attendance.
- [ ] Check RLS policies (Drafting policies: Admins/Coaches can CRUD events; Athletes/Fans can Read).
