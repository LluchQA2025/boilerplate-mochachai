'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// ====== FCC boilerplate: assertion analyser (necesario para /_api/get-tests) ======
const analyser = require('./assertion-analyser');

// ========= CORS (para que FCC pueda llamar endpoints) =========
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ========= MIDDLEWARES =========
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========= HELPERS =========
function explorerNameBySurname(surname) {
  if (surname === 'Colombo') return 'Cristoforo';
  if (surname === 'Vespucci') return 'Amerigo';
  if (surname === 'da Verrazzano') return 'Giovanni';
  return '';
}

function renderPage(name = '', surname = '') {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Famous Italian Explorers</title>
      </head>
      <body>
        <h1>Famous Italian Explorers</h1>

        <form action="/travellers" method="POST">
          <label for="surname">Surname</label>
          <input id="surname" name="surname" type="text" />
          <input id="submit" name="submit" type="submit" value="submit" />
        </form>

        <hr />

        <div id="result">
          <span id="name">${name}</span>
          <span id="surname">${surname}</span>
        </div>
      </body>
    </html>
  `;
}

// ========= FCC REQUIRED ROUTE =========
// freeCodeCamp llama esto para obtener los tests a ejecutar
app.get('/_api/get-tests', (req, res) => {
  res.json(analyser.getTests());
});

// ========= ROUTES =========
app.get('/', (req, res) => {
  res.status(200).type('html').send(renderPage());
});

app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.type('text').send('hello ' + name);
});

// ===== FCC CHALLENGE (chai-http PUT) =====
app.put('/travellers', (req, res) => {
  const surname = req.body.surname;
  const name = explorerNameBySurname(surname);

  res.status(200).json({
    name,
    surname
  });
});

// ===== Para el FORM (Zombie.js) =====
app.post('/travellers', (req, res) => {
  const surname = req.body.surname;
  const name = explorerNameBySurname(surname);

  res.status(200).type('html').send(renderPage(name, surname));
});

// ========= START SERVER =========
const port = process.env.PORT || 3000;

if (!module.parent) {
  app.listen(port, () => {
    console.log('Listening on port ' + port);

    try {
      const runner = require('./test-runner');
      runner.run();
    } catch (e) {
      // OK
    }
  });
}

module.exports = app;
