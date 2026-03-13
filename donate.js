(function () {
  const form = document.getElementById('donateForm');
  const successBox = document.getElementById('donateSuccess');

  const lastDonationEl = document.getElementById('lastDonation');
  const totalFundsEl = document.getElementById('totalFunds');
  const totalDonorsEl = document.getElementById('totalDonors');
  const recentDonorsEl = document.getElementById('recentDonors');

  const STORAGE_KEY = 'tsf_donations_v1';

  function loadDonations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveDonations(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function money(n) {
    const num = Number(n);
    if (Number.isNaN(num)) return 'GHS 0.00';
    return `GHS ${num.toFixed(2)}`;
  }

  function methodLabel(v) {
    switch (v) {
      case 'mtn_momo': return 'MTN MoMo';
      case 'telecel_cash': return 'Telecel Cash';
      case 'visa_mastercard': return 'Visa/Mastercard';
      case 'google_pay': return 'Google Pay';
      default: return v || '—';
    }
  }

  function renderStats() {
    const donations = loadDonations();
    const total = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

    if (donations.length === 0) {
      if (lastDonationEl) lastDonationEl.textContent = '—';
      if (totalFundsEl) totalFundsEl.textContent = money(0);
      if (totalDonorsEl) totalDonorsEl.textContent = '0';
    } else {
      const last = donations[donations.length - 1];
      if (lastDonationEl) lastDonationEl.textContent = `${money(last.amount)} • ${new Date(last.createdAt).toLocaleString()}`;
      if (totalFundsEl) totalFundsEl.textContent = money(total);
      if (totalDonorsEl) totalDonorsEl.textContent = String(donations.length);
    }

    if (recentDonorsEl) {
      const last5 = donations.slice(-5).reverse();
      recentDonorsEl.innerHTML = last5.map((d) => {
        const fullName = `${d.firstName} ${d.secondName}`.trim();
        return `
          <tr>
            <td class="py-2 pr-4 font-semibold">${escapeHtml(fullName)}</td>
            <td class="py-2 pr-4">${escapeHtml(d.email)}</td>
            <td class="py-2 pr-4">${escapeHtml(money(d.amount))}</td>
            <td class="py-2 pr-4">${escapeHtml(methodLabel(d.method))}</td>
            <td class="py-2 pr-4 text-slate-600">${escapeHtml(new Date(d.createdAt).toLocaleString())}</td>
          </tr>
        `;
      }).join('');
    }
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
    const ids = [
      'err_firstName', 'err_secondName', 'err_email', 'err_phone',
      'err_gender', 'err_amount', 'err_method'
    ];
    ids.forEach((id) => window.TSFValidation?.setError(id, ''));
  }

  function validate(values) {
    clearErrors();
    let ok = true;

    const V = window.TSFValidation;

    if (!V) return false;

    if (V.isEmpty(values.firstName)) {
      V.setError('err_firstName', 'First name is required.');
      ok = false;
    }
    if (V.isEmpty(values.secondName)) {
      V.setError('err_secondName', 'Second name is required.');
      ok = false;
    }
    if (V.isEmpty(values.email)) {
      V.setError('err_email', 'Email is required.');
      ok = false;
    } else if (!V.isValidEmail(values.email)) {
      V.setError('err_email', 'Enter a valid email address.');
      ok = false;
    }

    if (V.isEmpty(values.phone)) {
      V.setError('err_phone', 'Phone number is required.');
      ok = false;
    } else if (!V.isValidGhanaPhone(values.phone)) {
      V.setError('err_phone', 'Use Ghana format: 0XXXXXXXXX or +233XXXXXXXXX.');
      ok = false;
    }

    if (V.isEmpty(values.gender)) {
      V.setError('err_gender', 'Please select a gender.');
      ok = false;
    }

    const amountNum = Number(values.amount);
    if (V.isEmpty(values.amount)) {
      V.setError('err_amount', 'Donation amount is required.');
      ok = false;
    } else if (Number.isNaN(amountNum) || amountNum <= 0) {
      V.setError('err_amount', 'Enter a valid amount greater than 0.');
      ok = false;
    }

    if (V.isEmpty(values.method)) {
      V.setError('err_method', 'Please select a payment method.');
      ok = false;
    }

    return ok;
  }

  if (!form) {
    renderStats();
    return;
  }

  renderStats();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const values = {
      firstName: document.getElementById('firstName')?.value ?? '',
      secondName: document.getElementById('secondName')?.value ?? '',
      email: document.getElementById('email')?.value ?? '',
      phone: document.getElementById('phone')?.value ?? '',
      gender: document.getElementById('gender')?.value ?? '',
      amount: document.getElementById('amount')?.value ?? '',
      method: document.getElementById('method')?.value ?? ''
    };

    const ok = validate(values);
    if (!ok) {
      if (successBox) successBox.classList.add('hidden');
      return;
    }

    const donations = loadDonations();
    donations.push({
      ...values,
      amount: Number(values.amount),
      createdAt: new Date().toISOString()
    });
    saveDonations(donations);

    // UX: show success + reset
    if (successBox) successBox.classList.remove('hidden');
    form.reset();

    renderStats();

    // scroll to success message (nice for mobile)
    successBox?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();