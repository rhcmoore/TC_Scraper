// Dependencies
var mongoose = require("mongoose");

// Schema
var Schema = mongoose.Schema;

// Create the NoteSchema object
var NoteSchema = new Schema({
    title: String,
    body: String
});

// Create & export Note model
var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;