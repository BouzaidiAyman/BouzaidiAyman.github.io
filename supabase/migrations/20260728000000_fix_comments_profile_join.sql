/*
# Fix: comments not showing after posting

## Problem
The app fetches comments with a join like:
  select('*, profiles(name)')

Supabase/PostgREST can only auto-join two tables like this if there's a
direct foreign key between them. `comments.user_id` only referenced
`auth.users`, not `profiles` — so the join silently failed, the SELECT
returned an error, and the UI never updated (even though the INSERT that
saved the comment worked fine).

## Fix
Add a second foreign key from comments.user_id -> profiles.id. This is
safe: every comment's user_id already has a matching profiles row (created
at signup), and profiles.id is always equal to the corresponding
auth.users.id, so both foreign keys are always simultaneously satisfied.
*/

ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_user_id_profiles_fkey;

ALTER TABLE comments
  ADD CONSTRAINT comments_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
