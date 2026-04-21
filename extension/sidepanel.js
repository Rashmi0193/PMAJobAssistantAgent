const PROFILE_KEY = "profile";

function showToast(text) {
  const t = document.getElementById("toast");
  t.textContent = text;
  t.hidden = false;
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    t.hidden = true;
  }, 1400);
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function getProfile() {
  const { [PROFILE_KEY]: profile } = await chrome.storage.local.get(PROFILE_KEY);
  return profile ?? {};
}

function prettyLabel(f) {
  if (f.kind === "email") return "Email";
  if (f.kind === "phone") return "Phone";
  if (f.kind === "linkedin") return "LinkedIn";
  if (f.kind === "github") return "GitHub";
  if (f.kind === "website") return "Website";
  if (f.kind === "first_name") return "First name";
  if (f.kind === "last_name") return "Last name";
  return f.label || f.kind || "Field";
}

function suggestedValue(profile, kind) {
  if (kind === "email") return profile.email || "";
  if (kind === "phone") return profile.phone || "";
  if (kind === "linkedin") return profile.linkedin || "";
  if (kind === "github") return profile.github || "";
  if (kind === "website") return profile.website || "";
  if (kind === "first_name") return (profile.name || "").split(" ")[0] || "";
  if (kind === "last_name") {
    const parts = (profile.name || "").split(" ").filter(Boolean);
    return parts.length >= 2 ? parts[parts.length - 1] : "";
  }
  return "";
}

let scanResult = [];
let selected = new Map(); // key: fieldId -> {selector,value}

function renderFields(profile) {
  const el = document.getElementById("fields");
  el.innerHTML = "";
  selected.clear();

  for (const f of scanResult) {
    const val = suggestedValue(profile, f.kind);
    const isSelected = Boolean(val);
    if (isSelected) selected.set(f.fieldId, { selector: f.selector, value: val, kind: f.kind });

    const item = document.createElement("div");
    item.className = "item";

    const top = document.createElement("div");
    top.className = "itemTop";

    const left = document.createElement("div");
    left.className = "label";
    left.textContent = prettyLabel(f);

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = isSelected;
    check.disabled = !val;
    check.addEventListener("change", () => {
      if (check.checked) selected.set(f.fieldId, { selector: f.selector, value: val, kind: f.kind });
      else selected.delete(f.fieldId);
      syncButtons();
    });

    top.appendChild(left);
    top.appendChild(check);

    const value = document.createElement("div");
    value.className = "value";
    value.textContent = val ? val : "No suggested value (set profile in popup).";

    item.appendChild(top);
    item.appendChild(value);
    el.appendChild(item);
  }

  document.getElementById("fieldCount").textContent = `${scanResult.length} fields`;
  syncButtons();
}

function syncButtons() {
  document.getElementById("apply").disabled = selected.size === 0;
}

async function refresh() {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  const profile = await getProfile();
  const ctx = await chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_CONTEXT" }).catch(() => null);
  const meta = document.getElementById("pageMeta");
  if (ctx?.url) meta.textContent = ctx.url;
  else meta.textContent = tab.url || "—";

  const scan = await chrome.tabs.sendMessage(tab.id, { type: "SCAN_FIELDS" }).catch(() => null);
  scanResult = scan?.fields ?? [];
  renderFields(profile);
}

async function applyAutofill() {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  const assignments = [...selected.values()].map((s) => ({ selector: s.selector, value: s.value }));
  const res = await chrome.tabs.sendMessage(tab.id, { type: "APPLY_AUTOFILL", assignments }).catch(() => null);
  if (res?.ok) showToast(`Filled ${res.filled} field(s).`);
  else showToast("Failed to fill fields.");
}

function activateTab(name) {
  for (const btn of document.querySelectorAll(".tab")) {
    btn.classList.toggle("active", btn.dataset.tab === name);
  }
  for (const v of document.querySelectorAll(".view")) {
    v.hidden = v.id !== `view-${name}`;
  }
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && t.length <= 24);
}

