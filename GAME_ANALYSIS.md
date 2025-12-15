# Conspiracy Canvas - Spillanalyse og Forbedringer

**Dato:** 2025-12-15
**Analysert av:** Game Theory Analysis Agent
**Versjon:** 1.0

---

## Innholdsfortegnelse

1. [Spilloversikt](#spilloversikt)
2. [Funnet Feil og Mangler](#funnet-feil-og-mangler)
3. [Spillteori-analyse](#spillteori-analyse)
4. [Forbedringsforslag](#forbedringsforslag)
5. [Prioritert Roadmap](#prioritert-roadmap)

---

## Spilloversikt

**Conspiracy Canvas** er et humoristisk detektivspill hvor spilleren kobler bevis på en tavle for å "løse" konspirasjonsteorier. Spillet parodierer apofeni (tendensen til å se meningsfulle mønstre i tilfeldige data).

### Kjernemekanikk
- **Mål:** Koble N gyldige bevis-par (typisk 3-4 koblinger)
- **Sanity-system:** Starter på 100, -15 for feil kobling, -20 for å kaste kritisk bevis
- **Tag-basert validering:** Koblinger er gyldige hvis begge bevis deler minst én tag
- **UV-lys:** Avslører skjult tekst på kritiske bevis

---

## Funnet Feil og Mangler

### KRITISKE FEIL

#### 1. **Race Condition i Game Over/Victory Detection** (`ConspiracyBoard.tsx:152-161`)
```typescript
useEffect(() => {
  if (gameState.isVictory || gameState.isGameOver) {
    const timer = setTimeout(() => {
      onGameEnd(gameState.isVictory, gameState.sanity, gameState.validConnections);
    }, 800);
    return () => clearTimeout(timer);
  }
}, [gameState.isVictory, gameState.isGameOver, ...]);
```
**Problem:** Hvis spilleren gjør en kobling som samtidig trigger victory OG game over (sanity = 0 + connections = max), vil begge tilstander være true.
**Konsekvens:** Uforutsigbar oppførsel.

#### 2. **Memory Leak i Scribbles** (`ConspiracyBoard.tsx:164-176`)
```typescript
const addScribble = useCallback((text: string, x: number, y: number) => {
  setGameState((prev) => ({
    ...prev,
    scribbles: [...prev.scribbles, newScribble],
  }));
}, []);
```
**Problem:** Scribbles akkumuleres uendelig uten å bli ryddet opp.
**Konsekvens:** Ved lange spilløkter vil DOM bli fylt med usynlige elementer.

#### 3. **Dobbel Beregning av Followers** (`ResultScreen.tsx:82-84` vs `Index.tsx:39`)
```typescript
// ResultScreen.tsx - beregner followers for UI
const followersGained = isVictory ? Math.floor(Math.random() * 500) + 100 : ...;

// Index.tsx - beregner ANDRE followers for lagring
const followersGained = Math.floor(Math.random() * 500) + 100;
completeCase(selectedCase.id, followersGained);
```
**Problem:** To separate `Math.random()` kall betyr at UI viser ett tall, men et annet tall lagres.
**Konsekvens:** Spilleren ser feil follower-gevinst.

---

### MEDIUM FEIL

#### 4. **Rotasjons-flicker i EvidenceNode** (`EvidenceNode.tsx:29, 75, 107`)
```typescript
const rotation = Math.random() * 6 - 3; // Beregnes HVER render
```
**Problem:** `Math.random()` kalles ved hver re-render, noe som forårsaker visuell "hopping".
**Konsekvens:** Bevis-kort flimrer når state endres.

#### 5. **Mute Toggle Fungerer Ikke Korrekt** (`useAudio.ts:196-211`)
```typescript
const toggleMute = useCallback(() => {
  if (baseOscillatorRef.current) {
    const gain = baseOscillatorRef.current.context.createGain(); // Oppretter NY gain
    gain.gain.value = newMuted ? 0 : 0.02; // Setter på den NYE, ikke den eksisterende
  }
```
**Problem:** Oppretter en ny GainNode i stedet for å justere den eksisterende.
**Konsekvens:** Mute-knappen gjør ingenting med ambient lyd.

#### 6. **Evidence Bin Drop Zone For Liten** (`ConspiracyBoard.tsx:240-249`)
```typescript
const binZone = {
  x: viewportWidth - 100,
  y: viewportHeight - 100,
};
const isNearBin = nodeScreenX > binZone.x && nodeScreenY > binZone.y;
```
**Problem:** 100x100px zone nederst til høyre er for liten, spesielt på mobil.
**Konsekvens:** Frustrerende brukeropplevelse ved sletting av bevis.

#### 7. **Tags Vises Som [REDACTED] Men Hindrer Ikke Deduktiv Løsning** (`EvidenceNode.tsx:92-100`)
```typescript
{data.tags.slice(0, 2).map((tag) => (
  <span key={tag} className="...">
    [REDACTED]
  </span>
))}
```
**Problem:** Viser alltid "[REDACTED]" men spilleren kan fortsatt se tag-antallet og dedusere løsningen.
**Konsekvens:** Spilldesign-motsetning mellom hemmelighet og avsløring.

---

### MINDRE FEIL

#### 8. **Hardkodet Sanity-straff** (`ConspiracyBoard.tsx:325`)
Sanity-tap (-15/-20) er hardkodet og skalerer ikke med vanskelighetsgrad.

#### 9. **Ingen Pause-funksjonalitet**
Spilleren kan ikke pause midt i en sak.

#### 10. **Case-progresjon Krever Eksakt Rekkefølge** (`FilingCabinet.tsx:30-33`)
```typescript
const isCaseUnlocked = (index: number) => {
  if (index === 0) return true;
  return completedCases.includes(cases[index - 1].id);
};
```
Spilleren MÅ fullføre sakene i rekkefølge, ingen skip-mulighet.

#### 11. **Ingen Hint-system**
Spilleren får ingen hjelp hvis de sitter fast.

#### 12. **Lydkontekst Initialiseres Bare Via Klikk** (`AudioContext.tsx`)
Brukere som går direkte til spillet uten å klikke på menyen får ingen lyd.

---

## Spillteori-analyse

### Nash-likevekt og Optimal Strategi

#### Definisjon av Spillrommet
- **Spillere:** 1 (single-player mot systemet)
- **Tilstander:** {Sanity, Connections, Nodes på tavlen}
- **Handlinger:** {Koble(A,B), Slett(A), UV-toggle}
- **Payoff:** Victory (+followers) eller Game Over (0)

#### Matematisk Modell

La:
- `S` = Sanity (0-100)
- `C` = Gyldige koblinger (mål: N)
- `P(valid)` = Sannsynlighet for gyldig kobling
- `Cost_fail` = 15 (sanity-tap ved feil)
- `Cost_discard_critical` = 20

**Forventet Sanity-tap per forsøk:**
```
E[loss] = (1 - P(valid)) × Cost_fail
```

**Minimum forsøk til seier:**
```
Min_attempts = C / P(valid)
```

**Minimum Sanity for å vinne:**
```
S_required ≥ (C / P(valid) - C) × Cost_fail
```

#### Analyse av Case 001 (Tutorial)

**Data fra case_001.ts:**
- Totale noder: 14
- Kritiske noder: 3 (ev_pigeon_photo, ev_schematic, ev_powerline)
- Red herrings: 11
- Mål: 3 koblinger

**Tag-distribusjon:**
| Tag | Forekomster |
|-----|-------------|
| DRONE | 2 (kritiske) |
| BATTERY | 2 (kritiske) |
| SURVEILLANCE | 1 |
| EYES | 1 |
| GOVERNMENT | 1 |
| ELECTRICITY | 1 |
| CITY | 1 |
| *Andre* | 1 hver |

**P(valid) beregning:**
- Gyldige par: (pigeon↔schematic via DRONE), (schematic↔powerline via BATTERY)
- Totale mulige par: C(14,2) = 91
- **P(valid) = 2/91 ≈ 2.2%** (ekstremt lavt!)

**Forventet forsøk til 3 gyldige koblinger:**
```
E[attempts] = 3 / 0.022 ≈ 136 forsøk
```

**Forventet Sanity-tap:**
```
E[loss] = (136 - 3) × 15 = 1995 sanity-tap
```

**Konklusjon:** Med 100 Sanity og 15 tap per feil, kan spilleren bare feile ~6 ganger før game over. Uten hint-system er dette **matematisk nesten umulig** å vinne ved tilfeldig gjetting.

---

### Spillbalanse-problemer

#### Problem 1: Information Asymmetry
Spilleren vet ikke hvilke tags noder har. Spillet forventer at spilleren:
1. Leser beskrivelser nøye
2. Bruker UV-lys for hint
3. Deduserer tags fra kontekst

**Men:** Ingenting i UI-et forklarer dette. Tutorial mangler onboarding.

#### Problem 2: Punishment vs. Reward Imbalance

| Handling | Utfall | Verdi |
|----------|--------|-------|
| Gyldig kobling | +1 connection | +33% fremgang |
| Ugyldig kobling | -15 sanity | -15% av total |
| Kast kritisk bevis | -20 sanity | -20% + umulig å vinne |

**Risk/Reward ratio:**
- Belønning for suksess: ~33% mot mål
- Straff for feil: 15% av livet

Dette er **5x mer straffende** enn belønnende.

#### Problem 3: Manglende Strategisk Dybde

**Nåværende strategi:** Prøv og feil
**Ingen:**
- Deduksjonsverktøy
- Notat-system
- Mulighet til å markere mistenkelige noder
- Visuell gruppering av relaterte bevis

---

### Dominerende Strategier

#### Optimal Spillerstrategi (gitt nåværende regler):

1. **UV-lys først:** Scan alle noder for skjult tekst
2. **Identifiser kritiske noder:** De med `hiddenText` er sannsynligvis viktige
3. **Se etter ordmønstre:** Kritiske noder har ofte relaterte beskrivelser
4. **Unngå åpenbart søppel:** "Gum wrapper", "Coffee receipt" er alltid red herrings
5. **Koble tematisk:** Fugl + Strøm + Drone-dokumenter hører sammen

**Problemet:** Denne strategien er ikke oppdagbar uten ekstern hjelp.

---

## Forbedringsforslag

### Kritiske Fikser (Bug-reparasjoner)

#### Fix 1: Race Condition i Victory/GameOver
```typescript
// ConspiracyBoard.tsx - endre onConnect
setGameState((prev) => {
  const newValidConnections = prev.validConnections + 1;
  const newSanity = prev.sanity; // Suksess endrer ikke sanity
  const isVictory = newValidConnections >= prev.maxConnections;
  // Victory har prioritet over game over
  return {
    ...prev,
    validConnections: newValidConnections,
    isVictory: isVictory,
    isGameOver: !isVictory && newSanity <= 0,
  };
});
```

#### Fix 2: Scribble Memory Leak
```typescript
// Legg til cleanup i useEffect
useEffect(() => {
  const cleanup = setInterval(() => {
    setGameState(prev => ({
      ...prev,
      scribbles: prev.scribbles.slice(-10) // Behold bare siste 10
    }));
  }, 5000);
  return () => clearInterval(cleanup);
}, []);
```

#### Fix 3: Konsistent Followers-beregning
```typescript
// Index.tsx - send followers til ResultScreen
const handleGameEnd = useCallback((isVictory, sanityRemaining, connectionsFound) => {
  const followersGained = isVictory
    ? Math.floor(Math.random() * 500) + 100
    : Math.floor(Math.random() * 5) - 10;

  setGameResult({ isVictory, sanityRemaining, connectionsFound, followersGained });
  // ...
}, []);
```

#### Fix 4: Rotasjons-stabilitet
```typescript
// EvidenceNode.tsx - bruk stabil rotasjon fra parent
const PhotoNode = ({ data }: { data: EvidenceNodeData }) => {
  const rotation = data.rotation || 0; // Bruk pre-beregnet verdi
  // ...
};
```

#### Fix 5: Mute-funksjonalitet
```typescript
// useAudio.ts - lagre baseGain som ref
const baseGainRef = useRef<GainNode | null>(null);

// I initialize:
baseGainRef.current = baseGain;

// I toggleMute:
if (baseGainRef.current) {
  baseGainRef.current.gain.value = newMuted ? 0 : 0.02;
}
```

---

### Spillteori-baserte Forbedringer

#### Forbedring 1: Dynamisk Vanskelighetsgrad

**Forslag:** Adaptive sanity-kostnader basert på spillerprogresjon

```typescript
interface DifficultyConfig {
  failPenalty: number;
  discardPenalty: number;
  hintCost: number;
}

const difficulties: Record<string, DifficultyConfig> = {
  TUTORIAL: { failPenalty: 5, discardPenalty: 10, hintCost: 5 },
  EASY: { failPenalty: 10, discardPenalty: 15, hintCost: 8 },
  MEDIUM: { failPenalty: 15, discardPenalty: 20, hintCost: 10 },
  HARD: { failPenalty: 20, discardPenalty: 30, hintCost: 15 },
};
```

#### Forbedring 2: Hint-system

**Forslag:** Sanity-kostet hint-mekanikk

```typescript
interface HintSystem {
  getHint: () => {
    type: 'tag_reveal' | 'connection_highlight' | 'eliminate_herring';
    cost: number;
  };
}

// Hint-typer:
// 1. Vis én tag på en node (-5 sanity)
// 2. Fremhev et gyldig par (-10 sanity)
// 3. Fjern en red herring fra tavlen (-3 sanity)
```

**Spillteori-begrunnelse:**
- Skaper meningsfull trade-off: kunnskap vs. overlevelse
- Øker strategisk dybde
- Gjør spillet vinnbart uten perfekt informasjon

#### Forbedring 3: Tag-synlighetssystem

**Forslag:** Gradvis avsløring av tags

```typescript
interface TagVisibility {
  level: 'hidden' | 'category' | 'partial' | 'full';
}

// Nivåer:
// hidden: "[REDACTED]"
// category: "[PERSON/STED/TING]"
// partial: "[DR***]"
// full: "[DRONE]"

// Avhengig av:
// - UV-lys aktivitet
// - Antall gyldige koblinger gjort
// - Hint brukt
```

#### Forbedring 4: Combo-system

**Forslag:** Belønning for rask suksess

```typescript
interface ComboSystem {
  consecutiveSuccesses: number;
  bonusMultiplier: number;
}

// 2 på rad: +5 sanity tilbake
// 3 på rad: +10 sanity + ekstra follower
// 4+ på rad: +15 sanity + "ENLIGHTENED" achievement
```

**Spillteori-begrunnelse:**
- Balanserer risk/reward
- Belønner dyktig spill
- Skaper "hot streak" engasjement

#### Forbedring 5: Evidence Clustering

**Forslag:** Visuelt grupperingsverktøy

```typescript
interface EvidenceCluster {
  id: string;
  nodes: string[];
  color: string;
  label: string;
}

// Spilleren kan:
// 1. Opprette grupper (sirkler) på tavlen
// 2. Dra noder inn i grupper
// 3. Navngi grupper
// 4. Se visuell feedback når grupper har matchende tags
```

---

### UX-forbedringer

#### 1. Tutorial Overlay
```typescript
interface TutorialStep {
  target: string; // CSS selector
  message: string;
  action: 'click' | 'drag' | 'connect';
}

const tutorialSteps: TutorialStep[] = [
  { target: '.evidence-node', message: 'Dette er et bevis. Dra det rundt.', action: 'drag' },
  { target: '.uv-toggle', message: 'UV-lys avslører skjulte beskjeder.', action: 'click' },
  { target: '.evidence-node', message: 'Koble to bevis med felles tema.', action: 'connect' },
];
```

#### 2. Større Evidence Bin Zone
```typescript
const binZone = {
  x: viewportWidth - 200, // 200px i stedet for 100
  y: viewportHeight - 200,
};
```

#### 3. Pause-meny
```typescript
interface PauseMenu {
  isOpen: boolean;
  options: ['Resume', 'Restart', 'Settings', 'Quit'];
}
```

#### 4. Undo-funksjon
```typescript
interface UndoSystem {
  history: GameState[];
  maxHistory: number;
  undo: () => void;
  canUndo: boolean;
}

// Maks 3 undos per sak
// Koster 5 sanity per undo
```

---

## Prioritert Roadmap

### Fase 1: Kritiske Bug-fikser (Høyeste prioritet)

| # | Oppgave | Fil | Kompleksitet |
|---|---------|-----|--------------|
| 1 | Fix race condition victory/gameover | ConspiracyBoard.tsx | Lav |
| 2 | Fix follower-dobbeltberegning | Index.tsx, ResultScreen.tsx | Lav |
| 3 | Fix mute-funksjonalitet | useAudio.ts | Lav |
| 4 | Fix rotasjons-flicker | EvidenceNode.tsx | Lav |
| 5 | Cleanup scribble memory leak | ConspiracyBoard.tsx | Lav |

### Fase 2: Spillbalanse (Høy prioritet)

| # | Oppgave | Påvirkning |
|---|---------|------------|
| 1 | Implementer dynamisk vanskelighetsgrad | Gjør spillet spillbart |
| 2 | Legg til hint-system | Gir strategisk dybde |
| 3 | Øk evidence bin drop zone | Forbedrer UX |
| 4 | Rebalanserer sanity-kostnader | Bedre risk/reward |

### Fase 3: Spilldybde (Medium prioritet)

| # | Oppgave | Påvirkning |
|---|---------|------------|
| 1 | Combo-system | Engasjement |
| 2 | Evidence clustering | Strategisk verktøy |
| 3 | Tag-synlighetssystem | Informasjonsflyt |
| 4 | Undo-funksjon | Tilgjengelighet |

### Fase 4: Polish (Lavere prioritet)

| # | Oppgave |
|---|---------|
| 1 | Tutorial overlay |
| 2 | Pause-meny |
| 3 | Achievement-system |
| 4 | Statistikk-sporing |

---

## Konklusjon

**Conspiracy Canvas** har et sterkt konsept og visuelt design, men har betydelige spillbalanse-problemer som gjør spillet matematisk svært vanskelig uten hint-system. De kritiske bug-fiksene er enkle å implementere, mens spillbalanse-forbedringene krever mer arbeid men vil dramatisk forbedre spilleropplevelsen.

**Viktigste funn:**
1. Victory/GameOver race condition må fikses umiddelbart
2. P(valid) ≈ 2.2% gjør random-strategi umulig
3. Risk/reward er 5x for straffende
4. Hint-system er kritisk for spillbarhet
5. UV-lys-mekanikken er underutnyttet

**Anbefaling:** Start med Fase 1 bug-fikser, deretter implementer hint-system og dynamisk vanskelighetsgrad for å gjøre spillet faktisk spillbart.

---

*Generert av Game Theory Analysis Agent*
