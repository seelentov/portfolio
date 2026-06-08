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
  if (form && msg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: fd.get('name'),
        email: fd.get('email'),
        budget: fd.get('budget'),
        message: fd.get('message'),
        service: fd.getAll('service'),
      };
      const errors = validateForm(data);
      if (errors.length) {
        msg.style.color = '#ff6b6b';
        msg.textContent = errors[0];
        return;
      }
      msg.style.color = 'var(--accent)';
      msg.textContent = '✓ Спасибо! Я свяжусь с вами в течение 24 часов.';
      form.reset();
    });
  }
}
