const { db } = require('../config/database');

// Obtener todas las habitaciones
exports.obtenerHabitaciones = (req, res) => {
  db.all('SELECT * FROM habitaciones', (err, habitaciones) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener habitaciones' });
    }
    res.json(habitaciones);
  });
};

// Obtener habitación por ID
exports.obtenerHabitacionById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM habitaciones WHERE id = ?', [id], (err, habitacion) => {
    if (err || !habitacion) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }
    res.json(habitacion);
  });
};

// Obtener habitaciones disponibles en un rango de fechas (Admin)
exports.obtenerHabitacionesDisponibles = (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  let query = 'SELECT * FROM habitaciones WHERE estado = "disponible"';
  
  if (fecha_inicio && fecha_fin) {
    query += ` AND id NOT IN (
      SELECT habitacion_id FROM reservas 
      WHERE estado = 'activa' 
      AND fecha_fin >= ? AND fecha_inicio <= ?
    )`;
    db.all(query, [fecha_inicio, fecha_fin], (err, habitaciones) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener habitaciones disponibles' });
      }
      res.json(habitaciones);
    });
  } else {
    db.all(query, (err, habitaciones) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener habitaciones disponibles' });
      }
      res.json(habitaciones);
    });
  }
};

// Crear habitación (Admin)
exports.crearHabitacion = (req, res) => {
  const { numero, tipo, capacidad, precio_noche, descripcion, imagen_url } = req.body;

  if (!numero || !tipo || !capacidad || !precio_noche) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  db.run(
    'INSERT INTO habitaciones (numero, tipo, capacidad, precio_noche, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?, ?)',
    [numero, tipo, capacidad, precio_noche, descripcion, imagen_url],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Error al crear habitación' });
      }
      res.status(201).json({ mensaje: 'Habitación creada', habitacion_id: this.lastID });
    }
  );
};

// Actualizar estado de habitación (Admin)
exports.actualizarEstadoHabitacion = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['disponible', 'ocupada', 'mantenimiento'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  db.run(
    'UPDATE habitaciones SET estado = ? WHERE id = ?',
    [estado, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar estado' });
      }
      res.json({ mensaje: 'Estado actualizado correctamente' });
    }
  );
};

// Obtener resumen de habitaciones (Admin)
exports.obtenerResumenHabitaciones = (req, res) => {
  db.all(`
    SELECT 
      estado,
      COUNT(*) as cantidad
    FROM habitaciones
    GROUP BY estado
  `, (err, resumen) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener resumen' });
    }
    res.json(resumen);
  });
};
