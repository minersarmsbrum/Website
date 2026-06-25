# The Miners Arms — Social Media Automation · Status

**Last updated:** 2026-06-24
**Status:** Phase 1 ✅ · Phase 2 ✅ LIVE & TESTED · Phase 3/4 pending Meta/TikTok access

A Telegram-driven assistant that helps The Miners Arms post to social media three times a week.
Every **Monday, Wednesday & Friday at 10am London time**, a bot messages the owner — *"Want to post today?"* — and
walks them through creating and approving a post, then publishes it to Facebook, Instagram & TikTok.

Built **n8n-native** (the automation lives entirely in n8n). Fully isolated to The Miners Arms'
own bot, database, and credentials — no crossover with any other project.

---

## ✅ What's live and working today

1. **Auto-prompt** — every Mon, Wed & Fri at 10am London time the bot asks *"Want to post today?"* (Yes / No buttons)
2. **Conversation flow** — Yes → *Picture or Video?* → choice is acknowledged
3. **Memory** — every step is recorded in Supabase so the bot always knows where you are
4. **Photo upload** — owner sends a real photo → bot downloads and analyses it with Gemini 2.5 Flash
5. **AI photo analysis** — Gemini returns structured JSON (category, main subject, setting, composition, improvements)
6. **Approval flow** — bot sends a preview and waits for owner approval before posting
7. Runs on the dedicated bot **@masocialsbot** and The Miners Arms' own Supabase database

**Fully end-to-end tested on 2026-06-24.** Flow confirmed: prompt → Yes → photo → Gemini analysis → approval state. ✅

---

## 🔧 Fix applied 2026-06-24

The **Analyze Photo** node in MINERS-Social-Responder was updated to retry more aggressively on Gemini 503s:
- **Max Tries:** 5
- **Wait Between Tries:** 5000ms

This resolves transient "high demand" 503 errors from the Gemini API (which can occur even on the paid tier during demand spikes).

---

## ⏸ What's next

**Immediate blocker for Phase 4:** A Meta developer app with Facebook Page + Instagram Business token. Instagram must be a Business/Creator account linked to the Facebook Page. TikTok requires Content Posting API access from developers.tiktok.com.

---

## 🗺 Build roadmap

| Phase | What | Status |
|---|---|---|
| **1** | Conversation skeleton (schedule → ask → Picture/Video → remember) | ✅ Live |
| **2a** | AI **analyses** uploaded photo → preview → approve | ✅ Live & tested |
| **2b** | AI polishes/enhances the photo before preview | ⏸ Optional enhancement |
| **3** | **Video** — send a food photo → AI suggests styles → makes a reel (Google Veo) | ⛔ Post-Meta setup |
| **4** | AI **captions** + **post** to Facebook / Instagram / TikTok | ⛔ Needs Meta + TikTok access |

---

## 🔧 Reference (for whoever builds next)

**n8n workflows** (in Prakhar's n8n instance):
- `MINERS-Social-Initiation` — id `K1YQ3T7gAlXlSwYV` — schedule → "post today?"
- `MINERS-Social-Responder` — id `MLsWZFRXpBisluWN` — handles button taps, photo uploads, approval flow
- `MINERS-Test-ImageGen` — id `aQPlh2Z58oga2aIk` — throwaway image test (can be ignored)

**Infrastructure:**
- Supabase project `fnwotwlbiexhcgnrhtcy`, table `social_posts` (holds live conversation state + post history)
- Telegram bot **@masocialsbot** (separate from the booking bot), owner chat ID `5930338959`
- n8n credentials (created in n8n's secure store, names only): `Miners Arms Social` (Telegram),
  `Miners Arms Supabase` (database), `Miners Arms Google AI` (Gemini)

**Image model:** `models/gemini-2.5-flash` (vision/analyze mode) — confirmed working on paid tier.

**Posting (Phase 4) still needs:** a Meta developer app (Facebook Page + Instagram Business token)
and TikTok Content Posting API access. Instagram must be a Business/Creator account.

---

## ⚠️ Gotchas already solved (don't re-debug these)

- **Credentials don't auto-bind by name.** When a workflow is created/updated via automation, new
  nodes grab the *first* credential of each type (often the wrong project's). Each new node's
  credential must be picked manually in the n8n UI. (`update` preserves already-fixed credentials.)
- **Editing a Supabase node's credential in the UI blanks its table/column fields.** Re-push the
  workflow config via the API afterwards (it preserves the credential you just fixed).
- **Don't set `chatIds` on the Telegram trigger** — it silently drops button-tap (callback) updates.
- **Activating fails if the workflow is open** in the n8n editor — close it first.
- **Gemini 503 on paid tier** — transient demand spikes still cause 503s even with billing enabled.
  Fixed by setting Analyze Photo node to Max Tries: 5, Wait: 5000ms.

---

## 🎨 Design decisions made

- **Rotating themes** — 6 content themes cycle automatically by week (food, atmosphere, drinks,
  community, three-kitchen heritage, weekly special).
- **Images are always brand-anchored** — built from The Miners Arms' identity (West Bromwich
  three-kitchen pub), never generic stock.
- **Pictures = "Both" mode** — per post, the owner chooses to *send a real photo (AI polishes it)*
  **or** *let AI generate one*. Real photos preferred for actual dishes (authenticity); AI generation
  for mood/atmosphere posts.
- **Video** — not AI-from-scratch guesswork: owner sends a real food photo, AI analyses it and
  suggests reel styles, owner picks one, then the video is generated.
- **Schedule:** Mon, Wed & Fri at 10am London time (Europe/London timezone, DST-aware).
