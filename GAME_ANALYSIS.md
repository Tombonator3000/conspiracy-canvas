# Conspiracy Canvas - Spillanalyse

**Dato:** 2025-12-16
**Versjon:** Post PR #2
**Analysert av:** Claude AI

---

## 1. Spilloversikt

**Conspiracy Canvas** er et puslespill hvor spilleren etterforsker konspirasjonssaker ved å koble sammen bevisnoder på en digital korktavle. Spillet parodierer apofeni - tendensen til å finne mønstre i urelatert informasjon.

### Kjernemekanikk
| Mekanikk | Beskrivelse |
|----------|-------------|
| **Bevisnoder** | 10-15 elementer per case (bilder, dokumenter, post-it-lapper) |
| **Røde tråder** | Koble noder med matchende tags |
| **Sanity** | HP-system - starter 70-100, -15 per feil tilkobling |
| **Credibility** | Poeng-system - starter 500, +150 for søppel, -500 for bevis |
| **UV-lys** | Avslører skjult tekst på noder |
| **Vinnbetingelse** | Alle kritiske noder i samme tilkoblede klynge (BFS) |

---

## 2. Spillteoretisk Analyse

### 2.1 Spillerens Beslutningstre

```
                    [START CASE]
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        [KOBLE NODER]         [KAST NODER]
              │                     │
     ┌────────┴────────┐    ┌───────┴───────┐
     ▼                 ▼    ▼               ▼
 [GYLDIG]         [UGYLDIG] [SØPPEL]    [BEVIS]
 +scribble         -15 HP   +150 cred   -500 cred
 progress           │         │         -20 HP
     │              │         │            │
     ▼              ▼         ▼            ▼
 [SEIER?]    [HP≤0? DEAD]  [RENT BRETT] [GAME OVER?]
```

### 2.2 Nash-likevekt Analyse

**Spillerens Optimalstrategi:**

1. **Informasjonsinnsamling først** (UV-lys)
   - Kostnad: 0 (ingen straff)
   - Nytte: Avslører skjult informasjon
   - **Nash-likevekt:** Bruk UV-lys på ALLE noder før handling

2. **Sikre tilkoblinger prioriteres**
   - Spilleren må identifisere tags som deles mellom kritiske noder
   - **Dominant strategi:** Kun koble noder med 100% sannsynlighet for match

3. **Søppel-fjerning som sub-spill**
   - Forventet verdi av å kaste en node:
   ```
   E(V) = P(søppel) × (+150) + P(bevis) × (-500 - 20 HP verdi)

   For Case 001: P(søppel) = 10/13 ≈ 77%
   E(V) = 0.77 × 150 + 0.23 × (-500)
   E(V) = 115.5 - 115 = +0.5 (marginalt positivt)
   ```

### 2.3 Risiko-Nytte Matrise

| Handling | Suksess | Fiasko | Forventet Verdi |
|----------|---------|--------|-----------------|
| Koble gyldig | +progresjon | N/A | Høy (+) |
| Koble ugyldig | N/A | -15 HP | Høy (-) |
| Kast søppel | +150 cred | N/A | +150 |
| Kast bevis | N/A | -500 cred, -20 HP | -520 effektiv |
| Bruk UV-lys | Info | N/A | +∞ (ingen kostnad) |

### 2.4 Minimax-Strategi

**For HARD-case (sanity=70):**

```
Maks feil tillatt = 70 / 15 = 4.67 → 4 feil
Maks bevis kastet = 500 / 500 = 1 → 0 bevis

Spilleren må:
1. Unngå ALL risiko for å kaste bevis (dominant strategi)
2. Ha maks 4 feil tilkoblinger
```

**Konsekvens:** På HARD-nivå er optimal strategi å ALDRI bruke søppelbøtta, fordi risikoen for game over er for høy.

### 2.5 Spillbalanse-Problem: Asymmetrisk Straff

```
Belønning/Straff-ratio:

Søppel kastet:    +150 poeng
Bevis kastet:     -500 poeng (3.33x straff)

Gyldig tilkobling:   +progresjon
Ugyldig tilkobling:  -15 HP (10% av total)

ASYMMETRI: Straff >> Belønning
```

