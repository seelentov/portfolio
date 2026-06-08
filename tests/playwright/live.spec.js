const { test, expect } = require('@playwright/test');

const BASE = 'https://seelentov.github.io/portfolio';

test('корневой URL редиректит на визитку', async ({ page }) => {
  const res = await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  expect(res.status()).toBeLessThan(400);
  await page.waitForURL(/site-business-card/, { timeout: 10000 });
  await expect(page).toHaveTitle(/Владислав Комков/);
});

test('визитка содержит услуги, портфолио, контакты', async ({ page }) => {
  await page.goto(`${BASE}/site-business-card/`);
  await expect(page.locator('.service')).toHaveCount(4);
  await expect(page.locator('.project')).toHaveCount(6);
  await expect(page.locator('.step')).toHaveCount(5);
  await expect(page.locator('.big-email')).toHaveText('komkov222111@gmail.com');
});

const siteCards = [
  { selector: 'a[href*="site-restaurant"]', titleRe: /NOIR/i },
  { selector: 'a[href*="site-agency"]', titleRe: /VOLT/i },
  { selector: 'a[href*="site-gadget"]', titleRe: /AURA/i },
];

for (const { selector, titleRe } of siteCards) {
  test(`ссылка ${selector} открывает живую страницу`, async ({ page }) => {
    await page.goto(`${BASE}/site-business-card/`);
    const link = page.locator(selector).first();
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
    const url = new URL(href, `${BASE}/site-business-card/`).toString();
    const res = await page.goto(url);
    expect(res.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(titleRe);
  });
}

const snackCards = [
  { selector: 'a[href*="8D3SPBk_4gjk3Y18d_06R"]', name: 'PULSE' },
  { selector: 'a[href*="rkMotPN-FHYjRk9TFDMYI"]', name: 'STILL' },
  { selector: 'a[href*="v8rbxDp87gi3151PBlFo9"]', name: 'VAULT' },
];

for (const { selector, name } of snackCards) {
  test(`Snack-ссылка ${name} доступна (HEAD)`, async ({ request, page }) => {
    await page.goto(`${BASE}/site-business-card/`);
    const link = page.locator(selector).first();
    const href = await link.getAttribute('href');
    expect(href).toContain('snack.expo.dev');
    const res = await request.get(href);
    expect(res.status()).toBeLessThan(400);
  });
}

test('форма на визитке валидирует пустые поля', async ({ page }) => {
  await page.goto(`${BASE}/site-business-card/`);
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator('#form-msg')).not.toHaveText('');
});
