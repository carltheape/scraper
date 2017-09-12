// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var methodOverride = require('method-override');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static(__dirname + "/public"));

// Override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Database configuration with local mongoose db connection
mongoose.connect("mongodb://heroku_mvxh365p:1orhmpkdvd3tg14bg1hjnvq3vo@ds163387.mlab.com:63387/heroku_mvxh365p");
var db = mongoose.connection;

// Setup handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("openUri", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

// Require routes from controllers
require('./controllers/controllers.js')(app);