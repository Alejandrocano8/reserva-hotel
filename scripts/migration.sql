-- ============================================================
-- MIGRACIÓN COMPLETA PARA SUPABASE
-- Sistema de Reserva de Habitaciones
-- Copia y pega todo este SQL en Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  teléfono VARCHAR(50),
  rol VARCHAR(20) DEFAULT 'cliente',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: habitaciones
-- ============================================================
CREATE TABLE IF NOT EXISTS habitaciones (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(50) UNIQUE NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  capacidad INTEGER NOT NULL,
  precio_noche DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'disponible',
  imagen_url TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: reservas
-- ============================================================
CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  habitacion_id INTEGER NOT NULL REFERENCES habitaciones(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'activa',
  notas TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLA: mantenimiento
-- ============================================================
CREATE TABLE IF NOT EXISTS mantenimiento (
  id SERIAL PRIMARY KEY,
  habitacion_id INTEGER NOT NULL REFERENCES habitaciones(id) ON DELETE CASCADE,
  fecha_inicio DATE,
  fecha_fin DATE,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'programado'
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservas_habitacion ON reservas(habitacion_id);
CREATE INDEX IF NOT EXISTS idx_reservas_fechas ON reservas(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_mantenimiento_habitacion ON mantenimiento(habitacion_id);
CREATE INDEX IF NOT EXISTS idx_habitaciones_estado ON habitaciones(estado);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- ============================================================
-- ROW LEVEL SECURITY: Políticas permisivas
-- El control de acceso se maneja desde el backend (middleware)
-- ============================================================

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantenimiento ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
DROP POLICY IF EXISTS "Acceso usuarios" ON usuarios;
CREATE POLICY "Acceso usuarios" ON usuarios
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para habitaciones
DROP POLICY IF EXISTS "Acceso habitaciones" ON habitaciones;
CREATE POLICY "Acceso habitaciones" ON habitaciones
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para reservas
DROP POLICY IF EXISTS "Acceso reservas" ON reservas;
CREATE POLICY "Acceso reservas" ON reservas
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para mantenimiento
DROP POLICY IF EXISTS "Acceso mantenimiento" ON mantenimiento;
CREATE POLICY "Acceso mantenimiento" ON mantenimiento
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- FUNCIONES PARA CONSULTAS COMPLEJAS
-- ============================================================

-- Función: Dashboard del admin
CREATE OR REPLACE FUNCTION obtener_dashboard()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_usuarios', (SELECT COUNT(*) FROM usuarios)::int,
    'total_habitaciones', (SELECT COUNT(*) FROM habitaciones)::int,
    'reservas_activas', (SELECT COUNT(*) FROM reservas WHERE estado = 'activa')::int,
    'habitaciones_disponibles', (SELECT COUNT(*) FROM habitaciones WHERE estado = 'disponible')::int,
    'habitaciones_ocupadas', (SELECT COUNT(*) FROM habitaciones WHERE estado = 'ocupada')::int,
    'habitaciones_mantenimiento', (SELECT COUNT(*) FROM habitaciones WHERE estado = 'mantenimiento')::int
  ) INTO result;
  RETURN result;
END;
$$;

-- Función: Reporte de habitaciones
CREATE OR REPLACE FUNCTION obtener_reporte_habitaciones()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO result FROM (
    SELECT
      h.id, h.numero, h.tipo, h.estado,
      COUNT(r.id)::int as total_reservas,
      SUM(CASE WHEN r.estado = 'activa' THEN 1 ELSE 0 END)::int as reservas_activas
    FROM habitaciones h
    LEFT JOIN reservas r ON h.id = r.habitacion_id
    GROUP BY h.id
    ORDER BY h.id
  ) t;
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Función: Reporte de usuarios
CREATE OR REPLACE FUNCTION obtener_reporte_usuarios()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO result FROM (
    SELECT
      u.id, u.nombre, u.email, u.teléfono,
      COUNT(r.id)::int as total_reservas,
      u.fecha_registro
    FROM usuarios u
    LEFT JOIN reservas r ON u.id = r.usuario_id
    WHERE u.rol = 'cliente'
    GROUP BY u.id
    ORDER BY u.id
  ) t;
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Función: Resumen de habitaciones por estado
CREATE OR REPLACE FUNCTION obtener_resumen_habitaciones()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO result FROM (
    SELECT estado, COUNT(*)::int as cantidad
    FROM habitaciones
    GROUP BY estado
  ) t;
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- ============================================================
-- DATOS POR DEFECTO
-- ============================================================

-- Insertar usuario admin (contraseña: admin123)
-- La contraseña se actualizará desde la app al iniciar
INSERT INTO usuarios (nombre, email, contraseña, teléfono, rol)
VALUES ('Administrador', 'admin@hotel.com', '$2a$10$5q0K1CTorS7llEZfSVJ.luvm6a9KoteUimeV1v4WhEj9WzHHSXsvK', '0000000000', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertar habitaciones de ejemplo
INSERT INTO habitaciones (numero, tipo, capacidad, precio_noche, descripcion, estado)
VALUES
  ('101', 'Individual', 1, 80.00, 'Habitación individual con vista al jardín', 'disponible'),
  ('102', 'Individual', 1, 80.00, 'Habitación individual con aire acondicionado', 'disponible'),
  ('201', 'Doble', 2, 120.00, 'Habitación doble con cama queen size', 'disponible'),
  ('202', 'Doble', 2, 120.00, 'Habitación doble con balcón', 'disponible'),
  ('301', 'Suite', 3, 200.00, 'Suite con sala de estar y jacuzzi', 'disponible'),
  ('302', 'Suite', 3, 200.00, 'Suite presidencial con terraza', 'disponible')
ON CONFLICT (numero) DO NOTHING;
