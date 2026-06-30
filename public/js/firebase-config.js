// ═══════════════════════════════════════════════════════════════
//  VTAC GLOBAL STRIKE COMMAND — FIREBASE CONFIG
//  Replace the firebaseConfig object with YOUR Firebase project
//  values from: console.firebase.google.com → Project Settings
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyBLdlfTeRz9BIRlEaw7M4QPmgrtFin9ueo",
  authDomain:        "vtacgsc.firebaseapp.com",
  databaseURL:       "https://vtacgsc-default-rtdb.firebaseio.com",
  projectId:         "vtacgsc",
  storageBucket:     "vtacgsc.firebasestorage.app",
  messagingSenderId: "644890316006",
  appId:             "1:644890316006:web:4b99f864c98f31f2d47f27",
  measurementId:     "G-W1D1VE7C29"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = firebase.storage();

// ── WING / SQUADRON STRUCTURE ────────────────────────────────
const WINGS = {
  '7bw': {
    name: '7th Bomb Wing',
    base: 'Dyess AFB (KDYS)',
    aircraft: ['B-1B Lancer'],
    color: '#c8a951',
    squadrons: {
      '28bs': { name: '28th Bomb Squadron', callsign: 'BONE' },
      '9bs':  { name: '9th Bomb Squadron',  callsign: 'WOLF' },
    }
  },
  '509bw': {
    name: '509th Bomb Wing',
    base: 'Whiteman AFB (KSZL)',
    aircraft: ['B-2 Spirit'],
    color: '#4a90d9',
    squadrons: {
      '13bs': { name: '13th Bomb Squadron', callsign: 'SPIRIT' },
    }
  },
  '2bw': {
    name: '2nd Bomb Wing',
    base: 'Barksdale AFB (KBAD)',
    aircraft: ['B-52H Stratofortress'],
    color: '#3dba6e',
    squadrons: {
      '96bs':  { name: '96th Bomb Squadron',  callsign: 'BUFF' },
      '343bs': { name: '343rd Bomb Squadron', callsign: 'IRON' },
      '11bs':  { name: '11th Bomb Squadron',  callsign: 'STORM' },
    }
  }
};

// ── RANK STRUCTURE ───────────────────────────────────────────
const RANKS = [
  { id: 'rec',   name: 'Recruit',            abbr: 'REC',  level: 0 },
  { id: 'ab',    name: 'Airman Basic',        abbr: 'AB',   level: 1 },
  { id: 'amn',   name: 'Airman',              abbr: 'Amn',  level: 2 },
  { id: 'a1c',   name: 'Airman First Class',  abbr: 'A1C',  level: 3 },
  { id: 'sra',   name: 'Senior Airman',       abbr: 'SrA',  level: 4 },
  { id: 'ssgt',  name: 'Staff Sergeant',      abbr: 'SSgt', level: 5 },
  { id: 'tsgt',  name: 'Technical Sergeant',  abbr: 'TSgt', level: 6 },
  { id: 'msgt',  name: 'Master Sergeant',     abbr: 'MSgt', level: 7 },
  { id: '2lt',   name: 'Second Lieutenant',   abbr: '2Lt',  level: 8 },
  { id: '1lt',   name: 'First Lieutenant',    abbr: '1Lt',  level: 9 },
  { id: 'capt',  name: 'Captain',             abbr: 'Capt', level: 10 },
  { id: 'maj',   name: 'Major',               abbr: 'Maj',  level: 11 },
  { id: 'ltcol', name: 'Lieutenant Colonel',  abbr: 'LtCol',level: 12 },
  { id: 'col',   name: 'Colonel',             abbr: 'Col',  level: 13 },
  { id: 'bgen',  name: 'Brigadier General',   abbr: 'BGen', level: 14 },
  { id: 'mgen',  name: 'Major General',       abbr: 'MGen', level: 15 },
  { id: 'lgen',  name: 'Lt General',          abbr: 'LGen', level: 16 },
  { id: 'gen',   name: 'General',             abbr: 'Gen',  level: 17 },
];

