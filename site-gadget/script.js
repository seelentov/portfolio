function calculateTotal(price, qty, taxRate = 0) {
  if (typeof price !== 'number' || typeof qty !== 'number') throw new Error('Invalid input');
  if (price < 0 || qty < 0) throw new Error('Negative values not allowed');
  return Math.round((price * qty * (1 + taxRate)) * 100) / 100;
}

if (typeof module !== 'undefined') {
  module.exports = { calculateTotal };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) nav.classList.add('scrolled');
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

  const product = document.getElementById('product3d');
  const heroEl = document.querySelector('.hero');
  if (product && heroEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      product.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
    });
    heroEl.addEventListener('mouseleave', () => {
      product.style.transform = '';
    });
  }

  const colors = document.querySelectorAll('.color');
  const colorName = document.getElementById('color-name');
  if (colors.length) {
    function selectColor(btn) {
      colors.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      if (colorName) colorName.textContent = btn.dataset.color;
    }
    colors.forEach(btn => btn.addEventListener('click', () => selectColor(btn)));
  }
}
