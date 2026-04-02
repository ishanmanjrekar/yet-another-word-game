# YAWG: Powerups & Mechanics Document

This document defines the exact logic governing the execution of in-game hints and powerups to prevent edge-case bugs during development.

## 1. Economy & Pricing
Powerups cost **Coins**. Pricing should be configurable (e.g., stored in `rewards.json` under a `powerupCosts` object), but default approximations for the baseline economy are:
- **Shuffle:** 15 Coins (Cheap utility)
- **Lightbulb:** 25 Coins (Tactical assistance)
- **Lightning Bolt:** 40 Coins (Direct skip/completion)

## 2. Powerup Actions & Triggers
Because letters are mapped uniquely within the generated 16-tile grid, powerup execution requires checking specific UI selections to ensure it interacts correctly with what the user is actively doing.

### 2.1 Shuffle
- **Action:** Rearranges the visual order of the available tiles on the game board.
- **Rules:**
  - Tiles that have *already been selected* by the user (and placed into the active target word slots) are NOT shuffled.
  - The shuffle logic only applies to the remaining letters lingering in the unselected grid pool.
- **Algorithm:** Pass the unselected grid array through a Fisher-Yates array shuffle algorithm and trigger an animation state update in the UI. Reference [UI Screens: Power-Up Use States](./ui-screens.md) for expected behavior.

### 2.2 Lightbulb (Highlight Hint)
- **Action:** Subtly highlights a valid, unselected tile on the grid that is guaranteed to be a correct letter for the currently active word.
- **Rules:**
  - If the active word is `APPLE` and the player has currently selected nothing, highlight ANY unselected 'A', 'P', 'L', or 'E' that exist in the grid.
  - If the player has already successfully placed 'A' and 'P', only highlight one of the specific remaining unselected tiles for 'P', 'L', or 'E'.
- **Algorithm:**
  1. Calculate the exact missing characters required to complete the currently active target word.
  2. Find all unselected tile `indices` on the grid that match those missing characters.
  3. Pick a random `index` from that valid pool array.
  4. Apply a `.pulse-highlight` CSS class (or equivalent animation wrapper) to that specific tile in the UI. Reference [UI Screens](./ui-screens.md) for specifics on the glow effect.

### 2.3 Lightning Bolt (Instant Place)
- **Action:** Instantly snaps a correct letter from the unselected grid into the correct empty slot of the active word.
- **Rules:**
  - Skips player input completely. Moves the tile seamlessly as if the player confidently clicked the correct letter themselves.
- **Algorithm:**
  1. Find the first empty character slot in the active target word (reading left to right).
  2. Determine the specific character required for that slot.
  3. Search the *unselected grid pool* for a tile matching that character.
  4. Select the matching tile index and map it directly into the target slot, triggering the standard selection UI animation as detailed in [UI Components](./ui-components.md) and [UI Screens](./ui-screens.md).
