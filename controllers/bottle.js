var express = require('express'),
    router = express.Router(),
    _ = require('underscore'),
    recipe = require('./../models/recipe.js'),
    batch = require('./../models/batch.js'),
    bottle = require('./../models/bottle.js');

router.route('/')
  .post(function(request, response) {
    var new_bottle = request.body,
        validation = bottle.validate(new_bottle);

    if (validation) response.status(400).json(validation);
    else {
      var error, got_batch, got_recipe, got_bottle,
          finished = _.after(3, function() {
        if (error) response.sendStatus(500);
        else if (!(got_batch && got_recipe)) response.sendStatus(404);
        else if (got_bottle) response.sendStatus(409);
        else bottle.put(new_bottle, function(err, data) {
          if (err) response.sendStatus(500);
          else {
            if (!('bottles' in got_batch)) got_batch.bottles = [];
            got_batch.bottles.push(new_bottle.created_date);
            batch.put(got_batch, function(err, data) {
              if (err) response.sendStatus(500);
              else response.sendStatus(201);
            });
          }
        });
      });

      batch.get(new_bottle.recipe_name, new_bottle.batch_created_date, function(err, data) {
        error = error ? error : err;
        got_batch = data;
        finished();
      });

      recipe.get(new_bottle.recipe_name, new_bottle.recipe_created_date, function(err, data) {
        error = error ? error : err;
        got_recipe = data;
        finished();
      });

      bottle.get(new_bottle.recipe_name, new_bottle.created_date, function(err, data) {
        error = error ? error : err;
        got_bottle = data;
        finished();
      });
    }
  });

router.route('/:recipe_name/:created_date')
  .delete(function(request, response) {
    var recipe_name = request.params.recipe_name,
        created_date = Number(request.params.created_date);

    bottle.get(recipe_name, created_date, function(err, got_bottle) {
      if (err) response.sendStatus(500);
      else if (!got_bottle) response.sendStatus(404);
      else bottle.delete(recipe_name, created_date, function(err, data) {
        if (err) response.sendStatus(500);
        else batch.get(recipe_name, got_bottle.batch_created_date, function(err, got_batch) {
          if (got_batch) {
            got_batch.bottles.pop(got_bottle.created_date);
            batch.put(got_batch, function(err, data) {
              if (err) response.sendStatus(500);
              else response.sendStatus(200);
            });
          }
        });
      });
    });
  });

module.exports = router;
