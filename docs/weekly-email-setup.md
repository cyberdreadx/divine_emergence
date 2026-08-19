# Weekly Monday Email — Setup Guide (GoHighLevel)

Goal: send a **different email every Monday**, written fresh each week, with
consistent Divine Emergence branding — and a reminder so writing it never slips.

## Why a Broadcast, not a recurring Workflow

A recurring **Workflow** sends the *same* saved email every week. Since each
Monday's email is unique, use **Email Campaigns / Broadcasts** instead — that's
GHL's tool for one-off, scheduled sends with custom content (a "newsletter").
The one recurring piece is a **reminder** so the email always gets written in time.

- **Template** (write once): the branded shell — `weekly-email-template.html`.
- **Broadcast** (each week): duplicate the template, write new content, schedule for Monday.
- **Reminder Workflow** (set once): pings Laura each Thursday to write it.

---

## Part 1 — Save the branded template (do this once)

1. Go to **Marketing → Emails → Templates**.
2. Click **+ New / Create Template → Blank**.
3. Drag in a **"Code" / "Custom HTML"** element.
4. Open `docs/weekly-email-template.html`, copy the **entire** file, paste it in.
5. Click **Save**, name it **`Weekly Email — Base`**.
6. Send yourself a **test email** (preview → send test) to confirm it looks right
   in Gmail and on your phone.
7. **Never send this base template itself** — it's the master copy.

The template already matches the welcome email: dark indigo card, gold accents,
Georgia/Arial fonts (email-safe), a gold "Book your free clarity call" button,
and Laura's sign-off.

---

## Part 2 — Each Monday: create the week's Broadcast

Best done **the Thursday/Friday before** (see Part 3 reminder).

1. Go to **Marketing → Emails → Campaigns** and click **+ New / Create Campaign**
   (this is a Broadcast — a one-time send).
2. **Choose a template →** `Weekly Email — Base`. This gives you a fresh copy;
   editing it does **not** change the master.
3. Edit **only** the parts marked `[ EDIT ]` in the HTML:
   - **Preheader** — the inbox preview line.
   - **Eyebrow** — e.g. "Monday Note", "This Week".
   - **Headline** — the one-line hook.
   - **Greeting + body paragraphs** — the actual message.
   - **Button** — change label/link, or delete that block if there's no CTA.
   - **Closing line** — optional.
   Leave the header, colors, footer, and sign-off alone for consistency.
4. Set the **Subject line** and confirm the **From name/email**.
5. **Recipients:** select the audience — the newsletter smart list / tag
   (the same list the website popup feeds into).
6. **Schedule** → pick the upcoming **Monday**, set the send time
   (e.g. 8:00 AM ET). Save/confirm.
7. Optional but recommended: **send a test to yourself first**, then schedule.

GHL auto-appends the compliant unsubscribe footer; the template's
`{{unsubscribe_link}}` supports it too.

---

## Part 3 — The weekly reminder (set once, runs forever)

So a Monday send is never missed:

1. Go to **Automation → Workflows → + Create Workflow → Start from scratch**.
2. **Trigger:** add a **"Recurring / Schedule"**-type trigger (or a
   **Date/Time**-based wait loop) set to fire **every Thursday, ~9:00 AM**.
   - If your GHL plan lacks a pure recurring trigger, the simplest reliable
     alternative is a **Google/GHL Calendar recurring event** titled
     "Write Monday's email" every Thursday — no workflow needed.
3. **Action:** send Laura an **internal notification** — email and/or SMS —
   "✍️ Write & schedule Monday's email today."
4. **Publish** the workflow (toggle **Draft → Publish**, top right) or it won't run.

---

## Weekly checklist (the 5-minute version)

- [ ] Thursday reminder arrives → block 20 min.
- [ ] Campaigns → New → pick `Weekly Email — Base`.
- [ ] Fill in the `[ EDIT ]` parts + subject line.
- [ ] Pick recipient list.
- [ ] Send test to self → looks good.
- [ ] Schedule for Monday 8 AM → confirm.

---

## Notes

- **Editing the base later:** update `Weekly Email — Base` once and every future
  duplicate inherits the change. Past sent broadcasts are unaffected.
- **Don't** edit web fonts into the email — Georgia/Arial are used on purpose
  because Playfair/Inter won't load reliably in email clients.
- The gold button already points at the clarity-call booking widget
  (`grow.divineemergence.org/widget/booking/8FEdtQqFLFvSMLL4yl4O`).
