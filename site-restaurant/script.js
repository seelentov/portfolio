// Pure helpers — top of file so they're available before any DOM code
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function validateForm(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) errors.push('Name is required');
  if (!data.email || !validateEmail(data.email)) errors.push('Valid email is required');
  if (!data.date) errors.push('Date is required');
  if (!data.time) errors.push('Time is required');
  if (!data.guests) errors.push('Guests is required');
  if (!data.phone || data.phone.trim().length < 5) errors.push('Valid phone is required');
  return errors;
}

// Export for tests early
if (typeof module !== 'undefined') {
  module.exports = { validateEmail, validateForm };
}

// DOM code runs only in browser
if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0, fX = 0, fY = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });
    function loop() {
      fX += (mouseX - fX) * 0.15;
      fY += (mouseY - fY) * 0.15;
      follower.style.left = fX + 'px';
      follower.style.top = fY + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('a, button, input, select').forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
  }

  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(r => io.observe(r));
  }

  const counters = document.querySelectorAll('.num');
  if (counters.length && typeof IntersectionObserver !== 'undefined') {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = +el.dataset.target;
          let cur = 0;
          const step = Math.max(1, Math.floor(target / 50));
          const tick = () => {
            cur += step;
            if (cur >= target) { el.textContent = target; return; }
            el.textContent = cur;
            requestAnimationFrame(tick);
          };
          tick();
          counterIO.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  const form = document.getElementById('reserve-form');
  const msg = document.getElementById('form-msg');
  if (form && msg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const errors = validateForm(data);
      if (errors.length > 0) {
        msg.style.color = '#e57373';
        msg.textContent = errors[0];
        return;
      }
      msg.style.color = 'var(--gold)';
      msg.textContent = 'Thank you! Your reservation has been received.';
      form.reset();
    });
  }
}
