# Case Design Guide

Denne dokumentasjonen beskriver hvordan man designer og lager nye cases for Conspiracy Canvas.

## Oversikt

Cases er data-drevne JSON-strukturer som definerer alt innhold i et spill: beviser, koblinger, scribbles og seierbetingelser.

Systemet bruker **to typer tags**:
1. **`tags`** - For å validere om to noder KAN kobles (matching)
2. **`truthTags`** - For å sjekke om spilleren har funnet "sannheten" (win condition)

---

## ⚠️ VIKTIG: Semantic Truth Verification System

### Hvorfor dette systemet?

Det gamle systemet sjekket om spesifikke node-ID-er var koblet sammen. MEN: Når spilleren kombinerer to noder, slettes de gamle ID-ene og en ny ID oppstår. Da vet ikke spillet lenger hva som er "riktig svar".

### Løsningen: Tag-basert seiersjekk

I stedet for å sjekke ID-er, sjekker vi nå om spillerens koblede klynge inneholder alle **requiredTruthTags**.

```typescript
// Gammelt system (FEILER ved kombinasjoner):
// Win: Connect node-1 to node-4

// Nytt system (FUNGERER alltid):
// requiredTruthTags: ["THE_DRONE", "THE_TECH", "THE_POWER_SOURCE"]
// Win: Cluster must contain ALL these tags
```

### Hvordan det fungerer

1. Spilleren kobler noder med rød tråd
2. Systemet finner den største koblede klyngen
3. Systemet samler alle `truthTags` fra nodene i klyngen
4. Hvis klyngen inneholder ALLE `requiredTruthTags` → SEIER!

### Kombinasjons-arv (KRITISK!)

Når to noder kombineres til en ny node:
- Den nye noden **arver automatisk** alle `truthTags` fra begge foreldre-noder
- Dette betyr at selv om original-nodene forsvinner, bevares deres "sannhets-mening"
- Puzzle forblir løsbart uansett hvilke kombinasjoner spilleren gjør

```
Eksempel:
  ev_bird (truthTags: ["THE_DRONE"])
  +
  ev_patent (truthTags: ["THE_TECH"])
  =
  ev_combined (truthTags: ["THE_DRONE", "THE_TECH"]) ← Arvet automatisk!
```

---

## Case-struktur

### Hovedobjektet: `CaseData`

```typescript
interface CaseData {
  id: string;                    // Unik ID: "case_XXX_tema"
  title: string;                 // Visningsnavn for case-velger
  description: string;           // Kort beskrivelse av mysteriet
  difficulty: string;            // "TUTORIAL" | "EASY" | "MEDIUM" | "HARD"
  theTruth: TheTruth;            // Svaret spilleren skal avsløre
  boardState: BoardState;        // Starttilstand for spillet
  nodes: EvidenceNode[];         // Array med alle beviser
  scribblePool: string[];        // Tilfeldige tekster ved gyldige koblinger
  combinations?: Combination[];  // Valgfritt: Node-kombinasjoner
  requiredTruthTags?: string[];  // ← NYTT! Tags som MÅ være i klynge for å vinne
}
```

**VIKTIG:** `requiredTruthTags` definerer "fasiten" for caset. Spilleren vinner når en koblet klynge inneholder ALLE disse tags.

---

## TheTruth - Konklusjonen

Mad Libs-stil setning som blir "avslørt" ved seier:

```typescript
interface TheTruth {
  subject: string;   // Hvem/hva: "PIGEONS", "CATS", "THE MOON"
  action: string;    // Gjør hva: "ARE RECHARGING ON", "CONTROL", "HIDES"
  target: string;    // Mot hva: "POWER LINES", "THE INTERNET", "ALIENS"
  motive: string;    // Hvorfor: "TO SPY ON US", "FOR WORLD DOMINATION"
}
```

**Resultat ved seier:**
```
"BREAKING: PIGEONS ARE RECHARGING ON POWER LINES!!!"
```

---

## BoardState - Starttilstand

```typescript
interface BoardState {
  sanity: number;              // Start-sanity (anbefalt: 70-100)
  chaosLevel: number;          // Start-kaos (alltid 0)
  maxConnectionsNeeded: number; // Antall kritiske noder som må kobles
}
```

