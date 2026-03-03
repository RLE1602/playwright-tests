const { test, expect } = require('@playwright/test');

const baseURL = 'https://stage.lifesciences.danaher.com/';

// Accept cookies if visible
async function acceptCookies(page) {
  const acceptBtn = page.getByRole('button', { name: /Accept/i });
  if (await acceptBtn.isVisible().catch(() => false)) {
    await acceptBtn.click();
  }
}

// Navigate to OpCo and verify page loaded + URL
async function navigateToOpCoAndVerifyURL(page, name, urlPattern) {
  const opcoLink = page.getByRole('link', { name });
  await expect(opcoLink).toBeVisible();
  await expect(opcoLink).toBeEnabled();

  // Click link and wait for DOMContentLoaded
  await Promise.all([
    page.waitForLoadState('domcontentloaded', { timeout: 30000 }),
    opcoLink.click()
  ]);

  await acceptCookies(page);

  // Optional: wait for key element on page
  await page.locator('h1').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

  // Verify URL
  await expect(page).toHaveURL(urlPattern);
}

// Test without loop
test('WE-03 Navigate Each OpCo Sequentially and Return Home', async ({ page }) => {
  // Start from home page
  await page.goto(baseURL);
  await acceptCookies(page);

  // --- Navigate each OpCo sequentially ---
  await navigateToOpCoAndVerifyURL(page, 'Abcam', /abcam\.com/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'Beckman Coulter', /mybeckman/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'Genedata', /genedata/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'IDBS', /idbs/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'Leica', /leica/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'Molecular Devices', /moleculardevices/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'Phenomenex', /phenomenex/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'Sciex', /sciex/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'Aldevron', /aldevron/);
  await page.goto(baseURL);
  await acceptCookies(page);

  await navigateToOpCoAndVerifyURL(page, 'IDT', /idtdna/);

  // --- After last OpCo, return to home page ---
  await page.goto(baseURL);
  await acceptCookies(page);
});