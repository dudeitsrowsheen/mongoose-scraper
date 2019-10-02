var express = require("express");
//JSON responses
var bodyParser = require("body-parser");
var logger = require("morgan");
//Mongo object modelling
var mongoose = require("mongoose");
var axios = require("axios");
//Scraper
var cheerio = require("cheerio");
// require all models
var db = require("./models");
//express handlebars
var exphbs = require("express-handlebars");
var Handlebars = require('handlebars');
var path = require("path");
var routes = require("./config/routes.js");
var app = express();
// require('.env').config();

var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router);
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
var saved;

Handlebars.registerHelper("isSaved", function (saved) {
    console.log("saved\n" + saved);
    if (saved === true || saved === false) {
        return true;
    } else {
        return false;
    }
});

mongoose.Promise = Promise;

var dburi = "mongodb://localhost/mongoose-scraper";
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
    .catch(function (err){
        console.log(err)
    });
} else {
    mongoose.connect(dburi);
};

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});



// app.use(express.json());
// app.use(express.static("public"));
// app.engine("handlebars", exphbs({
//     defaultLayout: "main"
// }));
// app.set("view engine", "handlebars");
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongoosescraper", {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// });

// var databaseUri = "mongodb://localhost/mongoose-scraper";

// if (process.env.MONGODB_URI) {
//     mongoose.connect(process.env.MONGODB_URI);
// } else {
//     mongoose.connect(databaseUri);
// }


// db.on("error", function (error) {
//     console.log("Mongoose Error: ", error);
// });

// db.once("open", function () {
//     console.log("Mongoose connection sucessful.");
// });



var router = express.Router();

require("./config/routes")(router);

// // Use express.static for public as directory
app.use(router);
// // Controllers
// // Connect to Mongo DB

// app.listen(PORT, function () {
//     console.log("App running on port " + PORT + "!");
// });
// // Start the server
