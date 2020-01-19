const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

// Import the model to use its database functions.
const db = require("../models");

// Create all our routes and set up logic within those routes where required.
// Read all rows
router.get("/", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      console.log(dbArticle);
      // If all articles are successfully found, send them back to the client
      res.render("index", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// A GET route for scraping the National Geographic website
router.get("/scrape", function(req, res) {
  // Grab the body of the html with axios

  axios.get("https://apnews.com/").then(function(response) {
    // Load html into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    let result = {};

    $(".FeedCard").each(function(i, element) {
      result.title = $(element)
        .find("h1")
        .text();

      result.body = $(element)
        .find("p")
        .text();

      result.link =
        "https://apnews.com" +
        $(element)
          .children("a")
          .eq(1)
          .attr("href");

      // Create a new Article using the `result` object built from scraping
      if (result.title && result.body && result.link) {
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      }
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Export routes for server.js to use.
module.exports = router;
