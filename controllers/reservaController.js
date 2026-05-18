const { db } = require('../config/database');

// Crear reserva
exports.crearReserva = (req, res) => {
  const { habitacion_id, fecha_inicio, fecha_fin, notas } = req.body;
  const usuario_id = req.usuario.id;

  if (!habitacion_id || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Validar que la habitación esté disponible
  db.get(
    `SELECT * FROM habitaciones WHERE id = ? AND estado = 'disponible'`,
    [habitacion_id],
    (err, habitacion) => {
      if (!habitacion) {
        return res.status(400).json({ error: 'Habitación no disponible' });
      }

      // Verificar conflicto de fechas
      db.get(
        `SELECT * FROM reservas 
         WHERE habitacion_id = ? 
         AND estado = 'activa'
         AND fecha_fin >= ? 
         AND fecha_inicio <= ?`,
        [habitacion_id, fecha_inicio, fecha_fin],
        (err, reservaExistente) => {
          if (reservaExistente) {
            return res.status(400).json({ error: 'La habitación no está disponible en esas fechas' });
          }

          // Crear la reserva
          db.run(
            'INSERT INTO reservas (usuario_id, habitacion_id, fecha_inicio, fecha_fin, notas) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, habitacion_id, fecha_inicio, fecha_fin, notas],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Error al crear la reserva' });
              }

              // Actualizar estado de la habitación a ocupada
              db.run(
                'UPDATE habitaciones SET estado = "ocupada" WHERE id = ?',
                [habitacion_id]
              );

              res.status(201).json({
                mensaje: 'Reserva creada exitosamente',
                reserva_id: this.lastID,
                habitacion_id,
                fecha_inicio,
                fecha_fin
              });
            }
          );
        }
      );
    }
  );
};

// Obtener mis reservas
exports.obtenerMisReservas = (req, res) => {
  const usuario_id = req.usuario.id;

  db.all(
    `SELECT r.*, h.numero, h.tipo, h.precio_noche, h.descripcion, u.nombre, u.email, u.teléfono
     FROM reservas r
     JOIN habitaciones h ON r.habitacion_id = h.id
     JOIN usuarios u ON r.usuario_id = u.id
     WHERE r.usuario_id = ?
     ORDER BY r.fecha_inicio DESC`,
    [usuario_id],
    (err, reservas) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener reservas' });
      }
      res.json(reservas);
    }
  );
};

// Obtener todas las reservas (Admin)
exports.obtenerTodasReservas = (req, res) => {
  db.all(
    `SELECT r.*, h.numero, h.tipo, h.precio_noche, u.nombre, u.email, u.teléfono
     FROM reservas r
     JOIN habitaciones h ON r.habitacion_id = h.id
     JOIN usuarios u ON r.usuario_id = u.id
     ORDER BY r.fecha_inicio DESC`,
    (err, reservas) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener reservas' });
      }
      res.json(reservas);
    }
  );
};

// Cancelar reserva
exports.cancelarReserva = (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;

  db.get('SELECT * FROM reservas WHERE id = ? AND usuario_id = ?', [id, usuario_id], 
    (err, reserva) => {
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      db.run(
        'UPDATE reservas SET estado = "cancelada" WHERE id = ?',
        [id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error al cancelar reserva' });
          }

          // Actualizar estado de la habitación a disponible
          db.run(
            'UPDATE habitaciones SET estado = "disponible" WHERE id = ?',
            [reserva.habitacion_id]
          );

          res.json({ mensaje: 'Reserva cancelada correctamente' });
        }
      );
    }
  );
};

// Actualizar estado de reserva (Admin)
exports.actualizarEstadoReserva = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['activa', 'completada', 'cancelada'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  db.run(
    'UPDATE reservas SET estado = ? WHERE id = ?',
    [estado, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar estado' });
      }
      res.json({ mensaje: 'Estado de reserva actualizado' });
    }
  );
};
