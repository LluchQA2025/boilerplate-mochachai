'use strict';

const express = require('express');
const cors = require('cors');

const app = express();

/* =====================
   CORS — CRÍTICO PARA FCC
   ===================== */
app.use(cors());
app.options('*', cors());

/* =====================
   Body parsing
   ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   HOME
   ===================== */
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

/* =====================
   HELLO (FCC requerido)
   ===================== */
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.type('text').send(`hello ${name}`);
});

/* =====================
   DATA
   ===================== */
function getTraveller(surname) {
  const data = {
    Colombo: { name: 'Cristoforo', surname: 'Colombo', dates: '1451 - 1506' },
    Vespucci: { name: 'Amerigo', surname: 'Vespucci', dates: '1454 - 1512' },
    'da Verrazzano': { name: 'Giovanni', surname: 'da Verrazzano', dates: '1485 - 1528' }
  };
  return data[surname] || { name: '', surname: '', dates: '' };
}

/* =====================
   POST (Zombie.js)
   ===================== */
app.post('/travellers', (req, res) => {
  const r = getTraveller(req.body.surname || '');
  res.send(`
    <h1>Famous Italian Explorers</h1>
    <form action="/travellers" method="POST">
      <label for="surname-input">Surname:</label>
      <input id="surname-input" name="surname" />
      <input id="submit" type="submit" value="submit" />
    </form>
    <hr />
    <h2>Result</h2>
    <p>Name: <span id="name">${r.name}</span></p>
    <p>Surname: <span id="surname">${r.surname}</span></p>
    <p>Dates: <span id="dates">${r.dates}</span></p>
  `);
});

/* =====================
   PUT — FCC CHALLENGE
   ===================== */
app.put('/travellers', (req, res) => {
  const result = getTraveller(req.body.surname || '');

  res
    .status(200)
    .set('Content-Type', 'application/json')
    .json(result);
});

/* =====================
   START
   ===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

module.exports = app;
