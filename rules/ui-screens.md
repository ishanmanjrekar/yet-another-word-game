# Screen Layouts & States

This document maps the overall composition of individual screens based on our UI references. It identifies the spatial architecture and dynamic states for each distinct view.

## 1. Main Menu Screen
A highly layered, polished entry point emphasizing the game modes.
- **Background Elements:** Uses a set of randomly floating decorative letter tiles behind the main content (`opacity-10`) to create depth (`.tile-floating`, `.tile-floating-alt`).
- **Hero Title:** Massive `YAWG` text (`text-7xl`) using `font-headline` with a deep `drop-shadow` for 3D extrusion effect.
- **Navigation Layout:** A centralized column housing the "Arcade" and "WOTD" major buttons. Below each button is a high-score/streak pill featuring a silver/metallic gradient (`bg-gradient-to-b from-[#E8E8E8] to-[#B0B0B0]`) nested within a purple shadow structure.
- **Header:** Features the global Top Header Bar showing lifetime accumulated coins.

## 2. Game Board Screen
The core interactive view where gameplay occurs. Structural boundaries are rigid.
- **Top Bar Fixed:** A sticky header displaying the Pause toggle, Time Remaining (center), and Level Coins (right). It uses a deep shadow to separate itself from scrollable content.
- **Upper Half (Definition Area):** 
  - Contains the active Word Target slots.
  - A recessed container showing the Definition text.
  - State Indicators (e.g., Checkmarks for completed words).
  - Next/Previous button toggles to switch between available words for the current stage.
- **Lower Half (The Grid):**
  - A nested tray (`bg-surface-container shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]`).
  - Contains the 4x4 Grid of 16 chunky letter tiles.
  - Below the grid, centered, is the row of 3 circular Power-Up action buttons.

## 3. Pause & Quit Menus (Overlays)
Modal layers that interrupt gameplay.
- **Backdrop:** A dark semi-transparent overlay (`bg-surface-dim/80 backdrop-blur-sm`).
- **Modal Container:** Centered vertically and horizontally. It is a thick card (`bg-surface-container-low border-b-[8px] border-surface-container-lowest`).
- **Content Structure:**
  - An Icon graphic (e.g., Pause icon or Exclamation icon for Quit).
  - Headline (`font-headline text-3xl`).
  - Stacked large action buttons (e.g., RESUME vs. QUIT).

## 4. Stage & Time Overlays
High-energy transitional states.
- **Stage Start:** Usually a full-screen or prominent modal blast introducing the level number (e.g., "STAGE 12") accompanied by the WOTD or Arcade visual identifiers. Follows the same modal styling but with hyper-focus on typography scale.
- **Time Up! Screen:** Visually jarring, often utilizing the `error` color palette. The headline "TIME'S UP" must dominate, with an option to Revive (spend coins to continue) or accept Game Over.

## 5. Power-Up Use States
Visual indicators for when hints are triggered.
- **Lightbulb Target:** Specific tiles in the grid that are selected by a hint should pulse (e.g., `animate-pulse` mixed with an outer glow `shadow-[0_0_8px_rgba(...]`).
- **Lightning Target:** When automatically filling a slot, the target slot flashes success (`tertiary` Mint Green) right as the letter locks in.

> **Related Documents:**
> - [Core Design System](./ui-design-system.md)
> - [UI Components Architecture](./ui-components.md)
