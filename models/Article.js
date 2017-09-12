// Require mongoose (dependencies)
var mongoose = require('mongoose');
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
    // title is a required string
    title: {
        type: String,
        trim: true,
        required: true,
    },
    // link is a required string
    link: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    // This saves ObjectId, ref refers to the Note model
    notes: [{
        type: Schema.ObjectId,
        ref: 'Note'
    }]
});

// // Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// // Export the model
module.exports = Article;