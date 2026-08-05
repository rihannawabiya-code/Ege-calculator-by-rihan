(() => {
  const form = document.getElementById('ageForm');
  const birthDateInput = document.getElementById('birthDate');
  const birthTimeInput = document.getElementById('birthTime');
  const result = document.getElementById('result');
  const metaResult = document.getElementById('metaResult');
  const clearBtn = document.getElementById('clearBtn');

  let tickingInterval = null;

  // Set max date to today
  const today = new Date();
  birthDateInput.max = today.toISOString().split('T')[0];

  function showMessage(text, isError = false) {
    result.textContent = text;
    result.classList.toggle('error', isError);
  }

  // Calculate years, months, days using calendar arithmetic
  function computeYMD(birth, now) {
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      // borrow from previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }
    return { years, months, days };
  }

  // Build a Date equal to birth + years/months/days to compute remainder time
  function buildAnniversary(birth, ymd) {
    const d = new Date(birth);
    d.setFullYear(d.getFullYear() + ymd.years);
    d.setMonth(d.getMonth() + ymd.months);
    d.setDate(d.getDate() + ymd.days);
    return d;
  }

  function computeFullAge(birth, now) {
    const ymd = computeYMD(birth, now);
    const anniversary = buildAnniversary(birth, ymd);
    // remainder in ms
    let remMs = now - anniversary;
    if (remMs < 0) remMs = 0;
    const hours = Math.floor(remMs / (1000 * 60 * 60));
    remMs -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(remMs / (1000 * 60));
    remMs -= minutes * (1000 * 60);
    const seconds = Math.floor(remMs / 1000);
    // hours may be >24 if days borrowed were zero; we want hours < 24.
    const hrs = hours % 24;
    const extraDays = Math.floor(hours / 24);
    // add extraDays to ymd.days (shouldn't happen often since we borrowed above, but safe)
    return {
      years: ymd.years,
      months: ymd.months,
      days: ymd.days + extraDays,
      hours: hrs,
      minutes,
      seconds
    };
  }

  function formatParts(age) {
    const parts = [];
    if (age.years) parts.push(age.years + ' saal');
    if (age.months) parts.push(age.months + ' mahine');
    if (age.days) parts.push(age.days + ' din');
    parts.push(String(age.hours).padStart(2, '0') + ' ghante');
    parts.push(String(age.minutes).padStart(2, '0') + ' min');
    parts.push(String(age.seconds).padStart(2, '0') + ' sec');
    return parts.join(', ');
  }

  function startTicking(birth) {
    if (tickingInterval) clearInterval(tickingInterval);
    function tick() {
      const now = new Date();
      const age = computeFullAge(birth, now);
      showMessage('Teri umar abhi: ' + formatParts(age));
      metaResult.textContent = 'Last updated: ' + now.toLocaleString();
    }
    tick();
    tickingInterval = setInterval(tick, 1000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateVal = birthDateInput.value;
    const timeVal = birthTimeInput.value || '00:00:00';
    if (!dateVal) {
      showMessage('Bhai pehle date dal!', true);
      metaResult.textContent = '';
      return;
    }
    const iso = dateVal + 'T' + (timeVal.includes(':') ? timeVal : timeVal + ':00');
    const birth = new Date(iso);
    if (isNaN(birth.getTime())) {
      showMessage('Sahi date/time daliye (YYYY-MM-DD and optional HH:MM).', true);
      metaResult.textContent = '';
      return;
    }
    if (birth > new Date()) {
      showMessage('Future me janam? 😅 Saal aage hai.', true);
      metaResult.textContent = '';
      return;
    }
    if (birth.getFullYear() < 1900) {
      showMessage('Bahut purana saal — 1900 ke baad daaliye.', true);
      metaResult.textContent = '';
      return;
    }
    startTicking(birth);
  });

  clearBtn.addEventListener('click', () => {
    birthDateInput.value = '';
    birthTimeInput.value = '';
    result.textContent = '';
    metaResult.textContent = '';
    if (tickingInterval) clearInterval(tickingInterval);
    tickingInterval = null;
  });

  // Enter on date/time triggers submit
  [birthDateInput, birthTimeInput].forEach(el => {
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  });
})();
