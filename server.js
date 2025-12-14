'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET /hello
app.get('/hello', function (req, res) {
  const name = req.query.name || 'Guest';
  res.send(`hello ${name}`);
});

// PUT /travellers  ✅ ESTE ES EL CLAVE
app.put('/travellers', function (req, res) {
  const surname = req.body.surname;

  let name = '';

  if (surname === 'Colombo') {
    name = 'Cristoforo';
  } else if (surname === 'Vespucci') {
    name = 'Amerigo';
  } else if (surname === 'da Verrazzano') {
    name = 'Giovanni';
  }

  res.json({
    name: name,
    surname: surname
  });
});

// Start server
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + listener.address().port);
});

module.exports = app;
