# My Private Diary

A personal diary, habit tracker, workout & diet planner, audio/video diary and idea flow-map — in a single `index.html`.
Installable as an app (PWA) and works offline.

This project is **completely independent** of any other diary: it has its own storage, its own keys and no shared backend.

## Privacy

* **Default: private mode.** All data stays in *this browser on this device*, encrypted with AES-256-GCM using a key derived from your password (PBKDF2, 250k iterations). Nothing is sent anywhere.
* Forgetting the password means the data **cannot be recovered**. Use *Profile → Storage → Export backup* regularly (backups are plain JSON — store them safely).
* Clearing the browser's site data deletes the diary. Export a backup first.
* Video/audio recordings can be downloaded to your device. Uploading them needs the optional cloud connection below.

## Optional: cloud sync with your own Google Sheet

1. Create a new Google Sheet → **Extensions → Apps Script**.
2. Paste in `backend/Code.gs`, then **Deploy → New deployment → Web app** (Execute as: *Me*, Access: *Anyone*), authorize, and copy the `/exec` URL.
3. In the diary: **Profile → Storage → Apps Script URL → Connect**.

Use a Sheet that belongs only to this diary. Cloud mode stores data in that Sheet's cells (not encrypted) and uses a separate password stored in the Sheet.

## Hosting

Any static host works (GitHub Pages, Netlify, …). Serve over HTTPS for the install/offline features.
