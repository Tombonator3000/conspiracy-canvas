# Conspiracy Canvas - Spillanalyse og Feilrapport

**Dato:** 2025-12-16
**Analysert av:** Claude Code
**Versjon:** Aktuell kodebase

---

## 1. OVERSIKT

Conspiracy Canvas er et satirisk puzzle-spill der spilleren kobler sammen bevismateriale på en korktavle for å avsløre absurde konspirasjonsteorier. Spillet har solid konseptuelt design, men flere kritiske balanse- og tekniske problemer.

---

## 2. TEKNISKE FEIL

### 2.1 Build & Lint Feil

| Fil | Linje | Type | Beskrivelse |
|-----|-------|------|-------------|
| `ConspiracyBoard.tsx` | 1244-1245 | ERROR | `as any` type-casting på nodeTypes/edgeTypes |
| `ConspiracyBoard.tsx` | 1046 | WARNING | Manglende dependency `threadType` i useCallback |
| `ParanoiaEvents.tsx` | 62 | WARNING | Manglende dependency `triggerEvent` |
| `command.tsx` | 24 | ERROR | Tom interface deklarasjon |
| `textarea.tsx` | 5 | ERROR | Tom interface deklarasjon |
| `Index.tsx` | 115-116 | ERROR | Leksikalsk deklarasjon i case block |
| `tailwind.config.ts` | 104 | ERROR | Forbudt require() import |
| `useAudio.ts` | 475 | WARNING | Ref cleanup race condition |

**Total: 7 errors, 12 warnings**

### 2.2 Sikkerhets-sårbarheter (npm audit)

| Pakke | Alvorlighet | Beskrivelse |
|-------|-------------|-------------|
| esbuild | MODERATE | Development server request vulnerability |
| vite | MODERATE | Avhengig av sårbar esbuild |
| glob | HIGH | Command injection via --cmd flag |
| js-yaml | MODERATE | Prototype pollution i merge |

### 2.3 Type-sikkerhet

```typescript
// ConspiracyBoard.tsx:1244-1245
nodeTypes={nodeTypes as any}  // FARLIG: Mister type-sjekk
edgeTypes={edgeTypes as any}  // FARLIG: Mister type-sjekk
```

**Anbefaling:** Bruk proper ReactFlow generics.

---

## 3. SPILLBALANSE-PROBLEMER (Game Theory Analyse)

### 3.1 KRITISK: "Hoarder vs Cleaner" Dilemma

**Situasjon:**
- Start-kredibilitet: 500 poeng
- Kast ekte bevis: -100 til -500 poeng (progressivt)
- Kast søppel: +150 poeng
- Hoarder-straff på slutten: -50 per søppel igjen

**Game Theory Problem:**

```
Spillerens valg:
A) Kast søppel → +150, men risikerer -100/-500 ved feil
B) Behold alt → -50 per søppel på slutten, men trygt

Forventet verdi-beregning:
- Med 10 søppel-noder og 3 kritiske:
  - Sjanse for feil: 3/13 = 23%
  - Forventet tap ved kasting: 0.23 * (-100 til -500) = -23 til -115
  - Gevinst ved riktig kasting: 0.77 * 150 = +115.5

Men: Ved første feil går spilleren ofte Game Over (500 - 100 = 400, neste = 200)
```

**Nash-likevekt:** Optimal strategi er å ALDRI bruke søppelbøtta fordi risikoen overstiger gevinsten.

**Anbefaling:** Reduser første evidence-straff til -50, max til -200.

### 3.2 KRITISK: Combo-system er utilgjengelig

**Problem:**
- Combo krever 2+ korrekte tilkoblinger på rad
- Men spilleren må gjette matching tags
- Feil tilkobling resetter combo OG koster -15 sanity

