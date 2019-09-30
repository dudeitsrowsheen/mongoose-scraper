// Dependices - copy pasted from activities
var express = require("express");
var bodyParser = require("body-parser"); //JSON responses
var mongoose = require("mongoose"); //Mongo object modelling
var db = require("./models"); // requiring models
var request = require("request"); //Makes http calls
var exphbs = require("express-handlebars"); //express handlebars
var cheerio = require("cheerio"); //Scraper

// PORT configuration to the localhost & Heroku
var PORT = process.env.PORT || process.argv[2] || 27017;

// Iniatialize express
var app = express();

//body-Parser for submits
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars
var exphbs = require ("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use express.static for public as directory
app.use(express.static("public"));

// Controllers
var router = require("./config/routes.js");
// Connect to Mongo DB
app.use(router);

// MONGO db
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoosescraper";

//Connecting to the Mongo db
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function () {
    console.log(`This application is running on port: ${PORT}`);
});