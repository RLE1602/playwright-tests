import { test, expect } from '@playwright/test';

test('WE-04 Verify Empty Quote Cart Page', async ({ page }) => {
  await page.goto('https://stage.lifesciences.danaher.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Quote' }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL('https://stage.lifesciences.danaher.com/us/en/quote-cart.html');
  await expect(page).toHaveTitle('Quote Cart | Danaher Life Sciences');
  await expect(page.getByRole('heading', { name: 'Your online quote cart is currently empty' })).toBeVisible();
//   await page.getByRole('button', { name: 'Request a Quote' }).click();
//   await page.locator('#quote').fill('Testing');
//   await expect(page.locator('#headlessui-dialog-title-6')).toContainText('Request for Quote');
//   await page.getByText('Describe your problem or').click();
//   await expect(page.locator('#headlessui-dialog-panel-5')).toContainText('Describe your problem or desired solution to add to your quote cart and one of our experts will assist to find the best solution for you');
//   await expect(page.getByLabel('Request for Quote').locator('h3')).toContainText('Quote Tip.');
//   await expect(page.locator('#headlessui-dialog-panel-5')).toContainText('Be as detailed as possible so we can best serve your request.');
//   await page.getByRole('button', { name: 'Add and continue browsing' }).click();
//   await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
  await expect(page.locator('fulllayout')).toContainText('Continue browsing our site');
  await page.getByRole('link', { name: 'Continue browsing our site' }).click();  
  await expect(page).toHaveURL('https://stage.lifesciences.danaher.com/');
  await page.close();
});