function unique(arr) {
  return [...new Set(arr)];
}

function runMockScore(jd, resume) {
  const jdTokens = unique(tokenize(jd));
  const resumeTokens = new Set(unique(tokenize(resume)));
  const hits = jdTokens.filter((t) => resumeTokens.has(t));
  const score = jdTokens.length ? Math.round((hits.length / jdTokens.length) * 100) : 0;
  return { score, hits: hits.slice(0, 18), total: jdTokens.length };
}

async function generateAnswer() {
  const q = document.getElementById("question").value;
  const profile = await getProfile();
  const tab = await getActiveTab();

  const name = profile.name || "I";
  const opener =
    q.startsWith("Why are you")
      ? `I’m a strong fit because I ship high-quality UI quickly and safely (React/TypeScript), and I care about UX details, accessibility, and performance.`
      : q.startsWith("What is your biggest strength")
        ? `My biggest strength is taking ambiguous requirements and turning them into clear, shippable UI—with great UX and maintainable code.`
        : `I’m excited because the role matches how I like to work: deliver value fast, collaborate well, and keep quality high.`;

  const proof = `Recently, I delivered features end-to-end, partnered closely with design, and improved the UX polish while keeping the codebase clean.`;
  const closer = `${name === "I" ? "I’m" : `${name} is`} confident I can bring this same approach here.`;
  const pageHint = tab?.title ? `\n\n(From page: ${tab.title})` : "";

  document.getElementById("answer").value = `${opener}\n\n${proof}\n\n${closer}${pageHint}`;
  showToast("Draft generated.");
}

async function copyAnswer() {
  const text = document.getElementById("answer").value || "";
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied.");
  } catch {
    showToast("Clipboard blocked.");
  }
}

async function openWebTracker() {
  // If the web app is running locally, this is a convenient default.
  // Replace with your deployed URL later.
  await chrome.tabs.create({ url: "http://localhost:3000/job-tracker" });
}

document.getElementById("refresh").addEventListener("click", () => refresh().catch(() => {}));
document.getElementById("apply").addEventListener("click", () => applyAutofill().catch(() => {}));

document.getElementById("selectAll").addEventListener("click", async () => {
  const profile = await getProfile();
  for (const f of scanResult) {
    const val = suggestedValue(profile, f.kind);
    if (!val) continue;
    selected.set(f.fieldId, { selector: f.selector, value: val, kind: f.kind });
  }
  syncButtons();
  showToast("Selected all with values.");
});

document.getElementById("clearAll").addEventListener("click", () => {
  selected.clear();
  syncButtons();
  showToast("Cleared selection.");
});

for (const btn of document.querySelectorAll(".tab")) {
  btn.addEventListener("click", () => activateTab(btn.dataset.tab));
}

document.getElementById("runScore").addEventListener("click", () => {
  const jd = document.getElementById("jd").value;
  const resume = document.getElementById("resume").value;
  const r = runMockScore(jd, resume);
  document.getElementById("scorePill").textContent = `${r.score}% match`;
  document.getElementById("scoreOut").textContent =
    r.total === 0 ? "Paste a JD to score." : `Matched tokens: ${r.hits.join(", ") || "—"}`;
  showToast("Scored.");
});

document.getElementById("clearScore").addEventListener("click", () => {
  document.getElementById("jd").value = "";
  document.getElementById("resume").value = "";
  document.getElementById("scorePill").textContent = "—";
  document.getElementById("scoreOut").textContent = "";
});

document.getElementById("genAnswer").addEventListener("click", () => generateAnswer().catch(() => {}));
document.getElementById("copyAnswer").addEventListener("click", () => copyAnswer().catch(() => {}));
document.getElementById("openWebTracker").addEventListener("click", () => openWebTracker().catch(() => {}));

refresh().catch(() => {});

