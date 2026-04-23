const COLORS = {
  tomato: "oklch(61% 0.19 36)",
  leaf: "oklch(55% 0.13 145)",
  blue: "oklch(49% 0.15 248)",
  plum: "oklch(42% 0.11 330)",
  gold: "oklch(74% 0.15 83)"
};

const DEFAULT_DURATIONS = {
  focus: 25 * 60 * 1000,
  short: 5 * 60 * 1000,
  long: 15 * 60 * 1000
};

const MODE_COPY = {
  focus: { label: "Focus", text: "Focus" },
  short: { label: "Short Break", text: "Short break" },
  long: { label: "Long Break", text: "Long break" }
};

const STORAGE_KEYS = {
  authToken: "pmdr.authToken",
  displayName: "pmdr.displayName",
  color: "pmdr.color"
};

const state = {
  authMode: "login",
  authToken: localStorage.getItem(STORAGE_KEYS.authToken) || "",
  user: null,
  pendingRoomFromUrl: "",
  session: "entry",
  socket: null,
  room: "",
  hostToken: "",
  pendingRoomSetup: null,
  isHost: false,
  name: "",
  color: localStorage.getItem(STORAGE_KEYS.color) || "tomato",
  timer: createTimerState(),
  serverOffset: 0,
  participants: [],
  history: [],
  chat: [],
  music: { current: null, queue: [], maxPerUser: 5 },
  musicResults: [],
  reconnectTimer: null,
  copiedUntil: 0,
  noticeText: "",
  noticeUntil: 0,
  playerKey: ""
};

const elements = {
  entryScreen: document.querySelector("#entryScreen"),
  authPanel: document.querySelector("#authPanel"),
  modePanel: document.querySelector("#modePanel"),
  loginTabButton: document.querySelector("#loginTabButton"),
  signupTabButton: document.querySelector("#signupTabButton"),
  authForm: document.querySelector("#authForm"),
  authUsernameInput: document.querySelector("#authUsernameInput"),
  authPasswordInput: document.querySelector("#authPasswordInput"),
  authSubmitButton: document.querySelector("#authSubmitButton"),
  authMessage: document.querySelector("#authMessage"),
  accountBadge: document.querySelector("#accountBadge"),
  entryLogoutButton: document.querySelector("#entryLogoutButton"),
  soloButton: document.querySelector("#soloButton"),
  multiButton: document.querySelector("#multiButton"),
  multiPanel: document.querySelector("#multiPanel"),
  createRoomButton: document.querySelector("#createRoomButton"),
  createRoomDialog: document.querySelector("#createRoomDialog"),
  closeCreateRoomButton: document.querySelector("#closeCreateRoomButton"),
  createRoomForm: document.querySelector("#createRoomForm"),
  createRoomInput: document.querySelector("#createRoomInput"),
  createNameInput: document.querySelector("#createNameInput"),
  createFocusMinutes: document.querySelector("#createFocusMinutes"),
  createShortMinutes: document.querySelector("#createShortMinutes"),
  createLongMinutes: document.querySelector("#createLongMinutes"),
  timerApp: document.querySelector("#timerApp"),
  connectionStatus: document.querySelector("#connectionStatus"),
  viewerBadge: document.querySelector("#viewerBadge"),
  settingsButton: document.querySelector("#settingsButton"),
  homeButton: document.querySelector("#homeButton"),
  modeLabel: document.querySelector("#modeLabel"),
  timeReadout: document.querySelector("#timeReadout"),
  subline: document.querySelector("#subline"),
  startPauseButton: document.querySelector("#startPauseButton"),
  resetButton: document.querySelector("#resetButton"),
  primaryActions: document.querySelector("#primaryActions"),
  settingsDialog: document.querySelector("#settingsDialog"),
  closeSettingsButton: document.querySelector("#closeSettingsButton"),
  settingsKicker: document.querySelector("#settingsKicker"),
  settingsUsername: document.querySelector("#settingsUsername"),
  settingsLogoutButton: document.querySelector("#settingsLogoutButton"),
  roomInput: document.querySelector("#roomInput"),
  copyLinkButton: document.querySelector("#copyLinkButton"),
  nameInput: document.querySelector("#nameInput"),
  colorRow: document.querySelector("#colorRow"),
  participantList: document.querySelector("#participantList"),
  participantCount: document.querySelector("#participantCount"),
  historyList: document.querySelector("#historyList"),
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  rhythmForm: document.querySelector("#rhythmForm"),
  focusMinutes: document.querySelector("#focusMinutes"),
  shortMinutes: document.querySelector("#shortMinutes"),
  longMinutes: document.querySelector("#longMinutes"),
  multiOnlySections: [...document.querySelectorAll(".multi-only")],
  hostOnlySections: [...document.querySelectorAll(".host-only")],
  hostOnlyButtons: [...document.querySelectorAll(".host-only-button")],
  chatList: document.querySelector("#chatList"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  musicCurrentTitle: document.querySelector("#musicCurrentTitle"),
  musicCurrentMeta: document.querySelector("#musicCurrentMeta"),
  musicSkipButton: document.querySelector("#musicSkipButton"),
  musicSearchForm: document.querySelector("#musicSearchForm"),
  musicSearchInput: document.querySelector("#musicSearchInput"),
  musicMessage: document.querySelector("#musicMessage"),
  musicResults: document.querySelector("#musicResults"),
  musicQueue: document.querySelector("#musicQueue"),
  musicQueueTitle: document.querySelector("#musicQueueTitle"),
  musicQuotaBadge: document.querySelector("#musicQuotaBadge"),
  musicSearchSubmitButton: document.querySelector("#musicSearchForm button[type='submit']"),
  chatSubmitButton: document.querySelector("#chatForm button[type='submit']"),
  youtubePlayerHost: document.querySelector("#youtubePlayerHost"),
  canvas: document.querySelector("#focusCanvas")
};

const context = elements.canvas.getContext("2d");

function createTimerState(initialDurations = DEFAULT_DURATIONS) {
  return {
    mode: "focus",
    status: "idle",
    durations: { ...initialDurations },
    remainingMs: initialDurations.focus,
    startedAt: null,
    cycle: 1,
    focusSessionsDone: 0,
    lastUpdatedBy: "You"
  };
}

function sanitizeRoom(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
}

function normalizeName(value, fallback = "") {
  const cleaned = String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 24);

  return cleaned || fallback || "Maker";
}

