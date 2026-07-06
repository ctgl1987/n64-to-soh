// ===== CONSTANTS =====

const SLOT_OFFSETS = [0x20, 0x1470, 0x28C0];
const SLOT_SIZE = 0x1450;

const CHARACTER_MAP = {};
for (let i = 0; i <= 9; i++) CHARACTER_MAP[i] = String.fromCharCode(i + 48);
for (let i = 171; i <= 196; i++) CHARACTER_MAP[i] = String.fromCharCode(i - 106);
for (let i = 197; i <= 222; i++) CHARACTER_MAP[i] = String.fromCharCode(i - 100);
CHARACTER_MAP[223] = ' '; CHARACTER_MAP[228] = '-'; CHARACTER_MAP[234] = '.';

const REVERSE_CHARACTER_MAP = {};
for (const [k, v] of Object.entries(CHARACTER_MAP)) REVERSE_CHARACTER_MAP[v] = Number(k);

const ITEM_NAMES = {
  0:'Deku Stick',1:'Deku Nut',2:'Bomb',3:'Fairy Bow',4:'Fire Arrow',5:"Din's Fire",
  6:'Fairy Slingshot',7:'Fairy Ocarina',8:'Ocarina of Time',9:'Bombchu',
  10:'Hookshot',11:'Longshot',12:'Ice Arrow',13:"Farore's Wind",14:'Boomerang',
  15:'Lens of Truth',16:'Magic Bean',17:'Megaton Hammer',18:'Light Arrow',19:"Nayru's Love",
  20:'Empty Bottle',21:'Red Potion',22:'Green Potion',23:'Blue Potion',
  24:'Bottled Fairy',25:'Fish',26:'Lon Lon Milk',27:"Ruto's Letter",
  28:'Blue Fire',29:'Bug',30:'Big Poe',31:'Half Milk',32:'Poe',
  33:'Weird Egg',34:'Chicken',35:"Zelda's Letter",36:'Keaton Mask',37:'Skull Mask',
  38:'Spooky Mask',39:'Bunny Hood',40:'Goron Mask',41:'Zora Mask',
  42:'Gerudo Mask',43:'Mask of Truth',44:'Sold Out',45:'Pocket Egg',46:'Pocket Cucco',
  47:'Cojiro',48:'Odd Mushroom',49:'Odd Potion',50:"Poacher's Saw",
  51:'Broken Goron Sword',52:'Prescription',53:'Eyeball Frog',54:'Eye Drops',55:'Claim Check'
};

const SLOT_LABELS = [
  'Sticks','Nuts','Bombs','Bow','Fire Arrow',"Din's Fire",
  'Slingshot','Ocarina','Bombchu','Hookshot','Ice Arrow',"Farore's Wind",
  'Boomerang','Lens','Beans','Hammer','Light Arrow',"Nayru's Love",
  'Bottle','Bottle','Bottle','Bottle','Trade','Trade'
];

const AMMO_SLOTS = new Set([0, 1, 2, 3, 6, 8, 14]);

const SLOT_DEFAULTS = [
  0, 1, 2, 3, 4, 5,       // sticks, nuts, bombs, bow, fire arrow, din's fire
  6, 7, 9, 10, 12, 13,    // slingshot, fairy ocarina, bombchu, hookshot, ice arrow, farore's wind
  14, 15, 16, 17, 18, 19,  // boomerang, lens, beans, hammer, light arrow, nayru's love
  20, 20, 20, 20, 45, 33   // bottles, adult trade, child trade
];

const SLOT_DEFAULT_AMMO = { 0:10, 1:20, 2:10, 3:30, 6:30, 8:20, 14:1 };

const SLOT_ITEMS = [
  [0],[1],[2],[3],[4],[5],
  [6],[7,8],[9],[10,11],[12],[13],
  [14],[15],[16],[17],[18],[19],
  [20,21,22,23,24,25,26,27,28,29,30,31,32],
  [20,21,22,23,24,25,26,27,28,29,30,31,32],
  [20,21,22,23,24,25,26,27,28,29,30,31,32],
  [20,21,22,23,24,25,26,27,28,29,30,31,32],
  [45,46,47,48,49,50,51,52,53,54,55],
  [33,34,35,36,37,38,39,40,41,42,43],
];

const SONGS = [
  {name:"Zelda's Lullaby", bit:12, img:'note_white.png'},
  {name:"Epona's Song", bit:13, img:'note_white.png'},
  {name:"Saria's Song", bit:14, img:'note_white.png'},
  {name:"Sun's Song", bit:15, img:'note_white.png'},
  {name:'Song of Time', bit:16, img:'note_white.png'},
  {name:'Song of Storms', bit:17, img:'note_white.png'},
  {name:'Minuet of Forest', bit:6, img:'note_green.png'},
  {name:'Bolero of Fire', bit:7, img:'note_red.png'},
  {name:'Serenade of Water', bit:8, img:'note_blue.png'},
  {name:'Requiem of Spirit', bit:9, img:'note_orange.png'},
  {name:'Nocturne of Shadow', bit:10, img:'note_purple.png'},
  {name:'Prelude of Light', bit:11, img:'note_yellow.png'},
];

const EQUIP_CATS = [
  {name:'Swords', items:['Kokiri Sword','Master Sword',"Biggoron's Sword"], bits:[0,1,2]},
  {name:'Shields', items:['Deku Shield','Hylian Shield','Mirror Shield'], bits:[4,5,6]},
  {name:'Tunics', items:['Kokiri Tunic','Goron Tunic','Zora Tunic'], bits:[8,9,10]},
  {name:'Boots', items:['Kokiri Boots','Iron Boots','Hover Boots'], bits:[12,13,14]},
];

const UPGRADE_DEFS = [
  {name:'Quiver', shift:0, mask:7, vals:['—','Quiver (30)','Quiver (40)','Quiver (50)'], imgKey:'quiver'},
  {name:'Bomb Bag', shift:3, mask:7, vals:['—','Bomb Bag (20)','Bomb Bag (30)','Bomb Bag (40)'], imgKey:'bomb_bag'},
  {name:'Strength', shift:6, mask:7, vals:['—',"Goron's Bracelet",'Silver Gauntlets','Golden Gauntlets'], imgKey:'gauntlets'},
  {name:'Scale', shift:9, mask:7, vals:['—','Silver Scale','Golden Scale'], imgKey:'scale'},
  {name:'Wallet', shift:12, mask:3, vals:["Child's Wallet (99)","Adult's Wallet (200)","Giant's Wallet (500)","Tycoon's Wallet (999)"], imgKey:null},
  {name:'Bullet Bag', shift:14, mask:7, vals:['—','Bullet Bag (30)','Bullet Bag (40)','Bullet Bag (50)'], imgKey:'bullet_bag'},
  {name:'Sticks', shift:17, mask:7, vals:['—','10 Sticks','20 Sticks','30 Sticks'], imgKey:null},
  {name:'Nuts', shift:20, mask:7, vals:['—','20 Nuts','30 Nuts','40 Nuts'], imgKey:null},
];

// ===== BINARY READERS =====

function u8(d,o){return d[o]}
function s8(d,o){return d[o]>127?d[o]-256:d[o]}
function u16(d,o){return(d[o]<<8)|d[o+1]}
function s16(d,o){const v=(d[o]<<8)|d[o+1];return v>32767?v-65536:v}
function u32(d,o){return((d[o]<<24)|(d[o+1]<<16)|(d[o+2]<<8)|d[o+3])>>>0}
function s32(d,o){return(d[o]<<24)|(d[o+1]<<16)|(d[o+2]<<8)|d[o+3]}
function bit(d,o,b){return(d[o]>>b)&1}

// ===== BYTE ORDER =====

function detectByteOrder(raw) {
  const Z=0x5A,E=0x45,L=0x4C,D=0x44;
  const magicOffsets = [0x3C, 0x148C, 0x28DC];
  for (const o of magicOffsets) {
    if (o+3 >= raw.length) continue;
    if(raw[o]===Z&&raw[o+1]===E&&raw[o+2]===L&&raw[o+3]===D) return 'BE';
    if(raw[o]===D&&raw[o+1]===L&&raw[o+2]===E&&raw[o+3]===Z) return 'LE';
    if(raw[o]===E&&raw[o+1]===Z&&raw[o+2]===D&&raw[o+3]===L) return 'BS';
    if(raw[o]===L&&raw[o+1]===D&&raw[o+2]===Z&&raw[o+3]===E) return 'WS';
  }
  return null;
}

function toBigEndian(raw, order) {
  if (order === 'BE') return new Uint8Array(raw);
  const be = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 4) {
    if (order === 'LE') {
      be[i]=raw[i+3]; be[i+1]=raw[i+2]; be[i+2]=raw[i+1]; be[i+3]=raw[i];
    } else if (order === 'BS') {
      be[i]=raw[i+1]; be[i+1]=raw[i]; be[i+2]=raw[i+3]; be[i+3]=raw[i+2];
    } else {
      be[i]=raw[i+2]; be[i+1]=raw[i+3]; be[i+2]=raw[i]; be[i+3]=raw[i+1];
    }
  }
  return be;
}

// ===== SLOT PARSING =====

function isSlotValid(d) {
  return d[0x1C]===0x5A && d[0x1D]===0x45 && d[0x1E]===0x4C &&
         d[0x1F]===0x44 && d[0x20]===0x41 && d[0x21]===0x5A;
}

