const puppeteer = require("puppeteer");

async function searchFlipkart(productName) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
 const cleanTitle = productName.replace(/\(.*?\)/g, "").replace(/[^a-zA-Z0-9 ]/g, "").trim();
await page.goto(`https://www.flipkart.com/search?q=${encodeURIComponent(cleanTitle)}`);

  try {
    await page.click("button._2KpZ6l._2doB4z");
  } catch {}

  const result = await page.evaluate(() => {
    const firstItem = document.querySelector("a._1fQZEK");
    if (!firstItem) return null;
    const link = "https://www.flipkart.com" + firstItem.getAttribute("href");
    const price = firstItem.querySelector("div._30jeq3._1_WHN1")?.innerText;
    return { link, price };
  });

  await browser.close();
  return result;
}

async function searchAmazon(productName) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(productName)}`, { waitUntil: "domcontentloaded" });

  const result = await page.evaluate(() => {
    const first = document.querySelector(".s-result-item h2 a");
    if (!first) return null;
    const link = "https://www.amazon.in" + first.getAttribute("href");
    return { link };
  });

  await browser.close();
  return result;
}

module.exports = { searchFlipkart, searchAmazon };
