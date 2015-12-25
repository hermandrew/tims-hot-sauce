var request = require('supertest'),
    app = require('./../app');

describe('A request to the root path', function() {

  it('returns a 200 status code', function(done) {

    request(app)
      .get('/')
      .expect(200, done);
  });

  it('returns an HTML format', function(done) {

    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);

  });

});