function clampMinutes(value, fallback) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) {
    return fallback;
  }

  return Math.min(120, Math.max(1, Math.round(minutes)));
}

function randomId(bytes) {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return [...values].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function hostStorageKey(room) {
  return `pmdr.host.${room}`;
}

function storeHostToken(room, token) {
  localStorage.setItem(hostStorageKey(room), token);
}

function getStoredHostToken(room) {
  return localStorage.getItem(hostStorageKey(room)) || "";
}

function authHeaders() {
  return state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {};
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function setAuthMode(mode) {
  state.authMode = mode;
  elements.loginTabButton.classList.toggle("is-active", mode === "login");
  elements.signupTabButton.classList.toggle("is-active", mode === "signup");
  elements.authSubmitButton.textContent = mode === "login" ? "Login" : "Create account";
  elements.authPasswordInput.autocomplete = mode === "login" ? "current-password" : "new-password";
}

function setAuthMessage(message) {
  elements.authMessage.textContent = message;
}

function setMusicMessage(message) {
  elements.musicMessage.textContent = message;
}

function setNotice(message, duration = 4000) {
  state.noticeText = message;
  state.noticeUntil = message ? Date.now() + duration : 0;
  updateSubline();
}

function updateSubline() {
  if (state.noticeText && Date.now() < state.noticeUntil) {
    elements.subline.textContent = state.noticeText;
    return;
  }

  state.noticeText = "";
  state.noticeUntil = 0;
  if (state.session === "multi") {
    const role = state.isHost ? "Host" : "Guest";
    elements.subline.textContent = `${role} - ${state.timer.lastUpdatedBy || "Room"}`;
  } else {
    elements.subline.textContent = MODE_COPY[state.timer.mode].text;
  }
}

function setConnection(text, className) {
  elements.connectionStatus.textContent = text;
  elements.connectionStatus.className = `connection-pill ${className}`.trim();
}

function renderViewerBadge() {
  if (!state.user) {
    elements.viewerBadge.textContent = "";
    elements.viewerBadge.hidden = true;
    return;
  }

  elements.viewerBadge.hidden = false;
  elements.viewerBadge.textContent = state.user.username;
  elements.accountBadge.textContent = state.user.username;
  elements.settingsUsername.textContent = state.user.username;
}

function renderColorDots() {
  elements.colorRow.innerHTML = "";
  for (const [key, value] of Object.entries(COLORS)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-dot${key === state.color ? " is-active" : ""}`;
    button.style.setProperty("--swatch", value);
    button.setAttribute("aria-label", `${key} color`);
    button.addEventListener("click", () => {
      state.color = key;
      localStorage.setItem(STORAGE_KEYS.color, key);
      renderColorDots();
      if (state.session === "multi") {
        sendHello();
      }
    });
    elements.colorRow.append(button);
  }
}

function showAuthPanel() {
  closeAllDialogs(false);
  disconnect();
  clearMusicPlayer();
  state.session = "entry";
  elements.entryScreen.hidden = false;
  elements.authPanel.hidden = false;
  elements.modePanel.hidden = true;
  elements.timerApp.hidden = true;
  setEntryMode("");
}

function showModePanel() {
  closeAllDialogs(false);
  disconnect();
  clearMusicPlayer();
  state.session = "entry";
  elements.entryScreen.hidden = false;
  elements.authPanel.hidden = true;
  elements.modePanel.hidden = false;
  elements.timerApp.hidden = true;
  setEntryMode("");
  renderViewerBadge();
}

function showTimerApp() {
  elements.entryScreen.hidden = true;
  elements.timerApp.hidden = false;
  requestAnimationFrame(resizeCanvas);
}

function setEntryMode(mode) {
  elements.soloButton.classList.toggle("is-active", mode === "solo");
  elements.multiButton.classList.toggle("is-active", mode === "multi");
  elements.multiPanel.hidden = mode !== "multi";
}

function openDialog(dialog) {
  if (!dialog.open) {
    dialog.showModal();
  }
}

function closeDialog(dialog) {
  if (dialog.open) {
    dialog.close();
  }
}

function closeAllDialogs(restoreFocus = false) {
  closeDialog(elements.createRoomDialog);
  closeDialog(elements.settingsDialog);
  if (restoreFocus && !elements.timerApp.hidden) {
    elements.homeButton.focus();
  }
}

function prepareCreateRoomDialog() {
  const sourceDurations = state.session === "solo" ? state.timer.durations : DEFAULT_DURATIONS;
  elements.createRoomInput.value = `room-${randomId(4)}`;
  elements.createNameInput.value = state.name || state.user?.username || "";
  elements.createFocusMinutes.value = msToMinutes(sourceDurations.focus);
  elements.createShortMinutes.value = msToMinutes(sourceDurations.short);
  elements.createLongMinutes.value = msToMinutes(sourceDurations.long);
}

function currentRemaining(timer, now = Date.now()) {
  if (timer.status !== "running" || !timer.startedAt) {
    return Math.max(0, timer.remainingMs);
  }
  return Math.max(0, timer.remainingMs - (now - timer.startedAt));
}

function setTimerMode(timer, mode, actor = "You") {
  timer.mode = mode;
  timer.status = "idle";
  timer.remainingMs = timer.durations[mode];
  timer.startedAt = null;
  timer.lastUpdatedBy = actor;
}

function transitionTimer(timer, actor = "Timer") {
  if (timer.mode === "focus") {
    timer.focusSessionsDone += 1;
    const isLongBreak = timer.focusSessionsDone % 4 === 0;
    setTimerMode(timer, isLongBreak ? "long" : "short", actor);
  } else {
    timer.cycle += 1;
    setTimerMode(timer, "focus", actor);
  }

  timer.status = "running";
  timer.startedAt = Date.now();
}

function addLocalHistory(by, text) {
  state.history.unshift({ at: Date.now(), by, text });
  state.history = state.history.slice(0, 10);
}

function msToMinutes(milliseconds) {
  return Math.round(milliseconds / 60_000);
}

function formatTime(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getRemaining() {
  if (state.session === "multi") {
    return currentRemaining(state.timer, Date.now() + state.serverOffset);
  }
  return currentRemaining(state.timer, Date.now());
}

function getProgress() {
  const duration = state.timer?.durations?.[state.timer?.mode] || DEFAULT_DURATIONS.focus;
  return Math.min(1, Math.max(0, 1 - getRemaining() / duration));
}

function drawTimer(progress) {
  const canvas = elements.canvas;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.36;

  context.clearRect(0, 0, width, height);
  context.save();
  context.translate(cx, cy);
  context.rotate(-Math.PI / 2);

  context.beginPath();
  context.strokeStyle = "#e7e0d7";
  context.lineWidth = 10;
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.stroke();

  context.beginPath();
  context.strokeStyle = "#c94d38";
  context.lineWidth = 10;
  context.lineCap = "round";
  context.arc(0, 0, radius, 0, Math.PI * 2 * progress);
  context.stroke();

  context.restore();
}

function resizeCanvas() {
  if (elements.timerApp.hidden) {
    return;
  }
  const rect = elements.canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  elements.canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  elements.canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function shareUrl() {
  const url = new URL(window.location.href);
  if (state.room) {
    url.searchParams.set("room", state.room);
  } else {
    url.searchParams.delete("room");
  }
  return url.toString();
}

function updateUrl(room = "") {
  const next = new URL(window.location.href);
  if (room) {
    next.searchParams.set("room", room);
  } else {
    next.searchParams.delete("room");
  }
  window.history.replaceState(null, "", next);
}

function clearMusicPlayer() {
  state.playerKey = "";
  elements.youtubePlayerHost.innerHTML = "";
}

function syncMusicPlayer() {
  if (state.session !== "multi" || !state.music.current) {
    clearMusicPlayer();
    return;
  }

  const current = state.music.current;
  const key = `${current.id}:${current.startedAt}`;
  if (state.playerKey === key) {
    return;
  }

  const startSeconds = Math.max(0, Math.floor((Date.now() + state.serverOffset - current.startedAt) / 1000));
  elements.youtubePlayerHost.innerHTML = `
    <iframe
      width="1"
      height="1"
      src="https://www.youtube.com/embed/${encodeURIComponent(current.videoId)}?autoplay=1&controls=0&start=${startSeconds}&playsinline=1&modestbranding=1&rel=0"
      title="Background music"
      frameborder="0"
      allow="autoplay; encrypted-media"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  `;
  state.playerKey = key;
}

function canControlTimer() {
  return state.session === "solo" || (state.session === "multi" && state.isHost);
}

function isAuthenticated() {
  return Boolean(state.user && state.authToken);
}

function countReservedTracksForViewer() {
  if (!state.user) {
    return 0;
  }

  const currentCount = state.music.current?.requestedBy?.username === state.user.username ? 1 : 0;
  const queueCount = state.music.queue.filter((track) => track.requestedBy.username === state.user.username).length;
  return currentCount + queueCount;
}

function updateControls() {
  const canControl = canControlTimer();
  const isMulti = state.session === "multi";
  const canUseRoomPanels = isMulti && Boolean(state.user);

  elements.settingsButton.hidden = !canControl;
  elements.primaryActions.hidden = !canControl;
  elements.musicSkipButton.hidden = !(isMulti && state.isHost && state.music.current);

  for (const section of elements.multiOnlySections) {
    section.hidden = !isMulti;
  }
  for (const section of elements.hostOnlySections) {
    section.hidden = !canControl;
  }
  for (const button of elements.hostOnlyButtons) {
    button.hidden = !(isMulti && state.isHost);
  }

  elements.startPauseButton.disabled = !canControl;
  elements.resetButton.disabled = !canControl;
  for (const button of elements.modeButtons) {
    button.disabled = !canControl;
  }
  elements.focusMinutes.disabled = !canControl;
  elements.shortMinutes.disabled = !canControl;
  elements.longMinutes.disabled = !canControl;
  elements.chatInput.disabled = !canUseRoomPanels;
  elements.chatSubmitButton.disabled = !canUseRoomPanels;
  elements.musicSearchInput.disabled = !canUseRoomPanels;
  elements.musicSearchSubmitButton.disabled = !canUseRoomPanels;
  elements.chatInput.placeholder = isMulti ? "Type a message" : "Join a room to chat";
  elements.musicSearchInput.placeholder = isMulti ? "Search YouTube music" : "Join a room to add music";

  elements.settingsKicker.textContent = state.session === "solo" ? "Solo" : state.isHost ? "Host" : "Viewer";
  renderViewerBadge();
}

function applyTimerToUI() {
  elements.modeLabel.textContent = MODE_COPY[state.timer.mode].label;
  elements.timeReadout.textContent = formatTime(getRemaining());
  elements.startPauseButton.textContent = state.timer.status === "running" ? "Pause" : "Start";
  elements.startPauseButton.className = `action-button ${state.timer.status === "running" ? "pause" : "start"}`;

  for (const button of elements.modeButtons) {
    button.classList.toggle("is-active", button.dataset.mode === state.timer.mode);
  }

  elements.focusMinutes.value = msToMinutes(state.timer.durations.focus);
  elements.shortMinutes.value = msToMinutes(state.timer.durations.short);
  elements.longMinutes.value = msToMinutes(state.timer.durations.long);
  updateSubline();
}

function renderParticipants() {
  if (state.session !== "multi") {
    elements.participantCount.textContent = "1";
    elements.participantList.innerHTML = `<div class="history-item"><strong>${state.name}</strong><span>Only you</span></div>`;
    return;
  }

  elements.participantCount.textContent = String(state.participants.length);
  elements.participantList.innerHTML = "";

  for (const participant of state.participants) {
    const card = document.createElement("article");
    card.className = "participant-card";
    card.innerHTML = `
      <span class="participant-avatar" style="--avatar: ${COLORS[participant.color] || COLORS.tomato}"></span>
      <p class="participant-name"></p>
      <span class="participant-status"></span>
    `;
    card.querySelector(".participant-name").textContent = participant.name;
    card.querySelector(".participant-status").textContent = participant.isHost ? "Host" : "Guest";
    elements.participantList.append(card);
  }
}

function renderHistory() {
  elements.historyList.innerHTML = "";
  if (!state.history.length) {
    elements.historyList.innerHTML = `<div class="history-item"><strong>Ready.</strong><span>No activity yet.</span></div>`;
    return;
  }

  for (const entry of state.history) {
    const item = document.createElement("div");
    item.className = "history-item";
    const time = new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    item.innerHTML = `<strong></strong><span></span>`;
    item.querySelector("strong").textContent = `${entry.by}: ${entry.text}`;
    item.querySelector("span").textContent = time;
    elements.historyList.append(item);
  }
}

function renderChat() {
  elements.chatList.innerHTML = "";
  if (state.session !== "multi" && !state.chat.length) {
    elements.chatList.innerHTML = `<div class="history-item"><strong>Multi room chat</strong><span>Join a room to talk with others.</span></div>`;
    return;
  }

  for (const message of state.chat) {
    const item = document.createElement("article");
    item.className = "chat-item";
    const time = new Date(message.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    item.innerHTML = `<div class="chat-author"></div><div></div><div class="chat-meta"></div>`;
    item.querySelector(".chat-author").textContent = message.author.name;
    item.querySelector("div:nth-child(2)").textContent = message.text;
    item.querySelector(".chat-meta").textContent = time;
    elements.chatList.append(item);
  }
}

function renderMusic() {
  const current = state.music.current;
  elements.musicCurrentTitle.textContent = current ? current.title : state.session === "multi" ? "Nothing playing" : "Room music";
  elements.musicCurrentMeta.textContent = current
    ? `${current.requestedBy.name} - ${current.channelTitle}`
    : state.session === "multi"
      ? "Queue is empty."
      : "Create or join a room to queue tracks together.";
  elements.musicQueueTitle.textContent = `${(current ? 1 : 0) + state.music.queue.length} tracks`;
  elements.musicQuotaBadge.textContent = state.session === "multi"
    ? `${countReservedTracksForViewer()} / ${state.music.maxPerUser || 5}`
    : "- / 5";
  elements.musicSkipButton.hidden = !(state.session === "multi" && state.isHost && current);
  if (state.session !== "multi" && !elements.musicMessage.textContent) {
    setMusicMessage("Music queue opens in multi rooms.");
  }

  elements.musicResults.innerHTML = "";
  for (const result of state.musicResults) {
    const item = document.createElement("article");
    item.className = "music-result";
    item.innerHTML = `
      <img class="music-thumb" alt="" />
      <div>
        <div class="music-title"></div>
        <div class="music-meta"></div>
      </div>
      <div class="music-result-actions"><button class="icon-button" type="button">Add</button></div>
    `;
    item.querySelector(".music-thumb").src = result.thumbnail;
    item.querySelector(".music-title").textContent = result.title;
    item.querySelector(".music-meta").textContent = `${result.channelTitle} - ${result.durationText}`;
    item.querySelector("button").addEventListener("click", () => {
      send({
        type: "music",
        action: "add",
        track: result
      });
    });
    elements.musicResults.append(item);
  }

  elements.musicQueue.innerHTML = "";
  const queueItems = [];
  if (current) {
    queueItems.push({ ...current, isCurrent: true });
  }
  queueItems.push(...state.music.queue);

  for (const track of queueItems) {
    const item = document.createElement("article");
    item.className = "queue-item";
    const canRemove = state.isHost || track.requestedBy.username === state.user?.username;
    item.innerHTML = `
      <img class="music-thumb" alt="" />
      <div>
        <div class="queue-title"></div>
        <div class="queue-meta"></div>
      </div>
      <div class="queue-item-actions"></div>
    `;
    item.querySelector(".music-thumb").src = track.thumbnail;
    item.querySelector(".queue-title").textContent = `${track.isCurrent ? "Now" : "Queued"} - ${track.title}`;
    item.querySelector(".queue-meta").textContent = `${track.requestedBy.name} - ${track.channelTitle}`;

    if (track.isCurrent) {
      const badge = document.createElement("span");
      badge.className = "participant-status";
      badge.textContent = "Playing";
      item.querySelector(".queue-item-actions").append(badge);
    } else if (canRemove) {
      const button = document.createElement("button");
      button.className = "icon-button";
      button.type = "button";
      button.textContent = "Remove";
      button.addEventListener("click", () => {
        send({ type: "music", action: "remove", trackId: track.id });
      });
      item.querySelector(".queue-item-actions").append(button);
    }

    elements.musicQueue.append(item);
  }
}

function applySnapshot(payload) {
  state.serverOffset = payload.serverNow - Date.now();
  state.timer = payload.timer;
  state.participants = payload.participants || [];
  state.history = payload.history || [];
  state.chat = payload.chat || [];
  state.music = payload.music || { current: null, queue: [], maxPerUser: 5 };
  state.room = payload.room;
  state.isHost = Boolean(payload.isHost);
  state.pendingRoomSetup = state.isHost ? null : state.pendingRoomSetup;
  elements.roomInput.value = payload.room;

  setConnection(state.isHost ? "Host" : "Guest", state.isHost ? "is-online" : "");
  updateControls();
  applyTimerToUI();
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
  syncMusicPlayer();
}

function send(message) {
  if (state.socket?.readyState === WebSocket.OPEN) {
    state.socket.send(JSON.stringify(message));
  }
}

function sendHello() {
  if (state.session !== "multi") {
    return;
  }
  send({
    type: "hello",
    name: state.name,
    color: state.color
  });
}

function handleSoloCommand(action, extra = {}) {
  const timer = state.timer;
  const actor = state.name || "You";
  const now = Date.now();

  switch (action) {
    case "start":
      timer.remainingMs = currentRemaining(timer, now) || timer.durations[timer.mode];
      timer.status = "running";
      timer.startedAt = now;
      timer.lastUpdatedBy = actor;
      addLocalHistory(actor, "started the timer");
      break;
    case "pause":
      timer.remainingMs = currentRemaining(timer, now);
      timer.status = "paused";
      timer.startedAt = null;
      timer.lastUpdatedBy = actor;
      addLocalHistory(actor, "paused the timer");
      break;
    case "reset":
      timer.status = "idle";
      timer.remainingMs = timer.durations[timer.mode];
      timer.startedAt = null;
      timer.lastUpdatedBy = actor;
      addLocalHistory(actor, `reset ${timer.mode}`);
      break;
    case "mode": {
      const nextMode = ["focus", "short", "long"].includes(extra.mode) ? extra.mode : "focus";
      setTimerMode(timer, nextMode, actor);
      addLocalHistory(actor, `switched to ${nextMode}`);
      break;
    }
    case "durations": {
      const durations = extra.durations || {};
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
      addLocalHistory(actor, "tuned the rhythm");
      break;
    }
    default:
      return;
  }

  applyTimerToUI();
  renderHistory();
}

function sendTimerCommand(action, extra = {}) {
  if (!canControlTimer()) {
    return;
  }

  if (state.session === "solo") {
    handleSoloCommand(action, extra);
    return;
  }

  send({
    type: "command",
    action,
    name: state.name,
    ...extra
  });
}

function disconnect() {
  clearTimeout(state.reconnectTimer);
  state.reconnectTimer = null;
  if (state.socket) {
    const socket = state.socket;
    state.socket = null;
    socket.close();
  }
}

function connect() {
  disconnect();
  if (state.session !== "multi" || !state.authToken) {
    return;
  }

  setConnection(state.isHost ? "Host" : "Joining", state.isHost ? "is-online" : "");
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const params = new URLSearchParams({
    room: state.room,
    name: state.name,
    color: state.color,
    token: state.authToken
  });

  if (state.hostToken) {
    params.set("host", state.hostToken);
  }
  if (state.isHost && state.pendingRoomSetup?.durations) {
    params.set("focus", msToMinutes(state.pendingRoomSetup.durations.focus));
    params.set("short", msToMinutes(state.pendingRoomSetup.durations.short));
    params.set("long", msToMinutes(state.pendingRoomSetup.durations.long));
  }

  const socket = new WebSocket(`${protocol}://${window.location.host}/socket?${params}`);
  state.socket = socket;

  socket.addEventListener("open", () => {
    if (state.socket !== socket) {
      return;
    }
    sendHello();
  });

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.type === "snapshot") {
      applySnapshot(payload);
    } else if (payload.type === "notice") {
      setNotice(payload.text);
      setMusicMessage(payload.text);
    }
  });

  socket.addEventListener("close", () => {
    if (state.socket !== socket || state.session !== "multi") {
      return;
    }
    state.socket = null;
    setConnection("Reconnecting", "is-offline");
    state.reconnectTimer = setTimeout(connect, 1200);
  });
}

