import { test, expect } from '@playwright/test';

test('Quote Cart CheckOut Process', async ({ browser }) => {
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
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/leica-microsystems\.com/, { timeout: 120000 });

  // SEARCH PRODUCT
  // Click search icon (stable locator)
  const searchBtn = page.locator('#t3m-SearchForm-trigger');
  await searchBtn.waitFor({ state: 'visible', timeout: 30000 });
  await searchBtn.click();

  // Small wait for animation (helps WebKit)
  await page.waitForTimeout(1000);

  // Wait for search input
  const searchInput = page.getByPlaceholder('Enter Search Term');
  await searchInput.waitFor({ state: 'visible', timeout: 90000 });

  // Type product
  await searchInput.fill('Mateo TL');
  await searchInput.press('Enter');

  // 6️⃣ Wait for search results page or content to load
  await page.waitForLoadState('domcontentloaded');

  // ADD TO CART
  const addToCart = page.getByRole('button', { name: /request quote/i });
  await addToCart.waitFor({ state: 'visible', timeout: 30000 });
  await addToCart.click();
  // Go to Quote Cart
  await page.waitForLoadState('domcontentloaded');
  const cartLink = page.getByRole('link', { name: /QUOTE CART/i }).nth(0).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/cart/i);
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveTitle(/Quote Cart | Leica Microsystems/i);
  await expect(page.getByRole('heading', { name: /^Request a Quote$/i })).toBeVisible({ timeout: 90000 });   await expect(page.getByText(/^My Quote Cart$/i)).toBeVisible();
  await expect(page.getByText(/^Quote Address$/i)).toBeVisible();
  await page.getByText(/^Quote Request Summary$/i).scrollIntoViewIfNeeded();
  await expect(page.getByText(/^Quote Request Summary$/i)).toBeVisible();
  await expect(page.getByText(/^Items in your quote cart$/i)).toBeVisible();
  await expect(page.getByText(/^Your quote request will be reviewed by one of our experts upon submission$/i)).toBeVisible();
  
  // SUBMIT QUOTE REQUEST
  await page.evaluate(() => { window.scrollBy(0, 500); });
  const submitQuote = page.getByRole('button', { name: /submit quote request/i });
  await submitQuote.waitFor({ state: 'visible', timeout: 30000 });
  await submitQuote.click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/submit-quote\.html/, { timeout: 200000 });
  // VERIFY SUBMISSION
  await expect(page).toHaveTitle(/Submit Quote | Leica Microsystems/i);
  await expect(page.locator('text=Thank you')).toBeVisible({ timeout: 60000 });
  await expect(page.locator('text=Your quote request has been received.')).toBeVisible();
  await expect(page.locator('text=Quote ID')).toBeVisible();
  await page.close();
  

});