**Spillteoretisk konklusjon:** Spilleren har **dominant strategi** for å unngå all risiko (kast ingenting), noe som bryter den tiltenkte spillopplevelsen.

---

## 3. Identifiserte Feil og Mangler

### 3.1 KRITISK: One-Strike Game Over

**Lokasjon:** `ConspiracyBoard.tsx:368-380`

```typescript
// PROBLEM: En enkelt feil = game over
setGameState((prev) => {
  const newCredibility = prev.credibility - 500;  // 500 - 500 = 0
  const isCredibilityGameOver = newCredibility < 0;
  // ...
});
```

**Innvirkning:**
- Startcredibility = 500
- Straff for bevis = -500
- EN feil = instant game over

**Alvorlighetsgrad:** 🔴 KRITISK

**Løsningsforslag:**
```typescript
// Gradert straff basert på vanskelighetsgrad
const penaltyByDifficulty = {
  "TUTORIAL": 150,
  "EASY": 200,
  "MEDIUM": 300,
  "HARD": 400
};
const penalty = penaltyByDifficulty[caseData.difficulty] ?? 250;
```

---

### 3.2 HØY: Logisk Tvetydighet i Bevis-Kategorisering

**Lokasjon:** `ConspiracyBoard.tsx:336-339`

```typescript
// PROBLEM: En node kan være BÅDE red herring OG critical
const isJunk = nodeData.isRedHerring;
const isRealEvidence = !nodeData.isRedHerring || nodeData.isCritical;

// Hvis isRedHerring=true AND isCritical=true:
// isJunk = true
// isRealEvidence = true (fordi isCritical=true)
// Resultat: Node behandles som real evidence, men er merket som junk
```

**Konsekvens:** Inkonsistent datamodell kan føre til uforutsigbar oppførsel.

**Løsningsforslag:**
```typescript
// Klar prioritet: critical nodes er ALLTID real evidence
const isJunk = nodeData.isRedHerring && !nodeData.isCritical;
const isRealEvidence = !nodeData.isRedHerring || nodeData.isCritical;
```

---

### 3.3 MEDIUM: ConnectionCounter Visuell Feil

**Lokasjon:** `ConnectionCounter.tsx:10` og `ConspiracyBoard.tsx:521-524`

```typescript
// ConnectionCounter.tsx
const isComplete = current >= max;  // Visuell indikator

// ConspiracyBoard.tsx
const isVictory = checkAllCriticalConnected(updatedEdges, criticalNodeIds);
```

**Problem:**
- Counter viser "3/3" og grønt ikon når 3 noder er i EN klynge
- Men seier krever at ALLE kritiske noder er i SAMME klynge
- Spiller kan ha 3 separate klynger med 1 node hver = "3/3" men ingen seier

**Løsningsforslag:**
```typescript
// Send isVictory til ConnectionCounter
<ConnectionCounter
  current={gameState.validConnections}
  max={criticalNodeIds.length}
  isVictory={gameState.isVictory}  // Ny prop
/>
```

---

### 3.4 MEDIUM: Minnelekkasje - Scribbles

**Lokasjon:** `ConspiracyBoard.tsx:273-276`

```typescript
setGameState((prev) => ({
  ...prev,
  scribbles: [...prev.scribbles, newScribble],  // Vokser uendelig
}));
```

**Problem:** Scribbles-array vokser uten begrensning under lange spilløkter.

**Løsningsforslag:**
```typescript
const MAX_SCRIBBLES = 20;
setGameState((prev) => ({
  ...prev,
  scribbles: [...prev.scribbles, newScribble].slice(-MAX_SCRIBBLES),
}));
```

---

### 3.5 LAV: Hoarder Penalty UI Forvirring

**Lokasjon:** `ResultScreen.tsx:84`

```typescript
const hoarderPenalty = credibilityStats.junkRemaining * 50;
```

