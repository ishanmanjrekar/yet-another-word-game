# Design System: Premium Meta-Generic

## 1. Overview & Creative North Star
**The Creative North Star: "Hyper-Glossy Irony"**

This design system is built on a paradox: it celebrates the "generic" tropes of mobile word games while executing them with the precision of a high-end luxury brand. We are moving away from the flat, sterile minimalism of modern tech and leaning into **Tactile Maximalism**. 

The goal is to create a UI that feels "expensive" through depth, intentional asymmetry, and a physical presence. We break the "template" look by treating the interface not as a flat screen, but as a collection of physical objects—heavy tiles, glowing glass, and deep, recessed containers. Every interaction should feel like pressing a physical button on a million-dollar arcade machine.

---

## 2. Colors & Surface Philosophy
The palette is a high-octane clash of deep royals and vibrant highlights. We use contrast not just for accessibility, but as a structural tool.

### Tone & Role
- **Primary (`#e9c400`):** The "Gold Standard." Used for critical actions and "winning" moments.
- **Secondary (`#dfb7ff`):** Our "Magic" accent. Softens the intensity of the purple.
- **Tertiary (`#00e471`):** "The Mint of Success." Exclusively for positive feedback and correct answers.
- **Surface (`#111125`):** The "Deep Void." A rich, near-black purple that provides the foundation.

### The Rules of Engagement
- **The "No-Line" Rule:** 1px solid borders are strictly forbidden for layout sectioning. Separation is achieved through **Tonal Shifts**. For example, a `surface-container-low` panel sitting on a `surface` background creates a natural boundary without the "cheapness" of a stroke.
- **Surface Hierarchy:** Treat the UI as a series of nested trays. 
    - *Background:* `surface`
    - *Sections:* `surface-container-low`
    - *Interactive Cards:* `surface-container-highest`
- **Signature Textures:** Main CTA buttons must use a vertical gradient from `primary` to `primary-container`. This adds the "3D soul" required for the high-polish aesthetic.
- **Glassmorphism:** Use semi-transparent `secondary-container` (at 40% opacity) with a `20px` backdrop blur for floating overlays or "Meta" game tips.

---

## 3. Typography
We pair the playful, "gamey" weight of **Lilita One** (applied via our Epilogue scale tokens) with the technical precision of **Be Vietnam Pro**.

- **Display & Headline (Lilita One / Epilogue Token):** These are the "punchy" moments. Use `display-lg` for victory screens and `headline-md` for headers. Always set to `on-surface` or `on-primary` depending on the container.
- **Body & Labels (Be Vietnam Pro):** Used for instructions, settings, and "boring" legal text. This font provides the "Premium" half of the "Meta-Generic" equation—it looks professional and intentional.
- **Visual Hierarchy:** Typography must feel "squashed and stretched." Titles should be massive, while body text remains compact and readable, creating a high-contrast editorial rhythm.

---

## 4. Elevation & Depth
In this system, depth is a feature, not an afterthought. We use **Tonal Layering** to define the world.

- **The Layering Principle:** Do not use shadows to separate flat cards. Instead, use a "Recessed" look: an inner container should be `surface-container-lowest` (darker) to look like it's carved into the UI, or `surface-container-highest` (lighter) to look like it's sitting on top.
- **Ambient Shadows:** For "Floating" elements (like a letter tile being dragged), use a "Signature Glow Shadow." The shadow color should be a 15% opacity version of the object's own color (e.g., a Yellow Tile casts a Yellowish shadow), with a `blur` of `24px` and a `Y-offset` of `8px`.
- **The 3D "Chunky" Effect:** Interactive elements use a "Shadow-Step." A button isn't just a color; it has a `4px` solid bottom-border of a darker shade (e.g., `primary-fixed-variant`) to simulate a physical side-profile.

---

## 5. Components

### Buttons (The "Satisfying Click")
- **Primary:** `Lilita One`, `primary` background, `primary-container` 4px bottom-border. On hover, the border shrinks; on press, the button shifts down 2px.
- **Secondary:** `secondary-container` background with `on-secondary-container` text.
- **Tertiary:** No background. Bold `Lilita One` text with an `outline-variant` "Ghost Border" at 20% opacity.

### Tiles (The Core Game Unit)
- **The Letter Tile:** Use `surface-container-highest`. Apply a subtle inner-glow (top-down) using `surface-bright` at 10% opacity to give it a "beveled" look. Forbid dividers; use `spacing-1` as the gap between tiles.

### Cards & Lists
- **The "No-Divider" Rule:** Lists are separated by `spacing-2` vertical gaps. Each list item sits on a `surface-container-low` background. 
- **Header Asymmetry:** Headlines in cards should be slightly offset (e.g., `spacing-1` to the left) to break the "Bootstrap" grid feel.

### Input Fields
- **Tactile Inputs:** Use `surface-container-lowest` as the background (sunken look). The active state uses a `primary` "Ghost Border" (20% opacity) and a `primary` cursor.

---

## 6. Do’s and Don'ts

### Do:
- **Use "Meta" Humor:** Use `Be Vietnam Pro` in `label-sm` to explain the game mechanics in a dry, self-aware tone.
- **Embrace the Glow:** Use the `tertiary` (Mint) color for "Success" states with a heavy outer glow to make it feel like the screen is radiating.
- **Layer Surfaces:** Stack `surface-container-low` on `surface` to define the play area.

### Don’t:
- **No Hairlines:** Never use a 1px solid line to separate content. It kills the "Game" vibe. Use white space or color shifts.
- **No Grey Shadows:** Never use `#000000` for shadows. Use a darkened version of your background purple (`#0c0c1f`).
- **No Flat Buttons:** A button without a 3D "bottom-edge" is a bug, not a feature.

---

## 7. Spacing & Rhythm
We avoid the standard 8px grid in favor of a "Punchy Scale."
- **Spacing-3 (1rem):** The standard gutter.
- **Spacing-6 (2rem):** Used to separate major "Game Phases" (e.g., Title vs. Grid).
- **Rounding:** Use `xl` (1.5rem) for main game containers and `md` (0.75rem) for tiles. This creates a "friendly-chunky" silhouette.