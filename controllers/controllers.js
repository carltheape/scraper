// Require dependencies
var Article = require('../models/Article');
var Note = require('../models/Note');
var cheerio = require('cheerio');
var request = require('request');

// Export app routes
module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('home');
    });
    // Scrape data from site and display
    app.get('/index', function(req, res) {
        // Set the articles array for handlebar use
        var articlesArray = [];

        // Make a request for the news section of google
        request('https://www.reddit.com/r/news/', function(err, res2, html) {

            // Load the html body from request into cheerio
            var $ = cheerio.load(html);

            // For each h2 element with a 'esc-lead-article-title' class
            $('p.title').each(function(i, element) {

                // Define a articleObj variable
                var articleObj = {};

                // Save the iterator for ID use on frontend
                articleObj.id = i;
                // Save the text of each link enclosed in the current element
                articleObj.title = $(this).text();
                // Save the href value of each link enclosed in the current element
                articleObj.link = $(this).children().attr('href');

                // Push new article object to articlesArray
                articlesArray.push(articleObj);
            });
            // Render index and send over the object for handlebars to use
            res.render('index', { articles: articlesArray });
        });
    });

    // This is the route used to save an article
    app.post('/articles', function(req, res) {
        // Load the req.body into a variable for ease of use
        var savedArticle = req.body;
        // Create the new article document
        Article.create(savedArticle, function(err, doc) {
            if (err) {
                // If there is an error or the entry already exists
                // log the error in the console and redirect to index
                console.log(err);
                res.redirect('/index');
            } else {
                // redirect to index
                res.redirect('/index');
            }
        });
    });

    // Route to get all saved articles
    app.get('/articles', function(req, res) {
        // Grab every doc in Articles
        Article.find({})
            // Populate any and all associated notes
            .populate('notes')
            // Execute the callback
            .exec(function(err, articles) {
                if (err) {
                    // If error send error
                    res.send(err);
                } else {
                    // Save each article document into an array
                    var allSavedArticles = articles.map(function(article) {
                        return article;
                    });
                    // Render the array in the articles route for handlebars
                    res.render('articles', { articles: allSavedArticles });
                }
            });
    });

    // Route to post notes
    app.post('/notes', function(req, res) {
        // Load the req.body into a variable for ease of use
        var note = req.body;
        // Find the appropriate article document
        Article.findOne({
            title: note.title
        }, function(err, article) {
            // Create new note document
            Note.create({
                _article: article._id,
                text: note.text
            }, function(err, doc) {
                // Push note doc to article
                article.notes.push(doc);
                // Save the article doc
                article.save(function(err) {
                    if (err) {
                        // If error, send error
                        res.send(err);
                    } else {
                        // Redirect to saved articles
                        res.redirect('/articles');
                    }
                });
            });
        });
    });

    // Route to delete a note
    app.delete('/notes', function(req, res) {
        // Load the req.body.id into a variable for ease of use
        var noteId = req.body.id;
        // Remove the appropriate notes
        Note.remove({ _id: noteId }, function(err, note) {
            if (err) {
                // If error, send error
                res.send(err);
            } else {
                // Redirect to saved articles
                res.redirect('/articles');
            }
        });
    });
};