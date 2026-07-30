# Chat Assistant Setup — 100% Free, No API Key

This adds a chat widget (bottom-right, every page) that:
- Recommends titles **from your real library**, picked live from your Supabase `items` table
- Lets visitors report bugs, request missing titles, and leave suggestions — all saved straight into a new `feedback` table
- Uses **no external AI service and no API key at all**. It's a menu-driven assistant (buttons + simple keyword matching) running entirely in the browser, using the same Supabase connection your site already has.

## What was added
- `supabase/migrations/20260701000000_agent_feedback.sql` — new `feedback` table
- `src/components/ChatWidget.tsx` — the chat widget (all logic is local JS/TS, no network calls except your existing Supabase reads/inserts)
- `src/lib/supabase.ts` — added a `Feedback` type
- `src/App.tsx` — renders `<ChatWidget />` on every page

## Setup — just one step

Open your Supabase project → **SQL Editor** → **New query** → paste the contents of
`supabase/migrations/20260701000000_agent_feedback.sql` → click **Run**.

That's it. No CLI, no Edge Functions, no secrets, no signing up for anything else.

## Try it locally
```bash
npm install
npm run dev
```
Open the printed localhost URL, click the gold chat bubble, and try:
- "🎬 Recommend something" → pick Book / Movie / Series / Surprise me
- "🐛 Report a bug" → type a description → it's saved
- "📚 Request a missing title" → type a title → it's saved
- "💡 Suggestion / feedback" → type your idea → it's saved
- Or just type naturally, e.g. "recommend me a movie" or "the login button is broken" — it has basic keyword recognition (English + a few French phrases) and will route itself, falling back to the menu if it's unsure.

## Where feedback shows up
Supabase Dashboard → **Table Editor** → `feedback`. Each row has a `type` (`bug` / `missing_title` / `suggestion`), the visitor's message, `status` (starts as `new`), and the user if they were logged in.

## How it recommends titles
It loads your `items` table once when the widget opens, then:
- Filters by the type you picked (or all types for "Surprise me")
- If you typed free text (e.g. "something like a thriller"), it lightly scores titles/authors/descriptions against your words and prefers matches
- Picks 3 at random from the best matches, and remembers what it already showed you so "Show me more" doesn't repeat itself

## Why no AI API
You asked for a fully free setup with no key and no external signup — this version has zero moving parts outside what your site already uses (Supabase). It won't hold a free-flowing conversation like an LLM would, but it reliably does the three things you actually needed: recommend real titles, and collect bugs/missing-titles/suggestions.

If you ever change your mind and want a true conversational AI later (using a free key from Groq or Google Gemini), that's a fairly small addition on top of this — just say so.
