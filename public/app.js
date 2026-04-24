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
  color: "pmdr.color",
  theme: "pmdr.theme",
  muted: "pmdr.muted",
  soloTasks: "pmdr.soloTasks"
};

const THEMES = {
  midnight: {
    label: "Midnight",
    colorScheme: "dark",
    swatchBg: "oklch(10% 0.008 55)",
    swatchAccent: "oklch(72% 0.130 76)",
    swatchInk: "oklch(72% 0.130 76)",
    vars: {
      "--bg":             "oklch(10%  0.008 55)",
      "--surface":        "oklch(14%  0.012 58)",
      "--surface-mid":    "oklch(18%  0.016 60)",
      "--surface-strong": "oklch(23%  0.020 62)",
      "--ink":            "oklch(93%  0.008 72)",
      "--muted":          "oklch(62%  0.018 68)",
      "--subtle":         "oklch(55%  0.015 64)",
      "--line":           "oklch(22%  0.016 62)",
      "--accent":         "oklch(72%  0.130 76)",
      "--accent-dim":     "oklch(58%  0.100 76)",
      "--accent-soft":    "oklch(18%  0.050 76)",
      "--accent-ink":     "oklch(10%  0.010 55)",
      "--ok":             "oklch(62%  0.110 148)",
      "--focus-ring":     "oklch(72%  0.130 76 / 0.28)",
      "--ring-track":     "oklch(22%  0.016 62)",
      "--ring-progress":  "oklch(72%  0.130 76)"
    }
  },
  forest: {
    label: "Forest",
    colorScheme: "dark",
    swatchBg: "oklch(9% 0.015 155)",
    swatchAccent: "oklch(65% 0.14 148)",
    swatchInk: "oklch(65% 0.14 148)",
    vars: {
      "--bg":             "oklch(9%   0.015 155)",
      "--surface":        "oklch(13%  0.018 155)",
      "--surface-mid":    "oklch(17%  0.020 152)",
      "--surface-strong": "oklch(22%  0.022 150)",
      "--ink":            "oklch(92%  0.010 120)",
      "--muted":          "oklch(62%  0.020 145)",
      "--subtle":         "oklch(55%  0.018 148)",
      "--line":           "oklch(21%  0.020 150)",
      "--accent":         "oklch(65%  0.140 148)",
      "--accent-dim":     "oklch(52%  0.110 148)",
      "--accent-soft":    "oklch(17%  0.055 148)",
      "--accent-ink":     "oklch(9%   0.012 155)",
      "--ok":             "oklch(65%  0.140 148)",
      "--focus-ring":     "oklch(65%  0.140 148 / 0.28)",
      "--ring-track":     "oklch(21%  0.020 150)",
      "--ring-progress":  "oklch(65%  0.140 148)"
    }
  },
  ocean: {
    label: "Ocean",
    colorScheme: "dark",
    swatchBg: "oklch(9% 0.015 240)",
    swatchAccent: "oklch(65% 0.13 228)",
    swatchInk: "oklch(65% 0.13 228)",
    vars: {
      "--bg":             "oklch(9%   0.015 240)",
      "--surface":        "oklch(13%  0.018 238)",
      "--surface-mid":    "oklch(17%  0.020 235)",
      "--surface-strong": "oklch(22%  0.022 232)",
      "--ink":            "oklch(92%  0.008 215)",
      "--muted":          "oklch(62%  0.020 230)",
      "--subtle":         "oklch(55%  0.018 232)",
      "--line":           "oklch(21%  0.020 234)",
      "--accent":         "oklch(65%  0.130 228)",
      "--accent-dim":     "oklch(52%  0.100 228)",
      "--accent-soft":    "oklch(17%  0.055 228)",
      "--accent-ink":     "oklch(9%   0.012 240)",
      "--ok":             "oklch(62%  0.110 148)",
      "--focus-ring":     "oklch(65%  0.130 228 / 0.28)",
      "--ring-track":     "oklch(21%  0.020 234)",
      "--ring-progress":  "oklch(65%  0.130 228)"
    }
  },
  rose: {
    label: "Rose",
    colorScheme: "dark",
    swatchBg: "oklch(9% 0.012 0)",
    swatchAccent: "oklch(67% 0.115 10)",
    swatchInk: "oklch(67% 0.115 10)",
    vars: {
      "--bg":             "oklch(9%   0.012 0)",
      "--surface":        "oklch(13%  0.016 5)",
      "--surface-mid":    "oklch(17%  0.018 5)",
      "--surface-strong": "oklch(22%  0.020 8)",
      "--ink":            "oklch(93%  0.008 20)",
      "--muted":          "oklch(62%  0.018 10)",
      "--subtle":         "oklch(55%  0.015 8)",
      "--line":           "oklch(21%  0.018 6)",
      "--accent":         "oklch(67%  0.115 10)",
      "--accent-dim":     "oklch(54%  0.090 10)",
      "--accent-soft":    "oklch(17%  0.048 8)",
      "--accent-ink":     "oklch(9%   0.010 0)",
      "--ok":             "oklch(62%  0.110 148)",
      "--focus-ring":     "oklch(67%  0.115 10 / 0.28)",
      "--ring-track":     "oklch(21%  0.018 6)",
      "--ring-progress":  "oklch(67%  0.115 10)"
    }
  },
  parchment: {
    label: "Parchment",
    colorScheme: "light",
    swatchBg: "oklch(97% 0.006 80)",
    swatchAccent: "oklch(52% 0.16 36)",
    swatchInk: "oklch(30% 0.02 55)",
    vars: {
      "--bg":             "oklch(97%  0.006 80)",
      "--surface":        "oklch(94%  0.008 78)",
      "--surface-mid":    "oklch(90%  0.010 76)",
      "--surface-strong": "oklch(85%  0.012 74)",
      "--ink":            "oklch(22%  0.018 56)",
      "--muted":          "oklch(40%  0.015 60)",
      "--subtle":         "oklch(50%  0.010 68)",
      "--line":           "oklch(84%  0.010 72)",
      "--accent":         "oklch(52%  0.160 36)",
      "--accent-dim":     "oklch(44%  0.130 36)",
      "--accent-soft":    "oklch(92%  0.040 60)",
      "--accent-ink":     "oklch(97%  0.006 80)",
      "--ok":             "oklch(44%  0.120 148)",
      "--focus-ring":     "oklch(52%  0.160 36 / 0.22)",
      "--ring-track":     "oklch(84%  0.010 72)",
      "--ring-progress":  "oklch(52%  0.160 36)"
    }
  },
  slate: {
    label: "Slate",
    colorScheme: "dark",
    swatchBg: "oklch(9% 0.006 240)",
    swatchAccent: "oklch(64% 0.09 255)",
    swatchInk: "oklch(64% 0.09 255)",
    vars: {
      "--bg":             "oklch(9%   0.006 240)",
      "--surface":        "oklch(13%  0.008 238)",
      "--surface-mid":    "oklch(17%  0.010 235)",
      "--surface-strong": "oklch(22%  0.012 232)",
      "--ink":            "oklch(90%  0.006 230)",
      "--muted":          "oklch(62%  0.012 232)",
      "--subtle":         "oklch(55%  0.010 234)",
      "--line":           "oklch(21%  0.012 236)",
      "--accent":         "oklch(64%  0.090 255)",
      "--accent-dim":     "oklch(52%  0.070 255)",
      "--accent-soft":    "oklch(17%  0.040 255)",
      "--accent-ink":     "oklch(9%   0.006 240)",
      "--ok":             "oklch(62%  0.110 148)",
      "--focus-ring":     "oklch(64%  0.090 255 / 0.28)",
      "--ring-track":     "oklch(21%  0.012 236)",
      "--ring-progress":  "oklch(64%  0.090 255)"
    }
  },
  cream: {
    label: "Cream",
    colorScheme: "light",
    swatchBg: "oklch(98% 0.004 55)",
    swatchAccent: "oklch(54% 0.145 18)",
    swatchInk: "oklch(22% 0.015 40)",
    vars: {
      "--bg":             "oklch(98%  0.004 55)",
      "--surface":        "oklch(95%  0.006 54)",
      "--surface-mid":    "oklch(91%  0.008 52)",
      "--surface-strong": "oklch(86%  0.010 50)",
      "--ink":            "oklch(22%  0.015 40)",
      "--muted":          "oklch(40%  0.012 44)",
      "--subtle":         "oklch(50%  0.008 50)",
      "--line":           "oklch(86%  0.008 52)",
      "--accent":         "oklch(54%  0.145 18)",
      "--accent-dim":     "oklch(44%  0.115 18)",
      "--accent-soft":    "oklch(93%  0.040 22)",
      "--accent-ink":     "oklch(98%  0.004 55)",
      "--ok":             "oklch(44%  0.120 148)",
      "--focus-ring":     "oklch(54%  0.145 18 / 0.22)",
      "--ring-track":     "oklch(86%  0.008 52)",
      "--ring-progress":  "oklch(54%  0.145 18)"
    }
  },
  sage: {
    label: "Sage",
    colorScheme: "light",
    swatchBg: "oklch(96% 0.010 150)",
    swatchAccent: "oklch(40% 0.110 158)",
    swatchInk: "oklch(22% 0.020 155)",
    vars: {
      "--bg":             "oklch(96%  0.010 150)",
      "--surface":        "oklch(93%  0.012 148)",
      "--surface-mid":    "oklch(88%  0.014 146)",
      "--surface-strong": "oklch(83%  0.016 144)",
      "--ink":            "oklch(22%  0.020 155)",
      "--muted":          "oklch(48%  0.016 148)",
      "--subtle":         "oklch(68%  0.010 145)",
      "--line":           "oklch(83%  0.012 146)",
      "--accent":         "oklch(40%  0.110 158)",
      "--accent-dim":     "oklch(33%  0.090 158)",
      "--accent-soft":    "oklch(91%  0.040 152)",
      "--accent-ink":     "oklch(96%  0.010 150)",
      "--ok":             "oklch(40%  0.110 158)",
      "--focus-ring":     "oklch(40%  0.110 158 / 0.22)",
      "--ring-track":     "oklch(83%  0.012 146)",
      "--ring-progress":  "oklch(40%  0.110 158)"
    }
  },
  sky: {
    label: "Sky",
    colorScheme: "light",
    swatchBg: "oklch(97% 0.008 225)",
    swatchAccent: "oklch(44% 0.120 248)",
    swatchInk: "oklch(22% 0.020 240)",
    vars: {
      "--bg":             "oklch(97%  0.008 225)",
      "--surface":        "oklch(93%  0.010 224)",
      "--surface-mid":    "oklch(89%  0.012 222)",
      "--surface-strong": "oklch(84%  0.014 220)",
      "--ink":            "oklch(22%  0.020 240)",
      "--muted":          "oklch(48%  0.016 232)",
      "--subtle":         "oklch(68%  0.010 226)",
      "--line":           "oklch(84%  0.010 222)",
      "--accent":         "oklch(44%  0.120 248)",
      "--accent-dim":     "oklch(36%  0.095 248)",
      "--accent-soft":    "oklch(92%  0.040 228)",
      "--accent-ink":     "oklch(97%  0.008 225)",
      "--ok":             "oklch(44%  0.120 148)",
      "--focus-ring":     "oklch(44%  0.120 248 / 0.22)",
      "--ring-track":     "oklch(84%  0.010 222)",
      "--ring-progress":  "oklch(44%  0.120 248)"
    }
  },
  sand: {
    label: "Sand",
    colorScheme: "light",
    swatchBg: "oklch(96% 0.012 82)",
    swatchAccent: "oklch(50% 0.135 56)",
    swatchInk: "oklch(22% 0.018 58)",
    vars: {
      "--bg":             "oklch(96%  0.012 82)",
      "--surface":        "oklch(93%  0.014 80)",
      "--surface-mid":    "oklch(88%  0.016 78)",
      "--surface-strong": "oklch(83%  0.018 76)",
      "--ink":            "oklch(22%  0.018 58)",
      "--muted":          "oklch(50%  0.014 62)",
      "--subtle":         "oklch(70%  0.010 70)",
      "--line":           "oklch(83%  0.012 76)",
      "--accent":         "oklch(50%  0.135 56)",
      "--accent-dim":     "oklch(41%  0.108 56)",
      "--accent-soft":    "oklch(92%  0.042 72)",
      "--accent-ink":     "oklch(96%  0.012 82)",
      "--ok":             "oklch(44%  0.120 148)",
      "--focus-ring":     "oklch(50%  0.135 56 / 0.22)",
      "--ring-track":     "oklch(83%  0.012 76)",
      "--ring-progress":  "oklch(50%  0.135 56)"
    }
  },
  crimson: {
    label: "Crimson",
    colorScheme: "light",
    swatchBg: "oklch(99% 0.002 0)",
    swatchAccent: "oklch(52% 0.210 22)",
    swatchInk: "oklch(22% 0.018 20)",
    vars: {
      "--bg":             "oklch(99%  0.002 0)",
      "--surface":        "oklch(96%  0.006 10)",
      "--surface-mid":    "oklch(92%  0.010 12)",
      "--surface-strong": "oklch(87%  0.014 14)",
      "--ink":            "oklch(22%  0.018 20)",
      "--muted":          "oklch(42%  0.012 15)",
      "--subtle":         "oklch(58%  0.008 10)",
      "--line":           "oklch(88%  0.008 8)",
      "--accent":         "oklch(52%  0.210 22)",
      "--accent-dim":     "oklch(43%  0.170 22)",
      "--accent-soft":    "oklch(94%  0.055 18)",
      "--accent-ink":     "oklch(99%  0.002 0)",
      "--ok":             "oklch(44%  0.120 148)",
      "--focus-ring":     "oklch(52%  0.210 22 / 0.22)",
      "--ring-track":     "oklch(88%  0.008 8)",
      "--ring-progress":  "oklch(52%  0.210 22)"
    }
  }
};

