(function () {
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('contactSuccess');
  const recentMessages = document.getElementById('recentMessages');

  const STORAGE_KEY = 'tsf_messages_v1';

  function loadMessages() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveMessages(list) {
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

  function clearErrors() {
    const V = window.TSFValidation;
    if (!V) return;
    V.setError('err_name', '');
    V.setError('err_email', '');
    V.setError('err_message', '');
  }

  function validate(values) {
    clearErrors();
    let ok = true;
    const V = window.TSFValidation;

    if (!V) return false;

    if (V.isEmpty(values.name)) {
      V.setError('err_name', 'Name is required.');
      ok = false;
    }
    if (V.isEmpty(values.email)) {
      V.setError('err_email', 'Email is required.');
      ok = false;
    } else if (!V.isValidEmail(values.email)) {
      V.setError('err_email', 'Enter a valid email address.');
      ok = false;
    }
    if (V.isEmpty(values.message)) {
      V.setError('err_message', 'Message is required.');
      ok = false;
    } else if (String(values.message).trim().length < 10) {
      V.setError('err_message', 'Message should be at least 10 characters.');
      ok = false;
    }

    return ok;
  }

  function renderRecent() {
    if (!recentMessages) return;

    const messages = loadMessages();
    const last5 = messages.slice(-5).reverse();

    if (last5.length === 0) {
      recentMessages.innerHTML = `<div class="text-sm text-slate-600">No messages yet.</div>`;
      return;
    }

    recentMessages.innerHTML = last5.map((m) => {
      return `
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div class="font-semibold">${escapeHtml(m.name)}</div>
            <div class="text-xs text-slate-500">${escapeHtml(new Date(m.createdAt).toLocaleString())}</div>
          </div>
          <div class="mt-1 text-sm text-slate-700">${escapeHtml(m.email)}</div>
          <p class="mt-2 text-sm text-slate-700 whitespace-pre-wrap">${escapeHtml(m.message)}</p>
        </div>
      `;
    }).join('');
  }

  renderRecent();

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const values = {
      name: document.getElementById('name')?.value ?? '',
      email: document.getElementById('email')?.value ?? '',
      message: document.getElementById('message')?.value ?? ''
    };

    const ok = validate(values);
    if (!ok) {
      successBox?.classList.add('hidden');
      return;
    }

    const messages = loadMessages();
    messages.push({
      ...values,
      createdAt: new Date().toISOString()
    });
    saveMessages(messages);

    successBox?.classList.remove('hidden');
    form.reset();

    renderRecent();
    successBox?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();