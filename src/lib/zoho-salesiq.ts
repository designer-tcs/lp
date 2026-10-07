const ZOHO_SALESIQ_SRC =
  "https://salesiq.zohopublic.in/widget?wc=siq831c6da7fb06e537881db40525e08b786b31f05473e2596cf15feae512f75f4e";

type SalesIq = {
  ready?: () => void;
  reset?: () => void;
  floatwindow?: { visible: (value: "show" | "hide") => void };
  chatwindow?: { visible: (value: "show" | "hide") => void };
  floatbutton?: { visible: (value: "show" | "hide") => void };
  visitor?: { id?: (id: string) => void };
};

declare global {
  interface Window {
    $zoho?: {
      salesiq?: SalesIq;
    };
  }
}

const MAX_OPEN_ATTEMPTS = 48;
const ZOHO_STORE_PATTERN = /siq|zld|zoho|zsiq|salesiq/i;
const VISITOR_KEY = "wsa_siq_visitor";

let pendingOpen = false;

const CHAT_TYPE_STYLE_ID = "wsa-siq-type";
const CHAT_TYPE_CSS = `
  .lineN { line-height: 1.5 !important; }
  p, .font17, .font14 {
    line-height: 1.5 !important;
    letter-spacing: normal !important;
  }
  p.lineN {
    margin-bottom: 3.25rem !important;
  }
  .newchat-wrapper {
    top: auto !important;
    bottom: 5.25rem !important;
    z-index: 2147483000 !important;
  }
  @media (min-width: 640px) {
    .newchat-wrapper {
      bottom: 1.25rem !important;
    }
  }
`;

function injectChatTypography(doc: Document) {
  if (doc.getElementById(CHAT_TYPE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = CHAT_TYPE_STYLE_ID;
  style.textContent = CHAT_TYPE_CSS;
  (doc.head || doc.documentElement).appendChild(style);
}

let chatFrameWatcherStarted = false;

function watchChatFrame() {
  if (chatFrameWatcherStarted) {
    applyChatTypography();
    return;
  }
  chatFrameWatcherStarted = true;
  applyChatTypography();
  const observer = new MutationObserver(applyChatTypography);
  observer.observe(document.body, { childList: true, subtree: true });
}

function applyChatTypography() {
  const iframe = document.getElementById("siq_chatwindow") as HTMLIFrameElement | null;
  if (!iframe) return;
  const applyToDoc = () => {
    const doc = iframe.contentDocument;
    if (doc) injectChatTypography(doc);
  };
  applyToDoc();
  iframe.addEventListener("load", applyToDoc);
}

function salesiq(): SalesIq | undefined {
  return window.$zoho?.salesiq;
}

function sessionVisitorId() {
  try {
    const existing = sessionStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const next = `wsa-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(VISITOR_KEY, next);
    return next;
  } catch {
    return `wsa-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function expireCookie(name: string) {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  const parent = host.split(".").slice(-2).join(".");
  for (const domain of ["", host, `.${host}`, parent, `.${parent}`]) {
    const domainPart = domain ? `; domain=${domain}` : "";
    document.cookie = `${name}=; expires=${expires}; path=/${domainPart}`;
  }
}

function clearSalesIqStorage() {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      const keys: string[] = [];
      for (let i = 0; i < store.length; i += 1) {
        const key = store.key(i);
        if (key && ZOHO_STORE_PATTERN.test(key) && key !== VISITOR_KEY) keys.push(key);
      }
      keys.forEach((key) => store.removeItem(key));
    } catch {
      // Private mode can block web storage.
    }
  }

  try {
    document.cookie.split(";").forEach((part) => {
      const name = part.split("=")[0]?.trim();
      if (name && ZOHO_STORE_PATTERN.test(name)) expireCookie(name);
    });
  } catch {
    // Ignore cookie access errors.
  }
}

function hideMobileLauncher() {
  if (!window.matchMedia("(max-width: 639px)").matches) return;
  try {
    salesiq()?.floatbutton?.visible?.("hide");
  } catch {
    // Launcher API may not exist yet.
  }
}

function applySessionVisitor() {
  try {
    salesiq()?.visitor?.id?.(sessionVisitorId());
  } catch {
    // Visitor API may not exist yet.
  }
}

function isChatOpen() {
  return !!document.getElementById("zsiq_chat_wrap")?.classList.contains("chat-iframe-open");
}

function hideChatWindow() {
  const api = salesiq();
  try {
    api?.floatwindow?.visible?.("hide");
  } catch {
    // Hide API may not exist yet.
  }
  try {
    api?.chatwindow?.visible?.("hide");
  } catch {
    // Hide API may not exist yet.
  }
}

function showChatWindow() {
  const api = salesiq();
  // Same path as the desktop launcher.
  try {
    if (api?.floatwindow?.visible) {
      api.floatwindow.visible("show");
      return true;
    }
  } catch {
    // Fall through to chatwindow.
  }
  try {
    if (api?.chatwindow?.visible) {
      api.chatwindow.visible("show");
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function enterConversationIfNeeded() {
  const iframe = document.getElementById("siq_chatwindow") as HTMLIFrameElement | null;
  const doc = iframe?.contentDocument;
  if (!doc?.body) return false;
  if (doc.body.innerText.includes("Welcome to Wellsprings")) return true;
  const start = doc.querySelector<HTMLElement>('[aria-label="Chat with us now"]');
  if (!start) return false;
  start.click();
  return false;
}

function finishOpen() {
  pendingOpen = false;
  let tries = 0;
  const tick = () => {
    if (enterConversationIfNeeded() || tries >= 20) return;
    tries += 1;
    window.setTimeout(tick, 250);
  };
  tick();
}

function onSalesIqReady() {
  hideMobileLauncher();
  applySessionVisitor();
  if (pendingOpen) tryShowChat(0);
}

function bindSalesIqReady() {
  window.$zoho = window.$zoho || {};
  window.$zoho.salesiq = window.$zoho.salesiq || {};
  window.$zoho.salesiq.ready = onSalesIqReady;
}

function appendSalesIqScript() {
  if (document.getElementById("zsiqscript")) return;
  const script = document.createElement("script");
  script.id = "zsiqscript";
  script.src = ZOHO_SALESIQ_SRC;
  script.defer = true;
  document.body.appendChild(script);
}

export function loadZohoSalesIq() {
  watchChatFrame();
  bindSalesIqReady();
  if (document.getElementById("zsiqscript")) return;
  clearSalesIqStorage();
  appendSalesIqScript();
}

export function unloadZohoSalesIq() {
  document.getElementById("zsiqscript")?.remove();
  document.getElementById("siq_dialog_css")?.remove();
  document.getElementById("zsiq_float")?.remove();
  document.getElementById("zsiq_chat_wrap")?.remove();
  document.getElementById("siq_chatwindow")?.remove();
  document.querySelectorAll(".zsiq_theme1").forEach((node) => node.remove());
  if (window.$zoho) delete window.$zoho;
  pendingOpen = false;
}

export function openZohoChat() {
  if (isChatOpen()) {
    hideChatWindow();
    pendingOpen = false;
    return;
  }
  pendingOpen = true;
  bindSalesIqReady();
  if (!document.getElementById("zsiqscript")) {
    appendSalesIqScript();
  }
  tryShowChat(0);
}

function tryShowChat(attempt: number) {
  hideMobileLauncher();
  if (showChatWindow()) {
    finishOpen();
    return;
  }

  if (attempt >= MAX_OPEN_ATTEMPTS) {
    pendingOpen = false;
    return;
  }
  window.setTimeout(() => tryShowChat(attempt + 1), 250);
}
