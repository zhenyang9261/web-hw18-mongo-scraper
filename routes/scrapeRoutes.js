var express = require("express");

var router = express.Router();

// Import the model to use its database functions.
var db = require("../models");

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

// Export routes for server.js to use.
module.exports = router;
