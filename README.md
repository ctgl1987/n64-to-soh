# SRA to SoH Save Converter

Web-based converter that imports N64 emulator save files (`.sra`, `.srm`) and converts them to [Ship of Harkinian](https://www.shipofharkinian.com/) `.sav` format (JSON).

The tool visually displays all 3 save slots with detailed game info using OOT textures and icons, simulating the in-game pause menu screens (Items, Equipment, Quest, Save).

## Compatibility

### Emulator saves

| Emulator | Extension | Byte Order |
|----------|-----------|------------|
| Mupen64 / Mupen64Plus | `.sra` | LE / BS |
| Project64 | `.sra` | LE |
| RetroArch (Mupen64Plus-Next / ParaLLEl) | `.srm` | BE |
| Simple64 / RMG | `.sra` | BE / LE |
| BizHawk | `.SaveRAM` | BE |

The converter auto-detects byte order (BE, LE, BS, WS) by scanning for the `ZELD` magic across all 3 save slots. Files smaller than 32KB (like PJ64 saves) are automatically padded.

### SoH version

Generates saves compatible with **Ship of Harkinian Ackbar Delta (9.2.3)** — save format version 4.

## Usage

1. Open `index.html` in any modern browser
2. Drag and drop your `.sra` / `.srm` file (or click to browse)
3. Click on a file slot to expand it
4. Browse Items, Equipment, Quest screens to verify your save data
5. Go to the Save tab, name your file, and click **Export .sav**
6. Place the exported `.sav` in your SoH save directory

No server required — everything runs client-side in the browser.

## Save format

The N64 SRAM (32KB) contains 3 save slots + 3 backups. Each slot is a C struct stored in big-endian format on the N64, but emulators may apply byte swapping depending on their PI interface emulation.

Key fields parsed:
- **Inventory**: 24 item slots, ammo counts, equipment flags, upgrade tiers
- **Quest items**: medallions, songs, spiritual stones, Stone of Agony, Gerudo Card, heart pieces, skull tokens — all packed as bit flags in a single `u32`
- **Scene flags**: chest states, switches, room clears, collectibles for all 124 scenes
- **Dungeon data**: boss keys, compasses, maps, small key counts

The converter reads the binary SRAM, displays it visually, and outputs a SoH-compatible JSON `.sav` with all sections (`base`, `sohStats`, `itemTrackerData`, `trackerData`).
