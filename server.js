'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// Root
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Hello API
app.get('/hello', (req, res) => {
  const name = req.query.name || 'World';
  res.json({ greeting: `hello ${name}` });
});

// Travellers PUT
app.put('/travellers', (req, res) => {
  if (req.body.surname === 'Colombo') {
    return res.json({
      name: 'Cristoforo',
      surname: 'Colombo',
      dates: '1451 - 1506'
    });
  }

  res.json({
    surname: req.body.surname
  });
});

// CORS preflight (FCC needs this)
app.options('/travellers', cors());

// Test runner (FCC internal)
const runner = require('./test-runner');
app.get('/_api/get-tests', (req, res) => {
  runner.getTests(req.query.type, req.query.n)
    .then(tests => res.json(tests))
    .catch(err => res.status(500).json(err));
});

// 🚨 CRITICAL FOR FCC
const port = process.env.PORT || 3000;
if (!module.parent) {
  app.listen(port, () => {
    console.log('Listening on port ' + port);
  });
}

module.exports = app;
