const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// List of pages you want to capture
const pages = [
  '/',             // Home page
  '/cart.html',   // About page
  '/receipt.html'  // Contact page
];

test('Capture screenshots and videos', async ({ browser }) => {
  const context = await browser.newContext();
  const baseURL = 'https://rle1602.github.io'; // Replace with your site

  for (const pagePath of pages) {
    const page = await context.newPage();
    const url = baseURL + pagePath;
    await page.goto(url);

    // Directory for frames
    const slug = pagePath === '/' ? 'home' : pagePath.replace(/\//g,'').replace('.html','');
    const framesDir = `frames-${slug}`;
    if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

    // Screenshot of the page
    await page.screenshot({ path: `screenshot-${slug}.png`, fullPage: true });

    // Capture 3 seconds of frames at 10fps
    for (let i = 0; i < 30; i++) {
      await page.screenshot({ path: path.join(framesDir, `frame${i.toString().padStart(3,'0')}.png`), fullPage: true });
      await page.waitForTimeout(100); // 100ms per frame
    }
  }

  await context.close();
});
