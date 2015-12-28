var request = require('supertest'),
    app = require('./../app.js'),
    expect = require('chai').expect,
    _ = require('underscore'),
    batch = require('./../models/batch.js'),
    recipe = require('./../models/recipe.js'),
    bottle = require('./../models/bottle.js');

var existing_bottle = {
  recipe_name: 'testname',
  created_date: 1451107777,
  recipe_created_date: 1451104366,
  batch_created_date: 1451106666,
  hash: 'ABCDEF',
  tester: 'test0@email.com'
};

var new_bottle = {
  recipe_name: 'testname',
  created_date: 1451107778,
  recipe_created_date: 1451104366,
  batch_created_date: 1451106666,
  hash: 'ABCDEF',
  tester: 'test0@email.com'
};

var existing_batch = {
  recipe_name: 'testname',
  created_date: 1451106666,
  recipe_created_date: 1451104366,
  notes: [ 'notes uno', 'notes dos' ],
  bottles: ['1234', '1451107777']
};

var existing_recipe = {
  name: 'testname',
  created_date: 1451104366,
  ingredients: [ 'ingredients one', 'super ingredient 2' ],
  directions: [ 'directions uno', 'directions dos' ],
  batches: ['1234', '1451106666']
};

describe('Requests to the path /bottle', function () {

  beforeEach(function(done) {
    recipe.put(existing_recipe, function(err, data) {
      batch.put(existing_batch, function(err, data) {
        bottle.put(existing_bottle, function(err, data) {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    recipe.delete(existing_recipe.name, existing_recipe.created_date, function(err, data) {
      batch.delete(existing_batch.recipe_name, existing_batch.created_date, function(err, data) {

        bottle.list(function(err, data) {
          var total_count = data.length,
              finished_count = 0;
          if (total_count === 0) done();
          for(var i=0; i<total_count; i++) {
            bottle.delete(data[i].recipe_name, data[i].created_date, function(err, data) {
              finished_count++;
              if (finished_count == total_count) done();
            });
          }
        });
      });
    });
  });

  describe('/', function() {
    describe('#POST', function() {
      describe('Error cases', function() {

        it('Returns a 404 if the associated recipe doesn\'t exist', function(done) {
          var new_bottle_no_recipe = _.clone(new_bottle);
          new_bottle_no_recipe.recipe_created_date = 1111111111;

          request(app)
            .post('/bottle')
            .send(new_bottle_no_recipe)
            .expect(404, done);
        });

        it('Returns a 404 if the associated batch doesn\'t exist', function(done) {
          var new_bottle_no_batch = _.clone(new_bottle);
          new_bottle_no_batch.batch_created_date = 1111111111;

          request(app)
            .post('/bottle')
            .send(new_bottle_no_batch)
            .expect(404, done);
        });

        it('Returns a 400 if the bottle is invalid', function(done) {
          var invalid_bottle = _.clone(new_bottle);
          invalid_bottle.hash = '123456';

          request(app)
            .post('/bottle')
            .send(invalid_bottle)
            .expect(400, done);
        });

        it('Returns a 409 if the bottle ID already exists', function(done) {
          request(app)
            .post('/bottle')
            .send(existing_bottle)
            .expect(409, done);
        });

        describe('Success case', function() {

          it('Updates the relevant batch when the bottle is created', function(done) {
            request(app)
              .post('/bottle')
              .send(new_bottle)
              .expect(201)
              .expect(function(response) {
                batch.get(new_bottle.recipe_name, new_bottle.batch_created_date, function(err, got_batch) {
                  expect(got_batch).to.include.keys('bottles');
                  expect(got_batch.bottles).to.be.an('Array');
                  expect(got_batch.bottles.length).to.equal(3);
                });
              })
              .end(done);
          });

        });
      });
    });
  });

  describe('/:recipe_name/:created_date', function() {
    describe('/#DELETE', function() {

      it('Returns a 404 if the bottle is not found', function(done) {
        request(app)
          .delete('/bottle/' + existing_bottle.recipe_name + '/1111111111')
          .expect(404, done);
      });

      it('Returns a 200 if the bottle is found, and the bottle is successfull removed from the batch.', function(done) {
        request(app)
          .delete('/bottle/' + existing_bottle.recipe_name + '/' + existing_bottle.created_date)
          .expect(200)
          .expect(function(response) {
            batch.get(existing_bottle.recipe_name, existing_bottle.batch_created_date, function(err, got_batch) {
              expect(got_batch).to.include.keys('bottles');
              expect(got_batch.bottles).to.be.an('Array');
              expect(got_batch.bottles.length).to.equal(1);
            });
          })
          .end(done);
      });

    });
  });
});
