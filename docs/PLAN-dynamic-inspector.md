# PLAN - Dynamic Inspector UI Overhaul

**Created:** 2026-02-03  
**Status:** Planning  
**Priority:** High

---

## 🎯 Obiettivo

Trasformare l'Inspector UI da un semplice visualizzatore di informazioni a un **editor visuale dinamico** che permette di modificare ogni aspetto dei componenti in base al loro tipo.

---

## 📋 Problemi Attuali

1. **Statico** - Mostra solo informazioni, non permette modifiche
2. **Non Contestuale** - Stesso pannello per tutti i componenti
3. **Limitato** - Non espone tutte le proprietà modificabili
4. **Non Intuitivo** - Manca feedback visivo delle modifiche

---

## 🏗️ Architettura Proposta

### 1. Sistema di Tipizzazione Componenti

Ogni componente selezionabile deve avere un **tipo** che determina quali controlli mostrare:

```typescript
type ComponentType = 
  | 'text'           // Testo modificabile
  | 'icon'           // Icona con colore/dimensione
  | 'card'           // Card con stili
  | 'button'         // Bottone con azioni
  | 'image'          // Immagine con URL
  | 'container'      // Container con layout
  | 'navigation'     // Elemento di navigazione
  | 'header'         // Header con titolo/sottotitolo
  | 'list-item'      // Elemento di lista
  | 'badge'          // Badge/tag
  | 'input'          // Campo input
  | 'tab-bar'        // Tab bar completa
  | 'burger-menu';   // Burger menu

interface ComponentMetadata {
  id: string;
  type: ComponentType;
  label: string;
  editableProps: EditableProperty[];
  parent?: string;
  children?: string[];
}
```

### 2. Proprietà Editabili Dinamiche

Ogni tipo di componente espone proprietà specifiche:

```typescript
interface EditableProperty {
  key: string;
  label: string;
  type: 'text' | 'color' | 'number' | 'select' | 'toggle' | 'slider' | 'icon-picker' | 'image-upload';
  value: any;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
}

// Esempio per un componente TEXT:
{
  type: 'text',
  editableProps: [
    { key: 'content', label: 'Testo', type: 'text', value: 'Home' },
    { key: 'fontSize', label: 'Dimensione', type: 'slider', value: 14, min: 10, max: 32, step: 1 },
    { key: 'fontWeight', label: 'Peso', type: 'select', value: 'bold', options: ['normal', 'medium', 'semibold', 'bold'] },
    { key: 'color', label: 'Colore', type: 'color', value: '#000000' },
    { key: 'align', label: 'Allineamento', type: 'select', value: 'left', options: ['left', 'center', 'right'] }
  ]
}

// Esempio per un componente ICON:
{
  type: 'icon',
  editableProps: [
    { key: 'icon', label: 'Icona', type: 'icon-picker', value: 'Home' },
    { key: 'size', label: 'Dimensione', type: 'slider', value: 20, min: 12, max: 48, step: 2 },
    { key: 'color', label: 'Colore', type: 'color', value: '#6366f1' },
    { key: 'strokeWidth', label: 'Spessore', type: 'slider', value: 2, min: 1, max: 4, step: 0.5 }
  ]
}

// Esempio per un componente CARD:
{
  type: 'card',
  editableProps: [
    { key: 'backgroundColor', label: 'Sfondo', type: 'color', value: '#ffffff' },
    { key: 'borderRadius', label: 'Arrotondamento', type: 'slider', value: 8, min: 0, max: 32, step: 2 },
    { key: 'borderWidth', label: 'Bordo', type: 'slider', value: 1, min: 0, max: 4, step: 1 },
    { key: 'borderColor', label: 'Colore Bordo', type: 'color', value: '#e2e8f0' },
    { key: 'shadow', label: 'Ombra', type: 'select', value: 'md', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    { key: 'padding', label: 'Padding', type: 'slider', value: 16, min: 0, max: 48, step: 4 }
  ]
}
```

### 3. Inspector UI Dinamico

Il pannello Inspector si adatta al tipo di componente selezionato:

