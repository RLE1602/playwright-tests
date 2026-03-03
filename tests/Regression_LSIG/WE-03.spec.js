const { test, expect } = require('@playwright/test');

const baseURL = 'https://stage.lifesciences.danaher.com/';

const opCos = [
  { name: 'Abcam', url: /abcam\.com/ },
  { name: 'Beckman Coulter', url: /mybeckman/ },
  { name: 'Genedata', url: /genedata/ },
  { name: 'IDBS', url: /idbs/ },
  { name: 'Leica', url: /leica/ },
  { name: 'Molecular Devices', url: /moleculardevices/ },
  { name: 'Phenomenex', url: /phenomenex/ },
  { name: 'Sciex', url: /sciex/ },
  { name: 'Aldevron', url: /aldevron/ },
  { name: 'IDT', url: /idtdna/ }
];

// --- Accept cookies if visible ---
async function acceptCookies(page) {
  const acceptBtn = page.getByRole('button', { name: /Accept/i });
  if (await acceptBtn.isVisible().catch(() => false)) {
    await acceptBtn.click();
  }
}

// --- Navigate to OpCo from home page and verify fully loaded ---
async function navigateToOpCo(page, opco) {
  const opcoLink = page.getByRole('link', { name: opco.name });
  await expect(opcoLink).toBeVisible();
  await expect(opcoLink).toBeEnabled();

  await Promise.all([
    page.waitForLoadState('load'), // wait until page is fully loaded
    opcoLink.click()
  ]);

  // Accept cookies if shown on OpCo page
  await acceptCookies(page);

  // Verify URL
  await expect(page).toHaveURL(opco.url);
}

// --- Test ---
test('WE-03 Verify OpCo Pages Fully Load After Navigation', async ({ page }) => {
  for (const opco of opCos) {
    // Start from home page
    await page.goto(baseURL);
    await acceptCookies(page);

    // Navigate to OpCo and verify fully loaded
    await navigateToOpCo(page, opco);
  }
});