const state = {
  authMode: "login",
  authToken: localStorage.getItem(STORAGE_KEYS.authToken) || "",
  user: null,
  pendingRoomFromUrl: "",
  session: "entry",
  socket: null,
  room: "",
  pendingRoomSetup: null,
  isHost: false,
  name: "",
  color: localStorage.getItem(STORAGE_KEYS.color) || "tomato",
  theme: localStorage.getItem(STORAGE_KEYS.theme) || "crimson",
  timer: createTimerState(),
  serverOffset: 0,
  participants: [],
  history: [],
  chat: [],
  music: { current: null, queue: [], maxPerUser: 5 },
  musicResults: [],
  musicPanelOpen: true,
  chatPanelOpen: true,
  musicMuted: localStorage.getItem(STORAGE_KEYS.muted) === "1",
  musicMuteTime: 0,
  reconnectTimer: null,
  copiedUntil: 0,
  noticeText: "",
  noticeUntil: 0,
  playerKey: "",
  audioUnlocked: sessionStorage.getItem("pmdr.audioUnlocked") === "1",
  todos: [],
  todoPanelOpen: false
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
  pwHint: document.querySelector("#pwHint"),
  authSubmitButton: document.querySelector("#authSubmitButton"),
  authMessage: document.querySelector("#authMessage"),
  accountBadge: document.querySelector("#accountBadge"),
  entryLogoutButton: document.querySelector("#entryLogoutButton"),
  createRoomButton: document.querySelector("#createRoomButton"),
  joinRoomForm: document.querySelector("#joinRoomForm"),
  joinRoomInput: document.querySelector("#joinRoomInput"),
  joinRoomMessage: document.querySelector("#joinRoomMessage"),
  createRoomDialog: document.querySelector("#createRoomDialog"),
  closeCreateRoomButton: document.querySelector("#closeCreateRoomButton"),
  createRoomForm: document.querySelector("#createRoomForm"),
  createRoomMessage: document.querySelector("#createRoomMessage"),
  createRoomInput: document.querySelector("#createRoomInput"),
  createNameInput: document.querySelector("#createNameInput"),
  createFocusMinutes: document.querySelector("#createFocusMinutes"),
  createShortMinutes: document.querySelector("#createShortMinutes"),
  createLongMinutes: document.querySelector("#createLongMinutes"),
  timerApp: document.querySelector("#timerApp"),
  workspaceShell: document.querySelector("#workspaceShell"),
  musicPanel: document.querySelector("#musicPanel"),
  chatPanel: document.querySelector("#chatPanel"),
  closeMusicButton: document.querySelector("#closeMusicButton"),
  closeChatButton: document.querySelector("#closeChatButton"),
  openMusicButton: document.querySelector("#openMusicButton"),
  openChatButton: document.querySelector("#openChatButton"),
  musicMuteButton: document.querySelector("#musicMuteButton"),
  settingsButton: document.querySelector("#settingsButton"),
  homeButton: document.querySelector("#homeButton"),
  modeLabel: document.querySelector("#modeLabel"),
  timeReadout: document.querySelector("#timeReadout"),
  startPauseButton: document.querySelector("#startPauseButton"),
  resetButton: document.querySelector("#resetButton"),
  primaryActions: document.querySelector("#primaryActions"),
  settingsDialog: document.querySelector("#settingsDialog"),
  closeSettingsButton: document.querySelector("#closeSettingsButton"),
  settingsKicker: document.querySelector("#settingsKicker"),
  settingsUsername: document.querySelector("#settingsUsername"),
  settingsLogoutButton: document.querySelector("#settingsLogoutButton"),
  roomCodeButton: document.querySelector("#roomCodeButton"),
  nameInput: document.querySelector("#nameInput"),
  colorRow: document.querySelector("#colorRow"),
  participantsBar: document.querySelector("#participantsBar"),
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  rhythmForm: document.querySelector("#rhythmForm"),
  focusMinutes: document.querySelector("#focusMinutes"),
  shortMinutes: document.querySelector("#shortMinutes"),
  longMinutes: document.querySelector("#longMinutes"),
  themeGrid: document.querySelector("#themeGrid"),
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
  canvas: document.querySelector("#focusCanvas"),
  todoPanel: document.querySelector("#todoPanel"),
  todoPanelTab: document.querySelector("#todoPanelTab"),
  todoPanelBody: document.querySelector("#todoPanelBody"),
  todoLists: document.querySelector("#todoLists"),
  todoPanelCount: document.querySelector("#todoPanelCount")
};

