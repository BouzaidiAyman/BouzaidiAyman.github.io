/*
# Agent Feedback Schema (no-AI, client-side version)

## Overview
Stores everything the on-site assistant widget collects from visitors: bug
reports, requests for titles missing from the library, and general
suggestions. This version is written to directly from the browser (no
server / Edge Function / API key involved) using the public anon key that
the site already uses for everything else.

## New Tables

### feedback
- `id` (uuid, PK)
- `type` (text) — 'bug' | 'missing_title' | 'suggestion' | 'other'
- `message` (text) — what the visitor typed
- `user_id` (uuid, nullable, FK -> auth.users) — set if the visitor was logged in
- `user_name` (text, nullable) — display name captured at submit time
- `status` (text) — 'new' | 'reviewed' | 'resolved'
- `created_at` (timestamptz)

## Security
- RLS enabled.
- INSERT is open to everyone (anon + authenticated) — same trust level as
  your existing public Contact form, just stored in the DB instead of going
  nowhere.
- No SELECT policy is created, so visitors can submit feedback but can't
  read anyone else's feedback (including their own) from the client. You
  read it yourself via the Supabase Table Editor, which uses your own
  logged-in dashboard session and bypasses RLS for the project owner.
- If you later want a logged-in admin page on the site itself to browse
  feedback, add a policy such as:
    CREATE POLICY "feedback_select_admin" ON feedback FOR SELECT TO authenticated
    USING (auth.uid() = '<your-admin-user-id>');
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('bug', 'missing_title', 'suggestion', 'other')),
  message text NOT NULL CHECK (char_length(message) > 0),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feedback_insert_all" ON feedback;
CREATE POLICY "feedback_insert_all" ON feedback FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
