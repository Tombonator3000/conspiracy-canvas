# Mix & Match Objects Implementation Log

**Dato:** 2024-12-16
**Feature:** Mikse og matche objekter for å lage nytt bevis
**Branch:** claude/mix-match-objects-proof-gvZLH

---

## Oversikt

Implementerer et utvidet kombinasjonssystem hvor spillere kan:
- Kombinere bevis-noder for å lage nye bevis
- Se visuelle hints når kombinerbare items er nær hverandre
- Bruke UV-lys for å avsløre kombinasjons-hints
- Utføre kjede-kombinasjoner (resultat fra én combo brukes i neste)

---

## Endringslogg

### [START] - Prosjektanalyse

**Nåværende tilstand:**
- Kombinasjonssystem eksisterer i `ConspiracyBoard.tsx`
- Kun Case 001 har definerte kombinasjoner
- Bruker collision-detection for å trigge kombinasjoner
- Belønning: +200 credibility per vellykket kombinasjon

**Filer som vil bli endret:**
- `src/types/game.ts` - Utvide Combination interface
- `src/data/cases/*.ts` - Legge til kombinasjoner for alle cases
- `src/components/game/ConspiracyBoard.tsx` - Utvide kombinasjonslogikk
- `src/components/game/EvidenceNode.tsx` - Legge til glow-effekt

---

### [1] - Utvidet Combination Interface (game.ts)

**Endringer:**
- Lagt til `hint?: string` - UV-lys hint for kombinasjoner
- Lagt til `isChainResult?: boolean` - Markerer at resultat kan brukes videre
- Lagt til `bonusCredibility?: number` - Tilpasset belønning per kombinasjon
- Lagt til `difficulty?: 'easy' | 'medium' | 'hard'` - Påvirker hint-synlighet
- Ny interface `CombinationProgress` for å spore oppdagede kombinasjoner

---

### [2] - Kombinasjoner lagt til for alle 7 cases

**Case 001 (Birds):** 3 kombinasjoner
- drone_manual + bird_book → Cross-Referenced Plans + Scribbled Note
- combined_blueprint + powerline → National Charging Grid (kjede-kombinasjon)
- pigeon_photo + schematic → Ocular Specifications

**Case 002 (Socks):** 3 kombinasjoner
- lonely_sock + seismograph → Portal Frequency Analysis
- instruction_manual + lint → Hidden Manual Page (kjede-kombinasjon)
- hidden_page + receipt → The Smoking Gun (+350 bonus)

**Case 003 (Milk):** 3 kombinasjoner
- bodybuilder + memo → The Meeting
- calendar + cheese → Aging Truth Chart (kjede-kombinasjon)
- aging_chart + lactaid → Strength Suppression Formula (+300 bonus)

**Case 004 (Cloud):** 3 kombinasjoner
- cloud_disk + rain_article → Upload-Rain Correlation
- server_smoke + dropbox → The Data Cycle (kjede-kombinasjon)
- water_cycle + icloud_terms → Legal Admission (+350 bonus)

**Case 005 (Cats):** 3 kombinasjoner
- cat_router + purr_frequency → Signal Analysis
- cat_eyes + ancient_egypt → Decoded Hieroglyphs (kjede-kombinasjon)
- hieroglyph + catnip → Feline Firmware Protocol (+350 bonus)

**Case 006 (Moon):** 4 kombinasjoner
- lightbulb + eclipse → Flip Mechanism Diagram
- budget + craters → Thermal Management Report (kjede-kombinasjon)
- cooling_system + phases → Celestial Control Panel (+400 bonus)
- dimmer_controls + werewolf_book → The Final Truth (+500 bonus)

**Case 007 (Titanic):** 4 kombinasjoner
- iphone_1912 + passenger_list → Time Tourist ID
- iceberg + souvenirs → Weight Distribution Report (kjede-kombinasjon)
- weight_analysis + band → The Impossible Playlist (+400 bonus)
- time_tourist + movie → The Cameron Confession (+500 bonus)

---

### [3] - Visuell Glow-Feedback (index.css)

**Nye CSS-klasser:**
- `.combinable-glow` - Gull glow når kombinerbare items er nær hverandre
- `.chain-combinable-glow` - Lilla glow for kjede-kombinasjon items
- `.uv-combination-hint` - UV-lys hint tekst under noder

---

### [4] - Oppdatert EvidenceNode.tsx

**Nye props:**
- `isNearbyCombinable?: boolean` - Glow når nær en gyldig kombinasjonspartner
- `isChainCombinable?: boolean` - Lilla glow for kjede-kombinasjon items
- `combinationHint?: string` - UV-lys hint for kombinasjoner

---

### [5] - Oppdatert ConspiracyBoard.tsx

**Nye hjelpefunksjoner:**
- `getCombinationHint()` - Henter hint for en node
- `getCombinable()` - Sjekker om en node kan kombineres
- `areNodesNearby()` - Sjekker avstand mellom noder

**Oppdatert logikk:**
- Beregner nærliggende kombinerbare par
- Bruker `bonusCredibility` fra kombinasjoner
- Sender kombinasjonsdata til noder

---

