/**
 * state.js — Global game state (single source of truth)
 * Elemental Power Arena
 */

const G = {
  /* ── Player ── */
  playerName:    'Pemain 1',
  playerLevel:   7,
  playerExp:     680,
  playerExpMax:  1000,
  playerRankIdx: 2,        // index into RANKS array → 'Gold'
  playerRankPts: 1240,
  tokens:        1200,
  wins:          42,
  losses:        18,

  /* ── Selected before battle ── */
  selectedMode:      '1v1 Duel',
  selectedElem:      'fire',
  selectedElemIcon:  '🔥',
  selectedElemName:  'Fire',

  /* ── Unlocked elements (start with 5 of 9) ── */
  unlockedElems: new Set(['fire','water','lightning','earth','ice']),

  /* ── Gacha pity system ── */
  pity:    0,    // increases every spin
  spins:   0,    // lifetime spins
  gachaHistory: [],

  /* ══════════ BATTLE STATE ══════════ */
  battleActive: false,
  round:        1,

  playerHP:     100,
  playerHPMax:  100,
  playerMana:   60,
  playerManaMax:100,
  playerStatus: [],   // e.g. ['burn','stun']

  enemyHP:      100,
  enemyHPMax:   100,
  enemyMana:    60,
  enemyManaMax: 100,
  enemyStatus:  [],

  enemyElem:     'water',
  enemyElemIcon: '💧',
  enemyElemName: 'Water',

  combo:        0,
  skillCooldowns: {},  // { skillId: remainingCd }

  /* ── Helpers ── */
  getComboMult() {
    let mult = 1;
    for (const cb of COMBO_BONUSES) {
      if (this.combo >= cb.min) mult = cb.mult;
    }
    return mult;
  },

  getComboLabel() {
    let label = '';
    for (const cb of COMBO_BONUSES) {
      if (this.combo >= cb.min) label = cb.label;
    }
    return label;
  },

  /** Counter multiplier: attacker element vs defender element */
  getCounterMult(attackerKey, defenderKey) {
    const atk = ELEMENTS[attackerKey];
    if (!atk) return 1;
    if (atk.strong === defenderKey) return 1.25;
    if (atk.weak   === defenderKey) return 0.75;
    return 1;
  },

  getWinRate() {
    const total = this.wins + this.losses;
    if (total === 0) return '0%';
    return Math.round((this.wins / total) * 100) + '%';
  },

  /**
   * Save key state to localStorage so progress survives refresh.
   * Call after every meaningful change.
   */
  save() {
    try {
      const snapshot = {
        tokens:        this.tokens,
        wins:          this.wins,
        losses:        this.losses,
        playerRankPts: this.playerRankPts,
        playerRankIdx: this.playerRankIdx,
        playerLevel:   this.playerLevel,
        playerExp:     this.playerExp,
        pity:          this.pity,
        spins:         this.spins,
        unlockedElems: [...this.unlockedElems],
        gachaHistory:  this.gachaHistory.slice(0, 50)
      };
      localStorage.setItem('epa_save', JSON.stringify(snapshot));
    } catch (_) {}
  },

  load() {
    try {
      const raw = localStorage.getItem('epa_save');
      if (!raw) return;
      const s = JSON.parse(raw);
      this.tokens        = s.tokens        ?? this.tokens;
      this.wins          = s.wins          ?? this.wins;
      this.losses        = s.losses        ?? this.losses;
      this.playerRankPts = s.playerRankPts ?? this.playerRankPts;
      this.playerRankIdx = s.playerRankIdx ?? this.playerRankIdx;
      this.playerLevel   = s.playerLevel   ?? this.playerLevel;
      this.playerExp     = s.playerExp     ?? this.playerExp;
      this.pity          = s.pity          ?? this.pity;
      this.spins         = s.spins         ?? this.spins;
      if (Array.isArray(s.unlockedElems)) this.unlockedElems = new Set(s.unlockedElems);
      if (Array.isArray(s.gachaHistory))  this.gachaHistory  = s.gachaHistory;
    } catch (_) {}
  },

  /**
   * Add EXP and level up if needed.
   * @param {number} amount
   */
  addExp(amount) {
    this.playerExp += amount;
    while (this.playerExp >= this.playerExpMax) {
      this.playerExp -= this.playerExpMax;
      this.playerLevel++;
      this.playerExpMax = Math.round(this.playerExpMax * 1.2);
    }
  },

  /**
   * Add rank points and handle rank up/down.
   * @param {number} delta positive = win, negative = loss
   */
  addRankPts(delta) {
    this.playerRankPts += delta;
    if (this.playerRankPts < 0) this.playerRankPts = 0;
  }
};
