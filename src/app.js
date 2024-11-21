const express = require('express');
const app = express();

// Configura un puerto
const PORT = 3000;

// Define una ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola, Este es un proyecto de Express!');
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
