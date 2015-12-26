var express = require('express'),
    router = express.Router(),
    user = require('./../models/user.js');

router.route('/')
  .get(function(request, response) {
    user.list(function(err, users){
      response.json(users);
    });
  })

  .post(function(request, response) {
    var new_user = request.body,
        validation = user.validate(new_user);

    if (validation) response.status(400).json(validation);
    else user.get(new_user.email, function(err, user) {
      if (err) response.sendStatus(500);
      else if (user) response.sendStatus(409);
      else response.sendStatus(201);
    });
  });

router.route('/:email')
  .get(function(request, response) {
    user.get(request.params.email, function(err, got_user) {
      if (err) response.sendStatus(500);
      else if (got_user) response.json(got_user);
      else response.sendStatus(404);
    });
  })

  .put(function(request, response) {
    var email = request.params.email,
        new_user = request.body,
        validation = user.validate(new_user);

    if (validation) response.status(400).json(validation);
    else if (email != new_user.email) response.status(409).json({error: 'URL does not match body params'});
    else user.get(email, function(err, got_user) {
      if (err) response.sendStatus(500);
      else if (!got_user) response.sendStatus(404);
      else user.put(new_user, function(err, data) {
        if(err) response.sendStatus(500);
        else response.sendStatus(200);
      });
    });
  });

module.exports = router;
