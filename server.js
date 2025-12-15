'use strict';

const express = require('express');
const cors = require('cors');

const { runTests } = require('./test-runner');

const app = express();

// ✅ CORS global (incluye preflight)
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use('/public', express.static(process.cwd() + '/public'));

// Home
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// ✅ /hello (lo usan los tests)
app.get('/hello', function (req, res) {
  const name = req.query.name || 'Guest';
  res.status(200).send(`hello ${name}`);
});

// "DB"
const DB = {
  'Colombo': { name: 'Cristoforo', surname: 'Colombo', dates: '1451 - 1506' },
  'Vespucci': { name: 'Amerigo', surname: 'Vespucci', dates: '1454 - 1512' },
  'da Verrazzano': { name: 'Giovanni', surname: 'da Verrazzano', dates: '1485 - 1528' }
};

// ✅ PUT /travellers (FCC challenge)
app.put('/travellers', function (req, res) {
  const surname = (req.body && req.body.surname) ? String(req.body.surname) : '';
  const result = DB[surname] || { name: '', surname: surname || '', dates: '' };

  res
    .status(200)
    .type('application/json')
    .json(result);
});

// ✅ POST /travellers (para el form / Zombie)
app.post('/travellers', function (req, res) {
  const surname = (req.body && req.body.surname) ? String(req.body.surname) : '';
  const result = DB[surname] || { name: '', surname: surname || '', dates: '' };

  // Responder HTML que Zombie pueda leer con #name #surname #dates
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head><meta charset="UTF-8" /><title>Famous Italian Explorers</title></head>
      <body>
        <h1>Famous Italian Explorers</h1>

        <form action="/travellers" method="POST">
          <label for="surname">Surname:</label>
          <input id="surname" name="surname" type="text" value="${surname.replace(/"/g, '&quot;')}" />
          <button type="submit">submit</button>
        </form>

        <hr />

        <h2>Result</h2>
        <p>Name: <span id="name">${result.name}</span></p>
        <p>Surname: <span id="surname">${result.surname}</span></p>
        <p>Dates: <span id="dates">${result.dates}</span></p>
      </body>
    </html>
  `);
});

// ✅ ENDPOINT CRÍTICO PARA FCC: /_api/get-tests
app.get('/_api/get-tests', function (req, res) {
  res.set('Cache-Control', 'no-store');

  const type = req.query.type;      // e.g. "functional"
  const n = Number(req.query.n);    // e.g. 2

  runTests(function (err, tests) {
    if (err) {
      return res.status(500).json([{ title: 'runner error', state: 'failed', err: String(err) }]);
    }

    const isFunctional = (t) => (t.fullTitle || '').startsWith('Functional Tests');
    const isUnit = (t) => !isFunctional(t);

    let out = tests;
    if (type === 'functional' || n === 2) out = tests.filter(isFunctional);
    if (type === 'unit' || n === 1) out = tests.filter(isUnit);

    return res.status(200).json(out);
  });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

module.exports = app;
