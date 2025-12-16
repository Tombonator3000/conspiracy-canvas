# Conspiracy Canvas - Spillanalyse og Forbedringsrapport

**Dato:** 2025-12-16
**Versjon analysert:** Commit f3b0df1
**Analysert av:** AI Game Reviewer

---

## 1. Sammendrag

Conspiracy Canvas er et "apophenia puzzle game" hvor spillere kobler bevis for å avdekke konspirasjonsteorier. Spillet har solid tematisk design og god React-arkitektur, men har flere områder som kan forbedres gjennom spillteori-prinsipper.

---

## 2. Identifiserte Feil og Mangler

### 2.1 Tekniske Feil (Bugs)

#### Kritisk
| Fil | Linje | Problem | Alvorlighet |
|-----|-------|---------|-------------|
| `ConspiracyBoard.tsx` | 526-527 | `nodeTypes as any` og `edgeTypes as any` - TypeScript `any` omgår typesikkerhet | Medium |
| `useAudio.ts` | 38 | `(window as any).webkitAudioContext` - Mangler proper type for Safari-støtte | Lav |

#### Sikkerhetssårbarheter
```
npm audit:
- esbuild <=0.24.2 (moderate) - Dev server request vulnerability
- glob 10.2.0-10.4.5 (HIGH) - Command injection via -c/--cmd
- js-yaml 4.0.0-4.1.0 (moderate) - Prototype pollution
- vite <=6.1.6 (moderate) - Depends on vulnerable esbuild
```
**Løsning:** Kjør `npm audit fix`

#### ESLint Feil (5 errors, 9 warnings)
```
src/components/game/ConspiracyBoard.tsx:526-527 - @typescript-eslint/no-explicit-any
src/components/ui/command.tsx:24 - Empty interface
src/components/ui/textarea.tsx:5 - Empty interface
src/hooks/useAudio.ts:38 - @typescript-eslint/no-explicit-any
```

### 2.2 Arkitektur-Mangler

#### 2.2.1 Manglende Error Boundary
**Problem:** Ingen React Error Boundary for graceful failure handling.
**Risiko:** Hele appen krasjer ved uventede feil.
**Lokasjon:** Mangler i `src/pages/Index.tsx`

#### 2.2.2 Stor Monolittisk Komponent
**Problem:** `ConspiracyBoard.tsx` er 569 linjer med blandet logikk.
**Følge:** Vanskelig å teste, vedlikeholde og utvide.
**Anbefaling:** Ekstraher til:
- `useConnectionValidation.ts` - Forbindelseslogikk
- `useBinCollision.ts` - Søppelbøtte-kollisjonslogikk
- `useGameAudio.ts` - Lyd-effekter

#### 2.2.3 Hardkodet Spillbalanse
**Problem:** Alle balanseverdier er spredt i koden.
```typescript
// Spredt over flere filer:
-15  // Ugyldig kobling (ConspiracyBoard.tsx:436)
-20  // Kaste viktig bevis (ConspiracyBoard.tsx:319)
-500 // Credibility tap (ConspiracyBoard.tsx:318)
+150 // Rense søppel (ConspiracyBoard.tsx:302)
-50  // Hoarder penalty per item (ResultScreen.tsx:84)
500  // Start credibility (ConspiracyBoard.tsx:167)
```
**Anbefaling:** Flytt til `src/config/gameBalance.ts`

### 2.3 UX/Tilgjengelighet

| Problem | Beskrivelse | Prioritet |
|---------|-------------|-----------|
| Ingen tastaturnavigasjon | Bevis kan kun dras med mus/touch | Medium |
| Manglende undo-funksjon | Spillere kan ikke angre feilkoblinger | Høy |
| Ingen pause-funksjon | Kan ikke pause midt i spillet | Lav |
| Ingen tutorial-overlay | Tutorial-case mangler interaktive hint | Medium |

---

## 3. Spillteori-Analyse

### 3.1 Nash-Likevekt Analyse

#### Spillerens Strategi-Rom
Spilleren har tre hovedstrategier per tur:

1. **Koble bevis** (Connect) - +100 poeng ved suksess, -15 sanity ved feil
2. **Kaste søppel** (Trash Junk) - +150 credibility for red herrings
3. **Kaste bevis** (Trash Evidence) - -500 credibility, -20 sanity (game over risiko)

#### Forventet Verdi-Matrise (Case 001)
```
Strategi          | P(Suksess) | Gevinst | Tap    | EV
------------------|------------|---------|--------|--------
Koble tilfeldig   | 23%*       | +100    | -15    | +11.45
Koble informert   | 80%        | +100    | -15    | +77
Kaste tilfeldig   | 77%**      | +150    | -500   | +0.5
Kaste informert   | 95%        | +150    | -500   | +117.5

* 3 ekte bevis av 13 noder, ~23% signalratio
** 10 red herrings av 13 noder
```

**Konklusjon:** Optimal strategi er "informert kasting" etterfulgt av "informert kobling". Spillere som leser beskrivelser nøye har klar fordel.

