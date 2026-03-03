import { test, expect } from '@playwright/test';

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

// Safe cookie handler
async function acceptCookiesIfVisible(page) {
  const acceptBtn = page.getByRole('button', { name: /Accept/i });
  if (await acceptBtn.isVisible().catch(() => false)) {
    await acceptBtn.click();
  }
}

test('WE-03 Verify Each OpCo Link From Top Section', async ({ page }) => {

  for (const opco of opCos) {

    // Always start fresh from base site
    await page.goto(baseURL);

    await acceptCookiesIfVisible(page);

    const link = page.getByRole('link', { name: opco.name });

    // 1️⃣ Verify visible & clickable
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();

    // 2️⃣ Click and wait properly
    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      link.click()
    ]);

    await acceptCookiesIfVisible(page);

    // 3️⃣ Verify navigation worked
    await expect(page).toHaveURL(opco.url);
  }
});