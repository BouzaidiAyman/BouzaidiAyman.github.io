# Cultural Club — Full Project Guide

Everything you need to edit design, pages, and the database yourself.

---

## 1. How the project is built (the stack)

- **React + TypeScript**, built with **Vite** (fast dev server + build tool)
- **Supabase** as the entire backend: database, authentication, storage — no custom server code anywhere
- Styling is a mix of a global stylesheet (`src/style.css`) and inline styles inside each component
- Deployed as a static site on **Netlify**

You never need to touch a server. Every "backend" action in the app (login, saving a comment, loading items) is a direct call from the browser to Supabase.

### Local setup
```bash
npm install       # one-time, installs dependencies
npm run dev       # starts a local dev server (usually localhost:5173), live-reloads as you edit
npm run build     # produces the dist/ folder — this is what gets deployed
npm run typecheck # checks for TypeScript errors without building
```

---

## 2. Folder structure — what lives where

```
project/
├── index.html                  # HTML shell, loads fonts, mounts React
├── netlify.toml                # Netlify build settings (don't need to touch this)
├── .env                        # Your Supabase URL + key (used locally only)
├── src/
│   ├── main.tsx                # Entry point — mounts <App/>, imports index.css + style.css
│   ├── App.tsx                 # Top-level component: routing, navbar, page switching, chat widget
│   ├── index.css               # Tailwind + Google Fonts import (small file)
│   ├── style.css               # THE main stylesheet — colors, animations, card/button/modal styles
│   ├── lib/
│   │   └── supabase.ts         # Creates the Supabase client + TypeScript types for each table
│   ├── contexts/
│   │   └── AuthContext.tsx     # Handles login/logout/register, holds the current user everywhere
│   ├── hooks/
│   │   └── useToast.ts         # Small helper for the "toast" pop-up notifications
│   ├── components/
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   ├── ItemModal.tsx       # The popup when you click a book/movie/series
│   │   ├── ChatWidget.tsx      # The chat bubble assistant (Library page only, logged-in only)
│   │   └── Toast.tsx           # Renders the toast notification
│   └── pages/
│       ├── HomePage.tsx
│       ├── LibraryPage.tsx     # The grid of items + login gate
│       ├── AboutPage.tsx
│       ├── ContactPage.tsx
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       └── ProfilePage.tsx
└── supabase/
    └── migrations/              # SQL files — the history of every database change made
```

**Rule of thumb:** if you want to change what a page *says* or *shows*, edit the matching file in `src/pages/`. If you want to change *colors, fonts, spacing, or animations* everywhere, edit `src/style.css`.

---

## 3. How routing/pages work

There's no routing library — `App.tsx` just tracks a `currentPage` string (`'home'`, `'library'`, `'about'`, etc.) and renders the matching page component. Navigating changes the URL hash (e.g. `yoursite.com/#library`) and updates that state.

To see how a click becomes a page change: `Navbar.tsx` calls a `navigate('library')` function passed down from `App.tsx`.

