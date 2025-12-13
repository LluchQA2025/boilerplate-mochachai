'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const runner = require('./test-runner');

// ⚠️ FCC: aceptar body con o SIN Content-Type
app.use(express.text({ type: '*/*' }));
app.use(express.json({ type: '*/*' }));

app.use(cors());

// Home
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Static
app.use(express.static(__dirname + '/public'));

// Hello
app.get('/hello', function (req, res) {
  const name = req.query.name || 'Guest';
  res.type('txt').send('hello ' + name);
});

// ✅ PUT /travellers — FIX FINAL FCC
app.put('/travellers', function (req, res) {
  let body = req.body;

  // Si el body viene como string (sin header), parsear manualmente
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  let data = { name: 'unknown' };

  if (body && body.surname) {
    switch (String(body.surname).toLowerCase()) {
      case 'polo':
        data = { name: 'Marco', surname: 'Polo', dates: '1254 - 1324' };
        break;
      case 'colombo':
        data = { name: 'Cristoforo', surname: 'Colombo', dates: '1451 - 1506' };
        break;
      case 'vespucci':
        data = { name: 'Amerigo', surname: 'Vespucci', dates: '1454 - 1512' };
        break;
      case 'da verrazzano':
      case 'verrazzano':
        data = { name: 'Giovanni', surname: 'da Verrazzano', dates: '1485 - 1528' };
        break;
    }
  }

  // ⚠️ FCC exige EXACTO: application/json (sin charset)
  const payload = Buffer.from(JSON.stringify(data));
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(payload);
});

// FCC test endpoint
let error;
app.get('/_api/get-tests', cors(), function (req, res, next) {
  if (error) return res.json({ status: 'unavailable' });
  next();
}, function (req, res, next) {
  if (!runner.report) return next();
  res.json(testFilter(runner.report, req.query.type, req.query.n));
}, function (req, res) {
  runner.on('done', function () {
    process.nextTick(() =>
      res.json(testFilter(runner.report, req.query.type, req.query.n))
    );
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
  console.log('Running Tests...');
  setTimeout(() => runner.run(), 1500);
});

module.exports = app;

function testFilter(tests, type, n) {
  let out;
  switch (type) {
    case 'unit':
      out = tests.filter(t => !t.context.match('Functional Tests'));
      break;
    case 'functional':
      out = tests.filter(t => t.context.match('Functional Tests'));
      break;
    default:
      out = tests;
  }
  return n !== undefined ? out[n] || out : out;
}
