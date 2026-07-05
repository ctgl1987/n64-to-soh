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
  'Trade','Trade','Bottle','Bottle','Bottle','Bottle'
];

const AMMO_SLOTS = new Set([0, 1, 2, 3, 6, 8, 14]);

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
  {name:'Quiver', shift:0, vals:['—','Quiver (Holds 30)','Quiver (Holds 40)','Quiver (Holds 50)'], imgKey:'quiver'},
  {name:'Bomb Bag', shift:3, vals:['—','Bomb Bag (Holds 20)','Bomb Bag (Holds 30)','Bomb Bag (Holds 40)'], imgKey:'bomb_bag'},
  {name:'Strength', shift:6, vals:['—',"Goron's Bracelet",'Silver Gauntlets','Golden Gauntlets'], imgKey:'gauntlets'},
  {name:'Scale', shift:9, vals:['—','Silver Scale','Golden Scale'], imgKey:'scale'},
  {name:'Wallet', shift:12, vals:["Child's Wallet (99)","Adult's Wallet (200)","Giant's Wallet (500)"], imgKey:null},
  {name:'Bullet Bag', shift:15, vals:['—','Bullet Bag (Holds 30)','Bullet Bag (Holds 40)','Bullet Bag (Holds 50)'], imgKey:'bullet_bag'},
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

function buildItemsScreen(p) {
  let h = '<div class="items-grid">';
  for (let j = 0; j < 24; j++) {
    const itemId = p.items[j];
    if (itemId === 255) {
      h += `<div class="item-cell empty" data-name="${SLOT_LABELS[j]}"><div class="item-icon-empty"></div></div>`;
    } else {
      const name = ITEM_NAMES[itemId] || `Item(${itemId})`;
      const img = ITEM_IMAGES[itemId];
      const ammo = AMMO_SLOTS.has(j) && p.ammo[j] > 0 ? `<span class="item-ammo">${p.ammo[j]}</span>` : '';
      h += `<div class="item-cell has-item" data-name="${name}">`;
      if (img) h += `<img class="item-icon" src="images/items/${img}.png" alt="${name}">`;
      else h += `<div class="item-icon-empty"></div>`;
      h += `${ammo}</div>`;
    }
  }
  h += '</div>';
  return h;
}

function buildEquipScreen(p) {
  const upgs = [];
  for (const up of UPGRADE_DEFS) {
    const val = (p.upgrades >> up.shift) & 0x7;
    if (val > 0 && val < up.vals.length) {
      const imgKey = up.imgKey;
      if (imgKey) upgs.push({title:up.vals[val], img:`upg_${imgKey}${val}.png`});
      else upgs.push({title:up.vals[val], text:up.vals[val]});
    }
  }
  if (p.isMagicAcquired) {
    upgs.push({title:`Magic: ${p.magic} / ${p.magicLevel === 2 ? 96 : 48}`, img:'upg_scale1.png', isMagic:true});
  }

  let h = '<div class="equip-layout">';

  // Left: upgrades column
  h += '<div class="equip-upgrades">';
  for (let row = 0; row < 4; row++) {
    if (row < upgs.length) {
      const u = upgs[row];
      h += `<div class="eq-cell eq-owned" data-name="${u.title}">`;
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
      const isEquipped = owned && (equipped === j + 1);
      const cls = isEquipped ? 'eq-equipped' : owned ? 'eq-owned' : 'eq-empty';
      const img = EQUIP_IMAGES[row][j];
      h += `<div class="eq-cell ${cls}" data-name="${cat.items[j]}">`;
      if (owned) h += `<img class="eq-icon" src="images/equipment/${img}.png" alt="${cat.items[j]}">`;
      h += '</div>';
    }
  }
  h += '</div>';

  h += '</div>';
  return h;
}