function validateSlot(p) {
  const warnings = [];
  if (p.healthCapacity < 48 || p.healthCapacity > 320)
    warnings.push(`Health capacity out of range: ${p.healthCapacity}`);
  if (p.health < 0 || p.health > p.healthCapacity)
    warnings.push(`Current health out of range: ${p.health}`);
  if (p.rupees < 0 || p.rupees > 500)
    warnings.push(`Rupees out of range: ${p.rupees}`);
  if (p.gsTokens < 0 || p.gsTokens > 100)
    warnings.push(`Gold Skulltulas out of range: ${p.gsTokens}`);
  if (p.name === 'LINK' && p.deaths === 0 && p.rupees === 0 && p.healthCapacity === 48)
    warnings.push('Slot may be empty or uninitialized');
  return warnings;
}

function decodeName(nameBytes) {
  let n = '';
  for (const b of nameBytes) {
    if (b === 0 || b === 223 && n.length === 0) continue;
    n += CHARACTER_MAP[b] || '';
  }
  return n.trim() || 'LINK';
}

function readEquips(d, off) {
  const buttons = [];
  for (let i=0;i<4;i++) buttons.push(u8(d,off+i));
  for (let i=0;i<4;i++) buttons.push(255);
  const cslots = [];
  for (let i=0;i<3;i++) cslots.push(u8(d,off+4+i));
  for (let i=0;i<4;i++) cslots.push(255);
  return {buttonItems:buttons, cButtonSlots:cslots, equipment:u16(d,off+8)};
}

function readNote(d, off) {
  return {noteIdx:u8(d,off),unk_01:u8(d,off+1),unk_02:u16(d,off+2),
          volume:u8(d,off+4),vibrato:u8(d,off+5),tone:s8(d,off+6),semitone:u8(d,off+7)};
}

function parseSlotDisplay(d) {
  const nameBytes = []; for(let i=0;i<8;i++) nameBytes.push(u8(d,0x24+i));
  const inv = 0x74;
  const items = []; for(let i=0;i<24;i++) items.push(u8(d,inv+i));
  const ammo = []; for(let i=0;i<16;i++) ammo.push(s8(d,inv+0x18+i));
  const equipment = u16(d, inv+0x28);
  const upgrades = u32(d, inv+0x2C);
  const questItems = u32(d, inv+0x30);
  const gsTokens = s16(d, inv+0x5C);
  const defenseHearts = s8(d, inv+0x5B);
  const equips = readEquips(d, 0x68);

  return {
    name: decodeName(nameBytes),
    linkAge: s32(d,0x04),
    deaths: u16(d,0x22),
    healthCapacity: s16(d,0x2E),
    health: s16(d,0x30),
    magicLevel: s8(d,0x32),
    magic: s8(d,0x33),
    rupees: s16(d,0x34),
    isMagicAcquired: u8(d,0x3A),
    isDoubleDefenseAcquired: u8(d,0x3D),
    items, ammo, equipment, upgrades, questItems, gsTokens, defenseHearts,
    equips,
    // Stones from eventChkInf
    kokiriEmerald: bit(d, 0x0ED5, 7),
    goronsRuby: bit(d, 0x0ED9, 5),
    zorasSapphire: bit(d, 0x0EDB, 7),
  };
}

// ===== SOH JSON → DISPLAY MAPPER =====

function sohDataToDisplay(data) {
  const inv = data.inventory || {};
  const eventChk = data.eventChkInf || [];
  return {
    name: decodeName(data.playerName || []),
    linkAge: data.linkAge || 0,
    deaths: data.deaths || 0,
    healthCapacity: data.healthCapacity || 48,
    health: data.health || 48,
    magicLevel: data.magicLevel || 0,
    magic: data.magic || 0,
    rupees: data.rupees || 0,
    isMagicAcquired: data.isMagicAcquired || data.magicAcquired || 0,
    isDoubleDefenseAcquired: data.isDoubleDefenseAcquired || data.doubleDefense || 0,
    items: inv.items || new Array(24).fill(255),
    ammo: inv.ammo || new Array(16).fill(0),
    equipment: inv.equipment || 0,
    upgrades: inv.upgrades || 0,
    questItems: inv.questItems || 0,
    gsTokens: inv.gsTokens || 0,
    defenseHearts: inv.defenseHearts || 0,
    equips: data.equips || {buttonItems:[255,255,255,255,255,255,255,255], cButtonSlots:[255,255,255,255,255,255,255], equipment:0},
    kokiriEmerald: (eventChk[0] >> 7) & 1,
    goronsRuby: (eventChk[2] >> 5) & 1,
    zorasSapphire: (eventChk[3] >> 7) & 1,
  };
}

function buildSohSaveScreen(result, filename) {
  window._upgradedSave = result.json;
  let h = '<div class="save-screen-inner">';
  if (result.error) {
    h += `<div class="upgrade-error">${result.error}</div>`;
  } else if (result.alreadyCurrent) {
    h += '<div class="upgrade-ok">Version 4 (current)</div>';
    h += `<div class="upgrade-actions"><button class="export-btn" onclick="downloadSohSave('${filename}')">Download .sav</button> <button class="reset-btn" onclick="resetEdits(0)">Reset</button></div>`;
  } else if (result.upgraded) {
    h += `<div class="upgrade-ok">Upgraded from v${result.fromVersion} → v4</div>`;
    h += '<ul class="upgrade-changes">';
    for (const c of result.changes) h += `<li>${c}</li>`;
    h += '</ul>';
    h += `<div class="upgrade-actions"><button class="export-btn" onclick="downloadSohSave('${filename}')">Download .sav</button> <button class="reset-btn" onclick="resetEdits(0)">Reset</button></div>`;
  }
  h += '</div>';
  return h;
}

function renderSohSlot(data, filename, result) {
  const container = document.getElementById('slots');
  const p = sohDataToDisplay(data);
  slotParsed[0] = p;
  slotOriginal[0] = JSON.parse(JSON.stringify(p));
  slotValidity[0] = true;
  const age = p.linkAge === 1 ? 'Child' : 'Adult';

  let html = '';

  // Slot bar
  html += `<div class="slot-bar active" style="background-image:url('images/backgrounds/file1.png')">`;
  html += `<span class="slot-file-label">File</span>`;
  html += `<div class="slot-bar-content"><span class="slot-name">${p.name}</span><span class="slot-badge">${age}</span></div>`;
  html += '</div>';

  // Validation warnings
  const warnings = validateSlot(p);
  if (warnings.length) {
    html += `<div class="slot-warning">${warnings.join(' | ')}</div>`;
  }

  // Panel
  html += '<div class="slot-panel visible" data-slot="0">';

  // Summary
  html += `<div class="slot-summary-bg"><div class="slot-summary">`;
  html += `<div class="slot-stats">
    <div class="stat"><img src="images/ui/rupee.png">${p.rupees}</div>
    <div class="stat"><img src="images/ui/skull.png">${p.deaths}</div>
    <div class="stat"><img src="images/quest/gold_skulltula.png">${p.gsTokens}</div>
  </div>`;
  html += `<div class="slot-hearts">${buildHeartsHtml(p)}<div class="slot-quest">${buildQuestHtml(p)}</div></div>`;
  html += '</div></div>';

  // Pause screens
  html += '<div class="pause-wrap">';
  html += '<div class="pause-tabs">';
  for (const tab of PAUSE_TABS) {
    html += `<div class="pause-tab${tab.key==='items'?' active':''}" data-tab="${tab.key}" onclick="switchTab(0,'${tab.key}')">${tab.label}</div>`;
  }
  html += '</div>';

  const screens = {
    items: buildItemsScreen(p, 0),
    equip: buildEquipScreen(p, 0),
    quest: buildQuestScreen(p, 0),
    save: buildSohSaveScreen(result, filename),
  };

  for (const tab of PAUSE_TABS) {
    html += `<div class="pause-screen${tab.key==='items'?' visible':''}" data-screen="${tab.key}">`;
    html += `<div class="pause-bg-wrap">`;
    html += `<img class="pause-bg" src="images/${tab.bg}" alt="">`;
    html += `<div class="pause-content ${tab.key}-content">${screens[tab.key]}</div>`;
    html += `</div>`;
    if (tab.key !== 'save') {
      html += `<div class="pause-namebar"><span data-namebar="0-${tab.key}"></span></div>`;
    }
    html += `</div>`;
  }

  html += '</div>'; // pause-wrap
  html += '</div>'; // slot-panel

  container.innerHTML = html;
  initNamebarHovers();
}

// ===== SOH JSON GENERATION =====

