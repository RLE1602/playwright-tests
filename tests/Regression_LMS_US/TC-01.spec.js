import { test, expect } from '@playwright/test';

test('Cart CheckOut Process', async ({ browser }) => {
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
  await page.waitForLoadState('networkidle');
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
  await searchInput.waitFor({ state: 'visible', timeout: 30000 });

  // Type product
  await searchInput.fill('Mateo TL');
  await searchInput.press('Enter');

  // Wait for results page
  await page.waitForLoadState('domcontentloaded');

  // ADD TO CART

  const addToCart = page.getByRole('button', { name: /add to cart/i });
  await addToCart.waitFor({ state: 'visible', timeout: 30000 });
  await addToCart.click();
  // Go to Cart
  await Promise.all([
  page.waitForURL(/cart/i),
  page.getByRole('link', { name: /CART/i }).nth(0).click()]);

  // Verify Cart
  await expect(page).toHaveURL(/cart/i);
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await expect(page.getByText(/Effective/i)).toBeVisible();

});