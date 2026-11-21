const auto = document.getElementById("auto");
const minutes = document.getElementById("minutes");
const status = document.getElementById("status");

chrome.storage.sync.get({ auto: false, minutes: 30 }).then((s) => {
  auto.checked = s.auto;
  minutes.value = s.minutes;
});

function save() {
  const m = Math.max(1, parseInt(minutes.value) || 30);
  chrome.storage.sync.set({ auto: auto.checked, minutes: m });
  status.classList.add("on");
  setTimeout(() => status.classList.remove("on"), 1000);
}
auto.addEventListener("change", save);
minutes.addEventListener("change", save);