const context = elements.canvas.getContext("2d");

const ringColors = { track: "", progress: "" };
function cacheRingColors() {
  const s = getComputedStyle(document.documentElement);
  ringColors.track = s.getPropertyValue("--ring-track").trim();
  ringColors.progress = s.getPropertyValue("--ring-progress").trim();
}

function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.midnight;
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(theme.vars)) {
    root.style.setProperty(prop, value);
  }
  root.style.colorScheme = theme.colorScheme;
  state.theme = themeId;
  localStorage.setItem(STORAGE_KEYS.theme, themeId);
  cacheRingColors();
  lastRenderedProgress = -1;
  if (!elements.timerApp.hidden) drawTimer(getProgress());
  renderThemes();
}

function renderThemes() {
  elements.themeGrid.innerHTML = "";
  for (const [id, theme] of Object.entries(THEMES)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `theme-swatch${id === state.theme ? " is-active" : ""}`;
    button.style.setProperty("--swatch-bg", theme.swatchBg);
    button.style.setProperty("--swatch-accent", theme.swatchAccent);
    button.style.setProperty("--swatch-ink", theme.swatchInk);
    button.setAttribute("aria-label", `${theme.label} theme`);
    button.setAttribute("title", theme.label);
    button.addEventListener("click", () => applyTheme(id));
    elements.themeGrid.append(button);
  }
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
    lastUpdatedBy: "You"
  };
}

