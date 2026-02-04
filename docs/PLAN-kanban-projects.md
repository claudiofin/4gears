# Project-Specific Kanban Implementation Plan

## Obiettivo
Creare un sistema Kanban dove ogni progetto approvato ha la sua board dedicata.

## Architettura

### 1. Database Schema Updates

#### Tabella `kanban_projects`
```sql
CREATE TABLE kanban_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submission_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  github_repo_url TEXT,
  github_repo_name TEXT,
  status TEXT DEFAULT 'active', -- active, archived, completed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Update `kanban_columns`
```sql
ALTER TABLE kanban_columns 
ADD COLUMN project_id UUID REFERENCES kanban_projects(id) ON DELETE CASCADE;
```

#### Update `kanban_tasks`
```sql
ALTER TABLE kanban_tasks 
ADD COLUMN project_id UUID REFERENCES kanban_projects(id) ON DELETE CASCADE;
```

### 2. Workflow

1. **Admin approva submission** → Trigger creazione Kanban project
2. **Crea Kanban Project** con:
   - Nome dal submission
   - GitHub repo info
   - Colonne default (Backlog, In Progress, Review, Done)
3. **Redirect** → `/admin/kanban/[project_id]`

### 3. UI Changes

#### `/admin/kanban` → Project List
- Lista di tutti i progetti con Kanban
- Card per ogni progetto con:
  - Nome progetto
  - Numero task (totali, in progress, completed)
  - Ultimo aggiornamento
  - Link GitHub
  - Bottone "Apri Board"

#### `/admin/kanban/[project_id]` → Board View
- Board Kanban specifica per il progetto
- Header con nome progetto e link GitHub
- Colonne drag & drop
- Task management

#### `/admin/submissions` → Add "Crea Kanban" button
- Quando approvi, chiedi se creare Kanban
- Opzione per creare Kanban anche dopo approvazione

### 4. Implementation Steps

1. ✅ Create migration for database schema
2. ✅ Update TypeScript types
3. ✅ Create API endpoint: `/api/admin/kanban/project` (CRUD)
4. ✅ Update submissions page to create Kanban on approval
5. ✅ Create project list page: `/admin/kanban/page.tsx`
6. ✅ Update board view: `/admin/kanban/[project_id]/page.tsx`
7. ✅ Add GitHub integration hooks

### 5. Features

- **Auto-create default columns** when project is created
- **GitHub sync**: Link tasks to branches/commits
- **Project archiving**: Archive completed projects
- **Quick stats**: Task count, progress percentage
- **Search & filter**: Find projects quickly

## File Structure

```
web/src/
├── app/admin/kanban/
│   ├── page.tsx (Project List)
│   └── [project_id]/
│       └── page.tsx (Board View)
├── components/admin/kanban/
│   ├── ProjectCard.tsx
│   ├── ProjectList.tsx
│   ├── KanbanBoard.tsx (updated)
│   └── CreateProjectModal.tsx
└── lib/api/
    └── kanban-projects.ts
```

## Next Actions

1. Create database migration
2. Update types
3. Implement project creation on approval
4. Build project list UI
5. Update board to be project-specific
