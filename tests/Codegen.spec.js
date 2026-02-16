import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.locator('#comm100-container iframe[title="Chat Invitation"]').contentFrame().getByRole('button', { name: 'Click to decline the chat' }).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('11');
  await page.getByRole('textbox').press('Enter');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByText('Edit / Change').first().click();
  await page.getByText('Edit').nth(3).click();
  await page.getByText('Cancel').click();
  await page.getByRole('button', { name: 'Use Address' }).nth(3).click();
  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.goto('https://stage-shop.phenomenex.com/eu/en/shipping.html');
  await page.getByText('Day Express Saver +55,00 €').click();
  await page.getByText('Day Express Saver +55,00 €').click();
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Place your order' }).click();
  await page.goto('https://stage-shop.phenomenex.com/eu/en/receipt.html?orderId=xA8KAQAIPMoAAAGcyTBZ82b0');
});