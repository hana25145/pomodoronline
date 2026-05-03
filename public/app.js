const LEGACY_COLORS = {
  tomato: "#d95540",
  leaf: "#2e9456",
  blue: "#3a6cb8",
  plum: "#7b3a88",
  gold: "#c8a028"
};
const DEFAULT_COLOR = "#d95540";

const DEFAULT_DURATIONS = {
  focus: 25 * 60 * 1000,
  short: 5 * 60 * 1000,
  long: 15 * 60 * 1000
};
const DEFAULT_FILES_FOLDER_ID = "default-files";

const STATUS_UPDATE_COOLDOWN_MS = 10 * 60 * 1000;

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
  focusTask: "pmdr.focusTask",
  savedMusic: "pmdr.savedMusic"
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
  color: (() => { const s = localStorage.getItem(STORAGE_KEYS.color) || ""; return LEGACY_COLORS[s] || (s.startsWith("#") ? s : DEFAULT_COLOR); })(),
  theme: localStorage.getItem(STORAGE_KEYS.theme) || "crimson",
  timer: createTimerState(),
  serverOffset: 0,
  participants: [],
  history: [],
  chat: [],
  music: { current: null, queue: [], maxPerUser: 5 },
  musicResults: [],
  savedMusic: JSON.parse(localStorage.getItem(STORAGE_KEYS.savedMusic) || "[]"),
  musicSearchMode: "search",
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
  focusTasks: [],
  statusText: "",
  statusCooldownUntil: 0,
  todos: [],
  todoPanelOpen: false,
  groups: [],
  currentGroup: null,
  pendingGroupFromUrl: "",
  createRoomGroupId: null,
  sessionVotes: [],
  sessionVoteSubmitted: false,
  activeTask: null,
  groupTab: "rooms",
  groupMaterials: [],
  groupThreads: [],
  currentSubjectId: null,
  pendingUploadSubjectId: null,
  pendingUploadFolderId: null,
  pdfPreviewObjectUrl: "",
  pdfPreviewDownload: null,
  mentionQuery: "",
  mentionHighlight: 0,
  openReplyThreadId: null
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
  groupApp: document.querySelector("#groupApp"),
  groupBackButton: document.querySelector("#groupBackButton"),
  groupTitle: document.querySelector("#groupTitle"),
  groupInviteButton: document.querySelector("#groupInviteButton"),
  groupCreateRoomButton: document.querySelector("#groupCreateRoomButton"),
  groupRoomsList: document.querySelector("#groupRoomsList"),
  groupMembersList: document.querySelector("#groupMembersList"),
  groupsList: document.querySelector("#groupsList"),
  newGroupButton: document.querySelector("#newGroupButton"),
  newGroupForm: document.querySelector("#newGroupForm"),
  newGroupInput: document.querySelector("#newGroupInput"),
  newGroupMessage: document.querySelector("#newGroupMessage"),
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
  statusForm: document.querySelector("#statusForm"),
  statusInput: document.querySelector("#statusInput"),
  statusSubmitButton: document.querySelector("#statusSubmitButton"),
  statusLockText: document.querySelector("#statusLockText"),
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
  musicHeartButton: document.querySelector("#musicHeartButton"),
  musicSearchModeSearch: document.querySelector("#musicSearchModeSearch"),
  musicSearchModeSaved: document.querySelector("#musicSearchModeSaved"),
  musicSearchForm: document.querySelector("#musicSearchForm"),
  musicSearchInput: document.querySelector("#musicSearchInput"),
  musicMessage: document.querySelector("#musicMessage"),
  musicResults: document.querySelector("#musicResults"),
  musicProgress: document.querySelector("#musicProgress"),
  musicProgressFill: document.querySelector("#musicProgressFill"),
  musicProgressElapsed: document.querySelector("#musicProgressElapsed"),
  musicProgressTotal: document.querySelector("#musicProgressTotal"),
  musicQueueRemaining: document.querySelector("#musicQueueRemaining"),
  musicQueue: document.querySelector("#musicQueue"),
  musicQueueTitle: document.querySelector("#musicQueueTitle"),
  musicQuotaBadge: document.querySelector("#musicQuotaBadge"),
  musicSearchSubmitButton: document.querySelector("#musicSearchForm button[type='submit']"),
  chatSubmitButton: document.querySelector("#chatForm button[type='submit']"),
  youtubePlayerHost: document.querySelector("#youtubePlayerHost"),
  canvas: document.querySelector("#focusCanvas"),
  sessionGoalDialog: document.querySelector("#sessionGoalDialog"),
  sessionGoalForm: document.querySelector("#sessionGoalForm"),
  sessionGoalInput: document.querySelector("#sessionGoalInput"),
  sessionCompleteDialog: document.querySelector("#sessionCompleteDialog"),
  sessionCompleteGoal: document.querySelector("#sessionCompleteGoal"),
  sessionCompleteYes: document.querySelector("#sessionCompleteYes"),
  sessionCompleteNo: document.querySelector("#sessionCompleteNo"),
  sessionCompleteForfeit: document.querySelector("#sessionCompleteForfeit"),
  sessionVoteList: document.querySelector("#sessionVoteList"),
  finishEarlyButton: document.querySelector("#finishEarlyButton"),
  finishEarlyDialog: document.querySelector("#finishEarlyDialog"),
  finishEarlyForm: document.querySelector("#finishEarlyForm"),
  finishEarlyInput: document.querySelector("#finishEarlyInput"),
  finishEarlyStop: document.querySelector("#finishEarlyStop"),
  insightDialog: document.querySelector("#insightDialog"),
  insightTitle: document.querySelector("#insightTitle"),
  insightFocusTime: document.querySelector("#insightFocusTime"),
  insightTaskList: document.querySelector("#insightTaskList"),
  closeInsightButton: document.querySelector("#closeInsightButton"),
  pdfPreviewDialog: document.querySelector("#pdfPreviewDialog"),
  pdfPreviewTitle: document.querySelector("#pdfPreviewTitle"),
  pdfPreviewFrame: document.querySelector("#pdfPreviewFrame"),
  pdfDownloadButton: document.querySelector("#pdfDownloadButton"),
  closePdfPreviewButton: document.querySelector("#closePdfPreviewButton"),
  groupTabRooms: document.querySelector("#groupTabRooms"),
  groupTabMaterial: document.querySelector("#groupTabMaterial"),
  groupBodyRooms: document.querySelector("#groupBodyRooms"),
  groupBodyMaterial: document.querySelector("#groupBodyMaterial"),
  subjectDetailView: document.querySelector("#subjectDetailView"),
  subjectDetailBackButton: document.querySelector("#subjectDetailBackButton"),
  subjectDetailTitle: document.querySelector("#subjectDetailTitle"),
  subjectDetailMeta: document.querySelector("#subjectDetailMeta"),
  subjectRenameButton: document.querySelector("#subjectRenameButton"),
  subjectFolderButton: document.querySelector("#subjectFolderButton"),
  subjectUploadButton: document.querySelector("#subjectUploadButton"),
  addSubjectButton: document.querySelector("#addSubjectButton"),
  newSubjectForm: document.querySelector("#newSubjectForm"),
  newSubjectInput: document.querySelector("#newSubjectInput"),
  newSubjectMessage: document.querySelector("#newSubjectMessage"),
  subjectTilesList: document.querySelector("#subjectTilesList"),
  subjectCategoryButtons: document.querySelector("#subjectCategoryButtons"),
  subjectsList: document.querySelector("#subjectsList"),
  fileUploadInput: document.querySelector("#fileUploadInput"),
  threadsList: document.querySelector("#threadsList"),
  newThreadForm: document.querySelector("#newThreadForm"),
  threadInput: document.querySelector("#threadInput"),
  mentionDropdown: document.querySelector("#mentionDropdown")
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
    button.textContent = theme.label;
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

function normalizeStatusText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

function formatCooldown(ms) {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
  const input = document.createElement("input");
  input.type = "color";
  input.className = "color-hex-input";
  input.value = state.color.startsWith("#") ? state.color : DEFAULT_COLOR;
  input.setAttribute("aria-label", "Tag color");
  input.addEventListener("input", () => {
    state.color = input.value;
    localStorage.setItem(STORAGE_KEYS.color, input.value);
    if (state.session === "multi") {
      sendHello();
    }
  });
  elements.colorRow.append(input);
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
  elements.groupApp.hidden = true;
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
  elements.groupApp.hidden = true;
  renderViewerBadge();
  fetchGroups();
}

function showTimerApp() {
  elements.entryScreen.hidden = true;
  elements.timerApp.hidden = false;
  elements.groupApp.hidden = true;
  requestAnimationFrame(resizeCanvas);
}

function showGroupApp() {
  closeAllDialogs(false);
  disconnect();
  clearMusicPlayer();
  state.session = "entry";
  state.currentSubjectId = null;
  elements.entryScreen.hidden = true;
  elements.timerApp.hidden = true;
  elements.groupApp.hidden = false;
  elements.groupBodyRooms.hidden = false;
  elements.subjectDetailView.hidden = true;
}

async function fetchGroups() {
  if (!state.user) return;
  try {
    const data = await apiRequest("/api/groups", { method: "GET" });
    state.groups = data.groups || [];
  } catch {
    state.groups = [];
  }
  renderGroupsList();
}

function renderGroupsList() {
  elements.groupsList.innerHTML = "";
  if (state.groups.length === 0) {
    const empty = document.createElement("li");
    empty.className = "groups-empty";
    empty.textContent = "No groups yet — create one to get started.";
    elements.groupsList.append(empty);
    return;
  }
  for (const group of state.groups) {
    const li = document.createElement("li");
    li.className = "group-list-item";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "group-list-button";
    const nameSpan = document.createElement("span");
    nameSpan.className = "group-list-name";
    nameSpan.textContent = group.name;
    const arrow = document.createElement("span");
    arrow.className = "group-list-arrow";
    arrow.textContent = "→";
    btn.append(nameSpan, arrow);
    btn.addEventListener("click", () => openGroupPage(group.id));
    li.append(btn);
    elements.groupsList.append(li);
  }
}

async function openGroupPage(groupId) {
  try {
    const data = await apiRequest(`/api/groups/${encodeURIComponent(groupId)}`, { method: "GET" });
    state.currentGroup = data.group;
    showGroupApp();
    renderGroupPage(data);
  } catch {
    await fetchGroups();
  }
}

