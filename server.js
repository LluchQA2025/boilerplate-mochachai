'use strict';

const express = require('express');
const cors = require('cors');

const runner = require('./test-runner');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/public', express.static(process.cwd() + '/public'));

// Home page
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Required for chai-http tests
app.get('/hello', function (req, res) {
  const name = req.query.name || 'Guest';
  res.type('text').send(`hello ${name}`);
});

// Data source
function getTravellerBySurname(surname) {
  const data = {
    Colombo: { name: 'Cristoforo', surname: 'Colombo', dates: '1451 - 1506' },
    'da Verrazzano': { name: 'Giovanni', surname: 'da Verrazzano', dates: '1485 - 1528' },
    Vespucci: { name: 'Amerigo', surname: 'Vespucci', dates: '1454 - 1512' },
    Polo: { name: 'Marco', surname: 'Polo', dates: '1254 - 1324' }
  };
  return data[surname] || { name: '', surname: '', dates: '' };
}

// POST for Zombie.js (HTML form)
app.post('/travellers', function (req, res) {
  const surname = req.body.surname || '';
  const result = getTravellerBySurname(surname);

  res.type('html').send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Famous Italian Explorers</title>
      </head>
      <body>
        <h1>Famous Italian Explorers</h1>

        <form action="/travellers" method="POST">
          <label for="surname-input">Surname:</label>
          <input id="surname-input" name="surname" type="text" />
          <input id="submit" name="submit" type="submit" value="submit" />
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

// PUT for chai-http
app.put('/travellers', function (req, res) {
  const surname = req.body.surname || '';
  const result = getTravellerBySurname(surname);
  res.json(result);
});

// FCC endpoint (array plano)
app.get('/_api/get-tests', function (req, res) {
  res.set('Cache-Control', 'no-store');
  runner.run();
  runner.once('done', (tests) => res.json(tests));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

module.exports = app;
