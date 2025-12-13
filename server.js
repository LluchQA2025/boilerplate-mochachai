'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
const runner = require('./test-runner');
const bodyParser = require('body-parser');

// CORS (FCC)
app.use(cors());

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Home
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Static assets
app.use(express.static(__dirname + '/public'));

// Hello endpoint
app.get('/hello', function (req, res) {
  const name = req.query.name || 'Guest';
  res.type('txt').send('hello ' + name);
});

// OPTIONS preflight (por si FCC lo hace)
app.options('/travellers', cors());

// PUT /travellers (FCC strict)
app.put('/travellers', function (req, res) {
  // 1) Obtener surname aunque venga "mal" (sin header JSON)
  let surname;

  // Caso normal: application/json
  if (req.body && typeof req.body === 'object' && req.body.surname) {
    surname = req.body.surname;
  }

  // Caso FCC/curl sin header: bodyParser.urlencoded puede dejarlo como:
  // { '{"surname":"Colombo"}': '' }
  if (!surname && req.body && typeof req.body === 'object') {
    const keys = Object.keys(req.body);
    if (keys.length === 1) {
      const onlyKey = keys[0];
      try {
        const parsed = JSON.parse(onlyKey);
        if (parsed && parsed.surname) surname = parsed.surname;
      } catch (e) {
        // ignore
      }
    }
  }

  // Caso rarísimo: req.body string
  if (!surname && typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      if (parsed && parsed.surname) surname = parsed.surname;
    } catch (e) {
      // ignore
    }
  }

  // 2) Resolver respuesta
  let data = { name: 'unknown' };

  if (surname) {
    switch (surname.toLowerCase()) {
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
      default:
        data = { name: 'unknown' };
    }
  }

  // 3) CLAVE: Content-Type EXACTO (sin charset)
  res.status(200);
  res.set('Content-Type', 'application/json');
  return res.send(JSON.stringify(data));
});

let error;

// FCC test endpoint
app.get(
  '/_api/get-tests',
  cors(),
  function (req, res, next) {
    if (error) return res.json({ status: 'unavailable' });
    next();
  },
  function (req, res, next) {
    if (!runner.report) return next();
    res.json(testFilter(runner.report, req.query.type, req.query.n));
  },
  function (req, res) {
    runner.on('done', function () {
      process.nextTick(() =>
        res.json(testFilter(runner.report, req.query.type, req.query.n))
      );
    });
  }
);

// Server start
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
  console.log('Running Tests...');
  setTimeout(function () {
    try {
      runner.run();
    } catch (e) {
      error = e;
      console.log('Tests are not valid:');
      console.log(error);
    }
  }, 1500);
});

module.exports = app;

// Test filter helper
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

  if (n !== undefined) {
    return out[n] || out;
  }
  return out;
}
