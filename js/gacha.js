/**
 * gacha.js — Gacha spin logic with pity system
 * Elemental Power Arena
 */

/**
 * Roll one item from the gacha pool.
 * Pity rules:
 *   - After every 10 spins → guaranteed Epic or higher
 *   - After 80 cumulative spins → guaranteed Legendary or Mythic (reset pity)
 */
function rollOne() {
  G.pity++;
  G.spins++;

  // Pity override: 80 → mythic/legendary guaranteed
  if (G.pity >= 80) {
    G.pity = 0;
    return _pickByRarity(['mythic', 'legendary']);
  }

  // Soft pity every 10
  if (G.pity % 10 === 0) {
    return _pickByRarity(['epic', 'legendary', 'mythic']);
  }

  // Normal weighted roll
  const r = Math.random();
  if      (r < 0.005) return _pickByRarity(['mythic']);
  else if (r < 0.025) return _pickByRarity(['legendary']);
  else if (r < 0.10)  return _pickByRarity(['epic']);
  else if (r < 0.30)  return _pickByRarity(['rare']);
  else                return _pickByRarity(['common']);
}

function _pickByRarity(rarities) {
  const pool = GACHA_POOL.filter(g => rarities.includes(g.rarity));
  if (!pool.length) return GACHA_POOL[0]; // fallback
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Execute a spin (1 or 10).
 * @param {number} times
 */
function doSpin(times) {
  const cost = times === 10 ? 900 : 100;
  if (G.tokens < cost) {
    alert('Token tidak cukup! Menangkan battle untuk mendapat lebih banyak token. 🔮');
    return;
  }
  G.tokens -= cost;

  const results = [];
  for (let i = 0; i < times; i++) {
    const item = rollOne();
    results.push(item);
    G.gachaHistory.unshift(item);

    // Handle unlocks
    if (item.unlock) {
      G.unlockedElems.add(item.unlock);
      unlockSecretPill(item.unlock);
    }
  }

  // Show last (most exciting) result
  const highlight = results.sort((a, b) => _rarityOrder(b) - _rarityOrder(a))[0];
  renderSpinResult(highlight, times);
  renderGachaHistory();

  // Sync token display
  _setVal('token-count', G.tokens.toLocaleString());
  _setVal('pity-count',  G.pity);
  const pityBar = document.getElementById('pity-bar');
  if (pityBar) pityBar.style.width = Math.round((G.pity / 80) * 100) + '%';

  G.save();
}

function _rarityOrder(item) {
  return { common:0, rare:1, epic:2, legendary:3, mythic:4 }[item.rarity] ?? 0;
}

function renderSpinResult(item, totalSpins) {
  const area = document.getElementById('spin-area');
  if (!area) return;
  const extra = totalSpins > 1
    ? `<div style="font-size:11px;color:var(--text2);margin-top:6px">Hasil terbaik dari ${totalSpins}x spin</div>`
    : '';
  area.innerHTML = `
    <span class="rarity-badge rarity-${item.rarity}">${item.rarity.toUpperCase()}</span>
    <span class="spin-icon">${item.icon}</span>
    <div class="spin-name">${item.name}</div>
    <div class="spin-desc">${item.desc}</div>
    ${extra}
  `;
}

function renderGachaHistory() {
  const container = document.getElementById('gacha-history');
  if (!container) return;
  container.innerHTML = G.gachaHistory.slice(0, 10).map(h => `
    <div class="history-row">
      <span class="history-icon">${h.icon}</span>
      <span class="history-name">${h.name}</span>
      <span class="rarity-badge rarity-${h.rarity}" style="font-size:10px;padding:2px 8px">${h.rarity}</span>
    </div>
  `).join('');
}
