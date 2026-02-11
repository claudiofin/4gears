# PLAN: Git & Bot Integration (Clowbot/Roboflow)

## Goal
Coordinate the handoff between the 4Gears Admin Panel and the mobile generation bot. This involves automating the repository creation, packaging all design and functional data, and triggering the external "Bot" for build processing.

## Current State Analysis
- **Git Provider**: GitHub (configured via Admin Settings).
- **Initialization**: `/api/admin/initialize-repo` creates private repos and uploads `config.json` + `SPECS.md`.
- **Data Packaging**: `HandoverEngine` now snapshots precision design tokens (identitySnapshot) into the submission.
- **Bot Interface**: Undefined. The user originally mentioned "Clowbot" and is now asking about "Roboflow".

## Proposed Architecture

### 1. Enhanced Handover Package (Backend Specialist)
- **File**: `handover_manifest.json`
- **Content**: 
  - `identitySnapshot`: Colors, spacing, border radii.
  - `technicalDirectives`: Context-aware prompts for the AI builder.
  - `projectMetadata`: Name, description, features requested.
- **Action**: Update the initialization logic to ensure this manifest is the primary source of truth for the bot.

### 2. The Bot "Trigger" (DevOps Engineer)
- **Mechanism**: GitHub Webhook or Dispatch Event.
- **Payload**: Notify the external bot service that a new project is ready.
- **Choice of Bot**:
  - **Option A (Webhook)**: Send a POST request to a dedicated endpoint (Clowbot/Roboflow).
  - **Option B (GitHub Actions)**: Trigger a workflow within the new repo that the Bot can listen to.

### 3. Build Feedback Loop (Backend Specialist)
- **New Endpoint**: `/api/admin/projects/[repoName]/status`
- **Function**: Allow the external bot to update the "Submission" or "Project" status in Supabase (e.g., `QUEUED`, `BUILDING`, `FAILED`, `READY`).

### 4. Security & Audit (Security Auditor)
- **Token Scope**: Ensure the GitHub PAT used has the minimum required permissions (repo scope only).
- **Identity Verification**: Bot must authenticate when pushing status updates back to 4Gears.

## Implementation Phases

### Phase 1: Planning & Socratic Gate
- [x] Create `docs/PLAN.md`
- [ ] User approval on Bot choice (Clowbot vs Roboflow vs Custom)
- [ ] User approval on Feedback mechanism

### Phase 2: Core Development (Backend/DevOps)
- [ ] Refactor `initialize-repo` to include the `handover_manifest.json`.
- [ ] Create the Webhook triggering logic.
- [ ] (Optional) Create the status update API.

### Phase 3: Verification (Test Engineer)
- [ ] End-to-end test from Admin "Initialize" button to Mock Bot reception.
- [ ] Security audit of PAT storage and API endpoints.

## User Approval Required
- **Bot Identity**: Confirm if "Roboflow" is the intended service or if you meant a custom "Workflow" bot.
- **Status Updates**: Do you want the bot to report back progress to the admin panel?
- **Git Repo Access**: Should the bot have push access to the repo, or just read access?
