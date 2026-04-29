import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const PORT = Number(process.env.PORT || 5173);
const MAX_CHAT_MESSAGES = 80;
const MAX_HISTORY_ITEMS = 10;
const MAX_QUEUE_PER_USER = 5;
const STATUS_UPDATE_COOLDOWN = 10 * 60 * 1000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const DEFAULT_DURATIONS = {
  focus: 25 * 60 * 1000,
  short: 5 * 60 * 1000,
  long: 15 * 60 * 1000
};

const users = loadUsers();
const authTokens = new Map();
const rooms = new Map();
const sockets = new Map();

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

function loadUsers() {
  ensureDataDir();
  if (!fs.existsSync(usersFile)) {
    return new Map();
  }

  try {
    const raw = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    return new Map(raw.map((user) => [user.username, user]));
  } catch {
    return new Map();
  }
}

function persistUsers() {
  ensureDataDir();
  fs.writeFileSync(usersFile, JSON.stringify([...users.values()], null, 2));
}

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "")
    .slice(0, 20);
}

function normalizeRoom(value) {
  return String(value || "studio")
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36) || "studio";
}

function normalizeDisplayName(value, fallback = "Guest") {
  const cleaned = String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 24);

  return cleaned || fallback;
}

function normalizeStatusText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

function formatCooldown(milliseconds) {
  const totalSeconds = Math.ceil(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function parseInitialDurations(searchParams) {
  const durations = { ...DEFAULT_DURATIONS };

  for (const mode of ["focus", "short", "long"]) {
    const minutes = Number(searchParams.get(mode));
    if (Number.isFinite(minutes)) {
      durations[mode] = Math.min(120, Math.max(1, Math.round(minutes))) * 60 * 1000;
    }
  }

  return durations;
}

function createTimerState(initialDurations = DEFAULT_DURATIONS) {
  return {
    mode: "focus",
    status: "idle",
    durations: { ...initialDurations },
    remainingMs: initialDurations.focus,
    startedAt: null,
    cycle: 1,
    focusSessionsDone: 0,
    lastUpdatedBy: "Studio"
  };
}

function createMusicState() {
  return {
    current: null,
    queue: []
  };
}

function getRoom(roomId) {
  return rooms.get(roomId) || null;
}

function createRoom(roomId, durations = DEFAULT_DURATIONS) {
  const room = {
    id: roomId,
    createdAt: Date.now(),
    timer: createTimerState(durations),
    music: createMusicState(),
    hostId: null,
    participants: new Map(),
    presence: new Map(),
    clients: new Set(),
    history: [],
    messages: [],
    focusTasks: new Map()
  };
  rooms.set(roomId, room);
  return room;
}

function assignHostIfNeeded(room) {
  if (room.hostId && [...room.clients].some((c) => c.id === room.hostId)) {
    return;
  }

  const clients = [...room.clients];
  if (clients.length === 0) {
    room.hostId = null;
    return;
  }

  const newHost = clients[Math.floor(Math.random() * clients.length)];
  room.hostId = newHost.id;

  for (const client of room.clients) {
    client.isHost = client.id === room.hostId;
    client.participant.isHost = client.isHost;
  }

  addHistory(room, newHost.participant.name, "is now the host");
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function createSession(username) {
  const token = crypto.randomBytes(24).toString("hex");
  authTokens.set(token, username);
  return token;
}

function getUserFromToken(token) {
  const username = authTokens.get(token);
  if (!username) {
    return null;
  }

  return users.get(username) || null;
}

function sanitizeUser(user) {
  return user ? { username: user.username, createdAt: user.createdAt } : null;
}

function extractToken(request) {
  const authHeader = String(request.headers.authorization || "");
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return "";
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString("utf8");
      if (body.length > 100_000) {
        reject(new Error("Payload too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(text);
}

function currentRemaining(timer, now = Date.now()) {
  if (timer.status !== "running" || !timer.startedAt) {
    return Math.max(0, timer.remainingMs);
  }

  return Math.max(0, timer.remainingMs - (now - timer.startedAt));
}

function setTimerMode(timer, mode, actor = "Studio") {
  timer.mode = mode;
  timer.status = "idle";
  timer.remainingMs = timer.durations[mode];
  timer.startedAt = null;
  timer.lastUpdatedBy = actor;
}

function transitionTimer(room) {
  const timer = room.timer;

  if (timer.mode === "focus") {
    timer.focusSessionsDone += 1;
    const isLongBreak = timer.focusSessionsDone % 4 === 0;
    setTimerMode(timer, isLongBreak ? "long" : "short", "Timer");
  } else {
    timer.cycle += 1;
    setTimerMode(timer, "focus", "Timer");
  }

  addHistory(room, "Timer", timer.mode === "focus" ? `Cycle ${timer.cycle} focus ready` : `${timer.mode === "long" ? "Long" : "Short"} break ready`);
}

function addHistory(room, by, text) {
  room.history.unshift({ at: Date.now(), by, text });
  room.history = room.history.slice(0, MAX_HISTORY_ITEMS);
}

function addChat(room, author, text) {
  room.messages.push({
    id: crypto.randomUUID(),
    at: Date.now(),
    author,
    text
  });
  room.messages = room.messages.slice(-MAX_CHAT_MESSAGES);
}

function tracksReservedByUser(room, username) {
  const currentCount = room.music.current?.requestedBy?.username === username ? 1 : 0;
  const queuedCount = room.music.queue.filter((track) => track.requestedBy.username === username).length;
  return currentCount + queuedCount;
}

function startNextTrack(room) {
  if (room.music.current || room.music.queue.length === 0) {
    return false;
  }

  const next = room.music.queue.shift();
  room.music.current = {
    ...next,
    startedAt: Date.now()
  };
  addHistory(room, next.requestedBy.name, `queued ${next.title}`);
  return true;
}

function advanceTrack(room, by = "Music") {
  const previous = room.music.current;
  room.music.current = null;
  const started = startNextTrack(room);
  if (previous) {
    addHistory(room, by, started ? `skipped to ${room.music.current.title}` : `ended ${previous.title}`);
  }
}

function snapshot(room, client = null) {
  const now = Date.now();
  const remainingMs = currentRemaining(room.timer, now);
  return {
    type: "snapshot",
    room: room.id,
    isHost: Boolean(client?.isHost),
    viewer: client
      ? {
          username: client.user.username,
          name: client.participant.name,
          statusText: client.participant.statusText || "",
          statusCooldownUntil: client.participant.statusCooldownUntil || 0
        }
      : null,
    serverNow: now,
    timer: {
      ...room.timer,
      remainingMs,
      startedAt: room.timer.status === "running" ? now : null
    },
    participants: [...room.participants.values()].sort((a, b) => a.joinedAt - b.joinedAt),
    history: room.history,
    chat: room.messages,
    music: {
      current: room.music.current,
      queue: room.music.queue,
      maxPerUser: MAX_QUEUE_PER_USER
    },
    focusTasks: [...room.focusTasks.values()].map((entry) => ({
      username: entry.username,
      name: entry.name,
      color: entry.color,
      task: entry.task
    }))
  };
}

function handleFocusTaskMessage(client, message) {
  const room = client.room;
  const username = client.user.username;
  const text = String(message.text || "").trim().slice(0, 120);

  if (!room.focusTasks.has(username)) {
    room.focusTasks.set(username, { username, name: client.participant.name, color: client.participant.color, task: "" });
  }
  const entry = room.focusTasks.get(username);
  entry.task = text;
  return true;
}

function handleStatusMessage(client, message) {
  const room = client.room;
  const nextStatus = normalizeStatusText(message.text);
  if (!nextStatus) {
    sendToClient(client, { type: "notice", level: "error", text: "Status cannot be empty." });
    return false;
  }

  if (nextStatus === (client.participant.statusText || "")) {
    return false;
  }

  const now = Date.now();
  const cooldownUntil = client.participant.statusCooldownUntil || 0;
  if (cooldownUntil > now) {
    sendToClient(client, {
      type: "notice",
      level: "error",
      text: `You can update your status again in ${formatCooldown(cooldownUntil - now)}.`
    });
    return false;
  }

  client.participant.statusText = nextStatus;
  client.participant.statusUpdatedAt = now;
  client.participant.statusCooldownUntil = now + STATUS_UPDATE_COOLDOWN;
  client.participant.lastSeen = now;
  room.participants.set(client.id, client.participant);
  room.presence.set(client.user.username, {
    statusText: client.participant.statusText,
    statusUpdatedAt: client.participant.statusUpdatedAt,
    statusCooldownUntil: client.participant.statusCooldownUntil
  });
  return true;
}

function handleTodoMessage(client, message) {
  const room = client.room;
  const username = client.user.username;
  const text = String(message.text || "").trim().slice(0, 120);

  if (!room.focusTasks.has(username)) {
    room.focusTasks.set(username, { username, name: client.participant.name, color: client.participant.color, task: "" });
  }
  const entry = room.focusTasks.get(username);
  entry.task = text;
  return true;
}

function sendFrame(socket, data) {
  if (socket.destroyed) {
    return;
  }

  const payload = Buffer.from(data);
  let header;

  if (payload.length < 126) {
    header = Buffer.from([0x81, payload.length]);
  } else if (payload.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
  }

  socket.write(Buffer.concat([header, payload]));
}

function sendToClient(client, payload) {
  sendFrame(client.socket, JSON.stringify(payload));
}

function broadcast(room) {
  for (const client of room.clients) {
    sendToClient(client, snapshot(room, client));
  }
}

function readFrames(buffer) {
  const messages = [];
  let offset = 0;

  while (offset + 2 <= buffer.length) {
    const first = buffer[offset];
    const second = buffer[offset + 1];
    const opcode = first & 0x0f;
    const masked = (second & 0x80) !== 0;
    let length = second & 0x7f;
    let cursor = offset + 2;

    if (length === 126) {
      if (cursor + 2 > buffer.length) break;
      length = buffer.readUInt16BE(cursor);
      cursor += 2;
    } else if (length === 127) {
      if (cursor + 8 > buffer.length) break;
      length = Number(buffer.readBigUInt64BE(cursor));
      cursor += 8;
    }

    const maskLength = masked ? 4 : 0;
    if (cursor + maskLength + length > buffer.length) break;

    let maskingKey;
    if (masked) {
      maskingKey = buffer.subarray(cursor, cursor + 4);
      cursor += 4;
    }

    const payload = Buffer.from(buffer.subarray(cursor, cursor + length));
    if (masked) {
      for (let index = 0; index < payload.length; index += 1) {
        payload[index] ^= maskingKey[index % 4];
      }
    }

    if (opcode === 0x1) {
      messages.push({ type: "text", value: payload.toString("utf8") });
    } else if (opcode === 0x8) {
      messages.push({ type: "close" });
    }

    offset = cursor + length;
  }

  return { messages, remaining: buffer.subarray(offset) };
}

function handleTimerCommand(client, message) {
  const room = client.room;
  const timer = room.timer;
  const actor = normalizeDisplayName(message.name || client.participant.name, client.participant.name);

  if (!client.isHost) {
    sendToClient(client, { type: "notice", level: "error", text: "Only the host can control the timer." });
    sendToClient(client, snapshot(room, client));
    return false;
  }

  const now = Date.now();
  client.participant.lastSeen = now;

  switch (message.action) {
    case "start":
      timer.remainingMs = currentRemaining(timer, now) || timer.durations[timer.mode];
      timer.status = "running";
      timer.startedAt = now;
      timer.lastUpdatedBy = actor;
      addHistory(room, actor, "started the timer");
      break;
    case "pause":
      timer.remainingMs = currentRemaining(timer, now);
      timer.status = "paused";
      timer.startedAt = null;
      timer.lastUpdatedBy = actor;
      addHistory(room, actor, "paused the room");
      break;
    case "reset":
      timer.status = "idle";
      timer.remainingMs = timer.durations[timer.mode];
      timer.startedAt = null;
      timer.lastUpdatedBy = actor;
      addHistory(room, actor, `reset ${timer.mode}`);
      break;
    case "mode": {
      const nextMode = ["focus", "short", "long"].includes(message.mode) ? message.mode : "focus";
      setTimerMode(timer, nextMode, actor);
      addHistory(room, actor, `switched to ${nextMode}`);
      break;
    }
    case "durations": {
      const durations = message.durations || {};
      const wasRunning = timer.status === "running";
      const previousRemaining = currentRemaining(timer, now);

      for (const mode of ["focus", "short", "long"]) {
        const minutes = Number(durations[mode]);
        if (Number.isFinite(minutes)) {
          timer.durations[mode] = Math.min(120, Math.max(1, Math.round(minutes))) * 60 * 1000;
        }
      }

      timer.remainingMs = wasRunning ? Math.min(previousRemaining, timer.durations[timer.mode]) : timer.durations[timer.mode];
      timer.startedAt = wasRunning ? now : null;
      timer.lastUpdatedBy = actor;
      addHistory(room, actor, "tuned the rhythm");
      break;
    }
    default:
      return false;
  }

  return true;
}

function handleChatMessage(client, message) {
  const room = client.room;
  const text = String(message.text || "").trim().slice(0, 300);
  if (!text) {
    return false;
  }

  addChat(room, {
    username: client.user.username,
    name: client.participant.name
  }, text);
  return true;
}

function handleMusicMessage(client, message) {
  const room = client.room;
  const music = room.music;

  switch (message.action) {
    case "add": {
      const track = message.track || {};
      const title = String(track.title || "").trim().slice(0, 120);
      const videoId = String(track.videoId || "").trim().slice(0, 32);
      const channelTitle = String(track.channelTitle || "").trim().slice(0, 80);
      const thumbnail = String(track.thumbnail || "").trim().slice(0, 300);
      const durationSeconds = Number(track.durationSeconds);

      if (!title || !videoId || !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
        sendToClient(client, { type: "notice", level: "error", text: "Track data is incomplete." });
        return false;
      }

      if (tracksReservedByUser(room, client.user.username) >= MAX_QUEUE_PER_USER) {
        sendToClient(client, { type: "notice", level: "error", text: "You can reserve up to 5 tracks." });
        return false;
      }

      const entry = {
        id: crypto.randomUUID(),
        videoId,
        title,
        channelTitle,
        thumbnail,
        durationSeconds: Math.min(60 * 60 * 4, Math.max(1, Math.round(durationSeconds))),
        requestedAt: Date.now(),
        requestedBy: {
          username: client.user.username,
          name: client.participant.name
        }
      };

      if (!music.current) {
        music.current = {
          ...entry,
          startedAt: Date.now()
        };
        addHistory(room, client.participant.name, `started ${entry.title}`);
      } else {
        music.queue.push(entry);
        addHistory(room, client.participant.name, `added ${entry.title}`);
      }
      return true;
    }
    case "remove": {
      const trackId = String(message.trackId || "");
      if (!trackId) {
        return false;
      }

      if (music.current?.id === trackId && client.isHost) {
        advanceTrack(room, client.participant.name);
        return true;
      }

      const index = music.queue.findIndex((track) => track.id === trackId);
      if (index === -1) {
        return false;
      }

      const track = music.queue[index];
      const canRemove = client.isHost || track.requestedBy.username === client.user.username;
      if (!canRemove) {
        sendToClient(client, { type: "notice", level: "error", text: "You can only remove your own queued tracks." });
        return false;
      }

      music.queue.splice(index, 1);
      addHistory(room, client.participant.name, `removed ${track.title}`);
      return true;
    }
    case "skip": {
      if (!client.isHost || !music.current) {
        sendToClient(client, { type: "notice", level: "error", text: "Only the host can skip the current track." });
        return false;
      }

      advanceTrack(room, client.participant.name);
      return true;
    }
    default:
      return false;
  }
}

function handleClientMessage(client, rawMessage) {
  let message;
  try {
    message = JSON.parse(rawMessage);
  } catch {
    return;
  }

  const room = client.room;

  if (message.type === "hello" || message.type === "rename") {
    client.participant.name = normalizeDisplayName(message.name || client.user.username, client.user.username);
    client.participant.color = String(message.color || client.participant.color).slice(0, 32);
    client.participant.isHost = client.isHost;
    client.participant.lastSeen = Date.now();
    room.participants.set(client.id, client.participant);
    if (room.focusTasks.has(client.user.username)) {
      const ftEntry = room.focusTasks.get(client.user.username);
      ftEntry.name = client.participant.name;
      ftEntry.color = client.participant.color;
    }
    broadcast(room);
    return;
  }

  let changed = false;
  if (message.type === "command") {
    changed = handleTimerCommand(client, message);
  } else if (message.type === "chat") {
    changed = handleChatMessage(client, message);
  } else if (message.type === "music") {
    changed = handleMusicMessage(client, message);
  } else if (message.type === "focusTask") {
    changed = handleFocusTaskMessage(client, message);
  } else if (message.type === "status") {
    changed = handleStatusMessage(client, message);
  }

  if (changed) {
    broadcast(room);
  }
}

function removeClient(socket) {
  const client = sockets.get(socket);
  if (!client) {
    return;
  }

  const room = client.room;
  sockets.delete(socket);
  room.clients.delete(client);
  room.participants.delete(client.id);
  addHistory(room, client.participant.name, "left quietly");
  assignHostIfNeeded(room);
  broadcast(room);

  if (room.clients.size === 0) {
    setTimeout(() => {
      const latest = rooms.get(room.id);
      if (latest && latest.clients.size === 0 && Date.now() - latest.createdAt > 60_000) {
        rooms.delete(room.id);
      }
    }, 60_000);
  }
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9"
        }
      }, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(`YouTube responded with ${response.statusCode}`));
          response.resume();
          return;
        }

        let data = "";
        response.on("data", (chunk) => {
          data += chunk.toString("utf8");
        });
        response.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function extractJsonObject(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }

  const start = source.indexOf("{", markerIndex);
  if (start === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === "\"") {
        inString = false;
      }
      continue;
    }

    if (character === "\"") {
      inString = true;
      continue;
    }

    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  return null;
}

function collectVideoRenderers(node, results = []) {
  if (!node || typeof node !== "object") {
    return results;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectVideoRenderers(item, results);
    }
    return results;
  }

  if (node.videoRenderer) {
    results.push(node.videoRenderer);
  }

  for (const value of Object.values(node)) {
    collectVideoRenderers(value, results);
  }

  return results;
}

