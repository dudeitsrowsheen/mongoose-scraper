var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true,
        unique: true
    },

    summary: {
        type: String,
        required: false,
        unique: false
    },

    saved: {
        type: Boolean,
        required: true,
        default: false
    },

    saveButton: {
        type: String
    },

    unsaveButton: {
        type: String
    },

    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;