**Problem:** Spillere blir straffet for å IKKE kaste søppel, men risikoen for å kaste bevis er så høy at optimal strategi er å kaste ingenting.

**Innvirkning:** UI viser negativ straff for rasjonell oppførsel.

---

### 3.6 LAV: Audio Initialisering Feiler Stille

**Lokasjon:** `useAudio.ts:33-67`

```typescript
try {
  // Initialize audio context
} catch (error) {
  console.error('Failed to initialize audio:', error);
  // INGEN bruker-synlig feedback
}
```

**Løsningsforslag:** Legg til visuell indikator eller toast-melding.

---

## 4. Case-Balanse Analyse

### 4.1 Oversikt Over Cases

| Case | Vanskelighet | Sanity | Kritiske | Red Herrings | Ratio |
|------|--------------|--------|----------|--------------|-------|
| 001 | TUTORIAL | 100 | 3 | 10 | 77% søppel |
| 002 | EASY | 100 | 3 | ~10 | ~77% |
| 007 | HARD | 70 | 5 | 11 | 69% søppel |

### 4.2 Forventet Feilmargin

```
TUTORIAL (Case 001):
- Maks tilkoblingsfeil: 100/15 = 6.67 → 6 feil
- Maks kastede bevis: 500/500 = 1 → 0 feil
- Total feilmargin: 6 (tilkobling) + 0 (kast) = 6

HARD (Case 007):
- Maks tilkoblingsfeil: 70/15 = 4.67 → 4 feil
- Maks kastede bevis: 500/500 = 1 → 0 feil
- Total feilmargin: 4 (tilkobling) + 0 (kast) = 4
```

### 4.3 Balanseanbefaling

| Vanskelighet | Anbefalt Sanity | Anbefalt Bevis-Straff |
|--------------|-----------------|----------------------|
| TUTORIAL | 100 | -150 |
| EASY | 100 | -200 |
| MEDIUM | 85-90 | -300 |
| HARD | 70 | -400 |

---

## 5. Spillteori: Forbedringsforslag

### 5.1 Introduser Mekanisme for Informasjonsavsløring

**Problem:** Spilleren mangler insentiv til å ta kalkulert risiko.

**Løsning:** "Hint-system" som avslører én tag ved korrekt avfallshåndtering.

```
Før: Kast søppel → +150
Etter: Kast søppel → +150 + avsløre én skjult tag på random node
```

**Spillteoretisk effekt:** Øker forventet verdi av søppelkasting, skaper interessant risiko-belønning trade-off.

---

### 5.2 Progressiv Straff-Skalering

**Problem:** Flat -500 straff er for brutal.

**Løsning:** Eskalerenderende straffer.

```typescript
const calculateEvidencePenalty = (timesWrong: number): number => {
  const basePenalty = 100;
  const multiplier = Math.min(timesWrong + 1, 5);  // Maks 5x
  return basePenalty * multiplier;
};

// 1. feil: -100
// 2. feil: -200
// 3. feil: -300
// 4. feil: -400
// 5+ feil: -500
```

**Spillteoretisk effekt:** Tillater utforskning tidlig i spillet, straffer gjentatte feil.

---

### 5.3 "Undo" Mekanikk med Kostnad

**Problem:** Irreversible feil er frustrerende.

**Løsning:** Tillat én "undo" per case mot sanity-kostnad.

```typescript
const undoLastAction = () => {
  if (undoAvailable && sanity >= 30) {
    restoreLastState();
    setSanity(prev => prev - 30);
    setUndoAvailable(false);
  }
};
```

**Spillteoretisk effekt:** Skaper interessant valg mellom å beholde undo for senere vs. bruke tidlig.

---

### 5.4 Tag-Visualisering Under Tilkobling

**Problem:** Blindt prøving og feiling er kjedelig.

**Løsning:** Vis partial tag-match under dragging.

```
Når spiller drar fra Node A til Node B:
- Vis "0/3 tags match" → "1/3 tags match" → "MATCH!"
- Farge-gradering: Rød → Gul → Grønn
```

**Spillteoretisk effekt:** Reduserer frustrasjon, opprettholder utfordring.