function startSolo() {
  disconnect();
  clearMusicPlayer();
  state.session = "solo";
  state.room = "";
  state.hostToken = "";
  state.pendingRoomSetup = null;
  state.isHost = true;
  state.serverOffset = 0;
  state.timer = createTimerState();
  state.participants = [];
  state.history = [];
  state.chat = [];
  state.music = { current: null, queue: [], maxPerUser: 5 };
  state.musicResults = [];
  setMusicMessage("");
  updateUrl();
  showTimerApp();
  setConnection("Solo", "");
  updateControls();
  applyTimerToUI();
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
}

function startMulti(room, hostToken = "", setup = null) {
  const nextRoom = sanitizeRoom(room);
  if (!nextRoom || !isAuthenticated()) {
    return;
  }

  state.session = "multi";
  state.room = nextRoom;
  state.hostToken = hostToken || getStoredHostToken(nextRoom);
  state.pendingRoomSetup = setup;
  state.isHost = Boolean(state.hostToken);
  state.timer = createTimerState(setup?.durations || DEFAULT_DURATIONS);
  state.participants = [];
  state.history = [];
  state.chat = [];
  state.music = { current: null, queue: [], maxPerUser: 5 };
  state.musicResults = [];
  setMusicMessage("");
  elements.roomInput.value = nextRoom;
  updateUrl(nextRoom);
  showTimerApp();
  updateControls();
  applyTimerToUI();
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
  connect();
}

