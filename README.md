# SRA to SoH Save Converter

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-blue?logo=github)](https://ctgl1987.github.io/n64-to-soh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made for SoH](https://img.shields.io/badge/Ship_of_Harkinian-Ackbar_Delta_9.2.3-gold)](https://www.shipofharkinian.com/)
[![Save Format](https://img.shields.io/badge/Save_Format-v4-orange)]()
[![No Server](https://img.shields.io/badge/100%25-Client_Side-purple)]()

Web-based converter that imports N64 emulator save files (`.sra`, `.srm`) and Ship of Harkinian `.sav` files, displaying them with the in-game pause menu layout and allowing full inventory editing before export.

## Features

- **Visual preview** of all 3 save slots using the original pause menu layout (Items, Equipment, Quest, Save)
- **Full save editing** via overlay edit panels:
  - **Items**: checkboxes, dropdowns for multi-option slots (bottles, adult/child trade), ammo inputs
  - **Equipment**: checkboxes for gear bits, radio selectors for upgrade tiers (quiver, bomb bag, strength, scale, wallet, bullet bag, sticks, nuts)
  - **Quest**: checkboxes for medallions, songs, spiritual stones, Stone of Agony, Gerudo Card; number inputs for Gold Skulltulas and heart pieces
- **Basic field editing** of player name, rupees, and health
- **Visual diff**: blue "save" badges mark original items, green "new" badges and green dots highlight additions
- **Reset edits** button to restore original save values
- **Tooltips** on all items for quick identification
- **SoH save import**: load existing `.sav` JSON files for viewing and re-export
- **Save version upgrade**: automatically upgrades v1/v2/v3 saves to v4
- **Save validation** with warnings for out-of-range values
- **Multi-slot export** with checkboxes and export preview modal
- **Auto byte-order detection** across BE, LE, BS, and WS formats
- **Content-based format detection**: automatically distinguishes binary SRAM from JSON saves

## Compatibility

### Emulator saves

| Emulator | Extension | Byte Order |
|----------|-----------|------------|
| Mupen64 / Mupen64Plus | `.sra` | LE / BS |
| Project64 | `.sra` | LE |
| RetroArch (Mupen64Plus-Next / ParaLLEl) | `.srm` | BE |
| Simple64 / RMG | `.sra` | BE / LE |
| BizHawk | `.SaveRAM` | BE |

Files smaller than 32KB (like PJ64 saves) are automatically padded.

### SoH saves

Ship of Harkinian `.sav` files (JSON format) are supported for both viewing and editing. Saves using format versions 1–3 are automatically upgraded to version 4.

### Target version

Generates saves compatible with **Ship of Harkinian Ackbar Delta (9.2.3)** — save format version 4.

## Usage

1. Open `index.html` in any modern browser (or use the [live demo](https://ctgl1987.github.io/n64-to-soh/))
2. Drag and drop your `.sra` / `.srm` / `.sav` file (or click to browse)
3. Click on a save slot to expand it
4. Browse Items, Equipment, Quest screens to verify your save data
5. Click the ✎ button on any screen to open the edit panel and add/remove items
6. Edit player name, rupees, or health in the Save tab
7. Select slots to export and click **Export .sav**
8. Place the exported `.sav` in your SoH save directory

No server required — everything runs client-side in the browser.

## Save format

The N64 SRAM (32KB) contains 3 save slots + 3 backups. Each slot stores inventory, quest flags, scene flags, and dungeon data as a C struct in big-endian format. Emulators may apply byte swapping depending on their PI interface emulation.

The converter reads the binary SRAM, displays it visually, and outputs a SoH-compatible JSON `.sav` with all sections (`base`, `sohStats`, `itemTrackerData`, `trackerData`).

The equipment upgrades are stored in a single `u32` bitmask:

| Upgrade | Bits | Shift | Values |
|---------|------|-------|--------|
| Quiver | 3 | 0 | 0–3 |
| Bomb Bag | 3 | 3 | 0–3 |
| Strength | 3 | 6 | 0–3 |
| Scale | 3 | 9 | 0–2 |
| Wallet | 2 | 12 | 0–3 |
| Bullet Bag | 3 | 14 | 0–3 |
| Sticks | 3 | 17 | 0–3 |
| Nuts | 3 | 20 | 0–3 |
