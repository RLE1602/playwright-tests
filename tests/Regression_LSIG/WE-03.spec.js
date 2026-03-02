import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://stage.lifesciences.danaher.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Abcam' }).click();
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Beckman Coulter' }).click();
  await page.goto('https://stage.lifesciences.danaher.com/');
  await page.getByRole('link', { name: 'Genedata' }).click();
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.goto('https://stage.lifesciences.danaher.com/');
  await page.getByRole('link', { name: 'IDBS' }).click();
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.goto('https://stage.lifesciences.danaher.com/');
  await page.getByRole('link', { name: 'Leica' }).click();
  await page.getByRole('link', { name: 'Leica' }).click();
  await page.getByRole('link', { name: 'Leica' }).click();
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Molecular Devices' }).click();
  await page.goto('https://stage.lifesciences.danaher.com/');
  await page.getByRole('link', { name: 'Phenomenex' }).click();
  await page.goto('https://www.phenomenex.com/?utm_source=dhls_website&utm_medium=referral&utm_content=header');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.goto('https://stage.lifesciences.danaher.com/');
  await page.getByRole('link', { name: 'Sciex' }).click();
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Aldevron' }).click();
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByRole('link', { name: 'IDT' }).click();
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();

});