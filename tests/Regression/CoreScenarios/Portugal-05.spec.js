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
  /*await page.locator("//span[@class='flex gap-1 cursor-pointer']").click();
  await page.locator('[name="quote-comment"]').fill('QUOTECOMMENT');
  await page.locator("//span[@class='flex gap-1 font-bold cursor-pointer']").click();
  await page.locator('[name="quote-promo"]').fill('PROMOCODE');*/
  const expandQuoteSection = page.locator("//span[@class='flex gap-1 cursor-pointer']");
  const quoteCommentBox = page.locator('[name="quote-comment"]');
  const promoCodeBox = page.locator('[name="quote-promo"]');
  const submitQuoteBtn = page.getByRole('button', { name: 'Submit Quote Request' });

  // 1️⃣ Click to expand section
  await expandQuoteSection.click();

  // 2️⃣ Wait for fields to be visible
  await quoteCommentBox.waitFor({ state: 'visible' });
  await promoCodeBox.waitFor({ state: 'visible' });

  // 3️⃣ Check and fill Quote Comment if empty
  const quoteValue = (await quoteCommentBox.inputValue()).trim();
  if (!quoteValue) {
  await quoteCommentBox.fill('QUOTECOMMENT');}
 

  // 4️⃣ Check and fill Promo Code if empty
  const promoValue = (await promoCodeBox.inputValue()).trim();
  if (!promoValue) {
  await promoCodeBox.fill('PROMOCODE');}
 

  // 5️⃣ Submit
  await submitQuoteBtn.click();


  
  // Verify successful submission
  await page.waitForURL(/submit-quote\.html/, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Your quote request has been received/i)).toBeVisible();

});