function generateSohJson(d) {
  const inv = 0x74;
  const items = []; for(let i=0;i<24;i++) items.push(u8(d,inv+i));
  const ammo = []; for(let i=0;i<16;i++) ammo.push(s8(d,inv+0x18+i));
  const dungeonItems = []; for(let i=0;i<20;i++) dungeonItems.push(u8(d,inv+0x34+i));
  const dungeonKeys = []; for(let i=0;i<19;i++) dungeonKeys.push(s8(d,inv+0x48+i));

  const sceneFlags = [];
  for (let i=0;i<124;i++) {
    const o = 0xD4 + i*0x1C;
    sceneFlags.push({chest:s32(d,o),swch:s32(d,o+4),clear:s32(d,o+8),
      collect:s32(d,o+0xC),unk:s32(d,o+0x10),rooms:s32(d,o+0x14),floors:s32(d,o+0x18)});
  }

  const fw_off = 0xE64;
  const fw = {
    pos:{x:s32(d,fw_off),y:s32(d,fw_off+4),z:s32(d,fw_off+8)},
    yaw:s32(d,fw_off+12),playerParams:s32(d,fw_off+16),entranceIndex:s32(d,fw_off+20),
    roomIndex:s32(d,fw_off+24),set:s32(d,fw_off+28),tempSwchFlags:s32(d,fw_off+32),
    tempCollectFlags:s32(d,fw_off+36)
  };

  const gsFlags=[]; for(let i=0;i<6;i++) gsFlags.push(s32(d,0xE9C+i*4));
  const highScores=[]; for(let i=0;i<7;i++) highScores.push(s32(d,0xEB8+i*4));
  const eventChkInf=[]; for(let i=0;i<14;i++) eventChkInf.push(u16(d,0xED4+i*2));
  const itemGetInf=[]; for(let i=0;i<4;i++) itemGetInf.push(u16(d,0xEF0+i*2));
  const infTable=[]; for(let i=0;i<30;i++) infTable.push(u16(d,0xEF8+i*2));

  const scarecrowLong=[]; for(let i=0;i<108;i++) scarecrowLong.push(readNote(d,0xF41+i*8));
  const scarecrowSpawn=[]; for(let i=0;i<16;i++) scarecrowSpawn.push(readNote(d,0x12C6+i*8));

  const playerName=[]; for(let i=0;i<8;i++) playerName.push(u8(d,0x24+i));

  const saveData = {
    entranceIndex:s32(d,0x00), linkAge:s32(d,0x04), cutsceneIndex:s32(d,0x08),
    dayTime:u16(d,0x0C), nightFlag:s32(d,0x10), totalDays:s32(d,0x14), bgsDayCount:s32(d,0x18),
    deaths:u16(d,0x22), playerName,
    healthCapacity:s16(d,0x2E), health:s16(d,0x30), magicLevel:s8(d,0x32), magic:s8(d,0x33),
    rupees:s16(d,0x34), swordHealth:u16(d,0x36), naviTimer:u16(d,0x38),
    isMagicAcquired:u8(d,0x3A), isDoubleMagicAcquired:u8(d,0x3C),
    isDoubleDefenseAcquired:u8(d,0x3D), bgsFlag:u8(d,0x3E), ocarinaGameRoundNum:u8(d,0x3F),
    childEquips:readEquips(d,0x40), adultEquips:readEquips(d,0x4A),
    unk_54:u32(d,0x54), savedSceneNum:s16(d,0x66), equips:readEquips(d,0x68),
    inventory:{items,ammo,equipment:u16(d,inv+0x28),upgrades:u32(d,inv+0x2C),
      questItems:u32(d,inv+0x30),dungeonItems,dungeonKeys,
      defenseHearts:s8(d,inv+0x5B),gsTokens:s16(d,inv+0x5C)},
    sceneFlags, fw, gsFlags, highScores, eventChkInf, itemGetInf, infTable,
    worldMapAreaData:u32(d,0xF38),
    scarecrowLongSongSet:u8(d,0xF40), scarecrowLongSong:scarecrowLong,
    scarecrowSpawnSongSet:u8(d,0x12C5), scarecrowSpawnSong:scarecrowSpawn,
    horseData:{scene:s16(d,0x1348),pos:{x:s16(d,0x134A),y:s16(d,0x134C),z:s16(d,0x134E)},angle:s16(d,0x1350)},
    randomizerInf:new Array(179).fill(0), isMasterQuest:false,
    backupFW:{pos:{x:0,y:0,z:0},yaw:0,playerParams:0,entranceIndex:0,roomIndex:0,set:0,tempSwchFlags:0,tempCollectFlags:0},
    dogParams:0, filenameLanguage:2, maskMemory:0
  };

  return {
    fileType:0, version:1,
    sections:{
      base:{data:saveData, version:4},
      itemTrackerData:{data:{personalNotes:""}, version:1},
      sohStats:{data:{
        buildVersion:"Ackbar Delta (9.2.3)",buildVersionMajor:9,buildVersionMinor:2,buildVersionPatch:3,
        counts:new Array(100).fill(0),dungeonKeys:new Array(20).fill(0),
        entrancesDiscovered:new Array(66).fill(0),fileCreatedAt:0,firstInput:0,
        heartContainers:0,heartPieces:0,itemTimestamps:new Array(200).fill(0),
        pauseTimer:0,playTimer:0,rtaTiming:false,sceneTimestamps:[],
        scenesDiscovered:new Array(4).fill(0),tsIdx:0
      },version:1},
      trackerData:{data:{areasSpoiled:4294967295,checkStatus:[]},version:1}
    }
  };
}

// ===== ITEM IMAGE MAP =====

const ITEM_IMAGES = {
  0:'item_deku_stick',1:'item_deku_nut',2:'item_bomb',3:'item_bow',
  4:'item_fire_arrow',5:'item_dins_fire',6:'item_slingshot',7:'item_fairy_ocarina',
  8:'item_ocarina_of_time',9:'item_bombchu',10:'item_hookshot',11:'item_longshot',
  12:'item_ice_arrow',13:'item_farores_wind',14:'item_boomerang',15:'item_lens_of_truth',
  16:'item_magic_bean',17:'item_megaton_hammer',18:'item_light_arrow',19:'item_nayrus_love',
  20:'item_bottle_empty',21:'item_red_potion',22:'item_green_potion',23:'item_blue_potion',
  24:'item_fairy',25:'item_fish',26:'item_milk',27:'item_rutos_letter',
  28:'item_blue_fire',29:'item_bug',30:'item_big_poe',31:'item_half_milk',
  32:'item_poe',33:'item_weird_egg',34:'item_chicken',35:'item_zeldas_letter',
  36:'item_keaton_mask',37:'item_skull_mask',38:'item_spooky_mask',39:'item_bunny_hood',
  40:'item_goron_mask',41:'item_zora_mask',42:'item_gerudo_mask',43:'item_mask_of_truth',
  45:'item_pocket_egg',46:'item_pocket_cucco',47:'item_cojiro',48:'item_odd_mushroom',
  49:'item_odd_potion',50:'item_poachers_saw',51:'item_broken_sword',52:'item_prescription',
  53:'item_eyeball_frog',54:'item_eye_drops',55:'item_claim_check'
};

const EQUIP_IMAGES = [
  ['equip_kokiri_sword','equip_master_sword','equip_biggoron_sword'],
  ['equip_deku_shield','equip_hylian_shield','equip_mirror_shield'],
  ['equip_kokiri_tunic','equip_goron_tunic','equip_zora_tunic'],
  ['equip_kokiri_boots','equip_iron_boots','equip_hover_boots'],
];

const PAUSE_TABS = [
  {key:'items', label:'Items', bg:'backgrounds/pause_items.png'},
  {key:'equip', label:'Equipment', bg:'backgrounds/pause_equip.png'},
  {key:'quest', label:'Quest', bg:'backgrounds/pause_quest.png'},
  {key:'save', label:'Save', bg:'backgrounds/pause_save.png'},
];

// ===== UI RENDERING =====

let currentBE = null;
let slotValidity = [false, false, false];
let slotParsed = [null, null, null];
let slotOriginal = [null, null, null];