function joinRuns(value) {
  if (!value) {
    return "";
  }

  if (value.simpleText) {
    return value.simpleText;
  }

  if (Array.isArray(value.runs)) {
    return value.runs.map((run) => run.text || "").join("");
  }

  return "";
}

function parseDurationSeconds(text) {
  const parts = String(text || "")
    .split(":")
    .map((value) => Number(value.trim()));

  if (!parts.length || parts.some((value) => !Number.isFinite(value))) {
    return 0;
  }

  return parts.reduce((total, part) => total * 60 + part, 0);
}

async function searchYouTube(query) {
  const html = await fetchText(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
  const jsonSource = extractJsonObject(html, "var ytInitialData =") || extractJsonObject(html, "ytInitialData =");
  if (!jsonSource) {
    throw new Error("Could not parse YouTube search results");
  }

  const initialData = JSON.parse(jsonSource);
  const renderers = collectVideoRenderers(initialData);

  return renderers
    .map((renderer) => {
      const durationText = joinRuns(renderer.lengthText);
      const durationSeconds = parseDurationSeconds(durationText);
      if (!renderer.videoId || !durationSeconds) {
        return null;
      }

      return {
        videoId: renderer.videoId,
        title: joinRuns(renderer.title),
        channelTitle: joinRuns(renderer.ownerText),
        durationText,
        durationSeconds,
        thumbnail: renderer.thumbnail?.thumbnails?.at(-1)?.url || ""
      };
    })
    .filter(Boolean)
    .slice(0, 8);
}

async function handleAuthRequest(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/auth/me") {
    const user = getUserFromToken(extractToken(request));
    if (!user) {
      sendJson(response, 401, { error: "Unauthorized" });
      return true;
    }

    sendJson(response, 200, { user: sanitizeUser(user) });
    return true;
  }

  if (request.method === "POST" && (url.pathname === "/api/auth/signup" || url.pathname === "/api/auth/login" || url.pathname === "/api/auth/logout")) {
    const rawBody = await readRequestBody(request);
    const body = rawBody ? JSON.parse(rawBody) : {};

    if (url.pathname === "/api/auth/logout") {
      const token = extractToken(request);
      if (token) {
        authTokens.delete(token);
      }
      sendJson(response, 200, { ok: true });
      return true;
    }

    const username = normalizeUsername(body.username);
    const password = String(body.password || "");

    if (username.length < 3 || password.length < 4) {
      sendJson(response, 400, { error: "Username must be at least 3 chars and password at least 4 chars." });
      return true;
    }

    if (url.pathname === "/api/auth/signup") {
      if (users.has(username)) {
        sendJson(response, 409, { error: "Username already exists." });
        return true;
      }

      const salt = crypto.randomBytes(16).toString("hex");
      const user = {
        username,
        salt,
        passwordHash: hashPassword(password, salt),
        createdAt: Date.now()
      };
      users.set(username, user);
      persistUsers();
      const token = createSession(username);
      sendJson(response, 201, { token, user: sanitizeUser(user) });
      return true;
    }

    const user = users.get(username);
    if (!user || hashPassword(password, user.salt) !== user.passwordHash) {
      sendJson(response, 401, { error: "Invalid username or password." });
      return true;
    }

    const token = createSession(username);
    sendJson(response, 200, { token, user: sanitizeUser(user) });
    return true;
  }

  return false;
}

