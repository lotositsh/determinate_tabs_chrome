const DEFAULTS = { auto: false, minutes: 30 };

// Клик по кнопке: выгрузить все неактивные вкладки
chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({ active: false, discarded: false });
  for (const t of tabs) chrome.tabs.discard(t.id);

  chrome.action.setBadgeBackgroundColor({ color: "#2e7d32" });
  chrome.action.setBadgeText({ text: String(tabs.length) });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), 1200);
});

// Автовыгрузка: раз в минуту проверяем, какие вкладки давно не открывали
function setupAlarm() {
  chrome.alarms.create("check", { periodInMinutes: 1 });
}
chrome.runtime.onInstalled.addListener(setupAlarm);
chrome.runtime.onStartup.addListener(setupAlarm);

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "check") return;
  const { auto, minutes } = await chrome.storage.sync.get(DEFAULTS);
  if (!auto || !(minutes > 0)) return;

  const limit = minutes * 60 * 1000;
  const tabs = await chrome.tabs.query({ active: false, discarded: false, audible: false });
  for (const t of tabs) {
    if (Date.now() - t.lastAccessed > limit) chrome.tabs.discard(t.id);
  }
});
