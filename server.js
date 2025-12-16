const express = require('express');
const cors = require('cors');
const app = express();

// Permitir CORS para cualquier origen
app.use(cors());

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Endpoint base
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Endpoint que espera un método PUT y devuelve un JSON específico
app.put('/travellers', (req, res) => {
  const surname = req.body.surname;

  let result;

  if (surname === 'Colombo') {
    result = { name: 'Cristoforo', surname: 'Colombo' };
  } else if (surname === 'da Verrazzano') {
    result = { name: 'Giovanni', surname: 'da Verrazzano' };
  } else {
    result = { name: 'unknown', surname: 'unknown' };
  }

  res.json(result);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Necesario para los tests
