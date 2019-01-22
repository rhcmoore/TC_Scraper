// ------------------DEPENDENCIES-------------------
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongojs = require("mongojs");
var axios = require("axios"); // For HTTP requests
var cheerio = require("cheerio"); // For scraping
var moment = require("moment"); // For date formatting
var db = require("./models"); // Require all models
var PORT = 3000; // Define Port
var app = express(); // Initialize Express


// ------------------MIDDLEWARE-------------------
app.use(logger("dev")); // Use morgan logger for logging requests
app.use(express.urlencoded({ extended: true })); // Parse request body as JSON
app.use(express.json());
app.use(express.static("public")); // Make public a static folder

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local tcscraper database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ------------------ROUTES-------------------
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://techcrunch.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("header.post-block__header").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("h2").children("a").text().trim();
      result.link = $(this).children("h2").children("a").attr("href").trim();
      result.author = $(this).children("div.post-block__meta").children("div.river-byline").children("span.river-byline__authors").text().trim()
      result.time = $(this).children("div.post-block__meta").children("div.river-byline").children("time").text().trim().split("T")[0];

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    res.json(err);
  })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({_id: req.params.id}, { note: dbNote._id } , { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
});

// ------------------SERVER-------------------
app.listen(PORT, function() {
  console.log("App running on port " + PORT + " -- http://localhost:3000/");
});