function renderGroupPage(data) {
  const { group, activeRooms } = data;
  elements.groupTitle.textContent = group.name;
  fetchGroupMaterials();
  fetchGroupThreads();

  elements.groupMembersList.innerHTML = "";
  for (const username of group.members) {
    const li = document.createElement("li");
    li.className = "group-member-item";
    const dot = document.createElement("span");
    dot.className = "group-member-dot";
    const nameEl = document.createElement("span");
    nameEl.className = "group-member-name";
    nameEl.textContent = username;
    if (username === state.user?.username) nameEl.classList.add("is-you");
    li.append(dot, nameEl);
    elements.groupMembersList.append(li);
  }

  elements.groupRoomsList.innerHTML = "";
  if (!activeRooms || activeRooms.length === 0) {
    const empty = document.createElement("li");
    empty.className = "group-rooms-empty";
    empty.textContent = "No active rooms. Create one to start a session.";
    elements.groupRoomsList.append(empty);
    return;
  }
  for (const room of activeRooms) {
    const li = document.createElement("li");
    li.className = "group-room-item";
    li.addEventListener("click", () => startMulti(room.id));
    const info = document.createElement("div");
    info.className = "group-room-info";
    const nameEl = document.createElement("span");
    nameEl.className = "group-room-name";
    nameEl.textContent = room.id;
    const meta = document.createElement("div");
    meta.className = "group-room-meta";
    const timer = room.timer || {};
    const statusText = timer.status === "running"
      ? `${MODE_COPY[timer.mode]?.text || "Focus"} · ${formatRoomRemaining(timer.remainingMs || 0)} left`
      : timer.status === "paused"
        ? `${MODE_COPY[timer.mode]?.text || "Focus"} paused`
        : "Waiting to start";
    const status = document.createElement("span");
    status.className = "group-room-status";
    const dot = document.createElement("span");
    dot.className = `group-room-status-dot ${timer.status === "running" ? timer.mode : "idle"}`;
    status.append(dot, document.createTextNode(statusText));
    meta.append(status);
    if (timer.cycle) {
      const badge = document.createElement("span");
      badge.className = "group-room-timer-badge";
      badge.textContent = timer.mode === "focus" ? `Round ${timer.cycle}` : MODE_COPY[timer.mode]?.label || "Break";
      meta.append(badge);
    }
    info.append(nameEl, meta);

    const right = document.createElement("div");
    right.className = "group-room-right";
    const avatars = document.createElement("div");
    avatars.className = "group-room-avatars";
    for (const participant of (room.participants || []).slice(0, 4)) {
      const avatar = document.createElement("span");
      avatar.className = "group-room-avatar";
      avatar.style.setProperty("--avatar", LEGACY_COLORS[participant.color] || participant.color || DEFAULT_COLOR);
      avatar.textContent = (participant.name || "?").slice(0, 1).toUpperCase();
      avatars.append(avatar);
    }
    const countEl = document.createElement("span");
    countEl.className = "group-room-count";
    countEl.textContent = `${room.participantCount} member${room.participantCount !== 1 ? "s" : ""}`;
    const arrow = document.createElement("span");
    arrow.className = "group-room-join-arrow";
    arrow.textContent = "→";
    right.append(avatars, countEl, arrow);
    li.append(info, right);
    elements.groupRoomsList.append(li);
  }
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
  closeDialog(elements.sessionGoalDialog);
  closeDialog(elements.sessionCompleteDialog);
  closeDialog(elements.finishEarlyDialog);
  closeDialog(elements.insightDialog);
  closePdfPreview();
  if (restoreFocus && !elements.timerApp.hidden) {
    elements.homeButton.focus();
  }
}

async function resolveTask(status, focusMs) {
  const task = state.activeTask;
  state.activeTask = null;
  if (!task || state.session !== "multi") return;
  try {
    await apiRequest("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ text: task.text, status, focusMs: focusMs ?? task.sessionDurationMs })
    });
  } catch {
    // Best-effort — don't interrupt UX on failure
  }
}

async function openInsightPage(username) {
  try {
    const data = await apiRequest(`/api/users/${encodeURIComponent(username)}/today`, { method: "GET", headers: {} });
    renderInsightPage(data);
    openDialog(elements.insightDialog);
  } catch (error) {
    setNotice(error instanceof Error ? error.message : "Could not load insights.");
  }
}

