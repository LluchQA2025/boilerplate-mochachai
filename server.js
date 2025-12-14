'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const runner = require('./test-runner');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Helper: devuelve el HTML con spans llenos (Zombie-friendly)
function renderHomePage(name = '', surname = '') {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Automated Testing</title>
      </head>
      <body>
        <h1>Automated Testing</h1>

        <form action="/travellers" method="post">
          <input name="surname" placeholder="surname" />
          <button id="submit" type="submit">submit</button>
        </form>

        <p>Name: <span id="name">${name || ''}</span></p>
        <p>Surname: <span id="surname">${surname || ''}</span></p>
      </body>
    </html>
  `;
}

// HOME: Zombie visita "/" y debe devolver 200 + HTML con form y spans
app.get('/', (req, res) => {
  res.status(200).send(renderHomePage());
});

// --- FCC get-tests endpoint (boilerplate-style) ---
function testFilter(tests, type, n) {
  let out = tests;
  if (type && type !== 'all') {
    out = out.filter(t => t.context && t.context.match(type));
  }
  if (n !== undefined) {
    return out[n] || out; // n es index 0-based en el boilerplate
  }
  return out;
}

app.get('/_api/get-tests', cors(), (req, res) => {
  const type = req.query.type;
  const n = req.query.n;

  if (!runner.report) {
    runner.on('done', () => res.json(testFilter(runner.report, type, n)));
  } else {
    res.json(testFilter(runner.report, type, n));
  }
});

// GET /hello
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(`hello ${name}`);
});

// Helper para mapear apellidos
function getExplorerBySurname(rawSurname) {
  const raw = rawSurname ? String(rawSurname) : '';
  const s = raw.trim().toLowerCase();

  if (s === 'colombo') return { name: 'Cristoforo', surname: 'Colombo' };
  if (s === 'vespucci') return { name: 'Amerigo', surname: 'Vespucci' };
  if (s === 'da verrazzano') return { name: 'Giovanni', surname: 'da Verrazzano' };

  // fallback
  return { name: '', surname: raw.trim() };
}

// PUT /travellers (chai-http tests)
app.put('/travellers', (req, res) => {
  const result = getExplorerBySurname(req.body && req.body.surname);
  res.json(result);
});

// POST /travellers (Zombie form: devuelve HTML con spans llenos)
app.post('/travellers', (req, res) => {
  const result = getExplorerBySurname(req.body && req.body.surname);
  res.status(200).send(renderHomePage(result.name, result.surname));
});

// Start server + run tests
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Listening on port ' + port);
  setTimeout(() => {
    console.log('Running Tests...');
    runner.run();
  }, 1500);
});

module.exports = app;