### 3.2 Risikoanalyse

#### Sanity-System: Expected Failure Rate
```
Start sanity: 100
Cost per fail: 15
Max failures before game over: 6.67 (rundet ned = 6)

Med 7 feil-forsøk = garantert game over
```

#### Credibility-System: Single Point of Failure
```
Start credibility: 500
Cost per real evidence trashed: 500
Failures allowed: 1 (ved credibility < 0 = game over)

PROBLEM: Ett feilkast = instant game over
```

**Balanse-Problem:** Credibility-systemet er for straffende. En enkelt feil gir game over, mens sanity tillater 6 feil.

### 3.3 Spilløkonomi

#### Poengsystem-Analyse
```
Handling                  | Poeng  | Frekvens (Case 001)
--------------------------|--------|--------------------
Gyldig kobling            | +100   | Max 3
Kaste søppel              | +150   | Max 10
Hoarder penalty           | -50    | Per gjenværende søppel
Start credibility         | 500    | Fast

Maksimal score = 500 + (3*100) + (10*150) - 0 = 2300
Minimal winning score = 500 + (3*100) - (10*50) = 300
```

#### Diminishing Returns Problem
```
Første 3 koblinger: +300 poeng (kritisk for seier)
Søppelrensing: +1500 poeng (valgfritt men høyest ROI)

PROBLEM: Rensing gir 5x mer enn kjernemekanikken (kobling)
```

### 3.4 Engagement Loops

```
                    ┌─────────────────────┐
                    │  Finn potensielt    │
                    │     bevis           │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
    ┌─────────────────┐               ┌─────────────────┐
    │ Forsøk kobling  │               │  Vurder søppel  │
    └────────┬────────┘               └────────┬────────┘
             │                                  │
    ┌────────┴────────┐               ┌────────┴────────┐
    ▼                 ▼               ▼                 ▼
┌───────┐        ┌────────┐     ┌─────────┐       ┌────────┐
│SUCCESS│        │  FAIL  │     │ +150 CR │       │-500 CR │
│ +100  │        │ -15 SAN│     │ (søppel)│       │(bevis) │
└───┬───┘        └────┬───┘     └────┬────┘       └────┬───┘
    │                 │              │                  │
    │                 │              │                  │
    └────────┬────────┴──────────────┴─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Seier? Game Over│
    └─────────────────┘
```

**Observasjon:** Loopen mangler "discovery" eller "mystery reveal" mellom handlinger. Spilleren har ingen grunn til å utforske etter at strategien er klar.

---

## 4. Game Theory-Baserte Forbedringer

### 4.1 Balanse-Justeringer (Kritisk)

#### 4.1.1 Credibility Rebalansering
**Nåværende:** -500 for feilkast = instant game over
**Forslag:**
```typescript
// Gradert credibility-tap basert på bevistype
const CREDIBILITY_PENALTIES = {
  critical_evidence: -200,  // Ned fra -500
  regular_evidence: -100,   // Nytt nivå
  near_miss: -50,           // Red herring med relevante tags
};
```

**Spillteori-Begrunnelse:** Graderte straffer gir spilleren mer strategisk rom og reduserer "coin flip" følelsen.

#### 4.1.2 Sanity Recovery Mekanikk
**Nåværende:** Sanity synker bare, aldri opp.
**Forslag:**
```typescript
// +5 sanity ved gyldig kobling (caps at start)
// Skaper risk/reward for aggressive spillestil
```

**Spillteori-Begrunnelse:** "Comeback mechanic" øker engagement og reduserer frustrasjon.

#### 4.1.3 Kobling vs Rensing Balanse
**Problem:** Rensing gir 150 vs kobling gir 100, men rensing er enklere.
**Forslag:**
```typescript
CONNECTION_REWARD: 200,  // Opp fra 100
CLEANUP_REWARD: 100,     // Ned fra 150
COMBO_BONUS: 50,         // Bonus for consecutive connections
```

### 4.2 Nye Spillmekanikker (Medium Prioritet)

#### 4.2.1 "Hint" System (Bayesian Revelation)
**Beskrivelse:** Spilleren kan "granske" bevis for å avsløre tag-hint.
```typescript
interface HintSystem {
  cost: 10, // sanity cost
  reveals: 1, // antall tags avslørt
  cooldown: 30, // sekunder
}
```

**Spillteori-Begrunnelse:** Gir spilleren informert valg uten å gjøre spillet trivielt.

#### 4.2.2 "Undo" Mekanikk
**Beskrivelse:** Tillat å angre siste handling med økende kostnad.
```typescript
const UNDO_COSTS = [0, 5, 15, 30]; // Sanity cost per undo
```

#### 4.2.3 "Chain Bonus" System
**Beskrivelse:** Consecutive gyldige koblinger gir multiplikator.
```typescript
const CHAIN_MULTIPLIERS = {
  2: 1.2,  // 20% bonus
  3: 1.5,  // 50% bonus
  4: 2.0,  // 100% bonus
};
```

