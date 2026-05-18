const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Rutas protegidas para clientes
router.post('/', verifyToken, reservaController.crearReserva);
router.get('/mis-reservas', verifyToken, reservaController.obtenerMisReservas);
router.delete('/:id/cancelar', verifyToken, reservaController.cancelarReserva);

// Rutas de admin
router.get('/admin/todas', verifyAdmin, reservaController.obtenerTodasReservas);
router.put('/admin/:id/estado', verifyAdmin, reservaController.actualizarEstadoReserva);

module.exports = router;
