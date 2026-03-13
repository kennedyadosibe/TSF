(function () {
  const form = document.getElementById('thoughtForm');
  const success = document.getElementById('thoughtSuccess');
  const listEl = document.getElementById('thoughtList');

  const STORAGE_KEY = 'tsf_thoughts_v1';

  function loadThoughts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveThoughts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setErr(id, msg) {
    const V = window.TSFValidation;
    if (!V) return;
    V.setError(id, msg);
  }

  function clearErrs() {
    setErr('err_thoughtName', '');
    setErr('err_thoughtEmail', '');
    setErr('err_thoughtMessage', '');
  }

  function renderList() {
    if (!listEl) return;

    const thoughts = loadThoughts().slice(-6).reverse();

    if (thoughts.length === 0) {
      listEl.innerHTML = `<div class="text-sm text-slate-600">No thoughts yet. Be the first to post.</div>`;
      return;
    }

    listEl.innerHTML = thoughts.map((t) => {
      return `
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div class="font-semibold">${escapeHtml(t.name)}</div>
            <div class="text-xs text-slate-500">${escapeHtml(new Date(t.createdAt).toLocaleString())}</div>
          </div>
          <div class="mt-1 text-sm text-slate-700">${escapeHtml(t.email)}</div>
          <p class="mt-2 text-sm text-slate-700 whitespace-pre-wrap">${escapeHtml(t.message)}</p>
        </div>
      `;
    }).join('');
  }

  renderList();

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrs();

    const V = window.TSFValidation;
    if (!V) return;

    const values = {
      name: document.getElementById('thoughtName')?.value ?? '',
      email: document.getElementById('thoughtEmail')?.value ?? '',
      message: document.getElementById('thoughtMessage')?.value ?? ''
    };

    let ok = true;

    if (V.isEmpty(values.name)) {
      setErr('err_thoughtName', 'Name is required.');
      ok = false;
    }
    if (V.isEmpty(values.email)) {
      setErr('err_thoughtEmail', 'Email is required.');
      ok = false;
    } else if (!V.isValidEmail(values.email)) {
      setErr('err_thoughtEmail', 'Enter a valid email address.');
      ok = false;
    }
    if (V.isEmpty(values.message)) {
      setErr('err_thoughtMessage', 'Message is required.');
      ok = false;
    } else if (String(values.message).trim().length < 5) {
      setErr('err_thoughtMessage', 'Message should be at least 5 characters.');
      ok = false;
    }

    if (!ok) {
      success?.classList.add('hidden');
      return;
    }

    const thoughts = loadThoughts();
    thoughts.push({ ...values, createdAt: new Date().toISOString() });
    saveThoughts(thoughts);

    form.reset();
    renderList();

    success?.classList.remove('hidden');
    success?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();