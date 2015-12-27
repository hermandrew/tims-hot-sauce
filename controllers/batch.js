var express = require('express'),
    router = express.Router(),
    recipe = require('./../models/recipe.js'),
    batch = require('./../models/batch.js');

router.route('/')
  .post(function(request, response) {
    var new_batch = request.body;
        validation = batch.validate(new_batch);

    if (validation) response.status(400).json(validation);
    else recipe.get(new_batch.recipe_name, Number(new_batch.recipe_created_date), function(err, got_recipe) {
      if (err) response.sendStatus(500);
      else if (!got_recipe) response.status(404).json({error: 'Recipe not found.'});
      else batch.get(new_batch.recipe_name, new_batch.created_date, function(err, got_batch) {
        if (err) response.sendStatus(500);
        else if (got_batch) response.sendStatus(409);
        else batch.put(new_batch, function(err, data) {
          if(err) response.sendStatus(500);
          else {
            if (!('batches' in got_recipe)) got_recipe.batches = {};
            got_recipe.batches.push(new_batch.created_date);

            recipe.put(got_recipe, function(err, data) {
              if(err) response.sendStatus(500);
              else response.sendStatus(201);
            });
          }
        });
      });
    });
  });

router.route('/:recipe_name/:created_date')
  .delete(function(request, response) {
    var recipe_name = request.params.recipe_name,
        created_date = Number(request.params.created_date);

    batch.get(recipe_name, created_date, function(err, got_batch) {
      if(err) response.sendStatus(500);
      else if (!got_batch) response.sendStatus(404);
      else batch.delete(recipe_name, created_date, function(err, data) {
        if(err) response.sendStatus(500);
        else recipe.get(recipe_name, got_batch.recipe_created_date, function(err, got_recipe) {
          if (err) response.sendStatus(500);
          else if (!got_recipe) response.sendStatus(200);
          else {
            got_recipe.batches.pop(created_date);
            recipe.put(got_recipe, function(err, data) {
              if (err) response.sendStatus(500);
              else response.sendStatus(200);
            });
          }
        });
      });
    });
  });

module.exports = router;
