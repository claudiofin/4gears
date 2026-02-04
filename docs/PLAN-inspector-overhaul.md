# PLAN-inspector-overhaul.md

## 🎯 Objective
Achieve 100% "Inspect Mode" coverage, allowing Builders to customize every pixel of the Splash, Login, and Core App UI without writing code. This plan details the "billions of things" currently missing.

## 📱 Coverage Gap Analysis

### 1. Splash Screen (`renderSplashScreen`)
**Current**: Fixed gradient + centered logo.
**Missing Customizations**:
- [ ] **Background**: Helper to switch between `Solid Color`, `Gradient` (Linear/Radial), or `Image/Texture`.
- [ ] **Logo**: Sizing slider (Scale 0.5x to 2x), Position adjustment (Y-offset).
- [ ] **Animation**: Entry transition type (`FadeIn`, `ScaleUp`, `Bounce`, `LogoReveal`).
- [ ] **Loader**: Toggle visibility, Custom Color, Style (`Pulse`, `Spinner`, `Progress Bar`).
- [ ] **Text**: "Official App" subtitle custom text, font size, and opacity.
- [ ] **Duration**: Minimum display time slider (seconds).

### 2. Login Screen (`renderLoginScreen`)
**Current**: Hardcoded form + new Social Buttons.
**Missing Customizations**:
- [ ] **Providers**: Checkbox list to enable/disable `Email`, `Google`, `Apple`, `Facebook`.
- [ ] **Field Style**: 
    - Input Background (`Light`, `Transparent`, `Filled`).
    - Border Styling (`Rounded`, `Square`, `Underline Only`).
- [ ] **Button Style**: 
    - "Accedi" button Height, Corner Radius, Shadow.
    - Social Buttons layout (`Stack` vs `Grid` vs `Icon Only`).
- [ ] **Hero Image**: Option to add a top banner image or carousel above the form.
- [ ] **Texts**: Custom "Welcome Back" title, "Forgot Password" label.
- [ ] **Legal**: Custom Terms & Privacy text/links visibility.

### 3. Global Theme & Typography
**Current**: Basic Color Palette.
**Missing Customizations**:
- [ ] **Typography System**: 
    - Heading Font Family (e.g., Inter, Poppins, Roboto).
    - Body Font Family.
    - Base Size scaler (Small/Medium/Large accessibility).
- [ ] **Shape System**: Global Corner Radius (0px to 30px) affecting all Cards/Buttons.
- [ ] **Depth System**: Shadow intensity slider (Flat design vs Skueomorphic depth).
- [ ] **Glassmorphism**: Global blur intensity control for Overlays/Modals.

### 4. Navigation Layouts
**Current**: Standard Bottom Bar.
**Missing Customizations**:
- [ ] **Tab Bar Style**: `Floating`, `Docked`, `Transparent`, `Blur`.
- [ ] **Active Indicator**: `Icon Color`, `Background Pill`, `Top Line`, `Dot`.
- [ ] **Icons**: Selection of Icon Packs (Lucide, Feather, Material, FA).

### 5. Workflow & UX Enhancements
- [ ] **Auto-Switch ViewMode**: When navigating in Simulator (e.g., Login -> Home), the Builder ViewMode (TopBar) must update automatically to reflect the new state (LOGIN -> USER).
- [ ] **Context-Aware Sidebar**: The left sidebar tabs should adapt to the selected ViewMode.
    - **SPLASH Mode**: Focus on `Branding` and `Animation` settings. Hide `Sport` or `Features`.
    - **LOGIN Mode**: Focus on `Auth` and `Legal` settings.
    - **Implementation**: Introduce a `ContextualSettings` tab or dynamically reorder existing tabs based on `viewMode`.

---

## 🛠 Technical Implementation Steps

### Phase 1: Schema Extension
Update `ThemeConfig` in `src/types/builder.ts` to hold these granular properties.

```typescript
interface ThemeConfig {
    // Existing...
    splash?: {
        bgType: 'color' | 'image';
        bgValue: string;
        logoScale: number;
        //...
    };
    login?: {
        enabledProviders: AuthProvider[];
        inputStyle: 'filled' | 'outlined';
        cornerRadius: number;
        //...
    };
    ui?: {
        globalRadius: number;
        shadowIntensity: number;
        fontHeading: string;
        fontBody: string;
    }
}
```

### Phase 2: Inspector Updates
Update `InspectorPanel.tsx` to render specialized controls based on the active `ViewMode`.
- If `ViewMode === 'SPLASH'` -> Show Splash Controls.
- If `ViewMode === 'LOGIN'` -> Show Login Controls.

### Phase 3: Simulator Binding
Refactor `SimulatorScreens.tsx` components to consume these new config values dynamically using specific `getOverride` calls or direct theme props.

---

## 📅 Execution Priority

1. **Splash Customization** (High Visibility, Low Complexity)
2. **Login Providers & Style** (Critical for Onboarding UX)
3. **Global Shape/Font System** (High Impact on overall feel)
4. **Navigation Styles** (Refinement)

