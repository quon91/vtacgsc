// ═══════════════════════════════════════════════════════════════
//  VTAC GSC — SHARED NAV MANAGER  (v2)
//  Add <script src="/js/nav.js"></script> after firebase-config.js
//  on EVERY page (this was missing from some pages, which is why
//  logos and avatars vanished on them).
//
//  What this file does:
//  1. NAV LINKS — renders ONE consistent set of nav links into
//     #nav-links on every page. Pages no longer hardcode different
//     link sets (that's what made the "Wings" tab appear on Roster
//     and disappear everywhere else). Edit NAV_LINKS below to add
//     or remove a tab site-wide.
//     Pages with a custom nav (e.g. master-admin's "← Back to Site")
//     simply don't use id="nav-links", so they're left alone.
//  2. BRANDING — applies the site logo + org name from Firestore
//     settings/site to ALL .nav-emblem elements by CLASS (the old
//     version targeted id="nav-emblem", which several pages didn't
//     have — that's why the logo never appeared on them). Branding
//     is cached in sessionStorage so it paints instantly on every
//     page without waiting for Firestore.
//  3. AUTH UI — window.updateNavUI is called by firebase-config.js
//     on every auth state change. It renders the My Profile button
//     and the pilot's avatar. The avatar URL is cached in
//     sessionStorage so it persists across page loads.
//
//  IMPORTANT: pages must NOT overwrite #nav-right-area in their own
//  onAuthReady — that stomps the avatar this file renders.
// ═══════════════════════════════════════════════════════════════