// ── USAF MEDALS & DECORATIONS CATALOG ───────────────────────────
// Categorized real-world USAF decorations. Master admin (and anyone
// granted the 'award_medals' permission) can award these to pilots.
const MEDALS_CATALOG = [
  // ── Personal Decorations — stripe patterns approximate real USAF ribbons ──
  { id:'medal_honor',        name:'Medal of Honor',                             category:'Personal Decoration', tier:1,  stripes:['#5b92e5'] },
  { id:'afcross',            name:'Air Force Cross',                            category:'Personal Decoration', tier:2,  stripes:['#5b92e5','#ffffff','#5b92e5'] },
  { id:'dsm',                name:'Defense Distinguished Service Medal',        category:'Personal Decoration', tier:3,  stripes:['#002868','#ffffff','#bf0a30','#ffffff','#002868'] },
  { id:'dsm_af',             name:'Distinguished Service Medal',                category:'Personal Decoration', tier:3,  stripes:['#002868','#ffffff','#bf0a30'] },
  { id:'silver_star',        name:'Silver Star',                                category:'Personal Decoration', tier:4,  stripes:['#bf0a30','#002868','#ffffff','#002868','#bf0a30'] },
  { id:'def_superior',       name:'Defense Superior Service Medal',             category:'Personal Decoration', tier:5,  stripes:['#7c1c2c','#c9a04a','#7c1c2c'] },
  { id:'legion_merit',       name:'Legion of Merit',                            category:'Personal Decoration', tier:5,  stripes:['#ffffff','#3d2b1f','#ffffff'] },
  { id:'dfc',                name:'Distinguished Flying Cross',                 category:'Personal Decoration', tier:6,  stripes:['#bf0a30','#ffffff','#002868','#ffffff','#bf0a30'] },
  { id:'airmans_medal',      name:"Airman's Medal",                             category:'Personal Decoration', tier:6,  stripes:['#002868','#bf0a30','#ffffff','#bf0a30','#002868'] },
  { id:'bronze_star',        name:'Bronze Star Medal',                          category:'Personal Decoration', tier:7,  stripes:['#bf0a30','#ffffff','#002868','#ffffff','#bf0a30'] },
  { id:'purple_heart',       name:'Purple Heart',                               category:'Personal Decoration', tier:7,  stripes:['#5b3a78','#ffffff','#5b3a78'] },
  { id:'meritorious_svc',    name:'Meritorious Service Medal',                  category:'Personal Decoration', tier:8,  stripes:['#3c3b6e','#ffffff','#bf0a30','#ffffff','#3c3b6e'] },
  { id:'air_medal',          name:'Air Medal',                                  category:'Personal Decoration', tier:9,  stripes:['#002868','#ffd700','#002868'] },
  { id:'aerial_achievement', name:'Aerial Achievement Medal',                   category:'Personal Decoration', tier:10, stripes:['#5b92e5','#ffffff','#bf0a30','#ffffff','#5b92e5'] },
  { id:'commendation',       name:'Air Force Commendation Medal',               category:'Personal Decoration', tier:11, stripes:['#bf0a30','#002868','#ffffff','#002868','#bf0a30'] },
  { id:'achievement',        name:'Air Force Achievement Medal',                category:'Personal Decoration', tier:12, stripes:['#002868','#c9a04a','#bf0a30'] },

  // ── Unit Awards ──
  { id:'pres_unit',          name:'Presidential Unit Citation',                 category:'Unit Award', tier:1, stripes:['#002868','#ffffff','#bf0a30'] },
  { id:'valorous_unit',      name:'Valorous Unit Award',                        category:'Unit Award', tier:2, stripes:['#bf0a30','#ffffff','#002868'] },
  { id:'af_unit_award',      name:'Air Force Outstanding Unit Award',           category:'Unit Award', tier:3, stripes:['#5b92e5','#c9a04a','#5b92e5'] },
  { id:'af_org_excellence',  name:'Air Force Organizational Excellence Award',  category:'Unit Award', tier:4, stripes:['#3c3b6e','#5b92e5','#3c3b6e'] },

  // ── Service Awards ──
  { id:'good_conduct',       name:'Air Force Good Conduct Medal',               category:'Service Award', tier:1, stripes:['#bf0a30','#5b92e5','#bf0a30'] },
  { id:'longevity',          name:'Air Force Longevity Service Award',          category:'Service Award', tier:2, stripes:['#5b92e5','#ffffff','#5b92e5'] },
  { id:'training_ribbon',    name:'Air Force Training Ribbon',                  category:'Service Award', tier:3, stripes:['#5b92e5','#ffd700','#5b92e5'] },
  { id:'recruiter_ribbon',   name:'Air Force Recruiter Ribbon',                 category:'Service Award', tier:4, stripes:['#002868','#ffffff','#bf0a30','#ffffff','#002868'] },
  { id:'small_arms',         name:'Air Force Small Arms Expert Marksmanship Ribbon', category:'Service Award', tier:5, stripes:['#3c3b6e','#ffd700'] },

  // ── Campaign / Service Medals ──
  { id:'combat_readiness',   name:'Combat Readiness Medal',                     category:'Campaign / Service', tier:1, stripes:['#bf0a30','#002868','#bf0a30'] },
  { id:'afem',               name:'Armed Forces Expeditionary Medal',           category:'Campaign / Service', tier:2, stripes:['#3c3b6e','#ffffff','#bf0a30','#ffffff','#3c3b6e'] },
  { id:'afsm',                name:'Armed Forces Service Medal',                category:'Campaign / Service', tier:3, stripes:['#002868','#5b92e5','#ffffff','#5b92e5','#002868'] },
  { id:'humanitarian',       name:'Humanitarian Service Medal',                 category:'Campaign / Service', tier:4, stripes:['#5b92e5','#ffffff','#bf0a30'] },
  { id:'nato_medal',          name:'NATO Medal',                                 category:'Campaign / Service', tier:5, stripes:['#5b92e5','#ffffff','#5b92e5'] },
];

