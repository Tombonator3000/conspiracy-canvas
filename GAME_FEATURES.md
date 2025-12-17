# Conspiracy Canvas - Game Features Documentation

En komplett oversikt over alle effekter, mekanikker og egenskaper i spillet.

---

## Kjernemeknanikker

### Sanity-system (Helse)
- Startverdier: 70-100 basert på vanskelighetsgrad
- Straff: Feil tilkobling (-15), kaste kritisk bevis (-20), misset paranoia-anrop (-10)
- Visuell indikator med hjerne-ikon → varsel-trekant når lav
- Pulserende animasjon når kritisk (< 15%)

### Forbindelsessystem ("String Threading")
- Røde og blå tråder (valgfri farge)
- Twisted yarn gradient-effekter
- Glow-effekter for gyldige koblinger
- Skyggelag for 3D-utseende
- Dynamiske filter-effekter for trådtekstur

### Poeng/Credibility-system
- Case Resolved Bonus: +1000 poeng
- Cleanup Bonus: +100 per søppel kastet
- Junk Remaining Penalty: -50 per gjenværende søppel
- Sanity Bonus: +5 per gjenværende sanity-poeng
- Combo Bonus: +25 (2+), +50 (3+), +100 (5+ påfølgende riktige)
- Stjerne-rating system (1-5 stjerner)

### Vinn-betingelser
- Alle kritiske bevis må kobles i én klynge
- Tag-basert validering med BFS (Breadth-First Search)
- Semantiske truth tags må være til stede

---

## Visuelle Effekter

### MadnessOverlay (Galskapseffekter)
| Sanity Level | Effekt |
|--------------|--------|
| < 50 | Vignette mørklegging |
| < 25 | Progressiv blur-effekt |
| < 25 | Rød tint-puls |
| < 20 | Skjermstøy (SVG turbulens) |
| Veldig lav | Skjermristing |
| = 0 | Full blur + blackout (game over) |

