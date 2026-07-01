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

// ── SITE LOGO ─────────────────────────────────────────────────
// Swaps the "GSC" text emblem for an uploaded logo image, if one
// is configured in Firestore settings/site → logoUrl.
// Falls back to the text badge if no logo has been set.
(function() {
  function applyLogo(url, badgeText) {
    const emblem = document.getElementById('nav-emblem');
    if (!emblem) return;
    if (url) {
      emblem.innerHTML = '<img src="' + url + '" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
    } else if (badgeText) {
      emblem.textContent = badgeText;
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (typeof db === 'undefined') return;
    db.collection('settings').doc('site').get().then(function(doc) {
      if (!doc.exists) return;
      const d = doc.data();
      applyLogo(d.logoUrl, d.badge);
      if (d.orgName) {
        const nameEl = document.getElementById('nav-org-name');
        if (nameEl) nameEl.textContent = d.orgName;
      }
    }).catch(function() {});
  });
})();
