const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacionController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', habitacionController.obtenerHabitaciones);
router.get('/:id', habitacionController.obtenerHabitacionById);
router.get('/disponibles/search', habitacionController.obtenerHabitacionesDisponibles);

// Rutas de admin
router.post('/', verifyAdmin, habitacionController.crearHabitacion);
router.put('/:id/estado', verifyAdmin, habitacionController.actualizarEstadoHabitacion);
router.get('/admin/resumen', verifyAdmin, habitacionController.obtenerResumenHabitaciones);

module.exports = router;
