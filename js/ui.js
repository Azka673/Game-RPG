/**
 * ui.js — UI helpers: screen navigation, rendering static sections
 * Elemental Power Arena
 */

/* ─── SCREEN NAVIGATION ──────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  const navMap = {
    'screen-menu':        'nav-menu',
    'screen-mode':        'nav-mode',
    'screen-gacha':       'nav-gacha',
    'screen-profile':     'nav-profile',
    'screen-leaderboard': 'nav-lb'
  };
  if (navMap[id]) setNav(navMap[id]);

  // Refresh dynamic sections on visit
  if (id === 'screen-leaderboard') renderLeaderboard();
  if (id === 'screen-profile')     renderProfile();
}

function setNav(id) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

/* ─── ELEMENT SELECTION ──────────────────────────────────────── */
function selectMode(el, mode) {
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  G.selectedMode = mode;
}

function selectElem(el, key, icon, name) {
  if (!G.unlockedElems.has(key)) return;
  document.querySelectorAll('.element-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  G.selectedElem     = key;
  G.selectedElemIcon = icon;
  G.selectedElemName = name;
  _syncAvatars(icon);
}

function selectSecretElem(icon, name, key) {
  if (!G.unlockedElems.has(key)) return;
  document.querySelectorAll('.element-card').forEach(c => c.classList.remove('selected'));
  G.selectedElem     = key;
  G.selectedElemIcon = icon;
  G.selectedElemName = name;
  _syncAvatars(icon);
}

function _syncAvatars(icon) {
  const ma = document.getElementById('menu-avatar');
  const pa = document.getElementById('profile-avatar');
  if (ma) ma.textContent = icon;
  if (pa) pa.textContent = icon;
}

/* ─── UNLOCK SECRET ELEMENT PILL ────────────────────────────── */
function unlockSecretPill(key) {
  const pill = document.getElementById('pill-' + key);
  if (pill) pill.classList.remove('locked-el');
}

/* ─── LEADERBOARD ────────────────────────────────────────────── */
function renderLeaderboard() {
  const container = document.getElementById('lb-list');
  if (!container) return;

  // Inject player into a copy of data at their real rank
  const data = LEADERBOARD.map(p => ({ ...p }));

  // Find where player fits by pts (naively inject at rank 4 for demo)
  const playerEntry = {
    rank:4, name: G.playerName + ' (kamu)',
    elem: G.selectedElemIcon,
    pts: G.playerRankPts.toLocaleString(),
    badge: RANKS[G.playerRankIdx],
    isYou: true
  };

  // Build list with player injected
  const finalList = [];
  let inserted = false;
  data.forEach(p => {
    if (!inserted && p.rank >= 4) {
      finalList.push(playerEntry);
      inserted = true;
    }
    if (p.rank !== 4) finalList.push(p);
  });
  if (!inserted) finalList.push(playerEntry);

  const medals = ['🥇','🥈','🥉'];
  container.innerHTML = finalList.map((p, i) => `
    <div class="leaderboard-item ${p.isYou ? 'is-you' : ''}">
      <span class="lb-rank">${i < 3 ? medals[i] : p.rank || (i+1)}</span>
      <span class="lb-elem">${p.elem}</span>
      <span class="lb-name">${p.name}</span>
      <span class="lb-pts">${p.pts} pts</span>
      <span class="lb-badge">${p.badge}</span>
    </div>
  `).join('');
}

/* ─── PROFILE ────────────────────────────────────────────────── */
function renderProfile() {
  // Stats
  const sw = document.getElementById('stat-wins');
  const sl = document.getElementById('stat-losses');
  const sr = document.getElementById('stat-wr');
  if (sw) sw.textContent = G.wins;
  if (sl) sl.textContent = G.losses;
  if (sr) sr.textContent = G.getWinRate();

  // EXP bar
  const expFill = document.querySelector('.exp-fill');
  if (expFill) expFill.style.width = Math.round((G.playerExp / G.playerExpMax) * 100) + '%';
  const expText = document.querySelector('.exp-text');
  if (expText) expText.textContent = `EXP: ${G.playerExp}/${G.playerExpMax}`;

  // Collection
  const items = document.querySelectorAll('.coll-item');
  const ordered = ['fire','water','lightning','earth','ice','shadow','light','poison','cosmic'];
  items.forEach((item, i) => {
    const key = ordered[i];
    if (key && G.unlockedElems.has(key)) {
      item.classList.add('owned');
      item.classList.remove('locked-c');
    } else {
      item.classList.remove('owned');
      item.classList.add('locked-c');
    }
  });

  // Rank pills
  const rankList = document.getElementById('rank-list');
  if (rankList) {
    rankList.innerHTML = RANKS.map((r, i) => `
      <span class="rank-pill ${r.toLowerCase()} ${i === G.playerRankIdx ? 'active' : ''}">${r}</span>
    `).join('');
  }
}

/* ─── BATTLE LOG HELPERS ─────────────────────────────────────── */
function addLog(msg, type) {
  const log = document.getElementById('battle-log');
  if (!log) return;
  const div = document.createElement('div');
  div.className = 'log-entry' + (type ? ' ' + type : '');
  div.textContent = msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function clearLog() {
  const log = document.getElementById('battle-log');
  if (log) log.innerHTML = '';
}

/* ─── BATTLE UI UPDATE ───────────────────────────────────────── */
function updateBattleUI() {
  // Player
  _setVal('player-hp-val',   Math.max(0, Math.round(G.playerHP)));
  _setBar('player-hp-bar',   G.playerHP, G.playerHPMax);
  _setVal('player-mana-val', Math.round(G.playerMana));
  _setBar('player-mana-bar', G.playerMana, G.playerManaMax);

  // Enemy
  _setVal('enemy-hp-val',    Math.max(0, Math.round(G.enemyHP)));
  _setBar('enemy-hp-bar',    G.enemyHP, G.enemyHPMax);
  _setVal('enemy-mana-val',  Math.round(G.enemyMana));
  _setBar('enemy-mana-bar',  G.enemyMana, G.enemyManaMax);

  // Status
  _renderStatus('player-status', G.playerStatus);
  _renderStatus('enemy-status',  G.enemyStatus);
}

function _setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function _setBar(id, val, max) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.max(0, Math.min(100, (val / max) * 100)) + '%';
}

function _renderStatus(id, statuses) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = statuses.map(s => `<span class="status-tag ${s}">${s}</span>`).join('');
}

function updateComboUI() {
  _setVal('combo-num', G.combo);
  const bonus = document.getElementById('combo-bonus');
  if (bonus) bonus.textContent = G.getComboLabel();
}

function updateRoundUI() {
  _setVal('battle-round', 'Ronde ' + G.round);
}
