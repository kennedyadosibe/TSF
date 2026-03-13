(function () {
  function isEmpty(value) {
    return !value || String(value).trim().length === 0;
  }

  function isValidEmail(email) {
    // Simple, practical email check (frontend). Backend should re-validate.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  }

  function isValidGhanaPhone(phone) {
    const p = String(phone).trim();

    // Either:
    // 1) 0XXXXXXXXX (10 digits total)
    // 2) +233XXXXXXXXX (country code +233 then 9 digits)
    const local = /^0\d{9}$/;
    const intl = /^\+233\d{9}$/;

    return local.test(p) || intl.test(p);
  }

  function setError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message || '';
  }

  // Expose helpers to window for other scripts
  window.TSFValidation = {
    isEmpty,
    isValidEmail,
    isValidGhanaPhone,
    setError
  };
})();