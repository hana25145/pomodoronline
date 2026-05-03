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
const groupsFile = path.join(dataDir, "groups.json");
const threadsFile = path.join(dataDir, "threads.json");
const filesDir = path.join(dataDir, "files");
const PORT = Number(process.env.PORT || 5173);
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${PUBLIC_BASE_URL}/api/google/callback`;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";
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
const DEFAULT_FILES_FOLDER_ID = "default-files";

const users = loadUsers();
const groups = loadGroups();
const threadsByGroup = loadThreads();
const authTokens = new Map();
const googleOAuthStates = new Map();
const rooms = new Map();
const sockets = new Map();
const activeClientsByUsername = new Map();

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

function loadGroups() {
  ensureDataDir();
  if (!fs.existsSync(groupsFile)) return new Map();
  try {
    const raw = JSON.parse(fs.readFileSync(groupsFile, "utf8"));
    return new Map(raw.map((g) => [g.id, { materials: [], ...g }]));
  } catch {
    return new Map();
  }
}

function persistGroups() {
  ensureDataDir();
  fs.writeFileSync(groupsFile, JSON.stringify([...groups.values()], null, 2));
}

function loadThreads() {
  ensureDataDir();
  if (!fs.existsSync(threadsFile)) return new Map();
  try {
    const raw = JSON.parse(fs.readFileSync(threadsFile, "utf8"));
    const map = new Map();
    for (const thread of raw) {
      if (!map.has(thread.groupId)) map.set(thread.groupId, []);
      map.get(thread.groupId).push(thread);
    }
    return map;
  } catch {
    return new Map();
  }
}

function persistThreads() {
  ensureDataDir();
  const all = [];
  for (const threads of threadsByGroup.values()) all.push(...threads);
  fs.writeFileSync(threadsFile, JSON.stringify(all, null, 2));
}

function getGroupFileDir(groupId, subjectId) {
  return path.join(filesDir, groupId, subjectId);
}

function saveGroupFile(groupId, subjectId, fileId, buffer) {
  const dir = getGroupFileDir(groupId, subjectId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, fileId), buffer);
}

function deleteGroupFile(groupId, subjectId, fileId) {
  try { fs.unlinkSync(path.join(getGroupFileDir(groupId, subjectId), fileId)); } catch {}
}

function sanitizeGroup(group) {
  return {
    id: group.id,
    name: group.name,
    createdBy: group.createdBy,
    createdAt: group.createdAt,
    members: [...group.members],
    materials: group.materials || []
  };
}

function normalizeMaterials(group) {
  group.materials = (group.materials || []).map((subject) => ({
    folders: [],
    files: [],
    ...subject
  }));
  for (const subject of group.materials) {
    subject.folders = subject.folders || [];
    subject.files = subject.files || [];
    let defaultFolder = subject.folders.find((folder) => folder.id === DEFAULT_FILES_FOLDER_ID);
    if (!defaultFolder) {
      defaultFolder = {
        id: DEFAULT_FILES_FOLDER_ID,
        name: "Files",
        createdBy: subject.createdBy || "System",
        createdAt: subject.createdAt || Date.now(),
        isDefault: true
      };
      subject.folders.unshift(defaultFolder);
    } else {
      defaultFolder.name = "Files";
      defaultFolder.isDefault = true;
    }
    for (const file of subject.files) {
      if (!file.folderId || !subject.folders.some((folder) => folder.id === file.folderId)) {
        file.folderId = DEFAULT_FILES_FOLDER_ID;
      }
    }
  }
  return group.materials;
}

function getKSTDate() {
  // Day boundary = 6 AM KST. Shift UTC by (9-6)=3 h so midnight of shifted time = 6 AM KST.
  const shifted = new Date(Date.now() + 3 * 3_600_000);
  return shifted.toISOString().slice(0, 10);
}

function ensureTodayData(user) {
  const today = getKSTDate();
  if (user.todayDate !== today) {
    user.todayDate = today;
    user.todayTasks = [];
    user.todayFocusMs = 0;
  }
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

function createRoom(roomId, durations = DEFAULT_DURATIONS, groupId = null) {
  const room = {
    id: roomId,
    createdAt: Date.now(),
    groupId,
    timer: createTimerState(durations),
    music: createMusicState(),
    hostId: null,
    participants: new Map(),
    presence: new Map(),
    clients: new Set(),
    history: [],
    messages: [],
    focusTasks: new Map(),
    sessionVotes: new Map()
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
  return user ? {
    username: user.username,
    createdAt: user.createdAt,
    googleDriveConnected: Boolean(user.googleDrive?.refreshToken)
  } : null;
}

function extractToken(request) {
  const authHeader = String(request.headers.authorization || "");
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return "";
}

function readRequestBody(request, maxBytes = 100_000) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString("utf8");
      if (body.length > maxBytes) {
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

function redirect(response, location) {
  response.writeHead(302, {
    Location: location,
    "Cache-Control": "no-store"
  });
  response.end();
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
    const focusMs = timer.durations.focus;
    for (const client of room.clients) {
      ensureTodayData(client.user);
      client.user.todayFocusMs = (client.user.todayFocusMs || 0) + focusMs;
    }
    persistUsers();
    timer.focusSessionsDone += 1;
    const isLongBreak = timer.focusSessionsDone % 4 === 0;
    setTimerMode(timer, isLongBreak ? "long" : "short", "Timer");
  } else {
    timer.cycle += 1;
    setTimerMode(timer, "focus", "Timer");
    room.sessionVotes.clear();
  }

  addHistory(room, "Timer", timer.mode === "focus" ? `Cycle ${timer.cycle} focus ready` : `${timer.mode === "long" ? "Long" : "Short"} break ready`);
}

function addHistory(room, by, text) {
  room.history.unshift({ at: Date.now(), by, text });
  room.history = room.history.slice(0, MAX_HISTORY_ITEMS);
}

function findGroupFile(groupId, subjectId, fileId) {
  const group = groups.get(groupId);
  if (!group) return null;
  const subject = normalizeMaterials(group).find((item) => item.id === subjectId);
  if (!subject) return null;
  const file = (subject.files || []).find((item) => item.id === fileId);
  if (!file) return null;
  const folder = (subject.folders || []).find((item) => item.id === file.folderId);
  return {
    id: file.id,
    subjectId: subject.id,
    subjectName: subject.name,
    folderId: file.folderId || DEFAULT_FILES_FOLDER_ID,
    folderName: folder?.name || "Files",
    name: file.name,
    mimeType: file.mimeType || "application/octet-stream",
    size: file.size || 0,
    webViewLink: file.webViewLink || "",
    webContentLink: file.webContentLink || ""
  };
}

function addChat(room, author, text, file = null) {
  room.messages.push({
    id: crypto.randomUUID(),
    at: Date.now(),
    author,
    text,
    file
  });
  room.messages = room.messages.slice(-MAX_CHAT_MESSAGES);
}

function googleDriveConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REDIRECT_URI);
}

async function exchangeGoogleCode(code) {
  const body = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code"
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error_description || data.error || "Google authorization failed.");
  return data;
}

async function refreshGoogleAccessToken(user) {
  const refreshToken = user.googleDrive?.refreshToken;
  if (!refreshToken) throw new Error("Google Drive is not connected.");
  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error_description || data.error || "Could not refresh Google Drive access.");
  return data.access_token;
}

async function uploadToGoogleDrive(user, { name, mimeType, buffer }) {
  if (!googleDriveConfigured()) {
    const err = new Error("Google Drive is not configured.");
    err.code = "google_drive_not_configured";
    throw err;
  }
  if (!user.googleDrive?.refreshToken) {
    const err = new Error("Connect Google Drive before uploading files.");
    err.code = "google_drive_required";
    throw err;
  }
  const accessToken = await refreshGoogleAccessToken(user);
  const boundary = `pmdr-${crypto.randomBytes(12).toString("hex")}`;
  const metadata = {
    name,
    ...(GOOGLE_DRIVE_FOLDER_ID ? { parents: [GOOGLE_DRIVE_FOLDER_ID] } : {})
  };
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);
  const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
      "Content-Length": String(body.length)
    },
    body
  });
  const file = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok) throw new Error(file.error?.message || "Google Drive upload failed.");
  const permissionRes = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ role: "reader", type: "anyone" })
  });
  if (!permissionRes.ok) {
    const data = await permissionRes.json().catch(() => ({}));
    throw new Error(data.error?.message || "Could not share Google Drive file.");
  }
  return file;
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
    groupId: room.groupId,
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
    })),
    sessionVotes: [...room.sessionVotes.values()]
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

function handleSessionVoteMessage(client, message) {
  const room = client.room;
  const vote = ["yes", "no", "forfeited"].includes(message.vote) ? message.vote : "no";
  room.sessionVotes.set(client.user.username, {
    username: client.user.username,
    name: client.participant.name,
    color: client.participant.color,
    vote
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

function replaceActiveClientForUser(nextClient) {
  const username = nextClient.user.username;
  const previousClient = activeClientsByUsername.get(username);
  if (previousClient && previousClient !== nextClient) {
    previousClient.disconnectReason = "continued in another tab";
    sendToClient(previousClient, {
      type: "session-replaced",
      text: "This room session continued in another tab."
    });
    removeClient(previousClient.socket);
    previousClient.socket.end();
  }
  activeClientsByUsername.set(username, nextClient);
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
      if (timer.mode === "focus") room.sessionVotes.clear();
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
  let file = null;
  if (message.file && room.groupId) {
    const subjectId = String(message.file.subjectId || "");
    const fileId = String(message.file.id || "");
    file = findGroupFile(room.groupId, subjectId, fileId);
  }
  if (!text && !file) {
    return false;
  }

  addChat(room, {
    username: client.user.username,
    name: client.participant.name
  }, text, file);
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
  } else if (message.type === "session-vote") {
    changed = handleSessionVoteMessage(client, message);
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
  if (activeClientsByUsername.get(client.user.username) === client) {
    activeClientsByUsername.delete(client.user.username);
  }
  room.clients.delete(client);
  room.participants.delete(client.id);
  addHistory(room, client.participant.name, client.disconnectReason || "left quietly");
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

async function handleGoogleRequest(request, response, url) {
  if (!url.pathname.startsWith("/api/google")) return false;

  if (request.method === "GET" && url.pathname === "/api/google/connect") {
    const user = getUserFromToken(extractToken(request));
    if (!user) { sendJson(response, 401, { error: "Unauthorized" }); return true; }
    if (!googleDriveConfigured()) {
      sendJson(response, 503, { error: "Google Drive is not configured on this server." });
      return true;
    }
    const state = crypto.randomBytes(18).toString("hex");
    googleOAuthStates.set(state, { username: user.username, createdAt: Date.now() });
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/drive.file");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", state);
    sendJson(response, 200, { url: authUrl.toString() });
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/google/callback") {
    const state = String(url.searchParams.get("state") || "");
    const code = String(url.searchParams.get("code") || "");
    const stateData = googleOAuthStates.get(state);
    googleOAuthStates.delete(state);
    if (!stateData || !code) {
      sendText(response, 400, "Google Drive connection failed.");
      return true;
    }
    const user = users.get(stateData.username);
    if (!user) {
      sendText(response, 404, "User not found.");
      return true;
    }
    try {
      const tokenData = await exchangeGoogleCode(code);
      if (!tokenData.refresh_token) {
        sendText(response, 400, "Google did not return a refresh token. Try connecting again.");
        return true;
      }
      user.googleDrive = {
        refreshToken: tokenData.refresh_token,
        scope: tokenData.scope || "",
        connectedAt: Date.now()
      };
      persistUsers();
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      response.end("<!doctype html><title>Google Drive connected</title><p>Google Drive connected. You can close this tab.</p><script>window.opener&&window.opener.postMessage({type:'google-drive-connected'},'*');setTimeout(()=>window.close(),800);</script>");
    } catch (error) {
      sendText(response, 500, error instanceof Error ? error.message : "Google Drive connection failed.");
    }
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

async function handleGroupRequest(request, response, url) {
  if (!url.pathname.startsWith("/api/groups")) return false;

  const user = getUserFromToken(extractToken(request));
  if (!user) {
    sendJson(response, 401, { error: "Unauthorized" });
    return true;
  }

  if (request.method === "GET" && url.pathname === "/api/groups") {
    const userGroups = [...groups.values()].filter((g) => g.members.includes(user.username));
    sendJson(response, 200, { groups: userGroups.map(sanitizeGroup) });
    return true;
  }

  if (request.method === "POST" && url.pathname === "/api/groups") {
    const rawBody = await readRequestBody(request);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const name = String(body.name || "").trim().slice(0, 40);
    if (!name) {
      sendJson(response, 400, { error: "Group name is required." });
      return true;
    }
    const id = `grp-${crypto.randomBytes(6).toString("hex")}`;
    const group = { id, name, createdBy: user.username, createdAt: Date.now(), members: [user.username], materials: [] };
    groups.set(id, group);
    persistGroups();
    sendJson(response, 201, { group: sanitizeGroup(group) });
    return true;
  }

  const joinMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/join$/);
  if (joinMatch && request.method === "POST") {
    const groupId = joinMatch[1];
    const group = groups.get(groupId);
    if (!group) {
      sendJson(response, 404, { error: "Group not found." });
      return true;
    }
    if (!group.members.includes(user.username)) {
      group.members.push(user.username);
      persistGroups();
    }
    sendJson(response, 200, { group: sanitizeGroup(group) });
    return true;
  }

  const getMatch = url.pathname.match(/^\/api\/groups\/([^/]+)$/);
  if (getMatch && request.method === "GET") {
    const groupId = getMatch[1];
    const group = groups.get(groupId);
    if (!group) {
      sendJson(response, 404, { error: "Group not found." });
      return true;
    }
    if (!group.members.includes(user.username)) {
      sendJson(response, 403, { error: "Not a member of this group." });
      return true;
    }
    const activeRooms = [...rooms.values()]
      .filter((r) => r.groupId === groupId)
      .map((r) => ({
        id: r.id,
        participantCount: r.participants.size,
        participants: [...r.participants.values()].map((p) => ({ name: p.name, color: p.color })),
        timer: {
          mode: r.timer.mode,
          status: r.timer.status,
          remainingMs: currentRemaining(r.timer),
          cycle: r.timer.cycle
        }
      }));
    sendJson(response, 200, { group: sanitizeGroup(group), activeRooms });
    return true;
  }

  // ── Materials ─────────────────────────────────────────────────────────────

  const matListMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials$/);
  if (matListMatch) {
    const groupId = matListMatch[1];
    const group = groups.get(groupId);
    if (!group) { sendJson(response, 404, { error: "Group not found." }); return true; }
    if (!group.members.includes(user.username)) { sendJson(response, 403, { error: "Not a member." }); return true; }
    if (request.method === "GET") {
      sendJson(response, 200, { materials: normalizeMaterials(group) });
      return true;
    }
    if (request.method === "POST") {
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const name = String(body.name || "").trim().slice(0, 60);
      if (!name) { sendJson(response, 400, { error: "Subject name is required." }); return true; }
      normalizeMaterials(group);
      const now = Date.now();
      const subject = {
        id: `sub-${crypto.randomBytes(6).toString("hex")}`,
        name,
        createdBy: user.username,
        createdAt: now,
        folders: [{ id: DEFAULT_FILES_FOLDER_ID, name: "Files", createdBy: user.username, createdAt: now, isDefault: true }],
        files: []
      };
      group.materials.push(subject);
      persistGroups();
      sendJson(response, 201, { subject });
      return true;
    }
  }

  const matDeleteMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials\/([^/]+)$/);
  if (matDeleteMatch && (request.method === "DELETE" || request.method === "PATCH")) {
    const [, groupId, subjectId] = matDeleteMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    normalizeMaterials(group);
    const idx = group.materials.findIndex((s) => s.id === subjectId);
    if (idx === -1) { sendJson(response, 404, { error: "Subject not found." }); return true; }
    if (request.method === "PATCH") {
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const name = String(body.name || "").trim().slice(0, 60);
      if (!name) { sendJson(response, 400, { error: "Subject name is required." }); return true; }
      group.materials[idx].name = name;
      group.materials[idx].updatedBy = user.username;
      group.materials[idx].updatedAt = Date.now();
      persistGroups();
      sendJson(response, 200, { subject: group.materials[idx] });
      return true;
    }
    for (const file of group.materials[idx].files || []) deleteGroupFile(groupId, subjectId, file.id);
    group.materials.splice(idx, 1);
    persistGroups();
    sendJson(response, 200, { ok: true });
    return true;
  }

  const folderListMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials\/([^/]+)\/folders$/);
  if (folderListMatch && request.method === "POST") {
    const [, groupId, subjectId] = folderListMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const subject = normalizeMaterials(group).find((s) => s.id === subjectId);
    if (!subject) { sendJson(response, 404, { error: "Subject not found." }); return true; }
    const rawBody = await readRequestBody(request);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const name = String(body.name || "").trim().slice(0, 60);
    if (!name) { sendJson(response, 400, { error: "Folder name is required." }); return true; }
    const folder = { id: `fld-${crypto.randomBytes(6).toString("hex")}`, name, createdBy: user.username, createdAt: Date.now() };
    subject.folders.push(folder);
    persistGroups();
    sendJson(response, 201, { folder });
    return true;
  }

  const folderActionsMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials\/([^/]+)\/folders\/([^/]+)$/);
  if (folderActionsMatch && (request.method === "PATCH" || request.method === "DELETE")) {
    const [, groupId, subjectId, folderId] = folderActionsMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const subject = normalizeMaterials(group).find((s) => s.id === subjectId);
    if (!subject) { sendJson(response, 404, { error: "Subject not found." }); return true; }
    const folderIdx = subject.folders.findIndex((f) => f.id === folderId);
    if (folderIdx === -1) { sendJson(response, 404, { error: "Folder not found." }); return true; }
    if (request.method === "PATCH") {
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const name = String(body.name || "").trim().slice(0, 60);
      if (!name) { sendJson(response, 400, { error: "Folder name is required." }); return true; }
      subject.folders[folderIdx].name = name;
      subject.folders[folderIdx].updatedBy = user.username;
      subject.folders[folderIdx].updatedAt = Date.now();
      persistGroups();
      sendJson(response, 200, { folder: subject.folders[folderIdx] });
      return true;
    }
    if (folderId === DEFAULT_FILES_FOLDER_ID) {
      sendJson(response, 400, { error: "Default folder cannot be removed." });
      return true;
    }
    for (const file of subject.files || []) {
      if (file.folderId === folderId) file.folderId = DEFAULT_FILES_FOLDER_ID;
    }
    subject.folders.splice(folderIdx, 1);
    persistGroups();
    sendJson(response, 200, { ok: true });
    return true;
  }

  const fileDownloadMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials\/([^/]+)\/files\/([^/]+)\/download$/);
  if (fileDownloadMatch && request.method === "GET") {
    const [, groupId, subjectId, fileId] = fileDownloadMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const subject = (group.materials || []).find((s) => s.id === subjectId);
    if (!subject) { sendJson(response, 404, { error: "Subject not found." }); return true; }
    const fileMeta = (subject.files || []).find((f) => f.id === fileId);
    if (!fileMeta) { sendJson(response, 404, { error: "File not found." }); return true; }
    if (fileMeta.webContentLink || fileMeta.webViewLink) {
      redirect(response, fileMeta.webContentLink || fileMeta.webViewLink);
      return true;
    }
    const filePath = path.join(getGroupFileDir(groupId, subjectId), fileId);
    if (!fs.existsSync(filePath)) { sendJson(response, 404, { error: "File data not found." }); return true; }
    const fileData = fs.readFileSync(filePath);
    const safeFileName = fileMeta.name.replace(/[^\w.\- ]/g, "_");
    response.writeHead(200, {
      "Content-Type": fileMeta.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeFileName}"`,
      "Content-Length": fileData.length,
      "Cache-Control": "no-store"
    });
    response.end(fileData);
    return true;
  }

  const fileViewMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials\/([^/]+)\/files\/([^/]+)\/view$/);
  if (fileViewMatch && request.method === "GET") {
    const [, groupId, subjectId, fileId] = fileViewMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const subject = normalizeMaterials(group).find((s) => s.id === subjectId);
    if (!subject) { sendJson(response, 404, { error: "Subject not found." }); return true; }
    const fileMeta = (subject.files || []).find((f) => f.id === fileId);
    if (!fileMeta) { sendJson(response, 404, { error: "File not found." }); return true; }
    if (fileMeta.webViewLink || fileMeta.webContentLink) {
      redirect(response, fileMeta.webViewLink || fileMeta.webContentLink);
      return true;
    }
    const filePath = path.join(getGroupFileDir(groupId, subjectId), fileId);
    if (!fs.existsSync(filePath)) { sendJson(response, 404, { error: "File data not found." }); return true; }
    const fileData = fs.readFileSync(filePath);
    const safeFileName = fileMeta.name.replace(/[^\w.\- ]/g, "_");
    response.writeHead(200, {
      "Content-Type": fileMeta.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${safeFileName}"`,
      "Content-Length": fileData.length,
      "Cache-Control": "no-store"
    });
    response.end(fileData);
    return true;
  }

  const fileActionsMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials\/([^/]+)\/files\/([^/]+)$/);
  if (fileActionsMatch && (request.method === "DELETE" || request.method === "PATCH")) {
    const [, groupId, subjectId, fileId] = fileActionsMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const subject = normalizeMaterials(group).find((s) => s.id === subjectId);
    if (!subject) { sendJson(response, 404, { error: "Subject not found." }); return true; }
    const fileIdx = (subject.files || []).findIndex((f) => f.id === fileId);
    if (fileIdx === -1) { sendJson(response, 404, { error: "File not found." }); return true; }
    if (request.method === "PATCH") {
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const name = body.name == null ? subject.files[fileIdx].name : String(body.name || "").trim().slice(0, 120);
      if (!name) { sendJson(response, 400, { error: "File name is required." }); return true; }
      const hasFolderId = Object.prototype.hasOwnProperty.call(body, "folderId");
      const folderId = hasFolderId
        ? (body.folderId ? String(body.folderId) : DEFAULT_FILES_FOLDER_ID)
        : (subject.files[fileIdx].folderId || DEFAULT_FILES_FOLDER_ID);
      if (folderId && !subject.folders.some((f) => f.id === folderId)) {
        sendJson(response, 400, { error: "Folder not found." });
        return true;
      }
      subject.files[fileIdx].name = name;
      subject.files[fileIdx].folderId = folderId;
      subject.files[fileIdx].updatedBy = user.username;
      subject.files[fileIdx].updatedAt = Date.now();
      persistGroups();
      sendJson(response, 200, { file: subject.files[fileIdx] });
      return true;
    }
    if (!subject.files[fileIdx].driveFileId) {
      deleteGroupFile(groupId, subjectId, fileId);
    }
    subject.files.splice(fileIdx, 1);
    persistGroups();
    sendJson(response, 200, { ok: true });
    return true;
  }

  const fileUploadMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/materials\/([^/]+)\/files$/);
  if (fileUploadMatch && request.method === "POST") {
    const [, groupId, subjectId] = fileUploadMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const subject = normalizeMaterials(group).find((s) => s.id === subjectId);
    if (!subject) { sendJson(response, 404, { error: "Subject not found." }); return true; }
    const rawBody = await readRequestBody(request, 8_000_000);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const fileName = String(body.name || "").trim().slice(0, 120);
    const mimeType = String(body.mimeType || "application/octet-stream").trim().slice(0, 80);
    const folderId = body.folderId ? String(body.folderId) : DEFAULT_FILES_FOLDER_ID;
    const base64Data = String(body.data || "");
    if (!fileName || !base64Data) { sendJson(response, 400, { error: "File name and data are required." }); return true; }
    if (folderId && !subject.folders.some((f) => f.id === folderId)) {
      sendJson(response, 400, { error: "Folder not found." });
      return true;
    }
    const fileBuffer = Buffer.from(base64Data, "base64");
    const fileId = `file-${crypto.randomBytes(6).toString("hex")}`;
    let driveFile;
    try {
      driveFile = await uploadToGoogleDrive(user, { name: fileName, mimeType, buffer: fileBuffer });
    } catch (error) {
      const code = error?.code || "google_drive_upload_failed";
      const status = code === "google_drive_required" ? 428 : code === "google_drive_not_configured" ? 503 : 502;
      sendJson(response, status, { error: error instanceof Error ? error.message : "Google Drive upload failed.", code });
      return true;
    }
    const fileMeta = {
      id: fileId,
      driveFileId: driveFile.id,
      name: driveFile.name || fileName,
      mimeType: driveFile.mimeType || mimeType,
      size: Number(driveFile.size || fileBuffer.length),
      folderId,
      uploadedBy: user.username,
      uploadedAt: Date.now(),
      webViewLink: driveFile.webViewLink || "",
      webContentLink: driveFile.webContentLink || ""
    };
    subject.files = subject.files || [];
    subject.files.push(fileMeta);
    persistGroups();
    sendJson(response, 201, { file: fileMeta });
    return true;
  }

  // ── Threads ───────────────────────────────────────────────────────────────

  const thrListMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/threads$/);
  if (thrListMatch) {
    const groupId = thrListMatch[1];
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    if (request.method === "GET") {
      sendJson(response, 200, { threads: threadsByGroup.get(groupId) || [] });
      return true;
    }
    if (request.method === "POST") {
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const text = String(body.text || "").trim().slice(0, 1000);
      if (!text) { sendJson(response, 400, { error: "Message text is required." }); return true; }
      const thread = {
        id: `thr-${crypto.randomBytes(6).toString("hex")}`,
        groupId,
        author: user.username,
        text,
        mentionedFileIds: Array.isArray(body.mentionedFileIds) ? body.mentionedFileIds.slice(0, 20).map(String) : [],
        createdAt: Date.now(),
        resolved: false,
        replies: []
      };
      if (!threadsByGroup.has(groupId)) threadsByGroup.set(groupId, []);
      threadsByGroup.get(groupId).unshift(thread);
      persistThreads();
      sendJson(response, 201, { thread });
      return true;
    }
  }

  const thrReplyMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/threads\/([^/]+)\/replies$/);
  if (thrReplyMatch && request.method === "POST") {
    const [, groupId, threadId] = thrReplyMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const thread = (threadsByGroup.get(groupId) || []).find((t) => t.id === threadId);
    if (!thread) { sendJson(response, 404, { error: "Thread not found." }); return true; }
    const rawBody = await readRequestBody(request);
    const body = rawBody ? JSON.parse(rawBody) : {};
    const text = String(body.text || "").trim().slice(0, 1000);
    if (!text) { sendJson(response, 400, { error: "Reply text is required." }); return true; }
    const reply = { id: `rep-${crypto.randomBytes(6).toString("hex")}`, author: user.username, text, createdAt: Date.now() };
    thread.replies.push(reply);
    persistThreads();
    sendJson(response, 201, { reply });
    return true;
  }

  const thrActionsMatch = url.pathname.match(/^\/api\/groups\/([^/]+)\/threads\/([^/]+)$/);
  if (thrActionsMatch) {
    const [, groupId, threadId] = thrActionsMatch;
    const group = groups.get(groupId);
    if (!group || !group.members.includes(user.username)) { sendJson(response, 403, { error: "Forbidden." }); return true; }
    const threads = threadsByGroup.get(groupId) || [];
    const thread = threads.find((t) => t.id === threadId);
    if (request.method === "PATCH") {
      if (!thread) { sendJson(response, 404, { error: "Thread not found." }); return true; }
      thread.resolved = !thread.resolved;
      persistThreads();
      sendJson(response, 200, { thread });
      return true;
    }
    if (request.method === "DELETE") {
      const idx = threads.findIndex((t) => t.id === threadId);
      if (idx === -1) { sendJson(response, 404, { error: "Thread not found." }); return true; }
      threads.splice(idx, 1);
      persistThreads();
      sendJson(response, 200, { ok: true });
      return true;
    }
  }

  return false;
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

    if (await handleGoogleRequest(request, response, url)) {
      return;
    }

    if (await handleGroupRequest(request, response, url)) {
      return;
    }

    if (await handleYoutubeSearchRequest(request, response, url)) {
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/tasks") {
      const user = getUserFromToken(extractToken(request));
      if (!user) { sendJson(response, 401, { error: "Unauthorized" }); return; }
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const text = String(body.text || "").trim().slice(0, 120);
      if (!text) { sendJson(response, 400, { error: "Task text required." }); return; }
      const taskStatus = ["yes", "no", "forfeited"].includes(body.status) ? body.status : "no";
      const focusMs = Math.max(0, Number(body.focusMs) || 0);
      ensureTodayData(user);
      user.todayTasks.push({ id: crypto.randomUUID(), text, status: taskStatus, focusMs, at: Date.now() });
      persistUsers();
      sendJson(response, 201, { ok: true });
      return;
    }

    const todayMatch = url.pathname.match(/^\/api\/users\/([^/]+)\/today$/);
    if (todayMatch && request.method === "GET") {
      const requester = getUserFromToken(extractToken(request));
      if (!requester) { sendJson(response, 401, { error: "Unauthorized" }); return; }
      const target = users.get(todayMatch[1]);
      if (!target) { sendJson(response, 404, { error: "User not found." }); return; }
      ensureTodayData(target);
      sendJson(response, 200, {
        username: target.username,
        todayDate: target.todayDate,
        todayTasks: target.todayTasks || [],
        todayFocusMs: target.todayFocusMs || 0
      });
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
      const groupId = String(body.groupId || "");
      if (!groupId || !groups.has(groupId)) {
        sendJson(response, 400, { error: "A valid group is required to create a room." });
        return;
      }
      if (!groups.get(groupId).members.includes(user.username)) {
        sendJson(response, 403, { error: "You are not a member of this group." });
        return;
      }
      const fakeParams = { get: (key) => body[key] != null ? String(body[key]) : null };
      const durations = parseInitialDurations(fakeParams);
      createRoom(roomId, durations, groupId);
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

  if (room.groupId) {
    const group = groups.get(room.groupId);
    if (!group || !group.members.includes(user.username)) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }
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
  replaceActiveClientForUser(client);
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
