import { test, expect } from '@playwright/test';
test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('Full Page Screenshot', { body: await page.screenshot({ fullPage: true }),contentType: 'image/png',});
});

test('Portugal-05 Existing customer RFQ (Request for Quote) submission', async ({ page }) => {
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();

  await page.getByRole('textbox', { name: 'Email Address' }).fill('portugal_user2@yopmail.com');

  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000});
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).click();
  await page.locator('textarea').fill('00B-4441-B0');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Add To Quote' }).nth(0).click();
  await page.getByRole('button', { name: 'Add To Quote' }).nth(0).click();
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).click();
  await page.locator('//*[@id="holder"]//app-header-search-modal//span[2]/i').click();
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).nth(0).click();

  await page.locator('textarea').nth(0).fill('00B-4446-B0');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Add To Quote' }).nth(0).click();
  await page.locator("xpath=//a[@class='btn btn-link with-icon px-2 ng-star-inserted']").click();
  //await page.locator('link', { name: 'Quote shopping_cart' }).click();
  await page.waitForURL(/quote-cart\.html/, { waitUntil: 'domcontentloaded' });
  
  // Submit Quote Request
  await page.locator("//span[@class='flex gap-1 cursor-pointer']").click();
  await page.getByRole('textbox', { name:"quote-comment"}).fill('This is my comment');
  await page.locator("//span[@class='flex gap-1 font-bold cursor-pointer']").click();
  await page.getByRole('textbox', { name: 'quote-promo' }).fill('PROMOCODE');

  await page.getByRole('button', { name: 'Submit Quote Request' }).click();
  
  // Verify successful submission
  await page.waitForURL(/submit-quote\.html/, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Your quote request has been received/i)).toBeVisible();

});