async function handleYoutubeSearchRequest(request, response, url) {
  if (request.method !== "GET" || url.pathname !== "/api/youtube-search") {
    return false;
  }

  const user = getUserFromToken(extractToken(request));
  if (!user) {
    sendJson(response, 401, { error: "Unauthorized" });
    return true;
  }

  const query = String(url.searchParams.get("q") || "").trim();
  if (!query) {
    sendJson(response, 400, { error: "Search query is required." });
    return true;
  }

  try {
    const results = await searchYouTube(query);
    sendJson(response, 200, { results });
  } catch (error) {
    sendJson(response, 502, { error: error instanceof Error ? error.message : "Search failed." });
  }

  return true;
}

function serveStatic(request, response, url) {
  const requestedPath = decodeURIComponent(url.pathname);
  const safePath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(publicDir, safePath));

  if (!filePath.startsWith(publicDir)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendText(response, 404, "Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(content);
  });
}

async function handleHttpRequest(request, response) {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, {
        ok: true,
        uptime: Math.round(process.uptime()),
        rooms: rooms.size
      });
      return;
    }

    if (await handleAuthRequest(request, response, url)) {
      return;
    }

    if (await handleYoutubeSearchRequest(request, response, url)) {
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/rooms") {
      const user = getUserFromToken(extractToken(request));
      if (!user) {
        sendJson(response, 401, { error: "Unauthorized" });
        return;
      }
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      if (!body.room) {
        sendJson(response, 400, { error: "Invalid room code." });
        return;
      }
      const roomId = normalizeRoom(body.room);
      if (rooms.has(roomId)) {
        sendJson(response, 409, { error: "Room already exists." });
        return;
      }
      const fakeParams = { get: (key) => body[key] != null ? String(body[key]) : null };
      const durations = parseInitialDurations(fakeParams);
      createRoom(roomId, durations);
      sendJson(response, 201, { room: roomId });
      return;
    }

    if (request.method === "GET" && url.pathname.startsWith("/api/rooms/")) {
      const roomId = normalizeRoom(decodeURIComponent(url.pathname.slice("/api/rooms/".length)));
      if (rooms.has(roomId)) {
        sendJson(response, 200, { room: roomId });
      } else {
        sendJson(response, 404, { error: "Room not found." });
      }
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/debug/assign-host") {
      const roomId = normalizeRoom(url.searchParams.get("room"));
      const room = rooms.get(roomId);
      if (!room) {
        sendJson(response, 404, { error: "Room not found", roomId });
        return;
      }
      const hadHost = room.hostId && [...room.clients].some((c) => c.id === room.hostId);
      assignHostIfNeeded(room);
      const newHostClient = [...room.clients].find((c) => c.id === room.hostId);
      const hostName = newHostClient?.participant?.name ?? null;
      if (!hadHost && hostName) {
        broadcast(room);
      }
      sendJson(response, 200, {
        hadHost,
        hostId: room.hostId,
        hostName,
        participants: [...room.participants.values()].map((p) => ({ id: p.id, name: p.name, isHost: p.isHost }))
      });
      return;
    }

    serveStatic(request, response, url);
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : "Server error." });
  }
}

