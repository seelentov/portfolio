function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function validateForm(data) {
  const errors = [];
  if (!data.name || data.name.trim().length < 2) errors.push('Please enter your name');
  if (!data.email || !validateEmail(data.email)) errors.push('Please enter a valid email');
  if (!data.message || data.message.trim().length < 10) errors.push('Please tell us a bit more (min 10 chars)');
  return errors;
}

if (typeof module !== 'undefined') {
  module.exports = { validateEmail, validateForm };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.style.transition = 'transform .4s ease';
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      if (cur > lastScroll && cur > 200) nav.style.transform = 'translateY(-150%)';
      else nav.style.transform = 'translateY(0)';
      lastScroll = cur;
    });
  }

  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  if (blob1 && blob2) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      blob1.style.transform = `translate(${x}px, ${y}px)`;
      blob2.style.transform = `translate(${-x}px, ${-y}px)`;
    });
  }

  document.querySelectorAll('.case').forEach(c => {
    const color = c.dataset.color;
    if (!color) return;
    c.addEventListener('mouseenter', () => { c.style.borderColor = color; });
    c.addEventListener('mouseleave', () => { c.style.borderColor = ''; });
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
        message: fd.get('message'),
        services: fd.getAll('services'),
      };
      const errors = validateForm(data);
      if (errors.length) {
        msg.style.color = '#FF4D2D';
        msg.textContent = errors[0];
        return;
      }
      msg.style.color = '#3FE0C0';
      msg.textContent = '✓ Thanks! We will get back to you within 24 hours.';
      form.reset();
    });
  }
}
