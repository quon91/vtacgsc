// ═══════════════════════════════════════════════════════════════
//  VTAC GLOBAL STRIKE COMMAND — FIREBASE CONFIG
//  Replace the firebaseConfig object with YOUR Firebase project
//  values from: console.firebase.google.com → Project Settings
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
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

// ── PERMISSIONS — the full list of things a role can be allowed to do ──
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

// Check if a pilot has a specific permission (master_admin always passes)
function hasPermission(pilot, permId) {
  if (!pilot) return false;
  const role = ROLES[pilot.role];
  if (!role) return false;
  if (role.isMasterAdmin) return true; // master admin silently has everything
  return (role.permissions || []).includes(permId);
}

// Get the role info that should DISPLAY for a pilot (hides master_admin identity)
function getDisplayRole(pilot) {
  if (!pilot) return ROLES.pending;
  const role = ROLES[pilot.role];
  if (!role) return ROLES.pending;
  if (role.isMasterAdmin) {
    // Show their chosen public title instead of "Master Admin"
    return {
      name:  pilot.publicTitle || 'Wing Commander',
      color: pilot.publicColor || '#c8a951',
      level: role.level,
    };
  }
  return role;
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
  const role = currentPilot?.role || 'pending';
  if ((ROLES[role]?.level || 0) < minLevel) window.location.href = '/index.html';
}
function requireMasterAdmin() {
  requireAuth();
  if (currentPilot?.role !== 'master_admin') window.location.href = '/index.html';
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
