// Script para crear un usuario admin de prueba
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

// Esperar a que la base de datos esté lista
setTimeout(() => {
    const adminEmail = 'admin@ejemplo.com';
    const adminPassword = 'admin123';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    // Verificar si el admin ya existe
    db.get('SELECT * FROM usuarios WHERE email = ?', [adminEmail], (err, usuario) => {
        if (usuario) {
            console.log('El usuario admin ya existe');
            process.exit(0);
            return;
        }

        // Crear el usuario admin
        db.run(
            'INSERT INTO usuarios (nombre, email, contraseña, teléfono, rol) VALUES (?, ?, ?, ?, ?)',
            ['Administrador', adminEmail, hashedPassword, '+1234567890', 'admin'],
            function(err) {
                if (err) {
                    console.error('Error al crear admin:', err);
                } else {
                    console.log('✓ Usuario admin creado exitosamente');
                    console.log('Email:', adminEmail);
                    console.log('Contraseña:', adminPassword);
                }
                process.exit(0);
            }
        );
    });
}, 1000);
