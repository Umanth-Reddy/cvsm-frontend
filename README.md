# CVSM frontend

Vite/React frontend for the three [CVSM models](https://cvsm-backend.vercel.app/api/cvsm). The Compare page sends two audio files to `POST /api/cvsm` once per model and shows the returned cosine similarity scores. The production build calls `https://cvsm-backend.vercel.app/api/cvsm` directly; set `VITE_API_BASE` at build time to change the API origin (include the `/api` path).

## Run and deploy

```sh
npm ci
npm run dev
npm run build
```

Import this folder as a Vercel project with the Vite preset. The included `vercel.json` keeps client-side routes working on refresh. The backend permits cross-origin calls by default. If you set `CORS_ORIGIN` on the backend, set it to the frontend's exact origin.

Vercel limits the backend request body to 4 MiB. The frontend checks the two files together and reserves 1 KiB for multipart fields. The backend analyses the middle four seconds of each clip. Scores range from -1 to 1; they are not probabilities or percentages.

## Demo audio credit

The two clips in `public/demo/` were cropped from [“Singin’ in the Rain,” performed by Cary Bass-Deschenes](https://commons.wikimedia.org/wiki/File:Singin%27_in_the_Rain.mp3), then converted to mono MP3. The source recording is licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The demo compares two different passages from that recording.
