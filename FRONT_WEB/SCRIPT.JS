const API_URL = 'http://localhost:5043/api';

// Elementos del DOM
const usuariosBtn = document.getElementById('usuariosBtn');
const productosBtn = document.getElementById('productosBtn');
const pedidosBtn = document.getElementById('pedidosBtn');
const secciones = document.querySelectorAll('.seccion');
const usuarioForm = document.getElementById('usuarioForm');
const productoForm = document.getElementById('productoForm');
const pedidoForm = document.getElementById('pedidoForm');
const usuariosList = document.getElementById('usuariosList');
const productosList = document.getElementById('productosList');
const pedidosList = document.getElementById('pedidosList');
const pedidoUsuario = document.getElementById('pedidoUsuario');
const productosSeleccion = document.getElementById('productosSeleccion');

// Funciones auxiliares
const mostrarSeccion = (id) => {
    secciones.forEach(seccion => seccion.style.display = 'none');
    document.getElementById(id).style.display = 'block';
};

const fetchData = async (url, method = 'GET', body = null) => {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        };
        const response = await fetch(`${API_URL}/${url}`, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Ocurrió un error en la solicitud');
        }
        
        if (method === 'DELETE') {
            return response;
        }
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('Error en fetchData:', error);
        mostrarMensaje(error.message, 'error');
        throw error;
    }
};

const mostrarMensaje = (mensaje, tipo = 'success') => {
    const mensajeElement = document.createElement('div');
    mensajeElement.textContent = mensaje;
    mensajeElement.className = `mensaje ${tipo}`;
    document.getElementById('mensajeContainer').appendChild(mensajeElement);
    setTimeout(() => mensajeElement.remove(), 3000);
};

// Gestión de Usuarios
const cargarUsuarios = async () => {
    try {
        const usuarios = await fetchData('Usuarios');
        usuariosList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
        usuarios.forEach(usuario => {
            const usuarioElement = document.createElement('div');
            usuarioElement.className = 'card';
            usuarioElement.innerHTML = `
                <div>
                    <strong>${usuario.nombre}</strong>
                    <p>${usuario.email}</p>
                </div>
                <div class="card-actions">
                    <button onclick="editarUsuario(${usuario.id})" class="btn">Editar</button>
                    <button onclick="eliminarUsuario(${usuario.id})" class="btn btn-danger">Eliminar</button>
                </div>
            `;
            usuariosList.appendChild(usuarioElement);
        });
        actualizarSelectUsuarios(usuarios);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        mostrarMensaje('Error al cargar usuarios', 'error');
    }
};

const guardarUsuario = async (e) => {
    e.preventDefault();
    try {
        const usuario = {
            nombre: document.getElementById('usuarioNombre').value,
            email: document.getElementById('usuarioEmail').value
        };

        const usuarioId = document.getElementById('usuarioId').value;
        if (usuarioId) {
            usuario.id = parseInt(usuarioId);
        }

        if (!usuario.nombre || !usuario.email) {
            throw new Error('El nombre y el email del usuario son obligatorios');
        }

        const url = usuario.id ? `Usuarios/${usuario.id}` : 'Usuarios';
        const method = usuario.id ? 'PUT' : 'POST';

        await fetchData(url, method, usuario);
        mostrarMensaje(usuario.id ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito');
        usuarioForm.reset();
        document.getElementById('usuarioId').value = '';
        await cargarUsuarios();
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        mostrarMensaje(`Error al guardar usuario: ${error.message}`, 'error');
    }
};

const editarUsuario = async (id) => {
    try {
        const usuario = await fetchData(`Usuarios/${id}`);
        if (usuario && typeof usuario === 'object') {
            document.getElementById('usuarioId').value = usuario.id;
            document.getElementById('usuarioNombre').value = usuario.nombre;
            document.getElementById('usuarioEmail').value = usuario.email;
        } else {
            throw new Error('La respuesta del servidor no es válida');
        }
    } catch (error) {
        console.error('Error al editar usuario:', error);
        mostrarMensaje('Error al cargar datos del usuario', 'error');
    }
};

const eliminarUsuario = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            await fetchData(`Usuarios/${id}`, 'DELETE');
            mostrarMensaje('Usuario eliminado con éxito');
            await cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            mostrarMensaje('Error al eliminar usuario', 'error');
        }
    }
};

// Gestión de Productos
const cargarProductos = async () => {
    try {
        const productos = await fetchData('Productos');
        productosList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
        productos.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.className = 'card';
            productoElement.innerHTML = `
                <div>
                    <strong>${producto.nombre}</strong>
                    <p>$${producto.precio.toFixed(2)}</p>
                </div>
                <div class="card-actions">
                    <button onclick="editarProducto(${producto.id})" class="btn">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})" class="btn btn-danger">Eliminar</button>
                </div>
            `;
            productosList.appendChild(productoElement);
        });
        actualizarSeleccionProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarMensaje('Error al cargar productos', 'error');
    }
};