```
┌─────────────────────────────────┐
│ 🔍 Inspector                    │
├─────────────────────────────────┤
│ 📦 Componente Selezionato       │
│                                 │
│ Tipo: Text                      │
│ ID: home_team_label             │
│ Path: Home > Match Card > Label │
├─────────────────────────────────┤
│ ✏️ Proprietà                    │
│                                 │
│ Testo                           │
│ ┌─────────────────────────────┐ │
│ │ CASA                        │ │
│ └─────────────────────────────┘ │
│                                 │
│ Dimensione          [====•===] │
│ 14px                            │
│                                 │
│ Peso                            │
│ [Normal] [Medium] [Bold*]       │
│                                 │
│ Colore                          │
│ ┌─┐ #000000                    │
│ └─┘                             │
│                                 │
│ Allineamento                    │
│ [Left*] [Center] [Right]        │
├─────────────────────────────────┤
│ 🎨 Stile Avanzato               │
│ > Text Shadow                   │
│ > Letter Spacing                │
│ > Line Height                   │
├─────────────────────────────────┤
│ [Reset] [Apply to Similar]      │
└─────────────────────────────────┘
```

### 4. Controlli UI per Tipo di Proprietà

#### Text Input
```tsx
<div className="space-y-1">
  <label className="text-xs text-slate-400">{prop.label}</label>
  <input 
    type="text"
    value={prop.value}
    onChange={(e) => updateProperty(prop.key, e.target.value)}
    className="w-full px-3 py-2 bg-slate-800 rounded-lg"
  />
</div>
```

#### Color Picker
```tsx
<div className="space-y-1">
  <label className="text-xs text-slate-400">{prop.label}</label>
  <div className="flex gap-2">
    <input 
      type="color"
      value={prop.value}
      onChange={(e) => updateProperty(prop.key, e.target.value)}
      className="w-10 h-10 rounded-lg cursor-pointer"
    />
    <input 
      type="text"
      value={prop.value}
      onChange={(e) => updateProperty(prop.key, e.target.value)}
      className="flex-1 px-3 py-2 bg-slate-800 rounded-lg font-mono text-sm"
    />
  </div>
</div>
```

#### Slider
```tsx
<div className="space-y-1">
  <div className="flex justify-between">
    <label className="text-xs text-slate-400">{prop.label}</label>
    <span className="text-xs text-slate-300 font-mono">{prop.value}{prop.unit}</span>
  </div>
  <input 
    type="range"
    min={prop.min}
    max={prop.max}
    step={prop.step}
    value={prop.value}
    onChange={(e) => updateProperty(prop.key, Number(e.target.value))}
    className="w-full"
  />
</div>
```

#### Select / Button Group
```tsx
<div className="space-y-1">
  <label className="text-xs text-slate-400">{prop.label}</label>
  <div className="flex gap-1">
    {prop.options.map(option => (
      <button
        key={option}
        onClick={() => updateProperty(prop.key, option)}
        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          prop.value === option 
            ? 'bg-indigo-600 text-white' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        {option}
      </button>
    ))}
  </div>
</div>
```

#### Icon Picker
```tsx
<div className="space-y-1">
  <label className="text-xs text-slate-400">{prop.label}</label>
  <button 
    onClick={() => setShowIconPicker(true)}
    className="w-full px-3 py-2 bg-slate-800 rounded-lg flex items-center gap-2"
  >
    <Icon name={prop.value} size={20} />
    <span className="text-sm">{prop.value}</span>
  </button>
  {/* Modal con griglia di icone Lucide */}
</div>
```

---

## 📁 Struttura File

```
web/src/components/
├── inspector/
│   ├── InspectorPanel.tsx          # Container principale
│   ├── ComponentInfo.tsx           # Info componente selezionato
│   ├── PropertyEditor.tsx          # Editor proprietà dinamico
│   ├── controls/
│   │   ├── TextControl.tsx
│   │   ├── ColorControl.tsx
│   │   ├── SliderControl.tsx
│   │   ├── SelectControl.tsx
│   │   ├── ToggleControl.tsx
│   │   ├── IconPickerControl.tsx
│   │   └── ImageUploadControl.tsx
│   └── presets/
│       ├── TextPresets.tsx         # Preset per testo (H1, H2, Body, etc.)
│       ├── ColorPresets.tsx        # Palette colori
│       └── SpacingPresets.tsx      # Preset spacing
├── preview/
│   └── Selectable.tsx              # Wrapper per componenti selezionabili (UPDATED)
└── types/
    └── inspector.ts                # Type definitions
```

---

## 🔄 Flusso di Lavoro

### 1. Registrazione Componenti

