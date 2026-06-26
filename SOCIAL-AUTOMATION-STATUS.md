# The Miners Arms — Social Media Automation · Status

**Last updated:** 2026-06-26
**Status:** Phase 1 ✅ · Phase 2a ✅ · Phase 2b ✅ · Phase 3 ✅ LIVE & TESTED · Phase 4 ⛔ pending Meta/TikTok access

A Telegram-driven assistant that helps The Miners Arms post to social media three times a week.
Every **Monday, Wednesday & Friday at 10am London time**, a bot messages the owner — *"Want to post today?"* — and
walks them through creating and approving a post, then publishes it to Facebook, Instagram & TikTok.

Built **n8n-native** (the automation lives entirely in n8n). Fully isolated to The Miners Arms'
own bot, database, and credentials — no crossover with any other project.

---

## ✅ What's live and working today

1. **Auto-prompt** — every Mon, Wed & Fri at 10am London time the bot asks *"Want to post today?"* (Yes / No buttons)
2. **Conversation flow** — Yes → *Picture or Video?* → choice is acknowledged and remembered
3. **Memory** — every step is recorded in Supabase so the bot always knows where you are
4. **AI image generation** — owner taps "Picture → AI Generate": bot picks a rotating weekly theme, fetches a real gallery image from the website, and asks Gemini to produce a branded version
5. **Photo upload + AI enhancement** — owner taps "Picture → Upload": sends a food photo → Gemini 2.5 Flash analyses it and generates a polished, pub-branded version
6. **Video generation (Veo 3)** — owner taps "Video": sends a food photo → Gemini analyses it → Veo 3 generates a reel via Google's predictLongRunning API → approval message sent with the video clip
7. **Approval flow** — for all three paths, bot sends a preview (image or video) and waits for owner approval before posting
8. **6-theme rotation** — content themes (food, atmosphere, drinks, community, three-kitchen heritage, weekly special) cycle automatically by week number

Runs on the dedicated bot **@masocialsbot** and The Miners Arms' own Supabase database.

**Fully end-to-end tested 2026-06-24.** Image paths ✅. Video path ✅ (photo → Veo 3 → approval state). All nodes green.

---

## 🔧 Fixes applied

### 2026-06-24 — Gemini 503 retry
The **Analyze Photo** node in MINERS-Social-Responder was updated to retry more aggressively on Gemini 503s:
- **Max Tries:** 5
- **Wait Between Tries:** 5000ms

This resolves transient "high demand" 503 errors from the Gemini API (which can occur even on the paid tier during demand spikes).

### 2026-06-24 — Stale session bug fix
`Fetch Upload Row` previously used `limit: 1` with no ordering and grabbed the OLDEST stale row.
Fixed: `returnAll: true` + new `Pick Latest Session` Code node sorts by `created_at DESC`. This prevents old abandoned rows from hijacking the video or image path.

---

## ⏸ What's next

**Immediate blocker for Phase 4:** A Meta developer app with Facebook Page + Instagram Business token. Instagram must be a Business/Creator account linked to the Facebook Page. TikTok requires Content Posting API access from developers.tiktok.com.

**Pending manual step (video credential):** Open `Submit Video Job` and `Check Video Status` nodes in the n8n UI and reassign the credential from CROWNBOT's to `Miners Arms Google AI` (googlePalmApi, id `g6sW11Mi6CPtUd7N`). The rest of the video pipeline is wired correctly.

---

## 🗺 Build roadmap

| Phase | What | Status |
|---|---|---|
| **1** | Conversation skeleton (schedule → ask → Picture/Video → remember) | ✅ Live |
| **2a** | AI **generates** a themed branded image from gallery | ✅ Live & tested |
| **2b** | Owner uploads photo → AI polishes/enhances it | ✅ Live & tested |
| **3** | **Video** — send a food photo → Veo 3 generates a reel | ✅ Live & tested 2026-06-24 |
| **4** | AI **captions** + **post** to Facebook / Instagram / TikTok | ⛔ Needs Meta + TikTok access |

---

## 🔧 Reference (for whoever builds next)

