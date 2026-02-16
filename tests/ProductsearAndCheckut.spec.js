import { test, expect } from '@playwright/test';

test('PHX checkout by Visa Card', async ({ page }) => {
  await page.goto('https://stage10.phenomenex.com/');
  await page.getByRole('button', { name: 'Accept All Cookies' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();

  await page.getByRole('textbox', { name: 'Email Address' }).fill('aus_sit_user2@yopmail.com');

  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await expect(page).toHaveURL('https://stage10.phenomenex.com/', { waitUntil: 'load', timeout: 200_000});
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).click();
  await page.locator('textarea').fill('8B-S103-HCH');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Add To Cart' }).nth(0).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).click();

  //await page.locator('#holder').getByText('close').nth(0).click();
  await page.locator('//*[@id="holder"]//app-header-search-modal//span[2]/i').click();
  await page.getByRole('textbox', { name: 'Search by Part No., Product,' }).nth(0).click();

  await page.locator('textarea').nth(0).fill('7XB-G017-01-C');
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Add To Cart' }).nth(0).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('link', { name: 'Cart shopping_cart' }).click();
  
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Proceed to Shipping Method' }).click();
  await page.goto('https://stage-shop.phenomenex.com/au/en/shipping.html');
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  /*await page.getByRole('radio', { name: 'Pay by Purchase Order' }).check();
  await page.getByRole('textbox', { name: 'Purchase Order Number' }).click();
  await page.locator('//*[@id="reference-no"]').fill('PO2345679876567PO')
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.locator("//span[text()='Upload file']").click()
  await page.locator("//span[text()='Upload file']").setInputFiles('Purcahse order 1.pdf');*/
  await page.evaluate(() => { window.scrollBy(0, 500);});
  await page.getByText('Use Card').nth(0).click();
  //await page.getByRole('button', { name: 'Use Card' }).nth(0).click();
  await page.evaluate(() => { window.scrollBy(0, 700);});
  await page.getByRole('checkbox').scrollIntoViewIfNeeded();

  await page .locator('(//input[@id="accept-term"])[2]').check();
  await page.getByRole('button', { name: 'Place your order' }).click();
  await page.waitForURL(/receipt\.html/, { waitUntil: 'load' });
  await expect(page).toHaveURL(/^https:\/\/stage-shop\.phenomenex\.com\/eu\/en\/receipt\.html/);


  });