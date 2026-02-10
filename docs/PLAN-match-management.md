# Plan: Real-Time Match Management

**Goal**: Enable coaches to manage live matches, track scores and events (goals, cards) in real-time, and link them to scheduled calendar events.

## Tasks

### Phase 1: Match Initialization
- [ ] **UI: "Avvia Match" Button**
  - Add to the Calendar tab for events of type `match`.
  - Check if a `matches` record already exists for the given `event_id`.
- [ ] **Logic: Match Creation**
  - If no match exists, create one with default scores (0-0) and status 'live'.
  - Link it to the `project_id` and `event_id`.

### Phase 2: Live Console (Modal)
- [x] **Component: `MatchManagementModal`**
  - Scoreboard with +/- controls.
  - Match status toggle (Scheduled, Live, Final).
  - Event Timeline (fetching `match_events`).
- [x] **Feature: Event Registration**
  - Goal, Yellow Card, Red Card, Substitution.
  - Associate events with athletes from the roster.

### Phase 3: Simulator Integration
- [ ] **Simulator: Live Scoreboard**
  - Show live score and recent events in the athlete/fan view.
  - Implement real-time updates (Supabase Realtime).

### Phase 4: Match Feedback & Stats
- [ ] **Stats Calculation**
  - Aggregated stats for athletes based on `match_events` (Total Goals, Cards).
  - Update Project/Team stats.

---

## Technical Details
- **Tables**: `matches`, `match_events`.
- **Realtime**: Enable Supabase Realtime on `matches` and `match_events`.
- **RBAC**: Only coaches/admins can insert/update/delete match data.