// ── PILOT / AIRCREW WINGS TIERS ──────────────────────────────────
const WINGS_BADGES = [
  { id:'wings_basic',   name:'Basic Pilot Wings',   tier:1, desc:'Awarded upon completion of initial qualification training.' },
  { id:'wings_senior',  name:'Senior Pilot Wings',  tier:2, desc:'Awarded for sustained flight experience and proficiency.' },
  { id:'wings_command', name:'Command Pilot Wings', tier:3, desc:'The highest pilot rating, awarded for extensive flight leadership and experience.' },
];

// ── RIBBON & WINGS SVG RENDERING ─────────────────────────────────
// Renders an authentic-style ribbon bar (small rectangle with vertical stripes)
// matching real USAF ribbon color patterns. Returns an <svg> string.
function renderRibbonSVG(medalId, w, h) {
  w = w || 44; h = h || 16;
  const medal = MEDALS_CATALOG.find(m => m.id === medalId);
  const stripes = medal?.stripes || ['#888888'];
  const stripeW = w / stripes.length;
  const rects = stripes.map((color, i) =>
    `<rect x="${(i*stripeW).toFixed(2)}" y="0" width="${stripeW.toFixed(2)}" height="${h}" fill="${color}"/>`
  ).join('');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;border-radius:1px;box-shadow:0 1px 2px rgba(0,0,0,.4)">
    ${rects}
    <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="0.75"/>
  </svg>`;
}

// Renders a pilot wings badge — shield + spread wings, with star tiers for Senior/Command
function renderWingsBadgeSVG(badgeId, size) {
  size = size || 32;
  const tier = WINGS_BADGES.find(w => w.id === badgeId)?.tier || 1;
  const starHtml = tier >= 2 ? `<circle cx="32" cy="16" r="3.2" fill="#1a1a1a"/>
    <path d="M32 13.2l.7 2.1h2.2l-1.8 1.3.7 2.1-1.8-1.3-1.8 1.3.7-2.1-1.8-1.3h2.2z" fill="#c9a04a"/>` : '';
  const wreathHtml = tier >= 3 ? `<path d="M22 16a10 10 0 0 1 20 0" fill="none" stroke="#c9a04a" stroke-width="1.2" stroke-dasharray="1.5,1.2"/>` : '';
  return `<svg width="${size}" height="${size*0.5}" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" style="display:block">
    <!-- left wing -->
    <path d="M30 16 C22 10, 10 9, 2 14 C10 17, 18 17, 24 19 C18 19, 10 21, 4 24 C12 26, 22 25, 28 21 Z" fill="#c9a04a" opacity="0.92"/>
    <!-- right wing (mirrored) -->
    <path d="M34 16 C42 10, 54 9, 62 14 C54 17, 46 17, 40 19 C46 19, 54 21, 60 24 C52 26, 42 25, 36 21 Z" fill="#c9a04a" opacity="0.92"/>
    <!-- center shield -->
    <path d="M32 9 L37 11 L37 19 C37 23 35 26 32 28 C29 26 27 23 27 19 L27 11 Z" fill="#1a1a1a" stroke="#c9a04a" stroke-width="1"/>
    ${wreathHtml}
    ${starHtml}
  </svg>`;
}


const ALL_PERMISSIONS = [
  { id: 'approve_pilots',    label: 'Approve / deny pilot applications' },
  { id: 'edit_ranks',        label: 'Edit pilot ranks & roles' },
  { id: 'edit_own_wing',     label: 'Edit own wing (history, bases, training, callsigns)' },
  { id: 'edit_any_wing',     label: 'Edit any wing (not just their own)' },
  { id: 'manage_wings',      label: 'Create / delete wings & squadrons' },
  { id: 'manage_roles',      label: 'Create / edit roles & permissions' },
  { id: 'post_news',         label: 'Post site announcements' },
  { id: 'manage_slideshow',  label: 'Manage homepage slideshow' },
  { id: 'customize_site',    label: 'Customize site colors & branding' },
  { id: 'view_all_flights',  label: 'View all flight logs (not just own)' },
  { id: 'delete_flights',    label: 'Delete any flight log entry' },
  { id: 'manage_training',   label: 'Edit training modules' },
  { id: 'award_medals',      label: 'Award medals, ribbons & pilot wings' },
];

// ── ROLES — defaults used until Firestore overrides are loaded ─────────
// isMasterAdmin / isHidden are special: master_admin grants ALL permissions
// silently without showing "Master Admin" anywhere in the UI.
const DEFAULT_ROLES = {
  master_admin:   { name: 'Wing Commander', level: 99, color: '#c8a951', isMasterAdmin: true, permissions: [] },
  wing_commander: { name: 'Wing Commander',      level: 10, color: '#c8a951', permissions: ['edit_ranks','edit_own_wing','manage_training'] },
  sq_commander:   { name: 'Squadron Commander',  level: 8,  color: '#f0cc72', permissions: ['edit_own_wing'] },
  instructor:     { name: 'Instructor',          level: 5,  color: '#4a90d9', permissions: ['manage_training'] },
  pilot:          { name: 'Pilot',               level: 2,  color: '#3dba6e', permissions: [] },
  trainee:        { name: 'Trainee',             level: 1,  color: '#9aa0b8', permissions: [] },
  pending:        { name: 'Pending Approval',    level: 0,  color: '#e09030', permissions: [] },
};

// ROLES starts as the defaults; gets overwritten once Firestore loads (see below)
let ROLES = JSON.parse(JSON.stringify(DEFAULT_ROLES));

// Load custom roles from Firestore — merges with/overrides defaults
async function loadRolesFromFirestore() {
  try {
    const snap = await db.collection('settings').doc('roles').get();
    if (snap.exists && snap.data().roles) {
      const customRoles = snap.data().roles;
      ROLES = { ...DEFAULT_ROLES, ...customRoles };
      // master_admin always stays hidden + has every permission, regardless of edits
      ROLES.master_admin = {
        ...(ROLES.master_admin || DEFAULT_ROLES.master_admin),
        isMasterAdmin: true,
      };
    }
  } catch(e) { console.warn('Could not load custom roles, using defaults', e); }
}

// ── MULTI-ROLE SUPPORT ──────────────────────────────────────────
// Pilots can hold multiple roles (e.g. Wing Commander + Instructor).
// pilot.roles is an array of role IDs. Falls back to legacy pilot.role
// (single string) for older accounts that haven't been migrated yet.
function getPilotRoleIds(pilot) {
  if (!pilot) return ['pending'];
  if (Array.isArray(pilot.roles) && pilot.roles.length) return pilot.roles;
  if (pilot.role) return [pilot.role];
  return ['pending'];
}

// Check if a pilot has a specific permission across ANY of their roles
function hasPermission(pilot, permId) {
  if (!pilot) return false;
  const roleIds = getPilotRoleIds(pilot);
  for (const rid of roleIds) {
    const role = ROLES[rid];
    if (!role) continue;
    if (role.isMasterAdmin) return true; // master admin silently has everything
    if ((role.permissions || []).includes(permId)) return true;
  }
  return false;
}

function isMasterAdminPilot(pilot) {
  return getPilotRoleIds(pilot).some(rid => ROLES[rid]?.isMasterAdmin);
}

// Get the SINGLE highest-authority role to display as primary (hides master_admin identity)
function getDisplayRole(pilot) {
  if (!pilot) return ROLES.pending;
  const roleIds = getPilotRoleIds(pilot);
  // If they hold the hidden master_admin role, show their chosen public title instead
  if (roleIds.some(rid => ROLES[rid]?.isMasterAdmin)) {
    return {
      name:  pilot.publicTitle || 'Wing Commander',
      color: pilot.publicColor || '#c8a951',
      level: 99,
    };
  }
  // Otherwise show whichever held role has the highest authority level
  let best = null;
  for (const rid of roleIds) {
    const role = ROLES[rid];
    if (!role) continue;
    if (!best || (role.level||0) > (best.level||0)) best = role;
  }
  return best || ROLES.pending;
}

// Get ALL display roles for a pilot (for showing multiple badges, e.g. "Wing Commander" + "Instructor")
function getAllDisplayRoles(pilot) {
  if (!pilot) return [ROLES.pending];
  const roleIds = getPilotRoleIds(pilot);
  const out = [];
  for (const rid of roleIds) {
    const role = ROLES[rid];
    if (!role) continue;
    if (role.isMasterAdmin) {
      out.push({ name: pilot.publicTitle || 'Wing Commander', color: pilot.publicColor || '#c8a951', level: 99 });
    } else {
      out.push(role);
    }
  }
  return out.length ? out.sort((a,b)=>(b.level||0)-(a.level||0)) : [ROLES.pending];
}

// ── AUTH STATE WATCHER ───────────────────────────────────────
let currentUser   = null;
let currentPilot  = null;

auth.onAuthStateChanged(async (user) => {
  await loadRolesFromFirestore(); // ensure custom roles/permissions are loaded first
  if (user) {
    currentUser = user;
    try {
      const doc = await db.collection('pilots').doc(user.uid).get();
      if (doc.exists) {
        currentPilot = { uid: user.uid, ...doc.data() };
        // Redirect pending users away from protected pages
        if (currentPilot.status === 'pending' && !isPendingPage()) {
          window.location.href = '/pages/pending.html';
          return;
        }
        if (currentPilot.status === 'denied') {
          auth.signOut();
          window.location.href = '/pages/login.html?denied=1';
          return;
        }
      }
    } catch(e) { console.error('Pilot load error:', e); }
    onAuthReady(currentUser, currentPilot);
  } else {
    currentUser  = null;
    currentPilot = null;
    onAuthReady(null, null);
  }
});

function isPendingPage() {
  return window.location.pathname.includes('pending') ||
         window.location.pathname.includes('login')   ||
         window.location.pathname.includes('register');
}

// Override in each page
function onAuthReady(user, pilot) {}

// ── HELPERS ──────────────────────────────────────────────────
function requireAuth() {
  if (!currentUser) window.location.href = '/pages/login.html';
}
function requireRole(minLevel) {
  requireAuth();
  const roleIds = getPilotRoleIds(currentPilot);
  const maxLevel = Math.max(0, ...roleIds.map(rid => ROLES[rid]?.level || 0));
  if (maxLevel < minLevel) window.location.href = '/index.html';
}
function requireMasterAdmin() {
  requireAuth();
  if (!isMasterAdminPilot(currentPilot)) window.location.href = '/index.html';
}

function getRankName(rankId) {
  return RANKS.find(r => r.id === rankId)?.name || rankId;
}
function getRankAbbr(rankId) {
  return RANKS.find(r => r.id === rankId)?.abbr || rankId;
}
function getWingName(wingId) { return WINGS[wingId]?.name || wingId; }
function getSqName(wingId, sqId) { return WINGS[wingId]?.squadrons[sqId]?.name || sqId; }

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}
function formatDateTime(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
}

function toast(msg, type='success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 22px;border-radius:22px;font-size:13px;font-weight:600;z-index:9999;pointer-events:none;opacity:0;transition:opacity .3s;font-family:var(--sans)';
    document.body.appendChild(t);
  }
  const colors = { success:'#3dba6e', error:'#d04040', info:'#4a90d9', warn:'#e09030' };
  t.style.background = colors[type] || colors.success;
  t.style.color = '#fff';
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 3000);
}

function showLoading(msg='Loading...') {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:8888;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;backdrop-filter:blur(4px)';
    overlay.innerHTML = `<div style="width:40px;height:40px;border:3px solid #333;border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite"></div><div style="color:#fff;font-size:14px;font-family:var(--sans)">${msg}</div>`;
    document.body.appendChild(overlay);
  }
}
function hideLoading() {
  const o = document.getElementById('loading-overlay');
  if (o) o.remove();
}
