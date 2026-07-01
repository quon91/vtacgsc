// ═══════════════════════════════════════════════════════════════
//  VTAC GSC — SHARED NAV MANAGER
//  Add <script src="/js/nav.js"></script> after firebase-config.js
//  on every page. Handles nav auth state centrally.
//
//  IMPORTANT: This defines window.updateNavUI (NOT onAuthReady).
//  firebase-config.js calls updateNavUI() automatically alongside
//  each page's own onAuthReady() — this avoids the JS function
//  declaration hoisting collision that broke the old approach
//  (pages declaring "function onAuthReady(){}" would silently
//  overwrite anything nav.js assigned to window.onAuthReady).
// ═══════════════════════════════════════════════════════════════

window.updateNavUI = function(user, pilot) {
  const navArea = document.getElementById('nav-right-area');
  const authArea = document.getElementById('nav-auth-area');
  const userArea = document.getElementById('nav-user-area');

  if (user) {
    if (navArea) {
      navArea.innerHTML = '<a href="/pages/profile.html" class="btn btn-outline btn-sm">My Profile</a>';
      if (pilot && pilot.avatarUrl) {
        navArea.innerHTML =
          '<a href="/pages/profile.html" class="btn btn-outline btn-sm">My Profile</a>' +
          '<img src="' + pilot.avatarUrl + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);margin-left:8px;vertical-align:middle" alt="">';
      }
    }
    if (authArea) authArea.style.display = 'none';
    if (userArea) {
      userArea.style.display = 'flex';
      const nameEl = document.getElementById('nav-pilot-name');
      const rankEl = document.getElementById('nav-rank-badge');
      const avatarEl = document.getElementById('nav-avatar');
      if (pilot) {
        if (nameEl) nameEl.textContent = pilot.callsign || pilot.displayName || '';
        if (rankEl) {
          const role = (typeof getDisplayRole === 'function') ? getDisplayRole(pilot) : null;
          if (role) {
            rankEl.textContent = role.name;
            rankEl.style.background = (role.color || '#c8a951') + '26';
            rankEl.style.color = role.color || '#c8a951';
            rankEl.style.borderColor = (role.color || '#c8a951') + '4d';
          } else {
            rankEl.textContent = (typeof getRankAbbr === 'function') ? getRankAbbr(pilot.rank || 'ab') : '';
          }
        }
        if (avatarEl && pilot.avatarUrl) avatarEl.src = pilot.avatarUrl;
      }
    }
  } else {
    if (navArea) {
      navArea.innerHTML = '<a href="/pages/login.html" class="btn btn-outline btn-sm">Login</a>';
    }
    if (authArea) authArea.style.display = '';
    if (userArea) userArea.style.display = 'none';
  }
};
