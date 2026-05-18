const API_BASE_URL = 'http://localhost:3000/api';

// Verificar autenticación de admin
function verificarAutenticacionAdmin() {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'admin') {
        alert('Acceso denegado. Solo administradores');
        window.location.href = '/';
    }
}

// Logout
function logoutAdmin() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('rol');
    window.location.href = '/';
}

// Cargar dashboard
function cargarDashboard() {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(stats => {
        const statsGrid = document.getElementById('dashboardStats');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Usuarios Registrados</h3>
                <div class="number">${stats.total_usuarios}</div>
            </div>
            <div class="stat-card">
                <h3>Total de Habitaciones</h3>
                <div class="number">${stats.total_habitaciones}</div>
            </div>
            <div class="stat-card">
                <h3>Reservas Activas</h3>
                <div class="number">${stats.reservas_activas}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #27ae60, #229954);">
                <h3>Disponibles</h3>
                <div class="number">${stats.habitaciones_disponibles}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #e74c3c, #c0392b);">
                <h3>Ocupadas</h3>
                <div class="number">${stats.habitaciones_ocupadas}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #f39c12, #d68910);">
                <h3>En Mantenimiento</h3>
                <div class="number">${stats.habitaciones_mantenimiento}</div>
            </div>
        `;
    })
    .catch(error => console.error('Error:', error));
}

// Cargar habitaciones
function cargarHabitacionesAdmin() {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/habitaciones`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(habitaciones => {
        const table = document.getElementById('habitacionesTable');
        let html = '<table>';
        html += '<thead><tr><th>Número</th><th>Tipo</th><th>Capacidad</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>';
        html += '<tbody>';

        habitaciones.forEach(habitacion => {
            const estadoClass = `estado-${habitacion.estado}`;
            html += `
                <tr>
                    <td>${habitacion.numero}</td>
                    <td>${habitacion.tipo}</td>
                    <td>${habitacion.capacidad}</td>
                    <td>$${habitacion.precio_noche}</td>
                    <td><span class="estado-badge ${estadoClass}">${habitacion.estado}</span></td>
                    <td>
                        <div class="action-buttons">
                            <select onchange="cambiarEstadoHabitacion(${habitacion.id}, this.value)" class="btn-edit">
                                <option value="">Cambiar estado</option>
                                <option value="disponible">Disponible</option>
                                <option value="ocupada">Ocupada</option>
                                <option value="mantenimiento">Mantenimiento</option>
                            </select>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        table.innerHTML = html;

        // Llenar el select de habitaciones para mantenimiento
        const selectMantenimiento = document.getElementById('habitacionMantenimiento');
        selectMantenimiento.innerHTML = '<option value="">Seleccionar habitación</option>';
        habitaciones.forEach(habitacion => {
            selectMantenimiento.innerHTML += `<option value="${habitacion.id}">Habitación ${habitacion.numero}</option>`;
        });
    })
    .catch(error => console.error('Error:', error));
}

// Cambiar estado de habitación
function cambiarEstadoHabitacion(habitacionId, nuevoEstado) {
    if (!nuevoEstado) return;

    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/habitaciones/${habitacionId}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Estado actualizado');
            cargarHabitacionesAdmin();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Crear habitación
function crearHabitacion(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const numero = document.getElementById('numHabitacion').value;
    const tipo = document.getElementById('tipoHabitacion').value;
    const capacidad = document.getElementById('capacidadHabitacion').value;
    const precio_noche = document.getElementById('precioHabitacion').value;
    const descripcion = document.getElementById('descripcionHabitacion').value;
    const imagen_url = document.getElementById('imagenUrlHabitacion').value;

    fetch(`${API_BASE_URL}/habitaciones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            numero,
            tipo,
            capacidad,
            precio_noche,
            descripcion,
            imagen_url
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Habitación creada exitosamente');
            cerrarFormularioHabitacion();
            cargarHabitacionesAdmin();
            document.getElementById('formularioHabitacion').reset();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Cargar reservas
function cargarReservasAdmin() {
    const token = localStorage.getToken('token');

    fetch(`${API_BASE_URL}/reservas/admin/todas`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(reservas => {
        const table = document.getElementById('reservasTable');
        let html = '<table>';
        html += '<thead><tr><th>ID</th><th>Habitación</th><th>Cliente</th><th>Email</th><th>Teléfono</th><th>Fecha Inicio</th><th>Fecha Fin</th><th>Estado</th><th>Acciones</th></tr></thead>';
        html += '<tbody>';

        reservas.forEach(reserva => {
            const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString();
            const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString();
            const estadoClass = `estado-${reserva.estado}`;

            html += `
                <tr>
                    <td>#${reserva.id}</td>
                    <td>${reserva.numero}</td>
                    <td>${reserva.nombre}</td>
                    <td>${reserva.email}</td>
                    <td>${reserva.teléfono}</td>
                    <td>${fechaInicio}</td>
                    <td>${fechaFin}</td>
                    <td><span class="estado-badge ${estadoClass}">${reserva.estado}</span></td>
                    <td>
                        <select onchange="cambiarEstadoReserva(${reserva.id}, this.value)" class="btn-edit">
                            <option value="">Cambiar</option>
                            <option value="activa">Activa</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        table.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}

// Cambiar estado de reserva
function cambiarEstadoReserva(reservaId, nuevoEstado) {
    if (!nuevoEstado) return;

    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/reservas/admin/${reservaId}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Estado actualizado');
            cargarReservasAdmin();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Cargar usuarios
function cargarUsuariosAdmin() {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/admin/reporte/usuarios`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(usuarios => {
        const table = document.getElementById('usuariosTable');
        let html = '<table>';
        html += '<thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Reservas</th><th>Fecha Registro</th></tr></thead>';
        html += '<tbody>';

        usuarios.forEach(usuario => {
            const fechaRegistro = new Date(usuario.fecha_registro).toLocaleDateString();
            html += `
                <tr>
                    <td>#${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.teléfono}</td>
                    <td>${usuario.total_reservas}</td>
                    <td>${fechaRegistro}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        table.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}

// Crear mantenimiento
function crearMantenimiento(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const habitacion_id = document.getElementById('habitacionMantenimiento').value;
    const fecha_inicio = document.getElementById('fechaInicioMantenimiento').value;
    const fecha_fin = document.getElementById('fechaFinMantenimiento').value;
    const descripcion = document.getElementById('descripcionMantenimiento').value;

    fetch(`${API_BASE_URL}/admin/mantenimiento`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            habitacion_id,
            fecha_inicio,
            fecha_fin,
            descripcion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Mantenimiento registrado');
            cerrarFormularioMantenimiento();
            document.getElementById('formularioMantenimiento').reset();
            cargarHabitacionesAdmin();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Modales
function abrirFormularioHabitacion() {
    document.getElementById('habitacionFormModal').classList.add('show');
}

function cerrarFormularioHabitacion() {
    document.getElementById('habitacionFormModal').classList.remove('show');
}

function abrirFormularioMantenimiento() {
    document.getElementById('mantenimientoFormModal').classList.add('show');
}

function cerrarFormularioMantenimiento() {
    document.getElementById('mantenimientoFormModal').classList.remove('show');
}

// Mostrar sección
function mostrarSeccion(nombreSeccion) {
    document.querySelectorAll('.dashboard-seccion').forEach(sec => {
        sec.classList.remove('active');
    });
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(nombreSeccion).classList.add('active');
    document.querySelector(`[data-seccion="${nombreSeccion}"]`).classList.add('active');

    // Cargar datos cuando se muestra la sección
    if (nombreSeccion === 'dashboard') {
        cargarDashboard();
    } else if (nombreSeccion === 'habitaciones') {
        cargarHabitacionesAdmin();
    } else if (nombreSeccion === 'reservas') {
        cargarReservasAdmin();
    } else if (nombreSeccion === 'usuarios') {
        cargarUsuariosAdmin();
    }
}

// Click en modal cierra si es en el fondo
window.onclick = function(event) {
    const habitacionModal = document.getElementById('habitacionFormModal');
    const mantenimientoModal = document.getElementById('mantenimientoFormModal');

    if (event.target === habitacionModal) {
        habitacionModal.classList.remove('show');
    }
    if (event.target === mantenimientoModal) {
        mantenimientoModal.classList.remove('show');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacionAdmin();
    cargarDashboard();
    cargarHabitacionesAdmin();
});
