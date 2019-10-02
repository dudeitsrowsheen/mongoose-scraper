// scraping tools
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var Schema = mongoose.Schema;

//scrape articles from Buzzfeed
var scrape = function (callback) {

    var articlesArr = [];

    request("https://www.buzzfeednews.com/", function (error, response, html) {

        var $ = cheerio.load(html);


        $("h2.story-title").each(function (i, element) {

            var result = {};

            // add the text and href link for each link, save them as the properties of the result.
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            if (result.title !== "" && result.link !== ""); {
                articlesArr.push(result);
            }
        });
        callback(articlesArr);
    });

};

module.exports = scrape;