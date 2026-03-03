import { test, expect } from '@playwright/test';

test('Quote Cart CheckOut Process(promoCodeOrNotes)', async ({ browser }) => {
  // Create a new context with HTTP Basic Auth credentials
  const context = await browser.newContext({
    httpCredentials: {
      username: 'lms',
      password: '2019'
    }
  });

  const page = await context.newPage();

  await page.goto('https://webpreview2.leica-microsystems.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.locator('#t3m-Modal--languageMenu-label').click();
  await page.getByLabel('Country').selectOption('US');
  await page.getByRole('link', { name: 'Apply selection' }).click();

  await page.locator('a').nth(1).click();
  await page.goto('https://webpreview2.leica-microsystems.com/?country=US');
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('mithali.himane@dhlscontractors.com');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Mitali@123');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('button', { name: 'Search button' , waitFor: 'enable' });
  await page.getByRole('button', { name: 'Search button' }).click();
  await page.getByRole('textbox', { name: 'Enter Search Term' , waitFor: 'enable' });
  await page.getByRole('textbox', { name: 'Enter Search Term' }).fill('MZ10F for Fluorescence Sorting');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Add To Cart' }).nth(0).click();
  await page.getByRole('link', { name: 'Cart shopping_cart' }).click();
  await page.waitForURL(/cart\.html/, { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForURL(/addresses\.html/, { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.waitForURL(/shipping\.html/, { waitUntil: 'domcontentloaded' });

  //await page.goto('https://stage-shop.phenomenex.com/au/en/shipping.html');
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.waitForURL(/payment\.html/, { waitUntil: 'domcontentloaded' });

  await page.evaluate(() => { window.scrollBy(0, 500);});
  await page.getByText('Use Account').nth(0).click();
  //await page.getByRole('button', { name: 'Use Card' }).nth(0).click();
  await page.evaluate(() => { window.scrollBy(0, 700);});
  await page.getByRole('checkbox').scrollIntoViewIfNeeded();

  await page.locator('(//input[@id="accept-term"])[2]').check();
  await page.getByRole('button', { name: 'Place your order' }).click();
  await page.waitForURL(/receipt\.html/, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Order Confirmed')).toBeVisible();
  await expect(page.getByText(/order confirmed/i)).toBeVisible();
  await expect(page).toHaveURL(/^https:\/\/stage-shop\.phenomenex\.com\/eu\/en\/receipt\.html/);
  await context.close();

});