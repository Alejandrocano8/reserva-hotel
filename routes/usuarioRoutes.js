const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', usuarioController.registroUsuario);
router.post('/login', usuarioController.loginUsuario);

// Rutas protegidas
router.get('/perfil', verifyToken, usuarioController.obtenerPerfil);

module.exports = router;
