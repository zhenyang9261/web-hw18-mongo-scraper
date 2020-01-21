const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

// Import the model to use its database functions.
const db = require("../models");

// Create all our routes and set up logic within those routes where required.

// Route to home page. Render index page
router.get("/", function(req, res) {
  res.render("index");
});

// Route to get all saved articles from db
router.get("/saved", function(req, res) {
  db.Article.find({})
    .lean()
    .then(function(dbArticle) {
      //console.log(dbArticle);
      // If all articles are successfully found, send them back to the client
      res.render("index", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route to clear all saved articles from db
router.get("/clear", function(req, res) {
  db.Article.remove({})
    .then(function(dbArticle) {
      // Display home page
      res.render("index");
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route to scrape new articles from apnews.
router.get("/scrape", function(req, res) {
  // Grab the body of the html with axios

  axios.get("https://apnews.com/").then(function(response) {
    // Load html into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    let articles = [];

    $(".FeedCard").each(function(i, element) {
      let result = {};

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
        result.id = i;
        articles.push(result);
      }
    });
    //console.log(articles);
    // Send a message to the client
    res.render("index", { articles: articles });
  });
});

// Route to add new article to db.
router.post("/api/article", function(req, res) {
  // Grab the data from request body
  let article = req.body;
  console.log(article);

  db.Article.create(article)
    .then(function(dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, log it
      console.log(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
