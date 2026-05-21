require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const habitacionRoutes = require('./routes/habitacionRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/admin', adminRoutes);

// Ruta para servir la landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para dashboard de admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Ruta para dashboard de usuario
app.get('/usuario', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'usuario.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
