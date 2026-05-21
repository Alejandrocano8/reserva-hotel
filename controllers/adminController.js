const { supabase } = require('../config/database');

exports.obtenerDashboard = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('obtener_dashboard');

    if (error) return res.status(500).json({ error: 'Error al obtener dashboard' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
};

exports.obtenerReporteHabitaciones = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('obtener_reporte_habitaciones');

    if (error) return res.status(500).json({ error: 'Error al obtener reporte' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
};

exports.obtenerReporteUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('obtener_reporte_usuarios');

    if (error) return res.status(500).json({ error: 'Error al obtener reporte' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
};

exports.registrarMantenimiento = async (req, res) => {
  try {
    const { habitacion_id, fecha_inicio, fecha_fin, descripcion } = req.body;

    if (!habitacion_id) {
      return res.status(400).json({ error: 'ID de habitación requerido' });
    }

    const { data, error } = await supabase
      .from('mantenimiento')
      .insert({ habitacion_id, fecha_inicio, fecha_fin, descripcion })
      .select('id')
      .single();

    if (error) return res.status(500).json({ error: 'Error al registrar mantenimiento' });

    await supabase
      .from('habitaciones')
      .update({ estado: 'mantenimiento' })
      .eq('id', habitacion_id);

    res.status(201).json({
      mensaje: 'Mantenimiento registrado',
      mantenimiento_id: data.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar mantenimiento' });
  }
};

exports.completarMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: mantenimiento } = await supabase
      .from('mantenimiento')
      .select('habitacion_id')
      .eq('id', id)
      .single();

    if (!mantenimiento) {
      return res.status(404).json({ error: 'Mantenimiento no encontrado' });
    }

    const { error } = await supabase
      .from('mantenimiento')
      .update({ estado: 'completado' })
      .eq('id', id);

    if (error) return res.status(500).json({ error: 'Error al completar mantenimiento' });

    await supabase
      .from('habitaciones')
      .update({ estado: 'disponible' })
      .eq('id', mantenimiento.habitacion_id);

    res.json({ mensaje: 'Mantenimiento completado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al completar mantenimiento' });
  }
};
