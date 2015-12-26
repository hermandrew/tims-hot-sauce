var express = require('express'),
    router = express.Router(),
    recipe = require('./../models/recipe.js');

router.route('/')
  .post(function(request, response) {
    var new_recipe = request.body,
        validation = recipe.validate(new_recipe);

    if(validation) response.status(400).json(new_recipe);
    else recipe.get(new_recipe.name, new_recipe.created_date, function(err, got_recipe) {
      if (err) response.sendStatus(500);
      else if (got_recipe) response.sendStatus(409);
      else recipe.put(new_recipe, function(err, data) {
        if (err) response.sendStatus(500);
        else response.sendStatus(201);
      });
    });
  });

router.route('/:name/:created_date')
  .get(function(request, response) {
    recipe.get(request.params.name, Number(request.params.created_date), function(err, got_recipe) {
      if(err) response.sendStatus(500);
      else if (got_recipe) response.json(got_recipe);
      else response.sendStatus(404);
    });
  })

  .put(function(request, response) {
    var name = request.params.name,
        created_date = request.params.created_date,
        body = request.body,
        validation = recipe.validate(body);

    if (validation) response.status(400).json(validation);
    else if (!(name == body.name && created_date == body.created_date)) response.sendStatus(409);
    else recipe.get(name, Number(created_date), function(err, data) {
      if (err) response.sendStatus(500);
      else if (!data) response.sendStatus(404);
      else recipe.put(body, function(err, data) {
        if (err) response.sendStatus(500);
        else response.sendStatus(200);
      });
    });
  })

  .delete(function(request, response) {
    recipe.get(request.params.name, Number(request.params.created_date), function(err, got_recipe) {
      if(err) response.sendStatus(500);
      else if (got_recipe) response.json(got_recipe);
      else response.sendStatus(404);
    });
  });

module.exports = router;
