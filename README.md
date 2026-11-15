# My Private Diary

A personal diary, habit tracker, workout & diet planner, audio/video diary and idea flow-map — in a single `index.html`.
Installable as an app (PWA) and works offline.

This project is **completely independent** of any other diary: it has its own storage, its own keys and no shared backend.

## Speaking Coach (presentations & team meetings)

The **Speaking Coach** tab helps a Telugu-speaking, English-medium-educated professional become a confident speaker on stage and in meetings.

* **Rehearsal studio:** pick a scenario (presentation, team update, elevator pitch, tough question, polite disagreement…), a target time and a topic, then speak. You get a live transcript plus **pace (words per minute), filler words, long pauses and timing**, and your rehearsals are tracked over time. One tap sends the talk to the coach for scores, top-3 fixes and a stronger opening.
* **AI coach:** build a talk, practise Q&A with a tough audience, role-play team meetings, polish a script for speaking, pronunciation help (including common Telugu-English patterns). Telugu is used only when you ask (configurable).
* **90-day plan:** voice and pace, removing fillers, structure (PREP, rule of three), openings and closings, stories and data, slides, meeting updates and influence, Q&A, full rehearsals and a final dress rehearsal.
* It uses Google's **Gemini free tier** straight from your browser with **your own key** from <https://aistudio.google.com/apikey> — no separate charge. Paste it in *Speaking Coach → Setup*. The key is stored encrypted with your diary data and is never put in backups or in a Google Sheet.
* Every new day the previous chat is automatically **compacted** into a short memory note, so the coach remembers your level, work and mistakes without resending old chats.
* Voice uses your browser's speech features (Chrome/Edge; Chrome sends audio to Google for recognition). Browsers often hide "um/uh", so filler counts can be lower than reality.
* On Google's free tier prompts may be used to improve Google's products — don't type secrets.

## Research Desk

The **Research Desk** tab embeds two literature-survey desks: **Gaussian Splatting** (a built-in snapshot of about 3,000 papers, venues, classics, a learning path and a 90-day Blender plan) and **Audio Classification** (arXiv search, venues, DCASE, a learning path). Pick a desk from the menu at the top of the tab.

* Ticks, the reading list and comparisons are stored only in this browser, under this diary's own namespace.
* **Live arXiv papers** need your own Apps Script helper (set up from inside the tab, or use the sync script): the desks ask it for the newest papers. Without it, the Splat desk shows its built-in snapshot, and the Audio desk's paper list stays empty (its other tabs still work).
* No other diary's backend is used.

## Privacy

* **Default: private mode.** All data stays in *this browser on this device*, encrypted with AES-256-GCM using a key derived from your password (PBKDF2, 250k iterations). Nothing is sent anywhere.
* Forgetting the password means the data **cannot be recovered**. Use *Profile → Storage → Export backup* regularly (backups are plain JSON — store them safely).
* Clearing the browser's site data deletes the diary from that browser (unless you turned on encrypted Drive sync below). Export a backup first.
* Video/audio recordings can be downloaded to your device. Uploading them needs the optional cloud connection below.

## Same diary on all your devices (optional, end-to-end encrypted, stored in your Google Drive)

Turn this on to use one diary on your phone, laptop and any other browser — with the same password everywhere. Your diary is saved as **encrypted files in your own Google Drive** (folder *My Private Diary (encrypted)*). No Google Sheet is needed.

1. Go to <https://script.google.com> → **New project** and paste in `backend/Code.gs` → Save.
2. **Deploy → New deployment → Web app** (Execute as: *Me*, Who has access: *Anyone*) → Deploy → authorize (it asks for Drive access) → copy the web app URL (ends in `/exec`).
3. In the diary: **Profile → Storage & Backup → Apps Script URL → Connect**. If this device already has a diary, it is uploaded; if your Drive already holds one, this device switches to it.
4. On another device: on your main device press **Copy setup link for another device**, open that link on the other device and unlock with your password. (Or use "Already use this diary on another device? Connect to it" on the first screen and paste the URL.)

Buttons in Profile → Storage & Backup: **Back up to Drive now** (push everything immediately), **Restore from Drive** (pull the latest from Drive onto this screen), **Test sync** (checks the connection and shows the exact problem if there is one). A red "Last sync problem" line appears if an upload or download failed.

How it stays private:
* Everything is encrypted **in the browser** (AES-256-GCM, key derived from your password) before it is sent. Drive only holds scrambled files; your password and key never leave your devices.
* Treat the web app URL like a key: anyone who has it could read the scrambled files or overwrite/delete them (they still can't decrypt them). Keep regular backups.
* Saves go to Drive automatically and are kept on the device if you are offline (they upload next time). If two devices edit the same section at once, the last save wins — press **Restore from Drive** before editing on a second device.
* If you earlier used the Sheet-based version, the new script still reads the old Sheet data as a fallback.
* Recordings uploaded to Google Drive are ordinary files (not encrypted). Changing the password re-encrypts everything; other devices must then use the new password.

## Hosting

Any static host works (GitHub Pages, Netlify, …). Serve over HTTPS for the install/offline features.
