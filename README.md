# Noah Training — Arcade × Coach

Mobile-first workout tracker for Noah (age 14). XP, ranks, quests, 4-day A/B/C/D rotation, allowance-rule logic, and the "4 sessions in 8 days unlocks the phone" quest.

Built as React + Vite + TypeScript + Tailwind, deploying to GitHub Pages.

## Local dev

```bash
npm install
npm run dev
```

Opens on http://localhost:5173 (or next free port).

## Type-check & build

```bash
npm run build          # runs tsc then vite build → dist/
```

## Deploy to GitHub Pages

Two options, both work.

### Option A — automatic (recommended)

Push to `main`. The `.github/workflows/deploy.yml` workflow runs `npm ci && npm run build` and publishes `dist/` to the `github-pages` environment.

**Set it up once:** repo → Settings → Pages → Build and deployment → Source = "GitHub Actions".

### Option B — manual from your laptop

```bash
npm run deploy         # builds and pushes dist/ to the gh-pages branch
```

**Set it up once:** repo → Settings → Pages → Build and deployment → Source = "Deploy from a branch" → Branch = `gh-pages` / `(root)`.

## Base path

`vite.config.ts` sets `base: '/noah-training/'`. If you rename the repo, update that value.

## Storage

localStorage key `noah_workouts_v1`. Safe to import data from the old single-HTML app — the schema is compatible, XP/PR fields get defaulted on load.

## Project layout

```
src/
  data/          WORKOUTS (A/B/C/D), PLAN_COPY, ACHIEVEMENTS
  state/         localStorage store, useStore hook, XP/rank/streak/allowance logic
  components/    Header, XpBar, BottomNav, Eyebrow, Icons
  views/         Today, LiveSession, Plan, Stats, Log
  App.tsx        tab router + session view toggle
```