function switchTab(slotIdx, tabKey) {
  const panel = document.querySelector(`.slot-panel[data-slot="${slotIdx}"]`);
  if (!panel) return;
  panel.querySelectorAll('.pause-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabKey));
  panel.querySelectorAll('.pause-screen').forEach(s => s.classList.toggle('visible', s.dataset.screen === tabKey));
}

function toggleSlot(slotIdx) {
  const bar = document.querySelector(`.slot-bar[data-slot="${slotIdx}"]`);
  const panel = document.querySelector(`.slot-panel[data-slot="${slotIdx}"]`);
  if (!bar || !panel) return;
  const wasActive = bar.classList.contains('active');
  document.querySelectorAll('.slot-bar').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.slot-panel').forEach(p => p.classList.remove('visible'));
  if (!wasActive) {
    bar.classList.add('active');
    panel.classList.add('visible');
  }
}

function buildHeartsHtml(p) {
  const heartContainers = Math.max(3, Math.floor(p.healthCapacity / 16));
  const heartImg = p.defenseHearts > 0 ? 'icon_heart_defense.png' : 'icon_heart.png';
  const heartsTop = Math.min(heartContainers, 10);
  const heartsBot = Math.max(0, heartContainers - 10);

  let h = '<div class="hearts-row">';
  for (let i = 0; i < heartsTop; i++) h += `<img src="images/ui/${heartImg}" alt="♥">`;
  for (let i = 0; i < 10 - heartsTop; i++) h += `<img src="images/ui/icon_heart.png" class="empty-heart" alt="♡">`;
  h += '</div><div class="hearts-row">';
  for (let i = 0; i < heartsBot; i++) h += `<img src="images/ui/${heartImg}" alt="♥">`;
  for (let i = 0; i < 10 - heartsBot; i++) h += `<img src="images/ui/icon_heart.png" class="empty-heart" alt="♡">`;
  h += '</div>';
  return h;
}

function buildQuestHtml(p) {
  let h = '';
  const stones = [
    {name:"Kokiri's Emerald", img:'kokiris_emerald.png', has:p.kokiriEmerald},
    {name:"Goron's Ruby", img:'gorons_ruby.png', has:p.goronsRuby},
    {name:"Zora's Sapphire", img:'zoras_sapphire.png', has:p.zorasSapphire},
  ];
  for (const st of stones) {
    h += `<img class="quest-icon${st.has?'':' off'}" src="images/quest/${st.img}" title="${st.name}">`;
  }
  const medalNames = ['forest','fire','water','spirit','shadow','light'];
  for (let m = 0; m < 6; m++) {
    const has = (p.questItems >> m) & 1;
    h += `<img class="quest-icon${has?'':' off'}" src="images/quest/icon_${medalNames[m]}.png" title="${medalNames[m][0].toUpperCase()+medalNames[m].slice(1)} Medallion">`;
  }
  return h;
}

function buildItemsScreen(p, slotIdx) {
  const orig = slotOriginal[slotIdx];

  let h = `<button class="edit-toggle-btn" onclick="event.stopPropagation();openItemsEdit(${slotIdx})" title="Edit items">✎</button>`;
  h += '<div class="items-grid">';
  for (let j = 0; j < 24; j++) {
    const itemId = p.items[j];
    const origId = orig ? orig.items[j] : itemId;
    const isAdded = itemId !== 255 && origId === 255;
    const wasRemoved = origId !== 255 && itemId === 255;

    if (wasRemoved) {
      const name = ITEM_NAMES[origId] || `Item(${origId})`;
      const img = ITEM_IMAGES[origId];
      h += `<div class="item-cell has-item toggled-off" data-name="${name} (removed)" title="${name} (removed)">`;
      if (img) h += `<img class="item-icon" src="images/items/${img}.png" alt="${name}">`;
      else h += `<div class="item-icon-empty"></div>`;
      h += '</div>';
    } else if (itemId === 255) {
      h += `<div class="item-cell empty" data-name="${SLOT_LABELS[j]}" title="${SLOT_LABELS[j]}"><div class="item-icon-empty"></div></div>`;
    } else {
      const name = ITEM_NAMES[itemId] || `Item(${itemId})`;
      const img = ITEM_IMAGES[itemId];
      const ammo = AMMO_SLOTS.has(j) && p.ammo[j] > 0 ? `<span class="item-ammo">${p.ammo[j]}</span>` : '';
      h += `<div class="item-cell has-item${isAdded?' item-added':''}" data-name="${name}" title="${name}">`;
      if (img) h += `<img class="item-icon" src="images/items/${img}.png" alt="${name}">`;
      else h += `<div class="item-icon-empty"></div>`;
      h += `${ammo}</div>`;
    }
  }
  h += '</div>';

  h += buildItemsEditPanel(p, slotIdx);
  return h;
}

function buildEquipScreen(p, slotIdx) {
  const orig = slotOriginal[slotIdx];
  const upgs = [];
  for (const up of UPGRADE_DEFS) {
    const val = (p.upgrades >> up.shift) & up.mask;
    const origVal = orig ? (orig.upgrades >> up.shift) & up.mask : val;
    if (val > 0) {
      const added = val !== origVal;
      const label = val < up.vals.length ? up.vals[val] : `${up.name} (${val})`;
      const imgKey = up.imgKey;
      if (imgKey && val < up.vals.length) upgs.push({title:label, img:`upg_${imgKey}${val}.png`, added});
      else upgs.push({title:label, text:label, added});
    }
  }
  if (p.isMagicAcquired) {
    upgs.push({title:`Magic: ${p.magic} / ${p.magicLevel === 2 ? 96 : 48}`, img:'upg_scale1.png', isMagic:true, added:false});
  }

  let h = `<button class="edit-toggle-btn" onclick="event.stopPropagation();openEquipEdit(${slotIdx})" title="Edit equipment">✎</button>`;
  h += '<div class="equip-layout">';

  // Left: upgrades column
  h += '<div class="equip-upgrades">';
  for (let row = 0; row < 4; row++) {
    if (row < upgs.length) {
      const u = upgs[row];
      h += `<div class="eq-cell eq-owned${u.added?' eq-added':''}" data-name="${u.title}" title="${u.title}">`;
      if (u.img && !u.isMagic) h += `<img class="eq-icon" src="images/upgrades/${u.img}" alt="${u.title}">`;
      else if (u.isMagic) h += `<img class="eq-icon" src="images/upgrades/upg_scale1.png" alt="Magic" style="filter:hue-rotate(200deg)">`;
      else h += `<span class="upg-text">${u.text}</span>`;
      h += '</div>';
    } else {
      h += '<div class="eq-cell eq-empty" data-name=""></div>';
    }
  }
  h += '</div>';

  // Center: Link's space
  h += '<div class="equip-spacer"></div>';

  // Right: equipment grid
  h += '<div class="equip-grid">';
  for (let row = 0; row < 4; row++) {
    const cat = EQUIP_CATS[row];
    const equipped = (p.equips.equipment >> cat.bits[0]) & 0xF;
    for (let j = 0; j < 3; j++) {
      const owned = (p.equipment >> cat.bits[j]) & 1;
      const origOwned = orig ? (orig.equipment >> cat.bits[j]) & 1 : owned;
      const isEquipped = owned && (equipped === j + 1);
      const isAdded = owned && !origOwned;
      const cls = isEquipped ? 'eq-equipped' : owned ? 'eq-owned' : 'eq-empty';
      const img = EQUIP_IMAGES[row][j];
      h += `<div class="eq-cell ${cls}${isAdded?' eq-added':''}" data-name="${cat.items[j]}" title="${cat.items[j]}">`;
      if (owned) h += `<img class="eq-icon" src="images/equipment/${img}.png" alt="${cat.items[j]}">`;
      h += '</div>';
    }
  }
  h += '</div>';

  h += '</div>';

  // Edit panel (hidden)
  h += buildEquipEditPanel(p, slotIdx);

  return h;
}

function buildEquipEditPanel(p, slotIdx) {
  const orig = slotOriginal[slotIdx];
  let h = `<div class="edit-panel" id="equipEditPanel${slotIdx}" style="display:none">`;
  h += '<div class="edit-panel-header"><span>Edit Equipment</span>';
  h += `<button class="edit-panel-close" onclick="event.stopPropagation();closeEquipEdit(${slotIdx})">✕</button></div>`;
  h += '<div class="edit-panel-body">';

  // Equipment categories
  for (let row = 0; row < 4; row++) {
    const cat = EQUIP_CATS[row];
    h += `<div class="edit-category"><div class="edit-cat-title">${cat.name}</div>`;
    for (let j = 0; j < 3; j++) {
      const owned = (p.equipment >> cat.bits[j]) & 1;
      const wasOriginal = orig ? (orig.equipment >> cat.bits[j]) & 1 : owned;
      const isAdded = owned && !wasOriginal;
      const img = EQUIP_IMAGES[row][j];
      h += `<label class="edit-item${isAdded ? ' edit-added' : ''}" onclick="event.stopPropagation()">`;
      h += `<input type="checkbox" ${owned ? 'checked' : ''} onchange="toggleEquipItem(${slotIdx},${cat.bits[j]})">`;
      h += `<img class="edit-item-icon" src="images/equipment/${img}.png">`;
      h += `<span class="edit-item-name">${cat.items[j]}</span>`;
      if (wasOriginal && owned) h += '<span class="edit-badge edit-badge-orig">save</span>';
      if (isAdded) h += '<span class="edit-badge edit-badge-new">new</span>';
      h += '</label>';
    }
    h += '</div>';
  }

  // Upgrades
  for (const up of UPGRADE_DEFS) {
    const val = (p.upgrades >> up.shift) & up.mask;
    const origVal = orig ? (orig.upgrades >> up.shift) & up.mask : val;
    h += `<div class="edit-category"><div class="edit-cat-title">${up.name}</div>`;
    const maxV = Math.max(up.vals.length, val + 1);
    for (let v = 0; v < maxV; v++) {
      const label = v < up.vals.length ? up.vals[v] : `${up.name} (Level ${v})`;
      const isChanged = v === val && v !== origVal;
      h += `<label class="edit-radio${isChanged ? ' edit-added' : ''}" onclick="event.stopPropagation()">`;
      h += `<input type="radio" name="upg_${slotIdx}_${up.shift}" value="${v}" ${v === val ? 'checked' : ''} onchange="setUpgrade(${slotIdx},${up.shift},${v})">`;
      h += `<span>${label}</span>`;
      h += '</label>';
    }
    h += '</div>';
  }

  h += '</div></div>';
  return h;
}

function buildQuestScreen(p, slotIdx) {
  const orig = slotOriginal[slotIdx];

  let h = `<button class="edit-toggle-btn" onclick="event.stopPropagation();openQuestEdit(${slotIdx})" title="Edit quest">✎</button>`;
  h += '<div class="quest-layout">';

  // === Top-left: quest items (2x2: agony, gerudo, skulltula+count) ===
  const hasAgony = (p.questItems >> 21) & 1;
  const hasGerudo = (p.questItems >> 22) & 1;
  const heartPieces = (p.questItems >>> 28) & 0xF;
  h += '<div class="quest-items-area">';
  h += `<div class="qi-cell${hasAgony?'':' qi-off'}" data-name="Stone of Agony" title="Stone of Agony"><img class="qi-img" src="images/quest/quest_stone_agony.webp"></div>`;
  h += `<div class="qi-cell${hasGerudo?'':' qi-off'}" data-name="Gerudo Card" title="Gerudo Card"><img class="qi-img" src="images/quest/quest_gerudo_card.webp"></div>`;
  h += `<div class="qi-cell" data-name="Gold Skulltulas: ${p.gsTokens}" title="Gold Skulltulas: ${p.gsTokens}"><img class="qi-skull-img" src="images/quest/gold_skulltula.png"></div>`;
  h += `<div class="qi-cell qi-count" data-name="Gold Skulltulas: ${p.gsTokens}" title="Gold Skulltulas: ${p.gsTokens}"><span class="qi-skull-count">${p.gsTokens}</span></div>`;
  h += '</div>';

  // === Heart pieces (2x2 grid) ===
  h += '<div class="quest-hearts-area">';
  h += `<div class="qhp${heartPieces>=1?'':' qi-off'}" data-name="Heart Piece 1/4" title="Heart Piece 1/4"><img src="images/quest/h_tl.png"></div>`;
  h += '<div class="qhp qi-off"></div>';
  h += `<div class="qhp${heartPieces>=2?'':' qi-off'}" data-name="Heart Piece 2/4" title="Heart Piece 2/4"><img src="images/quest/h_bl.png"></div>`;
  h += `<div class="qhp${heartPieces>=3?'':' qi-off'}" data-name="Heart Piece 3/4" title="Heart Piece 3/4"><img src="images/quest/h_br.png"></div>`;
  h += '</div>';

  // === Top-right: medallions ===
  const medalNames = ['light','forest','fire','water','spirit','shadow'];
  const medalLabels = ['Light Medallion','Forest Medallion','Fire Medallion','Water Medallion','Spirit Medallion','Shadow Medallion'];
  const medalBits = [5,0,1,2,3,4];
  h += '<div class="quest-medallions">';
  for (let m = 0; m < 6; m++) {
    const has = (p.questItems >> medalBits[m]) & 1;
    h += `<div class="qm qm-${medalNames[m]}${has?'':' qi-off'}" data-name="${medalLabels[m]}" title="${medalLabels[m]}">`;
    h += `<img src="images/quest/icon_${medalNames[m]}.png">`;
    h += '</div>';
  }
  h += '</div>';

  // === Bottom-left: songs grid ===
  h += '<div class="quest-songs">';
  for (const song of SONGS) {
    const has = (p.questItems >> song.bit) & 1;
    h += `<div class="qs${has?' qs-on':''}" data-name="${song.name}" title="${song.name}">`;
    if (has) {
      h += `<img class="qs-note" src="images/quest/${song.img}" alt="${song.name}">`;
    }
    h += '</div>';
  }
  h += '</div>';

  // === Bottom-right: spiritual stones ===
  const stones = [
    {name:'Kokiri Emerald', img:'kokiris_emerald.png', has:p.kokiriEmerald, key:'kokiriEmerald'},
    {name:"Goron's Ruby", img:'gorons_ruby.png', has:p.goronsRuby, key:'goronsRuby'},
    {name:"Zora's Sapphire", img:'zoras_sapphire.png', has:p.zorasSapphire, key:'zorasSapphire'},
  ];
  h += '<div class="quest-stones">';
  for (const st of stones) {
    h += `<div class="qst${st.has?'':' qst-off'}" data-name="${st.name}" title="${st.name}">`;
    h += `<img src="images/quest/${st.img}">`;
    h += '</div>';
  }
  h += '</div>';

  h += '</div>';

  h += buildQuestEditPanel(p, slotIdx);
  return h;
}

function buildQuestEditPanel(p, slotIdx) {
  const orig = slotOriginal[slotIdx];
  const hasAgony = (p.questItems >> 21) & 1;
  const hasGerudo = (p.questItems >> 22) & 1;
  const heartPieces = (p.questItems >>> 28) & 0xF;

  let h = `<div class="edit-panel" id="questEditPanel${slotIdx}" style="display:none">`;
  h += '<div class="edit-panel-header"><span>Edit Quest</span>';
  h += `<button class="edit-panel-close" onclick="event.stopPropagation();closeQuestEdit(${slotIdx})">✕</button></div>`;
  h += '<div class="edit-panel-body">';

  // Quest items
  h += '<div class="edit-category"><div class="edit-cat-title">Quest Items</div>';
  h += `<label class="edit-item" onclick="event.stopPropagation()"><input type="checkbox" ${hasAgony?'checked':''} onchange="setQuestBit(${slotIdx},21,this.checked?1:0)"><img class="edit-item-icon" src="images/quest/quest_stone_agony.webp"><span class="edit-item-name">Stone of Agony</span></label>`;
  h += `<label class="edit-item" onclick="event.stopPropagation()"><input type="checkbox" ${hasGerudo?'checked':''} onchange="setQuestBit(${slotIdx},22,this.checked?1:0)"><img class="edit-item-icon" src="images/quest/quest_gerudo_card.webp"><span class="edit-item-name">Gerudo Card</span></label>`;
  h += '</div>';

  // Gold Skulltulas
  h += '<div class="edit-category"><div class="edit-cat-title">Gold Skulltulas</div>';
  h += `<label class="edit-item" onclick="event.stopPropagation()"><img class="edit-item-icon" src="images/quest/gold_skulltula.png"><input type="number" class="edit-ammo" min="0" max="100" value="${p.gsTokens}" onchange="setGsTokens(${slotIdx},parseInt(this.value)||0)"></label>`;
  h += '</div>';

  // Heart pieces
  h += '<div class="edit-category"><div class="edit-cat-title">Heart Pieces</div>';
  for (let v = 0; v < 4; v++) {
    h += `<label class="edit-radio" onclick="event.stopPropagation()"><input type="radio" name="hp_${slotIdx}" value="${v}" ${v===heartPieces?'checked':''} onchange="setHeartPieces(${slotIdx},${v})"><span>${v === 0 ? 'None' : v + '/4'}</span></label>`;
  }
  h += '</div>';

  // Medallions
  const medalNames = ['Light','Forest','Fire','Water','Spirit','Shadow'];
  const medalBits = [5,0,1,2,3,4];
  h += '<div class="edit-category"><div class="edit-cat-title">Medallions</div>';
  for (let m = 0; m < 6; m++) {
    const has = (p.questItems >> medalBits[m]) & 1;
    const origHas = orig ? (orig.questItems >> medalBits[m]) & 1 : has;
    const isAdded = has && !origHas;
    h += `<label class="edit-item${isAdded?' edit-added':''}" onclick="event.stopPropagation()">`;
    h += `<input type="checkbox" ${has?'checked':''} onchange="setQuestBit(${slotIdx},${medalBits[m]},this.checked?1:0)">`;
    h += `<img class="edit-item-icon" src="images/quest/icon_${medalNames[m].toLowerCase()}.png">`;
    h += `<span class="edit-item-name">${medalNames[m]} Medallion</span>`;
    if (origHas && has) h += '<span class="edit-badge edit-badge-orig">save</span>';
    if (isAdded) h += '<span class="edit-badge edit-badge-new">new</span>';
    h += '</label>';
  }
  h += '</div>';

  // Songs
  h += '<div class="edit-category"><div class="edit-cat-title">Songs</div>';
  for (const song of SONGS) {
    const has = (p.questItems >> song.bit) & 1;
    const origHas = orig ? (orig.questItems >> song.bit) & 1 : has;
    const isAdded = has && !origHas;
    h += `<label class="edit-item${isAdded?' edit-added':''}" onclick="event.stopPropagation()">`;
    h += `<input type="checkbox" ${has?'checked':''} onchange="setQuestBit(${slotIdx},${song.bit},this.checked?1:0)">`;
    h += `<img class="edit-item-icon" src="images/quest/${song.img}" style="image-rendering:pixelated">`;
    h += `<span class="edit-item-name">${song.name}</span>`;
    if (origHas && has) h += '<span class="edit-badge edit-badge-orig">save</span>';
    if (isAdded) h += '<span class="edit-badge edit-badge-new">new</span>';
    h += '</label>';
  }
  h += '</div>';

  // Spiritual stones
  const stones = [
    {name:'Kokiri Emerald', img:'kokiris_emerald.png', key:'kokiriEmerald'},
    {name:"Goron's Ruby", img:'gorons_ruby.png', key:'goronsRuby'},
    {name:"Zora's Sapphire", img:'zoras_sapphire.png', key:'zorasSapphire'},
  ];
  h += '<div class="edit-category"><div class="edit-cat-title">Spiritual Stones</div>';
  for (const st of stones) {
    const has = p[st.key];
    const origHas = orig ? orig[st.key] : has;
    const isAdded = has && !origHas;
    h += `<label class="edit-item${isAdded?' edit-added':''}" onclick="event.stopPropagation()">`;
    h += `<input type="checkbox" ${has?'checked':''} onchange="setStone(${slotIdx},'${st.key}',this.checked?1:0)">`;
    h += `<img class="edit-item-icon" src="images/quest/${st.img}">`;
    h += `<span class="edit-item-name">${st.name}</span>`;
    if (origHas && has) h += '<span class="edit-badge edit-badge-orig">save</span>';
    if (isAdded) h += '<span class="edit-badge edit-badge-new">new</span>';
    h += '</label>';
  }
  h += '</div>';

  h += '</div></div>';
  return h;
}

function encodeName(str) {
  const bytes = [];
  for (let i = 0; i < 8; i++) {
    if (i < str.length && str[i] !== ' ') {
      const ch = str[i];
      bytes.push(REVERSE_CHARACTER_MAP[ch] !== undefined ? REVERSE_CHARACTER_MAP[ch] : 223);
    } else {
      bytes.push(223); // 0xDF = space/terminator in OoT charset
    }
  }
  return bytes;
}

function buildSaveScreen(i, p) {
  const maxHearts = Math.floor(p.healthCapacity / 16);
  let h = '<div class="save-screen-inner">';

  // Edit fields
  h += '<div class="save-edit">';
  h += '<div class="save-edit-title">Edit before export</div>';
  h += '<div class="save-edit-fields">';
  h += `<label>Name <input class="save-field" id="editName${i}" type="text" maxlength="8" value="${p.name}" onclick="event.stopPropagation()"></label>`;
  h += `<label>Rupees <input class="save-field" id="editRupees${i}" type="number" min="0" max="500" value="${p.rupees}" onclick="event.stopPropagation()"></label>`;
  h += `<label>Hearts <input class="save-field" id="editHearts${i}" type="number" min="3" max="20" value="${maxHearts}" onclick="event.stopPropagation()"></label>`;
  h += '</div></div>';

  // Export checkboxes
  h += '<div class="save-export">';
  h += '<div class="save-export-slots">';
  for (let s = 0; s < 3; s++) {
    const valid = slotValidity[s];
    const checked = s === i ? ' checked' : '';
    const disabled = valid ? '' : ' disabled';
    const label = valid ? `File ${s+1} — ${slotParsed[s].name}` : `File ${s+1} — Empty`;
    h += `<label class="save-slot-check${valid?'':' disabled'}">`;
    h += `<input type="checkbox" id="exportCheck${i}_${s}"${checked}${disabled} onclick="event.stopPropagation()"> ${label}`;
    h += `</label>`;
  }
  h += '</div>';

  // Filename + buttons
  h += '<div class="save-export-actions">';
  h += `<input class="export-input" id="exportName${i}" value="file" placeholder="prefix" onclick="event.stopPropagation()">`;
  h += `<button class="export-btn" onclick="event.stopPropagation();exportChecked(${i})">Export .sav</button>`;
  h += `<button class="preview-btn" onclick="event.stopPropagation();previewSlot(${i})">Preview</button>`;
  h += `<button class="reset-btn" onclick="event.stopPropagation();resetEdits(${i})">Reset</button>`;
  h += '</div>';
  h += '<span class="export-hint">Exports as prefix1.sav, prefix2.sav, etc.</span>';
  h += '</div>';

  h += '</div>';
  return h;
}

function renderSlots(be) {
  currentBE = be;
  const container = document.getElementById('slots');
  let html = '';

  // First pass: determine validity and parse all slots
  for (let i = 0; i < 3; i++) {
    const offset = SLOT_OFFSETS[i];
    const slotData = be.slice(offset, offset + SLOT_SIZE);
    slotValidity[i] = isSlotValid(slotData);
    slotParsed[i] = slotValidity[i] ? parseSlotDisplay(slotData) : null;
    slotOriginal[i] = slotParsed[i] ? JSON.parse(JSON.stringify(slotParsed[i])) : null;
  }

  for (let i = 0; i < 3; i++) {
    const offset = SLOT_OFFSETS[i];
    const slotData = be.slice(offset, offset + SLOT_SIZE);
    const valid = slotValidity[i];

    // Slot bar (always shown)
    html += `<div class="slot-bar${valid?'':' empty'}" data-slot="${i}" style="background-image:url('images/backgrounds/file${i+1}.png')" onclick="toggleSlot(${i})">`;
    html += `<span class="slot-file-label">File ${i+1}</span>`;
    if (valid) {
      const p = slotParsed[i];
      const age = p.linkAge === 1 ? 'Child' : 'Adult';
      html += `<div class="slot-bar-content"><span class="slot-name">${p.name}</span><span class="slot-badge">${age}</span></div>`;
    }
    html += '</div>';

    // Validation warnings
    if (valid) {
      const warnings = validateSlot(slotParsed[i]);
      if (warnings.length) {
        html += `<div class="slot-warning">⚠ ${warnings.join(' | ')}</div>`;
      }
    }

    if (!valid) {
      html += `<div class="slot-panel" data-slot="${i}">`;
      html += `<div class="slot-summary-bg"><div class="slot-summary">`;
      html += `<div class="slot-stats">
        <div class="stat"><img src="images/ui/rupee.png">0</div>
        <div class="stat"><img src="images/ui/skull.png">0</div>
        <div class="stat"><img src="images/quest/gold_skulltula.png">0</div>
      </div>`;
      html += `<div class="slot-hearts">`;
      html += `<div class="hearts-row">`;
      for (let h = 0; h < 3; h++) html += `<img src="images/ui/icon_heart.png" alt="♥">`;
      for (let h = 0; h < 7; h++) html += `<img src="images/ui/icon_heart.png" class="empty-heart" alt="♡">`;
      html += `</div><div class="hearts-row">`;
      for (let h = 0; h < 10; h++) html += `<img src="images/ui/icon_heart.png" class="empty-heart" alt="♡">`;
      html += `</div></div>`;
      html += `</div></div>`;
      html += `</div>`;
      continue;
    }

    const p = slotParsed[i];

    // Panel (hidden until bar clicked)
    html += `<div class="slot-panel" data-slot="${i}">`;

    // Summary row with file_details.png background
    html += `<div class="slot-summary-bg"><div class="slot-summary">`;
    html += `<div class="slot-stats">
      <div class="stat"><img src="images/ui/rupee.png">${p.rupees}</div>
      <div class="stat"><img src="images/ui/skull.png">${p.deaths}</div>
      <div class="stat"><img src="images/quest/gold_skulltula.png">${p.gsTokens}</div>
    </div>`;
    html += `<div class="slot-hearts">${buildHeartsHtml(p)}<div class="slot-quest">${buildQuestHtml(p)}</div></div>`;
    html += '</div></div>';

    // Pause menu tabs + screens wrapped for max-width
    html += '<div class="pause-wrap">';
    html += '<div class="pause-tabs">';
    for (const tab of PAUSE_TABS) {
      html += `<div class="pause-tab${tab.key==='items'?' active':''}" data-tab="${tab.key}" onclick="switchTab(${i},'${tab.key}')">${tab.label}</div>`;
    }
    html += '</div>';

    const screens = {
      items: buildItemsScreen(p, i),
      equip: buildEquipScreen(p, i),
      quest: buildQuestScreen(p, i),
      save: buildSaveScreen(i, p),
    };

    for (const tab of PAUSE_TABS) {
      html += `<div class="pause-screen${tab.key==='items'?' visible':''}" data-screen="${tab.key}">`;
      html += `<div class="pause-bg-wrap">`;
      html += `<img class="pause-bg" src="images/${tab.bg}" alt="">`;
      html += `<div class="pause-content ${tab.key}-content">${screens[tab.key]}</div>`;
      html += `</div>`;
      if (tab.key !== 'save') {
        html += `<div class="pause-namebar"><span data-namebar="${i}-${tab.key}"></span></div>`;
      }
      html += `</div>`;
    }

    html += '</div>'; // pause-wrap
    html += '</div>'; // slot-panel
  }

  container.innerHTML = html;
  initNamebarHovers();
}

function initNamebarHovers() {
  document.querySelectorAll('.eq-cell[data-name], .item-cell[data-name], .qi-cell[data-name], .qhp[data-name], .qm[data-name], .qs[data-name], .qst[data-name]').forEach(cell => {
    const isEmpty = cell.classList.contains('empty') || cell.classList.contains('eq-empty') || cell.classList.contains('qi-off');
    cell.addEventListener('mouseenter', () => {
      const span = cell.closest('.pause-screen').querySelector('.pause-namebar span');
      if (span) {
        span.textContent = cell.dataset.name;
        span.style.color = isEmpty ? '#888' : '#fff';
      }
    });
    cell.addEventListener('mouseleave', () => {
      const span = cell.closest('.pause-screen').querySelector('.pause-namebar span');
      if (span) {
        span.textContent = '';
        span.style.color = '';
      }
    });
  });
}

function applyToggleEdits(data, slotIdx) {
  const orig = slotOriginal[slotIdx];
  const p = slotParsed[slotIdx];
  if (!orig || !p) return;

  const inv = data.inventory || {};
  if (inv.items) {
    for (let i = 0; i < Math.min(24, inv.items.length); i++) {
      if (p.items[i] !== orig.items[i]) {
        inv.items[i] = p.items[i];
        if (AMMO_SLOTS.has(i) && inv.ammo) inv.ammo[i] = p.ammo[i];
      }
    }
  }
  if (p.questItems !== orig.questItems && 'questItems' in inv) {
    inv.questItems = p.questItems;
  }
  if (p.gsTokens !== orig.gsTokens && 'gsTokens' in inv) {
    inv.gsTokens = p.gsTokens;
  }
  if (p.equipment !== orig.equipment && 'equipment' in inv) {
    inv.equipment = p.equipment;
  }
  if (p.upgrades !== orig.upgrades && 'upgrades' in inv) {
    inv.upgrades = p.upgrades;
  }
  if (data.eventChkInf) {
    if (p.kokiriEmerald !== orig.kokiriEmerald) {
      if (p.kokiriEmerald) data.eventChkInf[0] |= (1 << 7);
      else data.eventChkInf[0] &= ~(1 << 7);
    }
    if (p.goronsRuby !== orig.goronsRuby) {
      if (p.goronsRuby) data.eventChkInf[2] |= (1 << 5);
      else data.eventChkInf[2] &= ~(1 << 5);
    }
    if (p.zorasSapphire !== orig.zorasSapphire) {
      if (p.zorasSapphire) data.eventChkInf[3] |= (1 << 7);
      else data.eventChkInf[3] &= ~(1 << 7);
    }
  }
}

function applyEdits(slotIndex, json, callerSlot) {
  const nameInput = document.getElementById('editName' + callerSlot);
  const rupeesInput = document.getElementById('editRupees' + callerSlot);
  const heartsInput = document.getElementById('editHearts' + callerSlot);
  if (!nameInput) return json;

  if (slotIndex !== callerSlot) return json;

  const orig = slotOriginal[slotIndex];
  if (!orig) return json;

  const data = json.sections.base.data;

  const newName = nameInput.value;
  if (newName && newName !== orig.name) {
    data.playerName = encodeName(newName);
  }

  const newRupees = parseInt(rupeesInput.value);
  if (!isNaN(newRupees) && newRupees !== orig.rupees) {
    data.rupees = Math.max(0, Math.min(500, newRupees));
  }

  const origHearts = Math.floor(orig.healthCapacity / 16);
  const newHearts = parseInt(heartsInput.value);
  if (!isNaN(newHearts) && newHearts !== origHearts) {
    data.healthCapacity = Math.max(48, Math.min(320, newHearts * 16));
    data.health = Math.min(data.health, data.healthCapacity);
  }

  applyToggleEdits(data, slotIndex);

  return json;
}

function downloadSohSave(filename) {
  const json = window._upgradedSave;
  if (!json) return;
  const copy = JSON.parse(JSON.stringify(json));
  applyToggleEdits(copy.sections.base.data, 0);
  downloadJson(copy, filename);
}

// ===== TOGGLE EDITING =====

function rerenderScreen(slotIdx, screenKey) {
  const panel = document.querySelector(`.slot-panel[data-slot="${slotIdx}"]`);
  if (!panel) return;
  const screen = panel.querySelector(`.pause-screen[data-screen="${screenKey}"]`);
  if (!screen) return;
  const content = screen.querySelector('.pause-content');
  if (!content) return;
  const p = slotParsed[slotIdx];
  if (!p) return;

  if (screenKey === 'items') content.innerHTML = buildItemsScreen(p, slotIdx);
  else if (screenKey === 'equip') content.innerHTML = buildEquipScreen(p, slotIdx);
  else if (screenKey === 'quest') content.innerHTML = buildQuestScreen(p, slotIdx);
  initNamebarHovers();
}

function updateSummary(slotIdx) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  const panel = document.querySelector(`.slot-panel[data-slot="${slotIdx}"]`);
  if (!panel) return;
  const summary = panel.querySelector('.slot-summary');
  if (!summary) return;
  summary.innerHTML = `<div class="slot-stats">
    <div class="stat"><img src="images/ui/rupee.png">${p.rupees}</div>
    <div class="stat"><img src="images/ui/skull.png">${p.deaths}</div>
    <div class="stat"><img src="images/quest/gold_skulltula.png">${p.gsTokens}</div>
  </div>
  <div class="slot-hearts">${buildHeartsHtml(p)}<div class="slot-quest">${buildQuestHtml(p)}</div></div>`;
}

