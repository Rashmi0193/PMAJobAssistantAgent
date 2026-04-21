const STORAGE_KEY = "profile";

function qs(id) {
  return document.getElementById(id);
}

async function getActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

async function load() {
  const { [STORAGE_KEY]: profile } = await chrome.storage.local.get(STORAGE_KEY);
  const p = profile ?? {};
  qs("name").value = p.name ?? "";
  qs("email").value = p.email ?? "";
  qs("phone").value = p.phone ?? "";
  qs("linkedin").value = p.linkedin ?? "";
  qs("github").value = p.github ?? "";
  qs("website").value = p.website ?? "";

  const status = qs("status");
  if (p.email || p.name) {
    status.textContent = "Saved";
    status.style.color = "rgba(255,255,255,0.88)";
  } else {
    status.textContent = "Not saved";
    status.style.color = "rgba(255,255,255,0.65)";
  }
}

async function save() {
  const profile = {
    name: qs("name").value.trim(),
    email: qs("email").value.trim(),
    phone: qs("phone").value.trim(),
    linkedin: qs("linkedin").value.trim(),
    github: qs("github").value.trim(),
    website: qs("website").value.trim()
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: profile });
  await load();
}

async function reset() {
  await chrome.storage.local.remove(STORAGE_KEY);
  await load();
}

async function openPanel() {
  const tabId = await getActiveTabId();
  await chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL", tabId });
  window.close();
}

qs("save").addEventListener("click", save);
qs("reset").addEventListener("click", reset);
qs("openPanel").addEventListener("click", openPanel);

load().catch(() => {});

