import { test, expect } from '@playwright/test';

test('Portugal-06 Existing customer order from approved quote, payment method-credit card(Amex)', async ({ page }) => {
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('Portugal_stage_fbgj@mailsac.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000 });
  await page.getByRole('button', { name: 'Welcome AutoFirstName' }).click();  
  await page.locator('span').filter({ hasText: /^Quotes$/ }).click();
  await expect(page).toHaveURL(/quotes/, { waitUntil: 'load', timeout: 200_000});

  const noDataElement = page.getByText('No Data');
  const isNoDataVisible = await noDataElement.isVisible().catch(() => false);

  if (isNoDataVisible==true) {
    console.log('No Quotes available');
  } else {
    // execute checkout flow
        console.log('Quotes available');
  }
});