function renderInsightPage(data) {
  elements.insightTitle.textContent = data.username;
  elements.insightFocusTime.textContent = `Focus today: ${formatFocusMs(data.todayFocusMs || 0)}`;
  elements.insightTaskList.innerHTML = "";
  const tasks = data.todayTasks || [];
  if (tasks.length === 0) {
    const li = document.createElement("li");
    li.className = "insight-task-empty";
    li.textContent = "No tasks yet today.";
    elements.insightTaskList.append(li);
    return;
  }
  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = "insight-task-item";
    const iconMap = { yes: "✓", no: "✗", forfeited: "⊘" };
    const classMap = { yes: "is-done", no: "is-fail", forfeited: "is-forfeit" };
    const icon = iconMap[task.status] || "✗";
    const iconClass = classMap[task.status] || "is-fail";
    li.innerHTML = `
      <span class="insight-task-icon ${iconClass}"></span>
      <span class="insight-task-text"></span>
      <span class="insight-task-time"></span>
    `;
    li.querySelector(".insight-task-icon").textContent = icon;
    li.querySelector(".insight-task-text").textContent = task.text;
    li.querySelector(".insight-task-time").textContent = formatFocusMs(task.focusMs || 0);
    elements.insightTaskList.append(li);
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

function formatFocusMs(ms) {
  const totalMin = Math.round(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  if (h === 0) return `${min}m`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}m`;
}

function formatRoomRemaining(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clampUnit(value) {
  return Math.min(1, Math.max(0, value));
}

function fract(value) {
  return value - Math.floor(value);
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getMusicElapsedMs() {
  if (!state.music.current?.startedAt) {
    return 0;
  }
  return Math.max(0, Date.now() + state.serverOffset - state.music.current.startedAt);
}

function getMusicVisualState(t, musicElapsedMs = getMusicElapsedMs()) {
  const current = state.music.current;
  if (!current || !t) {
    return null;
  }

  const seed = hashString(current.videoId || current.id || current.title || "music");
  const bpm = 118 + (seed % 20);
  const beat = (musicElapsedMs / 60000) * bpm;
  const mainPulse = Math.pow(1 - fract(beat), 7);
  const sidePulse = Math.pow(1 - fract(beat * 2), 9) * 0.58;
  const drift = Math.sin((musicElapsedMs / 1000) * (1.6 + (seed % 7) * 0.08) + seed * 0.0009) * 0.5 + 0.5;
  const shimmer = Math.sin((musicElapsedMs / 1000) * (3.4 + (seed % 5) * 0.14) + seed * 0.0017) * 0.5 + 0.5;
  const energy = clampUnit(0.16 + drift * 0.2 + shimmer * 0.16 + mainPulse * 0.86 + sidePulse * 0.34);
  const visibility = state.musicMuted && state.musicMuteTime > 0
    ? clampUnit(1 - (t - state.musicMuteTime) / 1400)
    : 1;

  return {
    seed,
    beat,
    energy,
    mainPulse,
    sidePulse,
    visibility,
    sweepAngle: beat * Math.PI * 0.18 + (seed % 360) * (Math.PI / 180),
    orbitAngle: beat * Math.PI * 0.34 + (seed % 180) * (Math.PI / 180)
  };
}

function drawReducedMotionMusicAura(cx, cy, radius, visual) {
  context.save();
  context.translate(cx, cy);
  context.globalAlpha = 0.08 * visual.visibility;
  context.strokeStyle = ringColors.progress || "oklch(72% 0.13 76)";
  context.lineWidth = 2.5;
  context.beginPath();
  context.arc(0, 0, radius + 24, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawMusicAura(cx, cy, radius, visual) {
  const tau = Math.PI * 2;
  const accent = ringColors.progress || "oklch(72% 0.13 76)";
  const visibility = visual.visibility;
  if (visibility <= 0.01) {
    return;
  }

  context.save();
  context.translate(cx, cy);

  context.globalAlpha = (0.08 + visual.energy * 0.12) * visibility;
  context.strokeStyle = accent;
  context.shadowBlur = 22 + visual.mainPulse * 26;
  context.shadowColor = accent;
  context.lineWidth = 8 + visual.energy * 8;
  context.beginPath();
  context.arc(0, 0, radius + 18 + visual.mainPulse * 6, 0, tau);
  context.stroke();
  context.shadowBlur = 0;

  const spokeCount = 28;
  for (let i = 0; i < spokeCount; i += 1) {
    const angle = (i / spokeCount) * tau + visual.orbitAngle * 0.45;
    const spectral = Math.sin(angle * 3.2 + visual.beat * 0.92 + visual.seed * 0.002) * 0.5 + 0.5;
    const flicker = Math.sin(visual.beat * 3.8 + i * 0.78 + visual.seed * 0.0011) * 0.5 + 0.5;
    const intensity = clampUnit((0.18 + spectral * 0.5 + flicker * 0.32) * visual.energy) * visibility;
    if (intensity < 0.05) {
      continue;
    }

    const inner = radius + 16 + (i % 2) * 4;
    const outer = inner + 8 + intensity * 32 + visual.mainPulse * 10;
    context.globalAlpha = 0.07 + intensity * 0.32;
    context.lineWidth = 1.2 + intensity * 2.4;
    context.beginPath();
    context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    context.stroke();
  }

  for (let i = 0; i < 3; i += 1) {
    const phase = fract(visual.beat * 0.5 + i * 0.24);
    const waveRadius = radius + 18 + i * 10 + phase * (18 + visual.energy * 20);
    const alpha = Math.pow(1 - phase, 2) * (0.2 - i * 0.04) * visibility;
    if (alpha <= 0.01) {
      continue;
    }

    context.globalAlpha = alpha;
    context.lineWidth = 1.4 + visual.sidePulse * 2.2;
    context.beginPath();
    context.arc(0, 0, waveRadius, 0, tau);
    context.stroke();
  }

  for (let i = 0; i < 2; i += 1) {
    const sweepStart = visual.sweepAngle + i * Math.PI + Math.sin(visual.beat * 0.5 + i) * 0.1;
    const sweepSize = 0.24 + visual.sidePulse * 0.18;
    context.globalAlpha = (0.2 + visual.mainPulse * 0.2) * visibility;
    context.lineWidth = 2 + visual.mainPulse * 2.4;
    context.beginPath();
    context.arc(0, 0, radius + 30 + i * 10, sweepStart, sweepStart + sweepSize);
    context.stroke();
  }

  const particleCount = 10;
  for (let i = 0; i < particleCount; i += 1) {
    const angle = visual.orbitAngle * 0.9 + (i / particleCount) * tau;
    const wobble = Math.sin(visual.beat * 0.8 + i + visual.seed * 0.001) * 8;
    const distance = radius + 34 + wobble + visual.sidePulse * 6;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 1 + ((i % 3) === 0 ? visual.mainPulse * 2.6 : visual.sidePulse * 1.5);
    context.globalAlpha = (0.12 + size * 0.06) * visibility;
    context.beginPath();
    context.arc(x, y, size, 0, tau);
    context.fillStyle = accent;
    context.fill();
  }

  context.restore();
}

function drawTimer(progress, t = 0, musicElapsedMs = 0) {
  const width = canvasDrawWidth;
  const height = canvasDrawHeight;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.40;
  const visual = t > 0 && state.music.current ? getMusicVisualState(t, musicElapsedMs) : null;

  context.clearRect(0, 0, width, height);

  if (visual) {
    if (prefersReducedMotion.matches) {
      drawReducedMotionMusicAura(cx, cy, radius, visual);
    } else {
      drawMusicAura(cx, cy, radius, visual);
    }
  }

  /* Ambient wave rings — shown when music is playing and not muted.
     On mute, each ring finishes its current cycle before disappearing. */
  if (false && t > 0 && state.music.current) {
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
  context.lineWidth = visual ? 4.6 + visual.visibility * 0.6 : 5;
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.stroke();

  if (progress > 0) {
    context.beginPath();
    context.strokeStyle = ringColors.progress || "oklch(72% 0.13 76)";
    context.lineWidth = visual ? 5 + visual.energy * 1.6 : 5;
    context.lineCap = "round";
    context.shadowBlur = visual && !prefersReducedMotion.matches ? 14 + visual.mainPulse * 18 : 0;
    context.shadowColor = ringColors.progress || "oklch(72% 0.13 76)";
    context.arc(0, 0, radius, 0, Math.PI * 2 * progress);
    context.stroke();
    context.shadowBlur = 0;
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
  drawTimer(getProgress(), state.music.current ? performance.now() : 0, getMusicElapsedMs());
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
/* True once YouTube reports its player has started playing (onStateChange=1). */
let youtubePlayerPlaying = false;
/* True once YouTube reports the current iframe reached the end. */
let youtubePlayerEnded = false;

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
  if (state.session !== "multi" || !state.music.current || !state.musicPanelOpen || youtubePlayerEnded) {
    return;
  }
  lastMusicKeepAliveAt = performance.now();
  const keepAliveStamp = ++musicKeepAliveScheduledAt;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    window.setTimeout(() => {
      if (keepAliveStamp !== musicKeepAliveScheduledAt) {
        return;
      }
      if (state.session !== "multi" || !state.music.current || !state.musicPanelOpen || youtubePlayerEnded) {
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

function unlockAudioPlayback() {
  if (!audioInitializedInTab) {
    audioInitializedInTab = true;
    state.audioUnlocked = true;
    sessionStorage.setItem("pmdr.audioUnlocked", "1");
  }
  if (state.session !== "multi" || !state.music.current || !state.musicPanelOpen) {
    return;
  }
  if (!getMusicIframe()) {
    syncMusicPlayer(true);
    return; // unmute will happen via onStateChange once player starts
  }
  if (youtubePlayerEnded) {
    return;
  }
  if (!state.musicMuted) {
    if (youtubePlayerPlaying) {
      postMusicCommand("unMute");
    } else {
      scheduleMusicKeepAlive({ unmute: true, attempts: 3, initialDelay: 80 });
    }
  }
}

function clearMusicPlayer() {
  state.playerKey = "";
  youtubePlayerPlaying = false;
  youtubePlayerEnded = false;
  musicKeepAliveScheduledAt += 1;
  elements.youtubePlayerHost.innerHTML = "";
  if (musicProgressRafId) { cancelAnimationFrame(musicProgressRafId); musicProgressRafId = null; }
}

function syncMusicPlayer(force = false) {
  if (state.session !== "multi" || !state.music.current) {
    clearMusicPlayer();
    return;
  }
  if (!state.musicPanelOpen) {
    clearMusicPlayer();
    return;
  }

  const current = state.music.current;
  const key = `${current.id}:${current.startedAt}`;
  if (!force && state.playerKey === key) {
    return;
  }

  youtubePlayerPlaying = false;
  youtubePlayerEnded = false;
  const resumeAtSeconds = Math.max(0, Math.floor((Date.now() + state.serverOffset - current.startedAt) / 1000));
  const iframe = document.createElement("iframe");
  iframe.width = "320";
  iframe.height = "320";
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(current.videoId)}?autoplay=1&controls=1&start=${resumeAtSeconds}&playsinline=1&modestbranding=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&mute=1`;
  iframe.title = "YouTube music player";
  iframe.frameBorder = "0";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  elements.youtubePlayerHost.replaceChildren(iframe);
  state.playerKey = key;
}

function formatMusicSeconds(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

let musicProgressRafId = null;

function tickMusicProgress() {
  if (musicProgressRafId) cancelAnimationFrame(musicProgressRafId);
  const current = state.music.current;
  if (!current) return;
  const elapsed = Math.max(0, (Date.now() + state.serverOffset - current.startedAt) / 1000);
  const duration = current.durationSeconds || 1;
  const pct = Math.min(1, elapsed / duration);
  elements.musicProgressFill.style.width = `${pct * 100}%`;
  elements.musicProgressElapsed.textContent = formatMusicSeconds(elapsed);
  if (pct < 1) {
    musicProgressRafId = requestAnimationFrame(tickMusicProgress);
  }
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

  elements.finishEarlyButton.hidden = !(
    state.timer.mode === "focus" &&
    state.timer.status === "running" &&
    Boolean(state.activeTask)
  );

  elements.settingsKicker.textContent = state.session === "solo" ? "Solo" : state.isHost ? "Host" : "Viewer";
  renderViewerBadge();
  renderStatusComposer();
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

function renderStatusComposer(forceValue = false) {
  if (!elements.statusInput || !elements.statusSubmitButton || !elements.statusLockText) {
    return;
  }

  const isMulti = state.session === "multi" && Boolean(state.user);
  const remaining = Math.max(0, state.statusCooldownUntil - Date.now());
  const isLocked = isMulti && remaining > 0;

  if (forceValue || document.activeElement !== elements.statusInput || isLocked) {
    elements.statusInput.value = state.statusText;
  }

  elements.statusInput.disabled = !isMulti || isLocked;
  elements.statusInput.placeholder = isMulti ? "What are you doing right now?" : "Join a room to share your status";
  const draft = normalizeStatusText(elements.statusInput.value);
  elements.statusSubmitButton.disabled = !isMulti || isLocked || !draft || draft === state.statusText;
  elements.statusSubmitButton.textContent = isLocked ? formatCooldown(remaining) : "Update";
  elements.statusLockText.textContent = !isMulti
    ? ""
    : isLocked
      ? `Next update in ${formatCooldown(remaining)}`
      : state.statusText
        ? "Updating locks for 10 minutes."
        : "Share what you're doing now.";
  elements.statusLockText.classList.toggle("is-locked", isLocked);
}

function renderParticipants() {
  if (!elements.participantsBar) return;
  elements.participantsBar.innerHTML = "";
  if (state.session !== "multi") return;

  for (const participant of state.participants) {
    const chip = document.createElement("div");
    chip.className = `participant-chip${participant.isHost ? " is-host" : ""}`;

    const dot = document.createElement("span");
    dot.className = "participant-dot";
    dot.style.setProperty("--avatar", LEGACY_COLORS[participant.color] || participant.color || DEFAULT_COLOR);

    const meta = document.createElement("div");
    meta.className = "participant-meta";

    const name = document.createElement("span");
    name.className = "participant-name";
    const isMe = participant.username && participant.username === state.user?.username;
    const hostTag = participant.isHost ? " (HOST)" : "";
    const youTag = isMe ? " (YOU)" : "";
    name.textContent = `${participant.name}${hostTag}${youTag}`;

    meta.append(name);

    if (participant.statusText) {
      const status = document.createElement("span");
      status.className = "participant-doing";
      status.textContent = `${participant.statusText} 하는 중`;
      meta.append(status);
    }

    chip.append(dot, meta);
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

function isSaved(videoId) {
  return state.savedMusic.some(t => t.videoId === videoId);
}

function toggleSavedTrack(track) {
  const idx = state.savedMusic.findIndex(t => t.videoId === track.videoId);
  if (idx >= 0) {
    state.savedMusic.splice(idx, 1);
  } else {
    state.savedMusic.push({
      videoId: track.videoId,
      title: track.title,
      channelTitle: track.channelTitle,
      thumbnail: track.thumbnail,
      durationText: track.durationText,
      durationSeconds: track.durationSeconds
    });
  }
  localStorage.setItem(STORAGE_KEYS.savedMusic, JSON.stringify(state.savedMusic));
  renderMusic();
}

function renderMusic() {
  const current = state.music.current;
  if (current) {
    elements.musicHeartButton.hidden = false;
    elements.musicHeartButton.classList.toggle("is-saved", isSaved(current.videoId));
    elements.musicHeartButton.title = isSaved(current.videoId) ? "Unsave" : "Save";
  } else {
    elements.musicHeartButton.hidden = true;
  }

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

  elements.musicProgress.hidden = !current;
  if (current) {
    elements.musicProgressTotal.textContent = formatMusicSeconds(current.durationSeconds);
    tickMusicProgress();
  }

  const queueTotalSeconds = state.music.queue.reduce((s, t) => s + (t.durationSeconds || 0), 0);
  if (current && queueTotalSeconds > 0) {
    elements.musicQueueRemaining.hidden = false;
    elements.musicQueueRemaining.textContent = `${state.music.queue.length} more track${state.music.queue.length !== 1 ? "s" : ""} · ${formatMusicSeconds(queueTotalSeconds)} queued`;
  } else {
    elements.musicQueueRemaining.hidden = true;
  }

  elements.musicSearchModeSearch.classList.toggle("is-active", state.musicSearchMode === "search");
  elements.musicSearchModeSaved.classList.toggle("is-active", state.musicSearchMode === "saved");
  elements.musicSearchForm.hidden = state.musicSearchMode === "saved";

  const resultsToShow = state.musicSearchMode === "saved" ? state.savedMusic : state.musicResults;
  elements.musicResults.innerHTML = "";
  for (const result of resultsToShow) {
    const item = document.createElement("li");
    item.className = "music-result";
    item.innerHTML = `
      <img class="music-thumb" alt="" loading="lazy" />
      <div>
        <div class="music-title"></div>
        <div class="music-meta"></div>
      </div>
      <div class="music-result-actions">
        <button class="icon-button music-heart-button" type="button" aria-label="Save track">♥</button>
        <button class="icon-button music-add-button" type="button">Add</button>
      </div>
    `;
    item.querySelector(".music-thumb").src = result.thumbnail;
    item.querySelector(".music-title").textContent = result.title;
    item.querySelector(".music-meta").textContent = `${result.channelTitle} - ${result.durationText}`;
    const heartBtn = item.querySelector(".music-heart-button");
    heartBtn.classList.toggle("is-saved", isSaved(result.videoId));
    heartBtn.addEventListener("click", () => toggleSavedTrack(result));
    item.querySelector(".music-add-button").addEventListener("click", () => {
      send({ type: "music", action: "add", track: result });
    });
    elements.musicResults.append(item);
  }
  if (state.musicSearchMode === "saved") {
    setMusicMessage(state.savedMusic.length === 0 ? "No saved tracks. Heart a track to save it." : "");
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

    const queueHeartBtn = document.createElement("button");
    queueHeartBtn.className = "icon-button music-heart-button";
    queueHeartBtn.type = "button";
    queueHeartBtn.setAttribute("aria-label", "Save track");
    queueHeartBtn.textContent = "♥";
    queueHeartBtn.classList.toggle("is-saved", isSaved(track.videoId));
    queueHeartBtn.addEventListener("click", () => toggleSavedTrack(track));
    item.querySelector(".queue-item-actions").append(queueHeartBtn);

    elements.musicQueue.append(item);
  }
}

let lastKnownMode = null;
let lastKnownStatus = null;

function applySnapshot(payload) {
  const prevMode = lastKnownMode;
  const prevStatus = lastKnownStatus;
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
  state.statusText = normalizeStatusText(payload.viewer?.statusText || "");
  state.statusCooldownUntil = Number(payload.viewer?.statusCooldownUntil || 0);
  state.pendingRoomSetup = null;
  if (elements.roomCodeButton) {
    elements.roomCodeButton.textContent = payload.room;
    elements.roomCodeButton.hidden = false;
  }

  lastKnownMode = state.timer.mode;
  lastKnownStatus = state.timer.status;
  if (prevMode !== null && prevMode !== state.timer.mode) playBell();

  state.focusTasks = payload.focusTasks || [];
  state.sessionVotes = payload.sessionVotes || [];

  const focusSessionEnded = prevMode === "focus" && prevStatus === "running" && state.timer.mode !== "focus";
  const newFocusSessionStarted = prevMode !== null && prevMode !== "focus" && state.timer.mode === "focus";

  if (focusSessionEnded && state.session === "multi") {
    state.sessionVoteSubmitted = false;
    elements.sessionCompleteGoal.textContent = state.statusText ? `"${state.statusText}"` : "";
    openDialog(elements.sessionCompleteDialog);
  }
  if (newFocusSessionStarted) {
    closeDialog(elements.sessionCompleteDialog);
    state.sessionVoteSubmitted = false;
  }

  updateControls();
  applyTimerToUI();
  renderStatusComposer(true);
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
  renderSessionVotes();
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
    } else if (payload.type === "session-replaced") {
      const message = payload.text || "This room session continued in another tab.";
      if (state.socket === socket) {
        state.socket = null;
      }
      clearMusicPlayer();
      goHome();
      elements.newGroupMessage.textContent = message;
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
  state.focusTasks = [{
    username: state.user?.username || "me",
    name: state.name,
    color: state.color,
    task: localStorage.getItem(STORAGE_KEYS.focusTask) || ""
  }];
  state.statusText = "";
  state.statusCooldownUntil = 0;
  setMusicMessage("");
  updateUrl();
  showTimerApp();
  updateControls();
  applyTimerToUI();
  renderStatusComposer(true);
  renderParticipants();
  renderHistory();
  renderChat();
  renderMusic();
}

async function joinRoom(room) {
  try {
    await apiRequest(`/api/rooms/${encodeURIComponent(room)}`, { method: "GET" });
  } catch {
    showModePanel();
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
  state.focusTasks = [];
  state.statusText = "";
  state.statusCooldownUntil = 0;
  setMusicMessage("");
  elements.roomCodeButton.textContent = nextRoom;
  elements.roomCodeButton.hidden = false;
  updateUrl(nextRoom);
  showTimerApp();
  updateControls();
  applyTimerToUI();
  renderStatusComposer(true);
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
  elements.roomCodeButton.hidden = true;
  state.room = "";
  state.pendingRoomSetup = null;
  state.currentSubjectId = null;
  state.isHost = false;
  state.serverOffset = 0;
  state.timer = createTimerState();
  state.participants = [];
  state.history = [];
  state.chat = [];
  state.music = { current: null, queue: [], maxPerUser: 5 };
  state.musicResults = [];
  state.focusTasks = [];
  state.statusText = "";
  state.statusCooldownUntil = 0;
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
  const params = new URLSearchParams(window.location.search);
  const groupFromUrl = String(params.get("joinGroup") || "").trim();
  state.pendingGroupFromUrl = groupFromUrl;

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

    if (state.pendingGroupFromUrl) {
      await handlePendingGroupJoin();
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

async function handlePendingGroupJoin() {
  const groupId = state.pendingGroupFromUrl;
  state.pendingGroupFromUrl = "";
  try {
    await apiRequest(`/api/groups/${encodeURIComponent(groupId)}/join`, { method: "POST" });
    const data = await apiRequest(`/api/groups/${encodeURIComponent(groupId)}`, { method: "GET" });
    state.currentGroup = data.group;
    showGroupApp();
    renderGroupPage(data);
    history.replaceState({}, "", window.location.pathname);
  } catch {
    showModePanel();
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

    if (state.pendingGroupFromUrl) {
      await handlePendingGroupJoin();
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
    if (open) {
      syncMusicPlayer(true);
      tickMusicProgress();
    } else {
      clearMusicPlayer();
    }
  } else {
    state.chatPanelOpen = open;
    elements.chatPanel.classList.toggle("panel-closed", !open);
  }
}

function renderSessionVotes() {
  if (!elements.sessionVoteList) return;
  const isBreak = state.session === "multi" && state.timer.mode !== "focus";
  const hasVotes = state.sessionVotes.length > 0;
  const show = isBreak || hasVotes;
  elements.sessionVoteList.hidden = !show;
  if (!show) return;

  const voteMap = new Map(state.sessionVotes.map((v) => [v.username, v]));
  elements.sessionVoteList.innerHTML = "";

  for (const p of state.participants) {
    const li = document.createElement("li");
    li.className = "session-vote-item";
    li.title = `View ${p.name}'s insights`;
    li.addEventListener("click", () => openInsightPage(p.username));

    const dot = document.createElement("span");
    dot.className = "session-vote-dot";
    dot.style.background = p.color || "var(--surface-strong)";

    const name = document.createElement("span");
    name.className = "session-vote-name";
    name.textContent = p.name;

    const badge = document.createElement("span");
    const vote = voteMap.get(p.username);
    if (vote) {
      const voteClass = vote.vote === "yes" ? "is-yes" : vote.vote === "forfeited" ? "is-forfeit" : "is-no";
      const voteText = vote.vote === "yes" ? "✓ Done" : vote.vote === "forfeited" ? "⊘ Forfeit" : "✗ Not yet";
      badge.className = `session-vote-badge ${voteClass}`;
      badge.textContent = voteText;
    } else {
      badge.className = "session-vote-badge is-pending";
      badge.textContent = "…";
    }

    li.append(dot, name, badge);
    elements.sessionVoteList.append(li);
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
  bindMaterialEvents();
  elements.loginTabButton.addEventListener("click", () => setAuthMode("login"));
  elements.signupTabButton.addEventListener("click", () => setAuthMode("signup"));
  elements.authForm.addEventListener("submit", handleAuthSubmit);
  elements.entryLogoutButton.addEventListener("click", logout);

  elements.groupBackButton.addEventListener("click", () => {
    if (state.currentSubjectId) {
      closeSubjectDetail();
      return;
    }
    state.currentGroup = null;
    showModePanel();
  });

  elements.groupInviteButton.addEventListener("click", () => {
    if (!state.currentGroup) return;
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("joinGroup", state.currentGroup.id);
    navigator.clipboard.writeText(url.toString()).then(() => {
      elements.groupInviteButton.textContent = "Copied!";
      setTimeout(() => { elements.groupInviteButton.textContent = "Copy invite"; }, 2000);
    });
  });

  elements.groupCreateRoomButton.addEventListener("click", () => {
    if (!state.currentGroup) return;
    state.createRoomGroupId = state.currentGroup.id;
    prepareCreateRoomDialog();
    openDialog(elements.createRoomDialog);
  });

  elements.newGroupButton.addEventListener("click", () => {
    elements.newGroupForm.hidden = !elements.newGroupForm.hidden;
    if (!elements.newGroupForm.hidden) elements.newGroupInput.focus();
  });

  elements.newGroupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = elements.newGroupInput.value.trim();
    if (!name) return;
    elements.newGroupMessage.textContent = "";
    try {
      const data = await apiRequest("/api/groups", { method: "POST", body: JSON.stringify({ name }) });
      state.groups.push(data.group);
      elements.newGroupInput.value = "";
      elements.newGroupForm.hidden = true;
      renderGroupsList();
    } catch (error) {
      elements.newGroupMessage.textContent = error.message || "Could not create group.";
    }
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
          groupId: state.createRoomGroupId,
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
    state.createRoomGroupId = null;
    closeDialog(elements.createRoomDialog);
    startMulti(room, { durations });
  });

  elements.closeCreateRoomButton.addEventListener("click", () => closeDialog(elements.createRoomDialog));
  bindDialogBackdrop(elements.createRoomDialog, () => closeDialog(elements.createRoomDialog));

  elements.settingsButton.addEventListener("click", () => openDialog(elements.settingsDialog));
  elements.closeSettingsButton.addEventListener("click", () => closeDialog(elements.settingsDialog));
  elements.settingsLogoutButton.addEventListener("click", logout);
  bindDialogBackdrop(elements.settingsDialog, () => closeDialog(elements.settingsDialog));

  elements.homeButton.addEventListener("click", goHome);

  elements.closeMusicButton.addEventListener("click", () => setPanelOpen("music", false));
  elements.closeChatButton.addEventListener("click", () => setPanelOpen("chat", false));
  elements.openMusicButton.addEventListener("click", () => setPanelOpen("music", true));
  elements.openChatButton.addEventListener("click", () => setPanelOpen("chat", true));
  elements.musicMuteButton.addEventListener("click", () => setMusicMuted(!state.musicMuted));

  elements.startPauseButton.addEventListener("click", () => {
    if (state.timer.status !== "running" && state.timer.mode === "focus") {
      const current = state.statusText || localStorage.getItem(STORAGE_KEYS.focusTask) || "";
      elements.sessionGoalInput.value = current;
      openDialog(elements.sessionGoalDialog);
      requestAnimationFrame(() => {
        elements.sessionGoalInput.select();
        elements.sessionGoalInput.focus();
      });
    } else {
      sendTimerCommand(state.timer.status === "running" ? "pause" : "start");
    }
  });

  elements.sessionGoalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = normalizeStatusText(elements.sessionGoalInput.value);
    if (!goal) {
      elements.sessionGoalInput.focus();
      return;
    }
    localStorage.setItem(STORAGE_KEYS.focusTask, goal);
    state.activeTask = { text: goal, startedAt: Date.now(), sessionDurationMs: state.timer.durations.focus };
    if (state.session === "multi") {
      send({ type: "status", text: goal });
      state.statusText = goal;
      renderStatusComposer();
    }
    closeDialog(elements.sessionGoalDialog);
    sendTimerCommand("start");
  });

  bindDialogBackdrop(elements.sessionGoalDialog, () => closeDialog(elements.sessionGoalDialog));

  async function submitSessionVote(vote) {
    if (state.sessionVoteSubmitted) return;
    state.sessionVoteSubmitted = true;
    send({ type: "session-vote", vote });
    const focusMs = state.activeTask ? state.activeTask.sessionDurationMs : (state.timer.durations.focus);
    await resolveTask(vote, focusMs);
    closeDialog(elements.sessionCompleteDialog);
  }
  elements.sessionCompleteYes.addEventListener("click", () => submitSessionVote("yes"));
  elements.sessionCompleteNo.addEventListener("click", () => submitSessionVote("no"));
  elements.sessionCompleteForfeit.addEventListener("click", () => submitSessionVote("forfeited"));

  elements.finishEarlyButton.addEventListener("click", () => {
    if (!state.activeTask) return;
    elements.finishEarlyInput.value = "";
    openDialog(elements.finishEarlyDialog);
    requestAnimationFrame(() => elements.finishEarlyInput.focus());
  });

  elements.finishEarlyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newTask = normalizeStatusText(elements.finishEarlyInput.value);
    if (!newTask) { elements.finishEarlyInput.focus(); return; }
    const elapsed = state.activeTask ? Math.min(Date.now() - state.activeTask.startedAt, state.activeTask.sessionDurationMs) : 0;
    await resolveTask("yes", elapsed);
    closeDialog(elements.finishEarlyDialog);
    state.activeTask = { text: newTask, startedAt: Date.now(), sessionDurationMs: state.timer.durations.focus };
    localStorage.setItem(STORAGE_KEYS.focusTask, newTask);
    if (state.session === "multi") {
      send({ type: "status", text: newTask });
      state.statusText = newTask;
      renderStatusComposer();
    }
    updateControls();
  });

  elements.finishEarlyStop.addEventListener("click", async () => {
    const elapsed = state.activeTask ? Math.min(Date.now() - state.activeTask.startedAt, state.activeTask.sessionDurationMs) : 0;
    await resolveTask("yes", elapsed);
    closeDialog(elements.finishEarlyDialog);
    updateControls();
  });

  bindDialogBackdrop(elements.finishEarlyDialog, () => closeDialog(elements.finishEarlyDialog));

  elements.closeInsightButton.addEventListener("click", () => closeDialog(elements.insightDialog));
  bindDialogBackdrop(elements.insightDialog, () => closeDialog(elements.insightDialog));
  elements.closePdfPreviewButton.addEventListener("click", closePdfPreview);
  elements.pdfDownloadButton.addEventListener("click", () => {
    if (state.pdfPreviewDownload) {
      downloadFile(state.pdfPreviewDownload.subjectId, state.pdfPreviewDownload.fileId);
    }
  });
  bindDialogBackdrop(elements.pdfPreviewDialog, closePdfPreview);

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

  elements.statusForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.session !== "multi") {
      return;
    }
    const text = normalizeStatusText(elements.statusInput.value);
    const remaining = Math.max(0, state.statusCooldownUntil - Date.now());
    if (!text || remaining > 0 || text === state.statusText) {
      renderStatusComposer();
      return;
    }
    send({ type: "status", text });
    state.statusText = text;
    state.statusCooldownUntil = Date.now() + STATUS_UPDATE_COOLDOWN_MS;
    renderStatusComposer(true);
  });
  elements.statusInput.addEventListener("input", () => renderStatusComposer());
  elements.statusInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      elements.statusForm.requestSubmit();
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

  elements.musicHeartButton.addEventListener("click", () => {
    if (state.music.current) toggleSavedTrack(state.music.current);
  });
  elements.musicSearchModeSearch.addEventListener("click", () => {
    state.musicSearchMode = "search";
    setMusicMessage("");
    renderMusic();
  });
  elements.musicSearchModeSaved.addEventListener("click", () => {
    state.musicSearchMode = "saved";
    renderMusic();
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

  // Receive YouTube player state events. onStateChange fires once the player has
  // finished its initial seek and is truly playing (state=1), making it the right
  // moment to unmute — avoids the old approach of firing unMute 240-520ms after
  // iframe load, which could arrive before the seek to `start=X` completed.
  window.addEventListener("message", (event) => {
    if (!event.origin.includes("youtube.com")) return;
    let data;
    try { data = JSON.parse(event.data); } catch { return; }
    if (data.event !== "onStateChange") return;
    if (data.info === 1) { // YT.PlayerState.PLAYING
      youtubePlayerPlaying = true;
      youtubePlayerEnded = false;
      if (audioInitializedInTab && !state.musicMuted) {
        postMusicCommand("unMute");
      }
    } else if (data.info === 0) { // ended
      youtubePlayerPlaying = false;
      youtubePlayerEnded = true;
      musicKeepAliveScheduledAt += 1;
    } else if (data.info === 2) { // paused
      youtubePlayerPlaying = false;
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.music.current && state.musicPanelOpen) {
      if (!getMusicIframe()) {
        syncMusicPlayer(true);
      } else if (youtubePlayerEnded) {
        return;
      } else if (youtubePlayerPlaying && audioInitializedInTab && !state.musicMuted) {
        postMusicCommand("unMute");
      } else if (!youtubePlayerEnded) {
        scheduleMusicKeepAlive({
          unmute: audioInitializedInTab && !state.musicMuted,
          attempts: 4,
          initialDelay: 60
        });
      }
    }
  });
  window.addEventListener("pageshow", () => {
    if (state.music.current && state.musicPanelOpen) {
      if (!getMusicIframe()) {
        syncMusicPlayer(true);
      } else {
        scheduleMusicKeepAlive({
          unmute: audioInitializedInTab && !state.musicMuted,
          attempts: 4,
          initialDelay: 60
        });
      }
    }
  });
  window.addEventListener("resize", scheduleResize);
}

// ─── Shared Material helpers ─────────────────────────────────────────────────

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function fileIcon(mimeType) {
  if (!mimeType) return "📄";
  if (mimeType.startsWith("image/")) return "🖼";
  if (mimeType === "application/pdf") return "📕";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "📑";
  if (mimeType.startsWith("text/")) return "📄";
  return "📎";
}

function subjectIconMarkup(name) {
  const key = String(name || "").toLowerCase();
  if (key.includes("physics")) {
    return `<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><ellipse cx="9" cy="9" rx="7" ry="2.8"/><ellipse cx="9" cy="9" rx="7" ry="2.8" transform="rotate(60 9 9)"/><ellipse cx="9" cy="9" rx="7" ry="2.8" transform="rotate(120 9 9)"/><circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none"/></svg>`;
  }
  if (key.includes("chem")) {
    return `<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 2v5.5L3 14.5a1 1 0 0 0 .9 1.5h10.2a1 1 0 0 0 .9-1.5l-3.5-7V2"/><path d="M5.5 2h7"/><circle cx="8" cy="12" r=".8" fill="currentColor" stroke="none"/></svg>`;
  }
  if (key.includes("math")) {
    return `<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3H5l5 6-5 6h8"/></svg>`;
  }
  if (key.includes("note")) {
    return `<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="12" height="14" rx="2"/><path d="M6 6h6M6 9h6M6 12h3"/></svg>`;
  }
  return `<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="5" cy="5" r="1.4"/><circle cx="9" cy="5" r="1.4"/><circle cx="13" cy="5" r="1.4"/><circle cx="5" cy="9" r="1.4"/><circle cx="9" cy="9" r="1.4"/><circle cx="13" cy="9" r="1.4"/><circle cx="5" cy="13" r="1.4"/><circle cx="9" cy="13" r="1.4"/><circle cx="13" cy="13" r="1.4"/></svg>`;
}

function getAllFiles() {
  const files = [];
  for (const subject of state.groupMaterials) {
    const folders = subject.folders || [];
    for (const file of subject.files || []) {
      const folder = file.folderId ? folders.find((f) => f.id === file.folderId) : null;
      files.push({ ...file, subjectId: subject.id, subjectName: subject.name, folderName: folder?.name || "" });
    }
  }
  return files;
}

function materialFileUrl(subjectId, fileId, action = "download") {
  if (!state.currentGroup) return "";
  return `/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/files/${encodeURIComponent(fileId)}/${action}`;
}

function downloadFile(subjectId, fileId) {
  if (!state.currentGroup) return;
  const url = materialFileUrl(subjectId, fileId, "download");
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", "");
  a.style.display = "none";
  document.body.appendChild(a);
  const headers = state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {};
  fetch(url, { headers }).then((res) => {
    if (!res.ok) return;
    return res.blob().then((blob) => {
      const objUrl = URL.createObjectURL(blob);
      a.href = objUrl;
      a.click();
      setTimeout(() => { URL.revokeObjectURL(objUrl); a.remove(); }, 2000);
    });
  }).catch(() => a.remove());
}

function closePdfPreview() {
  if (!elements.pdfPreviewDialog) return;
  if (elements.pdfPreviewDialog.open) elements.pdfPreviewDialog.close();
  elements.pdfPreviewFrame.removeAttribute("src");
  if (state.pdfPreviewObjectUrl) {
    URL.revokeObjectURL(state.pdfPreviewObjectUrl);
  }
  state.pdfPreviewObjectUrl = "";
  state.pdfPreviewDownload = null;
}

async function previewPdf(subjectId, file) {
  const url = materialFileUrl(subjectId, file.id, "view");
  const response = await fetch(url, { headers: authHeaders() });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Could not open PDF.");
  }
  closePdfPreview();
  const blob = await response.blob();
  state.pdfPreviewObjectUrl = URL.createObjectURL(blob);
  state.pdfPreviewDownload = { subjectId, fileId: file.id };
  elements.pdfPreviewTitle.textContent = file.name;
  elements.pdfPreviewFrame.src = state.pdfPreviewObjectUrl;
  openDialog(elements.pdfPreviewDialog);
}

function openFile(subjectId, file) {
  if (file.mimeType === "application/pdf") {
    previewPdf(subjectId, file).catch((err) => alert(err.message || "Could not open PDF."));
    return;
  }
  downloadFile(subjectId, file.id);
}

function openSubjectDetail(subjectId) {
  state.currentSubjectId = subjectId;
  elements.groupBodyRooms.hidden = true;
  elements.subjectDetailView.hidden = false;
  renderMaterials();
  renderThreads();
}

function closeSubjectDetail() {
  state.currentSubjectId = null;
  elements.subjectDetailView.hidden = true;
  elements.groupBodyRooms.hidden = false;
  hideMentionDropdown();
  renderMaterials();
}

async function fetchGroupMaterials() {
  if (!state.currentGroup) return;
  try {
    const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials`);
    state.groupMaterials = data.materials || [];
  } catch {
    state.groupMaterials = [];
  }
  renderMaterials();
}

async function fetchGroupThreads() {
  if (!state.currentGroup) return;
  try {
    const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/threads`);
    state.groupThreads = data.threads || [];
  } catch {
    state.groupThreads = [];
  }
  renderThreads();
}

async function addSubject(name) {
  if (!state.currentGroup) return;
  const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials`, {
    method: "POST",
    body: JSON.stringify({ name })
  });
  state.groupMaterials.push(data.subject);
  renderMaterials();
}

async function renameSubject(subjectId, name) {
  if (!state.currentGroup) return;
  const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}`, {
    method: "PATCH",
    body: JSON.stringify({ name })
  });
  const idx = state.groupMaterials.findIndex((s) => s.id === subjectId);
  if (idx !== -1) state.groupMaterials[idx] = data.subject;
  renderMaterials();
}