**Vanskelighetsgrad-anbefaling:**
| Difficulty | Sanity | Kritiske noder |
|------------|--------|----------------|
| TUTORIAL   | 100    | 3              |
| EASY       | 85     | 3-4            |
| MEDIUM     | 75     | 4-5            |
| HARD       | 70     | 5-6            |

---

## EvidenceNode - Bevis

```typescript
interface EvidenceNode {
  id: string;                    // Unik ID: "ev_beskrivende_navn"
  type: "photo" | "document" | "sticky_note";
  title: string;                 // Kort tittel
  contentUrl: string | null;     // Bilde-import eller null
  description: string;           // Tooltip-tekst (konspiratorisk tone!)
  tags: string[];                // For matching mellom noder (rød tråd)
  position: { x: number; y: number }; // Startposisjon på canvas
  isRedHerring: boolean;         // true = junk, false = ekte bevis
  isCritical?: boolean;          // true = viktig bevis (legacy)
  hiddenText?: string;           // Tekst som avsløres med UV-lys
  timelineTags?: string[];       // For blå tråd (timeline)
  timestamp?: number;            // For kronologisk sortering
  truthTags?: string[];          // ← NYTT! Semantisk sannhet for win condition
}
```

### Forskjell mellom `tags` og `truthTags`

| Property | Formål | Eksempel |
|----------|--------|----------|
| `tags` | Tillater kobling mellom noder | `["DRONE", "SURVEILLANCE"]` |
| `truthTags` | Beviser del av "sannheten" | `["THE_DRONE"]` |

**`tags`** bestemmer HVORDAN noder kan kobles (matching).
**`truthTags`** bestemmer HVORFOR noder er viktige for å vinne.

---

## Tag-Matching System

### Hvordan det fungerer

Når spilleren kobler to noder, sjekker systemet om de deler minst én felles tag:

```typescript
// Node A tags: ["DRONE", "SURVEILLANCE", "EYES"]
// Node B tags: ["DRONE", "GOVERNMENT", "BATTERY"]
// Matching tag: "DRONE" ✓ → Gyldig kobling!
```

### Regler for tags

1. **UPPERCASE**: Alle tags skal være i STORE BOKSTAVER
2. **Spesifikke**: Unngå for generelle tags som "EVIDENCE" eller "CLUE"
3. **Tematiske**: Tags bør reflektere konspirasjonens tema
4. **Overlappende**: Kritiske noder MÅ dele minst én tag med minst én annen kritisk node

### Eksempel tag-nettverk

```
Case: "Birds are drones"

ev_pigeon_photo   ─["DRONE"]─   ev_schematic
     │                              │
  ["EYES"]                     ["BATTERY"]
     │                              │
ev_security_cam              ev_powerline
```

**Gyldig kobling-kjede:**
- pigeon → schematic (via DRONE)
- schematic → powerline (via BATTERY)
- Alle 3 kritiske noder er nå koblet → SEIER!

---

## Win Condition

### Tag-basert seier (NYE SYSTEM)

Spilleren vinner når den største koblede klyngen inneholder **alle requiredTruthTags**.

```
VIKTIG: Det spiller ingen rolle HVILKE noder som er koblet!
Alt som betyr noe er at klyngen har alle nødvendige truthTags.

Eksempel - Case 1 (Birds):
requiredTruthTags: ["THE_DRONE", "THE_TECH", "THE_POWER_SOURCE"]

✓ SEIER: Klynge inneholder noder med alle 3 tags
✗ IKKE SEIER: Klynge mangler én eller flere tags
```

### Hvordan systemet sjekker seier

```typescript
// 1. Finn største koblede klynge (BFS)
// 2. Samle alle truthTags fra noder i klyngen
// 3. Sjekk: Har klyngen ALLE requiredTruthTags?
// 4. Hvis ja → SEIER!

// Fordel: Fungerer selv etter node-kombinasjoner!
```

### Legacy fallback

Hvis `requiredTruthTags` ikke er definert, faller systemet tilbake til det gamle `isCritical`-baserte systemet.

---

## Node-design guidelines

### Kritiske noder (30%)

- Sett `isRedHerring: false` og `isCritical: true`
- **Gi `truthTags`** som matcher en av `requiredTruthTags`
- MÅ ha `tags` som overlapper med andre kritiske noder (for matching)
- Bør ha `hiddenText` for UV-lys avslørning
- Plasser spredt på brettet for å oppmuntre utforskning

### Sannhets-tag design

