var express = require('express'),
    app = express(),
    body_parser = require('body-parser');

app.use(express.static('public'));
app.use(body_parser.json());

var user = require('./controllers/user.js');
app.use('/user', user);

module.exports = app;