async function deleteSubject(subjectId) {
  if (!state.currentGroup) return;
  await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}`, { method: "DELETE" });
  state.groupMaterials = state.groupMaterials.filter((s) => s.id !== subjectId);
  renderMaterials();
  renderThreads();
}

async function addFolder(subjectId, name) {
  if (!state.currentGroup) return;
  const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/folders`, {
    method: "POST",
    body: JSON.stringify({ name })
  });
  const subject = state.groupMaterials.find((s) => s.id === subjectId);
  if (subject) {
    subject.folders = subject.folders || [];
    subject.folders.push(data.folder);
  }
  renderMaterials();
}

async function renameFolder(subjectId, folderId, name) {
  if (!state.currentGroup) return;
  const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/folders/${encodeURIComponent(folderId)}`, {
    method: "PATCH",
    body: JSON.stringify({ name })
  });
  const subject = state.groupMaterials.find((s) => s.id === subjectId);
  const idx = subject?.folders?.findIndex((f) => f.id === folderId) ?? -1;
  if (idx !== -1) subject.folders[idx] = data.folder;
  renderMaterials();
}

async function deleteFolder(subjectId, folderId) {
  if (!state.currentGroup) return;
  if (folderId === DEFAULT_FILES_FOLDER_ID) return;
  await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/folders/${encodeURIComponent(folderId)}`, { method: "DELETE" });
  const subject = state.groupMaterials.find((s) => s.id === subjectId);
  if (subject) {
    subject.folders = (subject.folders || []).filter((f) => f.id !== folderId);
    for (const file of subject.files || []) {
      if (file.folderId === folderId) file.folderId = DEFAULT_FILES_FOLDER_ID;
    }
  }
  renderMaterials();
  renderThreads();
}

