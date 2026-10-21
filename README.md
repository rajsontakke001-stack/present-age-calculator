# Present Age Calculator

A React + Vite app that calculates your exact age in years, months and
days — and visualizes the current year as one lap around the sun, from
your last birthday to your next one.

![Node](https://img.shields.io/badge/node-18%2B-339933?logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-6-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=061a23)

## Features

- Exact age in years, months and days (calendar-accurate, not rounded averages)
- An animated "orbit ring" showing how far through the current birthday-to-birthday cycle you are
- Total days lived and a countdown to your next birthday
- Handles leap-year (Feb 29) birthdays and rejects future dates
- Fully responsive, keyboard-accessible, and respects reduced-motion preferences
- Nothing leaves the browser — the date is never sent anywhere

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The build output goes to `dist/`.

---

## Push this project to GitHub

From inside the `Present-Age-Calculator` folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Replace `<your-username>/<your-repo>` with your actual GitHub repo.
If the repo doesn't exist yet, create an empty one first at
<https://github.com/new> (don't initialize it with a README, since this
project already has one).

## Deploy

The project builds to static files in `dist/`, so any static host works.
`vite.config.js` is set with `base: "./"`, so the build also works from a
subpath (like a GitHub Pages project site) without extra configuration.

### GitHub Pages (automatic)

A ready-made workflow is included at `.github/workflows/deploy.yml`. It
builds and deploys the site on every push to `main`.

1. Push the repo to GitHub (see above).
2. In the repo, go to **Settings → Pages**, and under **Build and
   deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or re-run the workflow from the **Actions** tab).
4. Your site goes live at `https://<your-username>.github.io/<your-repo>/`.

### Vercel

A `vercel.json` is included, so Vercel auto-detects the Vite build.

1. Go to <https://vercel.com/new> and import the GitHub repo.
2. Leave the defaults (build command `npm run build`, output `dist`) and click **Deploy**.

Or with the CLI:

```bash
npm i -g vercel
vercel
```

### Netlify

A `netlify.toml` is included with the build command and publish directory preset.

1. Go to <https://app.netlify.com/start> and import the GitHub repo.
2. Netlify reads `netlify.toml` automatically — just click **Deploy**.

Or with the CLI:

```bash
npm i -g netlify-cli
netlify deploy --build --prod
```

## Project structure

```
Present-Age-Calculator/
├─ .github/workflows/deploy.yml   # GitHub Pages CI/CD
├─ src/
│  ├─ App.jsx                     # app logic + UI
│  ├─ App.css                     # styling
│  └─ main.jsx                    # entry point
├─ index.html
├─ vite.config.js
├─ vercel.json                    # Vercel deploy config
├─ netlify.toml                   # Netlify deploy config
└─ package.json
```

## Notes

The age calculation uses local calendar dates and includes validation
against future dates. A February 29 birthday is treated as February 28
in non-leap years when working out the next birthday.