**To add a brand-new page:**
1. Create `src/pages/YourPage.tsx` (copy `AboutPage.tsx` as a starting template — it's the simplest one)
2. In `App.tsx`: add `'yourpage'` to the `Page` type and `VALID_PAGES` array, import your component, add a `case 'yourpage': return <YourPage />;` in the switch
3. In `Navbar.tsx`: add `{ label: 'Your Page', page: 'yourpage' }` to both the desktop and mobile nav arrays

---

## 4. The design system — how to change colors, fonts, spacing

Everything themeable lives at the very top of `src/style.css`, in the `:root { ... }` block:

```css
--dark-blue: #17100b;      /* main page background (near-black brown) */
--navy-blue: #2a1d13;      /* card/panel background */
--accent-gold: #c9a35a;    /* primary gold accent — buttons, links, borders */
--bright-gold: #e8c07d;    /* lighter gold, used in gradients */
--border-subtle: #4a3420;  /* borders on cards/inputs */
--font-display: 'Playfair Display', serif;   /* headings */
--font-body: 'Cormorant Garamond', serif;    /* body text */
--font-gothic: 'UnifrakturCook', cursive;    /* the blackletter logo/badge font */
```

**To change the whole color scheme:** edit these variables. Everything using `var(--accent-gold)` etc. updates automatically.

**Important gotcha:** many components (especially `ItemModal.tsx`, `LibraryPage.tsx`, `Navbar.tsx`) use **inline hex colors** directly (e.g. `background: '#17100b'`) instead of the CSS variables, since they were built with inline styles. If you change a variable in `style.css` and a color doesn't update, that's why — you'll need to also find/replace that hex code across the `.tsx` files. Search your editor for the hex code (e.g. `#c9a35a`) across the whole `src/` folder to find every spot.

**Fonts:** loaded via Google Fonts in both `index.html` and `src/index.css` — if you add a new font, add it to the URL in both places.

**Animations/keyframes:** all named `@keyframes` blocks live in `style.css` (search `@keyframes`) — e.g. `fadeIn`, `modalSlideUp`, `cardEnter`, `rippleExpand`. Component code references them by name in `animation:` properties.

---

## 5. Key components explained

- **`ItemModal.tsx`** — the popup for a single book/movie/series. Handles: showing the poster/description, star ratings (writes to the `ratings` table), comments (writes to `comments`), "Add to My List" (writes to `user_lists`). Body scroll is locked while it's open.
- **`LibraryPage.tsx`** — fetches all `items` + `ratings` on load, computes average ratings client-side, renders the filterable grid. Also contains the `ItemCard` and `Stars` components used elsewhere.
- **`ChatWidget.tsx`** — fully client-side (no AI API/key). Menu-driven: recommends real titles from your `items` table, and logs bug reports/missing titles/suggestions into the `feedback` table.
- **`AuthContext.tsx`** — wraps the whole app; any component can call `useAuth()` to get `{ user, profile, login, logout, register }`.

---

## 6. The database — every table, in plain terms

| Table | Purpose | Who can write to it |
|---|---|---|
| `profiles` | Display name per user | Each user, their own row only |
| `items` | Every book/movie/series | **Nobody from the app** — only you, via Supabase dashboard |
| `ratings` | 1–5 star ratings | Each user, their own ratings only |
| `comments` | Comments on items | Each user, their own comments only |
| `user_lists` | Each user's saved/"my list" items | Each user, their own list only |
| `feedback` | Bug reports / missing titles / suggestions from the chat widget | Anyone can submit (no login required); nobody can read from the app — only you, via dashboard |

Every table has **Row Level Security (RLS)** turned on — this is Supabase's permission system. Each table has explicit rules ("policies") saying exactly who can read/write which rows. This is why, for example, you can delete your own comment but not someone else's — the database itself enforces it, not just the app's UI.

`items` has no write policies at all for regular users — that's intentional, so your library stays curated and only editable by you.

---

## 7. How to work in Supabase (day-to-day)

Go to **supabase.com → your project**. Two tabs you'll use constantly:

### Table Editor (left sidebar)
A spreadsheet view of every table. This is where you:
- **Add a book/movie/series**: `items` table → Insert → Insert row → fill in `type` (`book`/`movie`/`series`), `title`, `author`, `description`, `icon` (an emoji), `image_url` (a direct image link, optional)
- **Edit anything**: click directly on a cell, type, it saves immediately
- **Delete a row**: select its checkbox → Delete (deleting an item auto-deletes its ratings/comments/list-saves too)
- **Review chat-widget feedback**: `feedback` table → update `status` from `new` to `reviewed`/`resolved` as you go

### SQL Editor (left sidebar)
For anything beyond simple edits — bulk inserts, schema changes, or running the `.sql` files from `supabase/migrations/` if you ever need to re-apply them. Paste SQL, click Run.

Example — adding several items at once:
```sql
INSERT INTO items (type, title, author, description, icon) VALUES
('book', 'Dune', 'Frank Herbert', 'Epic sci-fi saga on a desert planet.', '📚'),
('movie', 'Parasite', 'Bong Joon-ho', 'Korean class-satire thriller.', '🎬');
```

### Other tabs worth knowing
- **Authentication → Users**: every registered account (email, sign-up date)
- **Storage**: if you want to upload your own images instead of linking external ones — create a public bucket, upload, copy the file's URL, paste into an item's `image_url`
- **Database → Migrations**: shows the history of schema changes (matches the files in your `supabase/migrations/` folder)

### If you change the database schema yourself
Always write it as a new `.sql` file in `supabase/migrations/` (with a timestamp prefix, matching the existing files) *and* run the same SQL in the dashboard's SQL Editor. This keeps your local files and live database in sync — the migration files are your record of what changed and why, in case you need to rebuild the database from scratch later.

---

## 8. Common edits — quick recipes

| I want to... | Do this |
|---|---|
| Change a color everywhere | Edit the variable in `style.css` `:root`, then check for matching hardcoded hex codes in `.tsx` files |
| Add/edit a book/movie/series | Supabase → Table Editor → `items` |
| Change page text (About, Contact, etc.) | Edit the matching file in `src/pages/` |
| Change the navbar links | `src/components/Navbar.tsx` — two arrays (desktop + mobile) |
| Add a new page | See section 3 above |
| Change fonts | `index.html` + `src/index.css` (Google Fonts URL) + `--font-*` variables in `style.css` |
| Change an animation's speed/style | Find its `@keyframes` name in `style.css`, or the `animation:` line in the component using it |
| See who's registered | Supabase → Authentication → Users |
| Review bug reports/suggestions | Supabase → Table Editor → `feedback` |

---

## 9. Deploying changes

After any edit:
```bash
npm run build
```
Then deploy the `dist/` folder to Netlify the way you normally do. Database edits (Table Editor/SQL Editor) go live instantly — no rebuild or redeploy needed for those, since the site always reads live from Supabase.