### 4.3 Case Design Prinsipper

#### 4.3.1 Signal-to-Noise Ratio per Vanskelighetsgrad
```
Difficulty  | Real Evidence | Red Herrings | S/N Ratio
------------|---------------|--------------|----------
TUTORIAL    | 30%           | 70%          | 0.43
EASY        | 25%           | 75%          | 0.33
MEDIUM      | 20%           | 80%          | 0.25
HARD        | 15%           | 85%          | 0.18
EXPERT      | 10%           | 90%          | 0.11
```

#### 4.3.2 Tag Overlap Complexity
```typescript
// Nåværende: Enkle unike tags
// Forslag: Overlappende tags for "near-miss" situasjoner

// Eksempel - Case med mer kompleksitet:
evidence_1.tags = ["DRONE", "SURVEILLANCE", "GOVERNMENT"];
evidence_2.tags = ["SURVEILLANCE", "CAMERA", "PRIVATE"];
red_herring.tags = ["SURVEILLANCE", "MOVIE", "FICTION"];

// Spilleren må finne RIKTIG surveillance-kobling, ikke bare "surveillance"
```

### 4.4 Metagame Forbedringer

#### 4.4.1 Progression System
**Nåværende:** Lineær case-unlock.
**Forslag:**
```typescript
interface MetaProgression {
  totalCredibility: number;    // Akkumulert over alle saker
  unlockedPerks: Perk[];       // f.eks. "Extra sanity", "Hint discount"
  achievementCount: number;    // Unlock cosmetics
}
```

#### 4.4.2 Daily Challenge Mode
```typescript
interface DailyChallenge {
  seed: string;                // Daglig random seed
  modifiers: Modifier[];       // "No hints", "Double junk"
  leaderboard: boolean;
}
```

---

## 5. Prioritert Handlingsplan

### Fase 1: Kritiske Fikser (Sprint 1)
| Task | Fil | Estimat |
|------|-----|---------|
| Fiks npm vulnerabilities | `package.json` | 15 min |
| Fiks TypeScript `any` typer | `ConspiracyBoard.tsx`, `useAudio.ts` | 30 min |
| Legg til Error Boundary | `Index.tsx` | 1 time |
| Rebalanser credibility penalty | `ConspiracyBoard.tsx` | 30 min |

### Fase 2: Balanse-Forbedringer (Sprint 2)
| Task | Beskrivelse | Estimat |
|------|-------------|---------|
| Ekstraher spillbalanse til config | Sentraliser alle verdier | 2 timer |
| Implementer sanity recovery | +5 ved gyldig kobling | 1 time |
| Justér kobling vs rensing reward | 200/100 ratio | 30 min |
| Legg til chain bonus | Consecutive connection multiplier | 2 timer |

### Fase 3: Nye Features (Sprint 3-4)
| Task | Prioritet |
|------|-----------|
| Hint system | Høy |
| Undo mekanikk | Medium |
| Tutorial overlay | Medium |
| Keyboard navigation | Lav |
| Daily challenges | Lav |

---

## 6. Konklusjon

Conspiracy Canvas har en solid tematisk fundament og god teknisk arkitektur. De største forbedringspunktene er:

1. **Balanse:** Credibility-systemet er for brutalt (-500 = instant game over)
2. **Engagement:** Mangler "comeback" mekanikker og variert belønning
3. **Teknisk:** Noen TypeScript-snarveier og manglende error handling

Med de foreslåtte endringene vil spillet ha:
- Mer forgiving læringsperiode
- Høyere skill ceiling for eksperter
- Bedre langsiktig engagement gjennom meta-progression

---

## Appendiks A: Komplett Case-Oversikt

| Case | Tema | Nodes | Real | Junk | S/N | Connections |
|------|------|-------|------|------|-----|-------------|
| 001 | Pigeon Drones | 13 | 3 | 10 | 0.30 | 3 |
| 002 | Sock Teleportation | 15 | 4 | 11 | 0.36 | 3 |
| 003 | Milk Expiration | 14 | 4 | 10 | 0.40 | 3 |
| 004 | TBD | - | - | - | - | - |
| 005 | TBD | - | - | - | - | - |
| 006 | TBD | - | - | - | - | - |
| 007 | TBD | - | - | - | - | - |

## Appendiks B: Lydfil Reference

| SFX | Trigger | Oscillator | Frequency |
|-----|---------|------------|-----------|
| connect_success | Valid connection | Sine | 150→300Hz |
| connect_fail | Invalid connection | Sawtooth | 400→100Hz |
| trash_junk_success | Discard red herring | Sine (dual) | 880Hz + 1318Hz |
| trash_evidence_fail | Discard real evidence | Sawtooth + Noise | 150→80Hz |
| paper_crumple | Any discard | White noise | Highpass 1000Hz |
| uv_toggle | UV light on/off | Square | 1000Hz |

---

*Rapport generert: 2025-12-16*
