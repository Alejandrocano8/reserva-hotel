# Sistema de Reserva de Habitaciones 🏨

Sistema completo, escalable y seguro de reserva de habitaciones desarrollado con Node.js, Express y Supabase.

## ✨ Características Principales

### 👥 Para Clientes
- ✅ **Landing page** con información completa de habitaciones disponibles
- ✅ **Sistema de autenticación** seguro con JWT y bcrypt
- ✅ **Búsqueda avanzada** de habitaciones por rango de fechas
- ✅ **Gestión de reservas** - crear, visualizar, modificar y cancelar
- ✅ **Dashboard personal** con perfil, mis reservas y historial
- ✅ **Validación de disponibilidad** en tiempo real
- ✅ **Notas personalizadas** en reservas

### 👨‍💼 Para Administradores
- ✅ **Panel administrativo** completo con interfaz intuitiva
- ✅ **Dashboard con estadísticas** de ocupación y reservas
- ✅ **Gestión completa de habitaciones** (crear, editar, cambiar estado)
- ✅ **Gestión de reservas** (ver todas, cambiar estado, cancelar)
- ✅ **Gestión de usuarios** (ver, eliminar, estadísticas)
- ✅ **Sistema de mantenimiento** (programar, completar, historial)
- ✅ **Reportes detallados** de habitaciones y usuarios
- ✅ **Estados de habitación** (disponible, ocupada, mantenimiento, no disponible)

## 📋 Requisitos Previos