### UV-lys Mekanikk
- Sirkulært spotlight som følger markøren (120px radius)
- Avslører skjult tekst på bevisnoder
- Skjult innhold vises i limegrønn (#7fff00) med glow
- Touch-støtte med 50px offset over finger
- Toggle-knapp med pulserende glow når aktiv

### Flytende Poeng-tekst
- Positive poeng: Flyter oppover med skalering-animasjon
- Negative poeng: Faller nedover med riste-effekt
- Fargekoding: Grønn (+) og Rød (-)
- Text shadow glow-effekter

### Scribble Feedback
- Tilfeldige håndskrevne meldinger ved handlinger
- Rotert tekst med spring physics
- Auto-forsvinner etter 2-4 sekunder

### Node-animasjoner
- **Shake Animation**: Rask rotasjons-oscillering ved feil tilkoblinger
- **Spawn Animation**: Pop-out scale effekt for nye combo-resultater
- **Hover Effect**: Noder skalerer opp 1.05x
- **Rotasjon**: Tilfeldig 3-15 graders rotasjon per node
- **Z-index**: Tilfeldig stabling for lagdelt papireffekt

### Skjermglitch-effekter
- Tilfeldige horisontale linjer som flimrer
- Rød varseltrekant som pulserer i hjørnet
- Simulerer skjermforvrengning
- Aktiveres ved sanity < 20

---

## Lydsystem

### Ambient Lyder
| Fil | Beskrivelse | Volum |
|-----|-------------|-------|
| `ambience_room.mp3` | Bakgrunnsromtone (loop) | 0.2 |
| `ambience_stress.mp3` | Stresslyd (sanity-styrt) | 0-0.4 |

### Lydeffekter
| Fil | Trigger | Volum |
|-----|---------|-------|
| `sfx_paper_drag.mp3` | Dra noder | 0.5 |
| `sfx_pin_thud.mp3` | Kobling laget | 0.6 |
| `sfx_paper_crumple.mp3` | Kast/slett | 0.5 |
| `sfx_success_stamp.mp3` | Seier | 0.7 |
| `sfx_fail_snap.mp3` | Feil | 0.6 |

### Prosedyrelle Lyder (Web Audio API)
- `button_click`: UI-klikk
- `hdd_seek`: Oppstartssekvens
- `printer_start`: Printer aktivering
- `access_granted`: Seiersfanfare

### Sanity-basert Lyd
- Stress-ambient volum øker når sanity synker
- Terskel: 50 (under trigger stress-lyd)
- Volum-mapping: Sanity 0-50 → volum 0-0.4

---

## Paranoia Events

Aktiveres når sanity < 40. Frekvens: 30-70% sjanse hvert 15-30 sekund.

### Telefon-anrop Event
- Viser ringer-ID: UNKNOWN, BLOCKED, M.I.B., etc.
- 5-sekunders nedtelling
- Spiller må klikke "BLOCK"-knappen
- Feil koster -10 sanity
- Skummel ringetone-lydeffekt

### Chat-boble Event
- Vises i øvre høyre hjørne
- Skumle meldinger:
  - "STOP DIGGING"
  - "WE CAN SEE YOU"
  - "DELETE EVERYTHING"
  - "THEY KNOW"
- Auto-forsvinner etter 4 sekunder
- Klikkbar for manuell dismissal

### Skjerm-glitch Event
- Tilfeldige røde horisontale linjer
- Aktiveres ved sanity < 20
- Varseltrekant-ikon i hjørnet
- Kun visuell forstyrrelse

---

## Seier & Game Over

### Victory Screen (Dual-panel Layout)

#### Venstre Panel: "The Viral Truth"
Hacker blogg-estetikk:
- Dark web browser mockup med grønn tekst
- Cyan overskrift med glow
- Magenta kommentarseksjon
- "VIRAL HIT!" stempel-animasjon
- Tilfeldig besøksteller
- Falske brukerkommentarer med likes

#### Høyre Panel: "Official Debrief Report"
90s regjeringsskjema-estetikk:
- Beige papirtekstur med kaffeflekker
- Animert poengtelling:
  - Case Resolved: +1000
  - Junk Binned: +100 hver
  - Junk Remaining: -100 hver
  - Sanity Bonus: +5 hver
- Animert stjerne-rating (1-5 med pop-animasjon)
- Klassifiseringsrang
- "CLASSIFIED" vannmerke

#### Rang-titler (basert på stjerner)
| Stjerner | Rang |
|----------|------|
| 5★ | ILLUMINATI CONFIRMED |
| 4★ | TRUTH SEEKER |
| 3★ | INVESTIGATOR |
| 2★ | CURIOUS |
| 1★ | SHEEP |

### Game Over Screen
- FBI "SANITY COMPROMISED" sekvens
- Animert dørbank (3 sekunder)
- "FBI! OPEN UP!" tekst med glow (1 sekund)
- Roterende FBI-badge emoji
- Pulserende "CASE CLOSED" stempel
- Glitchende transmissjonstekst
- Bakgrunnsstøy-tekstur overlay
- Knapper: Retry Case, Escape to Desk

---

## UI-elementer

### HUD Display
- **Top-Left**: Case header (tittel, beskrivelse, vanskelighetsgrad, tilbake-knapp)
- **Top-Right**: Sanity meter
- **Right Side** (vertikal stack):
  - Thread color toggle (rød/blå)
  - UV Light toggle (lime glow når aktiv)
  - Undo-knapp (med sanity-kostnad)
  - Paranoia event popups

### Evidence Bin (Søppelkasse)
- Posisjon: Fast nederst til høyre
- Highlighter rød ved drag-over med glow
- Roterer og skalerer når highlighted
- Viser "Release to discard" tooltip
- Smart deteksjon av søppel vs kritisk bevis

### Connection Counter
- Viser nåværende/maks tilkoblinger
- Tilstander:
  - Default: Blå link-ikon
  - In progress: Gult target-ikon
  - Victory: Grønt trophy-ikon med rotasjon

### Hovedmeny (CRT Terminal)
- Grønn monospace tekst på svart bakgrunn
- Scanline overlay
- Skjermflimmer-effekt
- OS versjon header
- Menyvalg med selection cursor

### Briefing Screen
- CRT monitor-ramme
- Typewriter-effekt for tekst
- Boot-sekvens animasjon
- HDD seek-lyd
- "CLASSIFIED // EYES ONLY" header

### Settings Modal
- **Audio**: Master volum, SFX volum, ambient volum
- **Gameplay**: UV light størrelse, node scale
- **Accessibility**: Reduce motion, high contrast
- **Display**: Show tutorial hints
- Lagres til localStorage

---

## Spesialfunksjoner

### Item Kombinasjoner
- Trigger: Dra node på nærliggende node (< 100px overlap)
- Resultat-noder arver truthTags fra foreldre
- Bonus credibility for vellykkede kombinasjoner
- Scribble-melding vises ("IT ALL MAKES SENSE NOW!")
- Eksempel: iPhone + Passenger List → "TIME PROOF"

### Undo-system
- Gjenopprett siste slettede node
- Kostnad: 20 sanity poeng
- Begrensning: Kun én undo per handling
- Stack: Holder 5 siste slettede noder

### Thread Color Switching
- Toggle mellom rød og blå tråder
- Formål: Organisere ulike typer koblinger
- Ingen straff - rent visuelt/organisatorisk verktøy

---

## Evidence Nodes

### Node-typer
| Type | Beskrivelse |
|------|-------------|
| Photo | Viser bilder |
| Document | Viser tekst med redacted tags |
| Sticky Note | Håndskrevet stil notater |

### Node-egenskaper
- **Synlige**: Type, tittel, beskrivelse, tags, innhold URL, posisjon
- **Skjulte**:
  - `truthTags`: Semantiske tags for seier
  - `hiddenText`: Avsløres av UV-lys
  - `isRedHerring`: Markerer søppelbevis
  - `isCritical`: Straffer fjerning

### Ikoner basert på tags
- Bird drone ikon
- Zap battery ikon
- Diverse kontekstuelle ikoner

---

## Vanskelighetsgrader

| Nivå | Sanity | Beskrivelse |
|------|--------|-------------|
| TUTORIAL | 100 | Mest tilgivende, introduksjon |
| EASY | 100 | Standard spillopplevelse |
| MEDIUM | 85-90 | Moderat utfordring |
| HARD | 70 | Krever presisjon |

### Progressiv Straff-skalering
| Feil # | Credibility Straff |
|--------|-------------------|
| 1 | -50 |
| 2 | -100 |
| 3 | -150 |
| 4+ | -200 (maks) |

### Søppel/Bevis Ratio
- Tutorial: ~77% søppel, 23% kritisk
- Hard: ~69% søppel, 31% kritisk

---

## Tilgjengelige Cases

### Case 001 - Operation: Feathered Battery
- Vanskelighet: TUTORIAL (sanity=100)
- Tema: Duer som lader på strømledninger
- 3 kritiske noder, 10 red herrings
- Required tags: Subject, Location, Proof

### Case 002 - Breakfast Conspiracy
- Vanskelighet: EASY
- Tema: Frokostblanding-selskaper kontrollerer sinn

### Case 007 - Titanic Tourism
- Vanskelighet: HARD (sanity=70)
- Tema: Tidsreisende senket Titanic
- 5 kritiske noder, 11 red herrings
- 5 required tags: THE_TECH, THE_PASSENGERS, THE_COVER_UP, THE_WEIGHT, THE_WITNESSES

---

## Teknisk Arkitektur

### Filstruktur
```
/src/components/game/
  ├── ConspiracyBoard.tsx    # Hoved spillbrett
  ├── EvidenceNode.tsx       # Node rendering
  ├── StringEdge.tsx         # Forbindelses-tråder
  ├── SanityMeter.tsx        # HP bar
  ├── MadnessOverlay.tsx     # Skjermeffekter
  ├── ParanoiaEvents.tsx     # Skumle events
  ├── UVLight.tsx            # Skjult tekst avslører
  ├── EvidenceBin.tsx        # Søppel interaksjon
  ├── UndoButton.tsx         # Undo UI
  ├── ConnectionCounter.tsx  # Seier progress
  ├── FloatingScoreText.tsx  # Poeng animasjoner
  ├── Scribble.tsx           # Feedback tekst
  ├── GameOverScreen.tsx     # Tap skjerm
  ├── VictoryScreenModal.tsx # Seier skjerm
  ├── BriefingScreen.tsx     # Pre-game briefing
  ├── MainMenu.tsx           # Start meny
  └── CaseSelect.tsx         # Case valg

/src/store/
  └── gameStore.ts           # Zustand state management

/src/contexts/
  ├── AudioContext.tsx       # Lyd kontekst
  └── SettingsContext.tsx    # Innstillinger

/src/hooks/
  ├── useAudio.ts            # Lyd hook
  ├── useDesktopDetection.ts # Device detection
  └── useGameProgress.ts     # Progression tracking

/src/types/
  └── game.ts                # TypeScript interfaces

/src/data/
  ├── case_*.ts              # Case definisjoner
  └── cases.ts               # Case registry

/src/constants/
  └── game.ts                # Scoring, thresholds

/src/utils/
  ├── sounds.ts              # Lyd definisjoner
  └── resultScreen.ts        # Victory helpers
```

### State Management (Zustand)
- Nodes & edges
- Sanity level
- Victory/game over flags
- Scribbles
- Thread color
- UV enabled
- Shaking node IDs
- Trashed nodes (for undo)
- Score tracking
- Last action signal

---

## Unike Funksjoner

1. **Apophenia Parodi**: Spillmekanikker tvinger spillere til å finne falske mønstre
2. **Retro Estetikk**: 90s GeoCities blogg, DOS terminal, CRT monitor simulering
3. **Dual Victory Screens**: Browser mockup og regjeringsskjema side om side
4. **Prosedyrell Paranoia**: Sanntids paranoia events knyttet til sanity
5. **Tag-basert Seier**: Semantisk tag matching (ikke bare tilkoblingsantall)
6. **Combo System**: Item kombinasjoner med tag arv
7. **Undo med Kostnad**: Bryter permanent-feil mønsteret (koster sanity)
8. **Progressiv Straff**: Feil blir dyrere over tid
9. **Ambient Audio Response**: Bakgrunnsstress-lyd øker når sanity synker
