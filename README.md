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
