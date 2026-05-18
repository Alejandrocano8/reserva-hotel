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

    habitaciones.forEach(hab => {
        db.run(
            'INSERT OR IGNORE INTO habitaciones (numero, tipo, capacidad, precio_noche, descripcion, imagen_url, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                hab.numero,
                hab.tipo,
                hab.capacidad,
                hab.precio,
                hab.descripcion,
                `https://via.placeholder.com/400x300?text=Habitacion+${hab.numero}`,
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
