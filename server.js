'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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

        <!-- Estos IDs son clave para Zombie.js -->
        <div id="result">
          <span id="name">${name}</span>
          <span id="surname">${surname}</span>
        </div>
      </body>
    </html>
  `;
}

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

  // Para el challenge PUT, FCC espera:
  // - Colombo -> Cristoforo
  // - da Verrazzano -> Giovanni
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

  // Importante: devolvemos UNA página que sigue teniendo el form + result (#name/#surname)
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
      // OK si no existe en algún entorno
    }
  });
}

module.exports = app;
