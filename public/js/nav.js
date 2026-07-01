// ═══════════════════════════════════════════════════════════════
//  VTAC GSC — SHARED NAV MANAGER
//  Add <script src="/js/nav.js"></script> after firebase-config.js
//  on every page. Handles nav auth state centrally.
// ═══════════════════════════════════════════════════════════════

(function() {
  // Called by firebase-config.js onAuthStateChanged
  // Patches the global onAuthReady to always update nav first
  const _pageOnAuthReady = window.onAuthReady || function(){};

  window.onAuthReady = function(user, pilot) {
    // ── Always update nav ──────────────────────────────────────
    updateNav(user, pilot);
    // ── Then call the page's own onAuthReady ───────────────────
    _pageOnAuthReady(user, pilot);
  };

  function updateNav(user, pilot) {
    // Try the standard nav-right-area used by most pages
    const navArea = document.getElementById('nav-right-area');
    // Also try the auth/user area split used by homepage and some pages
    const authArea = document.getElementById('nav-auth-area');
    const userArea = document.getElementById('nav-user-area');

    if (user) {
      // User is authenticated - show profile link
      if (navArea) {
        navArea.innerHTML = '<a href="/pages/profile.html" class="btn btn-outline btn-sm">My Profile</a>';
        // If pilot data is available, show avatar too
        if (pilot && pilot.avatarUrl) {
          navArea.innerHTML = `
            <a href="/pages/profile.html" class="btn btn-outline btn-sm">My Profile</a>
            <img src="${pilot.avatarUrl}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);margin-left:8px;vertical-align:middle" alt="">`;
        }
      }
      // Handle split auth-area / user-area pattern
      if (authArea) authArea.style.display = 'none';
      if (userArea) {
        userArea.style.display = 'flex';
        const nameEl = document.getElementById('nav-pilot-name');
        const rankEl = document.getElementById('nav-rank-badge');
        const avatarEl = document.getElementById('nav-avatar');
        if (pilot) {
          if (nameEl) nameEl.textContent = pilot.callsign || pilot.displayName || '';
          if (rankEl) {
            const role = typeof getDisplayRole === 'function' ? getDisplayRole(pilot) : null;
            if (role) {
              rankEl.textContent = role.name;
              rankEl.style.background = (role.color || '#c8a951') + '26';
              rankEl.style.color = role.color || '#c8a951';
              rankEl.style.borderColor = (role.color || '#c8a951') + '4d';
            } else {
              rankEl.textContent = typeof getRankAbbr === 'function' ? getRankAbbr(pilot.rank || 'ab') : '';
            }
          }
          if (avatarEl && pilot.avatarUrl) avatarEl.src = pilot.avatarUrl;
        }
      }
    } else {
      // Not logged in - show Login button
      if (navArea) {
        navArea.innerHTML = '<a href="/pages/login.html" class="btn btn-outline btn-sm">Login</a>';
      }
      if (authArea) authArea.style.display = '';
      if (userArea) userArea.style.display = 'none';
    }
  }

  // ── Also handle the case where onAuthReady was already defined ─
  // (some pages define it before nav.js loads)
  // We re-patch after DOMContentLoaded to catch late definitions
  document.addEventListener('DOMContentLoaded', () => {
    const lateDefined = window.onAuthReady;
    if (lateDefined !== window.onAuthReady) {
      // Already patched above, skip
    }
  });

})();
