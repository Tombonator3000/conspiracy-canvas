# Conspiracy Canvas - Komplett Spillanalyse

**Dato:** 2025-12-15
**Analysert av:** Claude Code
**Versjon:** 1.0

---

## Innholdsfortegnelse

1. [Executive Summary](#1-executive-summary)
2. [Tekniske Feil og Bugs](#2-tekniske-feil-og-bugs)
3. [Spillteori-Analyse](#3-spillteori-analyse)
4. [Balanserings-Problemer](#4-balanserings-problemer)
5. [UX/UI Mangler](#5-uxui-mangler)
6. [Forbedringsforslag](#6-forbedringsforslag)
7. [Prioritert Handlingsplan](#7-prioritert-handlingsplan)

---

## 1. Executive Summary

**Conspiracy Canvas** er et puzzle-spill hvor spillere tar rollen som en konspirasjonsteoriker som kobler sammen bevis for å "avsløre sannheten". Spillet har en solid grunnstruktur, men lider av flere tekniske og spilldesign-problemer som påvirker spillopplevelsen.

### Hovedfunn:
- **5 kritiske bugs** identifisert
- **8 balanserings-problemer** fra spillteori-perspektiv
- **12 forbedingsområder** anbefalt
- **Spillerretensjon-risiko:** Middels-høy på grunn av frustrasjonsmekanikker

---

## 2. Tekniske Feil og Bugs

### 2.1 KRITISK: Random rotation genereres ved hver re-render

**Fil:** `src/components/game/EvidenceNode.tsx:27, 64, 96`

```typescript
// BUG: Math.random() kalles ved HVER render, ikke bare ved mount
const rotation = Math.random() * 6 - 3;
```

**Problem:** Noder får ny tilfeldig rotasjon hver gang komponenten re-rendres, noe som skaper visuelt flimmer og ustabilitet.

**Impact:** Høy - Forringer spillopplevelsen betydelig
**Løsning:** Bruk `useMemo` eller generer rotation én gang ved node-opprettelse i `case_XXX.ts`

---

### 2.2 KRITISK: Race condition i useGameProgress hook

**Fil:** `src/hooks/useGameProgress.ts:41-52`

```typescript
const completeCase = useCallback((caseId: string, followersGained: number) => {
  setProgress(prev => {
    if (prev.completedCases.includes(caseId)) {
      return prev; // Already completed
    }
    const newProgress = {
      completedCases: [...prev.completedCases, caseId],
      totalFollowers: prev.totalFollowers + followersGained,
    };
    saveProgress(newProgress); // BUG: Kaller save INNE i setState
    return newProgress;
  });
}, [saveProgress]);
```

**Problem:** `saveProgress` kalles inne i `setProgress` callback, noe som kan føre til race conditions og inkonsistent state mellom React state og localStorage.

**Impact:** Middels - Kan føre til tapt progress
**Løsning:** Bruk `useEffect` til å synkronisere med localStorage etter state-endring

---

### 2.3 MEDIUM: Dobbel followers-beregning

**Fil:** `src/pages/Index.tsx:39` og `src/components/game/ResultScreen.tsx:82-84`

```typescript
// Index.tsx
const followersGained = Math.floor(Math.random() * 500) + 100;
completeCase(selectedCase.id, followersGained);

// ResultScreen.tsx - Beregner IGJEN med annen verdi!
const followersGained = isVictory
  ? Math.floor(Math.random() * 500) + 100
  : Math.floor(Math.random() * 5) - 10;
```

**Problem:** Followers beregnes to ganger - én gang når case fullføres (lagret) og én gang for visning (ikke lagret). Spilleren ser potensielt en annen verdi enn det som faktisk ble lagret.

**Impact:** Høy - Bryter spillerens tillit
**Løsning:** Pass `followersGained` som prop fra Index til ResultScreen

---

### 2.4 MEDIUM: Scribbles akkumuleres uten opprydding

**Fil:** `src/components/game/ConspiracyBoard.tsx:134-147`

```typescript
const addScribble = useCallback((text: string, x: number, y: number) => {
  // Scribbles legges til men fjernes ALDRI
  setGameState((prev) => ({
    ...prev,
    scribbles: [...prev.scribbles, newScribble], // Vokser ubegrenset
  }));
}, []);
```

**Problem:** Scribbles animeres inn men fjernes aldri fra DOM, noe som kan føre til minnelekkasje og ytelsesforringelse ved mange feilkoblinger.

**Impact:** Middels - Ytelsesproblemer over tid
**Løsning:** Fjern scribbles etter animasjon (3-5 sekunder) eller begrens antall

---

### 2.5 LAV: TypeScript `any` casting i ReactFlow

**Fil:** `src/components/game/ConspiracyBoard.tsx:315-316`

```typescript
nodeTypes={nodeTypes as any}
edgeTypes={edgeTypes as any}
```

**Problem:** Type-sikkerhet ignoreres, kan skjule potensielle bugs.

**Impact:** Lav - Teknisk gjeld
**Løsning:** Definer korrekte TypeScript-typer for nodeTypes og edgeTypes

---

### 2.6 LAV: Manglende error boundary

**Problem:** Ingen ErrorBoundary-komponent for å håndtere uventede feil i rendering.

**Impact:** Lav - Dårlig brukeropplevelse ved feil
**Løsning:** Wrap hovedkomponenter i React ErrorBoundary

---

## 3. Spillteori-Analyse

### 3.1 Payoff-Matrise for Spillerhandlinger

```
                    | Riktig Kobling | Feil Kobling |
--------------------|----------------|--------------|
Forstår Tags       |     +WIN       |    -15 HP    |
Gjetter Tilfeldig  |     +WIN       |    -15 HP    |
```

### 3.2 Forventet Verdi-Analyse (Case 001 - Tutorial)

**Gitt:**
- 5 noder totalt (3 gyldige, 2 red herrings)
- 3 koblinger trengs for seier
- Sanity: 100, -15 per feil = maks 6 feil tillatt

**Worst-case scenario (ren gjetning):**
- Mulige koblinger: C(5,2) = 10
- Gyldige koblinger: 3
- Sannsynlighet for gyldig kobling: 3/10 = 30%

**Nash Equilibrium:**
Spillerens optimale strategi er å analysere tags først, men spillet gir INGEN feedback om hvilke tags som matcher før kobling forsøkes. Dette skaper en **informasjons-asymmetri** som favoriserer trial-and-error over strategisk tenkning.

### 3.3 Dominant Strategy Problem

**Observasjon:**
Den dominante strategien er å systematisk prøve alle koblinger fra venstre til høyre, ikke å "tenke som en konspirasjonsteoriker".

**Konsekvens:**
Spillets narrative (paranoid detective) samsvarer ikke med optimal gameplay (brute force).

### 3.4 Risiko vs. Belønning Ubalanse

```
Handlig          | Kostnad  | Belønning           | Risiko-justert verdi
-----------------|----------|---------------------|---------------------
Riktig kobling   |    0     | +1 connection       | +1.0
Feil kobling     |  -15 HP  | Informasjon (null)  | -15.0 (ingen læring!)
```

**Problem:** Feil kobling gir INGEN nyttig informasjon. Spilleren lærer ikke hvorfor koblingen var feil, bare at den var det.

### 3.5 Progressive Difficulty Cliff

```
Case | Sanity | Max Feil | Connections | Noder | Vanskelig-Ratio
-----|--------|----------|-------------|-------|----------------
001  |  100   |    6     |      3      |   5   |     0.6
002  |  100   |    6     |      3      |   4   |     0.75
...  |        |          |             |       |
007  |   70   |    4     |      5      |   6   |     1.25 (!)
```

**Problem:** Case 007 har en vanskelig-ratio >1, noe som betyr at selv med perfekt strategi er marginen for feil minimal.

### 3.6 Sunk Cost Fallacy Exploitation

Spillet utnytter "sunk cost fallacy" negativt:
- Spillere som har brukt tid føler seg tvunget til å fortsette
- Game Over-skjermen tilbyr "TRY AGAIN" uten å forklare hva som gikk galt
- Ingen "hint"-system for å hjelpe frustrerte spillere

### 3.7 Zero-Sum vs. Positive-Sum Design

Nåværende design er **zero-sum**:
- Hver feil kobling har kun negativ verdi
- Ingen måte å tjene tilbake tapt sanity

**Anbefaling:** Introduser positive-sum mekanikker:
- Sanity-recovery ved riktige koblinger
- Hint-tokens opptjent gjennom gameplay
- Combo-bonuser for konsekutive riktige koblinger

---

## 4. Balanserings-Problemer

### 4.1 Flat Sanity Penalty

**Problem:** -15 HP uansett hvor "nær" koblingen var.

**Forslag:** Graduated penalty basert på tag-overlapp:
- 0 felles tags: -15 HP
- 1 felles tag (men ikke riktig par): -5 HP
- Samme node-type: -10 HP

### 4.2 Ingen Positive Reinforcement Loop

**Problem:** Riktig kobling gir kun progress mot seier, ingen immediate belønning.

**Forslag:**
- +5 HP for riktig kobling
- Sanity cap ved 100 for å unngå "farming"
- Visual/audio celebration ved milestones

### 4.3 Red Herring Identifikasjon

**Problem:** Red herrings er kun identifiserbare ved å prøve alle koblinger og feile.

**Forslag:**
- Subtle visual cues for experienced players
- Tags som klart ikke matcher noen andre ("FOOD", "SHOPPING" i Case 001)

### 4.4 Tutorial Utilstrekkelighet

**Problem:** Case 001 merket som "TUTORIAL" men lærer ikke spillmekanikker eksplisitt.

**Forslag:**
- Første kobling bør være guidet med highlight
- Forklare tag-matching systemet
- Vise hva som skjer ved feil FØR det koster HP

### 4.5 Difficulty Spike ved Case 007

**Sammenligning:**
| Metrikk | Case 001 | Case 007 | Endring |
|---------|----------|----------|---------|
| Start Sanity | 100 | 70 | -30% |
| Connections | 3 | 5 | +67% |
| Feilmargin | 6 | 4 | -33% |

**Konklusjon:** Spillere som klarer Case 006 vil sannsynligvis feile Case 007 flere ganger. Dette er frustrerende uten gradvis opptrapping.

---

## 5. UX/UI Mangler

### 5.1 Ingen Undo-Funksjon

Spillere kan ikke angre koblinger, selv gyldige. Dette hindrer eksperimentering.

### 5.2 Manglende Pause-Funksjon

Ingen måte å pause midt i et case uten å tape progress.

### 5.3 Uklare Touch Targets på Mobile

**Fil:** `src/index.css:226-251`

Touch handles er 24px, men optimal touch target er 44px per Apple/Google guidelines.

### 5.4 Ingen Progress Indicator Between Cases

Spillere kan ikke se total progresjon mot "ferdig med spillet".

### 5.5 Sound Effects Mangler

Ingen audio feedback for:
- Riktig kobling
- Feil kobling
- Game over
- Victory

### 5.6 Accessibility Issues

- Ingen keyboard navigation support
- Fargekontrast kan være problematisk for fargeblinde (rød/grønn)
- Ingen screen reader support
- Ingen reduced motion support

---

## 6. Forbedringsforslag

### 6.1 Immediate Fixes (Kritiske)

| # | Forbedring | Effort | Impact |
|---|------------|--------|--------|
| 1 | Fiks random rotation bug | Lav | Høy |
| 2 | Sync followers-verdier | Lav | Høy |
| 3 | Opprydd scribbles etter timeout | Lav | Middels |
| 4 | Fiks race condition i useGameProgress | Middels | Høy |

### 6.2 Spillbalanse-Forbedringer

| # | Forbedring | Effort | Impact |
|---|------------|--------|--------|
| 5 | Graduated sanity penalty | Middels | Høy |
| 6 | Sanity recovery ved riktig | Lav | Høy |
| 7 | Hint-system | Høy | Høy |
| 8 | Interaktiv tutorial | Høy | Høy |

### 6.3 Game Theory Optimaliseringer

| # | Forbedring | Effort | Impact |
|---|------------|--------|--------|
| 9 | Informativ feil-feedback | Middels | Høy |
| 10 | Smooth difficulty curve | Middels | Middels |
| 11 | Achievement system | Høy | Middels |
| 12 | Multiple solution paths | Høy | Høy |

### 6.4 Feature Roadmap

#### Fase 1: Stabilitet (1-2 uker)
- Fiks alle kritiske bugs (6.1)
- Implementer error boundaries
- Legg til basic analytics

#### Fase 2: Balanse (2-3 uker)
- Graduated penalties
- Sanity recovery
- Difficulty curve adjustment

#### Fase 3: Engagement (3-4 uker)
- Hint-system
- Achievement system
- Sound effects
- Leaderboard

#### Fase 4: Polish (2-3 uker)
- Interaktiv tutorial
- Multiple endings
- Accessibility audit
- Localization support

---

## 7. Prioritert Handlingsplan

### Umiddelbar Handling (Denne Sprint)

```
1. [P0] Fiks EvidenceNode rotation bug
   - Flytt Math.random() ut av render-funksjonen
   - Bruk useMemo eller generer ved opprettelse

2. [P0] Sync followers-visning med lagret verdi
   - Pass followersGained fra Index til ResultScreen

3. [P1] Implementer scribble cleanup
   - setTimeout for å fjerne etter 4 sekunder
   - Maks 10 scribbles på skjermen samtidig

4. [P1] Fiks useGameProgress race condition
   - Bruk useEffect for localStorage sync
```

### Neste Sprint

```
5. [P1] Legg til sanity recovery (+5 per riktig)
6. [P2] Implementer graduated penalty system
7. [P2] Forbedre touch targets til 44px
8. [P2] Legg til simple sound effects
```

### Backlog

```
9. [P3] Hint-system design og implementasjon
10. [P3] Achievement system
11. [P3] Interaktiv tutorial
12. [P3] Accessibility audit og forbedringer
```

---

## Appendix A: Detaljert Tag-Analyse per Case

### Case 001: Operation Feathered Battery
```
Node              | Tags                        | Matcher
------------------|-----------------------------|---------
ev_pigeon_photo   | DRONE, SURVEILLANCE, EYES   | ✓ DRONE
ev_schematic      | DRONE, GOVERNMENT, BATTERY  | ✓ DRONE, BATTERY
ev_powerline      | BATTERY, ELECTRICITY, CITY  | ✓ BATTERY
ev_grocery_list   | FOOD, SHOPPING              | ✗ Red Herring
ev_cat_picture    | FUR, PET                    | ✗ Red Herring

Valid Connections:
1. ev_pigeon_photo ↔ ev_schematic (DRONE)
2. ev_schematic ↔ ev_powerline (BATTERY)
3. ev_pigeon_photo + ev_powerline (ingen match - MÅ gå via schematic)
```

### Case 007: Titanic Tourism
```
Node              | Tags                   | Matcher
------------------|------------------------|---------
ev_iphone_1912    | TECH, OLD, PHONE       | -
ev_passenger_list | NAME, TIME, LIST       | ✓ TIME
ev_iceberg        | ICE, FAKE, PROP        | -
ev_souvenirs      | WEIGHT, TIME, CARGO    | ✓ TIME
ev_band           | MUSIC, TIME, CALM      | ✓ TIME
ev_movie          | FILM, LEAK             | ✗ Red Herring

Valid Connections:
1. ev_passenger_list ↔ ev_souvenirs (TIME)
2. ev_passenger_list ↔ ev_band (TIME)
3. ev_souvenirs ↔ ev_band (TIME)
4-5. Må finne 2 flere koblinger blant andre noder...

PROBLEM: 5 connections needed men kun 3 TIME-baserte!
Noder ev_iphone_1912 og ev_iceberg har ingen matchende tags.
```

**KRITISK FUNN:** Case 007 kan være UMULIG å fullføre hvis 5 gyldige koblinger faktisk kreves, men kun 3 TIME-baserte koblinger eksisterer!

---

## Appendix B: Foreslått Kode-Fix for Kritiske Bugs

### Fix 1: EvidenceNode Rotation

```typescript
// EvidenceNode.tsx - Bruk useMemo
const PhotoNode = memo(({ data }: { data: EvidenceNodeData }) => {
  const rotation = useMemo(() => Math.random() * 6 - 3, [data.id]);
  // ...
});
```

### Fix 2: Followers Sync

```typescript
// Index.tsx - Beregn én gang og pass ned
const handleGameEnd = useCallback((isVictory: boolean, sanity: number, connections: number) => {
  const followers = isVictory
    ? Math.floor(Math.random() * 500) + 100
    : Math.floor(Math.random() * 5) - 10;

  setGameResult({ isVictory, sanity, connections, followersGained: followers });

  if (isVictory && selectedCase) {
    completeCase(selectedCase.id, followers);
  }
  // ...
}, []);

// ResultScreen.tsx - Bruk prop istedenfor beregning
interface ResultScreenProps {
  followersGained: number; // Ny prop
  // ...
}
```

### Fix 3: Scribble Cleanup

```typescript
// ConspiracyBoard.tsx
const addScribble = useCallback((text: string, x: number, y: number) => {
  const newScribble = { /* ... */ };

  setGameState(prev => ({
    ...prev,
    scribbles: [...prev.scribbles.slice(-9), newScribble], // Maks 10
  }));

  // Auto-cleanup etter 4 sekunder
  setTimeout(() => {
    setGameState(prev => ({
      ...prev,
      scribbles: prev.scribbles.filter(s => s.id !== newScribble.id),
    }));
  }, 4000);
}, []);
```

---

## Konklusjon

Conspiracy Canvas har et solid konsept og sjarmerende estetikk, men lider av flere tekniske bugs og spillbalanse-problemer som reduserer spilleropplevelsen. De mest kritiske funnene er:

1. **Case 007 kan være umulig** - Krever verifisering av tag-struktur
2. **Followers-verdier er inkonsistente** - Bryter spillertillit
3. **Ingen informativ feedback ved feil** - Hindrer læring
4. **Flat straff-system** - Oppmuntrer ikke strategisk tenkning

Med de foreslåtte forbedringene kan spillet transformeres fra en frustrasjonsopplevelse til en engasjerende puzzle som faktisk belønner "conspiracy thinking".

---

*Analyse fullført: 2025-12-15*
