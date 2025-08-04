const puppeteer = require("puppeteer");

async function scrapeFlipkart(url) {
  const browser = await puppeteer.launch({ headless: false }); // keep visible for debug
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector("button._2KpZ6l._2doB4z", { timeout: 3000 });
    await page.click("button._2KpZ6l._2doB4z");
    console.log("Popup closed");
  } catch (err) {
    console.log("No popup");
  }

  await page.waitForTimeout(2000); // wait for page to fully render

  const data = await page.evaluate(() => {
    const title = document.querySelector("span.B_NuCI")?.innerText || document.title;
    const price = document.querySelector("div._30jeq3")?.innerText;
    return { title, price };
  });

  console.log("Flipkart scraped:", data);

  await browser.close();
  return data;
}

module.exports = scrapeFlipkart;