Ogni componente deve registrarsi con i suoi metadati:

```tsx
// In PreviewPane.tsx
<Selectable
  id="home_team_label"
  type="text"
  label="Team Label"
  metadata={{
    content: 'CASA',
    fontSize: 10,
    fontWeight: 'bold',
    color: isDarkMode ? '#ffffff' : '#0f172a'
  }}
  onUpdate={(key, value) => handleComponentUpdate('home_team_label', key, value)}
>
  <span className={...}>CASA</span>
</Selectable>
```

### 2. Selezione Componente

Quando l'utente clicca su un componente:
1. `Selectable` emette evento `onSelect` con `id` e `metadata`
2. Inspector Panel riceve i dati e genera i controlli appropriati
3. Mostra il pannello con le proprietà editabili

### 3. Modifica Proprietà

Quando l'utente modifica una proprietà:
1. Inspector chiama `onUpdate(key, value)`
2. PreviewPane aggiorna `componentOverrides[id][key] = value`
3. Componente si ri-renderizza con il nuovo valore
4. Modifica salvata in `themeConfig.componentOverrides`

### 4. Persistenza

Le modifiche vengono salvate in:
```typescript
themeConfig.componentOverrides = {
  'home_team_label': {
    content: 'CASA',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af'
  },
  'next_match_card': {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    shadow: 'lg'
  }
}
```

---

## 🎨 Features Avanzate

### 1. Preset e Template
- Preset di stile (es: "Heading 1", "Body Text", "Caption")
- Applicazione rapida di stili predefiniti
- Salvataggio di stili personalizzati

### 2. Copy Style / Paste Style
- Copia lo stile di un componente
- Applica a componenti simili
- "Apply to all similar" (es: tutti i label)

### 3. Visual Feedback
- Highlight del componente selezionato
- Preview live delle modifiche
- Undo/Redo

### 4. Smart Suggestions
- Suggerimenti di colori dalla palette del team
- Dimensioni consigliate per accessibilità
- Contrasto colori (WCAG compliance)

### 5. Responsive Controls
- Modifiche specifiche per device (mobile/tablet/desktop)
- Preview multi-device

---

## 📊 Componenti da Supportare (Priorità)

### Fase 1 - Base (MVP)
- [x] Text (label, titoli, sottotitoli)
- [x] Icon (icone navigazione, azioni)
- [x] Card (card evento, player card)
- [x] Button (CTA, azioni)

### Fase 2 - Avanzato
- [ ] Navigation Items (tab bar, burger menu)
- [ ] Header (con logo, titolo, azioni)
- [ ] List Items (player list, event list)
- [ ] Badge/Tag

### Fase 3 - Complesso
- [ ] Tab Bar (completa)
- [ ] Burger Menu (completo)
- [ ] Calendar
- [ ] Forms

---

## 🚀 Implementation Steps

### Step 1: Type System
1. Creare `inspector.ts` con tutti i types
2. Definire `ComponentType` enum
3. Definire `EditableProperty` interface
4. Creare mapping type → properties

### Step 2: Controls Library
1. Creare componenti base (TextControl, ColorControl, etc.)
2. Implementare logica di update
3. Styling consistente

### Step 3: Inspector Panel
1. Creare layout principale
2. Implementare rendering dinamico dei controlli
3. Gestione stato selezione

### Step 4: Integration
1. Aggiornare `Selectable` component
2. Aggiornare `PreviewPane` per gestire updates
3. Collegare a `themeConfig.componentOverrides`

### Step 5: Advanced Features
1. Preset system
2. Copy/Paste style
3. Undo/Redo
4. Smart suggestions

---

## ✅ Success Criteria

- [ ] Ogni componente può essere selezionato e modificato
- [ ] Le modifiche si riflettono immediatamente nel preview
- [ ] Le modifiche vengono salvate e persistono
- [ ] UI intuitiva e responsiva
- [ ] Performance ottimale (no lag durante editing)
- [ ] Export/Import configurazione funzionante

---

## 🎯 Next Actions

1. **Review questo piano** con l'utente
2. **Prioritizzare** quali componenti implementare per primi
3. **Iniziare Step 1** - Type System
4. **Iterare** con feedback continuo

---

**Note:** Questo è un refactoring significativo che richiederà tempo. Possiamo procedere in modo incrementale, aggiungendo supporto per un tipo di componente alla volta.
