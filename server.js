var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request ser as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({
    extended: false
}));

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongoosescraper", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});
// Routes

// A GET route for scraping the Buzzfeed website

app.get("/", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            console.log(dbArticle);
            console.log("Get request received for all articles.");
            res.render("index", {
                articles: dbArticle
            });
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/scrape", function (req, res) {
    db.Article.remove({
        saved: false
    }, function (err) {
        console.log("Unsaved articles removed; new articles incoming.");
    });
    // First, we grab the body of the html with axios
    axios.get("https://www.buzzfeednews.com").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".item-wrap").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children(".info")
                .children(".info-wrap")
                .children(".heading")
                .children("a")
                .children(".title").text();
            console.log(result.title);

            result.category = $(this)
                .children(".info")
                .children(".info-wrap")
                .children(".heading")
                .children("a")
                .children(".category").text();
            console.log(result.title);

            result.description = $(this)
                .children(".info")
                .children(".info-wrap")
                .children(".text").text();
            console.log(result.description);

            result.image = $(this)
                .children(".image")
                .children(".img")
                .children("img").attr("src");
            console.log(result.image);

            result.link = $(this)
                .children(".image")
                .children(".img")
                .children("img").attr("src");
            console.log(result.image);

            result.link = "https://www.buzzfeednews.com";
            result.link += $(this)
                .children(".info")
                .children(".info-wrap")
                .children(".heading")
                .children("a").attr("href");
            console.log(result.link);
            result.saved = false;
            result.savedClass = '';
            result.saveButton = '';
            result.unsaveButton = 'disabled';

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log("Scrape result processed.");
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        })
    })
        // Send a message to the client
        .then(function () {
            res.redirect("/");
        });
});

app.get("/clear", function (req, res) {
    db.Article.remove({
        saved: false
    }, function (err) {
        console.log("Unsaved articles removed.");
    })
        .then(function () {
            res.redirect("/");
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/save/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        saved: true,
        savedClass: 'saved',
        savedButton: 'disabled',
        unsaveButton: ''
    })
        // ..and populate all of the notes associated with it
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            console.log("Error:");
            console.log(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/unsave/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        saved: false,
        savedClass: '',
        savedButton: 'disabled',
        unsaveButton: ''
    })
        // ..and populate all of the notes associated with it
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            console.log(err);
        })
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
    })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    console.log("========= req =========");
    console.log(req.body);
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
            console.log('======POST RESPONSE======');
            console.log(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
