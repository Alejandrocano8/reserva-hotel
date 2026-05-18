const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.db');

let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      contraseña TEXT NOT NULL,
      teléfono TEXT,
      rol TEXT DEFAULT 'cliente',
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de habitaciones
    db.run(`CREATE TABLE IF NOT EXISTS habitaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT UNIQUE NOT NULL,
      tipo TEXT NOT NULL,
      capacidad INTEGER NOT NULL,
      precio_noche REAL NOT NULL,
      descripcion TEXT,
      estado TEXT DEFAULT 'disponible',
      imagen_url TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de reservas
    db.run(`CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      habitacion_id INTEGER NOT NULL,
      fecha_inicio DATE NOT NULL,
      fecha_fin DATE NOT NULL,
      estado TEXT DEFAULT 'activa',
      notas TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY(habitacion_id) REFERENCES habitaciones(id)
    )`);

    // Tabla de mantenimiento
    db.run(`CREATE TABLE IF NOT EXISTS mantenimiento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitacion_id INTEGER NOT NULL,
      fecha_inicio DATE,
      fecha_fin DATE,
      descripcion TEXT,
      estado TEXT DEFAULT 'programado',
      FOREIGN KEY(habitacion_id) REFERENCES habitaciones(id)
    )`);

    console.log('Database tables initialized');
  });
}

const getDb = () => db;

module.exports = { db, getDb };