async function uploadFileToSubject(subjectId, file, folderId = null) {
  if (!state.currentGroup) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];
    try {
      const data = await apiRequest(
        `/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/files`,
        { method: "POST", body: JSON.stringify({ name: file.name, mimeType: file.type || "application/octet-stream", folderId, data: base64 }) }
      );
      const subject = state.groupMaterials.find((s) => s.id === subjectId);
      if (subject) { subject.files = subject.files || []; subject.files.push(data.file); }
      renderMaterials();
    } catch (err) {
      alert(err.message || "Upload failed.");
    }
  };
}

async function renameFile(subjectId, fileId, name) {
  if (!state.currentGroup) return;
  const data = await apiRequest(
    `/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/files/${encodeURIComponent(fileId)}`,
    { method: "PATCH", body: JSON.stringify({ name }) }
  );
  const subject = state.groupMaterials.find((s) => s.id === subjectId);
  const idx = subject?.files?.findIndex((f) => f.id === fileId) ?? -1;
  if (idx !== -1) subject.files[idx] = data.file;
  renderMaterials();
  renderThreads();
}

async function moveFile(subjectId, fileId, folderId) {
  if (!state.currentGroup) return;
  const subject = state.groupMaterials.find((s) => s.id === subjectId);
  const file = subject?.files?.find((f) => f.id === fileId);
  if (!file) return;
  const data = await apiRequest(
    `/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/files/${encodeURIComponent(fileId)}`,
    { method: "PATCH", body: JSON.stringify({ name: file.name, folderId }) }
  );
  Object.assign(file, data.file);
  renderMaterials();
  renderThreads();
}