function sanitizeRoom(value) {
  const str = String(value || "").trim();
  const urlRoom = str.match(/[?&]room=([^&]+)/);
  const raw = urlRoom ? decodeURIComponent(urlRoom[1]) : str;
  return raw
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
  elements.loginTabButton.setAttribute("aria-pressed", String(mode === "login"));
  elements.signupTabButton.setAttribute("aria-pressed", String(mode === "signup"));
  elements.authSubmitButton.textContent = mode === "login" ? "Login" : "Create account";
  elements.authPasswordInput.autocomplete = mode === "login" ? "current-password" : "new-password";
  elements.pwHint.hidden = mode === "login";
}

function setAuthMessage(message) {
  elements.authMessage.textContent = message;
}

function setMusicMessage(message) {
  elements.musicMessage.textContent = message;
}

function setNotice() {
  /* subline removed */
}

function updateSubline() {
  /* subline removed */
}

function renderViewerBadge() {
  if (!state.user) {
    return;
  }

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
  renderViewerBadge();
}

function showTimerApp() {
  elements.entryScreen.hidden = true;
  elements.timerApp.hidden = false;
  requestAnimationFrame(resizeCanvas);
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
  elements.createRoomMessage.textContent = "";
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

function getNextMode(mode, focusSessionsDone) {
  if (mode === "focus") {
    return (focusSessionsDone + 1) % 4 === 0 ? "long" : "short";
  }

  return "focus";
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

function drawTimer(progress, t = 0) {
  const width = canvasDrawWidth;
  const height = canvasDrawHeight;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.40;

  context.clearRect(0, 0, width, height);

  /* Ambient wave rings — shown when music is playing and not muted.
     On mute, each ring finishes its current cycle before disappearing. */
  if (t > 0 && state.music.current) {
    context.save();
    context.translate(cx, cy);
    for (let i = 0; i < 4; i++) {
      if (state.musicMuted && state.musicMuteTime > 0) {
        const phaseAtMute = ((state.musicMuteTime / 2600) + i * 0.25) % 1;
        const ringDoneAt = state.musicMuteTime + (1 - phaseAtMute) * 2600;
        if (t >= ringDoneAt) continue;
      }
      const phase = ((t / 2600) + i * 0.25) % 1;
      const ringRadius = radius + 8 + i * 20 + phase * 16;
      const alpha = (1 - phase) * 0.18;
      context.beginPath();
      context.strokeStyle = ringColors.progress || "oklch(72% 0.13 76)";
      context.globalAlpha = alpha;
      context.lineWidth = 1.5;
      context.arc(0, 0, ringRadius, 0, Math.PI * 2);
      context.stroke();
    }
    context.globalAlpha = 1;
    context.restore();
  }

  /* Timer ring */
  context.save();
  context.translate(cx, cy);
  context.rotate(-Math.PI / 2);

  context.beginPath();
  context.strokeStyle = ringColors.track || "oklch(22% 0.016 62)";
  context.lineWidth = 5;
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.stroke();

  if (progress > 0) {
    context.beginPath();
    context.strokeStyle = ringColors.progress || "oklch(72% 0.13 76)";
    context.lineWidth = 5;
    context.lineCap = "round";
    context.arc(0, 0, radius, 0, Math.PI * 2 * progress);
    context.stroke();
  }

  context.restore();
}

function setMusicMuted(muted) {
  state.musicMuted = muted;
  state.musicMuteTime = muted ? performance.now() : 0;
  localStorage.setItem(STORAGE_KEYS.muted, muted ? "1" : "0");
  if (postMusicCommand(muted ? "mute" : "unMute")) {
    if (!muted) {
      scheduleMusicKeepAlive({ unmute: true, attempts: 3, initialDelay: 80 });
    }
  }
  elements.musicMuteButton.textContent = muted ? "Unmute" : "Mute";
}

function resizeCanvas() {
  if (elements.timerApp.hidden) {
    return;
  }
  const rect = elements.canvas.getBoundingClientRect();
  canvasDrawWidth = rect.width;
  canvasDrawHeight = rect.height;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  elements.canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  elements.canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  lastRenderedProgress = -1;
  drawTimer(getProgress(), state.music.current ? performance.now() : 0);
}

let resizeScheduled = null;
function scheduleResize() {
  clearTimeout(resizeScheduled);
  resizeScheduled = setTimeout(resizeCanvas, 120);
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

/* Tracks whether the user has unlocked media in this tab session. */
let audioInitializedInTab = state.audioUnlocked;
let musicKeepAliveScheduledAt = 0;
let lastMusicKeepAliveAt = 0;

function getMusicIframe() {
  return elements.youtubePlayerHost.querySelector("iframe");
}

function postMusicCommand(func, args = []) {
  const iframe = getMusicIframe();
  if (!iframe?.contentWindow) {
    return false;
  }
  iframe.contentWindow.postMessage(JSON.stringify({
    event: "command",
    func,
    args
  }), "*");
  return true;
}

function scheduleMusicKeepAlive({ unmute = false, attempts = 4, initialDelay = 160 } = {}) {
  if (state.session !== "multi" || !state.music.current) {
    return;
  }
  lastMusicKeepAliveAt = performance.now();
  const keepAliveStamp = ++musicKeepAliveScheduledAt;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    window.setTimeout(() => {
      if (keepAliveStamp !== musicKeepAliveScheduledAt) {
        return;
      }
      if (state.session !== "multi" || !state.music.current) {
        return;
      }
      postMusicCommand("playVideo");
      if (unmute && !state.musicMuted) {
        postMusicCommand("unMute");
      }
    }, initialDelay + attempt * 650);
  }
}

function playBell() {
  if (!audioInitializedInTab) return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 1047; // C6 — clear chime
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    osc.start(t);
    osc.stop(t + 1.8);
    osc.onended = () => ctx.close();
  } catch (_) {}
}

function setAudioUnlocked() {
  if (audioInitializedInTab) return;
  audioInitializedInTab = true;
  state.audioUnlocked = true;
  sessionStorage.setItem("pmdr.audioUnlocked", "1");
  if (state.session === "multi" && state.music.current && !state.musicMuted) {
    // Unmute the existing iframe rather than recreating it — recreation seeks to a
    // calculated position and causes drift vs. other participants. The iframe has been
    // playing silently with &mute=1 since page load, so its position is already correct.
    const iframe = elements.youtubePlayerHost.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: "unMute", args: [] }), "*");
    } else {
      syncMusicPlayer(true); // no iframe yet (e.g. music started after gesture), fall back
    }
  }
}