function buildQuestScreen(p) {
  let h = '<div class="quest-layout">';

  // === Top-left: quest items (2x2: agony, gerudo, skulltula+count) ===
  const hasAgony = (p.questItems >> 21) & 1;
  const hasGerudo = (p.questItems >> 22) & 1;
  const heartPieces = (p.questItems >>> 28) & 0xF;
  h += '<div class="quest-items-area">';
  h += `<div class="qi-cell${hasAgony?'':' qi-off'}" data-name="Stone of Agony"><img class="qi-img" src="images/quest/quest_stone_agony.webp"></div>`;
  h += `<div class="qi-cell${hasGerudo?'':' qi-off'}" data-name="Gerudo Card"><img class="qi-img" src="images/quest/quest_gerudo_card.webp"></div>`;
  h += `<div class="qi-cell" data-name="Gold Skulltulas: ${p.gsTokens}"><img class="qi-skull-img" src="images/quest/gold_skulltula.png"></div>`;
  h += `<div class="qi-cell qi-count" data-name="Gold Skulltulas: ${p.gsTokens}"><span class="qi-skull-count">${p.gsTokens}</span></div>`;
  h += '</div>';

  // === Heart pieces (2x2 grid, 3 quarters — 4th completes a container) ===
  const hpImgs = ['h_tl.png','h_bl.png','h_br.png'];
  h += '<div class="quest-hearts-area">';
  h += `<div class="qhp${heartPieces>=1?'':' qi-off'}" data-name="Heart Piece 1/4"><img src="images/quest/h_tl.png"></div>`;
  h += '<div class="qhp qi-off"></div>';
  h += `<div class="qhp${heartPieces>=2?'':' qi-off'}" data-name="Heart Piece 2/4"><img src="images/quest/h_bl.png"></div>`;
  h += `<div class="qhp${heartPieces>=3?'':' qi-off'}" data-name="Heart Piece 3/4"><img src="images/quest/h_br.png"></div>`;
  h += '</div>';

  // === Top-right: medallions in hexagonal layout ===
  const medalNames = ['light','forest','fire','water','spirit','shadow'];
  const medalLabels = ['Light Medallion','Forest Medallion','Fire Medallion','Water Medallion','Spirit Medallion','Shadow Medallion'];
  const medalBits = [5,0,1,2,3,4];
  h += '<div class="quest-medallions">';
  for (let m = 0; m < 6; m++) {
    const has = (p.questItems >> medalBits[m]) & 1;
    h += `<div class="qm qm-${medalNames[m]}${has?'':' qi-off'}" data-name="${medalLabels[m]}">`;
    h += `<img src="images/quest/icon_${medalNames[m]}.png">`;
    h += '</div>';
  }
  h += '</div>';

  // === Bottom-left: songs grid (empty cells for unobtained) ===
  h += '<div class="quest-songs">';
  for (const song of SONGS) {
    const has = (p.questItems >> song.bit) & 1;
    if (has) {
      h += `<div class="qs qs-on" data-name="${song.name}">`;
      h += `<img class="qs-note" src="images/quest/${song.img}" alt="${song.name}">`;
      h += '</div>';
    } else {
      h += '<div class="qs"></div>';
    }
  }
  h += '</div>';

  // === Bottom-right: spiritual stones (only show obtained) ===
  const stones = [
    {name:'Kokiri Emerald', img:'kokiris_emerald.png', has:p.kokiriEmerald},
    {name:"Goron's Ruby", img:'gorons_ruby.png', has:p.goronsRuby},
    {name:"Zora's Sapphire", img:'zoras_sapphire.png', has:p.zorasSapphire},
  ];
  h += '<div class="quest-stones">';
  for (const st of stones) {
    if (st.has) {
      h += `<div class="qst" data-name="${st.name}">`;
      h += `<img src="images/quest/${st.img}">`;
      h += '</div>';
    }
  }
  h += '</div>';

  h += '</div>';
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
      items: buildItemsScreen(p),
      equip: buildEquipScreen(p),
      quest: buildQuestScreen(p),
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

function applyEdits(slotIndex, json, callerSlot) {
  const nameInput = document.getElementById('editName' + callerSlot);
  const rupeesInput = document.getElementById('editRupees' + callerSlot);
  const heartsInput = document.getElementById('editHearts' + callerSlot);
  if (!nameInput) return json;

  // Only apply edits to the slot that owns the edit fields
  if (slotIndex !== callerSlot) return json;

  const orig = slotParsed[slotIndex];
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

  return json;
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

// ===== EVENT HANDLERS =====

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.style.display = 'block';
}

function clearError() {
  document.getElementById('error').style.display = 'none';
}

function handleFile(file) {
  clearError();
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const raw = new Uint8Array(e.target.result);

    let data = raw;
    if (raw.length < 0x3D10) {
      showError(`Invalid file size: too small (${raw.length} bytes). Need at least 15632 bytes for 3 save slots.`);
      return;
    }
    if (raw.length < 0x8000) {
      data = new Uint8Array(0x8000);
      data.set(raw);
    }

    const order = detectByteOrder(data);
    if (!order) {
      showError('Cannot detect byte order — ZELD magic not found. Is this a valid OOT .sra file?');
      return;
    }

    const be = toBigEndian(data, order);
    const dz = document.getElementById('dropZone');
    dz.classList.add('loaded');
    dz.querySelector('p').innerHTML = `✓ <strong>${file.name}</strong> loaded (${order}) — drop another to replace`;

    renderSlots(be);
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

