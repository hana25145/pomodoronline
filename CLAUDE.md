# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start server (default port 5173, or $PORT)
```

No linting, testing, or build steps are configured. There are no dev dependencies — modify files directly and restart the server.

**Docker:**
```bash
docker build -t shared-pomodoro-atelier .
docker run --rm -p 8080:8080 -e PORT=8080 shared-pomodoro-atelier
```

**Health check:** `GET /health` → `{ ok, uptime, rooms }`

## Architecture

A real-time, multi-user Pomodoro timer app. **Backend** is a single-file Node.js HTTP+WebSocket server with no framework. **Frontend** is vanilla JS with ES modules, HTML5, and Canvas — no bundler.

### Backend (`server.js`, ~1000 lines)

One file handles everything:
- Static file serving
- REST endpoints: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/youtube-search`
- Raw WebSocket server (manual frame parsing — no Socket.io)
- In-memory room state via a `Map<roomId, roomObject>`
- Timer logic, music queue, chat, participant tracking

**Room state** lives entirely in memory. Empty rooms are GC'd after 60 seconds. Chat and history are not persisted.

**Auth** uses `crypto.scryptSync` for passwords and random Bearer tokens. User accounts are persisted to `data/users.json` (path controlled by `DATA_DIR` env var).

**YouTube search** scrapes `youtube.com/results` HTML, parses `ytInitialData` JSON from the page source.

### Frontend (`public/app.js`, ~1500 lines)

Single monolithic file. State is held in module-level variables and synced via WebSocket snapshots from the server. The server sends a full room snapshot on every meaningful change; the client re-renders from it.

Auth token, display name, and color are stored in `localStorage`.

Timer is rendered on a `<canvas>` element.

### WebSocket Protocol

Client → Server message types: `hello`, `command`, `chat`, `music`, `rename`

Server → Client: `snapshot` (full room state), `error`

`command` messages control the timer (start/pause/reset/mode/duration) and are host-only enforced server-side.

## Environment Variables

| Variable  | Default   | Purpose                                 |
|-----------|-----------|-----------------------------------------|
| `PORT`    | `5173`    | Server port                             |
| `DATA_DIR`| `./data`  | Directory for `users.json` persistence  |
| `NODE_ENV`| —         | Set to `production` in Docker           |

## Deployment

Deployed via Docker on Railway (`railway.json` configures health check path and restart policy). Other platforms (Render, Fly.io) follow the same Docker pattern with a persistent disk mounted at `/data`.
