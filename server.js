const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const explorers = {
  'colombo': {
    name: 'Cristoforo',
    surname: 'Colombo',
    dates: '1451 - 1506'
  },
  'da verrazzano': {
    name: 'Giovanni',
    surname: 'da Verrazzano',
    dates: '1485 - 1528'
  },
  'vespucci': {
    name: 'Amerigo',
    surname: 'Vespucci',
    dates: '1454 - 1512'
  }
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.put('/travellers', (req, res) => {
  const surname = req.body.surname;
  const key = surname.toLowerCase();
  const traveller = explorers[key];

  if (!traveller) {
    return res.status(404).json({ error: 'Not Found' });
  }

  res.json(traveller);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor escuchando en puerto ${listener.address().port}`);
});

// Forzando redeploy para FCC
module.exports = app;
