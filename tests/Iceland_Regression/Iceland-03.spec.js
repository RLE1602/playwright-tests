import { test, expect } from '@playwright/test';
test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('Full Page Screenshot', { body: await page.screenshot({ fullPage: true }),contentType: 'image/png',});
});

test('Iceland-03 Existing customer reorder, payment method - credit card (Visa)', async ({ page }) => {
 
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();

  await page.getByRole('textbox', { name: 'Email Address' }).fill('Iceland_stagegm4@mailsac.com');

  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000});
  
  // Add Reorder steps
  await page.getByRole('button', { name: 'Welcome AutoFirstName' }).click();
  await page.locator('span').filter({ hasText: /^Order History$/ }).click();
  await page.getByRole('button', { name: 'Ref. No: IS00001862 Order' }).click();
  await page.getByRole('button', { name: 'REORDER NOW' }).first().click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('button', { name: 'REORDER NOW' }).nth(1).click();
  await page.getByRole('button', { name: 'Check out' }).click();

  //await page.getByRole('link', { name: 'Cart shopping_cart' }).click();
  await page.waitForURL(/cart\.html/, { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForURL(/addresses\.html/, { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.waitForURL(/shipping\.html/, { waitUntil: 'domcontentloaded' });

  //await page.goto('https://stage-shop.phenomenex.com/au/en/shipping.html');
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.waitForURL(/payment\.html/, { waitUntil: 'domcontentloaded' });

  // payment method
  await page.evaluate(() => { window.scrollBy(0, 500);});
  await page.getByText('Use Card').nth(0).click();
  //await page.getByRole('button', { name: 'Use Card' }).nth(0).click();
  await page.evaluate(() => { window.scrollBy(0, 700);});
  await page.getByRole('checkbox').scrollIntoViewIfNeeded();
  await page .locator('(//input[@id="accept-term"])[2]').check();
  await page.getByRole('button', { name: 'Place your order' }).click();
  await page.waitForURL(/receipt\.html/, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Order Confirmed')).toBeVisible();
  await expect(page.getByText(/order confirmed/i)).toBeVisible();
  await expect(page).toHaveURL(/^https:\/\/stage-shop\.phenomenex\.com\/uk\/en\/receipt\.html/);
  await expect(page.locator('text=/Order Confirmed/i')).toHaveText(/Order Confirmed/i);


});