**Game Theory:**
```
Risiko per tilkoblingsforsøk:
- Riktig: +0-100 combo-bonus
- Feil: -15 sanity + combo reset

Med 3 kritiske noder og ~15 tags totalt:
- Gjennomsnittlig matching-sjanse: ~30%
- Forventet combo-lengde: 1/(1-0.3) = 1.4 tilkoblinger

Spilleren når sjelden combo x3 (+50) eller x5 (+100)
```

**Anbefaling:**
1. Vis tag-hint når UV-lys er på
2. Gi combo-bonus allerede ved første riktige tilkobling

### 3.3 ConnectionCounter Misvisende

**Kode (ConnectionCounter.tsx):**
```tsx
const isComplete = current >= max;  // Linje 10
```

**Problem:**
- `current` = antall kritiske noder i STØRSTE klynge
- `max` = totalt antall kritiske noder
- Men: 3 separate klynger med 1 node hver = "3/3" selv om de ikke er koblet sammen!

**Anbefaling:** Bruk `checkAllCriticalConnected()` for å verifisere faktisk seier.

### 3.4 Vanskelighetsgrad-kurve

| Case | Vanskelighet | Sanity | Kritiske | Søppel | Ratio |
|------|--------------|--------|----------|--------|-------|
| 1 | TUTORIAL | 100 | 3 | 11 | 3.7:1 |
| 2 | EASY | 100 | 3 | 10 | 3.3:1 |
| 3 | EASY | 85 | 3 | 9 | 3.0:1 |
| 4 | MEDIUM | 75 | 4 | 8 | 2.0:1 |
| 5 | MEDIUM | 75 | 4 | 9 | 2.25:1 |
| 6 | HARD | 70 | 5 | 10 | 2.0:1 |
| 7 | HARD | 70 | 5 | 11 | 2.2:1 |

**Problem:** Søppel-til-kritisk ratio er for konsistent. HARD burde ha mer støy.

### 3.5 "Undo"-mekanikk er for dyr

**Kost:** 30 sanity (av 70-100 start)
**Bruk:** 1 gang per spill

**Problem:**
- På HARD (70 sanity) = 43% av total HP for én undo
- Etter 2 feil tilkoblinger (-30) er undo ikke lenger tilgjengelig
- Skaper "save-scumming" incentiv snarere enn strategisk bruk

**Anbefaling:** Reduser til 15-20 sanity, eller gjør det gratis første gang.

---

## 4. GAME THEORY: OPTIMAL SPILLESTRATEGI

### 4.1 Minimax-strategi (Minimere tap)

```
1. ALDRI bruk søppelbøtta
2. Aktiver UV-lys og les alle hiddenText
3. Koble kun noder med ÅPENBARE tag-match
4. Aksepter hoarder-straff (-50 * søppel)
5. Bruk undo KUN ved kritisk feil

Forventet utfall:
- Sanity: 70-100 start, -15 per feil, ~3-4 feil toleranse
- Kredibilitet: 500 - (10 * 50) = 0 (borderline)
```

### 4.2 Maksimere poeng (Risikovillig)

```
1. Identifiser søppel via tags som ikke matcher kritiske
2. Kast sikkert søppel først (+150 hver)
3. Bruk kombinasjons-mekanikken (+200-500)
4. Hold combo-kjeder

Forventet utfall (best case):
- Søppel kastet: 8 * 150 = +1200
- Kombinasjoner: 3 * 300 = +900
- Combo-bonus: ~200
- Total: 500 + 2300 = 2800 kredibilitet

Forventet utfall (med 2 feil):
- 500 - 100 - 200 + (6 * 150) = 1100
- Fortsatt spillbart
```

### 4.3 Spillerutnyttelse (Exploits)

1. **UV-lys info-leak:** hiddenText gir ofte direkte svar
2. **Kombinasjons-hints:** Under UV vises hint for kombinerbare items
3. **Tag-match indicator:** Viser matching-styrke under tilkobling

---

## 5. MANGLENDE FUNKSJONER

### 5.1 Ingen tester