function toggleItem(slotIdx, itemSlot) {
  const p = slotParsed[slotIdx];
  const orig = slotOriginal[slotIdx];
  if (!p || !orig) return;

  if (p.items[itemSlot] === 255) {
    if (orig.items[itemSlot] !== 255) {
      p.items[itemSlot] = orig.items[itemSlot];
      if (AMMO_SLOTS.has(itemSlot)) p.ammo[itemSlot] = orig.ammo[itemSlot];
    } else {
      p.items[itemSlot] = SLOT_DEFAULTS[itemSlot];
      if (AMMO_SLOTS.has(itemSlot)) p.ammo[itemSlot] = SLOT_DEFAULT_AMMO[itemSlot] || 0;
    }
  } else {
    p.items[itemSlot] = 255;
    if (AMMO_SLOTS.has(itemSlot)) p.ammo[itemSlot] = 0;
  }
  rerenderScreen(slotIdx, 'items');
}

function setQuestBit(slotIdx, bit, value) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  if (value) p.questItems |= (1 << bit);
  else p.questItems &= ~(1 << bit);
  rerenderScreen(slotIdx, 'quest');
  openQuestEdit(slotIdx);
  updateSummary(slotIdx);
}

function setGsTokens(slotIdx, value) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  p.gsTokens = Math.max(0, Math.min(100, value));
  rerenderScreen(slotIdx, 'quest');
  openQuestEdit(slotIdx);
}

