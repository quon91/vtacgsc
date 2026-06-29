# VTAC Global Strike Command — vtacgsc.com
## Complete Setup Guide

---

## What's in this package

```
vtacgsc/
├── public/
│   ├── index.html              ← Homepage
│   ├── css/main.css            ← All styles
│   ├── js/firebase-config.js   ← Firebase + shared utilities
│   └── pages/
│       ├── login.html          ← Pilot login
│       ├── register.html       ← Pilot application
│       ├── master-admin.html   ← Your full admin panel
│       ├── pending.html        ← Pending approval page
│       ├── dashboard.html      ← Pilot dashboard
│       ├── wing.html           ← Wing page (all wings)
│       ├── profile.html        ← Pilot profile
│       ├── log-flight.html     ← Log a flight
│       └── training/index.html ← Training guides
├── firebase.json               ← Firebase Hosting config
├── firestore.rules             ← Security rules
└── README.md                   ← This file
```

---

## STEP 1 — Create Firebase Project (10 min)

1. Go to **console.firebase.google.com**
2. Click **Add project** → name it `vtac-gsc`
3. Disable Google Analytics (not needed) → **Create project**
4. Click **Authentication** → **Get started** → **Email/Password** → Enable → Save
5. Click **Firestore Database** → **Create database** → **Start in production mode** → choose a region → Done
6. Click **Storage** → **Get started** → production mode → Done
7. Click the **gear icon ⚙** → **Project settings** → scroll to **Your apps** → click **</>** (Web)
8. Register app name: `vtac-gsc-web`
9. Copy the `firebaseConfig` object — paste it into `public/js/firebase-config.js` replacing the placeholder values

---

## STEP 2 — Install Firebase CLI and Deploy (5 min)

You need Node.js installed. Download from nodejs.org if you don't have it.

Open a terminal/command prompt and run:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Go to your project folder
cd path/to/vtacgsc

# Initialize (select Hosting + Firestore)
firebase init

# When asked:
# - Which features? Select: Firestore, Hosting
# - Use existing project: vtac-gsc
# - Firestore rules file: firestore.rules (already exists)
# - Public directory: public
# - Single page app: NO
# - GitHub deploys: NO

# Deploy everything
firebase deploy
```

Your site will be live at: `https://vtac-gsc.web.app`

---

## STEP 3 — Upload Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

---

## STEP 4 — Connect vtacgsc.com from Porkbun (10 min)

### In Firebase Console:
1. Go to **Hosting** → **Add custom domain**
2. Enter `vtacgsc.com` → Continue
3. Firebase gives you two DNS records (A records)

### In Porkbun:
1. Go to **porkbun.com** → sign in
2. Click **Account** → **Domain Management** → click `vtacgsc.com`
3. Click **DNS** (or Edit DNS)
4. Add the two A records Firebase gave you:
   - Type: `A` | Host: `@` | Answer: `151.101.1.195` (Firebase IP 1)
   - Type: `A` | Host: `@` | Answer: `151.101.65.195` (Firebase IP 2)
5. Also add `www` redirect:
   - Type: `CNAME` | Host: `www` | Answer: `vtac-gsc.web.app`
6. Save — DNS changes take 15–60 minutes to propagate
7. Go back to Firebase Hosting → verify domain (Firebase checks automatically)
8. SSL certificate is issued automatically — takes ~30 minutes

---

## STEP 5 — Create Your Master Admin Account

1. Go to `vtacgsc.com/pages/register.html`
2. Register with your email and callsign
3. Your account will be `pending` — fix that in Firebase:
4. Go to **Firebase Console → Firestore**
5. Click `pilots` collection → find your document
6. Edit these fields:
   - `status` → `active`
   - `role` → `master_admin`
   - `rank` → `gen` (or whatever you want)
7. Save
8. Log in at `vtacgsc.com/pages/login.html`
9. You'll be redirected to the master admin panel automatically

---

## STEP 6 — Wing Commander Setup

Once you have wing commanders in the system:
1. Go to Master Admin → All Pilots → find their account
2. Click Edit → set Role to `wing_commander`, assign their wing
3. They'll see a Wing Commander panel when they log in
4. They can manage ranks within their own wing only

---

## Daily Operations

| Task | How |
|---|---|
| Approve new pilots | Master Admin → Applications |
| Change someone's rank | Master Admin → All Pilots → Edit |
| Post announcements | Master Admin → News |
| Add slideshow images | Master Admin → Slideshow |
| Change site colors | Master Admin → Customize Site |
| View all flights | Master Admin → Flight Logs |
| Manage rosters | Master Admin → Rosters |

---

## Adding More Pages Later

Want a page for each squadron? For bases? For history?
Just ask Claude — give the page name and content and it gets added as a new HTML file in the `pages/` folder. Upload to Firebase with `firebase deploy`.

---

## Security Notes

- All routes are protected — unapproved users see nothing sensitive
- Firestore rules enforce permissions server-side — can't be bypassed
- Passwords are handled entirely by Firebase Auth — never stored in your database
- Master admin can only be set manually in Firestore console (can't be granted through the site)
