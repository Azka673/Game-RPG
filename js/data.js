/**
 * data.js — Static game data
 * Elemental Power Arena
 */

/* ─── ELEMENTS ──────────────────────────────────────────────── */
const ELEMENTS = {
  fire:      { name:'Fire',      icon:'🔥', strong:'earth',     weak:'water',     type:'Damage / AoE'    },
  water:     { name:'Water',     icon:'💧', strong:'fire',      weak:'lightning', type:'Heal / Control'  },
  lightning: { name:'Lightning', icon:'⚡', strong:'water',     weak:'earth',     type:'Speed / Combo'   },
  earth:     { name:'Earth',     icon:'🌱', strong:'lightning', weak:'fire',      type:'Defense / CC'    },
  ice:       { name:'Ice',       icon:'❄️', strong:'water',     weak:'fire',      type:'Freeze / Control' },
  shadow:    { name:'Shadow',    icon:'🌑', strong:'lightning', weak:'light',     type:'Stealth / Burst' },
  light:     { name:'Light',     icon:'☀️', strong:'shadow',    weak:'earth',     type:'Support / Buff'  },
  poison:    { name:'Poison',    icon:'☣️', strong:'earth',     weak:'fire',      type:'DoT / Debuff'    },
  cosmic:    { name:'Cosmic',    icon:'🌌', strong:'all',       weak:'none',      type:'Random Overpower' }
};

/* ─── SKILLS BY ELEMENT ──────────────────────────────────────── */
const SKILLS = {
  fire: [
    { id:'fireball',   name:'Fireball',    icon:'🔥', dmg:22,  mana:15, maxCd:2, desc:'Bola api berenergi tinggi' },
    { id:'eruption',   name:'Eruption',    icon:'🌋', dmg:18,  mana:25, maxCd:3, desc:'AoE damage + efek Burn',   status:'burn' },
    { id:'flame_dash', name:'Flame Dash',  icon:'💨', dmg:12,  mana:20, maxCd:2, desc:'Melesat + counter strike' },
    { id:'inferno',    name:'INFERNO',     icon:'🌟', dmg:55,  mana:50, maxCd:6, desc:'Ultimate: Damage kolosal', ultimate:true, status:'burn' }
  ],
  water: [
    { id:'water_blast',name:'Water Blast', icon:'💧', dmg:18,  mana:15, maxCd:2, desc:'Tembakan air bertekanan' },
    { id:'heal_wave',  name:'Heal Wave',   icon:'🌊', dmg:-25, mana:20, maxCd:3, desc:'Pulihkan 25 HP',          heal:true },
    { id:'w_shield',   name:'Water Shield',icon:'🛡️', dmg:0,   mana:25, maxCd:4, desc:'Shield menyerap 20 damage',status:'shield' },
    { id:'tsunami',    name:'TSUNAMI',     icon:'🌟', dmg:50,  mana:50, maxCd:6, desc:'Ultimate: Banjir + Stun', ultimate:true, status:'stun' }
  ],
  lightning: [
    { id:'bolt',       name:'Thunder Bolt',icon:'⚡', dmg:20,  mana:15, maxCd:1, desc:'Serangan petir cepat' },
    { id:'chain',      name:'Chain Bolt',  icon:'🔗', dmg:15,  mana:20, maxCd:2, desc:'Rantai petir + Stun',     status:'stun' },
    { id:'overcharge', name:'Overcharge',  icon:'🌩️', dmg:10,  mana:15, maxCd:2, desc:'Tingkatkan combo damage' },
    { id:'thunder_god',name:'THUNDER GOD', icon:'🌟', dmg:52,  mana:50, maxCd:6, desc:'Ultimate: Mega Stun',    ultimate:true, status:'stun' }
  ],
  earth: [
    { id:'rock',       name:'Rock Throw',  icon:'🪨', dmg:20,  mana:15, maxCd:2, desc:'Lemparan batu besar' },
    { id:'earth_wall', name:'Earth Wall',  icon:'🏔️', dmg:0,   mana:20, maxCd:4, desc:'Kurangi damage berikutnya 50%', status:'shield' },
    { id:'quake',      name:'Quake',       icon:'🌍', dmg:14,  mana:25, maxCd:3, desc:'Guncangan AoE + Stun',   status:'stun' },
    { id:'gaia',       name:'GAIA FORCE',  icon:'🌟', dmg:58,  mana:50, maxCd:6, desc:'Ultimate: Lava Trap',    ultimate:true, status:'burn' }
  ],
  ice: [
    { id:'ice_spike',  name:'Ice Spike',   icon:'❄️', dmg:18,  mana:15, maxCd:2, desc:'Paku es + Freeze',       status:'freeze' },
    { id:'blizzard',   name:'Blizzard',    icon:'🌨️', dmg:15,  mana:25, maxCd:3, desc:'Badai es AoE',           status:'freeze' },
    { id:'ice_wall',   name:'Ice Wall',    icon:'🧊', dmg:0,   mana:20, maxCd:4, desc:'Tembok es + shield',     status:'shield' },
    { id:'abs_zero',   name:'ABS ZERO',    icon:'🌟', dmg:48,  mana:50, maxCd:6, desc:'Ultimate: Full Freeze',  ultimate:true, status:'freeze' }
  ],
  shadow: [
    { id:'shadow_slash',name:'Shadow Slash',icon:'🌑',dmg:24,  mana:15, maxCd:2, desc:'Serangan bayang-bayang' },
    { id:'vanish',     name:'Vanish',      icon:'🕶️', dmg:0,   mana:20, maxCd:4, desc:'Invisibility 1 giliran', status:'shield' },
    { id:'burst',      name:'Dark Burst',  icon:'💥', dmg:30,  mana:30, maxCd:3, desc:'Burst damage dari bayangan' },
    { id:'reaper',     name:'DARK REAPER', icon:'🌟', dmg:60,  mana:50, maxCd:6, desc:'Ultimate: Instant kill attempt', ultimate:true }
  ],
  light: [
    { id:'holy_bolt',  name:'Holy Bolt',   icon:'☀️', dmg:16,  mana:15, maxCd:2, desc:'Tembakan cahaya suci' },
    { id:'radiance',   name:'Radiance',    icon:'✨', dmg:0,   mana:20, maxCd:3, desc:'Heal + shield sendiri',  heal:true, status:'shield' },
    { id:'smite',      name:'Smite',       icon:'⚡', dmg:22,  mana:25, maxCd:3, desc:'Hukuman cahaya + stun',  status:'stun' },
    { id:'divine',     name:'DIVINE WRATH',icon:'🌟', dmg:50,  mana:50, maxCd:6, desc:'Ultimate: Holy explosion', ultimate:true }
  ],
  poison: [
    { id:'venom',      name:'Venom Shot',  icon:'☣️', dmg:14,  mana:15, maxCd:2, desc:'Serangan racun DoT',     status:'burn' },
    { id:'acid_pool',  name:'Acid Pool',   icon:'🧪', dmg:10,  mana:20, maxCd:3, desc:'Kolam asam area',        status:'burn' },
    { id:'toxic_cloud',name:'Toxic Cloud', icon:'💀', dmg:12,  mana:20, maxCd:3, desc:'Awan beracun AoE',       status:'stun' },
    { id:'plague',     name:'BLACK PLAGUE',icon:'🌟', dmg:45,  mana:50, maxCd:6, desc:'Ultimate: Racun masif',  ultimate:true, status:'burn' }
  ],
  cosmic: [
    { id:'stardust',   name:'Stardust',    icon:'🌌', dmg:20,  mana:15, maxCd:1, desc:'Debu kosmik acak' },
    { id:'void_rift',  name:'Void Rift',   icon:'🌀', dmg:25,  mana:25, maxCd:3, desc:'Celah dimensi AoE',     status:'stun' },
    { id:'nebula',     name:'Nebula Field',icon:'🔮', dmg:0,   mana:20, maxCd:3, desc:'Shield + random buff',  status:'shield' },
    { id:'big_bang',   name:'BIG BANG',    icon:'🌟', dmg:75,  mana:50, maxCd:8, desc:'Ultimate: Kosmik overpower', ultimate:true }
  ]
};