function unlockAudioPlayback() {
  if (!audioInitializedInTab) {
    audioInitializedInTab = true;
    state.audioUnlocked = true;
    sessionStorage.setItem("pmdr.audioUnlocked", "1");
  }
  if (state.session !== "multi" || !state.music.current) {
    return;
  }
  if (!getMusicIframe()) {
    syncMusicPlayer(true);
  }
  scheduleMusicKeepAlive({ unmute: !state.musicMuted, attempts: 5, initialDelay: 80 });
}

function clearMusicPlayer() {
  state.playerKey = "";
  musicKeepAliveScheduledAt += 1;
  elements.youtubePlayerHost.innerHTML = "";
}

function syncMusicPlayer(force = false) {
  if (state.session !== "multi" || !state.music.current) {
    clearMusicPlayer();
    return;
  }

  const current = state.music.current;
  const key = `${current.id}:${current.startedAt}`;
  if (!force && state.playerKey === key) {
    return;
  }

  const resumeAtSeconds = Math.max(0, Math.floor((Date.now() + state.serverOffset - current.startedAt) / 1000));
  const iframe = document.createElement("iframe");
  iframe.width = "200";
  iframe.height = "113";
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(current.videoId)}?autoplay=1&controls=0&start=${resumeAtSeconds}&playsinline=1&modestbranding=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&mute=1`;
  iframe.title = "Background music";
  iframe.frameBorder = "0";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  iframe.addEventListener("load", () => {
    scheduleMusicKeepAlive({
      unmute: audioInitializedInTab && !state.musicMuted,
      attempts: 5,
      initialDelay: 240
    });
  });
  elements.youtubePlayerHost.replaceChildren(iframe);
  state.playerKey = key;
  scheduleMusicKeepAlive({
    unmute: audioInitializedInTab && !state.musicMuted,
    attempts: 4,
    initialDelay: 520
  });
  return;
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

  elements.settingsButton.hidden = false;
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
  lastRenderedTime = "";
  lastRenderedProgress = -1;
  elements.modeLabel.textContent = MODE_COPY[state.timer.mode].label;
  elements.timeReadout.textContent = formatTime(getRemaining());

  elements.startPauseButton.textContent = state.timer.status === "running" ? "Pause" : "Start";
  elements.startPauseButton.className = `action-button ${state.timer.status === "running" ? "pause" : "start"}`;

  for (const button of elements.modeButtons) {
    const isActive = button.dataset.mode === state.timer.mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  elements.focusMinutes.value = msToMinutes(state.timer.durations.focus);
  elements.shortMinutes.value = msToMinutes(state.timer.durations.short);
  elements.longMinutes.value = msToMinutes(state.timer.durations.long);
  updateSubline();
}

function renderParticipants() {
  if (!elements.participantsBar) return;
  elements.participantsBar.innerHTML = "";
  if (state.session !== "multi") return;

  for (const participant of state.participants) {
    const chip = document.createElement("span");
    chip.className = `participant-chip${participant.isHost ? " is-host" : ""}`;
    const dot = document.createElement("span");
    dot.className = "participant-dot";
    dot.style.setProperty("--avatar", COLORS[participant.color] || COLORS.tomato);
    const name = document.createElement("span");
    const isMe = participant.name === state.name;
    const hostTag = participant.isHost ? " (HOST)" : "";
    const youTag = isMe ? " (YOU)" : "";
    name.textContent = `${participant.name}${hostTag}${youTag}`;
    chip.append(dot, name);
    elements.participantsBar.append(chip);
  }
}

function renderHistory() {
  /* History list removed from UI; state.history is kept for internal use only. */
}

function scrollChatToBottom() {
  elements.chatList.scrollTop = elements.chatList.scrollHeight;
}

function renderChat() {
  elements.chatList.innerHTML = "";
  if (state.session !== "multi" && !state.chat.length) {
    elements.chatList.innerHTML = `<li class="history-item"><strong>Multi room chat</strong><span>Join a room to talk with others.</span></li>`;
    return;
  }

  for (const message of state.chat) {
    const item = document.createElement("li");
    item.className = "chat-item";
    const time = new Date(message.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    item.innerHTML = `
      <div class="chat-main">
        <span class="chat-author"></span>
        <span class="chat-text"></span>
      </div>
      <time class="chat-meta"></time>
    `;
    item.querySelector(".chat-author").textContent = message.author.name;
    item.querySelector(".chat-text").textContent = message.text;
    const timeEl = item.querySelector(".chat-meta");
    timeEl.textContent = time;
    timeEl.dateTime = new Date(message.at).toISOString();
    elements.chatList.append(item);
  }

  requestAnimationFrame(scrollChatToBottom);
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
    const item = document.createElement("li");
    item.className = "music-result";
    item.innerHTML = `
      <img class="music-thumb" alt="" loading="lazy" />
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
    const item = document.createElement("li");
    item.className = "queue-item";
    const canRemove = state.isHost || track.requestedBy.username === state.user?.username;
    item.innerHTML = `
      <img class="music-thumb" alt="" loading="lazy" />
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

let lastKnownMode = null;

function applySnapshot(payload) {
  const prevMode = lastKnownMode;
  state.serverOffset = payload.serverNow - Date.now();
  state.timer = {
    ...payload.timer,
    startedAt: payload.timer?.status === "running" ? payload.serverNow : null
  };
  state.participants = payload.participants || [];
  state.history = payload.history || [];
  state.chat = payload.chat || [];
  state.music = payload.music || { current: null, queue: [], maxPerUser: 5 };
  state.room = payload.room;
  state.isHost = Boolean(payload.isHost);
  state.pendingRoomSetup = null;
  if (elements.roomCodeButton) {
    elements.roomCodeButton.textContent = payload.room;
    elements.roomCodeButton.hidden = false;
  }

  lastKnownMode = state.timer.mode;
  if (prevMode !== null && prevMode !== state.timer.mode) playBell();

  state.todos = payload.todos || [];
  updateControls();
  applyTimerToUI();
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
  renderTodos();
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

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const params = new URLSearchParams({
    room: state.room,
    name: state.name,
    color: state.color,
    token: state.authToken
  });

  if (state.pendingRoomSetup?.durations) {
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

  socket.addEventListener("close", async () => {
    if (state.socket !== socket || state.session !== "multi") {
      return;
    }
    state.socket = null;
    try {
      await apiRequest(`/api/rooms/${encodeURIComponent(state.room)}`, { method: "GET" });
      state.reconnectTimer = setTimeout(connect, 1200);
    } catch {
      goHome();
      elements.joinRoomMessage.textContent = "Room no longer exists.";
    }
  });
}

function startSolo() {
  disconnect();
  clearMusicPlayer();
  state.session = "solo";
  state.room = "";
  state.pendingRoomSetup = null;
  state.isHost = true;
  state.serverOffset = 0;
  state.timer = createTimerState();
  state.participants = [];
  state.history = [];
  state.chat = [];
  state.music = { current: null, queue: [], maxPerUser: 5 };
  state.musicResults = [];
  const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.soloTasks) || "[]");
  state.todos = [{
    username: state.user?.username || "me",
    name: state.name,
    color: state.color,
    tasks: savedTasks
  }];
  setMusicMessage("");
  updateUrl();
  showTimerApp();
  updateControls();
  applyTimerToUI();
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
  renderTodos();
}

async function joinRoom(room) {
  try {
    await apiRequest(`/api/rooms/${encodeURIComponent(room)}`, { method: "GET" });
  } catch {
    showModePanel();
    elements.joinRoomMessage.textContent = "Room not found.";
    return;
  }
  startMulti(room);
}

function startMulti(room, setup = null) {
  const nextRoom = sanitizeRoom(room);
  if (!nextRoom || !isAuthenticated()) {
    return;
  }

  state.session = "multi";
  state.room = nextRoom;
  state.pendingRoomSetup = setup;
  state.isHost = false;
  state.timer = createTimerState(setup?.durations || DEFAULT_DURATIONS);
  state.participants = [];
  state.history = [];
  state.chat = [];
  state.music = { current: null, queue: [], maxPerUser: 5 };
  state.musicResults = [];
  state.todos = [];
  setMusicMessage("");
  elements.roomCodeButton.textContent = nextRoom;
  elements.roomCodeButton.hidden = false;
  updateUrl(nextRoom);
  showTimerApp();
  updateControls();
  applyTimerToUI();
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
  renderTodos();
  connect();
}

function goHome() {
  closeAllDialogs(false);
  disconnect();
  clearMusicPlayer();
  elements.roomCodeButton.hidden = true;
  state.room = "";
  state.pendingRoomSetup = null;
  state.isHost = false;
  state.serverOffset = 0;
  state.timer = createTimerState();
  state.participants = [];
  state.history = [];
  state.chat = [];
  state.music = { current: null, queue: [], maxPerUser: 5 };
  state.musicResults = [];
  state.todos = [];
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
      await joinRoom(state.pendingRoomFromUrl);
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
      await joinRoom(state.pendingRoomFromUrl);
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

function setPanelOpen(panel, open) {
  if (panel === "music") {
    state.musicPanelOpen = open;
    elements.musicPanel.classList.toggle("panel-closed", !open);
  } else {
    state.chatPanelOpen = open;
    elements.chatPanel.classList.toggle("panel-closed", !open);
  }
}

function setTodoPanelOpen(open) {
  state.todoPanelOpen = open;
  elements.todoPanel.classList.toggle("is-open", open);
  elements.todoPanelTab.setAttribute("aria-expanded", String(open));
}

function createTodoItem(task, isMe) {
  const item = document.createElement("div");
  item.className = [
    "todo-item",
    task.forSession ? "is-for-session" : "",
    task.done ? "is-done" : ""
  ].filter(Boolean).join(" ");

  const checkbox = document.createElement("button");
  checkbox.type = "button";
  checkbox.className = `todo-check${task.done ? " is-checked" : ""}`;
  checkbox.setAttribute("aria-label", task.done ? "Mark incomplete" : "Mark complete");
  checkbox.textContent = task.done ? "✓" : "";
  if (isMe) {
    checkbox.addEventListener("click", () => {
      if (state.session === "multi") {
        send({ type: "todo", action: "toggle", id: task.id });
      } else {
        handleSoloTodo("toggle", { id: task.id });
      }
    });
  } else {
    checkbox.disabled = true;
  }

  const textEl = document.createElement("span");
  textEl.className = `todo-item-text${task.done ? " is-done" : ""}${isMe ? "" : " is-readonly"}`;
  textEl.textContent = task.text;
  textEl.title = task.text;

  if (isMe) {
    textEl.addEventListener("click", () => {
      const editInput = document.createElement("input");
      editInput.className = "todo-edit-input";
      editInput.value = task.text;
      editInput.maxLength = 200;
      textEl.replaceWith(editInput);
      editInput.focus();
      editInput.select();

      let saved = false;
      const save = () => {
        if (saved) return;
        saved = true;
        const newText = editInput.value.trim();
        if (newText && newText !== task.text) {
          if (state.session === "multi") {
            send({ type: "todo", action: "edit", id: task.id, text: newText });
          } else {
            handleSoloTodo("edit", { id: task.id, text: newText });
          }
        } else {
          editInput.replaceWith(textEl);
        }
      };

      editInput.addEventListener("blur", save);
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); editInput.blur(); }
        if (e.key === "Escape") { saved = true; editInput.replaceWith(textEl); }
      });
    });
  }

  item.append(checkbox, textEl);

  if (isMe) {
    const actions = document.createElement("div");
    actions.className = "todo-item-actions";

    const sessionBtn = document.createElement("button");
    sessionBtn.type = "button";
    sessionBtn.className = `todo-item-btn${task.forSession ? " is-session" : ""}`;
    sessionBtn.title = task.forSession ? "Remove from session focus" : "Mark for this session";
    sessionBtn.textContent = task.forSession ? "★" : "☆";
    sessionBtn.addEventListener("click", () => {
      if (state.session === "multi") {
        send({ type: "todo", action: "session", id: task.id });
      } else {
        handleSoloTodo("session", { id: task.id });
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "todo-item-btn";
    deleteBtn.title = "Delete task";
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", () => {
      if (state.session === "multi") {
        send({ type: "todo", action: "delete", id: task.id });
      } else {
        handleSoloTodo("delete", { id: task.id });
      }
    });

    actions.append(sessionBtn, deleteBtn);
    item.append(actions);
  }

  return item;
}

function renderTodos() {
  elements.todoLists.innerHTML = "";
  const myUsername = state.user?.username;

  const sorted = [...state.todos].sort((a, b) => {
    if (a.username === myUsername) return -1;
    if (b.username === myUsername) return 1;
    return 0;
  });

  const myEntry = state.todos.find((e) => e.username === myUsername);
  const sessionCount = myEntry ? myEntry.tasks.filter((t) => t.forSession && !t.done).length : 0;
  const pendingCount = myEntry ? myEntry.tasks.filter((t) => !t.done).length : 0;
  elements.todoPanelCount.textContent = sessionCount > 0
    ? `${sessionCount} in session`
    : pendingCount > 0 ? `${pendingCount} pending` : "";

  if (sorted.length === 0) {
    const empty = document.createElement("p");
    empty.className = "todo-empty-state";
    empty.textContent = "Add your first task below.";
    elements.todoLists.append(empty);

    if (state.session !== "multi" || state.user) {
      elements.todoLists.append(buildAddRow(myUsername));
    }
    return;
  }

  for (const entry of sorted) {
    const isMe = entry.username === myUsername;
    const col = document.createElement("div");
    col.className = "todo-user-col";

    const header = document.createElement("div");
    header.className = "todo-col-header";
    const dot = document.createElement("span");
    dot.className = "todo-col-dot";
    dot.style.setProperty("--dot-color", COLORS[entry.color] || COLORS.tomato);
    const nameEl = document.createElement("span");
    nameEl.className = "todo-col-name";
    nameEl.textContent = isMe ? `${entry.name} (you)` : entry.name;
    header.append(dot, nameEl);
    col.append(header);

    const taskList = document.createElement("div");
    taskList.className = "todo-tasks";
    for (const task of entry.tasks) {
      taskList.append(createTodoItem(task, isMe));
    }
    if (entry.tasks.length === 0) {
      const empty = document.createElement("p");
      empty.className = "todo-empty";
      empty.textContent = isMe ? "No tasks yet." : "Nothing here.";
      taskList.append(empty);
    }
    col.append(taskList);

    if (isMe) {
      col.append(buildAddRow(myUsername));
    }

    elements.todoLists.append(col);
  }

  // If user has no entry yet (just joined multi room), show a column for them
  if (!myEntry && myUsername && state.session === "multi") {
    const col = document.createElement("div");
    col.className = "todo-user-col";
    const header = document.createElement("div");
    header.className = "todo-col-header";
    const dot = document.createElement("span");
    dot.className = "todo-col-dot";
    dot.style.setProperty("--dot-color", COLORS[state.color] || COLORS.tomato);
    const nameEl = document.createElement("span");
    nameEl.className = "todo-col-name";
    nameEl.textContent = `${state.name} (you)`;
    header.append(dot, nameEl);
    const taskList = document.createElement("div");
    taskList.className = "todo-tasks";
    const empty = document.createElement("p");
    empty.className = "todo-empty";
    empty.textContent = "No tasks yet.";
    taskList.append(empty);
    col.append(header, taskList, buildAddRow(myUsername));
    elements.todoLists.prepend(col);
  }
}

function buildAddRow(myUsername) {
  const addRow = document.createElement("div");
  addRow.className = "todo-add-row";
  const input = document.createElement("input");
  input.className = "todo-add-input";
  input.placeholder = "Add a task...";
  input.maxLength = 200;
  input.autocomplete = "off";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "todo-add-btn";
  btn.textContent = "Add";

  const addTask = () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    if (state.session === "multi") {
      send({ type: "todo", action: "add", text });
    } else {
      handleSoloTodo("add", { text });
    }
    input.focus();
  };

  btn.addEventListener("click", addTask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addTask(); }
  });

  addRow.append(input, btn);
  return addRow;
}

function handleSoloTodo(action, extra = {}) {
  if (!state.todos.length) return;
  const entry = state.todos[0];

  switch (action) {
    case "add": {
      const text = String(extra.text || "").trim().slice(0, 200);
      if (!text) return;
      entry.tasks.push({ id: randomId(8), text, done: false, forSession: false, createdAt: Date.now() });
      break;
    }
    case "edit": {
      const task = entry.tasks.find((t) => t.id === extra.id);
      if (!task) return;
      const text = String(extra.text || "").trim().slice(0, 200);
      if (text) task.text = text;
      break;
    }
    case "delete": {
      const idx = entry.tasks.findIndex((t) => t.id === extra.id);
      if (idx !== -1) entry.tasks.splice(idx, 1);
      break;
    }
    case "toggle": {
      const task = entry.tasks.find((t) => t.id === extra.id);
      if (task) task.done = !task.done;
      break;
    }
    case "session": {
      const task = entry.tasks.find((t) => t.id === extra.id);
      if (task) task.forSession = !task.forSession;
      break;
    }
    default:
      return;
  }

  localStorage.setItem(STORAGE_KEYS.soloTasks, JSON.stringify(entry.tasks));
  renderTodos();
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

  elements.createRoomButton.addEventListener("click", () => {
    prepareCreateRoomDialog();
    openDialog(elements.createRoomDialog);
  });

  elements.createRoomForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const room = sanitizeRoom(elements.createRoomInput.value) || `room-${randomId(4)}`;
    const durations = {
      focus: clampMinutes(elements.createFocusMinutes.value, 25) * 60_000,
      short: clampMinutes(elements.createShortMinutes.value, 5) * 60_000,
      long: clampMinutes(elements.createLongMinutes.value, 15) * 60_000
    };

    try {
      await apiRequest("/api/rooms", {
        method: "POST",
        body: JSON.stringify({
          room,
          focus: durations.focus / 60_000,
          short: durations.short / 60_000,
          long: durations.long / 60_000
        })
      });
    } catch (error) {
      elements.createRoomMessage.textContent = error.message || "Could not create room.";
      return;
    }

    elements.createRoomMessage.textContent = "";
    state.name = normalizeName(elements.createNameInput.value || state.user?.username, state.user?.username || "Maker");
    elements.nameInput.value = state.name;
    localStorage.setItem(STORAGE_KEYS.displayName, state.name);
    closeDialog(elements.createRoomDialog);
    startMulti(room, { durations });
  });

  elements.closeCreateRoomButton.addEventListener("click", () => closeDialog(elements.createRoomDialog));
  bindDialogBackdrop(elements.createRoomDialog, () => closeDialog(elements.createRoomDialog));

  elements.joinRoomForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const room = sanitizeRoom(elements.joinRoomInput.value);
    if (!room) {
      elements.joinRoomMessage.textContent = "Enter a valid room code.";
      return;
    }
    elements.joinRoomMessage.textContent = "";
    elements.joinRoomInput.value = "";
    await joinRoom(room);
  });

  elements.settingsButton.addEventListener("click", () => openDialog(elements.settingsDialog));
  elements.closeSettingsButton.addEventListener("click", () => closeDialog(elements.settingsDialog));
  elements.settingsLogoutButton.addEventListener("click", logout);
  bindDialogBackdrop(elements.settingsDialog, () => closeDialog(elements.settingsDialog));

  elements.homeButton.addEventListener("click", goHome);

  elements.closeMusicButton.addEventListener("click", () => setPanelOpen("music", false));
  elements.closeChatButton.addEventListener("click", () => setPanelOpen("chat", false));
  elements.openMusicButton.addEventListener("click", () => setPanelOpen("music", true));
  elements.openChatButton.addEventListener("click", () => setPanelOpen("chat", true));
  elements.todoPanelTab.addEventListener("click", () => setTodoPanelOpen(!state.todoPanelOpen));
  elements.musicMuteButton.addEventListener("click", () => setMusicMuted(!state.musicMuted));

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

  elements.roomCodeButton.addEventListener("click", async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      elements.roomCodeButton.classList.add("copied");
      setTimeout(() => elements.roomCodeButton.classList.remove("copied"), 1800);
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

  window.addEventListener("pointerdown", unlockAudioPlayback, { passive: true });
  window.addEventListener("touchstart", unlockAudioPlayback, { passive: true });
  window.addEventListener("touchend", unlockAudioPlayback, { passive: true });
  window.addEventListener("click", unlockAudioPlayback, { passive: true });
  window.addEventListener("keydown", unlockAudioPlayback);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.music.current) {
      if (!getMusicIframe()) {
        syncMusicPlayer(true);
      }
      scheduleMusicKeepAlive({
        unmute: audioInitializedInTab && !state.musicMuted,
        attempts: 4,
        initialDelay: 60
      });
    }
  });
  window.addEventListener("pageshow", () => {
    if (state.music.current) {
      if (!getMusicIframe()) {
        syncMusicPlayer(true);
      }
      scheduleMusicKeepAlive({
        unmute: audioInitializedInTab && !state.musicMuted,
        attempts: 4,
        initialDelay: 60
      });
    }
  });
  window.addEventListener("resize", scheduleResize);
}

let lastRenderedTime = "";
let lastRenderedProgress = -1;
let canvasDrawWidth = 0;
let canvasDrawHeight = 0;

function tick() {
  if (!elements.timerApp.hidden) {
    const remaining = getRemaining();
    const formatted = formatTime(remaining);

    if (formatted !== lastRenderedTime) {
      lastRenderedTime = formatted;
      elements.timeReadout.textContent = formatted;
    }

    if (state.session === "solo" && state.timer.status === "running" && remaining <= 0) {
      playBell();
      transitionTimer(state.timer, "Timer");
      addLocalHistory("Timer", `${state.timer.mode} started`);
      applyTimerToUI();
      renderHistory();
    }

    const progress = getProgress();
    const waveActive = Boolean(state.music.current);
    if (waveActive && !getMusicIframe()) {
      syncMusicPlayer(true);
    }
    if (waveActive && performance.now() - lastMusicKeepAliveAt > 2500) {
      scheduleMusicKeepAlive({
        unmute: audioInitializedInTab && !state.musicMuted,
        attempts: 1,
        initialDelay: 0
      });
    }
    if (waveActive || Math.abs(progress - lastRenderedProgress) > 0.0002) {
      lastRenderedProgress = progress;
      drawTimer(progress, waveActive ? performance.now() : 0);
    }

    if (state.noticeText && Date.now() > state.noticeUntil) {
      updateSubline();
    }
  }

  requestAnimationFrame(tick);
}

function init() {
  state.name = normalizeName(localStorage.getItem(STORAGE_KEYS.displayName) || "", "Maker");
  elements.nameInput.value = state.name;
  elements.createNameInput.value = state.name;
  applyTheme(state.theme);
  renderColorDots();
  elements.musicMuteButton.textContent = state.musicMuted ? "Unmute" : "Mute";
  bindEvents();
  restoreSession();
  requestAnimationFrame(tick);
}

init();
