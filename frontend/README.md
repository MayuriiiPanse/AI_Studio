# Reelcraft Studio — Frontend

A production-ready React (Vite) frontend for the Reelcraft AI content studio backend:
image → full content kit, AI poster generation, AI voice-over, a RAG-grounded chat
assistant, projects, and unified history.

## Stack

- **React 19 + Vite** — build tooling and dev server
- **React Router 7** — routing, protected routes
- **Framer Motion** — page/element animation
- **@react-three/fiber + three.js** — the small rotating 3D reel in the hero (lazy-loaded, code-split)
- **Socket.IO client** — real-time chat with the assistant
- **Axios** — API calls, configured with `withCredentials: true` for the backend's cookie session
- **react-hot-toast** — notifications
- **lucide-react** — icons
- Plain CSS with CSS Modules + CSS custom properties for theming (no CSS framework)

No UI kit or component library was used — every component (buttons, modals, tabs, cards,
inputs) is hand-built and lives in `src/components/ui`.

## Getting started

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL if your backend isn't on localhost:3000
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The Vite dev server's
default port matches what the backend's CORS config expects
(`origin: "http://localhost:5173"` in `src/app.js`), so no proxy setup is needed for local
development.

To build for production:

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally to sanity-check it
```

## Connecting to your backend

Everything is controlled by one environment variable:

```
VITE_API_URL=https://ai-studio-utkr.onrender.com
```

This should be the **origin of your backend** — no `/api` suffix, no trailing slash. The
app derives two things from it:

- REST calls go to `${VITE_API_URL}/api/...`
- Uploaded media (posters, voice-overs) returned as relative paths like
  `/uploads/images/poster-123.png` are resolved against this same origin, since the
  backend serves them with `express.static` at its root, not under `/api`.

If you deploy the backend somewhere other than `localhost:3000`, set `VITE_API_URL`
accordingly at build time (e.g. in your host's environment variable settings) and rebuild.

### Important backend notes

1. **Cookie-based auth.** The backend issues an httpOnly session cookie (`token`) on
   login/register and reads it back via `req.cookies.token` in `auth.middleware.js`.
   There's no `Authorization: Bearer` support server-side despite the comment in
   `chatController.js` — the frontend relies entirely on the cookie, sent automatically
   with `withCredentials: true`. Your backend's CORS config must keep
   `credentials: true` and an explicit `origin` (not `"*"`) for this to work, which it
   already does.

2. **Known backend bug to fix before go-live:** in `auth.controller.js`, the login
   handler has a typo — `rres.cookie(...)` instead of `res.cookie(...)`. As written, every
   login request throws a `ReferenceError` and never returns a response. This is a
   one-character fix on the backend; the frontend already assumes the corrected behavior
   (a cookie being set and `{ user }` returned in the JSON body).

3. **No logout route exists on the backend.** The session cookie has no `maxAge` set, so
   it's a browser-session cookie with no way to invalidate it server-side. "Log out" in
   this frontend clears local client state (so the UI immediately reflects a logged-out
   state), but the cookie itself only expires when the browser session ends. If you want
   a real server-side logout, add a route that calls `res.clearCookie("token")`.

4. **No "current user" / session-check endpoint.** Because of this, the frontend treats
   the presence of a cached user object (saved to `localStorage` after login/register) as
   "probably still logged in," and relies on any API call coming back `401` to clear that
   state and redirect to `/login`. This is a reasonable pattern given the backend's current
   shape, but a `GET /api/auth/me` endpoint would make this more robust.

None of the above required frontend workarounds beyond what's described — they're flagged
here so whoever owns the backend can prioritize fixing #2 (login is currently broken) and
optionally addressing #3/#4.

## Design

The visual direction ("Reelcraft") treats the app as a **content darkroom**: one raw
upload goes in, a full set of finished formats comes out (caption, hashtags, mood, story,
reel script, viral hook, an AI poster, a voice-over). The palette and typography reflect
that:

- **Colors:** a deep ink-green dark mode and a cool paper-grey light mode, with a brass
  accent (the "developed," finished-print color) and a teal accent (reserved for
  AI/live states — the chat's "live" badge, generation spinners).
- **Type:** Fraunces (display serif, used for headlines) + Inter (body) + IBM Plex Mono
  (labels, timestamps, buttons, badges — anything with a technical/spec feel).
- **Signature element:** the hero's "fan deck" — a source card fanning out into caption,
  hashtag, script, and voice-over cards, with a subtle mouse-driven 3D tilt.

### Light/dark mode

There is **no theme toggle by design** — the app reads `prefers-color-scheme` at the CSS
level (see `src/styles/theme.css`) and switches automatically with the user's OS setting.
A `useSystemTheme` hook is available for the rare cases (the 3D scene's material colors)
that need theme awareness in JavaScript rather than pure CSS.

## Project structure

```
src/
  api/            One file per backend resource (auth, posts, poster, voice, chat,
                   projects, history, rag), plus client.js (axios instance) and
                   socket.js (Socket.IO client)
  context/        AuthContext — login state, persisted user, 401 auto-logout
  hooks/          useAsync (data fetching), useSystemTheme, usePrefersReducedMotion
  components/
    ui/           Generic building blocks: Button, Card, Input, Textarea, Modal, Tabs,
                   Badge, EmptyState, Spinner, PageHeader, StatCard, ConfirmDialog,
                   ProtectedRoute
    layout/       Sidebar, Topbar, AppShell (authenticated app), PublicHeader, Footer,
                   Logo
    marketing/    Landing-page-only sections: Hero, FanDeck (signature element), Reel3D,
                   FeatureGrid, Workflow, PricingSection
    auth/         AuthLayout (shared split-screen layout for Login/Register)
    studio/       Dropzone, ContentKitEditor (used by both Studio and PostDetail)
    voice/        AudioPlayer
    chat/         MessageBubble
  pages/          One file per route (see below)
  styles/         theme.css (design tokens / light+dark variables), global.css (resets,
                   utilities, animations)
```

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Landing | Public marketing page |
| `/login`, `/register` | Auth | Public |
| `/dashboard` | Overview | Stats + recent activity |
| `/studio` | Studio | Upload an image → generate a full content kit |
| `/posts`, `/posts/:id` | Content library | List + edit/delete a generated kit |
| `/poster` | Poster lab | Prompt → AI poster, gallery of past posters |
| `/voice` | Voice lab | Script → voice-over, list with playback |
| `/chat` | Assistant | Real-time (Socket.IO) chat, REST fallback |
| `/projects`, `/projects/:id` | Projects | Group content into campaigns |
| `/history` | History | Unified, filterable activity log |
| `/knowledge` | Knowledge base | Upload + search RAG documents |
| `/settings` | Settings | Profile, appearance info, API endpoint, log out |

All routes except `/`, `/login`, and `/register` require authentication and render inside
`AppShell` (sidebar + topbar).

## Accessibility & responsiveness

- Built mobile-first; the sidebar collapses into a slide-out drawer under 900px.
- Visible focus states on every interactive element (`:focus-visible`).
- Respects `prefers-reduced-motion` — animations are effectively disabled for anyone who
  has that OS setting on, including the 3D reel's rotation.