/* ─── GAME MODES ────────────────────────────────────────────── */
const GAME_MODES = {
  '1v1 Duel':        { chaos:false, oneHit:false, mirror:false, desc:'Duel standar 1 vs 1' },
  '3v3 Team':        { chaos:false, oneHit:false, mirror:false, desc:'Battle tim 3 vs 3 (simulasi)' },
  'Ranked':          { chaos:false, oneHit:false, mirror:false, desc:'Mode ranked — rank points berubah' },
  'Battle Royale':   { chaos:false, oneHit:false, mirror:false, desc:'Last man standing' },
  'King of the Hill':{ chaos:false, oneHit:false, mirror:false, desc:'Kuasai zona selama 10 ronde' },
  'Chaos Mode':      { chaos:true,  oneHit:false, mirror:false, desc:'Tanpa cooldown! Semua skill bebas!' },
  'One Hit':         { chaos:false, oneHit:true,  mirror:false, desc:'Sekali kena langsung kalah!' },
  'Mirror Mode':     { chaos:false, oneHit:false, mirror:true,  desc:'Semua pakai skill elemen yang sama' }
};

/* ─── GACHA POOL ────────────────────────────────────────────── */
const GACHA_POOL = [
  /* common */
  { name:'Skill: Ember Slash',    icon:'🗡️', rarity:'common',    desc:'Serangan api ringan +12 dmg' },
  { name:'Passive: Iron Skin',    icon:'🛡️', rarity:'common',    desc:'+5 flat defense setiap serangan' },
  { name:'Skill: Mud Toss',       icon:'🪨', rarity:'common',    desc:'Serangan tanah ringan +10 dmg' },
  { name:'Passive: Mana Regen',   icon:'💙', rarity:'common',    desc:'+3 mana tiap giliran' },
  /* rare */
  { name:'Skill: Storm Step',     icon:'💨', rarity:'rare',      desc:'Dodge + counter attack 1 giliran' },
  { name:'Elemen: Ice',           icon:'❄️', rarity:'rare',      desc:'Unlock elemen Ice!', unlock:'ice' },
  { name:'Passive: Dodge Boost',  icon:'🌀', rarity:'rare',      desc:'+15% peluang dodge otomatis' },
  { name:'Skill: Healing Rain',   icon:'🌧️', rarity:'rare',      desc:'Heal 20 HP + shield kecil' },
  /* epic */
  { name:'Skill: Tsunami',        icon:'🌊', rarity:'epic',      desc:'Serangan air masif + knockback' },
  { name:'Passive: Lifesteal',    icon:'🩸', rarity:'epic',      desc:'Serap 10% damage sebagai HP' },
  { name:'Passive: Reflect',      icon:'🪞', rarity:'epic',      desc:'Pantulkan 20% damage ke musuh' },
  { name:'Skill: Thunder Rain',   icon:'⛈️', rarity:'epic',      desc:'Petir AoE + efek chain' },
  /* legendary */
  { name:'Elemen: Shadow',        icon:'🌑', rarity:'legendary', desc:'Unlock elemen Shadow!', unlock:'shadow' },
  { name:'Elemen: Light',         icon:'☀️', rarity:'legendary', desc:'Unlock elemen Light!', unlock:'light' },
  { name:'Elemen: Poison',        icon:'☣️', rarity:'legendary', desc:'Unlock elemen Poison!', unlock:'poison' },
  { name:'Passive: Overcharge',   icon:'⚡', rarity:'legendary', desc:'Skill kuat 2x saat mana penuh' },
  /* mythic */
  { name:'Elemen: Cosmic',        icon:'🌌', rarity:'mythic',    desc:'Unlock elemen Cosmic!', unlock:'cosmic' },
  { name:'Passive: Immortality',  icon:'👑', rarity:'mythic',    desc:'Bertahan hidup 1x dengan 1 HP' }
];

