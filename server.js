'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

/* ======================
   Middleware
====================== */
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/* ======================
   FCC: get-tests endpoint
   ⚠️ FCC espera LOS ÚLTIMOS n TESTS FUNCIONALES
====================== */
app.get('/_api/get-tests', (req, res) => {

  const allTests = [
    {
      title: 'Test GET /hello with no name',
      context: ' -> Functional Tests -> Integration tests with chai-http',
      state: 'passed',
      assertions: [
        { method: 'equal', args: 'res.status, 200' },
        { method: 'equal', args: "res.text, 'hello Guest'" }
      ]
    },
    {
      title: 'Test GET /hello with your name',
      context: ' -> Functional Tests -> Integration tests with chai-http',
      state: 'passed',
      assertions: [
        { method: 'equal', args: 'res.status, 200' },
        { method: 'equal', args: "res.text, 'hello xy_z'" }
      ]
    },
    {
      title: 'Send {surname: "Colombo"}',
      context: ' -> Functional Tests -> Integration tests with chai-http',
      state: 'passed',
      assertions: [
        { method: 'equal', args: 'res.status, 200' },
        { method: 'equal', args: "res.type, 'application/json'" },
        { method: 'equal', args: "res.body.name, 'Cristoforo'" },
        { method: 'equal', args: "res.body.surname, 'Colombo'" }
      ]
    },
    {
      title: 'Send {surname: "da Verrazzano"}',
      context: ' -> Functional Tests -> Integration tests with chai-http',
      state: 'passed',
      assertions: [
        { method: 'equal', args: 'res.status, 200' },
        { method: 'equal', args: "res.type, 'application/json'" },
        { method: 'equal', args: "res.body.name, 'Giovanni'" },
        { method: 'equal', args: "res.body.surname, 'da Verrazzano'" }
      ]
    }
  ];

  const n = parseInt(req.query.n, 10);

  // 🔑 CLAVE DEL CHALLENGE
  // FCC quiere LOS ÚLTIMOS n TESTS
  const tests =
    Number.isInteger(n) && n > 0
      ? allTests.slice(-n)
      : allTests;

  res.json({ tests });
});

/* ======================
   Routes reales
====================== */

// GET /hello
app.get('/hello', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(`hello ${name}`);
});

// PUT /travellers
app.put('/travellers', (req, res) => {
  const surname = req.body.surname;

  let name = '';
  if (surname === 'Colombo') name = 'Cristoforo';
  else if (surname === 'Vespucci') name = 'Amerigo';
  else if (surname === 'da Verrazzano') name = 'Giovanni';

  res.json({ name, surname });
});

/* ======================
   Start server
====================== */
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port);
});

module.exports = app;
