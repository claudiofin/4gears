# PLAN: Brand Identity & AI Asset Generation

Questo piano definisce la strategia per la generazione automatica della Brand Identity e degli asset grafici necessari per il rilascio professionale dell'app mobile. Il sistema trasforma i dati del Builder in un pacchetto visivo completo pronto per App Store e Google Play.

## 🎯 Obiettivi Chiave

1.  **AI Logo Generation**: Creazione di loghi vettoriali o high-res basati sui colori sociali e sul nome del team.
2.  **Deployment Assets**: Generazione automatica di App Icon, Adaptive Icon (Android) e Splash Screen.
3.  **Marketing Studio**: Motore di generazione screenshot per le pagine dello store (iPhone & Android).
4.  **Consistency Engine**: Garantire che tutti gli asset siano visivamente coerenti con il tema selezionato nel Builder.

---

## 🎨 Fase 1: AI Logo & Icon Engine

### 1.1 App Icon Generator
*   Utilizzo di prompt IA specializzati che prendono in input:
    *   `primaryColor`, `secondaryColor`.
    *   `teamName` e `sportType`.
*   Generazione di un'icona 1024x1024 con stile "Premium App" (flat, neomorfico o skeuomorfico a scelta del builder).

### 1.2 Adaptive Icons (Android)
*   Separazione automatica di foreground (logo) e background (colore/gradiente) per conformità con le linee guida Android.

---

## 🖼️ Fase 2: Splash Screen & Visual Identity

### 2.1 Dynamic Splash Screen
*   Generazione del file `splash.png` (1242x2436) ottimizzato per diverse risoluzioni.
*   Integrazione con il `SplashConfig` del builder per aggiungere loader, sottotitoli e loghi dei partner.

### 2.2 Brand Colors Palette
*   Esportazione di un oggetto `BrandTokens` utilizzabile direttamente nel CSS/Tailwind del progetto generato.

---

## 📸 Fase 3: Marketing Studio (Screenshots)

### 3.1 Template Screenshot Engine
*   Creazione di template "Framed" (il simulatore dentro un device fisico).
*   Aggiunta di testi promozionali (es. "Gestisci il tuo team ovunque") sopra lo screenshot.
*   **Batch Export**:
    *   6.5" iPhone (Max 5-10 immagini).
    *   12.9" iPad (opzionale).
    *   Google Play Feature Graphic (1024x500).

---

## 📂 Fase 4: Handover Integration

### 4.1 Assets Folder Structure
*   `assets/icon.png`: App Icon universale.
*   `assets/adaptive-icon.png`: Versione Android.
*   `assets/splash.png`: Splash Screen.
*   `assets/marketing/*.jpg`: Screenshot per lo store.

### 4.2 Agent Workspace Configuration
*   **Skill Injection**: La repository generata contiene una cartella `.agent/skills/4gears-core` che spiega agli agenti esterni (Cursor, Claude Code) come:
    *   Aggiungere nuovi mock data coerenti.
    *   Modificare i componenti UI NativeWind senza rompere il design system.
    *   Implementare nuove logiche di match management basate sui template esistenti.
*   **Self-Documentation**: Ogni file generato ha header JSDoc ottimizzati per il context-window dei LLM.

---

## 🤖 Vibe Coding & Automazione (Technical Note)

L'integrazione delle **Agent Skills** non richiede una VM dedicata per funzionare. Funziona tramite:
1.  **Context Recognition**: Quando apri il progetto con un editor AI-ready (Cursor o VS Code + Antigravity), l'editor legge le istruzioni in `.agent` e diventa un esperto del dominio 4Gears.
2.  **Autonomous Operations (Optional)**: Per un'automazione totale (Vibe Coding), si può configurare una **GitHub Action** che, ad ogni webhook dal Builder, invoca un agente CLI (come `claude-code`) per applicare le modifiche e committare direttamente.

---

## 🛠️ Prossimi Passi (Operativi)

1.  [x] Preparare il prompt IA per la generazione del logo team.
2.  [x] Implementare nel `MarketingStudioPanel` la logica di esportazione batch degli screenshot.
3.  [ ] Creare lo script `generate-assets.py` per il resize automatico delle icone e splash.
4.  [ ] Definire i template `.yaml` per le Agent Skills mobile.
