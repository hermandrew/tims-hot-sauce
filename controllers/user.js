var express = require('express'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    user = require('./../models/user.js');

router.route('/')
  .get(function(request, response) {
    user.list(function(err, users){
      response.json(users);
    });
  });

module.exports = router;
