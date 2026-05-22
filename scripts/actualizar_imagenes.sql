-- ============================================================
-- ACTUALIZAR IMÁGENES DE HABITACIONES EXISTENTES
-- Ejecuta esto en Supabase Dashboard > SQL Editor si ya
-- creaste las habitaciones sin imágenes
-- ============================================================

UPDATE habitaciones SET imagen_url = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500' WHERE numero = '101' AND (imagen_url IS NULL OR imagen_url = '');
UPDATE habitaciones SET imagen_url = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500' WHERE numero = '102' AND (imagen_url IS NULL OR imagen_url = '');
UPDATE habitaciones SET imagen_url = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500' WHERE numero = '201' AND (imagen_url IS NULL OR imagen_url = '');
UPDATE habitaciones SET imagen_url = 'https://images.unsplash.com/photo-1522771739018-7c73b969a2b7?w=500' WHERE numero = '202' AND (imagen_url IS NULL OR imagen_url = '');
UPDATE habitaciones SET imagen_url = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500' WHERE numero = '301' AND (imagen_url IS NULL OR imagen_url = '');
UPDATE habitaciones SET imagen_url = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500' WHERE numero = '302' AND (imagen_url IS NULL OR imagen_url = '');
