function textOf(el) {
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("placeholder") ||
    (el.labels && el.labels[0] && el.labels[0].innerText) ||
    el.name ||
    el.id ||
    ""
  )
    .toString()
    .trim();
}

function normalize(s) {
  return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function guessKind(el) {
  const blob = normalize(
    `${el.type || ""} ${el.name || ""} ${el.id || ""} ${textOf(el)} ${el.getAttribute("autocomplete") || ""}`
  );

  if (blob.includes("email")) return "email";
  if (blob.includes("phone") || blob.includes("tel")) return "phone";
  if (blob.includes("linkedin")) return "linkedin";
  if (blob.includes("github")) return "github";
  if (blob.includes("portfolio") || blob.includes("website") || blob.includes("site") || blob.includes("url"))
    return "website";
  if (blob.includes("first name") || blob.includes("given")) return "first_name";
  if (blob.includes("last name") || blob.includes("surname") || blob.includes("family")) return "last_name";

  return "unknown";
}

function cssEscape(v) {
  return CSS.escape(v);
}

function selectorFor(el) {
  if (el.id) return `#${cssEscape(el.id)}`;
  if (el.name) return `${el.tagName.toLowerCase()}[name="${el.name.replace(/"/g, '\\"')}"]`;
  const attr = el.getAttribute("aria-label");
  if (attr) return `${el.tagName.toLowerCase()}[aria-label="${attr.replace(/"/g, '\\"')}"]`;

  // fallback: generate a simple path
  let node = el;
  const parts = [];
  while (node && node.nodeType === 1 && parts.length < 5) {
    const tag = node.tagName.toLowerCase();
    const parent = node.parentElement;
    if (!parent) break;
    const siblings = [...parent.children].filter((c) => c.tagName.toLowerCase() === tag);
    const idx = siblings.indexOf(node) + 1;
    parts.unshift(`${tag}:nth-of-type(${idx})`);
    node = parent;
  }
  return parts.length ? parts.join(" > ") : el.tagName.toLowerCase();
}

function scanFields() {
  const candidates = [
    ...document.querySelectorAll('input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])')
  ];

  const out = [];
  for (const el of candidates) {
    const label = textOf(el);
    const kind = guessKind(el);
    if (kind === "unknown") continue; // keep list focused
    out.push({
      fieldId: `${kind}:${selectorFor(el)}`,
      kind,
      label,
      selector: selectorFor(el)
    });
  }
  return out.slice(0, 60);
}

function setValue(el, value) {
  const tag = el.tagName.toLowerCase();
  if (tag === "select") {
    // best-effort: choose option containing value
    const vNorm = normalize(value);
    const opt = [...el.options].find((o) => normalize(o.textContent).includes(vNorm));
    if (opt) el.value = opt.value;
  } else if ("value" in el) {
    el.value = value;
  }
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "GET_PAGE_CONTEXT") {
    sendResponse({ url: location.href, title: document.title });
    return;
  }

  if (msg?.type === "SCAN_FIELDS") {
    sendResponse({ fields: scanFields() });
    return;
  }

  if (msg?.type === "APPLY_AUTOFILL") {
    const assignments = Array.isArray(msg.assignments) ? msg.assignments : [];
    let filled = 0;
    for (const a of assignments) {
      try {
        const el = document.querySelector(a.selector);
        if (!el) continue;
        setValue(el, String(a.value ?? ""));
        filled++;
      } catch {
        // ignore per-field failures
      }
    }
    sendResponse({ ok: true, filled });
    return;
  }
});

