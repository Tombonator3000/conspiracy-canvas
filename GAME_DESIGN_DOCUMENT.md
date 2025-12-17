# 🕵️ CONSPIRACY CANVAS
## Game Design Document (GDD)
### Versjon 1.0 | Desember 2025

---

# 📋 INNHOLDSFORTEGNELSE

1. [Spilloversikt](#1-spilloversikt)
2. [Konsept og Visjon](#2-konsept-og-visjon)
3. [Kjernemekanikker](#3-kjernemekanikker)
4. [Spillflyt og Skjermer](#4-spillflyt-og-skjermer)
5. [Evidenssystem](#5-evidenssystem)
6. [Koblingssystem](#6-koblingssystem)
7. [Sanity-system (Psykisk Helse)](#7-sanity-system-psykisk-helse)
8. [Poeng og Rangering](#8-poeng-og-rangering)
9. [Kombinasjonssystem](#9-kombinasjonssystem)
10. [UV-Lys Mekanikk](#10-uv-lys-mekanikk)
11. [Søppelkasse (Evidence Bin)](#11-søppelkasse-evidence-bin)
12. [Paranoia-hendelser](#12-paranoia-hendelser)
13. [Visuell Design](#13-visuell-design)
14. [Lydsystem](#14-lydsystem)
15. [Saker (Cases)](#15-saker-cases)
16. [Teknisk Arkitektur](#16-teknisk-arkitektur)
17. [Innstillinger](#17-innstillinger)
18. [Assets og Ressurser](#18-assets-og-ressurser)

---

# 1. SPILLOVERSIKT

## 1.1 Tittel
**Conspiracy Canvas** (tidligere arbeidstittel: "Apophenia")

## 1.2 Sjanger
- Puzzle / Puslespill
- Krim-etterforskning
- Parodi / Satire
- Casual brain-teaser

## 1.3 Plattform
- Web (Desktop primær)
- Responsiv for tablet
- Bygget med Vite + React

## 1.4 Målgruppe
- Alder: 16+
- Spillere som liker puslespill og mysterier
- Fans av konspirasjonsteori-humor
- Casual gamers som liker korte spilløkter (5-15 min per sak)

## 1.5 Spillets Elevator Pitch
> "Et satirisk puslespill der du er en konspirasjonsteori-blogger som må koble sammen 'bevis' på en korktavle for å avsløre 'sannheten' - selv om sannheten er absurd."

## 1.6 Unikt Salgsargument (USP)
- **Apophenia-parodi**: Spillet parodierer den menneskelige tendensen til å se mønstre i tilfeldige ting
- **Dual-panel seier**: Unik victory-screen med både "viral blogg" og "regjeringsrapport"
- **Sanity som ressurs**: Mental helse er din HP og kan brukes strategisk
- **Retro-hacker estetikk**: 90-talls GeoCities, DOS-terminal, CRT-monitor vibes

---

# 2. KONSEPT OG VISJON

## 2.1 Kjernevisjon
Conspiracy Canvas er et humoristisk puslespill som satiserer konspirasjonsteori-kulturen. Spilleren tar rollen som en paranoid "sannhetssøker" som må koble sammen absurde bevis på en korktavle for å "avsløre" latterlige konspirasjoner som "fugler er droner" eller "melk er en regjeringskontrollmekanisme".

## 2.2 Tematisk Konsept
- **Setting**: En mørk kjeller/hybel med korktavle, dårlig belysning, og kaffe-flekker
- **Tone**: Mørk humor, selvbevisst satire, 90-talls internett nostalgi
- **Inspirasjon**:
  - "Pepe Silvia"-meme fra It's Always Sunny in Philadelphia
  - X-Files estetikk
  - r/conspiracy subreddit parodi
  - QAnon satire

## 2.3 Spilleropplevelse
Spilleren skal føle seg som en paranoid detektiv som:
1. Starter med "aha!"-øyeblikk når koblinger fungerer
2. Opplever økende stress når sanity synker
3. Ler av de absurde "sannhetene" de avdekker
4. Føler mestringsfølelse når de løser en sak med høy stjernerate

## 2.4 Emosjonell Bue
```
Start: Nysgjerrighet → Engasjement → Paranoia (lav sanity) → Seier/Nederlag
```

---

# 3. KJERNEMEKANIKKER

## 3.1 Hovedloop
```
1. Velg sak fra arkivskapet
2. Les briefing om saken
3. Analyser bevis på korktavlen
4. Koble relevante bevis med tråder
5. Kast irrelevante bevis (red herrings)
6. Avdekk sannheten ved å koble alle nødvendige bevis
7. Se resultater og gå videre til neste sak
```

## 3.2 Kjernemekanikker Oversikt

| Mekanikk | Beskrivelse | Formål |
|----------|-------------|--------|
| **Dra og slipp** | Flytt bevisnoder rundt på tavlen | Organisering |
| **Trådkobling** | Koble bevis med røde/blå tråder | Hovedpuslespill |
| **UV-lys** | Avslør skjult tekst på bevis | Ekstra lag av puslespill |
| **Kombinering** | Slå sammen bevis til nye bevis | Avansert puslespill |
| **Kasting** | Fjern irrelevante bevis | Ressursstyring |
| **Angre** | Hent tilbake kastet bevis (koster sanity) | Strategisk valg |

## 3.3 Seiersbetingelse
Spilleren vinner når de har koblet sammen et nettverk (cluster) av beviser som dekker ALLE påkrevde "sannhets-tags" for saken.

**Eksempel Case 001:**
- Påkrevde tags: `["subject", "location", "proof"]`
- Node A har truthTags: `["subject"]` (Due)
- Node B har truthTags: `["location"]` (Strømledninger)
- Node C har truthTags: `["proof"]` (Overvåkingsbilde)
- **SEIER** når A, B, og C er koblet i samme nettverk

## 3.4 Tapsvilkår
- **Sanity = 0**: Spillerens mentale helse er oppbrukt
- FBI banker på døren og "Case Closed"

---

# 4. SPILLFLYT OG SKJERMER

## 4.1 Skjermflyt Diagram
```
┌─────────────┐
│  MainMenu   │◄────────────────────────────┐
│ (CRT Term)  │                             │
└──────┬──────┘                             │
       │ START                              │
       ▼                                    │
┌─────────────┐                             │
│FilingCabinet│                             │
│(Sakvelger)  │                             │
└──────┬──────┘                             │
       │ Velg sak                           │
       ▼                                    │
┌─────────────┐                             │
│BriefingScreen│                            │
│(Oppdrag)    │                             │
└──────┬──────┘                             │
       │ EXECUTE                            │
       ▼                                    │
┌─────────────────────────────────────────┐ │
│           ConspiracyBoard               │ │
│  ┌───────────────────────────────────┐  │ │
│  │         Korktavle (React Flow)    │  │ │
│  │  ┌─────┐   ╱╲   ┌─────┐          │  │ │
│  │  │Node │──────│Node │          │  │ │
│  │  └─────┘       └─────┘          │  │ │
│  └───────────────────────────────────┘  │ │
│  ┌─────┐ ┌───────┐ ┌────┐ ┌──────────┐ │ │
│  │Sanity│ │Connect│ │UV  │ │Trash Bin│ │ │
│  │Meter │ │Counter│ │Btn │ │         │ │ │
│  └─────┘ └───────┘ └────┘ └──────────┘ │ │
└────────────────┬────────────────────────┘ │
                 │                          │
       ┌─────────┴─────────┐                │
       │                   │                │
       ▼                   ▼                │
┌─────────────┐     ┌─────────────┐        │
│VictoryScreen│     │GameOverScreen│        │
│(Dual Panel) │     │(FBI Raid)   │        │
└──────┬──────┘     └──────┬──────┘        │
       │ Next Case         │ Retry/Menu    │
       └───────────────────┴───────────────┘
```

## 4.2 Skjermbeskrivelser

### 4.2.1 MainMenu
**Visuelt Design**: CRT-terminal med scanlines og flimring

**Elementer:**
- ASCII-art logo
- Menyvalg: START, SETTINGS, REVIEW CASES
- Scanline overlay effekt
- Flimrende tekst
- Retro grønn/amber terminal-farge

**Interaksjoner:**
- Klikk på menyvalg → Navigasjon
- Første interaksjon initialiserer lyd

### 4.2.2 FilingCabinet (Sakvelger)
**Visuelt Design**: Arkivskap med saksmapper

**Elementer:**
- Boot-sekvens med typewriter-effekt
- Saker vist som filkort
- Vanskelighetsindikator (■□□□□)
- Låst/ulåst status med completion-badge
- Progressiv opplåsing av saker

**Interaksjoner:**
- Klikk på ulåst sak → BriefingScreen
- Låste saker viser "CLASSIFIED"

### 4.2.3 BriefingScreen
**Visuelt Design**: Klassifisert dokument-estetikk

**Elementer:**
- "CLASSIFIED // EYES ONLY" header
- Typewriter-effekt tekstavdekking
- HDD-søkelyd
- Boot-sekvens animasjoner
- Execute/Abort knapper

**Interaksjoner:**
- EXECUTE → Start sak
- ABORT → Tilbake til FilingCabinet

### 4.2.4 ConspiracyBoard (Hovedspill)
**Visuelt Design**: Korktavle med papirnotater og tråder

**Elementer:**
- React Flow canvas med draggbare noder
- Bevisnoder (foto, dokument, sticky note)
- Røde og blå koblingstråder
- HUD-lag (Sanity, Connections, UV, etc.)
- Evidence Bin (søppelkasse)
- UV-overlay (spotlight)
- Madness overlay (effekter ved lav sanity)
- Paranoia-hendelser
- Scribbles (feedback-tekst)
- Floating scores
- Particle bursts (ved kombinering)

### 4.2.5 VictoryScreenModal
**Visuelt Design**: Dual-panel med blog og rapport

**Venstre Panel - "The Viral Truth":**
- Dark web blogg-mockup
- Grønn CRT-tekst
- "VIRAL HIT!" stempel
- Blog post med avdekket sannhet
- Like/share counters

**Høyre Panel - "Official Debrief Report":**
- 90-talls regjeringsskjema
- Animert poengberegning
- Stjernerate (1-5★)
- Rang-tittel

**Stjernerating:**
| Stjerner | Poeng | Rang |
|----------|-------|------|
| ★★★★★ | ≥2500 | ILLUMINATI CONFIRMED |
| ★★★★☆ | ≥2000 | TRUTH SEEKER |
| ★★★☆☆ | ≥1500 | INVESTIGATOR |
| ★★☆☆☆ | ≥1000 | CURIOUS |
| ★☆☆☆☆ | <1000 | SHEEP |

### 4.2.6 GameOverScreen
**Visuelt Design**: FBI-razzia sekvens

**Elementer:**
- Dørbank-animasjon
- "FBI! OPEN UP!" tekst med glow
- Roterende FBI-badge emoji
- "CASE CLOSED" stempelanimasjon
- Glitchy transmission-effekt

**Interaksjoner:**
- Retry → Restart samme sak
- Menu → Tilbake til MainMenu

---

# 5. EVIDENSSYSTEM

## 5.1 Evidence Node Struktur
```typescript
interface EvidenceNode {
  id: string                    // Unik identifikator
  type: "photo" | "document" | "sticky_note"
  title: string                 // Tittel vist på kortet
  contentUrl: string | null     // Bilde-URL
  description: string           // Beskrivelse/tekst
  tags: string[]                // Synlige tags
  position: {x: number, y: number}
  isRedHerring: boolean         // Er dette søppel?
  isCritical?: boolean          // Kritisk bevis?
  truthTags?: string[]          // Skjulte tags for seiersbetingelse
  hiddenText?: string           // Tekst avslørt av UV-lys
  requiresUV?: boolean          // Må bruke UV for å koble
  isRevealed?: boolean          // Sporer UV-avsløringsstatus
  date?: string                 // ISO-dato for tidslinjesortering
}
```

## 5.2 Node-typer

### 5.2.1 Photo (Foto)
- Viser bilde fra `contentUrl`
- Polaroid-lignende ramme
- Kan ha skjult tekst synlig under UV

### 5.2.2 Document (Dokument)
- Tekstbasert innhold
- Papir-tekstur
- Kan ha "sladdet" tekst avslørt av UV

### 5.2.3 Sticky Note (Huskelapp)
- Gul huskelapp
- Kort tekst
- Håndskrift-font

## 5.3 Node-interaksjoner

| Interaksjon | Handling | Resultat |
|-------------|----------|----------|
| **Dra** | Hold og flytt | Repositionering på tavlen |
| **Klikk på pin** | Start koblingsmodus | Tråd følger musepeker |
| **Slipp på pin** | Fullfør kobling | Validering og feedback |
| **Dra nær annen node** | <100px avstand | Trigger kombinasjonssjekk |
| **Dra til søppel** | Slipp over bin | Sletting med poeng/straff |
| **UV-lys** | Toggle knapp | Avslører skjult tekst |

## 5.4 Node-animasjoner

| Animasjon | Trigger | Beskrivelse |
|-----------|---------|-------------|
| **Shake** | Feil kobling | Roteringossilasjon |
| **Spawn** | Kombinasjonsresultat | Pop-out scale |
| **Hover** | Mus over | Scale 1.05x |
| **Rotasjon** | Ved lasting | 3-15° tilfeldig |
| **Z-index** | Ved lasting | Tilfeldig stabling |

## 5.5 Red Herrings (Søppel-bevis)
- Noder med `isRedHerring: true`
- Har **ingen** `truthTags`
- Gir poeng når kastet (+100)
- Gir straff hvis de er igjen på tavlen ved seier (-50 per stykk)
- Eksempler: tyggisinnpakning, bussbillett, kaffekvittering

---

# 6. KOBLINGSSYSTEM

## 6.1 Trådtyper

### 6.1.1 Rød Tråd (Kausal Kobling)
- **Formål**: Tematiske/kausale forbindelser
- **Validering**: Begge noder må ha `truthTags`
- **Visuell**: Tvunnet garn-gradient effekt
- **Glow**: Ved gyldig kobling

### 6.1.2 Blå Tråd (Tidslinje Kobling)
- **Formål**: Kronologisk rekkefølge
- **Validering**: Korrekt kronologisk orden (tidligere → senere)
- **Straff**: -10 sanity hvis feil rekkefølge
- **Visuell**: Animert flow-retning

## 6.2 Koblingslogikk Flytdiagram
```
Bruker drar tråd fra Node A → Node B
              │
              ▼
┌─────────────────────────────────────┐
│  Check 1: UV/Kryptering validering  │
│  Hvis kilde eller mål krever UV     │
│  og ikke avslørt og UV av           │
├─────────────────────────────────────┤
│  STRAFF: -15 sanity                 │
│  Trigger shake                      │
│  Error scribble: "HIDDEN DETAILS!"  │
└─────────────────────────────────────┘
              │ (pass)
              ▼
┌─────────────────────────────────────┐
│  Check 2: Tidslinje (kun blå tråd)  │
│  Hvis datoA > datoB (feil orden)    │
├─────────────────────────────────────┤
│  STRAFF: -10 sanity                 │
│  Trigger shake                      │
│  Error scribble: "WRONG ORDER!"     │
└─────────────────────────────────────┘
              │ (pass)
              ▼
┌─────────────────────────────────────┐
│  Check 3: Koblingsgyldighet         │
│  Hvis kildeErEkte OG målErEkte      │
├─────────────────────────────────────┤
│  SUKSESS:                           │
│  - Legg til edge                    │
│  - +50 score                        │
│  - Success scribble                 │
│  - Sjekk seiersbetingelse           │
├─────────────────────────────────────┤
│  FEIL:                              │
│  - -10 sanity                       │
│  - +1 mistake                       │
│  - Trigger shake                    │
│  - Error scribble                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  validateWin() - BFS cluster check  │
│  Hvis alle requiredTags funnet      │
│  i tilkoblet cluster                │
├─────────────────────────────────────┤
│  SET isVictory = true               │
│  Kalkuler endelig score             │
│  Trigger victory animasjoner        │
└─────────────────────────────────────┘
```

## 6.3 Seiersbetingelse Algoritme (BFS)
```
SEIER HVIS:
  ∃ tilkoblet cluster der ∀ requiredTag ∈ truthTags av cluster-noder

Algoritme:
1. For hver node i graf:
   a. Start BFS fra denne noden
   b. Samle alle truthTags fra alle noder i clusteret
   c. Sjekk om alle requiredTags er dekket
   d. Hvis ja → SEIER
2. Hvis ingen cluster dekker alle tags → Fortsett spill
```

## 6.4 Visuell Design av Tråder (StringEdge)

**Rød Tråd Gradient:**
```css
/* 5-farge gradient for tvunnet garn-effekt */
background: linear-gradient(
  hsl(350, 80%, 45%),  /* Mørk rød */
  hsl(350, 85%, 55%),  /* Medium rød */
  hsl(350, 80%, 50%),  /* Rød */
  hsl(350, 85%, 55%),  /* Medium rød */
  hsl(350, 80%, 45%)   /* Mørk rød */
);
```

**Glow Effekt:**
```css
box-shadow:
  0 0 10px hsl(350, 100%, 60%),  /* Ytre glow */
  inset 0 0 3px rgba(0,0,0,0.3); /* Indre skygge */
```

---

# 7. SANITY-SYSTEM (PSYKISK HELSE)

## 7.1 Konsept
Sanity representerer spillerens mentale helse/fokus. Den fungerer som HP og ressurs samtidig - den kan brukes til visse handlinger (undo) men hvis den når 0, taper spilleren.

## 7.2 Startverdier per Vanskelighetsgrad

| Vanskelighet | Start Sanity |
|--------------|--------------|
| TUTORIAL | 100 |
| EASY | 100 |
| MEDIUM | 85-90 |
| HARD | 70 |

## 7.3 Sanity Endringer

### 7.3.1 Sanity Tap
| Årsak | Endring |
|-------|---------|
| Feil kobling | -10 |
| Skjult detalj oversett (requiresUV) | -15 |
| Tidslinje-paradoks (blå tråd) | -10 |
| Kastet kritisk bevis | -20 |
| Angre-handling | -20 |
| Ignorert telefon (paranoia event) | -10 |

### 7.3.2 Sanity Gjenvinning
*Foreløpig ingen mekanikker for sanity-gjenvinning*
*Vurder: +5 for korrekt kombinasjon?*

## 7.4 Kritiske Terskler og Effekter

| Sanity | Effekt |
|--------|--------|
| < 50 | Vignette mørklegging starter |
| < 40 | Paranoia-hendelser aktiveres |
| < 25 | Progressiv blur + rød puls + screen glitches |
| < 20 | Screen glitch med rød varseltrekant |
| = 0 | Full blur + blackout + GAME OVER |

## 7.5 Madness Visual Effects

### 7.5.1 Vignette
- Radial gradient mørklegging fra kantene
- Intensitet øker med lavere sanity
- Formel: `opacity = (50 - sanity) / 50`

### 7.5.2 Blur
- Progressiv CSS backdrop-filter blur
- Formel: `blur = (25 - sanity) * 0.2px` (max 5px)

### 7.5.3 Red Tint Pulse
- Pulserende rød overlay
- Aktiveres ved sanity < 25
- CSS animation: pulse 2s infinite

### 7.5.4 Screen Noise
- SVG turbulence filter
- Kornete/statisk støy over skjermen
- Aktiveres ved sanity < 20

### 7.5.5 Screen Shake
- Tilfeldig posisjonell jitter
- Small random offset (±3px)
- Aktiveres ved sanity < 15

### 7.5.6 Screen Glitch
- Horisontale røde linjer flimrer
- Aktiveres ved sanity < 20
- Tilfeldig tidspunkt og varighet

## 7.6 SanityMeter UI

**Visuelt Design:**
- Horisontal bar øverst til venstre
- Gradient: grønn → gul → rød
- Pulserende border ved kritisk nivå
- Prosent-tekst under baren
- Ikon: hjerne eller øye

**Animasjoner:**
- Smooth transition ved endring
- Shake ved stort tap
- Puls-glow ved kritisk nivå

---

# 8. POENG OG RANGERING

## 8.1 Poengsystem

### 8.1.1 Basepoeng
| Handling | Poeng |
|----------|-------|
| Korrekt kobling | +50 |
| Søppel kastet | +100 |
| Sak løst | +1000 |

### 8.1.2 Bonuser
| Bonus | Poeng | Betingelse |
|-------|-------|------------|
| Combo Tier 1 | +25 | 2+ korrekte koblinger |
| Combo Tier 2 | +50 | 3+ korrekte koblinger |
| Combo Tier 3 | +100 | 5+ korrekte koblinger |
| Kombinasjon | +200 | Per vellykket merge |

### 8.1.3 Straffer
| Straff | Poeng | Betingelse |
|--------|-------|------------|
| Feil 1 | -50 | Første feil |
| Feil 2 | -100 | Andre feil |
| Feil 3 | -150 | Tredje feil |
| Feil 4+ | -200 | Fjerde+ feil (max) |
| Søppel igjen | -50 | Per red herring på tavlen |
| Bevis ødelagt | -200 | Per ekte bevis kastet |

### 8.1.4 Progressiv Straffskalering
Feil blir dyrere jo flere du gjør:
```
mistakePenalty = BASE_PENALTY * min(mistakeCount, MAX_MULTIPLIER)
               = 50 * min(n, 4)
```

## 8.2 Stjernerating

| Stjerner | Minimumpoeng | Rang |
|----------|--------------|------|
| ★★★★★ | 2500 | ILLUMINATI CONFIRMED |
| ★★★★☆ | 2000 | TRUTH SEEKER |
| ★★★☆☆ | 1500 | INVESTIGATOR |
| ★★☆☆☆ | 1000 | CURIOUS |
| ★☆☆☆☆ | <1000 | SHEEP |

## 8.3 Score Kalkulasjonsformel
```
endeligScore =
  baseConnectionScore
  + junkBinnedScore
  + comboBonuses
  + caseResolvedBonus
  - mistakePenalties
  - remainingJunkPenalty
  - destroyedEvidencePenalty
```

## 8.4 FloatingScoreText

**Positiv Score:**
- Flyter oppover
- Scale 1.2 → 1
- Grønn farge med text-shadow glow
- Varighet: 1.2s

**Negativ Score:**
- Faller nedover
- Shake-mønster
- Rød farge med glow
- Varighet: 1.5s

---

# 9. KOMBINASJONSSYSTEM

## 9.1 Konsept
Spilleren kan kombinere to beviser til et nytt bevis som inneholder informasjon fra begge foreldre-noder.

## 9.2 Mekanikk

### 9.2.1 Aktivering
- Dra node innen 100px av en annen node
- Sjekk om gyldig kombinasjon eksisterer i case data
- Hvis ja → Trigger merge

### 9.2.2 Resultat
- Begge foreldre-noder fjernes
- Resultat-node(r) opprettes med arvet posisjon
- Resultat-node arver truthTags fra begge foreldre + egne tags
- Particle burst effekt ved merge-punkt
- Scribble feedback: "EUREKA!", "THE PIECES FIT!", etc.

### 9.2.3 Tag-arv
```
resultatTags = forelderA.truthTags ∪ forelderB.truthTags ∪ resultat.tags
```

Dette tillater progressiv bevisbygging der kombinasjoner kan brukes i videre kombinasjoner.

## 9.3 Kombination Data Struktur
```typescript
interface Combination {
  itemA: string           // Node ID
  itemB: string           // Node ID
  resultNodes: EvidenceNode[]  // Resultat-noder
  unlockText?: string     // "EUREKA!" melding
  hint?: string           // UV hint tekst
  bonus?: number          // Ekstra poeng (default 200)
}
```

## 9.4 Eksempel: Titanic-saken
```typescript
{
  itemA: "iphone_1912",
  itemB: "passenger_list",
  resultNodes: [{
    id: "time_proof",
    type: "document",
    title: "TIME PROOF",
    description: "iPhone + passasjerliste = tidslinjebev is",
    truthTags: ["proof", "timeline"]
  }],
  unlockText: "THE TIMELINE CONFIRMS IT!"
}
```

## 9.5 Particle Burst Effekt

**Parametere:**
- Antall partikler: 20
- Retning: 0-360° tilfeldig
- Avstand: 60-150px
- Størrelse: 6-16px
- Varighet: 0.5-0.9s
- Fargepalett: Papir/krem toner
- Sentral flash-effekt

---

# 10. UV-LYS MEKANIKK

## 10.1 Konsept
UV-lys avslører skjult tekst på beviser - som usynlig blekk. Noen beviser krever at denne teksten er avslørt før de kan kobles.

## 10.2 Aktivering
- Toggle-knapp i HUD (lime-grønn glow når aktiv)
- Ingen kostnad å bruke
- Spotlight følger musepeker (120px radius)
- Touch: 50px offset over finger for synlighet

## 10.3 Node Properties

### 10.3.1 hiddenText
- Tekst som vises kun under UV-lys
- Vises i lime-grønn (#7fff00) med glow-effekt
- Eksempel: Sladdet dokumenttekst, hemmelig beskjed

### 10.3.2 requiresUV
- Boolean flag
- Hvis `true`: Node kan IKKE kobles med mindre:
  - UV er aktivt, ELLER
  - Node er markert som `isRevealed: true`
- Straff for å prøve kobling uten UV: -15 sanity

## 10.4 UV Overlay Visuelt

**Spotlight:**
```css
background: radial-gradient(
  circle 120px at <cursor>,
  rgba(127, 255, 0, 0.15) 0%,
  transparent 100%
);
```

**Hidden Text Reveal:**
```css
.hidden-text.uv-active {
  color: #7fff00;
  text-shadow: 0 0 10px #7fff00;
  animation: pulse 1.5s ease-in-out infinite;
}
```

## 10.5 Eksempel Bruk

**Case 007 - Titanic:**
- Node: "Iceberg Warning Telegram"
- hiddenText: "COORDINATES: 41°44'N 49°57'W - TOO PERFECT"
- requiresUV: true
- Spilleren må aktivere UV for å se koordinatene og koble telegrammet med andre beviser

---

# 11. SØPPELKASSE (EVIDENCE BIN)

## 11.1 Konsept
Evidence Bin lar spilleren kaste beviser de tror er irrelevante (red herrings). Korrekt kasting gir poeng, feil kasting gir straff.

## 11.2 Plassering og Design
- Fast posisjon: Nederst til høyre
- Visuelt: Papirkurv/søppelkasse ikon
- Highlight: Rød glow når node dras over
- Tooltip: "Release to discard"

## 11.3 Interaksjon

### 11.3.1 Drag Over
- Detekter node over bin
- Vis rød glow/highlight
- Rotér og scale bin
- Vis "Release to discard" tooltip

### 11.3.2 Release
- Sjekk `node.isRedHerring`
- Hvis JA (søppel):
  - +100 poeng
  - Ingen sanity-tap
  - Success feedback
- Hvis NEI (ekte bevis):
  - -200 poeng
  - -20 sanity
  - +1 mistake
  - Error feedback

### 11.3.3 Trash Animasjon
- Node krymper
- Roterer
- Fades ut
- Legges til undo-stack

## 11.4 Undo Stack
- Maks 5 nylige slettinger lagret
- LIFO (Last In First Out)
- Inneholder: node-data + tilknyttede edges

---

# 12. ANGRE-FUNKSJON (UNDO)

## 12.1 Konsept
Spilleren kan hente tilbake nylig slettede beviser, men det koster sanity.

## 12.2 Kostnad
- **-20 sanity** per angre
- Kan IKKE angre hvis sanity < 20

## 12.3 Undo Stack
```typescript
trashedNodes: Array<{
  node: EvidenceNode,
  edges: GameEdge[]  // Koblinger som ble fjernet
}>
```

## 12.4 Undo Button UI
- Synlig kun hvis stack ikke er tom
- Viser antall tilgjengelige undos
- Disabled styling hvis sanity < 20
- Tooltip: "Restore last deleted (-20 sanity)"

## 12.5 Restore Prosess
1. Pop siste element fra stack
2. Gjenopprett node til original posisjon
3. Gjenopprett tilknyttede edges
4. -20 sanity
5. Oppdater UI

---

# 13. PARANOIA-HENDELSER

## 13.1 Konsept
Ved lav sanity (< 40) begynner spilleren å oppleve paranoia-hendelser som forstyrrer spillopplevelsen og forsterker stemningen.

## 13.2 Trigger-betingelser
- Sanity < 40
- Tilfeldig sjanse: 30-70% hver 15-30 sekunder

## 13.3 Hendelsestyper

### 13.3.1 Phone Call
**Beskrivelse:** En mystisk telefon ringer

**Visuelt:**
- Telefon-popup i sentrum av skjermen
- Caller ID: UNKNOWN, BLOCKED, M.I.B., PRIVATE NUMBER
- 5-sekunders nedtelling
- Pulserende rødt lys

**Interaksjon:**
- BLOCK knapp må klikkes
- Hvis ikke blokkert innen 5 sek: -10 sanity

**Lyd:** Telefon-ringetone

### 13.3.2 Chat Bubble
**Beskrivelse:** Truende meldinger fra ukjente

**Meldinger:**
- "STOP DIGGING"
- "WE CAN SEE YOU"
- "THEY KNOW"
- "DELETE EVERYTHING"
- "YOU'RE BEING WATCHED"

**Visuelt:**
- Appears øverst til høyre
- Chat-boble estetikk
- Typing indicator først

**Interaksjon:**
- Klikk for å lukke, eller auto-lukk etter 4 sek
- Ingen straff (kun visuell forstyrrelse)

### 13.3.3 Screen Glitch
**Beskrivelse:** Skjermen glitcher

**Visuelt:**
- Tilfeldige røde horisontale linjer
- Varseltrekant pulser i hjørnet
- Skjermen "hakker"

**Trigger:** Sanity < 20

**Interaksjon:** Kun visuell (ingen handling kreves)

### 13.3.4 Node Jitter
**Beskrivelse:** Noder beveger seg litt av seg selv

**Visuelt:**
- Tilfeldige noder får små offset (±25px)
- 30% sjanse per sekund ved lav sanity
- Skaper følelse av upålitelighet

**Interaksjon:** Spilleren må repositionere noder

---

# 14. VISUELL DESIGN

## 14.1 Fargepalett

### 14.1.1 Hovedfarger (Tailwind Custom)
```css
--cork: hsl(30 35% 18%)           /* Korktavle bakgrunn */
--paper: hsl(45 30% 92%)          /* Beviskortet */
--string-red: hsl(350 80% 50%)    /* Rød tråd */
--string-glow: hsl(350 100% 60%)  /* Rød tråd glow */
--string-blue: hsl(210 80% 50%)   /* Blå tråd */
--ink: hsl(220 15% 20%)           /* Tekst */
--sticky-yellow: hsl(50 90% 75%)  /* Sticky note */
--sanity-green: hsl(120 60% 45%)  /* Sanity OK */
--sanity-red: hsl(0 70% 50%)      /* Sanity kritisk */
--uv-lime: #7fff00                /* UV-lys farge */
```

### 14.1.2 CRT Terminal Farger
```css
--terminal-green: #00ff00
--terminal-amber: #ffb000
--terminal-bg: #0a0a0a
--scanline: rgba(0, 0, 0, 0.3)
```

## 14.2 Typografi

### 14.2.1 Fonter
- **Overskrifter:** "Special Elite" (skrivemaskin-font)
- **Brødtekst:** "Courier New" / monospace
- **Sticky Notes:** "Reenie Beanie" / håndskrift
- **Terminal:** "VT323" / pixel-font

### 14.2.2 Størrelser
- H1: 2.5rem
- H2: 1.75rem
- Body: 1rem
- Small: 0.875rem
- Micro: 0.75rem

## 14.3 Visuell Stil

### 14.3.1 Korktavle
- Tekstur: Cork texture fra Unsplash
- Farge: Varm brun (#8B4513 basis)
- Skygger: Dype drop shadows for dybde
- Pins: Push-pins ved hver node

### 14.3.2 Bevisnotater
- Papir-tekstur overlay
- 3-15° rotasjon for "tilfeldig" plassering
- Flere lag skygger for "stablet" effekt
- Tape/pins dekorasjoner

### 14.3.3 CRT Monitor Effekt
- Scanlines (horisontale linjer)
- Vignette (mørkere hjørner)
- Phosphor glow (tekst-glow)
- Flimring (subtle)
- Buet skjerm-effekt (valgfritt)

## 14.4 Animasjoner

### 14.4.1 Definerte Keyframes
```css
@keyframes shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-5px) rotate(-2deg); }
  75% { transform: translateX(5px) rotate(2deg); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor; }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
  52% { opacity: 1; }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
```

---

# 15. LYDSYSTEM

## 15.1 Arkitektur
- **Web Audio API**: Prosedurell lydgenerering
- **HTML5 Audio**: Sample-avspilling
- **AudioContext Provider**: Sentralisert lydkontroll
- **GainNodes**: Volumkontroll per kanal

## 15.2 Lydtyper

### 15.2.1 Ambient (Bakgrunn)
| Lyd | Fil | Volum | Loop |
|-----|-----|-------|------|
| Room tone | ambience_room.mp3 | 0.2 | Ja |
| Stress | ambience_stress.mp3 | 0-0.4* | Ja |

*Stress-volum skalerer med sanity: `vol = (50 - sanity) / 125`

### 15.2.2 Sound Effects (SFX)
| Lyd | Fil | Volum | Trigger |
|-----|-----|-------|---------|
| Paper drag | sfx_paper_drag.mp3 | 0.5 | Node dragging |
| Pin thud | sfx_pin_thud.mp3 | 0.6 | Connection made |
| Paper crumple | sfx_paper_crumple.mp3 | 0.5 | Node deleted |
| Success stamp | sfx_success_stamp.mp3 | 0.7 | Victory |
| Fail snap | sfx_fail_snap.mp3 | 0.6 | Connection failure |
| Phone ring | sfx_phone_ring.mp3 | 0.8 | Paranoia call |

### 15.2.3 Prosedurelle Lyder (Web Audio)
| Lyd | Type | Trigger |
|-----|------|---------|
| button_click | Sine wave click | UI interaction |
| hdd_seek | Noise burst | Startup sequence |
| printer_start | Motor + paper | New case |
| access_granted | Ascending tones | Victory fanfare |

## 15.3 Sanity-basert Lyd
- Ambient stress-volum øker når sanity synker under 50
- Mapping: `Sanity 0-50 → Volum 0-0.4`
- Skaper eskalerende uhygge

## 15.4 Innstillinger
- Master Volume: 0-100%
- SFX Volume: 0-100%
- Ambient Volume: 0-100%
- Mute toggle

---

# 16. SAKER (CASES)

## 16.1 Case Struktur
```typescript
interface CaseData {
  id: string                    // "case_001_birds"
  title: string                 // "Operation: Feathered Battery"
  description: string           // Briefing-tekst
  difficulty: "TUTORIAL" | "EASY" | "MEDIUM" | "HARD"

  theTruth: {
    subject: string             // "PIGEONS"
    action: string              // "ARE RECHARGING ON"
    target: string              // "POWER LINES"
    motive: string              // "TO SPY ON US"
  }

  boardState: {
    sanity: number              // Start sanity
    chaosLevel: number          // Unused?
    maxConnectionsNeeded: number
  }

  requiredTags: string[]        // ["subject", "location", "proof"]
  nodes: EvidenceNode[]         // Alle beviser
  combinations?: Combination[]  // Mulige kombinasjoner
  scribblePool?: string[]       // Tilfeldige meldinger
}
```

## 16.2 Tilgjengelige Saker

| # | ID | Tittel | Vanskelighet | Tema |
|---|-----|--------|--------------|------|
| 1 | case_001 | Feathered Battery | TUTORIAL | Fugler er droner |
| 2 | case_002 | Breakfast Conspiracy | EASY | Frokost-konspirasjon |
| 3 | case_003 | Milk Conspiracy | EASY | Melk-kontroll |
| 4 | case_004 | Cloud Computing | EASY | Skyer = datamaskiner |
| 5 | case_005 | Cat Conspiracy | MEDIUM | Katter spionerer |
| 6 | case_006 | Eclipse Cover-up | MEDIUM | Formørkelse = coverup |
| 7 | case_007 | Titanic Tourism | HARD | Titanic var planlagt |
| 8 | case_008 | Microwave Mind Control | MEDIUM | Mikrobølger kontrollerer |
| 9 | case_009 | TBD | MEDIUM | TBD |
| 10 | case_010 | TBD | HARD | TBD |
| 11 | case_011 | TBD | HARD | TBD |
| 12 | case_012 | TBD | HARD | TBD |
| TEST | TEST_CASE | Debug Protocol | DEBUG | Testing |

## 16.3 Vanskelighetsgradering

| Nivå | Sanity | Noder | Red Herrings | Kombinasjoner |
|------|--------|-------|--------------|---------------|
| TUTORIAL | 100 | 5-7 | 1-2 | 0 |
| EASY | 100 | 8-10 | 2-3 | 0-1 |
| MEDIUM | 85-90 | 10-12 | 3-4 | 1-2 |
| HARD | 70 | 12-15 | 4-6 | 2-3 |

## 16.4 Progresjon
- Saker låses opp sekvensielt
- Må fullføre sak N for å låse opp sak N+1
- Completion badge ved fullføring
- Høyeste stjernerate lagres

---

# 17. TEKNISK ARKITEKTUR

## 17.1 Tech Stack
| Teknologi | Formål |
|-----------|--------|
| Vite | Build tool & dev server |
| React 18 | UI framework |
| TypeScript | Type safety |
| Zustand | State management |
| @xyflow/react | Node-basert tavle |
| Framer Motion | Animasjoner |
| Tailwind CSS | Styling |
| Radix UI | Tilgjengelighets-komponenter |
| React Router | Navigasjon |
| Web Audio API | Lydsynth |
| LocalStorage | Persistens |

## 17.2 Mappestruktur
```
/src
├── /components
│   ├── /game          # Spillkomponenter
│   │   ├── ConspiracyBoard.tsx
│   │   ├── EvidenceNode.tsx
│   │   ├── StringEdge.tsx
│   │   ├── SanityMeter.tsx
│   │   ├── MadnessOverlay.tsx
│   │   ├── ParanoiaEvents.tsx
│   │   ├── UVLight.tsx
│   │   ├── EvidenceBin.tsx
│   │   ├── UndoButton.tsx
│   │   ├── FloatingScoreText.tsx
│   │   ├── Scribble.tsx
│   │   ├── ParticleBurst.tsx
│   │   ├── MainMenu.tsx
│   │   ├── FilingCabinet.tsx
│   │   ├── BriefingScreen.tsx
│   │   ├── VictoryScreenModal.tsx
│   │   ├── GameOverScreen.tsx
│   │   ├── CaseHeader.tsx
│   │   ├── ConnectionCounter.tsx
│   │   ├── SettingsModal.tsx
│   │   └── Printer.tsx
│   └── /ui            # Shadcn UI komponenter
├── /pages
│   ├── Index.tsx      # Hovedskjerm & state orchestrator
│   └── NotFound.tsx
├── /store
│   └── gameStore.ts   # Zustand state management
├── /contexts
│   ├── AudioContext.tsx
│   └── SettingsContext.tsx
├── /hooks
│   ├── useAudio.ts
│   ├── useGameProgress.ts
│   └── useDesktopDetection.ts
├── /data
│   ├── case_001.ts - case_012.ts
│   └── cases.ts
├── /types
│   └── game.ts
├── /assets
│   ├── /evidence      # Bevisbilder
│   └── /junk          # Søppelbilder
├── /constants
│   └── game.ts
└── /utils
    ├── sounds.ts
    └── resultScreen.ts
```

## 17.3 State Management (Zustand)

### 17.3.1 Store Data
```typescript
interface GameState {
  // Core game state
  nodes: EvidenceNode[]
  edges: GameEdge[]
  sanity: number
  requiredTags: string[]
  isVictory: boolean
  isGameOver: boolean

  // UI state
  threadColor: 'red' | 'blue'
  isUVEnabled: boolean
  shakingNodeIds: string[]
  scribbles: Scribble[]
  bursts: ParticleBurst[]

  // Scoring
  score: number
  junkBinned: number
  mistakes: number

  // Undo
  trashedNodes: TrashedNode[]
}
```

### 17.3.2 Store Actions
```typescript
interface GameActions {
  loadLevel: (index: number) => void
  onConnect: (params: OnConnectParams) => void
  trashNode: (id: string, isJunk: boolean) => void
  undoTrash: () => void
  checkCombine: (sourceId: string, targetId: string, combinations: Combination[]) => boolean
  modifySanity: (delta: number) => void
  toggleUV: () => void
  setThreadColor: (color: 'red' | 'blue') => void
  validateWin: () => void
  resetGame: () => void
}
```

## 17.4 Komponenthierarki
```
App
├── SettingsProvider
├── AudioProvider
└── Index (Screen Router)
    ├── MainMenu
    │   └── Printer
    ├── FilingCabinet
    ├── BriefingScreen
    └── ConspiracyBoard (ReactFlow)
        ├── EvidenceNode[] (Custom Nodes)
        │   ├── PushPin (Handle)
        │   └── NodeScribbles
        ├── StringEdge[] (Custom Edges)
        ├── HUD Layer
        │   ├── CaseHeader
        │   ├── SanityMeter
        │   ├── ConnectionCounter
        │   ├── UVLightToggle
        │   └── UndoButton
        ├── EvidenceBin
        ├── UVOverlay
        ├── MadnessOverlay
        ├── ParanoiaEvents
        ├── Scribbles[]
        ├── FloatingScores[]
        └── ParticleBursts[]
    ├── VictoryScreenModal
    └── GameOverScreen
```

---

# 18. INNSTILLINGER

## 18.1 Tilgjengelige Innstillinger

| Innstilling | Type | Standard | Beskrivelse |
|-------------|------|----------|-------------|
| Master Volume | 0-100 | 80 | Hovedvolum |
| SFX Volume | 0-100 | 100 | Lydeffekter |
| Ambient Volume | 0-100 | 60 | Bakgrunnslyd |
| UV Light Size | % | 100 | Spotlight størrelse |
| Node Scale | % | 100 | Bevisnoder størrelse |
| Reduce Motion | bool | false | Tilgjengelighet |
| High Contrast | bool | false | Tilgjengelighet |
| Show Tutorial Hints | bool | true | Hjelpetekster |

## 18.2 Persistens
- Alle innstillinger lagres i LocalStorage
- Nøkkel: `"apophenia-settings"`
- Lastes ved app-oppstart

## 18.3 Settings Modal UI
- Tilgjengelig fra MainMenu og pause-meny
- Slider-kontroller for volum
- Toggle-switches for booleans
- Forhåndsvisning av endringer
- Reset til standard-knapp

---

# 19. ASSETS OG RESSURSER

## 19.1 Bevisbilder (/src/assets/evidence/)

| Fil | Beskrivelse | Sak |
|-----|-------------|-----|
| pigeon_suspicious.jpg | Mistenkelig due | Case 001 |
| powerlines_birds.jpg | Fugler på strømledninger | Case 001 |
| lonely_sock.jpg | Ensom sokk | Case 002 |
| tide_pod.jpg | Tide pod | Case 002 |
| bodybuilder_milk.jpg | Bodybuilder med melk | Case 003 |
| oat_milk.jpg | Havremelk | Case 003 |
| cloud_server.jpg | Sky-server | Case 004 |
| chemtrails.jpg | Chemtrails | Case 004 |
| cat_surveillance.jpg | Katt overvåking | Case 005 |
| eclipse.jpg | Solformørkelse | Case 006 |
| telescope.jpg | Teleskop | Case 006 |
| iphone_1912.jpg | iPhone fra 1912 | Case 007 |
| fake_iceberg.jpg | Falskt isfjell | Case 007 |
| titanic_movie.jpg | Titanic film | Case 007 |
| microwave_glow.jpg | Mikrobølge-glow | Case 008 |
| popcorn_time.jpg | Popcorn tid | Case 008 |
| *+ flere...* | | |

## 19.2 Søppelbilder (/src/assets/junk/)

| Fil | Beskrivelse |
|-----|-------------|
| gum_wrapper.png | Tyggisinnpakning |
| bus_ticket.png | Bussbillett |
| coffee_receipt.png | Kaffekvittering |
| paperclip.png | Binders |
| newspaper_scrap.png | Avisutklipp |
| used_postit.png | Brukt Post-it |
| burnt_match.png | Brent fyrstikk |
| candy_wrapper.png | Godteriinnpakning |
| lottery_ticket.png | Lottokupong |
| business_card.png | Visittkort |
| rubber_bands.png | Strikker |

## 19.3 Lydfiler (/public/sounds/)

| Fil | Type | Bruk |
|-----|------|------|
| ambience_room.mp3 | Ambient | Bakgrunn |
| ambience_stress.mp3 | Ambient | Lav sanity |
| sfx_paper_drag.mp3 | SFX | Node dragging |
| sfx_pin_thud.mp3 | SFX | Connection |
| sfx_paper_crumple.mp3 | SFX | Delete |
| sfx_success_stamp.mp3 | SFX | Victory |
| sfx_fail_snap.mp3 | SFX | Failure |
| sfx_phone_ring.mp3 | SFX | Paranoia |

---

# 20. FREMTIDIGE FUNKSJONER (Backlog)

## 20.1 Potensielle Tillegg
- [ ] Multiplayer "rival conspiracy theorist" mode
- [ ] Daily challenge med leaderboard
- [ ] Custom case builder
- [ ] Achievement system
- [ ] Collectible "conspiracy badges"
- [ ] Alternativ sanity-boost mekanikk
- [ ] Mer avanserte kombinasjoner (3+ items)
- [ ] Animated cutscenes mellom saker
- [ ] Mobile-optimalisert versjon
- [ ] Steam release med achievements

## 20.2 Balansering Notater
- Vurder sanity-regenerering ved korrekt handlinger
- Test HARD-sakene for rettferdig vanskelighetsgrad
- Finjuster combo-bonuser
- A/B-test UV-mekanikken for brukervennlighet

---

# VEDLEGG

## A. Glossar

| Term | Definisjon |
|------|------------|
| **Apophenia** | Tendensen til å se mønstre i tilfeldig informasjon |
| **Red Herring** | Villedende bevis som ikke er relevant |
| **Truth Tags** | Skjulte tags som validerer seiersbetingelse |
| **Sanity** | Spillerens mentale helse / HP |
| **Scribble** | Flytende feedback-tekst |
| **Cluster** | Gruppe av sammenkoblede noder |
| **BFS** | Breadth-First Search (algoritme for cluster-validering) |

## B. Referanser

- Pepe Silvia meme: It's Always Sunny in Philadelphia
- Apophenia: Wikipedia - Pattern Recognition Psychology
- Cork board aesthetic: True crime documentaries
- CRT terminal: 90s hacker movies (Hackers, The Matrix)

---

**Dokument sist oppdatert:** Desember 2025
**Versjon:** 1.0
**Forfatter:** Generert med Claude AI