```bash
find . -name "*.test.*" -o -name "*.spec.*"
# Ingen resultater
```

**Kritiske funksjoner som trenger tester:**
- `validateConnection()` - Tag-matching logikk
- `checkAllCriticalConnected()` - BFS seiersjekk
- `calculateEvidencePenalty()` - Progressiv straff
- `findCombination()` - Kombinasjons-matching

### 5.2 Ingen case-validering

Kode for å validere case-data ved oppstart mangler:
- Kritiske noder må eksistere
- Tags må ha minst én match-partner
- Kombinasjoner må referere til eksisterende noder
- ScribblePool kan ikke være tom

### 5.3 Ingen lagring/fortsett

- Ingen `localStorage` save-state
- Spilleren mister progress ved lukking
- `useGameProgress` lagrer kun fullførte cases, ikke pågående

### 5.4 Ingen tilgjengelighet (a11y)

- Ingen `aria-labels` på interaktive elementer
- Ingen keyboard-navigasjon dokumentert
- Fargekontrast ikke validert for fargeblindhet

---

## 6. ANBEFALTE FORBEDRINGER

### 6.1 Høy prioritet (Kritisk for spillbarhet)

| # | Forbedring | Innsats | Effekt |
|---|------------|---------|--------|
| 1 | Fiks evidence-straff balanse | Lav | Høy |
| 2 | Fiks ConnectionCounter logikk | Lav | Høy |
| 3 | Legg til enhetstester | Medium | Høy |
| 4 | Fiks TypeScript `as any` | Lav | Medium |

### 6.2 Medium prioritet

| # | Forbedring | Innsats | Effekt |
|---|------------|---------|--------|
| 5 | Reduser undo-kostnad | Lav | Medium |
| 6 | Vis tag-hint i UV-modus | Medium | Medium |
| 7 | Legg til case-validering | Medium | Medium |
| 8 | Fiks npm security issues | Lav | Medium |

### 6.3 Lav prioritet (Nice to have)

| # | Forbedring | Innsats | Effekt |
|---|------------|---------|--------|
| 9 | Auto-save funksjon | Medium | Lav |
| 10 | Tilgjengelighets-forbedringer | Høy | Lav |
| 11 | Combo-system rebalansering | Medium | Medium |
| 12 | Dynamisk vanskelighetsgrad | Høy | Medium |

---

## 7. KODEKVALITETscore

| Kategori | Score | Kommentar |
|----------|-------|-----------|
| Arkitektur | 7/10 | God separasjon, men ConspiracyBoard er for stor (1310 linjer) |
| Type-sikkerhet | 6/10 | Generelt bra, men `as any` og tomme interfaces |
| Test-dekning | 0/10 | Ingen tester |
| Spillbalanse | 4/10 | Flere kritiske ubalanser |
| UX | 7/10 | God feedback, men misvisende indikatorer |
| Dokumentasjon | 8/10 | God inline-dokumentasjon og GAME_ANALYSIS.md |

**Total: 5.3/10**

---

## 8. KONKLUSJON

Conspiracy Canvas har et kreativt konsept og solid teknisk fundament, men lider av flere game-design problemer som gjør optimal strategi kontraintuitiv. De viktigste funnene:

1. **Søppelbøtta er en felle** - Risikoen overstiger gevinsten
2. **Combo-systemet er uoppnåelig** - For høy feilrisiko
3. **ConnectionCounter lyver** - Viser ikke faktisk seier-tilstand
4. **Undo er for dyrt** - 30-43% av HP for én bruk

Med relativt små justeringer kan spillet gå fra frustrerende til morsomt:

- Reduser evidence-straff fra 100-500 til 50-200
- Gi combo-bonus fra første riktige tilkobling
- Fiks ConnectionCounter til å bruke klynge-sjekk
- Reduser undo-kostnad til 15-20 HP

---

*Logg generert automatisk av Claude Code*
