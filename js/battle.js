/**
 * battle.js — Battle engine
 * Elemental Power Arena
 */

/* ─── START BATTLE ──────────────────────────────────────────── */
function startBattle() {
  // Reset state
  G.playerHP    = G.playerHPMax  = 100;
  G.enemyHP     = G.enemyHPMax   = 100;
  G.playerMana  = G.playerManaMax = 60;
  G.enemyMana   = G.enemyManaMax  = 60;
  G.playerStatus = [];
  G.enemyStatus  = [];
  G.combo        = 0;
  G.round        = 1;
  G.skillCooldowns = {};
  G.battleActive = true;

  // Pick enemy element (not same as player unless there's only 1)
  const enemyPool = Object.keys(ELEMENTS).filter(k => k !== G.selectedElem && k !== 'cosmic');
  G.enemyElem     = enemyPool[Math.floor(Math.random() * enemyPool.length)];
  G.enemyElemIcon = ELEMENTS[G.enemyElem].icon;
  G.enemyElemName = ELEMENTS[G.enemyElem].name;

  // Apply Mirror Mode override
  const mode = GAME_MODES[G.selectedMode] || {};
  if (mode.mirror) {
    G.enemyElem     = G.selectedElem;
    G.enemyElemIcon = G.selectedElemIcon;
    G.enemyElemName = G.selectedElemName;
  }

  // Render battle header
  const modeBadge = document.getElementById('battle-mode-label');
  if (modeBadge) modeBadge.textContent = '⚔️ ' + G.selectedMode.toUpperCase();

  _setVal('player-elem-icon', G.selectedElemIcon);
  _setVal('player-elem-name', G.selectedElemName);
  _setVal('enemy-elem-icon',  G.enemyElemIcon);
  _setVal('enemy-elem-name',  G.enemyElemName);
  _setVal('turn-info', 'Giliran kamu');

  const alert = document.getElementById('battle-alert');
  if (alert) alert.className = 'alert-msg';

  clearLog();
  addLog('⚔️ Battle dimulai! Mode: ' + G.selectedMode, 'highlight');
  addLog(`Kamu (${G.selectedElemName}) vs Bot (${G.enemyElemName})`, '');
  _checkCounterAdv();

  updateBattleUI();
  updateComboUI();
  updateRoundUI();
  renderSkills();

  showScreen('screen-battle');
}

/* ─── COUNTER ADVANTAGE HINT ─────────────────────────────────── */
function _checkCounterAdv() {
  const mult = G.getCounterMult(G.selectedElem, G.enemyElem);
  if (mult > 1) addLog('✨ Advantage! Elemenmu kuat vs musuh! Damage +25%', 'combo');
  if (mult < 1) addLog('⚠️ Disadvantage! Elemen musuh kuat vs kamu! Damage -25%', 'dmg');
}

/* ─── SKILL RENDERING ────────────────────────────────────────── */
function renderSkills() {
  const mode = GAME_MODES[G.selectedMode] || {};
  const elemKey = G.selectedElem;
  const skills = SKILLS[elemKey] || SKILLS['fire'];
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  grid.innerHTML = '';

  skills.forEach(sk => {
    const cd     = mode.chaos ? 0 : (G.skillCooldowns[sk.id] || 0);
    const noMana = G.playerMana < sk.mana;

    const btn = document.createElement('button');
    btn.className = [
      'skill-btn',
      sk.ultimate ? 'ultimate' : '',
      cd > 0 ? 'cooldown' : '',
      (noMana && cd === 0) ? 'no-mana' : ''
    ].filter(Boolean).join(' ');

    btn.innerHTML = `
      <span class="skill-icon">${sk.icon}</span>
      <span class="skill-name-s">${sk.name}</span>
      <span class="skill-cd">${cd > 0 ? 'CD: ' + cd : '✓ ready'}</span>
      <span class="skill-cost">${sk.mana} mana</span>
      ${cd > 0 ? `<div class="cd-overlay">${cd}</div>` : ''}
    `;

    if (cd === 0 && !noMana && G.battleActive) {
      btn.addEventListener('click', () => useSkill(sk));
    }
    grid.appendChild(btn);
  });
}

/* ─── USE SKILL ──────────────────────────────────────────────── */
function useSkill(sk) {
  if (!G.battleActive) return;
  if (G.playerMana < sk.mana) { addLog('⚠️ Mana tidak cukup!', 'dmg'); return; }

  const mode = GAME_MODES[G.selectedMode] || {};

  G.playerMana -= sk.mana;
  if (!mode.chaos) G.skillCooldowns[sk.id] = sk.maxCd;

  const counterMult = G.getCounterMult(G.selectedElem, G.enemyElem);
  const comboMult   = G.getComboMult();

  if (sk.heal) {
    // ── HEAL ──
    const healed = Math.abs(sk.dmg);
    G.playerHP = Math.min(G.playerHPMax, G.playerHP + healed);
    G.combo++;
    addLog(`💚 ${sk.name}: Pulihkan ${healed} HP!`, 'heal');
  } else if (sk.dmg > 0) {
    // ── DAMAGE ──
    let dmg = Math.round(sk.dmg * counterMult * comboMult);

    // One Hit mode
    if (mode.oneHit) dmg = G.enemyHPMax;

    G.enemyHP = Math.max(0, G.enemyHP - dmg);
    G.combo++;

    const comboTag = G.combo >= 3 ? ` [Combo x${G.combo}!]` : '';
    addLog(`⚔️ ${sk.name} → ${dmg} damage${comboTag}`, 'dmg');

    if (G.combo >= 3) addLog(`🔥 COMBO x${G.combo}! ${G.getComboLabel()}`, 'combo');

    if (sk.status) {
      G.enemyStatus.push(sk.status);
      addLog(`✨ Efek: ${sk.status} pada musuh!`, 'combo');
    }
  } else if (sk.status === 'shield' || sk.dmg === 0) {
    // ── BUFF / SHIELD ──
    if (sk.status) {
      G.playerStatus.push(sk.status);
      addLog(`🛡️ ${sk.name}: ${sk.status} aktif!`, 'heal');
    }
    G.combo++;
  }

  updateComboUI();

  if (G.enemyHP <= 0) { endBattle(true); return; }

  updateBattleUI();
  renderSkills();

  // Enemy turn after delay
  setTimeout(enemyTurn, 900);
}

