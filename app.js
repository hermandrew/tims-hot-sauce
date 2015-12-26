var express = require('express'),
    app = express(),
    body_parser = require('body-parser');

// Routes

var user = require('./controllers/user.js');
var recipe = require('./controllers/recipe.js');

app.use(express.static('public'));
app.use(body_parser.json());

app.use('/user', user);
app.use('/recipe', recipe);

module.exports = app;

