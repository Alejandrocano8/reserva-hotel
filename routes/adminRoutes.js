const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

// Todas las rutas de admin requieren verificación de admin
router.get('/dashboard', verifyAdmin, adminController.obtenerDashboard);
router.get('/reporte/habitaciones', verifyAdmin, adminController.obtenerReporteHabitaciones);
router.get('/reporte/usuarios', verifyAdmin, adminController.obtenerReporteUsuarios);
router.post('/mantenimiento', verifyAdmin, adminController.registrarMantenimiento);
router.put('/mantenimiento/:id/completar', verifyAdmin, adminController.completarMantenimiento);
router.delete('/usuarios/:id', verifyAdmin, adminController.eliminarUsuario);

module.exports = router;