---

### 5.5 Combo-System for Korrekte Tilkoblinger

**Problem:** Ingen belønning for skillfull spilling.

**Løsning:** Combo-multiplikator.

```typescript
const calculateComboBonus = (consecutiveCorrect: number): number => {
  if (consecutiveCorrect >= 5) return 100;
  if (consecutiveCorrect >= 3) return 50;
  if (consecutiveCorrect >= 2) return 25;
  return 0;
};
```

**Spillteoretisk effekt:** Belønner konsistent korrekt spill, øker replay value.

---

## 6. Teknisk Gjeld

### 6.1 Arkitektur

| Fil | Linjer | Problem | Anbefaling |
|-----|--------|---------|------------|
| ConspiracyBoard.tsx | 624 | For stor | Split til hooks + komponenter |
| useAudio.ts | ~120 | Raw Web Audio | Vurder Howler.js |

### 6.2 Testing

**Mangler:**
- [ ] Unit tests for `validateConnection()`
- [ ] Unit tests for `checkAllCriticalConnected()`
- [ ] Unit tests for credibility-beregning
- [ ] Integration tests for game flow
- [ ] E2E tests for mobile touch-interaksjon

### 6.3 Data Validering

**Anbefaling:** Legg til case-data schema validering ved oppstart.

```typescript
const validateCaseData = (caseData: CaseData): ValidationResult => {
  const errors: string[] = [];

  // Må ha minst én kritisk node
  const criticalNodes = caseData.nodes.filter(n => n.isCritical);
  if (criticalNodes.length === 0) {
    errors.push('Case must have at least one critical node');
  }

  // Alle kritiske noder må ha minst én felles tag-path
  // (kompleks graf-analyse)

  // Scribble pool må ikke være tom
  if (caseData.scribblePool.length === 0) {
    errors.push('Scribble pool cannot be empty');
  }

  return { valid: errors.length === 0, errors };
};
```

---

## 7. Sammendrag

### Kritiske Issues (Må fikses)
1. 🔴 One-strike game over ved bevis-kasting (-500 = instant death)
2. 🔴 Logisk tvetydighet i junk/evidence kategorisering

### Høy Prioritet
3. 🟠 ConnectionCounter visuell mismatch med faktisk seier-tilstand
4. 🟠 Minnelekkasje i scribbles-array

### Medium Prioritet
5. 🟡 Hoarder penalty oppmuntrer til å ikke bruke mekanikk
6. 🟡 Ingen audio-feilhåndtering for bruker

### Spillbalanse
7. 🟡 Asymmetrisk straff bryter spillerens insentiver
8. 🟡 Dominant strategi = unngå risiko = kjedelig spill

### Forbedringer (Nye Features)
9. 🟢 Hint-system for informasjonsavsløring
10. 🟢 Progressiv straff-skalering
11. 🟢 Undo-mekanikk med kostnad
12. 🟢 Tag-visualisering under tilkobling
13. 🟢 Combo-system for korrekte tilkoblinger

---

## 8. Appendiks: Matematisk Modell

### Forventet Spilltid (Antall Handlinger)

```
For Case 001:
- Kritiske tilkoblinger nødvendig: 3 (minimum 2 edges)
- Forventet feil-tilkoblinger: 2-4 (avhengig av spillererfaring)
- Søppel å kaste: 10 (optimal), 0 (risiko-avers)

Totale handlinger (optimal): 2 + 0 + 10 = 12 handlinger
Totale handlinger (forsiktig): 2 + 4 + 0 = 6 handlinger
```

### Game Over Sannsynlighet

```
P(game over) = P(sanity=0) + P(credibility<0)

For HARD case med random spill:
P(sanity=0) = 1 - (1 - 0.7)^n der n = antall tilkoblingsforsøk
P(credibility<0) = (antall bevis kastet) × (1 / totale noder)

Med 10 tilkoblingsforsøk og 3 kast:
P(sanity=0) ≈ 97%
P(credibility<0) ≈ 69% per kast
```

---

*Rapport generert for Conspiracy Canvas v1.0*
