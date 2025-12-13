'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const runner = require('./test-runner');

// CORS
app.use(cors());

// Parsers normales (cuando SÍ viene Content-Type correcto)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Fallback (cuando NO viene Content-Type o viene raro)
// OJO: va DESPUÉS de json/urlencoded para no “robarse” esos casos.
app.use(express.text({ type: '*/*' }));

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

// ✅ PUT /travellers (FCC FIX DEFINITIVO)
app.put('/travellers', function (req, res) {
  let surname;

  // 1) Si express.json/urlencoded parseó a objeto:
  if (req.body && typeof req.body === 'object') {
    surname = req.body.surname;
  }

  // 2) Si llegó como texto (SIN header o tipo desconocido)
  if (!surname && typeof req.body === 'string') {
    const raw = req.body.trim();

    // 2a) Intentar JSON puro: {"surname":"Colombo"}
    if (raw.startsWith('{')) {
      try {
        const parsed = JSON.parse(raw);
        surname = parsed && parsed.surname;
      } catch (e) {
        // ignore
      }
    }

    // 2b) Intentar urlencoded: surname=Colombo
    if (!surname && raw.includes('=')) {
      try {
        const params = new URLSearchParams(raw);
        surname = params.get('surname');
      } catch (e) {
        // ignore
      }
    }
  }

  let data = { name: 'unknown' };

  if (surname) {
    switch (String(surname).toLowerCase()) {
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

  // FCC pide res.type === 'application/json'
  res.status(200);
  res.set('Content-Type', 'application/json');
  res.send(Buffer.from(JSON.stringify(data)));
});

// FCC test endpoint
let error;
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
      out = tests.filter((t) => !t.context.match('Functional Tests'));
      break;
    case 'functional':
      out = tests.filter((t) => t.context.match('Functional Tests'));
      break;
    default:
      out = tests;
  }
  return n !== undefined ? out[n] || out : out;
}
