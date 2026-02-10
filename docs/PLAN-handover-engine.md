# PLAN: Handover Engine & Agent-Ready Workspace

Questo piano definisce l'architettura e l'implementazione del sistema di "consegna" (Handover) per i progetti creati nel Builder 4Gears. L'obiettivo è generare un repository Expo (Mobile) pronto per la produzione, completo di test automatizzati, gestione dati duale e configurazione per agenti AI.

## 🎯 Obiettivi Chiave

1.  **Repository Expo Pro**: Generazione di un progetto mobile pulito, scalabile e performante.
2.  **Dual-State Integration**: Supporto nativo per modalità `MOCK` (config builder) e `PRODUCTION` (Supabase/Convex) via `.env`.
3.  **Agent-Ready**: Inclusione di `.agent/skills` (Expo, Maestro, MCP) per permettere a agenti IA di continuare lo sviluppo.
4.  **Test Automation**: Generazione automatica di flussi Maestro `.yaml` basati sui moduli attivati nel builder.
5.  [x] **Multi-Language (i18n)**: Supporto nativo per traduzioni (IT/EN) generate dall'IA per l'interfaccia e gli store.
6.  [x] **Global Builder Localization**: Interfaccia del sito web multilingua con rilevamento automatico.
7.  [x] **Easy-Setup Backend**: Utilizzo di Prisma per la gestione dello schema e script di configurazione rapida per Supabase.

---

## 🏗️ Fase 1: Core Handover Engine (Repo Generation)

### 1.1 Template Pro Base (Expo Router)
*   Creazione di un repository template `4gears-mobile-core` che implementa:
    *   **Expo Router v3** (Typed Routes).
    *   **NativeWind / Tailwind v4** per lo styling.
    *   **Prisma Client** pre-configurato per gestire sia database locali (SQLite per mock/test) che Supabase (Postgres).
    *   **Config Service**: Un servizio centralizzato che legge il `config.json` esportato dal builder.

### 1.2 Configurazione Handover Script
*   Creazione di uno script `generate-handover.py` che:
    1.  Estrae il JSON del progetto da Supabase.
    2.  Clona il template base.
    3.  Sovrascrive `/src/constants/project-config.json`.
    4.  Crea un file `eas.json` e `app.json` dinamico basato sui dati del club (nome, slug, bundle id).

---

## 🔄 Fase 2: Dual-State Data Architecture

### 2.1 Provider Pattern
*   Implementazione di un pattern `DataProvider` che astrae le chiamate ai dati:
    ```typescript
    // Esempio logica interna
    const useEvents = () => {
      const source = process.env.EXPO_PUBLIC_DATA_SOURCE; // 'MOCK' | 'REAL'
      return source === 'MOCK' ? useMockEvents() : useSupabaseEvents();
    };
    ```
### 2.2 Prisma & Migration Script
*   Inclusione del file `schema.prisma` nel repo generato.
*   Script `setup-backend.sh` che:
    *   Chiede all'utente le URL di Supabase (`URL`, `ANON_KEY`, `SERVICE_ROLE`).
    *   Esegue `npx prisma db push` per creare le tabelle nel nuovo database.
    *   Popola i dati iniziali (seed) partendo dal mock del builder.

---

## 🧪 Fase 3: Automated Testing (& Maestro)

### 3.1 Maestro Flow Generator
*   Il builder genererà una cartella `.maestro/` contenente file `.yaml` dinamici:
    *   `auth.yaml`: Se l'auth è attiva.
    *   `shop-flow.yaml`: Se il modulo shop è attivo (prova aggiunta carrello).
    *   `team-navigation.yaml`: Test di navigazione tra le sezioni dello sport.
### 3.2 Expo Skills & Agent Config
*   Copia della cartella `.agent/` nel nuovo repo.
*   Configurazione di `agent-settings.json` per istruire gli agenti futuri su come interagire con il progetto (es. "Usa gli MCP di Expo per il deploy").

---

## 📦 Fase 4: Delivery & Monetizzazione

### 4.1 Handover Output
*   L'output finale sarà fornito in due modi:
    1.  **Private Git Repo**: Creazione di un repository privato su GitHub per il cliente.
    2.  **ZIP Archive**: Pacchetto completo scaricabile.
### 4.2 Quote Lock
*   Il Builder segna il progetto come "Delivered - V1".
*   Ogni successiva modifica nel Builder abilita un tasto "Richiedi Update" che genera automaticamente un nuovo preventivo basato sul delta delle modifiche effettuate.

---

## 🛠️ Prossimi Passi (Operativi)

1.  [ ] Definire lo `schema.prisma` universale per lo sport (Eventi, Match, Atleti, Shop).
2.  [ ] Creare il repository Template Expo.
3.  [ ] Implementare il generatore di file Maestro `.yaml`.
4.  [ ] Preparare lo script di configurazione backend interattivo.
