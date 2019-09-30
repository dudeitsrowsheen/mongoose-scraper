// Dependices - copy pasted from activities
var express = require("express");
var bodyParser = require("body-parser"); //JSON responses
var mongoose = require("mongoose"); //Mongo object modelling
var exphbs = require("express-handlebars"); //express handlebars
var cheerio = require("cheerio"); //Scraper

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
mongoose.Promise = Promise;

// PORT configuration to the localhost & Heroku
// Iniatialize express
var app = express();

//body-Parser for submits
app.use(bodyParser.urlencoded({ 
    extended: false 
}));

// Handlebars
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use express.static for public as directory

// Controllers
var router = express.Router();

// Connect to Mongo DB
require("./config/routes")(router);


// // MONGO db
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoosescraper";

// //Connecting to the Mongo db
// mongoose.connect(MONGODB_URI);
app.use(router);

var port = process.env.PORT || 3001;

// Start the server
app.listen(port, function () {
    console.log("This application is running on port " + port);
});