/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');

function loadPage(htmlPath, scriptPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');
  // Stub APIs not in jsdom
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
  };
  window.IntersectionObserver = global.IntersectionObserver;
  // Load and execute the page's script
  const code = fs.readFileSync(scriptPath, 'utf-8');
  eval(code);
}

describe('Restaurant HTML renders', () => {
  beforeEach(() => {
    loadPage(
      path.join(ROOT, 'site-restaurant/index.html'),
      path.join(ROOT, 'site-restaurant/script.js')
    );
  });
  test('has hero title with brand name', () => {
    expect(document.title).toContain('NOIR');
    expect(document.querySelector('.hero-title')).toBeTruthy();
  });
  test('has navigation', () => {
    expect(document.querySelectorAll('.nav-links a').length).toBeGreaterThanOrEqual(4);
  });
  test('has menu items', () => {
    expect(document.querySelectorAll('.dish').length).toBe(4);
  });
  test('has reservation form', () => {
    expect(document.getElementById('reserve-form')).toBeTruthy();
    expect(document.querySelector('input[name="name"]')).toBeTruthy();
    expect(document.querySelector('input[name="email"]')).toBeTruthy();
  });
  test('form submit shows error for empty fields', () => {
    const form = document.getElementById('reserve-form');
    const msg = document.getElementById('form-msg');
    const evt = new Event('submit', { cancelable: true });
    form.dispatchEvent(evt);
    expect(msg.textContent.length).toBeGreaterThan(0);
  });
});

describe('Agency HTML renders', () => {
  beforeEach(() => {
    loadPage(
      path.join(ROOT, 'site-agency/index.html'),
      path.join(ROOT, 'site-agency/script.js')
    );
  });
  test('has VOLT branding', () => {
    expect(document.title).toContain('VOLT');
  });
  test('has 4 case studies', () => {
    expect(document.querySelectorAll('.case').length).toBe(4);
  });
  test('has 4 services', () => {
    expect(document.querySelectorAll('.service').length).toBe(4);
  });
  test('has contact form with chips', () => {
    expect(document.getElementById('contact-form')).toBeTruthy();
    expect(document.querySelectorAll('.chip').length).toBeGreaterThan(3);
  });
  test('form validates required fields', () => {
    const form = document.getElementById('contact-form');
    const msg = document.getElementById('form-msg');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(msg.textContent.length).toBeGreaterThan(0);
  });
});

describe('Gadget HTML renders', () => {
  beforeEach(() => {
    loadPage(
      path.join(ROOT, 'site-gadget/index.html'),
      path.join(ROOT, 'site-gadget/script.js')
    );
  });
  test('has AURA X branding', () => {
    expect(document.title).toContain('AURA');
  });
  test('has 3D product element', () => {
    expect(document.getElementById('product3d')).toBeTruthy();
  });
  test('has feature cards', () => {
    expect(document.querySelectorAll('.feat').length).toBeGreaterThanOrEqual(3);
  });
  test('has spec cards', () => {
    expect(document.querySelectorAll('.spec-card').length).toBe(6);
  });
  test('has compare table', () => {
    expect(document.querySelector('.compare-table')).toBeTruthy();
  });
  test('color picker has 4 options', () => {
    expect(document.querySelectorAll('.color').length).toBe(4);
  });
  test('clicking color updates name', () => {
    const second = document.querySelectorAll('.color')[1];
    second.click();
    const name = document.getElementById('color-name');
    expect(name.textContent).toBe(second.dataset.color);
  });
});

describe('Business Card HTML renders', () => {
  beforeEach(() => {
    loadPage(
      path.join(ROOT, 'site-business-card/index.html'),
      path.join(ROOT, 'site-business-card/script.js')
    );
  });
  test('has Vladislav Komkov branding', () => {
    expect(document.title).toContain('Владислав Комков');
  });
  test('has 4 services', () => {
    expect(document.querySelectorAll('.service').length).toBe(4);
  });
  test('has 6 portfolio projects', () => {
    expect(document.querySelectorAll('.project').length).toBe(6);
  });
  test('has 5 process steps', () => {
    expect(document.querySelectorAll('.step').length).toBe(5);
  });
  test('has correct email', () => {
    expect(document.querySelector('.big-email').textContent).toBe('komkov222111@gmail.com');
    expect(document.querySelector('a[href^="mailto:"]')).toBeTruthy();
  });
  test('portfolio links to site projects', () => {
    const restaurantLink = document.querySelector('a[href*="site-restaurant"]');
    const agencyLink = document.querySelector('a[href*="site-agency"]');
    const gadgetLink = document.querySelector('a[href*="site-gadget"]');
    expect(restaurantLink).toBeTruthy();
    expect(agencyLink).toBeTruthy();
    expect(gadgetLink).toBeTruthy();
  });
  test('form validates required fields', () => {
    const form = document.getElementById('contact-form');
    const msg = document.getElementById('form-msg');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(msg.textContent.length).toBeGreaterThan(0);
  });
});
