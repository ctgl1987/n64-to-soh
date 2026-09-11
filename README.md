# SRA to SoH Save Converter

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-blue?logo=github)](https://ctgl1987.github.io/n64-to-soh/)
[![Version](https://img.shields.io/badge/Version-2026.09.11-informational)](https://ctgl1987.github.io/n64-to-soh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made for SoH](https://img.shields.io/badge/Ship_of_Harkinian-Ackbar_Delta_9.2.3-gold)](https://www.shipofharkinian.com/)
[![Save Format](https://img.shields.io/badge/Save_Format-v4_%7C_v3-orange)]()
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
- **Selectable target version**: exports as SoH save format v4 or v3
- **Save validation** with warnings for out-of-range values
- **Multi-slot export** with checkboxes and export preview modal
- **Auto byte-order detection** across BE, LE, BS, and WS formats
- **Content-based format detection**: automatically distinguishes binary SRAM from JSON saves

## Compatibility

### Emulator saves

| Emulator | Extension | Byte Order | Container |
|----------|-----------|------------|-----------|
| Mupen64 / Mupen64Plus | `.sra` | LE / BS | raw 32KB SRAM |
| Project64 | `.sra` | LE | raw 32KB SRAM |
| RetroArch (Mupen64Plus-Next / ParaLLEl) | `.srm` | BE / LE | combined 296,960-byte blob |
| Simple64 / RMG | `.sra` | BE / LE | raw 32KB SRAM |
| BizHawk | `.SaveRAM` | BE | raw 32KB SRAM |

Files smaller than 32KB (like PJ64 saves) are automatically padded.

RetroArch's N64 cores expose every save type as a single blob through
`RETRO_MEMORY_SAVE_RAM`, so a `.srm` is **not** a bare SRAM dump — it packs EEPROM,
the four controller paks, SRAM and FlashRAM into one 296,960-byte file:

| Region | Offset | Size |
|--------|--------|------|
| EEPROM | `0x00000` | `0x800` |
| Mempak ×4 | `0x00800` | `0x20000` |
| **SRAM** (Ocarina of Time) | **`0x20800`** | `0x8000` |
| FlashRAM | `0x28800` | `0x20000` |

The converter extracts the SRAM region automatically. Unknown container layouts are
handled by scanning for the slot magic and scoring candidate offsets by how many
slots actually parse.

### Troubleshooting

**"Cannot detect byte order — ZELD magic not found"**

- **RetroArch SaveRAM compression.** If Settings → Saving → *SaveRAM Compression* is
  on, RetroArch writes an RZIP-compressed file (magic `#RZIPv1#`) instead of raw
  bytes. The converter detects this and tells you to turn the option off, load the
  game once and save again.
- **Wrong save type.** Ocarina of Time uses 32KB SRAM. An `.eep` (EEPROM) or `.fla`
  (FlashRAM) file belongs to a different game.

### SoH saves

Ship of Harkinian `.sav` files (JSON format) are supported for both viewing and editing. Saves using format versions 1–3 are automatically upgraded to version 4.

### Target version

The Save screen includes a version selector for the exported `.sav`. Choose between:

- **format v4** (default)
- **format v3**

The selector applies to N64 `.sra`/`.srm` conversions and to re-exported `.sav` files alike. Profile names are carried over and translated between the v3 and v4 name charsets.

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

## Versioning

The site deploys straight from `main`, so there are no tagged releases. The version
is the date of the newest changelog entry (CalVer, `YYYY.MM.DD`) and is shown in the
page header — click it for the full changelog. Quote that number when reporting a bug.

Both the version and the changelog live in `CHANGELOG` / `APP_VERSION` at the top of
`converter.js`; bump them in the same commit as the change.

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
