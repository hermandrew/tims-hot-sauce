var request = require('supertest'),
    app = require('./../app.js'),
    recipe = require('./../models/recipe.js'),
    expect = require('chai').expect;

var existing_recipe = {
  name: 'testname',
  created_date: 1451104366,
  ingredients: [ 'ingredients one', 'super ingredient 2' ],
  directions: [ 'directions uno', 'directions dos' ],
  batches: ['1234', '1235']
};

var new_recipe = {
  name: 'newtestname',
  created_date: 1451104866,
  ingredients: [ 'ingredients one', 'super ingredient 2' ],
  directions: [ 'directions uno', 'directions dos' ],
  batches: ['1238', '1239']
};

var invalid_recipe = {
  name: 'invalidtestname',
  created_date: '14511 04866',
  ingredients: [ 'ingredients one', 'super ingredient 2' ],
  directions: [ '', 'directions dos' ],
  batches: ['1238', '1239']
};

describe('Requests to the path /recipe', function() {

  beforeEach(function(done) {
    recipe.put(existing_recipe, function(err, data) {
      done();
    });
  });

  afterEach(function(done) {
    recipe.delete(existing_recipe.name, existing_recipe.created_date, function(err, data) {
      done();
    });
  });

  describe('Requests to /', function() {
    describe('#POST success case', function() {

      after(function(done) {
        recipe.delete(new_recipe.name, new_recipe.created_date, function(err, data) {
          done();
        });
      });

      it('Returns a 201 status code if that recipe doesn\'t already exist', function(done) {
        request(app)
          .post('/recipe')
          .send(new_recipe)
          .expect(201, done);
      });

      it('Creates a recipe', function(done) {
        request(app)
          .post('/recipe')
          .send(new_recipe)
          .expect(function(response) {
            recipe.get(new_recipe.name, new_recipe.created_date, function(err, data) {
              expect(err).is.null;
              expect(data).is.an('Object');
            });
          })
          .end(done);
      });

    });

    describe('#POST error cases', function() {

      it('Returns a 409 status code if that recipe already exists.', function(done) {
        request(app)
          .post('/recipe')
          .send(existing_recipe)
          .expect(409, done);
      });

      it('Returns a 400 status code if the recipe is invalid.', function(done) {
        request(app)
          .post('/recipe')
          .send(invalid_recipe)
          .expect(400, done);
      });

    });
  });

  describe('Requests to /:name/:created_date', function() {
    describe('#GET', function() {

      it('Returns 200 with a valid object if it exists.', function(done) {
        request(app)
          .get('/recipe/' + existing_recipe.name + '/' + existing_recipe.created_date)
          .expect(200)
          .expect(function(response) {
            var validation = recipe.validate(response.body);
            if (validation) throw new Error('Returned invalid recipe.');
          })
          .end(done);
      });

      it('Returns 404 if the recipe doesn\'t exist,', function(done) {
        request(app)
          .get('/recipe/' + new_recipe.name + '/' + new_recipe.created_date)
          .expect(404, done);
      });
    });

    describe('#PUT', function() {

      it('Returns 404 if the recipe doesn\'t exist', function(done) {
        request(app)
          .put('/recipe/' + new_recipe.name + '/' + new_recipe.created_date)
          .send(new_recipe)
          .expect(404, done);
      });

      it('Returns a 409 if the URL params don\'t match the body params.', function(done) {
        request(app)
          .put('/recipe/' + existing_recipe.name + '/' + existing_recipe.created_date)
          .send(new_recipe)
          .expect(409, done);
      });

      it('Returns a 400 if the URL params are invalid.', function(done) {
        request(app)
          .put('/recipe/' + invalid_recipe.name + '/' + invalid_recipe.created_date)
          .send(invalid_recipe)
          .expect(400, done);
      });

      it('Returns 200 if the recipe was successfully updated.', function(done) {
        request(app)
          .put('/recipe/' + existing_recipe.name + '/' + existing_recipe.created_date)
          .send(existing_recipe)
          .expect(200, done);
      });

    });

    describe('#DELETE', function() {

      it('Returns 200 if the recipe exists.', function(done) {
        request(app)
          .delete('/recipe/' + existing_recipe.name + '/' + existing_recipe.created_date)
          .expect(200)
          .expect(function(response) {
            var validation = recipe.validate(response.body);
            if (validation) throw new Error('Returned invalid recipe.');
          })
          .end(done);
      });

      it('Returns 404 if the recipe doesn\'t exist,', function(done) {
        request(app)
          .delete('/recipe/' + new_recipe.name + '/' + new_recipe.created_date)
          .expect(404, done);
      });
    });
  });
});
