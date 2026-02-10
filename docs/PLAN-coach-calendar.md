# Plan: Coach Calendar & Interactive Convocations (Option B)

**Goal**: Implement the "Interactive Squad" flow where coaches can create events and manage athlete invitations/RSVPs.

## Context
- **User Choice**: Option B (Interactive Squad).
- **Current State**: `team_events` exists, `EventForm` creates simple events. Coaching Panel is accessible via `/dashboard/coach/[projectId]`.
- **Target State**: Coaches can select which athletes to invite, and see their RSVP status.

---

## Task Breakdown

### Phase 1: Interactive Convocations (UI)
- [x] **Component: `AthleteSelector.tsx`**
  - Searchable list of athletes associated with the project.
  - Multi-select functionality.
  - Integration into `EventForm.tsx`.
- [x] **Feature: Batch Invitations**
  - When an event is created, automatically create `event_attendance` records for each selected athlete with state `pending`.
- [x] **UI: Attendance Dashboard (Coach View)**
  - Expand the event card/detail in `CoachDashboardPage` to show real-time stats:
    - ✅ Going
    - ❌ Not Going
    - ⏳ Pending
    - ❓ Maybe

### Phase 2: Athlete Interaction (Simulator Preview)
- [x] **Simulator Page: `EventDetail`**
  - Render the event details from an athlete's perspective.
  - Add RSVP buttons (Accetto / Rifiuto).
- [x] **State Logic**:
  - Update `event_attendance` status in Supabase when an athlete clicks a button in the simulator (or mock it for now if auth is complex in preview).

### Phase 3: Roster Management for Coaches
- [x] **Invite Code Generator**:
  - Allow coaches to generate unique invite codes for "Athletes" to join their team.
- [x] **Roster Enhancements**:
  - Show "last activity" or "RSVP reliability" for athletes.

---

## Implementation Details

### Data Flow
1. **Event Creation**: `EventForm` -> `POST team_events` + `POST event_attendance` (array).
2. **Attendance Tracker**: `GET event_attendance` where `event_id = X`.
3. **RSVP Update**: `PATCH event_attendance` where `event_id = X AND user_id = Y`.

---

## Verification
- [ ] Coach can create an event and pick 3 athletes.
- [ ] Attendance list shows 3 "Pending" status.
- [ ] (Simulator) Athlete view shows buttons to confirm.
- [ ] Clicking "Confirm" in Simulator updates the Coach Dashboard (real-time or refresh).
