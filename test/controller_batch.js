var request = require('supertest'),
    app = require('./../app.js'),
    expect = require('chai').expect,
    batch = require('./../models/batch.js'),
    recipe = require('./../models/recipe.js');

var existing_batch = {
  recipe_name: 'testname',
  created_date: 1451106666,
  recipe_created_date: 1451104366,
  notes: [ 'notes uno', 'notes dos' ],
  bottles: ['1234', '1235']
};

var new_batch = {
  recipe_name: 'testname',
  created_date: 1451105555,
  recipe_created_date: 1451104366,
  notes: [ 'notes uno', 'notes dos' ],
  bottles: ['1238', '1239']
};

var new_batch_no_recipe = {
  recipe_name: 'newtestrecipename',
  created_date: 1451104866,
  recipe_created_date: 1451104399,
  notes: [ 'notes uno', 'notes dos' ],
  bottles: ['1238', '1239']
};

var invalid_batch = {
  recipe_name: 'invalidtestrecipename',
  created_date: '14511 04866',
  recipe_created_date: 1451104366,
  notes: [ '', 'notes dos' ],
  bottles: ['1238', '1239']
};

var existing_recipe = {
  name: 'testname',
  created_date: 1451104366,
  ingredients: [ 'ingredients one', 'super ingredient 2' ],
  directions: [ 'directions uno', 'directions dos' ],
  batches: ['1234', '1451106666']
};

describe('Requests to the path /batch', function() {

  beforeEach(function(done) {
    recipe.put(existing_recipe, function(err, data) {
      batch.put(existing_batch, function(err, data) {
        done();
      });
    });
  });

  afterEach(function(done) {
    recipe.delete(existing_recipe.name, existing_recipe.created_date, function(err, data) {
      batch.list(function(err, data) {
        var total_count = data.length,
            finished_count = 0;
        if (total_count === 0) done();
        for(var i=0; i<total_count; i++) {
          batch.delete(data[i].recipe_name, data[i].created_date, function(err, data) {
            finished_count++;
            if (finished_count == total_count) done();
          });
        }
      });
    });
  });

  describe('/', function() {
    describe('#POST', function() {
      describe('Error cases', function() {

        it('Returns a 404 if the associated recipe doesn\'t exist', function(done) {
          request(app)
            .post('/batch')
            .send(new_batch_no_recipe)
            .expect(404, done);
        });

        it('Returns a 400 if the batch is invalid', function(done) {
          request(app)
            .post('/batch')
            .send(invalid_batch)
            .expect(400, done);
        });

        it('Returns a 409 if the batch ID already exists', function(done) {
          request(app)
            .post('/batch')
            .send(existing_batch)
            .expect(409, done);
        });
      });

      describe('Success cases', function() {

        it('Updates the relevant recipe when the batch is created', function(done) {
          request(app)
            .post('/batch')
            .send(new_batch)
            .expect(201)
            .expect(function(response) {
              recipe.get(new_batch.recipe_name, new_batch.recipe_created_date, function(err, got_recipe) {
                expect(got_recipe).to.include.keys('batches');
                expect(got_recipe.batches).to.be.an('Array');
                expect(got_recipe.batches.length).to.equal(3);
              });
            })
            .end(done);
        });
      });
    });
  });


  describe('/batch/:recipe_name/:created_date', function() {
    describe('#DELETE', function() {

      it('Returns a 404 if the batch does not exist.', function(done) {
        request(app)
          .delete('/batch/doesnt_exist/1234321')
          .expect(404, done);
      });

      it('Returns a 200 if the batch exists, and successfully deletes.', function(done) {
        request(app)
          .delete('/batch/' + existing_batch.recipe_name + '/' + existing_batch.created_date)
          .expect(200, done);
      });

      it('Successfully deleted batches are removed from the recipe', function(done) {
        request(app)
          .delete('/batch/' + existing_batch.recipe_name + '/' + existing_batch.created_date)
          .expect(200)
          .expect(function(response) {
            recipe.get(existing_batch.recipe_name, existing_batch.recipe_created_date, function(err, got_batch) {
              expect(got_batch.batches).not.to.contain(existing_batch.created_date);
              expect(got_batch.batches.length).to.equal(1);
            });
          })
          .end(done);
      });
    });
  });
});
