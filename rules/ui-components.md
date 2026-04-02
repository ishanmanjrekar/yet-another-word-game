# UI Components Architecture

This document dictates the structure and styling of the reusable interface components within the "Hyper-Glossy Irony" design system. All implementations should map back to these exact CSS utility behaviors.

## 1. Buttons (The "Chunky" Standard)
All interactive buttons must feel physical. They rely on bottom-borders or box-shadows to simulate a 3D side-profile that compresses when pressed. 

### Implementation Rule
Requires custom CSS transitions attached to `active:` states.
```css
.chunky-button {
    transition: all 0.1s ease;
}
.chunky-button:active {
    transform: translateY(2px);
    box-shadow: none; /* Or compress the shadow value */
}
```

### Variants
- **Primary CTA:** 
  - Background: `bg-primary` (`#e9c400`)
  - Border/Shadow Edge: `box-shadow: 0 4px 0 0 #554600` or `border-b-4 border-primary-container`
  - Text Color: `text-on-primary`
  - Font: `font-headline text-3xl`
  - *Example use:* "Arcade" Main Menu button, "NEXT" button on Game Board.

- **Secondary CTA:**
  - Background: `bg-secondary-container` (`#6c11af`)
  - Border/Shadow Edge: `box-shadow: 0 4px 0 0 #4b007e` or `border-b-4 border-secondary-container`
  - Text Color: `text-secondary` (`#dfb7ff`)
  - *Example use:* "WOTD" Main Menu button.

- **Power-Up Circular Buttons:**
  - Shape: `w-16 h-16 rounded-full`
  - Theming: Mapped to respective action. (e.g., Shuffle is `bg-tertiary` with `border-b-4 border-tertiary-container`).

## 2. Tiles (The Core Game Unit)
The 16-letter grid relies on chunky square tiles.
- **Base Style:** `aspect-square bg-surface-container-highest rounded-xl border-b-4 border-surface-container-lowest`
- **Typography:** `font-headline text-2xl text-on-surface`
- **Active State (`active:`):** `translate-y-1 border-b-0` (Flattens completely into the board).

## 3. Top Header Bar
A unified top bar used across the Main Menu and Game Board to display stats.
- **Container:** Flex layout with `justify-between items-center` or `justify-end items-center`.
- **Game Board specific:** Uses `bg-[#111125] shadow-[0_4px_0_0_#0c0c1f]` for a solid visual cut-off from the scrolling grid content below it.
- **Stat Pills (e.g., Coins):** Encapsulated in `bg-surface-container-highest rounded-full border-b-2 border-surface-container-lowest`. Inside, use the Material Symbol for coins and value in `font-headline text-lg`.

## 4. Definition Cards
Used to display the "clue" to the user.
- **Container:** `bg-surface-container-low rounded-xl p-8 shadow-[0_8px_0_0_#0c0c1f]`
- **Structure:** 
  - Label (`text-secondary font-label text-xs uppercase font-bold`)
  - BodyText (`text-on-surface font-headline text-2xl leading-tight`)

## 5. Input Word Slots
Representation of missing characters for a given definition.
- **Slot:** `w-12 h-16 bg-surface-container-lowest border-b-4 border-surface-container-highest rounded-lg`
- **Empty State Text:** An underscore `_` using `text-primary opacity-20` to mark the empty spot visually.

> **Related Documents:**
> - [Core Design System](./ui-design-system.md)
> - [Screen Specific Layouts](./ui-screens.md)
