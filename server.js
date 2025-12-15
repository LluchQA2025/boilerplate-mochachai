'use strict';

const express = require('express');
const cors = require('cors');

const app = express();

// ✅ CORS explícito (clave para FCC)
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Required for FCC / chai-http
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.type('text').send(`hello ${name}`);
});

// Data
function getTravellerBySurname(surname) {
  const data = {
    Colombo: { name: 'Cristoforo', surname: 'Colombo', dates: '1451 - 1506' },
    'da Verrazzano': { name: 'Giovanni', surname: 'da Verrazzano', dates: '1485 - 1528' },
    Vespucci: { name: 'Amerigo', surname: 'Vespucci', dates: '1454 - 1512' },
    Polo: { name: 'Marco', surname: 'Polo', dates: '1254 - 1324' }
  };
  return data[surname] || { name: '', surname: '', dates: '' };
}

// ✅ POST for Zombie.js
app.post('/travellers', (req, res) => {
  const surname = req.body.surname || '';
  const r = getTravellerBySurname(surname);

  res.send(`
    <html>
      <body>
        <h1>Famous Italian Explorers</h1>
        <form action="/travellers" method="POST">
          <input id="surname-input" name="surname" />
          <input id="submit" type="submit" value="submit" />
        </form>
        <p>Name: <span id="name">${r.name}</span></p>
        <p>Surname: <span id="surname">${r.surname}</span></p>
        <p>Dates: <span id="dates">${r.dates}</span></p>
      </body>
    </html>
  `);
});

// ✅ PUT for freeCodeCamp (CRÍTICO)
app.put('/travellers', (req, res) => {
  const surname = req.body.surname || '';
  const result = getTravellerBySurname(surname);

  res
    .status(200)
    .type('application/json')
    .json(result);
});

// FCC evaluator endpoint
const runner = require('./test-runner');
app.get('/_api/get-tests', (req, res) => {
  res.set('Cache-Control', 'no-store');
  runner.run();
  runner.once('done', tests => res.json(tests));
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

module.exports = app;
