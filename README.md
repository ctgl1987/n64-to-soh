# SRA to SoH Save Converter

Web-based converter that imports N64 emulator save files (`.sra`, `.srm`) and converts them to [Ship of Harkinian](https://www.shipofharkinian.com/) `.sav` format (JSON).

Visually displays all 3 save slots using the in-game pause menu layout (Items, Equipment, Quest, Save) with original sprite icons.

## Features

- **Visual preview** of inventory, equipment, quest status, and dungeon progress
- **Save validation** with warnings for out-of-range values
- **Basic editing** of player name, rupees, and health before export
- **Multi-slot export** with checkboxes to export multiple slots at once
- **Export preview** modal showing a summary before downloading
- **Auto byte-order detection** across BE, LE, BS, and WS formats

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

### SoH version

Generates saves compatible with **Ship of Harkinian Ackbar Delta (9.2.3)** — save format version 4.

## Usage

1. Open `index.html` in any modern browser
2. Drag and drop your `.sra` / `.srm` file (or click to browse)
3. Click on a file slot to expand it
4. Browse Items, Equipment, Quest screens to verify your save data
5. Optionally edit player name, rupees, or health
6. Go to the Save tab, select slots to export, and click **Export .sav**
7. Place the exported `.sav` in your SoH save directory

No server required — everything runs client-side in the browser.

## Save format

The N64 SRAM (32KB) contains 3 save slots + 3 backups. Each slot stores inventory, quest flags, scene flags, and dungeon data as a C struct in big-endian format. Emulators may apply byte swapping depending on their PI interface emulation.

The converter reads the binary SRAM, displays it visually, and outputs a SoH-compatible JSON `.sav` with all sections (`base`, `sohStats`, `itemTrackerData`, `trackerData`).
