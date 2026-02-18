import { test, expect } from '@playwright/test';
test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('Full Page Screenshot', { body: await page.screenshot({ fullPage: true }),contentType: 'image/png',});
});

test('Portugal-15 Begin the checkout flow as a guest until prompted to log in, log in, return to the Cart to update items and addresses, verify updates, and then place the order (Guest)', async ({ page }) => {
  //Login
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000});
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).click();
  await page.locator('textarea').fill('00B-4441-B0');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Add To Cart' }).nth(0).click();
  //Sign In
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('portugal_user4@yopmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign in' }).click();  
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000});
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).click();
  await page.locator('//*[@id="holder"]//app-header-search-modal//span[2]/i').click();
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).nth(0).click();
  await page.locator('textarea').nth(0).fill('00B-4446-B0');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Add To Cart' }).nth(0).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('link', { name: 'Cart shopping_cart' }).click();
  await page.waitForURL(/cart\.html/, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForURL(/addresses\.html/, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.waitForURL(/shipping\.html/, { waitUntil: 'domcontentloaded' });
  //await page.goto('https://stage-shop.phenomenex.com/au/en/shipping.html');
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.waitForURL(/payment\.html/, { waitUntil: 'domcontentloaded' });
  // Test case 09 is begun
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.waitForURL(/cart\.html/, { waitUntil: 'domcontentloaded' });

  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('5');
  await page.getByRole('textbox').press('Enter');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForURL(/addresses\.html/, { waitUntil: 'domcontentloaded' });
  await page.getByText('Edit / Change').first().click();
  await page.getByText('Edit').nth(3).click();
  await page.getByText('Cancel').click();
  await page.getByRole('button', { name: 'Use Address' }).nth(0).click();
  await expect(page.getByRole('button', { name: 'Use Address' })).toBeHidden();
  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.waitForURL(/shipping\.html/, { waitUntil: 'domcontentloaded' });
  await page.getByText('Day Express Saver +55,00 €').click();
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.waitForURL(/payment\.html/, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { window.scrollBy(0, 700);});
  await page.getByRole('checkbox').scrollIntoViewIfNeeded();
  await page.locator('(//input[@id="accept-term"])[2]').check();
  await page.getByRole('button', { name: 'Place your order' }).click();
  await page.waitForURL(/receipt\.html/, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/^https:\/\/stage-shop\.phenomenex\.com\/eu\/en\/receipt\.html/);

});