**n8n workflows** (in Prakhar's n8n instance — `n8n.srv1206791.hstgr.cloud`):
- `MINERS-Social-Initiation` — id `K1YQ3T7gAlXlSwYV` — schedule → "post today?"
- `MINERS-Social-Responder` — id `MLsWZFRXpBisluWN` — handles button taps, photo uploads, video generation, approval flow (56 nodes, published `f1c1d5ef`)

**Infrastructure:**
- Supabase project `fnwotwlbiexhcgnrhtcy`, table `social_posts` (holds live conversation state + post history; RLS on, service-role-only)
- Telegram bot **@masocialsbot** (separate from the booking bot), owner chat ID `5930338959`
- n8n credentials (names only): `Miners Arms Social` (Telegram), `Miners Arms Supabase` (database), `Miners Arms Google AI` (Gemini / Veo)

**Photo routing logic:** `msg:photo` from Telegram always hits `Fetch Upload Row` → `Pick Latest Session` → `Image or Video?`. The `media_type` column on the newest Supabase row determines which path runs (`image` for enhance, `video` for Veo generation).

**Video pipeline (Phase 3) — Veo 3 via HTTP:**
`Prepare Image for Veo` (Code — base64-encodes photo, builds Gemini API request body) →
`Submit Video Job` (HTTP POST to `https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-001:predictLongRunning`, auth = `Miners Arms Google AI`, retry ×3) →
`Extract Operation ID` (Code) →
`Wait for Veo` (Wait node, 40s interval) →
`Check Video Status` (HTTP GET `https://generativelanguage.googleapis.com/v1beta/{operationName}`) →
`Video Ready?` (If — `$json.done === true`; false → loop back to Wait) →
`Extract Video Binary` (Code — parses base64 video from response) →
`Send Video for Approval`

**Gallery-backed image generation (Phase 2a):**
`Fetch Gallery Images` (HTTP GET `https://www.miners-arms.com/api/gallery/public`) → `Pick Random Gallery Image` → `Download Gallery Image` → `Build Gemini Edit Body` → `Generate Image (Edit)` (HTTP POST to `gemini-2.0-flash-exp`) → `Extract Generated Image` → `Send Image for Approval`

**Image model:** `models/gemini-2.5-flash` (vision/analyze). Image editing: `gemini-2.0-flash-exp` (edit endpoint). Video: `veo-3.0-generate-001` (predictLongRunning).

**Posting (Phase 4) still needs:** a Meta developer app (Facebook Page + Instagram Business token) and TikTok Content Posting API access. Instagram must be a Business/Creator account. The Facebook Page ID is `61574035670847`.

---

## ⚠️ Gotchas already solved (don't re-debug these)

- **Credentials don't auto-bind by name.** When a workflow is created/updated via automation, new
  nodes grab the *first* credential of each type (often the wrong project's). Each new node's
  credential must be picked manually in the n8n UI. (`update_workflow` preserves already-fixed credentials.)
- **Editing a Supabase node's credential in the UI blanks its table/column fields.** Re-push the
  workflow config via the API afterwards (it preserves the credential you just fixed).
- **Don't set `chatIds` on the Telegram trigger** — it silently drops button-tap (callback) updates.
- **Activating fails if the workflow is open** in the n8n editor — close it first.
- **Gemini 503 on paid tier** — transient demand spikes still cause 503s even with billing enabled.
  Fixed by setting Analyze Photo node to Max Tries: 5, Wait: 5000ms.
- **Parallel branches (fan-out from one node)** cause `.item` to fail for sibling branches — use `.first()` or eliminate parallel branches entirely (preferred).
- **n8n MCP `update_workflow`** rejects with "Expected array, received undefined" for `operations` (schema out of sync with server). Manual UI edits required for complex changes.

---

## 🎨 Design decisions made

- **Rotating themes** — 6 content themes cycle automatically by week (food, atmosphere, drinks,
  community, three-kitchen heritage, weekly special).
- **Images are always brand-anchored** — built from The Miners Arms' gallery and identity
  (West Bromwich three-kitchen pub), never generic stock.
- **Pictures = "Both" mode** — per post, the owner chooses to *send a real photo (AI polishes it)*
  **or** *let AI generate one*. Real photos preferred for actual dishes (authenticity); AI generation
  for mood/atmosphere posts.
- **Video** — not AI-from-scratch guesswork: owner sends a real food photo, AI analyses it and
  generates a reel. Owner approves before anything is posted.
- **Schedule:** Mon, Wed & Fri at 10am London time (Europe/London timezone, DST-aware).
