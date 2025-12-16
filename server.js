const express = require('express');
const cors = require('cors');
const app = express();

// MIDDLEWARE
app.use(cors({ origin: '*' }));
app.use(express.json()); // ← IMPORTANTE para procesar JSON en el body
app.use(express.urlencoded({ extended: true }));

// FREECODECAMP TEST ROUTES
const fccTestingRoutes = require('./fcc-testing.js');
fccTestingRoutes(app);

// RUTA BASE
app.get('/', (req, res) => {
  res.send('✔ Servidor en Línea y funcionando correctamente ✔');
});

// ENDPOINT DEL CHALLENGE
// ======================
app.put('/travellers', (req, res) => {
  const surname = req.body.surname;
  let response;

  if (surname === 'Colombo') {
    response = {
      name: 'Cristoforo',
      surname: 'Colombo'
    };
  } else if (surname === 'da Verrazzano') {
    response = {
      name: 'Giovanni',
      surname: 'da Verrazzano'
    };
  } else {
    response = {
      name: 'unknown',
      surname: 'unknown'
    };
  }

  res
    .status(200)
    .type('application/json') // ← CLAVE para pasar los tests
    .json(response);
});

// PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
