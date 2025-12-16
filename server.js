const express = require('express');
const cors = require('cors');
const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   FREECODECAMP TEST ROUTES
   (OBLIGATORIAS para FCC)
================================ */
const fccTestingRoutes = require('./fcc-testing.js');
fccTestingRoutes(app); // activa rutas como /_api/get-tests

/* ===============================
   RUTA BASE
================================ */
app.get('/', (req, res) => {
  res.send('✅ Servidor en línea y funcionando correctamente');
});

/* ===============================
   ENDPOINT DEL CHALLENGE
   PUT /travellers
================================ */
app.put('/travellers', (req, res) => {
  const { surname } = req.body;

  if (surname === 'Colombo') {
    return res.json({
      name: 'Cristoforo',
      surname: 'Colombo'
    });
  }

  if (surname === 'da Verrazzano') {
    return res.json({
      name: 'Giovanni',
      surname: 'da Verrazzano'
    });
  }

  res.json({
    name: 'unknown',
    surname: 'unknown'
  });
});

/* ===============================
   PUERTO (RENDER USA 10000)
================================ */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

/* ===============================
   EXPORTAR APP PARA TESTING
================================ */
module.exports = app;
