const express = require("express");
const router = express.Router();
const scrapeAmazon = require("../scraper/amazon");
const scrapeFlipkart = require("../scraper/flipkart");
const { searchFlipkart, searchAmazon } = require("../scraper/search");

router.get("/compare", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  let result = {};

  try {
    if (url.includes("amazon.in")) {
      const amazonData = await scrapeAmazon(url);
      const flipkartSearch = await searchFlipkart(amazonData.title);
      const flipkartData = flipkartSearch ? await scrapeFlipkart(flipkartSearch.link) : null;

      result = {
        product: amazonData.title,
        amazon: { price: amazonData.price, url },
        flipkart: flipkartData ? { price: flipkartData.price, url: flipkartSearch.link } : null
      };
    } else if (url.includes("flipkart.com")) {
      const flipkartData = await scrapeFlipkart(url);
      const amazonSearch = await searchAmazon(flipkartData.title);
      const amazonData = amazonSearch ? await scrapeAmazon(amazonSearch.link) : null;

      result = {
        product: flipkartData.title,
        flipkart: { price: flipkartData.price, url },
        amazon: amazonData ? { price: amazonData.price, url: amazonSearch.link } : null
      };

     

    } else {
      return res.status(400).json({ error: "Unsupported URL" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compare prices" });
  }
});

module.exports = router;
