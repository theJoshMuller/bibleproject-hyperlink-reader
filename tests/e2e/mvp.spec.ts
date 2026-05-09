import { expect, test } from '@playwright/test';

test('loads the reader, BSB text, highlights, source trail, and PWA manifest', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'BibleProject Hyperlink Reader' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Genesis 1' })).toBeVisible();
  await expect(page.locator('.scripture').getByText('Now the earth was formless and void').first()).toBeVisible();
  await expect(page.locator('.anchor-list').getByRole('button', { name: /Genesis 1:2/i }).first()).toBeVisible();
  await expect(page.getByText('Source trail')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open BP page/i }).first()).toHaveAttribute('href', /bibleproject\.com/);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
});

test('theme selector can hide and restore hyperlink anchors', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.verse.has-anchor').first()).toBeVisible();
  await page.getByRole('button', { name: /Dragon \/ Chaos Waters/i }).click();
  await expect(page.locator('.verse.has-anchor')).toHaveCount(0);
  await page.getByRole('button', { name: /Dragon \/ Chaos Waters/i }).click();
  await expect(page.locator('.verse.has-anchor').first()).toBeVisible();
});

test('navigation and e-reader mode work on mobile-sized screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByLabel('Book').selectOption('JON');
  await expect(page.getByRole('heading', { name: 'Jonah 1' })).toBeVisible();
  await page.getByRole('button', { name: /Sepia e-reader mode/i }).click();
  await expect(page.locator('main.app-shell')).toHaveClass(/sepia/);
  await expect(page.locator('.scripture').getByText('the LORD hurled a great wind upon the sea').first()).toBeVisible();
});

test('offline PWA reload keeps the reader and data available after service-worker activation', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'BibleProject Hyperlink Reader' })).toBeVisible();

  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) throw new Error('Service workers unavailable');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'BibleProject Hyperlink Reader' })).toBeVisible();
  await expect(page.locator('.scripture').getByText('Now the earth was formless and void').first()).toBeVisible();
  await expect(page.getByText('Source trail')).toBeVisible();
  await context.setOffline(false);
});