function setHeartPieces(slotIdx, value) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  p.questItems = ((p.questItems & 0x0FFFFFFF) | ((value & 0xF) << 28)) >>> 0;
  rerenderScreen(slotIdx, 'quest');
  openQuestEdit(slotIdx);
}

function openEquipEdit(slotIdx) {
  const panel = document.getElementById('equipEditPanel' + slotIdx);
  if (panel) panel.style.display = 'flex';
}

function closeEquipEdit(slotIdx) {
  const panel = document.getElementById('equipEditPanel' + slotIdx);
  if (panel) panel.style.display = 'none';
}

function toggleEquipItem(slotIdx, bit) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  p.equipment ^= (1 << bit);
  rerenderScreen(slotIdx, 'equip');
  openEquipEdit(slotIdx);
}

function setUpgrade(slotIdx, shift, val) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  const def = UPGRADE_DEFS.find(u => u.shift === shift);
  const mask = def ? def.mask : 7;
  p.upgrades = (p.upgrades & ~(mask << shift)) | (val << shift);
  rerenderScreen(slotIdx, 'equip');
  openEquipEdit(slotIdx);
}

// ===== ITEMS EDIT PANEL =====

function buildItemsEditPanel(p, slotIdx) {
  const orig = slotOriginal[slotIdx];
  let h = `<div class="edit-panel" id="itemsEditPanel${slotIdx}" style="display:none">`;
  h += '<div class="edit-panel-header"><span>Edit Items</span>';
  h += `<button class="edit-panel-close" onclick="event.stopPropagation();closeItemsEdit(${slotIdx})">✕</button></div>`;
  h += '<div class="edit-panel-body">';

  for (let j = 0; j < 24; j++) {
    const itemId = p.items[j];
    const origId = orig ? orig.items[j] : itemId;
    const options = SLOT_ITEMS[j];
    const hasItem = itemId !== 255;
    const isAdded = hasItem && origId === 255;

    h += `<div class="edit-item${isAdded ? ' edit-added' : ''}" onclick="event.stopPropagation()">`;

    if (options.length === 1) {
      const name = ITEM_NAMES[options[0]];
      const img = ITEM_IMAGES[options[0]];
      h += `<input type="checkbox" ${hasItem ? 'checked' : ''} onchange="setItem(${slotIdx},${j},this.checked?${options[0]}:255)">`;
      if (img) h += `<img class="edit-item-icon" src="images/items/${img}.png">`;
      h += `<span class="edit-item-name">${name}</span>`;
      if (AMMO_SLOTS.has(j)) {
        h += `<input type="number" class="edit-ammo" min="0" max="99" value="${p.ammo[j] || 0}" onchange="setAmmo(${slotIdx},${j},parseInt(this.value)||0)">`;
      }
    } else {
      h += `<select class="edit-select" onchange="setItem(${slotIdx},${j},parseInt(this.value))">`;
      h += `<option value="255"${!hasItem?' selected':''}>— ${SLOT_LABELS[j]} —</option>`;
      for (const opt of options) {
        h += `<option value="${opt}"${itemId===opt?' selected':''}>${ITEM_NAMES[opt]}</option>`;
      }
      h += '</select>';
      if (hasItem && ITEM_IMAGES[itemId]) {
        h += `<img class="edit-item-icon" src="images/items/${ITEM_IMAGES[itemId]}.png">`;
      }
    }

    if (origId !== 255 && hasItem && origId === itemId) h += '<span class="edit-badge edit-badge-orig">save</span>';
    if (isAdded) h += '<span class="edit-badge edit-badge-new">new</span>';

    h += '</div>';
  }

  h += '</div></div>';
  return h;
}

