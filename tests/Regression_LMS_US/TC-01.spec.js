import { test, expect } from '@playwright/test';
import { time } from 'node:console';

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
  await expect(page).toHaveTitle(/Shopping Cart/i);
  await expect(page.getByText(/^\d+\sItem(s)?$/i)).toBeVisible(({ timeout: 60000 }));
  await expect(page.getByText(/Effective April 7, 2025, Leica Microsystems transactions will apply an adjustment tariff charge due to new U.S. tariffs on all applicable products./i)).toBeVisible();
  await expect(page.getByText(/^My Cart$/i)).toBeVisible();  
  await expect(page.getByText(/^My Items$/i)).toBeVisible();
  await page.evaluate(() => { window.scrollBy(0, 700);});
  await page.getByText(/Want to add more products\?/i).scrollIntoViewIfNeeded();
  await expect(page.getByText(/^Want to add more products\?$/i)).toBeVisible();
  
  // CHECKOUT
  await page.getByRole('button', { name: 'Checkout' }).scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/address/i);    
  await expect(page).toHaveTitle(/Addresses/i);
  await expect(page.getByText(/Shipping address/i)).toBeVisible({ timeout: 60000 });  
  await expect(page.getByText(/Bill to address/i)).toBeVisible();
  await expect(page.getByText(/Subtotal/i)).toBeVisible();
  await expect(page.getByText(/^Shipping$/i).nth(1)).toBeVisible();
  


  
  // SHIPPING
  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await expect(page).toHaveURL(/shipping/i);
  await expect(page).toHaveTitle(/Shipping/i);
  await expect(page.getByText(/Confirm your shipping method\(s\)?/i)).toBeVisible();
  await page.getByText(/^My Items$/i).scrollIntoViewIfNeeded();
  await expect(page.getByText(/^My Items$/i)).toBeVisible();
  await expect(page.getByText(/^Quantity : \d+$/i)).toBeVisible();

  // PAYMENT
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await expect(page).toHaveURL(/payment/i);
  await expect(page).toHaveTitle(/Payment/i);
  await expect(page.getByText(/^Choose your payment method$/i)).toBeVisible();
  
  await page.evaluate(() => { window.scrollBy(0, 500);});
  await page.getByText('Use Card').nth(0).click();
  await page.evaluate(() => { window.scrollBy(0, 700);});
  await page.getByRole('checkbox').scrollIntoViewIfNeeded();

  // CONFIRM
  await page.locator('(//input[@id="accept-term"])[2]').check();
  await page.getByRole('button', { name: 'Place your order' }).click();
  await expect(page).toHaveURL(/receipt/i, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await expect(page).toHaveTitle(/Receipt/i);
  await expect(page.locator('text=/Order received/i')).toHaveText(/Order Received/i);
  await context.close();

});