const guardarProducto = async (e) => {
    e.preventDefault();
    try {
        const producto = {
            nombre: document.getElementById('productoNombre').value,
            precio: parseFloat(document.getElementById('productoPrecio').value)
        };
        
        const productoId = document.getElementById('productoId').value;
        if (productoId) {
            producto.id = parseInt(productoId);
        }
        
        if (!producto.nombre || isNaN(producto.precio)) {
            throw new Error('El nombre y el precio del producto son obligatorios');
        }

        if (producto.precio <= 0) {
            throw new Error('El precio del producto debe ser mayor que 0');
        }

        const url = producto.id ? `Productos/${producto.id}` : 'Productos';
        const method = producto.id ? 'PUT' : 'POST';

        await fetchData(url, method, producto);
        mostrarMensaje(producto.id ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
        productoForm.reset();
        document.getElementById('productoId').value = '';
        await cargarProductos();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        mostrarMensaje(`Error al guardar producto: ${error.message}`, 'error');
    }
};

const editarProducto = async (id) => {
    try {
        const producto = await fetchData(`Productos/${id}`);
        if (producto && typeof producto === 'object') {
            document.getElementById('productoId').value = producto.id;
            document.getElementById('productoNombre').value = producto.nombre;
            document.getElementById('productoPrecio').value = producto.precio;
        } else {
            throw new Error('La respuesta del servidor no es válida');
        }
    } catch (error) {
        console.error('Error al editar producto:', error);
        mostrarMensaje('Error al cargar datos del producto', 'error');
    }
};

const eliminarProducto = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await fetchData(`Productos/${id}`, 'DELETE');
            mostrarMensaje('Producto eliminado con éxito');
            await cargarProductos();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            mostrarMensaje('Error al eliminar producto', 'error');
        }
    }
};

// Gestión de Pedidos
const cargarPedidos = async () => {
    try {
        const pedidos = await fetchData('Pedidos');
        pedidosList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos
        pedidos.forEach(pedido => {
            const pedidoElement = document.createElement('div');
            pedidoElement.className = 'card';
            pedidoElement.innerHTML = `
                <div>
                    <strong>Pedido #${pedido.id}</strong>
                    <p>Usuario: ${pedido.usuario.nombre}</p>
                    <p>Productos: ${pedido.productos.map(p => p.nombre).join(', ')}</p>
                </div>
                <div class="card-actions">
                    <button onclick="eliminarPedido(${pedido.id})" class="btn btn-danger">Eliminar</button>
                </div>
            `;
            pedidosList.appendChild(pedidoElement);
        });
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        mostrarMensaje('Error al cargar pedidos', 'error');
    }
};

const guardarPedido = async (e) => {
    e.preventDefault();
    try {
        const usuarioId = parseInt(pedidoUsuario.value);
        const productosSeleccionados = Array.from(document.querySelectorAll('input[name="productos"]:checked')).map(input => parseInt(input.value));
        
        if (!usuarioId) {
            throw new Error('Debe seleccionar un usuario para el pedido');
        }
        if (productosSeleccionados.length === 0) {
            throw new Error('Debe seleccionar al menos un producto para el pedido');
        }

        const pedido = {
            usuarioId: usuarioId,
            productos: productosSeleccionados.map(id => ({ id }))
        };

        await fetchData('Pedidos', 'POST', pedido);
        mostrarMensaje('Pedido creado con éxito');
        pedidoForm.reset();
        await cargarPedidos();
    } catch (error) {
        console.error('Error al guardar pedido:', error);
        mostrarMensaje(`Error al guardar pedido: ${error.message}`, 'error');
    }
};

const eliminarPedido = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
        try {
            await fetchData(`Pedidos/${id}`, 'DELETE');
            mostrarMensaje('Pedido eliminado con éxito');
            await cargarPedidos();
        } catch (error) {
            console.error('Error al eliminar pedido:', error);
            mostrarMensaje('Error al eliminar pedido', 'error');
        }
    }
};

// Funciones de actualización de elementos del DOM
const actualizarSelectUsuarios = (usuarios) => {
    pedidoUsuario.innerHTML = '<option value="">Seleccione un usuario</option>' + 
        usuarios.map(usuario => `<option value="${usuario.id}">${usuario.nombre}</option>`).join('');
};

const actualizarSeleccionProductos = (productos) => {
    productosSeleccion.innerHTML = productos.map(producto => `
        <div class="producto-checkbox">
            <input type="checkbox" id="producto${producto.id}" name="productos" value="${producto.id}">
            <label for="producto${producto.id}">${producto.nombre} - $${producto.precio.toFixed(2)}</label>
        </div>
    `).join('');
};

// Event Listeners
usuariosBtn.addEventListener('click', () => {
    mostrarSeccion('usuarios');
    cargarUsuarios();
});

productosBtn.addEventListener('click', () => {
    mostrarSeccion('productos');
    cargarProductos();
});

pedidosBtn.addEventListener('click', () => {
    mostrarSeccion('pedidos');
    cargarPedidos();
    cargarUsuarios();
    cargarProductos();
});

usuarioForm.addEventListener('submit', guardarUsuario);
productoForm.addEventListener('submit', guardarProducto);
pedidoForm.addEventListener('submit', guardarPedido);

// Inicialización
mostrarSeccion('usuarios');
cargarUsuarios();

// Funciones globales para los botones de editar y eliminar
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.eliminarPedido = eliminarPedido;