function handleUpgrade(request, socket) {
  const key = request.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = String(url.searchParams.get("token") || "");
  const user = getUserFromToken(token);

  if (!user) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  const roomId = normalizeRoom(url.searchParams.get("room"));
  const name = normalizeDisplayName(url.searchParams.get("name") || user.username, user.username);
  const room = getRoom(roomId);

  if (!room) {
    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    socket.destroy();
    return;
  }

  const accept = crypto
    .createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");

  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "",
    ""
  ].join("\r\n"));

  const id = crypto.randomUUID();
  const savedPresence = room.presence.get(user.username) || {};
  const participant = {
    id,
    username: user.username,
    name,
    color: url.searchParams.get("color") || "#d95540",
    statusText: savedPresence.statusText || "",
    statusUpdatedAt: savedPresence.statusUpdatedAt || 0,
    statusCooldownUntil: savedPresence.statusCooldownUntil || 0,
    isHost: false,
    joinedAt: Date.now(),
    lastSeen: Date.now()
  };

  const client = {
    id,
    room,
    user,
    socket,
    participant,
    isHost: false,
    buffer: Buffer.alloc(0)
  };

  sockets.set(socket, client);
  room.clients.add(client);
  room.participants.set(id, participant);
  if (!room.focusTasks.has(user.username)) {
    room.focusTasks.set(user.username, { username: user.username, name: participant.name, color: participant.color, task: "" });
  } else {
    const ftEntry = room.focusTasks.get(user.username);
    ftEntry.name = participant.name;
    ftEntry.color = participant.color;
  }
  room.presence.set(user.username, {
    statusText: participant.statusText,
    statusUpdatedAt: participant.statusUpdatedAt,
    statusCooldownUntil: participant.statusCooldownUntil
  });
  addHistory(room, name, "joined the room");
  assignHostIfNeeded(room);

  socket.on("data", (chunk) => {
    client.buffer = Buffer.concat([client.buffer, chunk]);
    const parsed = readFrames(client.buffer);
    client.buffer = parsed.remaining;

    for (const frame of parsed.messages) {
      if (frame.type === "text") {
        handleClientMessage(client, frame.value);
      } else if (frame.type === "close") {
        socket.end();
      }
    }
  });

  socket.on("close", () => removeClient(socket));
  socket.on("error", () => removeClient(socket));
}

const server = http.createServer(handleHttpRequest);
server.on("upgrade", handleUpgrade);

setInterval(() => {
  const now = Date.now();
  for (const room of rooms.values()) {
    let changed = false;

    if (room.timer.status === "running" && currentRemaining(room.timer, now) <= 0) {
      transitionTimer(room);
      changed = true;
    }

    if (room.music.current) {
      const endsAt = room.music.current.startedAt + room.music.current.durationSeconds * 1000;
      if (endsAt <= now) {
        advanceTrack(room, "Music");
        changed = true;
      }
    } else if (room.music.queue.length > 0) {
      startNextTrack(room);
      changed = true;
    }

    if (changed) {
      broadcast(room);
    }
  }
}, 500);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Shared Pomodoro Atelier running at http://localhost:${PORT}`);
});