function goHome() {
  closeAllDialogs(false);
  disconnect();
  clearMusicPlayer();
  state.room = "";
  state.hostToken = "";
  state.pendingRoomSetup = null;
  state.isHost = false;
  state.serverOffset = 0;
  state.timer = createTimerState();
  state.participants = [];
  state.history = [];
  state.chat = [];
  state.music = { current: null, queue: [], maxPerUser: 5 };
  state.musicResults = [];
  setMusicMessage("");
  updateUrl();
  showModePanel();
}

async function logout() {
  try {
    if (state.authToken) {
      await apiRequest("/api/auth/logout", { method: "POST" });
    }
  } catch {
    // Ignore logout network errors.
  }

  localStorage.removeItem(STORAGE_KEYS.authToken);
  state.authToken = "";
  state.user = null;
  state.pendingRoomFromUrl = "";
  goHome();
  showAuthPanel();
}

async function restoreSession() {
  const roomFromUrl = sanitizeRoom(new URLSearchParams(window.location.search).get("room"));
  state.pendingRoomFromUrl = roomFromUrl;

  if (!state.authToken) {
    showAuthPanel();
    return;
  }

  try {
    const data = await apiRequest("/api/auth/me", { method: "GET", headers: {} });
    state.user = data.user;
    state.name = normalizeName(localStorage.getItem(STORAGE_KEYS.displayName) || state.user.username, state.user.username);
    elements.nameInput.value = state.name;
    renderViewerBadge();

    if (state.pendingRoomFromUrl) {
      startMulti(state.pendingRoomFromUrl, getStoredHostToken(state.pendingRoomFromUrl));
    } else {
      showModePanel();
    }
  } catch {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    state.authToken = "";
    state.user = null;
    showAuthPanel();
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const username = elements.authUsernameInput.value.trim();
  const password = elements.authPasswordInput.value;
  setAuthMessage(state.authMode === "login" ? "Signing in..." : "Creating account...");

  try {
    const data = await apiRequest(`/api/auth/${state.authMode === "login" ? "login" : "signup"}`, {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    state.authToken = data.token;
    state.user = data.user;
    localStorage.setItem(STORAGE_KEYS.authToken, data.token);
    state.name = normalizeName(localStorage.getItem(STORAGE_KEYS.displayName) || data.user.username, data.user.username);
    elements.nameInput.value = state.name;
    elements.createNameInput.value = state.name;
    elements.authPasswordInput.value = "";
    setAuthMessage("");
    renderViewerBadge();

    if (state.pendingRoomFromUrl) {
      startMulti(state.pendingRoomFromUrl, getStoredHostToken(state.pendingRoomFromUrl));
    } else {
      showModePanel();
    }
  } catch (error) {
    setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
  }
}

async function handleMusicSearch(event) {
  event?.preventDefault();
  event?.stopPropagation();
  if (state.session !== "multi") {
    setMusicMessage("Music search is available in multi rooms.");
    return;
  }

  const query = elements.musicSearchInput.value.trim();
  if (!query) {
    setMusicMessage("Enter a search query.");
    return;
  }

  setMusicMessage("Searching YouTube...");
  try {
    const data = await apiRequest(`/api/youtube-search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {}
    });
    state.musicResults = data.results || [];
    renderMusic();
    setMusicMessage(state.musicResults.length ? "" : "No tracks found.");
  } catch (error) {
    setMusicMessage(error instanceof Error ? error.message : "Search failed.");
  }
}

function bindDialogBackdrop(dialog, closeFn) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeFn();
    }
  });
}

function bindEvents() {
  setAuthMode("login");

  elements.loginTabButton.addEventListener("click", () => setAuthMode("login"));
  elements.signupTabButton.addEventListener("click", () => setAuthMode("signup"));
  elements.authForm.addEventListener("submit", handleAuthSubmit);
  elements.entryLogoutButton.addEventListener("click", logout);

  elements.soloButton.addEventListener("click", () => {
    setEntryMode("solo");
    startSolo();
  });

  elements.multiButton.addEventListener("click", () => {
    setEntryMode("multi");
  });

  elements.createRoomButton.addEventListener("click", () => {
    prepareCreateRoomDialog();
    openDialog(elements.createRoomDialog);
  });

  elements.createRoomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const room = sanitizeRoom(elements.createRoomInput.value) || `room-${randomId(4)}`;
    const token = randomId(18);
    const durations = {
      focus: clampMinutes(elements.createFocusMinutes.value, 25) * 60_000,
      short: clampMinutes(elements.createShortMinutes.value, 5) * 60_000,
      long: clampMinutes(elements.createLongMinutes.value, 15) * 60_000
    };

    state.name = normalizeName(elements.createNameInput.value || state.user?.username, state.user?.username || "Maker");
    elements.nameInput.value = state.name;
    localStorage.setItem(STORAGE_KEYS.displayName, state.name);
    storeHostToken(room, token);
    closeDialog(elements.createRoomDialog);
    startMulti(room, token, { durations });
  });

  elements.closeCreateRoomButton.addEventListener("click", () => closeDialog(elements.createRoomDialog));
  bindDialogBackdrop(elements.createRoomDialog, () => closeDialog(elements.createRoomDialog));

  elements.settingsButton.addEventListener("click", () => {
    if (canControlTimer()) {
      openDialog(elements.settingsDialog);
    }
  });
  elements.closeSettingsButton.addEventListener("click", () => closeDialog(elements.settingsDialog));
  elements.settingsLogoutButton.addEventListener("click", logout);
  bindDialogBackdrop(elements.settingsDialog, () => closeDialog(elements.settingsDialog));

  elements.homeButton.addEventListener("click", goHome);

  elements.startPauseButton.addEventListener("click", () => {
    sendTimerCommand(state.timer.status === "running" ? "pause" : "start");
  });
  elements.resetButton.addEventListener("click", () => sendTimerCommand("reset"));
  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => sendTimerCommand("mode", { mode: button.dataset.mode }));
  });

  elements.rhythmForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(elements.rhythmForm);
    sendTimerCommand("durations", {
      durations: {
        focus: form.get("focus"),
        short: form.get("short"),
        long: form.get("long")
      }
    });
  });

  elements.nameInput.addEventListener("change", () => {
    state.name = normalizeName(elements.nameInput.value || state.user?.username, state.user?.username || "Maker");
    elements.nameInput.value = state.name;
    localStorage.setItem(STORAGE_KEYS.displayName, state.name);
    if (state.session === "multi") {
      sendHello();
    }
  });

  elements.copyLinkButton.addEventListener("click", async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      state.copiedUntil = Date.now() + 1800;
      elements.copyLinkButton.textContent = "Copied";
    } catch {
      window.prompt("Room link", url);
    }
  });

  elements.chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = elements.chatInput.value.trim();
    if (!text || state.session !== "multi") {
      return;
    }
    send({ type: "chat", text });
    elements.chatInput.value = "";
  });

  elements.musicSearchForm.addEventListener("submit", handleMusicSearch);
  elements.musicSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleMusicSearch(event);
    }
  });
  elements.musicSkipButton.addEventListener("click", () => {
    send({ type: "music", action: "skip" });
  });

  window.addEventListener("resize", resizeCanvas);
}

function tick() {
  if (!elements.timerApp.hidden) {
    const remaining = getRemaining();
    elements.timeReadout.textContent = formatTime(remaining);

    if (state.session === "solo" && state.timer.status === "running" && remaining <= 0) {
      transitionTimer(state.timer, "Timer");
      addLocalHistory("Timer", `${state.timer.mode} started`);
      applyTimerToUI();
      renderHistory();
    }

    if (Date.now() > state.copiedUntil && elements.copyLinkButton.textContent !== "Link") {
      elements.copyLinkButton.textContent = "Link";
    }

    if (state.noticeText && Date.now() > state.noticeUntil) {
      updateSubline();
    }

    drawTimer(getProgress());
  }

  requestAnimationFrame(tick);
}

function init() {
  state.name = normalizeName(localStorage.getItem(STORAGE_KEYS.displayName) || "", "Maker");
  elements.nameInput.value = state.name;
  elements.createNameInput.value = state.name;
  renderColorDots();
  bindEvents();
  restoreSession();
  requestAnimationFrame(tick);
}

init();