async function deleteFileFromSubject(subjectId, fileId) {
  if (!state.currentGroup) return;
  await apiRequest(
    `/api/groups/${encodeURIComponent(state.currentGroup.id)}/materials/${encodeURIComponent(subjectId)}/files/${encodeURIComponent(fileId)}`,
    { method: "DELETE" }
  );
  const subject = state.groupMaterials.find((s) => s.id === subjectId);
  if (subject) subject.files = (subject.files || []).filter((f) => f.id !== fileId);
  renderMaterials();
}

async function postThread(text, mentionedFileIds) {
  if (!state.currentGroup) return;
  const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/threads`, {
    method: "POST",
    body: JSON.stringify({ text, mentionedFileIds })
  });
  state.groupThreads.unshift(data.thread);
  renderThreads();
}

async function replyToThread(threadId, text) {
  if (!state.currentGroup) return;
  const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/threads/${encodeURIComponent(threadId)}/replies`, {
    method: "POST",
    body: JSON.stringify({ text })
  });
  const thread = state.groupThreads.find((t) => t.id === threadId);
  if (thread) thread.replies.push(data.reply);
  state.openReplyThreadId = null;
  renderThreads();
}

async function toggleResolveThread(threadId) {
  if (!state.currentGroup) return;
  const data = await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/threads/${encodeURIComponent(threadId)}`, { method: "PATCH" });
  const idx = state.groupThreads.findIndex((t) => t.id === threadId);
  if (idx !== -1) state.groupThreads[idx] = data.thread;
  renderThreads();
}

async function deleteThread(threadId) {
  if (!state.currentGroup) return;
  await apiRequest(`/api/groups/${encodeURIComponent(state.currentGroup.id)}/threads/${encodeURIComponent(threadId)}`, { method: "DELETE" });
  state.groupThreads = state.groupThreads.filter((t) => t.id !== threadId);
  renderThreads();
}

// Render @mention syntax: @[name](fileId) → clickable button
function renderTextWithMentions(text) {
  const fragment = document.createDocumentFragment();
  const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const [, name, fileId] = match;
    const allFiles = getAllFiles();
    const fileInfo = allFiles.find((f) => f.id === fileId);
    const btn = document.createElement("button");
    btn.className = "thread-mention";
    btn.type = "button";
    btn.textContent = `@${name}`;
    if (fileInfo) {
      btn.title = `Download ${name}`;
      btn.addEventListener("click", () => downloadFile(fileInfo.subjectId, fileId));
    } else {
      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.title = "File no longer available";
    }
    fragment.appendChild(btn);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  return fragment;
}

function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" });
}

function renderSubjectTiles() {
  if (!elements.subjectTilesList) return;
  elements.subjectTilesList.innerHTML = "";
  if (state.groupMaterials.length === 0) {
    const empty = document.createElement("li");
    empty.className = "subjects-empty";
    empty.textContent = "No subjects yet. Add Physics, Chemistry, Notes, or any class your group uses.";
    elements.subjectTilesList.append(empty);
    return;
  }
  for (const subject of state.groupMaterials) {
    subject.folders = subject.folders || [];
    subject.files = subject.files || [];
    const tile = document.createElement("li");
    tile.className = "subject-tile";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "subject-tile-button";
    button.innerHTML = `
      <span class="subject-tile-icon">${subjectIconMarkup(subject.name)}</span>
      <span class="subject-tile-name"></span>
      <span class="subject-tile-meta"></span>
    `;
    button.querySelector(".subject-tile-name").textContent = subject.name;
    button.querySelector(".subject-tile-meta").textContent = `${subject.files.length} file${subject.files.length !== 1 ? "s" : ""} · ${subject.folders.length} folder${subject.folders.length !== 1 ? "s" : ""}`;
    button.addEventListener("click", () => openSubjectDetail(subject.id));
    tile.append(button);
    elements.subjectTilesList.append(tile);
  }
}

function createFileRow(subject, file) {
  const fileItem = document.createElement("li");
  fileItem.className = "subject-file-item";

  const icon = document.createElement("span");
  icon.className = "subject-file-icon";
  icon.textContent = fileIcon(file.mimeType);

  const info = document.createElement("div");
  info.className = "subject-file-info";
  const nameBtn = document.createElement("button");
  nameBtn.className = "subject-file-name";
  nameBtn.type = "button";
  nameBtn.textContent = file.name;
  nameBtn.title = file.mimeType === "application/pdf" ? `Preview ${file.name}` : `Download ${file.name}`;
  nameBtn.addEventListener("click", () => openFile(subject.id, file));

  const fileMeta = document.createElement("span");
  fileMeta.className = "subject-file-meta";
  const uploaded = file.uploadedAt ? formatRelativeTime(file.uploadedAt) : "unknown date";
  fileMeta.textContent = `${formatFileSize(file.size)} · uploaded by ${file.uploadedBy || "unknown"} · ${uploaded}`;
  info.append(nameBtn, fileMeta);

  const renameFileBtn = document.createElement("button");
  renameFileBtn.type = "button";
  renameFileBtn.className = "icon-button subject-file-action";
  renameFileBtn.textContent = "Rename";
  renameFileBtn.addEventListener("click", async () => {
    const name = prompt("File name", file.name);
    if (!name?.trim() || name.trim() === file.name) return;
    try { await renameFile(subject.id, file.id, name.trim()); } catch (err) { alert(err.message || "Could not rename file."); }
  });

  const downloadBtn = document.createElement("button");
  downloadBtn.type = "button";
  downloadBtn.className = "icon-button subject-file-action";
  downloadBtn.textContent = file.mimeType === "application/pdf" ? "Download" : "Open";
  downloadBtn.addEventListener("click", () => downloadFile(subject.id, file.id));

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "icon-button subject-file-delete";
  delBtn.textContent = "Delete";
  delBtn.title = "Delete file";
  delBtn.addEventListener("click", async () => {
    try { await deleteFileFromSubject(subject.id, file.id); } catch (err) { alert(err.message || "Failed."); }
  });

  fileItem.append(icon, info, renameFileBtn, downloadBtn, delBtn);
  return fileItem;
}

function renderSubjectDetail() {
  if (!elements.subjectsList) return;
  const subject = state.groupMaterials.find((s) => s.id === state.currentSubjectId);
  elements.subjectsList.innerHTML = "";
  if (!subject) {
    elements.subjectDetailTitle.textContent = "";
    elements.subjectDetailMeta.textContent = "";
    return;
  }
  subject.folders = subject.folders || [];
  subject.files = subject.files || [];
  if (!subject.folders.some((folder) => folder.id === DEFAULT_FILES_FOLDER_ID)) {
    subject.folders.unshift({
      id: DEFAULT_FILES_FOLDER_ID,
      name: "Files",
      createdBy: subject.createdBy || "System",
      createdAt: subject.createdAt || Date.now(),
      isDefault: true
    });
  }
  for (const file of subject.files) {
    if (!file.folderId || !subject.folders.some((folder) => folder.id === file.folderId)) {
      file.folderId = DEFAULT_FILES_FOLDER_ID;
    }
  }
  elements.subjectDetailTitle.textContent = subject.name;
  elements.subjectDetailMeta.textContent = `${subject.files.length} file${subject.files.length !== 1 ? "s" : ""} · ${subject.folders.length} folder${subject.folders.length !== 1 ? "s" : ""} · created by ${subject.createdBy || "unknown"}`;

  if (subject.folders.length === 0 && subject.files.length === 0) {
    const empty = document.createElement("li");
    empty.className = "subject-files-empty";
    empty.textContent = "No files uploaded yet.";
    elements.subjectsList.append(empty);
    return;
  }

  for (const folder of subject.folders) {
    const folderItem = document.createElement("li");
    folderItem.className = "subject-folder-item";
    const folderFiles = subject.files.filter((file) => file.folderId === folder.id);
    const folderHead = document.createElement("div");
    folderHead.className = "subject-folder-head";
    const folderName = document.createElement("span");
    folderName.className = "subject-folder-name";
    folderName.textContent = folder.name;
    const folderMeta = document.createElement("span");
    folderMeta.className = "subject-folder-meta";
    folderMeta.textContent = folder.id === DEFAULT_FILES_FOLDER_ID
      ? `${folderFiles.length} file${folderFiles.length !== 1 ? "s" : ""}`
      : `${folderFiles.length} file${folderFiles.length !== 1 ? "s" : ""} · by ${folder.createdBy || "unknown"}`;
    const folderActions = document.createElement("div");
    folderActions.className = "subject-folder-actions";
    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = "icon-button";
    uploadBtn.textContent = "Upload";
    uploadBtn.addEventListener("click", () => {
      state.pendingUploadSubjectId = subject.id;
      state.pendingUploadFolderId = folder.id;
      elements.fileUploadInput.value = "";
      elements.fileUploadInput.click();
    });
    folderActions.append(uploadBtn);
    if (folder.id !== DEFAULT_FILES_FOLDER_ID) {
      const renameBtn = document.createElement("button");
      renameBtn.type = "button";
      renameBtn.className = "icon-button";
      renameBtn.textContent = "Rename";
      renameBtn.addEventListener("click", async () => {
        const name = prompt("Folder name", folder.name);
        if (!name?.trim() || name.trim() === folder.name) return;
        try { await renameFolder(subject.id, folder.id, name.trim()); } catch (err) { alert(err.message || "Could not rename folder."); }
      });
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "icon-button";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", async () => {
        if (!confirm(`Remove folder "${folder.name}"? Files move back to Files.`)) return;
        try { await deleteFolder(subject.id, folder.id); } catch (err) { alert(err.message || "Could not remove folder."); }
      });
      folderActions.append(renameBtn, removeBtn);
    }
    folderHead.append(folderName, folderMeta, folderActions);
    folderItem.append(folderHead);
    const nested = document.createElement("ul");
    nested.className = "subject-folder-files";
    if (folderFiles.length === 0) {
      const empty = document.createElement("li");
      empty.className = "subject-files-empty";
      empty.textContent = "Empty folder.";
      nested.append(empty);
    } else {
      for (const file of folderFiles) nested.append(createFileRow(subject, file));
    }
    folderItem.append(nested);
    elements.subjectsList.append(folderItem);
  }
}

function renderMaterials() {
  renderSubjectTiles();
  renderSubjectDetail();
  return;
  if (!elements.subjectsList) return;
  if (elements.subjectCategoryButtons) {
    elements.subjectCategoryButtons.innerHTML = "";
  }
  elements.subjectsList.innerHTML = "";
  if (state.groupMaterials.length === 0) {
    const empty = document.createElement("li");
    empty.className = "subjects-empty";
    empty.textContent = "No subjects yet — add one to get started.";
    elements.subjectsList.append(empty);
    return;
  }
  for (const subject of state.groupMaterials) {
    subject.folders = subject.folders || [];
    subject.files = subject.files || [];
    if (elements.subjectCategoryButtons) {
      const categoryBtn = document.createElement("button");
      categoryBtn.type = "button";
      categoryBtn.className = "category-btn";
      categoryBtn.innerHTML = `<span class="category-icon">${subjectIconMarkup(subject.name)}</span><span></span>`;
      categoryBtn.querySelector("span:last-child").textContent = subject.name;
      categoryBtn.addEventListener("click", () => {
        document.querySelector(`[data-subject-id="${subject.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      elements.subjectCategoryButtons.append(categoryBtn);
    }
    const li = document.createElement("li");
    li.className = "subject-card";
    li.dataset.subjectId = subject.id;

    const head = document.createElement("div");
    head.className = "subject-card-head";
    const titleWrap = document.createElement("div");
    titleWrap.className = "subject-card-title";
    const nameEl = document.createElement("span");
    nameEl.className = "subject-card-name";
    nameEl.textContent = subject.name;
    const metaEl = document.createElement("span");
    metaEl.className = "subject-card-meta";
    metaEl.textContent = `${subject.files.length} file${subject.files.length !== 1 ? "s" : ""} · ${subject.folders.length} folder${subject.folders.length !== 1 ? "s" : ""} · by ${subject.createdBy || "unknown"}`;
    titleWrap.append(nameEl, metaEl);
    const actions = document.createElement("div");
    actions.className = "subject-card-actions";

    const folderBtn = document.createElement("button");
    folderBtn.type = "button";
    folderBtn.className = "icon-button";
    folderBtn.textContent = "Folder";
    folderBtn.addEventListener("click", async () => {
      const name = prompt("Folder name");
      if (!name?.trim()) return;
      try { await addFolder(subject.id, name.trim()); } catch (err) { alert(err.message || "Could not create folder."); }
    });

    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = "icon-button";
    uploadBtn.textContent = "Upload";
    uploadBtn.addEventListener("click", () => {
      state.pendingUploadSubjectId = subject.id;
      state.pendingUploadFolderId = null;
      elements.fileUploadInput.value = "";
      elements.fileUploadInput.click();
    });

    const renameBtn = document.createElement("button");
    renameBtn.type = "button";
    renameBtn.className = "icon-button";
    renameBtn.textContent = "Rename";
    renameBtn.addEventListener("click", async () => {
      const name = prompt("Subject name", subject.name);
      if (!name?.trim() || name.trim() === subject.name) return;
      try { await renameSubject(subject.id, name.trim()); } catch (err) { alert(err.message || "Could not rename subject."); }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "icon-button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      if (!confirm(`Delete subject "${subject.name}" and all its files?`)) return;
      try { await deleteSubject(subject.id); } catch (err) { alert(err.message || "Failed."); }
    });

    actions.append(folderBtn, uploadBtn, renameBtn, deleteBtn);
    head.append(titleWrap, actions);
    li.append(head);

    const filesList = document.createElement("ul");
    filesList.className = "subject-files-list";

    const renderFile = (file) => {
      const fileItem = document.createElement("li");
      fileItem.className = "subject-file-item";

      const icon = document.createElement("span");
      icon.className = "subject-file-icon";
      icon.textContent = fileIcon(file.mimeType);

      const info = document.createElement("div");
      info.className = "subject-file-info";
      const nameBtn = document.createElement("button");
      nameBtn.className = "subject-file-name";
      nameBtn.type = "button";
      nameBtn.textContent = file.name;
      nameBtn.title = file.mimeType === "application/pdf" ? `Preview ${file.name}` : `Download ${file.name}`;
      nameBtn.addEventListener("click", () => openFile(subject.id, file));

      const fileMeta = document.createElement("span");
      fileMeta.className = "subject-file-meta";
      const uploaded = file.uploadedAt ? formatRelativeTime(file.uploadedAt) : "unknown date";
      fileMeta.textContent = `${formatFileSize(file.size)} · uploaded by ${file.uploadedBy || "unknown"} · ${uploaded}`;
      info.append(nameBtn, fileMeta);

      const renameFileBtn = document.createElement("button");
      renameFileBtn.type = "button";
      renameFileBtn.className = "icon-button subject-file-action";
      renameFileBtn.textContent = "Rename";
      renameFileBtn.addEventListener("click", async () => {
        const name = prompt("File name", file.name);
        if (!name?.trim() || name.trim() === file.name) return;
        try { await renameFile(subject.id, file.id, name.trim()); } catch (err) { alert(err.message || "Could not rename file."); }
      });

      const downloadBtn = document.createElement("button");
      downloadBtn.type = "button";
      downloadBtn.className = "icon-button subject-file-action";
      downloadBtn.textContent = file.mimeType === "application/pdf" ? "Download" : "Open";
      downloadBtn.addEventListener("click", () => downloadFile(subject.id, file.id));

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "icon-button subject-file-delete";
      delBtn.textContent = "Delete";
      delBtn.title = "Delete file";
      delBtn.addEventListener("click", async () => {
        try { await deleteFileFromSubject(subject.id, file.id); } catch (err) { alert(err.message || "Failed."); }
      });

      fileItem.append(icon, info, renameFileBtn, downloadBtn, delBtn);
      return fileItem;
    };

    const rootFiles = subject.files.filter((file) => !file.folderId || !subject.folders.some((folder) => folder.id === file.folderId));
    const hasAnyFiles = subject.files.length > 0;

    if (!hasAnyFiles && subject.folders.length === 0) {
      const empty = document.createElement("li");
      empty.className = "subject-files-empty";
      empty.textContent = "No files uploaded yet.";
      filesList.append(empty);
    } else {
      for (const folder of subject.folders) {
        const folderItem = document.createElement("li");
        folderItem.className = "subject-folder-item";
        const folderFiles = subject.files.filter((file) => file.folderId === folder.id);

        const folderHead = document.createElement("div");
        folderHead.className = "subject-folder-head";
        const folderName = document.createElement("span");
        folderName.className = "subject-folder-name";
        folderName.textContent = folder.name;
        const folderMeta = document.createElement("span");
        folderMeta.className = "subject-folder-meta";
        folderMeta.textContent = `${folderFiles.length} file${folderFiles.length !== 1 ? "s" : ""} · by ${folder.createdBy || "unknown"}`;

        const folderActions = document.createElement("div");
        folderActions.className = "subject-folder-actions";
        const folderUploadBtn = document.createElement("button");
        folderUploadBtn.type = "button";
        folderUploadBtn.className = "icon-button";
        folderUploadBtn.textContent = "Upload";
        folderUploadBtn.addEventListener("click", () => {
          state.pendingUploadSubjectId = subject.id;
          state.pendingUploadFolderId = folder.id;
          elements.fileUploadInput.value = "";
          elements.fileUploadInput.click();
        });
        const folderRenameBtn = document.createElement("button");
        folderRenameBtn.type = "button";
        folderRenameBtn.className = "icon-button";
        folderRenameBtn.textContent = "Rename";
        folderRenameBtn.addEventListener("click", async () => {
          const name = prompt("Folder name", folder.name);
          if (!name?.trim() || name.trim() === folder.name) return;
          try { await renameFolder(subject.id, folder.id, name.trim()); } catch (err) { alert(err.message || "Could not rename folder."); }
        });
        const folderDeleteBtn = document.createElement("button");
        folderDeleteBtn.type = "button";
        folderDeleteBtn.className = "icon-button";
        folderDeleteBtn.textContent = "Remove";
        folderDeleteBtn.addEventListener("click", async () => {
          if (!confirm(`Remove folder "${folder.name}"? Files move back to the subject.`)) return;
          try { await deleteFolder(subject.id, folder.id); } catch (err) { alert(err.message || "Could not remove folder."); }
        });
        folderActions.append(folderUploadBtn, folderRenameBtn, folderDeleteBtn);
        folderHead.append(folderName, folderMeta, folderActions);
        folderItem.append(folderHead);

        const nestedList = document.createElement("ul");
        nestedList.className = "subject-folder-files";
        if (folderFiles.length === 0) {
          const emptyFolder = document.createElement("li");
          emptyFolder.className = "subject-files-empty";
          emptyFolder.textContent = "Empty folder.";
          nestedList.append(emptyFolder);
        } else {
          for (const file of folderFiles) nestedList.append(renderFile(file));
        }
        folderItem.append(nestedList);
        filesList.append(folderItem);
      }

      if (rootFiles.length > 0) {
        const rootLabel = document.createElement("li");
        rootLabel.className = "subject-root-label";
        rootLabel.textContent = "Subject files";
        filesList.append(rootLabel);
        for (const file of rootFiles) filesList.append(renderFile(file));
      }
    }

    li.append(filesList);
    elements.subjectsList.append(li);
  }
}

