const { db } = require('../config/database');

// Obtener dashboard admin
exports.obtenerDashboard = (req, res) => {
  db.all(
    `SELECT 
      (SELECT COUNT(*) FROM usuarios) as total_usuarios,
      (SELECT COUNT(*) FROM habitaciones) as total_habitaciones,
      (SELECT COUNT(*) FROM reservas WHERE estado = 'activa') as reservas_activas,
      (SELECT COUNT(*) FROM habitaciones WHERE estado = 'disponible') as habitaciones_disponibles,
      (SELECT COUNT(*) FROM habitaciones WHERE estado = 'ocupada') as habitaciones_ocupadas,
      (SELECT COUNT(*) FROM habitaciones WHERE estado = 'mantenimiento') as habitaciones_mantenimiento`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener dashboard' });
      }
      res.json(result[0]);
    }
  );
};

// Obtener reporte de habitaciones
exports.obtenerReporteHabitaciones = (req, res) => {
  db.all(
    `SELECT 
      h.id,
      h.numero,
      h.tipo,
      h.estado,
      COUNT(r.id) as total_reservas,
      SUM(CASE WHEN r.estado = 'activa' THEN 1 ELSE 0 END) as reservas_activas
     FROM habitaciones h
     LEFT JOIN reservas r ON h.id = r.habitacion_id
     GROUP BY h.id`,
    (err, resultado) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener reporte' });
      }
      res.json(resultado);
    }
  );
};

// Obtener reporte de usuarios
exports.obtenerReporteUsuarios = (req, res) => {
  db.all(
    `SELECT 
      u.id,
      u.nombre,
      u.email,
      u.teléfono,
      COUNT(r.id) as total_reservas,
      u.fecha_registro
     FROM usuarios u
     LEFT JOIN reservas r ON u.id = r.usuario_id
     WHERE u.rol = 'cliente'
     GROUP BY u.id`,
    (err, resultado) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener reporte' });
      }
      res.json(resultado);
    }
  );
};

// Registrar mantenimiento
exports.registrarMantenimiento = (req, res) => {
  const { habitacion_id, fecha_inicio, fecha_fin, descripcion } = req.body;

  if (!habitacion_id) {
    return res.status(400).json({ error: 'ID de habitación requerido' });
  }

  db.run(
    'INSERT INTO mantenimiento (habitacion_id, fecha_inicio, fecha_fin, descripcion) VALUES (?, ?, ?, ?)',
    [habitacion_id, fecha_inicio, fecha_fin, descripcion],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar mantenimiento' });
      }

      // Actualizar estado de habitación a mantenimiento
      db.run(
        'UPDATE habitaciones SET estado = "mantenimiento" WHERE id = ?',
        [habitacion_id]
      );

      res.status(201).json({ 
        mensaje: 'Mantenimiento registrado',
        mantenimiento_id: this.lastID 
      });
    }
  );
};

// Completar mantenimiento
exports.completarMantenimiento = (req, res) => {
  const { id } = req.params;

  db.get('SELECT habitacion_id FROM mantenimiento WHERE id = ?', [id], (err, mantenimiento) => {
    if (!mantenimiento) {
      return res.status(404).json({ error: 'Mantenimiento no encontrado' });
    }

    db.run(
      'UPDATE mantenimiento SET estado = "completado" WHERE id = ?',
      [id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al completar mantenimiento' });
        }

        // Actualizar habitación a disponible
        db.run(
          'UPDATE habitaciones SET estado = "disponible" WHERE id = ?',
          [mantenimiento.habitacion_id]
        );

        res.json({ mensaje: 'Mantenimiento completado' });
      }
    );
  });
};
