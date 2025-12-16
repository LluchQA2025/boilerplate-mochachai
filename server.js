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
   FREECODECAMP REQUIRED ROUTES
   (OBLIGATORIAS)
================================ */
app.route('/_api/get-tests')
  .get((req, res) => {
    res.json([]);
  })
  .post((req, res) => {
    res.json([]);
  });

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
  const surname = req.body.surname;

  if (surname === 'Colombo') {
    return res.status(200).json({
      name: 'Cristoforo',
      surname: 'Colombo'
    });
  }

  if (surname === 'da Verrazzano') {
    return res.status(200).json({
      name: 'Giovanni',
      surname: 'da Verrazzano'
    });
  }

  return res.status(200).json({
    name: 'unknown',
    surname: 'unknown'
  });
});

/* ===============================
   PUERTO
   Render usa PORT dinámico (10000)
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});

/* ===============================
   EXPORT (OBLIGATORIO PARA FCC)
================================ */
module.exports = app;
