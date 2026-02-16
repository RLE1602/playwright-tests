import { test, expect } from '@playwright/test';
test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('Full Page Screenshot', { body: await page.screenshot({ fullPage: true }),contentType: 'image/png',});
});

test('Portugal-06 Existing customer order from approved quote, payment method-credit card(Amex)', async ({ page }) => {
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('Portugal_stage_fbgj@mailsac.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000});
 

  
});