chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "OPEN_SIDE_PANEL") {
    (async () => {
      const tabId = msg.tabId ?? sender.tab?.id;
      if (!tabId) return;
      try {
        await chrome.sidePanel.open({ tabId });
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: String(e) });
      }
    })();
    return true;
  }
});

