import { test, expect } from '@playwright/test';
test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('Full Page Screenshot', { body: await page.screenshot({ fullPage: true }),contentType: 'image/png',});
});

test('Portugal-02 Existing customer  reorder, New Ship to Address Same City, payment method - PO upload', async ({ page }) => {
 
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();

  await page.getByRole('textbox', { name: 'Email Address' }).fill('portugal_user6@yopmail.com');

  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000});
  
  // Add Reorder steps
  await page.getByRole('button', { name: 'Welcome portugal_user6' }).click();
  await page.locator('span').filter({ hasText: /^Order History$/ }).click();
  await page.getByRole('button', { name: 'Ref. No: PT00001963 Order' }).click();
  await page.getByRole('button', { name: 'Reorder now' }).first().click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('button', { name: 'Reorder now' }).nth(1).click();
  await page.getByRole('button', { name: 'Check out' }).click();

  //await page.getByRole('link', { name: 'Cart shopping_cart' }).click();
  await page.waitForURL(/cart\.html/, { waitUntil: 'load' });

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForURL(/addresses\.html/, { waitUntil: 'load' });

  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.waitForURL(/shipping\.html/, { waitUntil: 'domcontentloaded' });

  //await page.goto('https://stage-shop.phenomenex.com/au/en/shipping.html');
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.waitForURL(/payment\.html/, { waitUntil: 'load' });

  //PO Upload payment method
  //await page.getByRole('radio', { name: 'Pay by Purchase Order' }).check();
  await page.locator('//input[@id="payByInvoice"]').click();
  await page.locator('//*[@id="reference-no"]').click();
  await page.locator('//*[@id="reference-no"]').fill('PO23456798767PO')
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.locator("//span[text()='Upload file']").click()
  await page.locator("//span[text()='Upload file']").setInputFiles('Purcahse order 1.pdf');

  await page.getByRole('checkbox').scrollIntoViewIfNeeded();
  await page .locator('(//input[@id="accept-term"])[2]').check();
  await page.getByRole('button', { name: 'Place your order' }).click();
  await page.waitForURL(/receipt\.html/, { waitUntil: 'load' });
  await expect(page.getByText('Order Confirmed')).toBeVisible();
  await expect(page.getByText(/order confirmed/i)).toBeVisible();
  await expect(page).toHaveURL(/^https:\/\/stage-shop\.phenomenex\.com\/eu\/en\/receipt\.html/);

});