Hver `requiredTruthTag` representerer én del av "sannheten":

```typescript
// Case: Birds are drones
requiredTruthTags: ["THE_DRONE", "THE_TECH", "THE_POWER_SOURCE"]

// THE_DRONE - Beviset på at fuglen ER en drone
// THE_TECH - Teknologien/patentene bak
// THE_POWER_SOURCE - Hvor de lader (kraftlinjer)
```

**Tips:** Bruk `THE_` prefix for sannhets-tags for å skille dem fra vanlige tags.

### Red Herrings / Junk (70%)

- Sett `isRedHerring: true` (ingen `isCritical` eller `truthTags`)
- Gi `tags` som IKKE matcher kritiske noder
- Kan ha morsomme/absurde beskrivelser
- Spilleren får poeng for å kaste disse

### Eksempel balanse

```
TUTORIAL (3 kritiske):
- 3 kritiske noder
- 6-8 red herrings
- Total: ~10 noder

HARD (5 kritiske):
- 5 kritiske noder
- 10-12 red herrings
- Total: ~15 noder
```

---

## Scribble Pool

Array med konspiratoriske utrop som vises ved gyldige koblinger:

```typescript
scribblePool: [
  "I KNEW IT!",
  "THEY'RE ALL CONNECTED!",
  "WAKE UP SHEEPLE!",
  "THE TRUTH IS HERE!",
  "FOLLOW THE MONEY!"
]
```

**Tips:**
- 5-10 unike scribbles per case
- Match temaet (due-case: "BIRDS AREN'T REAL!")
- Bruk CAPS for "crazy" effekt
- Korte utrop fungerer best

---

## Combinations (Valgfritt)

Spilleren kan kombinere to noder til én ny:

```typescript
combinations: [
  {
    itemA: "ev_drone_manual",
    itemB: "ev_bird_book",
    unlockText: "THE MANUALS REVEAL THE TRUTH!",
    resultNodes: [
      {
        id: "ev_combined_blueprint",
        type: "document",
        title: "Cross-Referenced Plans",
        description: "The evidence combined reveals more!",
        tags: ["DRONE", "BATTERY", "SURVEILLANCE"],
        position: { x: 350, y: 100 },
        isRedHerring: false,
        isCritical: true
      }
    ]
  }
]
```

---

## Komplett Case-mal

```typescript
import { CaseData } from '../types/game';
// Import bilder her om nødvendig

export const case_XXX: CaseData = {
  id: "case_XXX_tema",
  title: "Case Title Here",
  description: "A mysterious phenomenon needs investigation...",
  difficulty: "EASY",

  theTruth: {
    subject: "SUBJECT",
    action: "DOES SOMETHING TO",
    target: "TARGET",
    motive: "FOR SOME REASON"
  },

  boardState: {
    sanity: 85,
    chaosLevel: 0,
    maxConnectionsNeeded: 3
  },

  // ⚠️ VIKTIG: Definer sannhets-tags for win condition
  requiredTruthTags: ["THE_SUBJECT", "THE_ACTION", "THE_TARGET"],

  nodes: [
    // === KRITISKE NODER (må kobles for å vinne) ===
    {
      id: "ev_critical_1",
      type: "photo",
      title: "Main Evidence",
      contentUrl: null,
      description: "Something suspicious here...",
      tags: ["TAG_A", "TAG_B"],         // For matching
      position: { x: 200, y: 150 },
      isRedHerring: false,
      hiddenText: "SECRET TEXT",
      isCritical: true,
      truthTags: ["THE_SUBJECT"]        // ← Del av sannheten
    },
    {
      id: "ev_critical_2",
      type: "document",
      title: "Supporting Document",
      contentUrl: null,
      description: "Official papers that prove everything!",
      tags: ["TAG_A", "TAG_C"],         // Deler TAG_A med ev_critical_1
      position: { x: 500, y: 200 },
      isRedHerring: false,
      hiddenText: "CLASSIFIED",
      isCritical: true,
      truthTags: ["THE_ACTION"]         // ← Del av sannheten
    },
    {
      id: "ev_critical_3",
      type: "sticky_note",
      title: "Witness Note",
      contentUrl: null,
      description: "Someone saw something...",
      tags: ["TAG_C", "TAG_D"],         // Deler TAG_C med ev_critical_2
      position: { x: 350, y: 400 },
      isRedHerring: false,
      hiddenText: "I SAW THEM",
      isCritical: true,
      truthTags: ["THE_TARGET"]         // ← Del av sannheten
    },

    // === RED HERRINGS (junk) - Ingen truthTags! ===
    {
      id: "ev_junk_1",
      type: "photo",
      title: "Random Photo",
      contentUrl: null,
      description: "Probably nothing important...",
      tags: ["UNRELATED_1", "UNRELATED_2"],
      position: { x: 100, y: 300 },
      isRedHerring: true
      // Ingen truthTags = bidrar ikke til seier
    },
    {
      id: "ev_junk_2",
      type: "sticky_note",
      title: "Shopping List",
      contentUrl: null,
      description: "Eggs, milk, tin foil for hats...",
      tags: ["GROCERIES"],
      position: { x: 600, y: 100 },
      isRedHerring: true
    }
    // Legg til flere red herrings...
  ],

  scribblePool: [
    "IT ALL MAKES SENSE NOW!",
    "THEY TRIED TO HIDE THIS!",
    "THE EVIDENCE IS CLEAR!",
    "CONNECT THE DOTS!",
    "I WAS RIGHT ALL ALONG!"
  ]
};
```

