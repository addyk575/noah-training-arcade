# Addy Training

Mobile-first gym tracker for Addy's 3-day split (chest + triceps, back + biceps, shoulders). Exercise demo photos, superset grouping, per-set logging prefilled from last time, a 3-workouts-per-week goal, personal bests and history.

Exercise photos in `public/exercises/` come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (public domain).

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

localStorage key `addy_workouts_v1`.

## Project layout

```
src/
  data/          WORKOUTS (A/B/C), PLAN_COPY, ACHIEVEMENTS
  state/         localStorage store, useStore hook, streak/weekly-goal logic
  components/    BottomNav, ExerciseImage (thumb + demo), Icons
  views/         Today, LiveSession, Plan, Stats, Log
  App.tsx        tab router + session view toggle
```
