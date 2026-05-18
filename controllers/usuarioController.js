const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

// Registro de usuario
exports.registroUsuario = (req, res) => {
  const { nombre, email, contraseña, teléfono } = req.body;

  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const hashedPassword = bcrypt.hashSync(contraseña, 10);

  db.run(
    'INSERT INTO usuarios (nombre, email, contraseña, teléfono) VALUES (?, ?, ?, ?)',
    [nombre, email, hashedPassword, teléfono],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      res.status(201).json({ 
        mensaje: 'Usuario registrado exitosamente',
        usuario_id: this.lastID
      });
    }
  );
};

// Login de usuario
exports.loginUsuario = (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, usuario) => {
    if (err || !usuario) {
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
  });
};

// Obtener perfil del usuario
exports.obtenerPerfil = (req, res) => {
  db.get('SELECT id, nombre, email, teléfono, rol FROM usuarios WHERE id = ?', 
    [req.usuario.id], 
    (err, usuario) => {
      if (err || !usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    }
  );
};