/* ─── BASIC ACTIONS ──────────────────────────────────────────── */
function doAction(type) {
  if (!G.battleActive) return;

  if (type === 'dodge') {
    addLog('💨 Dodge! Kamu menghindari serangan!', 'heal');
    G.combo = 0;
    updateComboUI();
    G.playerMana = Math.min(G.playerManaMax, G.playerMana + 5);
    setTimeout(enemyTurn, 600);
  } else if (type === 'basic') {
    const counterMult = G.getCounterMult(G.selectedElem, G.enemyElem);
    const comboMult   = G.getComboMult();
    const base = 8 + Math.random() * 6;
    const dmg  = Math.round(base * counterMult * comboMult);

    const mode = GAME_MODES[G.selectedMode] || {};
    G.enemyHP = Math.max(0, G.enemyHP - (mode.oneHit ? G.enemyHPMax : dmg));
    G.combo++;
    G.playerMana = Math.min(G.playerManaMax, G.playerMana + 8);

    addLog(`👊 Basic Attack → ${dmg} damage`, 'dmg');
    updateComboUI();

    if (G.enemyHP <= 0) { endBattle(true); return; }
    updateBattleUI();
    renderSkills();
    setTimeout(enemyTurn, 700);
  }
}

/* ─── ENEMY TURN (BOT AI) ────────────────────────────────────── */
function enemyTurn() {
  if (!G.battleActive) return;
  G.round++;
  updateRoundUI();
  _setVal('turn-info', 'Giliran musuh...');

  const mode = GAME_MODES[G.selectedMode] || {};
  const enemySkills = SKILLS[G.enemyElem] || SKILLS['fire'];

  // Status check — stun/freeze blocks enemy
  const blocked = G.enemyStatus.find(s => s === 'stun' || s === 'freeze');
  if (blocked) {
    G.enemyStatus = G.enemyStatus.filter(s => s !== blocked);
    addLog(`⚡ Musuh kena ${blocked}! Serangan diblokir!`, 'heal');
    G.playerMana = Math.min(G.playerManaMax, G.playerMana + 10);
  } else {
    // Bot picks a random offensive skill (not ultimate unless HP<30%)
    const canUltimate = G.enemyHP < 30;
    const pool = enemySkills.filter(sk => sk.dmg > 0 && (!sk.ultimate || canUltimate));
    const sk   = pool[Math.floor(Math.random() * pool.length)] || enemySkills[0];

    const counterMult = G.getCounterMult(G.enemyElem, G.selectedElem);
    let dmg = Math.round((sk.dmg + (Math.random() * 6 - 3)) * counterMult);
    if (dmg < 0) dmg = 0;

    // Player shield halves damage
    const hasShield = G.playerStatus.includes('shield');
    if (hasShield) {
      dmg = Math.round(dmg * 0.5);
      G.playerStatus = G.playerStatus.filter(s => s !== 'shield');
    }

    const mode2 = GAME_MODES[G.selectedMode] || {};
    G.playerHP = Math.max(0, G.playerHP - (mode2.oneHit ? G.playerHPMax : dmg));

    const shieldTxt = hasShield ? ' (shield -50%)' : '';
    addLog(`🤖 Bot ${sk.name} → ${dmg} damage${shieldTxt}`, '');

    if (sk.status && sk.status !== 'shield') {
      G.playerStatus.push(sk.status);
      addLog(`⚠️ Kamu terkena ${sk.status}!`, 'dmg');
    }
  }

  // Passive mana regen
  G.enemyMana  = Math.min(G.enemyManaMax, G.enemyMana  + 10);
  G.playerMana = Math.min(G.playerManaMax, G.playerMana + 6);

  // Tick cooldowns (or clear if Chaos Mode)
  if (mode.chaos) {
    G.skillCooldowns = {};
  } else {
    Object.keys(G.skillCooldowns).forEach(k => {
      if (G.skillCooldowns[k] > 0) G.skillCooldowns[k]--;
    });
  }

  if (G.playerHP <= 0) { endBattle(false); return; }

  _setVal('turn-info', 'Giliran kamu');
  updateBattleUI();
  renderSkills();
}

/* ─── END BATTLE ─────────────────────────────────────────────── */
function endBattle(won) {
  G.battleActive = false;

  const alertEl = document.getElementById('battle-alert');
  if (!alertEl) return;

  if (won) {
    G.wins++;
    G.tokens += 200;
    G.addExp(150);
    G.addRankPts(25);
    alertEl.className = 'alert-msg victory';
    alertEl.textContent = '🏆 MENANG! +150 EXP | +200 Token | +25 Rank Points';
    addLog('🏆 KAMU MENANG! Luar biasa! 🎉', 'highlight');
  } else {
    G.losses++;
    G.addExp(50);
    G.addRankPts(-10);
    alertEl.className = 'alert-msg defeat';
    alertEl.textContent = '💀 KALAH! +50 EXP | Coba lagi! Kamu bisa!';
    addLog('💀 Kamu kalah. Strategi perlu ditingkatkan!', 'dmg');
  }

  // Update token display
  _setVal('token-count', G.tokens.toLocaleString());
  G.save();
}
