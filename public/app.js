const API_BASE_URL = 'http://localhost:3000/api';

// Verificar si el usuario está logueado
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const rolUsuario = localStorage.getItem('rol');

    if (token) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline';
        document.getElementById('miReservasBtn').style.display = 'inline';

        // Si es admin, redirigir al panel de admin
        if (rolUsuario === 'admin') {
            window.location.href = '/admin';
        }
    } else {
        document.getElementById('loginBtn').style.display = 'inline';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('miReservasBtn').style.display = 'none';
    }
}

// Registro de usuario
function registroUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const contraseña = document.getElementById('regPassword').value;
    const teléfono = document.getElementById('regTelefono').value;

    fetch(`${API_BASE_URL}/usuarios/registro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, contraseña, teléfono })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert('¡Usuario registrado exitosamente! Ahora inicia sesión');
            document.getElementById('formularioRegistro').reset();
            mostrarTab('login-tab');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Login de usuario
function loginUsuario(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const contraseña = document.getElementById('loginPassword').value;

    fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, contraseña })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuarioId', data.usuario.id);
            localStorage.setItem('usuarioNombre', data.usuario.nombre);
            localStorage.setItem('rol', data.usuario.rol);

            cerrarLoginModal();
            verificarAutenticacion();

            alert('¡Bienvenido ' + data.usuario.nombre + '!');

            if (data.usuario.rol === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/usuario';
            }
        }
    })
    .catch(error => console.error('Error:', error));
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('rol');
    verificarAutenticacion();
    window.location.href = '/';
}

// Ir al dashboard
function irAlDashboard() {
    if (localStorage.getItem('token')) {
        window.location.href = '/usuario';
    } else {
        alert('Debes estar logueado');
    }
}

// Cargar habitaciones
function cargarHabitaciones() {
    const fechaInicio = document.getElementById('filtroFechaInicio').value;
    const fechaFin = document.getElementById('filtroFechaFin').value;

    let url = `${API_BASE_URL}/habitaciones`;

    if (fechaInicio && fechaFin) {
        url += `?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(habitaciones => {
            const grid = document.getElementById('habitacionesGrid');
            grid.innerHTML = '';

            if (habitaciones.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay habitaciones disponibles</p>';
                return;
            }

            habitaciones.forEach(habitacion => {
                const card = crearTarjetaHabitacion(habitacion);
                grid.appendChild(card);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Crear tarjeta de habitación
function crearTarjetaHabitacion(habitacion) {
    const card = document.createElement('div');
    card.className = 'card';

    const estadoClass = `estado-${habitacion.estado}`;
    const estadoTexto = habitacion.estado.charAt(0).toUpperCase() + habitacion.estado.slice(1);

    card.innerHTML = `
        <img src="${habitacion.imagen_url || 'https://via.placeholder.com/300x200'}" alt="Habitación" class="habitacion-imagen">
        <div class="card-body">
            <h3>Habitación ${habitacion.numero}</h3>
            <p><strong>Tipo:</strong> ${habitacion.tipo}</p>
            <p><strong>Capacidad:</strong> ${habitacion.capacidad} personas</p>
            <p><strong>Precio:</strong> $${habitacion.precio_noche} por noche</p>
            <span class="estado-badge ${estadoClass}">${estadoTexto}</span>
        </div>
        <div class="card-footer">
            <button onclick="verDetallesHabitacion(${habitacion.id})" class="btn-primary">Ver Detalles</button>
        </div>
    `;

    return card;
}

// Ver detalles de habitación
function verDetallesHabitacion(habitacionId) {
    fetch(`${API_BASE_URL}/habitaciones/${habitacionId}`)
        .then(response => response.json())
        .then(habitacion => {
            const detalles = document.getElementById('habitacionDetalles');
            const token = localStorage.getItem('token');

            detalles.innerHTML = `
                <h2>Habitación ${habitacion.numero}</h2>
                <img src="${habitacion.imagen_url || 'https://via.placeholder.com/500x300'}" alt="Habitación" style="width: 100%; border-radius: 8px; margin: 15px 0;">
                <p><strong>Tipo:</strong> ${habitacion.tipo}</p>
                <p><strong>Capacidad:</strong> ${habitacion.capacidad} personas</p>
                <p><strong>Precio por noche:</strong> $${habitacion.precio_noche}</p>
                <p><strong>Descripción:</strong> ${habitacion.descripcion || 'Sin descripción'}</p>
                <p><strong>Estado:</strong> <span class="estado-badge estado-${habitacion.estado}">${habitacion.estado}</span></p>
                ${token ? `<button onclick="abrirFormularioReserva(${habitacionId})" class="btn-primary" style="margin-top: 20px;">Hacer Reserva</button>` : `<button onclick="abrirLoginModal()" class="btn-primary" style="margin-top: 20px;">Inicia sesión para reservar</button>`}
            `;

            document.getElementById('habitacionModal').classList.add('show');
        })
        .catch(error => console.error('Error:', error));
}

// Abrir formulario de reserva
function abrirFormularioReserva(habitacionId) {
    cerrarHabitacionModal();

    const formulario = document.createElement('form');
    formulario.onsubmit = (e) => crearReserva(e, habitacionId);
    formulario.innerHTML = `
        <h2>Hacer una Reserva</h2>
        <label>Fecha de inicio:</label>
        <input type="date" id="reservaFechaInicio" required>
        <label>Fecha de fin:</label>
        <input type="date" id="reservaFechaFin" required>
        <label>Notas adicionales:</label>
        <textarea id="reservaNotas" placeholder="Ej: Alergias, preferencias especiales..."></textarea>
        <button type="submit" class="btn-primary">Confirmar Reserva</button>
    `;

    const modal = document.getElementById('habitacionModal');
    const detalles = document.getElementById('habitacionDetalles');
    detalles.innerHTML = '';
    detalles.appendChild(formulario);
    modal.classList.add('show');
}

// Crear reserva
function crearReserva(event, habitacionId) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes estar logueado para hacer una reserva');
        return;
    }

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
            cerrarHabitacionModal();
            cargarHabitaciones();
        }
    })
    .catch(error => console.error('Error:', error));
}

// Modal functions
function abrirLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function cerrarLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function cerrarHabitacionModal() {
    document.getElementById('habitacionModal').classList.remove('show');
}

function mostrarSeccion(nombreSeccion) {
    document.querySelectorAll('.seccion').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(nombreSeccion).classList.add('active');
}

function mostrarTab(nombreTab) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(nombreTab).classList.add('active');
    event.target.classList.add('active');
}

// Click en modal cierra si es en el fondo
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const habitacionModal = document.getElementById('habitacionModal');

    if (event.target === loginModal) {
        loginModal.classList.remove('show');
    }
    if (event.target === habitacionModal) {
        habitacionModal.classList.remove('show');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    cargarHabitaciones();
});