function renderThreads() {
  if (!elements.threadsList) return;
  elements.threadsList.innerHTML = "";
  if (state.groupThreads.length === 0) {
    const empty = document.createElement("li");
    empty.className = "threads-empty";
    empty.textContent = "No discussion yet. Post a question to get started.";
    elements.threadsList.append(empty);
    return;
  }
  for (const thread of state.groupThreads) {
    const li = document.createElement("li");
    li.className = `thread-item${thread.resolved ? " is-resolved" : ""}`;
    li.dataset.threadId = thread.id;

    const main = document.createElement("div");
    main.className = "thread-main";

    const header = document.createElement("div");
    header.className = "thread-header";
    const authorEl = document.createElement("span");
    authorEl.className = "thread-author";
    authorEl.textContent = thread.author;
    const timeEl = document.createElement("span");
    timeEl.className = "thread-time";
    timeEl.textContent = formatRelativeTime(thread.createdAt);
    header.append(authorEl, timeEl);
    if (thread.resolved) {
      const badge = document.createElement("span");
      badge.className = "thread-resolved-badge";
      badge.textContent = "Resolved";
      header.append(badge);
    }

    const textEl = document.createElement("div");
    textEl.className = "thread-text";
    textEl.appendChild(renderTextWithMentions(thread.text));

    const actionsEl = document.createElement("div");
    actionsEl.className = "thread-actions";

    const replyBtn = document.createElement("button");
    replyBtn.type = "button";
    replyBtn.className = "icon-button";
    replyBtn.textContent = `Reply${thread.replies.length > 0 ? ` (${thread.replies.length})` : ""}`;
    replyBtn.addEventListener("click", () => {
      state.openReplyThreadId = state.openReplyThreadId === thread.id ? null : thread.id;
      renderThreads();
    });

    const resolveBtn = document.createElement("button");
    resolveBtn.type = "button";
    resolveBtn.className = "icon-button";
    resolveBtn.textContent = thread.resolved ? "Unresolve" : "Resolve";
    resolveBtn.addEventListener("click", async () => {
      try { await toggleResolveThread(thread.id); } catch (err) { alert(err.message || "Failed."); }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "icon-button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Delete this thread and all its replies?")) return;
      try { await deleteThread(thread.id); } catch (err) { alert(err.message || "Failed."); }
    });

    actionsEl.append(replyBtn, resolveBtn, deleteBtn);
    main.append(header, textEl, actionsEl);
    li.append(main);

    if (thread.replies.length > 0 || state.openReplyThreadId === thread.id) {
      const repliesEl = document.createElement("div");
      repliesEl.className = "thread-replies";
      for (const reply of thread.replies) {
        const replyItem = document.createElement("div");
        replyItem.className = "reply-item";
        const rHeader = document.createElement("div");
        rHeader.className = "reply-header";
        const rAuthor = document.createElement("span");
        rAuthor.className = "reply-author";
        rAuthor.textContent = reply.author;
        const rTime = document.createElement("span");
        rTime.className = "reply-time";
        rTime.textContent = formatRelativeTime(reply.createdAt);
        rHeader.append(rAuthor, rTime);
        const rText = document.createElement("div");
        rText.className = "reply-text";
        rText.appendChild(renderTextWithMentions(reply.text));
        replyItem.append(rHeader, rText);
        repliesEl.append(replyItem);
      }
      if (state.openReplyThreadId === thread.id) {
        const replyForm = document.createElement("div");
        replyForm.className = "reply-form";
        const replyInput = document.createElement("input");
        replyInput.className = "reply-input";
        replyInput.placeholder = "Write a reply…";
        replyInput.maxLength = 1000;
        replyInput.autocomplete = "off";
        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.className = "icon-button";
        submitBtn.textContent = "Send";
        const doReply = async () => {
          const text = replyInput.value.trim();
          if (!text) return;
          try { await replyToThread(thread.id, text); } catch (err) { alert(err.message || "Failed."); }
        };
        submitBtn.addEventListener("click", doReply);
        replyInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doReply(); } });
        replyForm.append(replyInput, submitBtn);
        repliesEl.append(replyForm);
        requestAnimationFrame(() => replyInput.focus());
      }
      li.append(repliesEl);
    }

    elements.threadsList.append(li);
  }
}