function openItemsEdit(slotIdx) {
  const panel = document.getElementById('itemsEditPanel' + slotIdx);
  if (panel) panel.style.display = 'flex';
}

function closeItemsEdit(slotIdx) {
  const panel = document.getElementById('itemsEditPanel' + slotIdx);
  if (panel) panel.style.display = 'none';
}

function setItem(slotIdx, slot, itemId) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  p.items[slot] = itemId;
  if (itemId === 255 && AMMO_SLOTS.has(slot)) p.ammo[slot] = 0;
  if (itemId !== 255 && AMMO_SLOTS.has(slot) && p.ammo[slot] === 0) {
    p.ammo[slot] = SLOT_DEFAULT_AMMO[slot] || 0;
  }
  rerenderScreen(slotIdx, 'items');
  openItemsEdit(slotIdx);
}

function setAmmo(slotIdx, slot, amount) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  p.ammo[slot] = Math.max(0, Math.min(99, amount));
}

function setStone(slotIdx, key, value) {
  const p = slotParsed[slotIdx];
  if (!p) return;
  p[key] = value ? 1 : 0;
  rerenderScreen(slotIdx, 'quest');
  openQuestEdit(slotIdx);
  updateSummary(slotIdx);
}

function openQuestEdit(slotIdx) {
  const panel = document.getElementById('questEditPanel' + slotIdx);
  if (panel) panel.style.display = 'flex';
}

function closeQuestEdit(slotIdx) {
  const panel = document.getElementById('questEditPanel' + slotIdx);
  if (panel) panel.style.display = 'none';
}

function resetEdits(slotIdx) {
  const orig = slotOriginal[slotIdx];
  if (!orig) return;
  slotParsed[slotIdx] = JSON.parse(JSON.stringify(orig));

  const p = slotParsed[slotIdx];
  const nameInput = document.getElementById('editName' + slotIdx);
  const rupeesInput = document.getElementById('editRupees' + slotIdx);
  const heartsInput = document.getElementById('editHearts' + slotIdx);
  if (nameInput) nameInput.value = p.name;
  if (rupeesInput) rupeesInput.value = p.rupees;
  if (heartsInput) heartsInput.value = Math.floor(p.healthCapacity / 16);

  rerenderScreen(slotIdx, 'items');
  rerenderScreen(slotIdx, 'equip');
  rerenderScreen(slotIdx, 'quest');
  updateSummary(slotIdx);
}

