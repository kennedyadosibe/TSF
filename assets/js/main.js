(function () {
  console.log("[TSF] main.js loaded");

  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      const isHidden = menu.classList.contains('hidden');
      menu.classList.toggle('hidden', !isHidden);
      btn.setAttribute('aria-expanded', String(isHidden));
    });
  }

  const yearNow = document.getElementById('yearNow');
  if (yearNow) yearNow.textContent = String(new Date().getFullYear());

  function formatDateTime(date) {
    const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
    const day = date.toLocaleDateString(undefined, { day: '2-digit' });
    const month = date.toLocaleDateString(undefined, { month: 'short' });
    const year = date.toLocaleDateString(undefined, { year: 'numeric' });
    const time = date.toLocaleTimeString(undefined, { hour12: false });
    return `${weekday}, ${day} ${month} ${year} • ${time}`;
  }

  function renderTime() {
    const text = formatDateTime(new Date());

    const desktop = document.getElementById('liveDateTime');
    const mobile = document.getElementById('liveDateTimeMobile');

    if (!desktop && !mobile) {
      console.warn("[TSF] No #liveDateTime or #liveDateTimeMobile found on this page.");
      return;
    }

    if (desktop) desktop.textContent = text;
    if (mobile) mobile.textContent = text;
  }

  renderTime();
  setInterval(renderTime, 1000);
})();
