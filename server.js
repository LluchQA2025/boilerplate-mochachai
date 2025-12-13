'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
const runner = require('./test-runner');
const bodyParser = require('body-parser');

// CORS (FCC)
app.use(cors({ optionsSuccessStatus: 200 }));

// Parsers estándar
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

// OPTIONS preflight (por si FCC lo dispara)
app.options('/travellers', cors(), function (req, res) {
  res.sendStatus(200);
});

// PUT /travellers
// IMPORTANTE: agregamos un parser de texto SOLO para esta ruta,
// para soportar cuando llegue JSON SIN Content-Type.
app.put('/travellers', bodyParser.text({ type: '*/*' }), function (req, res) {
  let payload = req.body;

  // Si body-parser ya lo parseó como objeto (application/json), OK.
  // Si llegó como texto (sin Content-Type), intentamos JSON.parse.
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      payload = {};
    }
  }

  const surnameRaw = payload && payload.surname ? String(payload.surname) : '';
  const surname = surnameRaw.toLowerCase();

  let data = { name: 'unknown' };

  switch (surname) {
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

  // Respuesta EXACTA para FCC:
  // - Content-Type: application/json (sin charset)
  // - body JSON
  // - No-cache para evitar respuestas viejas por Cloudflare/Render
  const json = JSON.stringify(data);

  res.status(200);
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  res.send(Buffer.from(json));
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

  if (n !== undefined) return out[n] || out;
  return out;
}
