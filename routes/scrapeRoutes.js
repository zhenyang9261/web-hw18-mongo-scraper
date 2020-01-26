const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
var mongoose = require("mongoose");

const router = express.Router();

// Import the model to use its database functions.
const db = require("../models");

// Create all our routes and set up logic within those routes where required.

// Route to home page. Render index page
router.get("/", function(req, res) {
  res.render("index");
});

// Route to get all saved articles from db ======================
router.get("/saved", function(req, res) {
  db.Article.find({})
    .lean() // to fix error encountered: Handlebars: Access has been denied to resolve the property "_id" because it is not an "own property" of its parent.
    .then(function(dbArticle) {
      // If all articles are successfully found, send them back to the client
      res.render("saved", { articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route to clear all saved articles from db ============================
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

// Route to scrape new articles from apnews. ==================================
router.get("/scrape", function(req, res) {
  // Grab the body of the html with axios

  var url = "https://apnews.com/";
  axios.get(url).then(function(response) {
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
        url +
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

    // Send a message to the client
    res.render("index", { articles: articles });
  });
});

// Route to grab a specific Article by id, populate it with it's note ====================
router.get("/api/note/:id", function(req, res) {
  let id = req.params.id;

  //db.Article.find({ _id: mongoose.Types.ObjectId(articleId) })
  db.Article.findById(mongoose.Types.ObjectId(id))
    // populate the retrived note
    .populate("note")
    .then(function(dbNote) {
      // If any notes are found, send them to the client with any associated article

      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to save an Article's associated Note ===================================
router.post("/api/note/:id", function(req, res) {
  let id = req.params.id;

  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find the article and push the new Note's _id to the article's `notes` array
      return db.Article.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.status(200).end();
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to delete a note =========================================
router.delete("/api/note/:id", function(req, res) {
  // Grab the data from request body
  let id = req.params.id;

  db.Note.remove({ _id: id })
    .then(function(dbNote) {
      res.status(200).end();
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route to add new article to db. ================================
router.post("/api/article", function(req, res) {
  // Grab the data from request body
  let article = req.body;

  db.Article.create(article)
    .then(function(dbArticle) {
      res.status(200).end();
    })
    .catch(function(err) {
      // If an error occurred, log it
      console.log(err);
    });
});

// Route to delete an article from save articles ==================================
router.delete("/api/article/:id", function(req, res) {
  // Grab the data from request body
  let id = req.params.id;

  db.Article.remove({ _id: id })
    .then(function(dbArticle) {
      res.status(200).end();
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Export routes for server.js to use.
module.exports = router;