// @mention dropdown logic
function getMentionState(input) {
  const val = input.value;
  const cursor = input.selectionStart;
  const before = val.slice(0, cursor);
  const atIdx = before.lastIndexOf("@");
  if (atIdx === -1) return null;
  const textAfterAt = before.slice(atIdx + 1);
  if (/\s/.test(textAfterAt)) return null;
  return { atIdx, query: textAfterAt.toLowerCase() };
}

function updateMentionDropdown(input) {
  const ms = getMentionState(input);
  if (!ms) { hideMentionDropdown(); return; }
  const { query } = ms;
  const allFiles = getAllFiles();
  const matches = allFiles.filter((f) => f.name.toLowerCase().includes(query) || f.subjectName.toLowerCase().includes(query));
  if (matches.length === 0) { hideMentionDropdown(); return; }
  state.mentionQuery = query;
  if (state.mentionHighlight >= matches.length) state.mentionHighlight = 0;
  elements.mentionDropdown.innerHTML = "";
  for (let i = 0; i < matches.length; i++) {
    const file = matches[i];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `mention-option${i === state.mentionHighlight ? " is-highlighted" : ""}`;
    const nameEl = document.createElement("span");
    nameEl.className = "mention-option-name";
    nameEl.textContent = fileIcon(file.mimeType) + " " + file.name;
    const subEl = document.createElement("span");
    subEl.className = "mention-option-subject";
    subEl.textContent = file.folderName ? `${file.subjectName} / ${file.folderName}` : file.subjectName;
    btn.append(nameEl, subEl);
    btn.addEventListener("mousedown", (e) => { e.preventDefault(); insertMention(input, file, ms.atIdx); });
    elements.mentionDropdown.append(btn);
  }
  elements.mentionDropdown.hidden = false;
}

function hideMentionDropdown() {
  elements.mentionDropdown.hidden = true;
  state.mentionHighlight = 0;
}

function insertMention(input, file, atIdx) {
  const before = input.value.slice(0, atIdx);
  const after = input.value.slice(input.selectionStart);
  const mention = `@[${file.name}](${file.id})`;
  input.value = before + mention + (after.startsWith(" ") ? after : " " + after);
  const newPos = before.length + mention.length + 1;
  input.setSelectionRange(newPos, newPos);
  hideMentionDropdown();
  input.focus();
}

function parseMentionedFileIds(text) {
  const ids = [];
  const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) ids.push(match[2]);
  return ids;
}

function setGroupTab(tab) {
  if (!elements.groupTabRooms || !elements.groupTabMaterial || !elements.groupBodyRooms || !elements.groupBodyMaterial) {
    return;
  }
  state.groupTab = tab;
  elements.groupTabRooms.classList.toggle("is-active", tab === "rooms");
  elements.groupTabMaterial.classList.toggle("is-active", tab === "material");
  elements.groupTabRooms.setAttribute("aria-selected", String(tab === "rooms"));
  elements.groupTabMaterial.setAttribute("aria-selected", String(tab === "material"));
  elements.groupBodyRooms.hidden = tab !== "rooms";
  elements.groupBodyMaterial.hidden = tab !== "material";
  if (tab === "material" && state.groupMaterials.length === 0) {
    fetchGroupMaterials();
    fetchGroupThreads();
  }
}

function bindMaterialEvents() {
  elements.groupTabRooms?.addEventListener("click", () => setGroupTab("rooms"));
  elements.groupTabMaterial?.addEventListener("click", () => setGroupTab("material"));

  elements.subjectDetailBackButton.addEventListener("click", closeSubjectDetail);
  elements.subjectRenameButton.addEventListener("click", async () => {
    const subject = state.groupMaterials.find((s) => s.id === state.currentSubjectId);
    if (!subject) return;
    const name = prompt("Subject name", subject.name);
    if (!name?.trim() || name.trim() === subject.name) return;
    try { await renameSubject(subject.id, name.trim()); } catch (err) { alert(err.message || "Could not rename subject."); }
  });
  elements.subjectFolderButton.addEventListener("click", async () => {
    const subject = state.groupMaterials.find((s) => s.id === state.currentSubjectId);
    if (!subject) return;
    const name = prompt("Folder name");
    if (!name?.trim()) return;
    try { await addFolder(subject.id, name.trim()); } catch (err) { alert(err.message || "Could not create folder."); }
  });
  elements.subjectUploadButton.addEventListener("click", () => {
    if (!state.currentSubjectId) return;
    state.pendingUploadSubjectId = state.currentSubjectId;
    state.pendingUploadFolderId = null;
    elements.fileUploadInput.value = "";
    elements.fileUploadInput.click();
  });

  elements.addSubjectButton.addEventListener("click", () => {
    elements.newSubjectForm.hidden = !elements.newSubjectForm.hidden;
    if (!elements.newSubjectForm.hidden) elements.newSubjectInput.focus();
  });

  elements.newSubjectForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = elements.newSubjectInput.value.trim();
    if (!name) return;
    elements.newSubjectMessage.textContent = "";
    try {
      await addSubject(name);
      elements.newSubjectInput.value = "";
      elements.newSubjectForm.hidden = true;
    } catch (err) {
      elements.newSubjectMessage.textContent = err.message || "Could not add subject.";
    }
  });

  elements.fileUploadInput.addEventListener("change", () => {
    const file = elements.fileUploadInput.files[0];
    if (!file || !state.pendingUploadSubjectId) return;
    uploadFileToSubject(state.pendingUploadSubjectId, file, state.pendingUploadFolderId);
    state.pendingUploadSubjectId = null;
    state.pendingUploadFolderId = null;
  });

  elements.newThreadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = elements.threadInput.value.trim();
    if (!text) return;
    hideMentionDropdown();
    try {
      await postThread(text, parseMentionedFileIds(text));
      elements.threadInput.value = "";
    } catch (err) {
      alert(err.message || "Could not post.");
    }
  });

  elements.threadInput.addEventListener("input", () => updateMentionDropdown(elements.threadInput));
  elements.threadInput.addEventListener("keydown", (e) => {
    if (elements.mentionDropdown.hidden) return;
    const options = [...elements.mentionDropdown.querySelectorAll(".mention-option")];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.mentionHighlight = (state.mentionHighlight + 1) % options.length;
      options.forEach((o, i) => o.classList.toggle("is-highlighted", i === state.mentionHighlight));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      state.mentionHighlight = (state.mentionHighlight - 1 + options.length) % options.length;
      options.forEach((o, i) => o.classList.toggle("is-highlighted", i === state.mentionHighlight));
    } else if (e.key === "Enter" && !elements.mentionDropdown.hidden) {
      e.preventDefault();
      options[state.mentionHighlight]?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    } else if (e.key === "Escape") {
      hideMentionDropdown();
    }
  });
  elements.threadInput.addEventListener("blur", () => setTimeout(hideMentionDropdown, 150));
}

let lastRenderedTime = "";
let lastRenderedProgress = -1;
let canvasDrawWidth = 0;
let canvasDrawHeight = 0;

function tick() {
  if (!elements.timerApp.hidden) {
    const remaining = getRemaining();
    const formatted = formatTime(remaining);
    renderStatusComposer();

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
    const waveActive = Boolean(state.music.current && state.musicPanelOpen);
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
      drawTimer(progress, waveActive ? performance.now() : 0, getMusicElapsedMs());
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
