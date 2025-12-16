const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Datos de prueba
const explorers = {
  colombo: {
    name: 'Cristoforo',
    surname: 'Colombo',
    dates: '1451 - 1506'
  },
  vespucci: {
    name: 'Amerigo',
    surname: 'Vespucci',
    dates: '1454 - 1512'
  },
  verranzano: {
    name: 'Giovanni',
    surname: 'Verrazzano',
    dates: '1485 - 1528'
  }
};

// Ruta GET para página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Ruta POST para formulario
app.post('/travellers', (req, res) => {
  const surname = req.body.surname?.toLowerCase();
  const data = explorers[surname];
  if (!data) {
    return res.status(404).send('Not Found');
  }
  res.json(data);
});

// ✅ Ruta PUT requerida por el challenge
app.put('/travellers', (req, res) => {
  const surname = req.body.surname?.toLowerCase();
  const data = explorers[surname];
  if (!data) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.status(200).json(data);
});

// Escuchar en el puerto adecuado para Render
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor escuchando en puerto ${listener.address().port}`);
});

// Exportar app para los tests
module.exports = app;