function downloadJson(json, filename) {
  const text = JSON.stringify(json, null, 1);
  const blob = new Blob([text], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportChecked(callerSlot) {
  const prefix = document.getElementById('exportName' + callerSlot).value || 'file';
  let exported = 0;
  for (let s = 0; s < 3; s++) {
    const cb = document.getElementById(`exportCheck${callerSlot}_${s}`);
    if (!cb || !cb.checked || !slotValidity[s]) continue;
    const offset = SLOT_OFFSETS[s];
    const slotData = currentBE.slice(offset, offset + SLOT_SIZE);
    let json = generateSohJson(slotData);
    json = applyEdits(s, json, callerSlot);
    const filename = `${prefix}${s + 1}.sav`;
    setTimeout(() => downloadJson(json, filename), exported * 200);
    exported++;
  }
}

function previewSlot(callerSlot) {
  // Find first checked slot to preview
  let slotIdx = callerSlot;
  for (let s = 0; s < 3; s++) {
    const cb = document.getElementById(`exportCheck${callerSlot}_${s}`);
    if (cb && cb.checked && slotValidity[s]) { slotIdx = s; break; }
  }
  if (!slotValidity[slotIdx]) return;

  const offset = SLOT_OFFSETS[slotIdx];
  const slotData = currentBE.slice(offset, offset + SLOT_SIZE);
  let json = generateSohJson(slotData);
  json = applyEdits(slotIdx, json, callerSlot);

  const d = json.sections.base.data;
  const summary = {
    name: decodeName(d.playerName),
    age: d.linkAge === 1 ? 'Child' : 'Adult',
    health: `${d.health}/${d.healthCapacity} (${Math.floor(d.healthCapacity/16)} hearts)`,
    rupees: d.rupees,
    deaths: d.deaths,
    magic: d.magic,
    gsTokens: d.inventory.gsTokens,
    items: d.inventory.items.filter(x => x !== 255).length + ' items',
    fullJsonSize: JSON.stringify(json).length + ' bytes',
  };

  const modal = document.getElementById('previewModal');
  document.getElementById('previewContent').textContent = JSON.stringify(summary, null, 2);
  modal.dataset.callerSlot = callerSlot;
  modal.style.display = 'flex';
}

function closePreview() {
  document.getElementById('previewModal').style.display = 'none';
}

function exportFromPreview() {
  const callerSlot = parseInt(document.getElementById('previewModal').dataset.callerSlot);
  closePreview();
  exportChecked(callerSlot);
}

// ===== SOH SAVE UPGRADE (v1/v2/v3 → v4) =====

const DEFAULT_FW = {pos:{x:0,y:0,z:0},yaw:0,playerParams:0,entranceIndex:0,roomIndex:0,set:0,tempSwchFlags:0,tempCollectFlags:0};

const DEFAULT_SOH_STATS = {
  buildVersion:"",buildVersionMajor:0,buildVersionMinor:0,buildVersionPatch:0,
  counts:new Array(100).fill(0),dungeonKeys:new Array(20).fill(0),
  entrancesDiscovered:new Array(66).fill(0),fileCreatedAt:0,firstInput:0,
  heartContainers:0,heartPieces:0,itemTimestamps:new Array(200).fill(0),
  pauseTimer:0,playTimer:0,rtaTiming:false,sceneTimestamps:[],
  scenesDiscovered:new Array(4).fill(0),tsIdx:0
};

function renameField(obj, oldKey, newKey) {
  if (oldKey in obj && !(newKey in obj)) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
}

function ensureField(obj, key, defaultVal) {
  if (!(key in obj)) obj[key] = defaultVal;
}

function extractSohStats(data) {
  const stats = {};
  const statFields = ['heartPieces','heartContainers','dungeonKeys','rtaTiming','firstInput',
    'fileCreatedAt','playTimer','pauseTimer','timestamps','itemTimestamps','counts',
    'scenesDiscovered','entrancesDiscovered','buildVersion','buildVersionMajor',
    'buildVersionMinor','buildVersionPatch','sceneTimestamps','tsIdx'];
  for (const f of statFields) {
    if (f in data) {
      stats[f] = data[f];
      delete data[f];
    }
  }
  if ('timestamps' in stats && !('itemTimestamps' in stats)) {
    stats.itemTimestamps = stats.timestamps;
    delete stats.timestamps;
  }
  for (const [k, v] of Object.entries(DEFAULT_SOH_STATS)) {
    ensureField(stats, k, JSON.parse(JSON.stringify(v)));
  }
  return stats;
}

function upgradeSohSave(json) {
  if (!json.sections || !json.sections.base) return {json, upgraded: false, error: 'Invalid SoH save: no base section'};

  const baseVersion = json.sections.base.version;
  if (baseVersion === 4) return {json, upgraded: false, alreadyCurrent: true};
  if (baseVersion < 1 || baseVersion > 3) return {json, upgraded: false, error: `Unknown base version: ${baseVersion}`};

  const data = json.sections.base.data;
  const changes = [];

  if (baseVersion <= 1) {
    renameField(data, 'magicAcquired', 'isMagicAcquired');
    renameField(data, 'doubleMagic', 'isDoubleMagicAcquired');
    renameField(data, 'doubleDefense', 'isDoubleDefenseAcquired');
    renameField(data, 'scarecrowCustomSongSet', 'scarecrowLongSongSet');
    renameField(data, 'scarecrowCustomSong', 'scarecrowLongSong');
    changes.push('Renamed magic/scarecrow fields (v1 → v2)');
  }

  if (baseVersion <= 2) {
    ensureField(data, 'isMasterQuest', false);
    ensureField(data, 'backupFW', JSON.parse(JSON.stringify(DEFAULT_FW)));
    ensureField(data, 'dogParams', 0);
    changes.push('Added backupFW, dogParams, isMasterQuest (v2 → v3)');
  }

  // v1/v2/v3 may have sohStats embedded in base data — extract to separate section
  const hasEmbeddedStats = ['heartPieces','heartContainers','playTimer','counts','timestamps','itemTimestamps']
    .some(f => f in data);
  if (hasEmbeddedStats) {
    const stats = extractSohStats(data);
    json.sections.sohStats = {data: stats, version: 1};
    changes.push('Extracted sohStats to separate section');
  }

  ensureField(data, 'filenameLanguage', 2);
  ensureField(data, 'maskMemory', 0);
  ensureField(data, 'randomizerInf', new Array(179).fill(0));
  changes.push('Added filenameLanguage, maskMemory (→ v4)');

  json.sections.base.version = 4;
  ensureField(json, 'version', 1);
  ensureField(json, 'fileType', 0);
  if (!json.sections.sohStats) {
    json.sections.sohStats = {data: JSON.parse(JSON.stringify(DEFAULT_SOH_STATS)), version: 1};
  }
  ensureField(json.sections, 'itemTrackerData', {data:{personalNotes:""}, version:1});
  ensureField(json.sections, 'trackerData', {data:{areasSpoiled:4294967295,checkStatus:[]}, version:1});

  return {json, upgraded: true, fromVersion: baseVersion, changes};
}


// ===== EVENT HANDLERS =====

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.style.display = 'block';
}

function clearError() {
  document.getElementById('error').style.display = 'none';
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(1) + ' KB';
}

function showFileInfo(info) {
  const dz = document.getElementById('dropZone');
  dz.classList.add('loaded');
  let h = '<div class="file-info">';
  h += `<div class="file-info-name">${info.filename}</div>`;
  h += '<div class="file-info-details">';
  for (const [label, value] of info.details) {
    h += `<span class="file-info-item"><span class="file-info-label">${label}</span> ${value}</span>`;
  }
  h += '</div></div>';
  dz.innerHTML = h;
}

function handleBinary(raw, filename) {
  slotParsed = [null, null, null];
  slotOriginal = [null, null, null];
  slotValidity = [false, false, false];
  let data = raw;
  if (raw.length < 0x3D10) {
    showError(`File too small (${formatSize(raw.length)}). Need at least 15,632 bytes for 3 save slots.`);
    return;
  }
  if (raw.length < 0x8000) {
    data = new Uint8Array(0x8000);
    data.set(raw);
  }

  const order = detectByteOrder(data);
  if (!order) {
    showError('Cannot detect byte order — ZELD magic not found. Not a valid N64 OoT save file.');
    return;
  }

  const be = toBigEndian(data, order);

  // Count valid slots
  let validCount = 0;
  const slotNames = [];
  for (let i = 0; i < 3; i++) {
    const sd = be.slice(SLOT_OFFSETS[i], SLOT_OFFSETS[i] + SLOT_SIZE);
    if (isSlotValid(sd)) {
      validCount++;
      slotNames.push(decodeName(Array.from({length:8}, (_,j) => u8(sd, 0x24+j))));
    }
  }

  showFileInfo({
    filename,
    details: [
      ['Format', 'N64 SRAM'],
      ['Byte order', order],
      ['Size', formatSize(raw.length)],
      ['Slots', `${validCount}/3` + (slotNames.length ? ` (${slotNames.join(', ')})` : '')],
    ]
  });

  renderSlots(be);
}

function handleJson(text, filename) {
  slotParsed = [null, null, null];
  slotOriginal = [null, null, null];
  slotValidity = [false, false, false];
  try {
    const json = JSON.parse(text);

    if (!json.sections || !json.sections.base) {
      showError('Invalid JSON: no "sections.base" found. Not a SoH save file.');
      return;
    }

    const baseVersion = json.sections.base.version;
    const data = json.sections.base.data;
    const name = data.playerName ? decodeName(data.playerName) : '?';
    const fileType = json.fileType === 1 ? 'Randomizer' : 'Vanilla';
    const sections = Object.keys(json.sections).join(', ');

    const originalVersion = baseVersion;
    const result = upgradeSohSave(json);

    showFileInfo({
      filename,
      details: [
        ['Format', 'SoH JSON'],
        ['Base version', `v${originalVersion}` + (result.upgraded ? ` → v4` : ' (current)')],
        ['Type', fileType],
        ['Player', name],
        ['Sections', sections],
      ]
    });

    const finalData = result.json.sections.base.data;
    renderSohSlot(finalData, filename, result);
  } catch (err) {
    showError(`Failed to parse JSON: ${err.message}`);
  }
}

function handleFile(file) {
  clearError();
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const raw = new Uint8Array(e.target.result);

    // Detect by content: if first non-whitespace byte is '{', treat as JSON
    let firstChar = 0;
    for (let i = 0; i < Math.min(raw.length, 64); i++) {
      if (raw[i] > 32) { firstChar = raw[i]; break; }
    }

    if (firstChar === 0x7B) { // '{'
      const text = new TextDecoder().decode(raw);
      handleJson(text, file.name);
    } else {
      handleBinary(raw, file.name);
    }
  };
  reader.onerror = () => showError('Failed to read file');
  reader.readAsArrayBuffer(file);
}

// Drop zone
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => { if(e.target.files[0]) handleFile(e.target.files[0]); e.target.value=''; });

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

