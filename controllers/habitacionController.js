const { supabase } = require('../config/database');

exports.obtenerHabitaciones = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('habitaciones')
      .select('*')
      .order('id');

    if (error) return res.status(500).json({ error: 'Error al obtener habitaciones' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
};

exports.obtenerHabitacionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('habitaciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener habitación' });
  }
};

exports.obtenerHabitacionesDisponibles = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    let query = supabase
      .from('habitaciones')
      .select('*')
      .eq('estado', 'disponible');

    if (fecha_inicio && fecha_fin) {
      const { data: reservas } = await supabase
        .from('reservas')
        .select('habitacion_id')
        .eq('estado', 'activa')
        .lte('fecha_inicio', fecha_fin)
        .gte('fecha_fin', fecha_inicio);

      if (reservas && reservas.length > 0) {
        const idsOcupados = reservas.map(r => r.habitacion_id);
        query = query.not('id', 'in', `(${idsOcupados.join(',')})`);
      }
    }

    const { data, error } = await query.order('id');

    if (error) return res.status(500).json({ error: 'Error al obtener habitaciones disponibles' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener habitaciones disponibles' });
  }
};

exports.crearHabitacion = async (req, res) => {
  try {
    const { numero, tipo, capacidad, precio_noche, descripcion, imagen_url } = req.body;

    if (!numero || !tipo || !capacidad || !precio_noche) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const { data, error } = await supabase
      .from('habitaciones')
      .insert({ numero, tipo, capacidad, precio_noche, descripcion, imagen_url })
      .select('id')
      .single();

    if (error) return res.status(400).json({ error: 'Error al crear habitación' });

    res.status(201).json({ mensaje: 'Habitación creada', habitacion_id: data.id });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear habitación' });
  }
};

exports.actualizarEstadoHabitacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['disponible', 'ocupada', 'mantenimiento'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const { error } = await supabase
      .from('habitaciones')
      .update({ estado })
      .eq('id', id);

    if (error) return res.status(500).json({ error: 'Error al actualizar estado' });

    res.json({ mensaje: 'Estado actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

exports.eliminarHabitacion = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('habitaciones')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: 'Error al eliminar habitación' });
    res.json({ mensaje: 'Habitación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar habitación' });
  }
};

exports.obtenerResumenHabitaciones = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('obtener_resumen_habitaciones');

    if (error) return res.status(500).json({ error: 'Error al obtener resumen' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};
