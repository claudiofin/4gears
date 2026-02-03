# 4Gears - Master Project Plan (Builder First Strategy)

> **Context**: We are pivoting to fully complete the **Visual Editor (Builder)** before proceeding with backend/mobile deployment.
> **Primary Goal**: Empower the Club Admin to customize *everything* (Texts, Logos, Backgrounds, Icons, Tiers).

---

## 🛠️ Phase 1: The "Lovable" Builder Completion
**Objective**: Reach feature parity with the requirements in `esempioprimomvp.txt` and user feedback.

### 1.1 Identity & Asset Engine (The "Brand" Tab)
*   **Logo Uploader**:
    *   Replace `prompt()` with a proper Drag & Drop zone.
    *   Support for: **Club Logo** (Header), **App Icon** (Launcher), **Watermark** (Photos).
*   **Background Manager**:
    *   Global App Background (Texture/Color).
    *   **Splash Screen Builder**: Upload custom image + Logo positioning.
    *   **Hero Image**: Per-sport default or custom upload.
*   **Color System V2**:
    *   Primary/Secondary/Accent pickers.
    *   **Glassmorphism Toggle**: Control blur intensity for UI cards.

### 1.2 Typography & Iconography (The "Theme" Tab)
*   **Typography Customizer**:
    *   **Font Family**: Selector for Headings (Outfit, Inter, Roboto Slab) vs Body (Inter, Open Sans).
    *   **Scale**: Base size slider (Small/Medium/Large) for accessibility.
*   **Icon Customizer**:
    *   **Tab Icons**: Select specific Lucide icons for each navigation tab (e.g., "Whistle" vs "Tactics Board" for Coach view).
    *   **Style**: Toggle between Outline (Stroke) and Solid (Fill).

### 1.3 Feature Matrix & Monetization Logic (The "Features" Tab)
**Requirement**: "Selezionare le feature e metterle disponibili o no in base al tier."

*   **Feature Gating Editor**:
    *   Grid view of all modules: `News`, `Chat`, `Events`, `Shop`, `Tactics`, `LiveMatch`.
    *   **Per-Feature Controls**:
        *   [Toggle] Enabled/Disabled globally.
        *   [Dropdown] Minimum Tier Required (`FREE` / `PREMIUM` / `ELITE`).
        *   [Multi-Select] Visible to Personas (`Admin`, `Coach`, `Player`, `Fan`).
*   **Live Preview Feedback**:
### 1.4 Sponsor & Commercial Builder (The "Monetization" Tab)
*   **Sponsor Manager**:
    *   **Banner Uploader**: Drag & drop slots for Header, Footer, and Sidebar ads.
    *   **Tier Configuration**: Visual editor for "Gold", "Silver", "Bronze" sponsor visibility.
    *   **Digital Signage Preview**: Preview how sponsors look on the Kiosk/TV mode.
*   **Shop Configurator**:
    *   **Product Editor**: Add initial merch (Scarf, Jersey) with images and prices.
    *   **Visual Storefront**: Customize the Shop layout (Grid vs List).

### 1.5 Membership & Card Designer (The "Identity" Tab Extension)
*   **Digital Card Builder**:
    *   **Visual Editor**: Drag & drop logo, member photo placeholder, and QR code position.
    *   **Background**: Select distinct card backgrounds for different Member Tiers.
*   **Document Manager**:
    *   **Form Builder**: Toggle required fields for registration (Medical Cert, Waiver).

### 1.6 Sport & Rules Engine (The "Sport" Tab)
*   **Deep Sport Config**:
    *   **Scoring Editor**: Customize terminology ("Goal" vs "Try") and point values.
    *   **Role Manager**: Define custom roles (e.g., "Pivot" instead of "Center").
    *   **Clock Rules**: Set match duration and period types visually.

---

## 🚀 Phase 2: Core Platform (Post-Builder)

### 2.1 Data & Auth (Supabase)
*   **Schema**: Implement `clubs`, `teams`, `users`, `events` (from `ricerca.txt`).
*   **RLS Policies**: Secure data isolation by `club_id`.

### 2.2 Member Management (Secretariat)
*   **Digital Cards**: Apple/Google Wallet pass generation.
*   **Registration Forms**: Dynamic fields (Medical cert expiration tracking).

### 2.3 Event Hub
*   **Smart Calendar**: Match/Training distinction.
*   **RSVP**: Reason for absence requirement.

---

## 📱 Phase 3: Mobile & Deployment
*   **Android Build**: Gradle configuration for AAB generation.
*   **Store Assets**: Automated screenshot generation from the Builder.

---

## ❓ Confirmation
**Confirm to proceed with Phase 1 (Builder Completion) immediately?**
*   We will start with **1.1 Identity** and **1.3 Feature Matrix**.
