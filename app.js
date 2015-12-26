var express = require('express'),
    app = express(),
    body_parser = require('body-parser');

// Routes

var user = require('./controllers/user.js'),
    recipe = require('./controllers/recipe.js'),
    batch = require('./controllers/batch.js');

app.use(express.static('public'));
app.use(body_parser.json());

app.use('/user', user);
app.use('/recipe', recipe);
app.use('/batch', batch);

module.exports = app;

