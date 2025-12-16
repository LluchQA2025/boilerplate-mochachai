const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const assert = chai.assert;

chai.use(chaiHttp);

describe('Functional Tests', function () {
  // ✅ Test 1: GET /hello sin parámetro
  it('Test GET /hello with no name', function (done) {
    chai
      .request(server)
      .get('/hello')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'hello Guest');
        done();
      });
  });

  // ✅ Test 2: GET /hello con tu nombre
  it('Test GET /hello with your name', function (done) {
    chai
      .request(server)
      .get('/hello?name=Francisco')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'hello Francisco');
        done();
      });
  });

  // ✅ Test 3: PUT /travellers con Colombo
  it('Send {surname: "Colombo"}', function (done) {
    chai
      .request(server)
      .put('/travellers')
      .send({ surname: 'Colombo' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.name, 'Cristoforo');
        assert.equal(res.body.surname, 'Colombo');
        done();
      });
  });

  // ✅ Test 4: PUT /travellers con da Verrazzano
  it('Send {surname: "da Verrazzano"}', function (done) {
    chai
      .request(server)
      .put('/travellers')
      .send({ surname: 'da Verrazzano' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.name, 'Giovanni');
        assert.equal(res.body.surname, 'da Verrazzano');
        done();
      });
  });
});
