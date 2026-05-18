# Sistema de Reserva de Habitaciones

Sistema completo de reserva de habitaciones desarrollado con Node.js, Express y SQLite.

## Características

### Para Clientes
- ✅ Landing page con información de habitaciones disponibles
- ✅ Sistema de login y registro
- ✅ Búsqueda de habitaciones por fecha
- ✅ Crear, ver y cancelar reservas
- ✅ Dashboard personal con perfil y mis reservas

### Para Administradores
- ✅ Panel administrativo completo
- ✅ Dashboard con estadísticas
- ✅ Gestión de habitaciones (crear, editar estado)
- ✅ Gestión de reservas (ver todas, cambiar estado)
- ✅ Gestión de usuarios registrados
- ✅ Gestión de mantenimiento de habitaciones
- ✅ Reportes de habitaciones y usuarios

## Requisitos Previos

- Node.js 12 o superior
- npm (Node Package Manager)

## Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

El archivo `.env` ya está configurado con valores por defecto:
```
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura_123456
DATABASE_PATH=./database.db
NODE_ENV=development
```

## Iniciar el Servidor

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

Para desarrollo con auto-reload:
```bash
npm run dev
```

## Uso

### Landing Page
Accede a `http://localhost:3000` para ver la página principal con todas las habitaciones disponibles.

### Registrarse/Iniciar Sesión
- Haz clic en "Login" en la parte superior
- Completa el formulario de registro o inicia sesión
- Si eres un cliente normal, serás redirigido al dashboard de usuario
- Si eres admin, serás redirigido al panel de administración

### Panel de Usuario
- Después de iniciar sesión, accede a `/usuario`
- Ver tu perfil
- Ver tus reservas
- Hacer nuevas reservas
- Cancelar reservas

### Panel de Administrador
- Accede a `/admin` (requiere rol de admin)
- Dashboard con estadísticas
- Gestionar habitaciones
- Gestionar reservas
- Ver usuarios registrados
- Programar mantenimiento

## Crear Usuario Admin de Prueba

Para crear un usuario administrador, ejecuta el siguiente comando después de iniciar el servidor:

```bash
node scripts/crearAdmin.js
```

Esto creará un usuario admin con:
- Email: admin@ejemplo.com
- Contraseña: admin123

## Estructura del Proyecto

```
proyecto/
├── config/
│   └── database.js          # Configuración de base de datos
├── controllers/
│   ├── usuarioController.js # Controlador de usuarios
│   ├── habitacionController.js # Controlador de habitaciones
│   ├── reservaController.js # Controlador de reservas
│   └── adminController.js   # Controlador de admin
├── middleware/
│   └── auth.js             # Middleware de autenticación
├── routes/
│   ├── usuarioRoutes.js    # Rutas de usuarios
│   ├── habitacionRoutes.js # Rutas de habitaciones
│   ├── reservaRoutes.js    # Rutas de reservas
│   └── adminRoutes.js      # Rutas de admin
├── public/
│   ├── index.html          # Landing page
│   ├── usuario.html        # Dashboard de usuario
│   ├── admin.html          # Panel de admin
│   ├── app.js              # Script principal del frontend
│   ├── usuario.js          # Script del dashboard de usuario
│   ├── admin.js            # Script del panel de admin
│   └── styles.css          # Estilos CSS
├── server.js               # Archivo principal del servidor
├── .env                    # Variables de entorno
├── package.json            # Dependencias del proyecto
└── database.db             # Base de datos SQLite (se crea automáticamente)
```

## APIs Disponibles

### Usuarios
- `POST /api/usuarios/registro` - Registrar nuevo usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil` - Obtener perfil (requiere autenticación)

### Habitaciones
- `GET /api/habitaciones` - Obtener todas las habitaciones
- `GET /api/habitaciones/:id` - Obtener habitación por ID
- `GET /api/habitaciones/disponibles/search` - Buscar disponibles por fecha
- `POST /api/habitaciones` - Crear habitación (solo admin)
- `PUT /api/habitaciones/:id/estado` - Actualizar estado (solo admin)

### Reservas
- `POST /api/reservas` - Crear reserva (requiere autenticación)
- `GET /api/reservas/mis-reservas` - Obtener mis reservas
- `DELETE /api/reservas/:id/cancelar` - Cancelar reserva
- `GET /api/reservas/admin/todas` - Obtener todas las reservas (solo admin)
- `PUT /api/reservas/admin/:id/estado` - Cambiar estado de reserva (solo admin)

### Admin
- `GET /api/admin/dashboard` - Obtener estadísticas (solo admin)
- `GET /api/admin/reporte/habitaciones` - Reporte de habitaciones (solo admin)
- `GET /api/admin/reporte/usuarios` - Reporte de usuarios (solo admin)
- `POST /api/admin/mantenimiento` - Registrar mantenimiento (solo admin)
- `PUT /api/admin/mantenimiento/:id/completar` - Completar mantenimiento (solo admin)

## Seguridad

- Las contraseñas se encriptan con bcrypt
- Autenticación con JWT (JSON Web Tokens)
- Middleware de protección en rutas administrativas
- CORS habilitado para desarrollo

## Tecnologías Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - SQLite3
  - bcryptjs
  - jsonwebtoken
  - CORS

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript vanilla

## Notas Importantes

1. La base de datos se crea automáticamente cuando se inicia el servidor por primera vez
2. Los tokens JWT expiran después de 24 horas
3. Los usuarios pueden cancelar sus propias reservas
4. Los administradores pueden cambiar el estado de cualquier habitación o reserva
5. En producción, cambiar el valor de `JWT_SECRET` en el archivo `.env`

## Soporte

Para reportar bugs o sugerencias, contacta al administrador del sistema.

---

Creado el 2024
