var express = require('express'),
    app = express();

app.use(express.static('public'));

var users = require('./controllers/user.js');
app.use('/users', users);

module.exports = app;

