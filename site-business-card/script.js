function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function validateForm(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) errors.push('Введите имя');
  if (!data.email || !validateEmail(data.email)) errors.push('Введите корректный email');
  if (!data.budget) errors.push('Выберите бюджет');
  if (!data.message || data.message.trim().length < 10) errors.push('Опишите проект подробнее (мин. 10 символов)');
  return errors;
}

if (typeof module !== 'undefined') {
  module.exports = { validateEmail, validateForm };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
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
    }, { threshold: 0.1 });
    reveals.forEach(r => io.observe(r));
  }

  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(10,10,12,0.85)';
        nav.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
      } else {
        nav.style.background = 'rgba(20,20,26,0.7)';
        nav.style.boxShadow = 'none';
      }
    });
  }

  document.querySelectorAll('.project').forEach(p => {
    const color = p.dataset.color;
    if (!color) return;
    p.addEventListener('mouseenter', () => {
      const arrow = p.querySelector('.proj-arrow');
      if (arrow) arrow.style.color = color;
    });
  });

  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-msg');
  const submitBtn = form && form.querySelector('button[type="submit"]');
  if (form && msg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: fd.get('name'),
        email: fd.get('email'),
        budget: fd.get('budget'),
        message: fd.get('message'),
        service: fd.getAll('service'),
        honey: fd.get('_honey'),
      };
      if (data.honey) return;
      const errors = validateForm(data);
      if (errors.length) {
        msg.style.color = '#ff6b6b';
        msg.textContent = errors[0];
        return;
      }

      msg.style.color = 'var(--accent)';
      msg.textContent = 'Отправляю…';
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch('https://formsubmit.co/ajax/komkov222111@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            Имя: data.name,
            Email: data.email,
            Бюджет: data.budget,
            Услуги: data.service.length ? data.service.join(', ') : '—',
            Сообщение: data.message,
            _subject: 'Новая заявка с com.dev',
            _template: 'table',
            _captcha: 'false',
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || (json.success !== 'true' && json.success !== true)) {
          throw new Error(json.message || 'send error');
        }
        msg.style.color = 'var(--accent)';
        msg.textContent = '✓ Спасибо! Я свяжусь с вами в течение 24 часов.';
        form.reset();
      } catch (err) {
        msg.style.color = '#ff6b6b';
        msg.textContent = 'Ошибка отправки. Напишите на komkov222111@gmail.com или @komkov01';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}
