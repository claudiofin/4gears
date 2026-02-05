# 🔧 FIX: Kanban Project Creation Error

## Problema
L'API `/api/admin/kanban/project` sta fallendo con errore 500 "Unknown error" perché manca la variabile d'ambiente `SUPABASE_SERVICE_ROLE_KEY`.

## Soluzione

### 1. Ottieni il Service Role Key da Supabase

1. Vai su: https://supabase.com/dashboard/project/afjbgwldkrmaihvfmtmz/settings/api
2. Nella sezione "Project API keys"
3. Copia il valore di **"service_role"** (NON "anon")
   - Inizia con: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - È molto più lungo dell'anon key
   - ⚠️ **ATTENZIONE**: Questo key bypassa RLS, non condividerlo pubblicamente!

### 2. Aggiungi la variabile su Vercel

1. Vai su: https://vercel.com/claudiofins-projects/4gears/settings/environment-variables
2. Click su "Add New"
3. Compila:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: [Il service role key copiato da Supabase]
   - **Environment**: Seleziona "Production", "Preview", e "Development"
4. Click "Save"

### 3. Redeploy

Dopo aver aggiunto la variabile:

```bash
cd web
npx vercel --prod
```

Oppure vai su Vercel Dashboard → Deployments → Click sui 3 puntini del deploy più recente → "Redeploy"

### 4. Aggiungi anche in locale (opzionale)

Per testare in locale, aggiungi al file `web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://afjbgwldkrmaihvfmtmz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=[Il tuo service role key qui]
```

## Verifica

Dopo il redeploy:
1. Vai su https://4gears.vercel.app/admin/submissions
2. Approva una submission
3. Dovrebbe creare la Kanban board e reindirizzarti automaticamente

## Perché serve?

Il service role key permette all'API di:
- Bypassare le Row Level Security (RLS) policies
- Creare progetti Kanban a nome dell'admin
- Accedere a tutte le tabelle senza restrizioni

Senza questo key, l'API usa l'anon key che ha permessi limitati e non può creare progetti.
