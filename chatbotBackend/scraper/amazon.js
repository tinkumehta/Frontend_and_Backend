const puppeteer = require("puppeteer");

async function scrapeAmazon(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const data = await page.evaluate(() => {
    const title = document.querySelector("#productTitle")?.innerText.trim();
    const price =
      document.querySelector("#priceblock_ourprice")?.innerText ||
      document.querySelector("#priceblock_dealprice")?.innerText ||
      document.querySelector(".a-price .a-offscreen")?.innerText;
    return { title, price };
  });

  console.log("Amazon scrape result:", data);

  await browser.close();
  return data;
}

module.exports = scrapeAmazon;
