'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/hello', function (req, res) {
  const name = req.query.name || 'Guest';
  res.send('hello ' + name);
});

// ✅ Respuesta al método PUT
app.put('/travellers', function (req, res) {
  let surname = req.body.surname;

  let name, dates;
  switch (surname) {
    case 'Colombo':
      name = 'Cristoforo';
      dates = '1451 - 1506';
      break;
    case 'da Verrazzano':
      name = 'Giovanni';
      dates = '1485 - 1528';
      break;
    default:
      name = 'unknown';
      dates = 'unknown';
  }

  res.json({
    name: name,
    surname: surname,
    dates: dates
  });
});

module.exports = app;