(function () {

  // ── 1. SINGLE SOURCE OF TRUTH FOR NAV LINKS ─────────────────
  var NAV_LINKS = [
    { href: '/index.html',                label: 'Home' },
    { href: '/pages/wings.html',          label: 'Wings' },
    { href: '/pages/roster.html',         label: 'Roster' },
    { href: '/pages/bases.html',          label: 'Bases' },
    { href: '/pages/fleet.html',          label: 'Fleet' },
    { href: '/pages/events.html',         label: 'Events' },
    { href: '/pages/sop.html',            label: 'SOPs' },
    { href: '/pages/training/index.html', label: 'Training' },
    { href: '/pages/flights.html',        label: 'Flight Log' },
    { href: '/pages/flight-plan.html',    label: 'Flight Planner' },
  ];

  function renderNavLinks() {
    var el = document.getElementById('nav-links');
    if (!el) return;                          // page has no standard nav
    if (el.hasAttribute('data-custom-nav')) return; // page opted out
    var path = window.location.pathname;
    if (path === '/' || path === '') path = '/index.html';
    el.innerHTML = NAV_LINKS.map(function (l) {
      var active = (path === l.href);
      return '<a href="' + l.href + '"' + (active ? ' class="active"' : '') + '>' + l.label + '</a>';
    }).join('');
  }

  // ── 2. BRANDING (site logo, badge text, org name) ───────────
  function applyBranding(d) {
    if (!d) return;
    var emblems = document.querySelectorAll('.nav-emblem');
    if (d.logoUrl) {
      emblems.forEach(function (em) {
        em.innerHTML = '<img src="' + d.logoUrl + '" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
      });
    } else if (d.badge) {
      emblems.forEach(function (em) { em.textContent = d.badge; });
    }
    if (d.orgName) {
      document.querySelectorAll('.nav-brand-text .name').forEach(function (n) {
        n.textContent = d.orgName;
      });
    }
  }

  function initBranding() {
    // Instant paint from session cache — no Firestore round-trip flicker
    try {
      var cached = JSON.parse(sessionStorage.getItem('vtac_site') || 'null');
      if (cached) applyBranding(cached);
    } catch (e) {}

    // Fresh fetch from Firestore, then refresh the cache
    if (typeof db === 'undefined') return;
    db.collection('settings').doc('site').get().then(function (doc) {
      if (!doc.exists) return;
      var d = doc.data();
      var fresh = {
        logoUrl: d.logoUrl || '',
        badge:   d.badge   || '',
        orgName: d.orgName || ''
      };
      try { sessionStorage.setItem('vtac_site', JSON.stringify(fresh)); } catch (e) {}
      applyBranding(fresh);
    }).catch(function () {});
  }

  // ── 3. AUTH-AWARE NAV UI ─────────────────────────────────────
  window.updateNavUI = function (user, pilot) {
    var navArea  = document.getElementById('nav-right-area');
    var authArea = document.getElementById('nav-auth-area');
    var userArea = document.getElementById('nav-user-area');

    if (user) {
      // Resolve avatar: pilot doc first, then session cache fallback
      var avatarUrl = (pilot && pilot.avatarUrl) || '';
      if (avatarUrl) {
        try { sessionStorage.setItem('vtac_avatar', avatarUrl); } catch (e) {}
      } else {
        try { avatarUrl = sessionStorage.getItem('vtac_avatar') || ''; } catch (e) {}
      }

      if (navArea) {
        navArea.innerHTML =
          '<a href="/pages/profile.html" class="btn btn-outline btn-sm">My Profile</a>' +
          (avatarUrl
            ? '<a href="/pages/profile.html" title="My Profile"><img src="' + avatarUrl + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);margin-left:8px;vertical-align:middle;display:inline-block" alt=""></a>'
            : '');
      }
      if (authArea) authArea.style.display = 'none';
      if (userArea) {
        userArea.style.display = 'flex';
        var nameEl   = document.getElementById('nav-pilot-name');
        var rankEl   = document.getElementById('nav-rank-badge');
        var avatarEl = document.getElementById('nav-avatar');
        if (pilot) {
          if (nameEl) nameEl.textContent = pilot.callsign || pilot.displayName || '';
          if (rankEl) {
            var role = (typeof getDisplayRole === 'function') ? getDisplayRole(pilot) : null;
            if (role) {
              rankEl.textContent = role.name;
              rankEl.style.background  = (role.color || '#c8a951') + '26';
              rankEl.style.color       = role.color || '#c8a951';
              rankEl.style.borderColor = (role.color || '#c8a951') + '4d';
            } else {
              rankEl.textContent = (typeof getRankAbbr === 'function') ? getRankAbbr(pilot.rank || 'ab') : '';
            }
          }
          if (avatarEl && avatarUrl) avatarEl.src = avatarUrl;
        }
      }
    } else {
      try { sessionStorage.removeItem('vtac_avatar'); } catch (e) {}
      if (navArea) {
        navArea.innerHTML = '<a href="/pages/login.html" class="btn btn-outline btn-sm">Login</a>';
      }
      if (authArea) authArea.style.display = '';
      if (userArea) userArea.style.display = 'none';
    }
  };

  // ── VIEW-AS BANNER ───────────────────────────────────────────
  // Called by firebase-config.js ONLY after it has verified that the
  // real signed-in pilot is master admin. Shows a fixed amber bar on
  // every page while a "View As" role simulation is active, with an
  // Exit button that clears the override and returns to the admin
  // dashboard.
  window.renderViewAsBanner = function (roleId) {
    if (document.getElementById('viewas-banner')) return;
    var label;
    if (roleId === 'logged_out') {
      label = 'Logged-out visitor';
    } else if (typeof ROLES !== 'undefined' && ROLES[roleId]) {
      label = ROLES[roleId].name;
    } else {
      label = roleId;
    }
    var bar = document.createElement('div');
    bar.id = 'viewas-banner';
    bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#e09030;color:#0a0c14;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:14px;padding:9px 16px;box-shadow:0 -4px 16px rgba(0,0,0,.45);font-family:var(--sans,sans-serif)';
    bar.innerHTML =
      '<span>👁 Viewing site as: ' + label + '</span>' +
      '<button id="viewas-exit-btn" style="background:#0a0c14;color:#e09030;border:none;border-radius:16px;padding:5px 16px;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit">Exit view</button>';
    document.body.appendChild(bar);
    document.body.style.paddingBottom = '52px'; // keep footer clear of the bar
    document.getElementById('viewas-exit-btn').addEventListener('click', function () {
      try { sessionStorage.removeItem('vtac_viewas'); } catch (e) {}
      window.location.href = '/pages/master-admin.html';
    });
  };

  // ── BOOT ─────────────────────────────────────────────────────
  function boot() {
    renderNavLinks();
    initBranding();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