---

## Validerings-sjekkliste

Før du legger til et nytt case, verifiser:

### Grunnleggende
- [ ] `id` er unikt og følger formatet `case_XXX_tema`
- [ ] `theTruth` gir mening som setning
- [ ] `scribblePool` har minst 5 entries
- [ ] Alle noder har unike `id`
- [ ] Posisjoner er spredt (unngå overlapp)

### Truth Tags (KRITISK!)
- [ ] `requiredTruthTags` er definert på case-nivå
- [ ] Hver kritisk node har `truthTags` som dekker minst én `requiredTruthTag`
- [ ] Alle `requiredTruthTags` kan oppnås via kritiske noder
- [ ] Kombinasjons-resultater har passende `truthTags` (arves automatisk fra foreldre)

### Kobling-logikk
- [ ] Alle kritiske noder kan kobles via delte `tags`
- [ ] Ingen kritisk node er isolert (må dele minst én tag)
- [ ] Red herrings har tags som IKKE matcher kritiske noder

### Test - Truth Tags

```
Case: "Birds are drones"
requiredTruthTags: ["THE_DRONE", "THE_TECH", "THE_POWER_SOURCE"]

ev_pigeon_photo   → truthTags: ["THE_DRONE"]         ✓
ev_schematic      → truthTags: ["THE_TECH"]          ✓
ev_powerline      → truthTags: ["THE_POWER_SOURCE"]  ✓

Alle 3 tags kan oppnås = VINNBART ✓
```

### Test - Kobling-logikk

```
Kritisk node-graf for case_XXX:

ev_critical_1 ──[TAG_A]── ev_critical_2
                              │
                          [TAG_C]
                              │
                         ev_critical_3

✓ Alle 3 kan nås via koblinger = KOBLBART
```

---

## Legge til nytt case

1. Opprett ny fil: `src/data/case_XXX.ts`
2. Følg malen over
3. Eksporter fra `src/data/cases.ts`:

```typescript
import { case_XXX } from './case_XXX';

export const allCases: CaseData[] = [
  case001,
  case002,
  // ...
  case_XXX  // Legg til her
];
```

4. Test at caset er vinnbart ved å koble alle kritiske noder

---

## Tips for gode cases

### Tematikk
- Velg absurde konspirasjoener (duer er droner, månen er et hologram)
- Hold det humoristisk og ufarlig
- Unngå ekte konspirasjonsteorier

### Vanskelighetsgrad
- TUTORIAL: Åpenbare koblinger, få distraksjoner
- EASY: Klare koblinger, moderate distraksjoner
- MEDIUM: Noen misvisende tags, flere red herrings
- HARD: Komplekse tag-nettverk, mange red herrings

### Bevis-typer
- `photo`: Bilder, skjermbilder, fotografier
- `document`: Offisielle dokumenter, rapporter, epost
- `sticky_note`: Håndskrevne notater, tips

### UV-lys hemmeligheter
Bruk `hiddenText` kreativt:
- Serienumre ("SERIAL #: BD-7742")
- Kodete meldinger ("PROJECT NEST EGG")
- Avsløringer ("I SAW THEM RECHARGE")
