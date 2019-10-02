var scrape = require("../scrape/scrape.js");
var Article = require("../models/Article.js");
var Note = require("../models/Note.js");

// var articlesController = require("../models/article");
// var notesController = require("../models/note");

module.exports = function (router) {

    app.get("/scrape", (req, res) => {
        console.log("scrape ran")

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

        if (error) {
            console.log(error);
        } else if (found.length === 0) {
            res.render("empty")
        } else {
            var hbsObject = {
                articles: found
            };
            res.render("index", hbsObject);
        }


        app.get("/api/fetch/", function (req, res) {

            articlesController.fetch(function (err, docs) {

                if (!docs || docs.inserted.Count === 0) {
                    res.json({ message: "No new articles today. Check back tomorrow!" });
                }
                else {
                    res.json({ message: "Added " + docs.insertedCount + " new articles!" });
                }

            });
        });

        app.get("/saved", function (req, res) {

            articlesController.get({ saved: true }, function (data) {
                var hbsObject = {
                    articles: data
                };
                res.render("saved", hbsObject);
            })
        });

        app.patch("/api/articles", function (req, res) {

            articlesController.update(req.body, function (err, data) {

                res.json(data);
            });
        });

        app.get('/notes/:id', function (req, res) {

            Article.findOne({ _id: req.params.id })
                .populate("note")
                .exec(function (error, doc) {
                    if (error) console.log(error);
                    else {
                        res.json(doc);
                    }
                });
        });

        app.post('/notes/:id', function (req, res) {

            var newNote = new Note(req.body);
            newNote.save(function (err, doc) {
                if (error) console.log(error);

                Article.findOneAndUpdate(
                    { _id: req.params.id },
                    { $push: { note: doc_id } },
                    { new: true },
                    function (err, newdoc) {
                        if (err) console.log(err);
                        res.send(newdoc);
                    });
            });
        });
        app.get('/deleteNote/:id', function (req, res) {
            Note.remove({ "_id": req.params.id }, function (err, newdoc) {
                if (error) console.log(error);
                res.redirect('/saved');
            });
        });
    }
    )
}