// Script para llenar la base de datos con datos de prueba
const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

// Esperar a que la base de datos esté lista
setTimeout(() => {
    console.log('Agregando datos de prueba...\n');

    // Crear usuario admin
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(
        'INSERT OR IGNORE INTO usuarios (nombre, email, contraseña, teléfono, rol) VALUES (?, ?, ?, ?, ?)',
        ['Administrador', 'admin@hotel.com', adminPassword, '1234567890', 'admin'],
        (err) => {
            if (err) {
                console.error('Error al insertar admin:', err);
            } else {
                console.log('✓ Admin creado - Email: admin@hotel.com | Contraseña: admin123');
            }
        }
    );

    // Crear usuario cliente de prueba
    const clientPassword = bcrypt.hashSync('cliente123', 10);
    db.run(
        'INSERT OR IGNORE INTO usuarios (nombre, email, contraseña, teléfono, rol) VALUES (?, ?, ?, ?, ?)',
        ['Juan García', 'juan@example.com', clientPassword, '9876543210', 'cliente'],
        (err) => {
            if (err) {
                console.error('Error al insertar cliente:', err);
            } else {
                console.log('✓ Cliente creado - Email: juan@example.com | Contraseña: cliente123');
            }
        }
    );

    // Habitaciones de prueba
    const habitaciones = [
        { numero: '101', tipo: 'individual', capacidad: 1, precio: 50, descripcion: 'Habitación individual acogedora', estado: 'disponible' },
        { numero: '102', tipo: 'doble', capacidad: 2, precio: 80, descripcion: 'Habitación doble confortable', estado: 'disponible' },
        { numero: '103', tipo: 'doble', capacidad: 2, precio: 85, descripcion: 'Habitación doble con vista', estado: 'reservada' },
        { numero: '104', tipo: 'suite', capacidad: 4, precio: 150, descripcion: 'Suite lujosa para familias', estado: 'disponible' },
        { numero: '105', tipo: 'individual', capacidad: 1, precio: 55, descripcion: 'Habitación individual con balcón', estado: 'mantenimiento' },
        { numero: '201', tipo: 'doble', capacidad: 2, precio: 90, descripcion: 'Habitación doble de lujo', estado: 'disponible' },
        { numero: '202', tipo: 'suite', capacidad: 4, precio: 160, descripcion: 'Suite presidencial', estado: 'ocupada' },
        { numero: '203', tipo: 'individual', capacidad: 1, precio: 52, descripcion: 'Habitación individual económica', estado: 'disponible' },
    ];

    function obtenerImagen(numero, tipo) {
        const imagenes = {
            '101': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500',
            '102': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
            '103': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500',
            '104': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
            '105': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
            '201': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500',
            '202': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500',
            '203': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
        };
        return imagenes[numero] || `https://via.placeholder.com/400x300?text=Habitacion+${numero}`;
    }

    habitaciones.forEach(hab => {
        db.run(
            'INSERT OR IGNORE INTO habitaciones (numero, tipo, capacidad, precio_noche, descripcion, imagen_url, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                hab.numero,
                hab.tipo,
                hab.capacidad,
                hab.precio,
                hab.descripcion,
                obtenerImagen(hab.numero, hab.tipo),
                hab.estado
            ],
            (err) => {
                if (err) {
                    console.error('Error al insertar habitación:', err);
                }
            }
        );
    });

    console.log('✓ 8 habitaciones creadas');
    console.log('\n--- CREDENCIALES DE PRUEBA ---');
    console.log('ADMIN: admin@hotel.com / admin123');
    console.log('CLIENTE: juan@example.com / cliente123');
    console.log('--------------------------------\n');

    setTimeout(() => {
        process.exit(0);
    }, 1500);
}, 1000);
