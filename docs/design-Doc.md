GAME DESIGN DOCUMENT: PROJECT APOPHENIA
Working Title: Project Apophenia / The Conspiracy Board
Genre: Puzzle / Simulation / Roguelite
Platform: Web (Mobile First & Desktop)
Core Loop: Sort through chaotic evidence, discard junk, and connect the dots (literally) to reveal the Truth before you lose your sanity.

1. VISUAL STYLE & ATMOSPHERE
Theme: "Paranoid in a Basement." X-Files meets Pepe Silvia.
Aesthetics:

Diegetic UI: Menus are physical objects (CRT Monitor, Printer, Case Files). No floating "Game Menus".

Gritty Realism: Instead of flat vectors, we use Texture Masking. All nodes look like real torn paper, photos, and sticky notes using CSS masks and shadows.

Lighting: Dark, moody, tungsten lamp warmth.

Effects: Film grain, Vignette, CRT scanlines on the monitor.

2. GAME FLOW (SCENES)
Scene A: The Desktop (Main Menu)
View: First-person view of a messy desk.

Background: A realistic photo of a desk (desktop_bg.jpg) replacing 3D renders.

The Monitor (Menu): A CRT screen in the center displays the "Start Game" options. Green terminal text with glow effects (text-shadow) positioned absolutely inside the screen area.

The Printer (Level Select): A dot-matrix printer sits on the desk.

Animation: When a case is available, paper slowly feeds out with a "Brrr-zt-brrr" sound.

Action: Clicking the paper starts the level.

Scene B: The Corkboard (Gameplay)
View: A full-screen corkboard filled with scattered evidence.

Input Mode (Mobile Toggle): A HUD button toggles between:

🖐️ Move Mode: Pan around the board, rearrange items. (Nodes draggable, Connections disabled).

🔗 Link Mode: Draw red strings. (Nodes locked in place, entire node becomes a touch target).

The Evidence Bin: A trash can in the bottom right. Drag "Junk" items here to clean the board.

Scene C: The Debrief (Result Screen)
View: Displays a generated "Conspiracy Blog Post" or "Manifesto".

Content:

Headline: Generated based on the Mad Libs solution (e.g., "ELON MUSK IS EATING CLOUDS!").

Image: A composite of the linked nodes.

Score Breakdown: Investigation + Cleanup Bonus - Hoarder Penalty.

Comments: Fake user comments reacting to your theory ("Fake news!", "OMG TRUE").

3. CORE MECHANICS & LOGIC
A. The Red String (Connection System)
Logic: Players draw lines between nodes.

Validation:

Match: If nodes share a hidden Tag -> Line becomes thick/red. Sound: "Thud".

Mismatch: Line snaps immediately. Sound: "Violin Screech". Sanity decreases.

Mobile Optimization: In "Link Mode", the entire node is a hit-target (invisible overlay), not just a small handle.

Win Condition (Cluster Check): The game checks if the required "Truth Nodes" are connected in a single graph cluster (A-B-C). It does not require specific edges (e.g., A-C is not needed if A-B and B-C exist).

B. The Evidence System (Signal vs. Noise)
Ratio: 30% Real Clues / 70% Junk (Red Herrings).

Junk Types: Receipts, gum wrappers, irrelevant photos, "distractions" (look real but aren't).

UV Light Mechanic: A toggleable flashlight. When hovering over nodes, it reveals a hidden layer (CSS Mask) with secret text/scribbles (e.g., "LIES" written in invisible ink).

C. The Credibility Engine (Scoring)
Correct Connection: +1000 pts.

Trash Bonus (Active Cleaning): +150 pts for throwing Junk in the bin.

Trash Penalty (Critical Fail): -500 pts for throwing Real Evidence in the bin.

Hoarder Penalty: -50 pts for every piece of Junk left on the board at the end.

D. Resources
Sanity (Health): Starts at 100%. Drops on wrong connections.

<50% Sanity: Audio ringing increases, screen shakes, text starts changing dynamically.

Credibility (XP): Used to unlock harder cases.

4. TECHNICAL SPECS (FOR LOVABLE)
A. Data Structure
TypeScript

interface EvidenceNode {
  id: string;
  type: 'photo' | 'document' | 'sticky_note' | 'scrap';
  contentUrl: string; // The visual image
  hiddenLayerUrl?: string; // For UV light
  tags: string[]; // Logic tags
  isJunk: boolean; // For scoring logic
  rotation: number; // Random +/- 15deg
}

interface GameCase {
  id: string;
  truthNodes: string[]; // IDs required to win
  nodes: EvidenceNode[];
}
B. CSS / Visual Implementation
Texture Masking: Do not use distinct images for every paper scrap.

Use one seamless paper-texture.jpg as a background overlay (background-blend-mode: multiply).

Use clip-path to create torn edges for scraps/newspapers.

Use box-shadow for depth.

Mobile Handling:

touch-action: none to prevent browser scrolling.

React Flow panOnDrag logic conditional based on the "Move/Link" toggle.

C. Audio Manager
Layers: Base Hum (Always on) + Stress Layer (Volume inverted to Sanity).

Triggers:

playCrumple() (Bin drop)

playScratch() (Connection made)

playSnap() (Connection broken)

playPrinter() (New level)

5. PROMPT STRATEGY (HOW TO BUILD)
When asking Lovable to update the project, refer to these phases:

"Phase Polish": Apply the paper-texture and shadows to all nodes. Replace vector backgrounds with the uploaded JPG.

"Phase Mobile": Implement the "Cluster Check" win logic and the "Whole Node" link target overlay.

"Phase Logic": Implement the CredibilityEngine (Scoring) and the TrashBin collision detection.

"Phase Juice": Add the Audio Manager and UV Light toggle.
