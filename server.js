const express = require('express');
const cors = require('cors');
const app = express();

// Middleware CORS para permitir solicitudes de FreeCodeCamp
app.use(cors({ origin: '*' }));

// Middleware para analizar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Activar pruebas siempre que se despliegue en Render
const fccTestingRoutes = require('./fcc-testing.js');
fccTestingRoutes(app); // activa rutas como /_api/get-tests

// Ruta base
app.get('/', (req, res) => {
  res.send('✔ Servidor en línea');
});

// Puerto dinámico (Render) o 3000 local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

module.exports = app; // para pruebas
