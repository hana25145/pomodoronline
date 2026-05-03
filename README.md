# Shared Pomodoro Atelier

A multi-room Pomodoro app with login, chat, shared music queue, and host-only timer controls.

## Local Run

```bash
npm start
```

Open `http://localhost:5173` in your browser.

## Deployment

This app is not a static site. It needs a `Node.js + WebSocket` server, so Docker-friendly hosts are the best fit.

Recommended platforms:

- Railway
- Render
- Fly.io

## Environment Variables

- `PORT`: server port. Default: `5173`
- `DATA_DIR`: directory for persisted user data such as `users.json`
- `PUBLIC_BASE_URL`: public app URL, used for Google OAuth callbacks
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: Google OAuth redirect URI. Defaults to `${PUBLIC_BASE_URL}/api/google/callback`
- `GOOGLE_DRIVE_FOLDER_ID`: optional Drive folder ID for uploaded files

Example:

```bash
DATA_DIR=/data
PUBLIC_BASE_URL=https://your-app.up.railway.app
GOOGLE_REDIRECT_URI=https://your-app.up.railway.app/api/google/callback
```

If you want signups to survive restarts and redeploys, mount a persistent disk and point `DATA_DIR` to it.
Shared Material uploads use the uploader's connected Google Drive account when Google OAuth is configured.

## Health Check

Use this path for health checks:

```text
/health
```

## Docker

This repo already includes `Dockerfile` and `.dockerignore`.

Build:

```bash
docker build -t shared-pomodoro-atelier .
```

Run:

```bash
docker run --rm -p 8080:8080 -e PORT=8080 shared-pomodoro-atelier
```

Then open `http://localhost:8080`.

## Railway

1. Create a new Railway project.
2. Push this folder to a GitHub repository.
3. Connect the repository in Railway.
4. Add a volume if you want persistent accounts.
5. Set `DATA_DIR=/data`.
6. Deploy.

`railway.json` is included with a Docker build and `/health` check.

## Render

1. Create a new Web Service.
2. Push this folder to a GitHub repository.
3. Connect it as a Docker service.
4. Add a persistent disk if you want durable accounts.
5. Set `DATA_DIR=/data`.
6. Set the health check path to `/health`.

## Files

- `server.js`: HTTP server, auth API, WebSocket room server
- `public/index.html`: app markup
- `public/styles.css`: UI styles
- `public/app.js`: client state and real-time sync
- `data/users.json`: stored user accounts
