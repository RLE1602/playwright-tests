import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://lms:2019@webpreview2.leica-microsystems.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.locator('#t3m-Modal--languageMenu-label').click();
  await page.getByLabel('Country').selectOption('US');
  await page.getByRole('link', { name: 'Apply selection' }).click();
  await page.locator('a').nth(1).click();
  await page.goto('https://webpreview2.leica-microsystems.com/?country=US');
  await page.getByRole('link', { name: 'Login' }).click();
  //await page.goto('https://stage.login.lifesciences.danaher.com/u/login/identifier?state=hKFo2SBQR0IxR295NlUxMk05WF9WTnhMM2QxMk5JbGRBM2EwTKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHljV1lRU2p0bjZCd0MxY3lhd1ZmQy1yNnI3ZVZBaUhDo2NpZNkgc1MyN1ExaE5LN3RCSHBoNjNhRE1EOHNVR1BBQVpNdjg&ui_locales=en-US');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('mithali.himane@dhlscontractors.com');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Continue' }).click();
  //await page.goto('https://webpreview2.leica-microsystems.com/?country=US');
  await page.getByRole('button', { name: 'Search button' }).click();
  await page.getByRole('textbox', { name: 'Enter Search Term' }).fill('Leica atto');
  await page.getByRole('textbox', { name: 'Enter Search Term' }).press('Enter');
});