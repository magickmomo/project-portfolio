# Project Graveyard

A simple, expandable portfolio documenting active, paused and abandoned software projects.

## Running locally

```bash
npm install
npm run dev
```

Build for deployment with `npm run build`. Vercel supports the Vite project automatically.

## Updating projects

Edit `src/projects.json`. Projects appear in descending order of `updatedAt`. Each record contains:
- Name, description, status and icon.
- Website and source repository URLs.
- Started and launched dates.
- Visitors, registered users, peak active users, revenue and costs.
- Milestones, outcomes, lessons learned.

A `null` metric means **not tracked**. Use numeric `0` only for a confirmed zero value. Monetary values are in GBP. Peak active user counts should specify the period in `peakPeriod`.

This version intentionally has no database, admin login, or third-party analytics integrations. It's designed to stay lightweight.