- **Node.js** 12 o superior
- **npm** (Node Package Manager)
- **Cuenta Supabase** (gratuita en [supabase.com](https://supabase.com))

## 🚀 Instalación

### 1. Clonar o descargar el proyecto
```bash
git clone <tu-repositorio>
cd sistema-reserva-habitaciones
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase y variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Autenticación
JWT_SECRET=tu_clave_secreta_muy_segura_123456

# Supabase (obtén estos valores de tu proyecto en Supabase)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

**Nota:** En producción, asegúrate de usar valores seguros y únicos para `JWT_SECRET`.

### 4. Configurar la base de datos en Supabase

Ejecuta las migraciones en la consola SQL de Supabase para crear las tablas necesarias (consulta el archivo [scripts/migration.sql](scripts/migration.sql)).

## 🏃 Iniciar el Servidor

### Modo producción
```bash
npm start
```

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📖 Guía de Uso

### 🏠 Landing Page
Accede a `http://localhost:3000` para ver:
- Todas las habitaciones disponibles
- Imágenes y descripción de cada habitación
- Precios y características
- Botón para buscar disponibilidad

### 🔐 Registro e Inicio de Sesión
1. Haz clic en **"Login"** en la parte superior derecha
2. Selecciona **"Registrarse"** si eres nuevo usuario
3. Completa el formulario con:
   - Email
   - Contraseña (será encriptada con bcrypt)
   - Nombre completo
4. Una vez autenticado:
   - **Usuarios normales** → Redirigido a dashboard de usuario (`/usuario`)
   - **Administradores** → Redirigido a panel administrativo (`/admin`)

### 👤 Dashboard de Usuario
Después de iniciar sesión, accede a `/usuario` para:
- **Ver tu perfil:** Información personal, email
- **Mis reservas:** Lista de todas tus reservas con estado actual
- **Hacer nuevas reservas:** 
  - Selecciona una habitación
  - Elige fechas de entrada y salida
  - Agrega notas opcionales
  - Confirma la reserva
- **Cancelar reservas:** Solo si están en estado "pendiente" o "confirmada"
- **Ver detalles:** Precio total, fechas exactas, estado de pago

### 👨‍💼 Panel de Administrador
Accede a `/admin` (requiere autenticación como admin) para acceder a:

#### 📊 Dashboard
- Total de habitaciones
- Ocupación actual
- Reservas pendientes
- Ingresos totales
- Usuarios registrados

#### 🛏️ Gestión de Habitaciones
- **Ver todas:** Lista completa de habitaciones
- **Crear:** Agregar nueva habitación
  - Nombre, descripción, precio
  - Capacidad (personas), número de camas
  - Características y amenidades
  - Imagen/thumbnail
- **Editar:** Modificar información existente
- **Cambiar estado:** Disponible → Ocupada → Mantenimiento → No disponible

#### 📅 Gestión de Reservas
- **Ver todas las reservas** del sistema
- **Filtrar por estado:** Pendiente, Confirmada, Cancelada, Completada
- **Cambiar estado** de cualquier reserva
- **Ver detalles completos** de cada reserva
- **Cancelar reserva** si es necesario

#### 👥 Gestión de Usuarios
- **Ver todos los usuarios** registrados
- **Información:** Email, nombre, fecha de registro
- **Eliminar usuarios** (se eliminarán también sus reservas)
- **Ver estadísticas:** Total de reservas por usuario

#### 🔧 Gestión de Mantenimiento
- **Programar mantenimiento** para una habitación:
  - Selecciona habitación
  - Elige rango de fechas
  - Agrega descripción del trabajo
- **Ver mantenimientos programados**
- **Completar mantenimiento** cuando esté listo
- La habitación se marca automáticamente como "en mantenimiento"

#### 📈 Reportes
- **Reporte de habitaciones:**
  - Estado de cada habitación
  - Ocupación porcentual
  - Ingresos por habitación
  - Próximas reservas
  
- **Reporte de usuarios:**
  - Total de usuarios
  - Usuarios activos
  - Reservas totales
  - Ingresos por usuario

### 🔑 Crear Usuario Admin de Prueba

Para crear un usuario administrador inicial:

```bash
node scripts/crearAdmin.js
```

Credenciales por defecto:
- **Email:** admin@ejemplo.com
- **Contraseña:** admin123

⚠️ **Importante:** Cambia estas credenciales en producción.

## 📁 Estructura del Proyecto

```
proyecto/
├── config/
│   └── database.js                    # Configuración de Supabase
├── controllers/
│   ├── usuarioController.js           # Lógica de usuarios (registro, login, perfil)
│   ├── habitacionController.js        # Lógica de habitaciones
│   ├── reservaController.js           # Lógica de reservas
│   └── adminController.js             # Lógica de administrador
├── middleware/
│   └── auth.js                        # Middleware de autenticación JWT
├── routes/
│   ├── usuarioRoutes.js               # Endpoints de usuarios
│   ├── habitacionRoutes.js            # Endpoints de habitaciones
│   ├── reservaRoutes.js               # Endpoints de reservas
│   └── adminRoutes.js                 # Endpoints de administrador
├── scripts/
│   ├── crearAdmin.js                  # Script para crear usuario admin
│   ├── migration.sql                  # Script de creación de tablas
│   ├── seedDatabase.js                # Script para popular BD con datos
│   ├── runMigration.js                # Ejecutar migraciones
│   └── actualizar_imagenes.sql        # Script para actualizar imágenes
├── public/
│   ├── index.html                     # Landing page
│   ├── usuario.html                   # Dashboard de usuario
│   ├── admin.html                     # Panel de administración
│   ├── app.js                         # Lógica frontend general
│   ├── usuario.js                     # Lógica del dashboard usuario
│   ├── admin.js                       # Lógica del panel admin
│   └── styles.css                     # Estilos CSS del proyecto
├── server.js                          # Archivo principal del servidor
├── package.json                       # Dependencias del proyecto
├── .env                               # Variables de entorno (no en git)
└── README.md                          # Este archivo
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

## 🔌 APIs RESTful Disponibles

### 👥 Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|----------------|
| `POST` | `/registro` | Registrar nuevo usuario | No |
| `POST` | `/login` | Iniciar sesión | No |
| `GET` | `/perfil` | Obtener perfil del usuario | Sí (JWT) |
| `PUT` | `/perfil` | Actualizar perfil | Sí (JWT) |

**Ejemplos de respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "cliente"
  }
}
```

### 🛏️ Habitaciones (`/api/habitaciones`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|----------------|
| `GET` | `/` | Obtener todas las habitaciones | No |
| `GET` | `/:id` | Obtener habitación por ID | No |
| `GET` | `/disponibles/search` | Buscar disponibles por fechas | No |
| `POST` | `/` | Crear nueva habitación | Sí (Admin) |
| `PUT` | `/:id` | Actualizar habitación | Sí (Admin) |
| `PUT` | `/:id/estado` | Cambiar estado de habitación | Sí (Admin) |

**Parámetros de búsqueda (`/disponibles/search`):**
```
?fecha_inicio=2024-12-01&fecha_fin=2024-12-05
```

### 📅 Reservas (`/api/reservas`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|----------------|
| `POST` | `/` | Crear nueva reserva | Sí (JWT) |
| `GET` | `/mis-reservas` | Obtener mis reservas | Sí (JWT) |
| `PUT` | `/:id` | Actualizar reserva | Sí (JWT) |
| `DELETE` | `/:id/cancelar` | Cancelar reserva | Sí (JWT) |
| `GET` | `/admin/todas` | Obtener todas las reservas | Sí (Admin) |
| `PUT` | `/admin/:id/estado` | Cambiar estado de reserva | Sí (Admin) |

### 👨‍💼 Administrador (`/api/admin`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|----------------|
| `GET` | `/dashboard` | Obtener estadísticas del dashboard | Sí (Admin) |
| `GET` | `/reporte/habitaciones` | Reporte de habitaciones | Sí (Admin) |
| `GET` | `/reporte/usuarios` | Reporte de usuarios | Sí (Admin) |
| `POST` | `/mantenimiento` | Registrar mantenimiento | Sí (Admin) |
| `PUT` | `/mantenimiento/:id/completar` | Completar mantenimiento | Sí (Admin) |
| `DELETE` | `/usuarios/:id` | Eliminar usuario | Sí (Admin) |
| `GET` | `/usuarios` | Obtener lista de usuarios | Sí (Admin) |

## 🔒 Seguridad

### Autenticación y Autorización
- 🔐 **JWT (JSON Web Tokens):** Autenticación stateless con expiración de 24 horas
- 🛡️ **Bcrypt:** Encriptación de contraseñas con salt de 10 rondas
- 🚫 **Middleware de autorización:** Protección de rutas administrativas
- ✅ **Validación de entrada:** Validación en servidor de todos los datos
- 🔑 **Roles:** Sistema de roles (cliente, admin)

### Mejores Prácticas
- Las contraseñas **nunca se almacenan en texto plano**
- Los tokens JWT se validan en cada petición protegida
- CORS habilitado para desarrollo seguro
- Variables sensibles en `.env` (no en git)
- Manejo de errores sin exponer detalles del servidor

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **Supabase** - Base de datos PostgreSQL en la nube + autenticación
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Generación y validación de JWT
- **cors** - Manejo de CORS
- **dotenv** - Gestión de variables de entorno
- **body-parser** - Parseo de JSON y formularios

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos responsive y modernos
- **JavaScript vanilla** - Sin dependencias externas
- **Fetch API** - Comunicación con backend

### Base de Datos
- **Supabase** (PostgreSQL)
  - Tablas relacionales
  - Funciones SQL para reportes
  - Escalable y confiable
  - Autenticación integrada (opcional)

## ⚙️ Scripts Disponibles

```bash
# Iniciar servidor en producción
npm start

# Iniciar servidor en modo desarrollo con auto-reload
npm run dev

# Crear usuario administrador
node scripts/crearAdmin.js

# Ejecutar migraciones de base de datos
node scripts/runMigration.js

# Llenar base de datos con datos de prueba
node scripts/seedDatabase.js
```

## 📝 Notas Importantes

1. **Base de datos:** Se usa Supabase (PostgreSQL) en lugar de SQLite, lo que permite:
   - Mejor escalabilidad
   - Acceso desde múltiples instancias
   - Backup automático
   - Mayor confiabilidad

2. **Tokens JWT:** 
   - Expiran después de 24 horas
   - Se transmiten en el header `Authorization: Bearer <token>`
   - No se almacenan en la BD (stateless)

3. **Estados de habitación:**
   - `disponible` - Lista para reservar
   - `ocupada` - Tiene reservas activas
   - `mantenimiento` - En reparación/limpieza
   - `no disponible` - No se puede reservar

4. **Estados de reserva:**
   - `pendiente` - Esperando confirmación
   - `confirmada` - Reserva activa
   - `cancelada` - Reserva cancelada por usuario
   - `completada` - Check-out realizado

5. **Cambios principales respecto a versiones anteriores:**
   - ✨ Migración de SQLite a **Supabase** para mejor escalabilidad
   - ✨ Sistema de **mantenimiento** de habitaciones
   - ✨ **Reportes avanzados** con funciones SQL
   - ✨ **Notas** en reservas para solicitudes especiales
   - ✨ **Mejor validación** de disponibilidad
   - ✨ **Panel mejorado** de administrador

6. **En producción:**
   - Cambiar `NODE_ENV` a `production`
   - Usar valores únicos para `JWT_SECRET`
   - Configurar CORS adecuadamente
   - Usar HTTPS en lugar de HTTP
   - Revisar limites de Supabase
   - Configurar variables de entorno del servidor

## 🐛 Troubleshooting

### Error: "SUPABASE_URL no está configurado"
- Asegúrate de haber creado el archivo `.env`
- Verifica que las credenciales de Supabase sean correctas
- Reinicia el servidor después de cambiar `.env`

### Error: "Token expirado"
- Los tokens JWT tienen validez de 24 horas
- El usuario debe volver a iniciar sesión

### Habitación no aparece en búsqueda
- Verifica que el estado sea "disponible"
- Comprueba que no tenga reservas activas en esas fechas
- Asegúrate de que la BD está correctamente poblada

### No puedo acceder al panel admin
- Verifica que tu usuario tiene rol "admin"
- Prueba creando un usuario admin con `node scripts/crearAdmin.js`

## 📚 Documentación Adicional

- [Documentación de Supabase](https://supabase.com/docs)
- [Express.js Guía](https://expressjs.com/)
- [JWT.io - Información sobre JWT](https://jwt.io/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo LICENSE para más detalles.

## 👨‍💻 Autor

Sistema de Reserva de Habitaciones - 2024-2026

## 📞 Soporte

Para reportar bugs, sugerencias o preguntas sobre el proyecto:
- Abre un issue en el repositorio
- Contacta al administrador del sistema
- Consulta la documentación en este README

---

**Última actualización:** Mayo 2026  
**Versión:** 2.0.0 (Migración a Supabase)  
**Estado:** ✅ Producción
