/**
 * main.js — Game initialization
 * Elemental Power Arena
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load saved progress
  G.load();

  // Sync secret element pills based on unlocked state
  ['shadow','light','poison','cosmic'].forEach(key => {
    if (G.unlockedElems.has(key)) {
      unlockSecretPill(key);
    }
  });

  // Sync token display
  _setVal('token-count', G.tokens.toLocaleString());

  // Sync avatar
  const icon = G.selectedElemIcon || '🔥';
  const ma = document.getElementById('menu-avatar');
  const pa = document.getElementById('profile-avatar');
  if (ma) ma.textContent = icon;
  if (pa) pa.textContent = icon;

  // Render gacha history if any
  if (G.gachaHistory.length > 0) renderGachaHistory();

  // Render initial leaderboard & profile
  renderLeaderboard();
  renderProfile();

  // Render rank pills in profile
  renderProfile();

  console.log('⚡ Elemental Power Arena — Loaded! Version 1.0');
  console.log(`Progress: Wins ${G.wins} | Tokens ${G.tokens} | Level ${G.playerLevel}`);
});
