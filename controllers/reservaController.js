const { supabase } = require('../config/database');

exports.crearReserva = async (req, res) => {
  try {
    const { habitacion_id, fecha_inicio, fecha_fin, notas } = req.body;
    const usuario_id = req.usuario.id;

    if (!habitacion_id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const { data: habitacion } = await supabase
      .from('habitaciones')
      .select('*')
      .eq('id', habitacion_id)
      .eq('estado', 'disponible')
      .single();

    if (!habitacion) {
      return res.status(400).json({ error: 'Habitación no disponible' });
    }

    const { data: reservaExistente } = await supabase
      .from('reservas')
      .select('*')
      .eq('habitacion_id', habitacion_id)
      .eq('estado', 'activa')
      .lte('fecha_inicio', fecha_fin)
      .gte('fecha_fin', fecha_inicio);

    if (reservaExistente && reservaExistente.length > 0) {
      return res.status(400).json({ error: 'La habitación no está disponible en esas fechas' });
    }

    const { data, error } = await supabase
      .from('reservas')
      .insert({ usuario_id, habitacion_id, fecha_inicio, fecha_fin, notas })
      .select('id')
      .single();

    if (error) return res.status(500).json({ error: 'Error al crear la reserva' });

    await supabase
      .from('habitaciones')
      .update({ estado: 'ocupada' })
      .eq('id', habitacion_id);

    res.status(201).json({
      mensaje: 'Reserva creada exitosamente',
      reserva_id: data.id,
      habitacion_id,
      fecha_inicio,
      fecha_fin
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

exports.obtenerMisReservas = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const { data, error } = await supabase
      .from('reservas')
      .select('*, habitaciones(*), usuarios(id, nombre, email, teléfono)')
      .eq('usuario_id', usuario_id)
      .order('fecha_inicio', { ascending: false });

    if (error) return res.status(500).json({ error: 'Error al obtener reservas' });

    const reservas = data.map(r => ({
      ...r,
      numero: r.habitaciones?.numero,
      tipo: r.habitaciones?.tipo,
      precio_noche: r.habitaciones?.precio_noche,
      descripcion: r.habitaciones?.descripcion,
      nombre: r.usuarios?.nombre,
      email: r.usuarios?.email,
      teléfono: r.usuarios?.teléfono
    }));

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

exports.obtenerTodasReservas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('*, habitaciones(*), usuarios(id, nombre, email, teléfono)')
      .order('fecha_inicio', { ascending: false });

    if (error) return res.status(500).json({ error: 'Error al obtener reservas' });

    const reservas = data.map(r => ({
      ...r,
      numero: r.habitaciones?.numero,
      tipo: r.habitaciones?.tipo,
      precio_noche: r.habitaciones?.precio_noche,
      nombre: r.usuarios?.nombre,
      email: r.usuarios?.email,
      teléfono: r.usuarios?.teléfono
    }));

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

exports.cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const { data: reserva } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', id)
      .eq('usuario_id', usuario_id)
      .single();

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const { error } = await supabase
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', id);

    if (error) return res.status(500).json({ error: 'Error al cancelar reserva' });

    await supabase
      .from('habitaciones')
      .update({ estado: 'disponible' })
      .eq('id', reserva.habitacion_id);

    res.json({ mensaje: 'Reserva cancelada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cancelar reserva' });
  }
};

exports.actualizarEstadoReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['activa', 'completada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const { error } = await supabase
      .from('reservas')
      .update({ estado })
      .eq('id', id);

    if (error) return res.status(500).json({ error: 'Error al actualizar estado' });

    res.json({ mensaje: 'Estado de reserva actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};