/* ─── LEADERBOARD DATA ──────────────────────────────────────── */
const LEADERBOARD = [
  { rank:1,  name:'ShadowStrike_X',  elem:'🌑', pts:'12,840', badge:'Mythic' },
  { rank:2,  name:'IceMaster99',      elem:'❄️', pts:'11,200', badge:'Mythic' },
  { rank:3,  name:'CosmicHunter',     elem:'🌌', pts:'10,750', badge:'Diamond' },
  { rank:4,  name:'ThunderGod_7',     elem:'⚡', pts:'9,820',  badge:'Diamond' },
  { rank:5,  name:'EarthShaker',      elem:'🌱', pts:'8,900',  badge:'Diamond' },
  { rank:6,  name:'FireLord_Z',       elem:'🔥', pts:'7,600',  badge:'Platinum' },
  { rank:7,  name:'AquaQueen',        elem:'💧', pts:'6,100',  badge:'Platinum' },
  { rank:8,  name:'PoisonViper',      elem:'☣️', pts:'5,400',  badge:'Gold' },
  { rank:9,  name:'LightSage',        elem:'☀️', pts:'4,800',  badge:'Gold' },
  { rank:10, name:'DarkPhoenix',      elem:'🌑', pts:'4,200',  badge:'Gold' }
];

/* ─── RANK TIERS ────────────────────────────────────────────── */
const RANKS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Mythic'];

/* ─── COMBO EFFECTS ─────────────────────────────────────────── */
const COMBO_BONUSES = [
  { min:0,  mult:1.00, label:'' },
  { min:3,  mult:1.10, label:'+10% dmg' },
  { min:5,  mult:1.20, label:'+20% dmg' },
  { min:7,  mult:1.30, label:'+30% dmg' },
  { min:10, mult:1.50, label:'+50% dmg 🔥' }
];

/* ─── COMBO SPECIALS (element fusions) ──────────────────────── */
const COMBO_SPECIALS = {
  'water+lightning': { name:'Stun Wave',      icon:'⚡💧', bonus:'Stun semua musuh!' },
  'fire+earth':      { name:'Lava Trap',       icon:'🌋',  bonus:'DoT Area mematikan!' },
  'ice+water':       { name:'Freeze Lock',     icon:'❄️💧', bonus:'Freeze total + slow!' },
  'shadow+lightning':{ name:'Teleport Strike', icon:'🌑⚡', bonus:'Bypass defense!' }
};
