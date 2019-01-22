// Dependencies
var mongoose = require("mongoose");

// Schema constructor
var Schema = mongoose.Schema;

// Create the ArticleSchema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create & export Article model
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;