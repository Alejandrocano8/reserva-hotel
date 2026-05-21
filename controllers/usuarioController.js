const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');

exports.registroUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, teléfono } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const hashedPassword = bcrypt.hashSync(contraseña, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({ nombre, email, contraseña: hashedPassword, teléfono })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      return res.status(400).json({ error: 'Error al registrar usuario' });
    }

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario_id: data.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    if (!bcrypt.compareSync(contraseña, usuario.contraseña)) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, teléfono, rol')
      .eq('id', req.usuario.id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
