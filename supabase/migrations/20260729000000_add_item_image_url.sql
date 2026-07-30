/*
# Add real picture support to items

## Problem
The `icon` column is just plain text — meant for a single emoji character
(📚 🎬 📺). Pasting an image URL into it just renders as literal text on
the page, since the site was never told to treat that field as a picture.

## Fix
Add a separate `image_url` column for a real picture (book cover, movie
poster, etc). The site will show this image when it's set, and automatically
fall back to the emoji `icon` when it's empty — so existing items with only
an icon keep working exactly as before.
*/

ALTER TABLE items ADD COLUMN IF NOT EXISTS image_url text;
