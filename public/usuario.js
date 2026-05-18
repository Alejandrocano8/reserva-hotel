const API_BASE_URL = 'http://localhost:3000/api';

// Verificar autenticación
function verificarAutenticacionUsuario() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('rol');
    window.location.href = '/';
}

// Cargar perfil del usuario
function cargarPerfilUsuario() {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/usuarios/perfil`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(usuario => {
        const perfilInfo = document.getElementById('perfilInfo');
        perfilInfo.innerHTML = `
            <h3>${usuario.nombre}</h3>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>Teléfono:</strong> ${usuario.teléfono || 'No proporcionado'}</p>
            <p><strong>Rol:</strong> ${usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}</p>
            <p><strong>Usuario ID:</strong> ${usuario.id}</p>
        `;
    })
    .catch(error => console.error('Error:', error));
}

// Cargar mis reservas
function cargarMisReservas() {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/reservas/mis-reservas`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(reservas => {
        const container = document.getElementById('misReservasContainer');

        if (reservas.length === 0) {
            container.innerHTML = '<p>No tienes reservas aún</p>';
            return;
        }

        let html = '<table>';
        html += '<thead><tr><th>Habitación</th><th>Tipo</th><th>Fecha Inicio</th><th>Fecha Fin</th><th>Estado</th><th>Acciones</th></tr></thead>';
        html += '<tbody>';

        reservas.forEach(reserva => {
            const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString();
            const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString();
            const estadoClass = `estado-${reserva.estado}`;

            html += `
                <tr>
                    <td>#${reserva.numero}</td>
                    <td>${reserva.tipo}</td>
                    <td>${fechaInicio}</td>
                    <td>${fechaFin}</td>
                    <td><span class="estado-badge ${estadoClass}">${reserva.estado}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button onclick="verDetallesReserva(${reserva.id})" class="btn-view">Ver</button>
                            ${reserva.estado === 'activa' ? `<button onclick="cancelarReserva(${reserva.id})" class="btn-delete">Cancelar</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}

// Ver detalles de reserva
function verDetallesReserva(reservaId) {
    alert('Detalles de la reserva ID: ' + reservaId);
    // Aquí puedes implementar un modal más detallado
}

// Cancelar reserva
function cancelarReserva(reservaId) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
        return;
    }

    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/reservas/${reservaId}/cancelar`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('Reserva cancelada exitosamente');
            cargarMisReservas();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Buscar habitaciones disponibles
function buscarHabitacionesDisponibles() {
    const fechaInicio = document.getElementById('novaFechaInicio').value;
    const fechaFin = document.getElementById('novaFechaFin').value;

    if (!fechaInicio || !fechaFin) {
        alert('Por favor selecciona ambas fechas');
        return;
    }

    const url = `${API_BASE_URL}/habitaciones/disponibles/search?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;

    fetch(url)
        .then(response => response.json())
        .then(habitaciones => {
            const container = document.getElementById('habitacionesDisponiblesContainer');
            container.innerHTML = '';

            if (habitaciones.length === 0) {
                container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay habitaciones disponibles en esas fechas</p>';
                return;
            }

            habitaciones.forEach(habitacion => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header">
                        Habitación ${habitacion.numero}
                    </div>
                    <div class="card-body">
                        <p><strong>Tipo:</strong> ${habitacion.tipo}</p>
                        <p><strong>Capacidad:</strong> ${habitacion.capacidad} personas</p>
                        <p><strong>Precio:</strong> $${habitacion.precio_noche} por noche</p>
                    </div>
                    <div class="card-footer">
                        <button onclick="abrirFormularioReserva(${habitacion.id}, '${fechaInicio}', '${fechaFin}')" class="btn-primary">Reservar</button>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Abrir formulario de reserva
function abrirFormularioReserva(habitacionId, fechaInicio, fechaFin) {
    const formulario = document.createElement('form');
    formulario.onsubmit = (e) => crearReserva(e, habitacionId);
    formulario.innerHTML = `
        <h2>Confirmar Reserva</h2>
        <label>Fecha de inicio:</label>
        <input type="date" value="${fechaInicio}" id="reservaFechaInicio" required>
        <label>Fecha de fin:</label>
        <input type="date" value="${fechaFin}" id="reservaFechaFin" required>
        <label>Notas adicionales:</label>
        <textarea id="reservaNotas" placeholder="Ej: Alergias, preferencias especiales..."></textarea>
        <button type="submit" class="btn-primary">Confirmar Reserva</button>
    `;

    const modal = document.getElementById('reservaModal');
    const formularioDiv = document.getElementById('formularioReserva');
    formularioDiv.innerHTML = '';
    formularioDiv.appendChild(formulario);
    modal.classList.add('show');
}

// Crear reserva
function crearReserva(event, habitacionId) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const fecha_inicio = document.getElementById('reservaFechaInicio').value;
    const fecha_fin = document.getElementById('reservaFechaFin').value;
    const notas = document.getElementById('reservaNotas').value;

    fetch(`${API_BASE_URL}/reservas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            habitacion_id: habitacionId,
            fecha_inicio,
            fecha_fin,
            notas
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('¡Reserva realizada exitosamente!');
            cerrarReservaModal();
            cargarMisReservas();
            document.getElementById('novaFechaInicio').value = '';
            document.getElementById('novaFechaFin').value = '';
            document.getElementById('habitacionesDisponiblesContainer').innerHTML = '';
        }
    })
    .catch(error => console.error('Error:', error));
}

// Cerrar modales
function cerrarReservaModal() {
    document.getElementById('reservaModal').classList.remove('show');
}

// Mostrar sección del dashboard
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
    if (nombreSeccion === 'perfil') {
        cargarPerfilUsuario();
    } else if (nombreSeccion === 'mis-reservas') {
        cargarMisReservas();
    }
}

// Click en modal cierra si es en el fondo
window.onclick = function(event) {
    const reservaModal = document.getElementById('reservaModal');
    if (event.target === reservaModal) {
        reservaModal.classList.remove('show');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacionUsuario();
    cargarPerfilUsuario();
    cargarMisReservas();
});
