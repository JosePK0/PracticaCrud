const apiBaseUrl = "http://localhost:5275/api";

// Funciones para Usuarios
async function obtenerUsuarios() {
    const response = await fetch(`${apiBaseUrl}/Usuario`);
    const usuarios = await response.json();
    const listaUsuarios = document.getElementById("listaUsuarios");
    listaUsuarios.innerHTML = "";

    usuarios.forEach(usuario => {
        const li = document.createElement("li");
        li.textContent = `${usuario.nombre} (${usuario.email})`;
        listaUsuarios.appendChild(li);
    });

    // También llenar el select para pedidos
    const pedidoUsuario = document.getElementById("pedidoUsuario");
    pedidoUsuario.innerHTML = "<option value=''>Seleccionar Usuario</option>";
    usuarios.forEach(usuario => {
        const option = document.createElement("option");
        option.value = usuario.id;
        option.textContent = usuario.nombre;
        pedidoUsuario.appendChild(option);
    });
}

async function crearUsuario() {
    const usuario = {
        nombre: document.getElementById("usuarioNombre").value,
        email: document.getElementById("usuarioEmail").value
    };

    await fetch(`${apiBaseUrl}/Usuario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });

    obtenerUsuarios();  // Actualiza la lista de usuarios
}

// Funciones para Productos
async function obtenerProductos() {
    const response = await fetch(`${apiBaseUrl}/Producto`);
    const productos = await response.json();
    const listaProductos = document.getElementById("listaProductos");
    listaProductos.innerHTML = "";

    productos.forEach(producto => {
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} - $${producto.precio}`;
        listaProductos.appendChild(li);
    });

    // También llenar el select para pedidos
    const pedidoProductos = document.getElementById("pedidoProductos");
    pedidoProductos.innerHTML = "<option value=''>Seleccionar Productos</option>";
    productos.forEach(producto => {
        const option = document.createElement("option");
        option.value = producto.id;
        option.textContent = producto.nombre;
        pedidoProductos.appendChild(option);
    });
}

async function crearProducto() {
    const nombre = document.getElementById("productoNombre").value;
    const precio = parseFloat(document.getElementById("productoPrecio").value);

    await fetch(`${apiBaseUrl}/Producto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio })
    });

    obtenerProductos();  // Actualiza la lista de productos
}

// Funciones para Pedidos
async function obtenerPedidos() {
    const response = await fetch(`${apiBaseUrl}/Pedido`);
    const pedidos = await response.json();
    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = "";

    pedidos.forEach(pedido => {
        const li = document.createElement("li");
        const productos = pedido.productos.map(p => p.nombre).join(", ");
        li.textContent = `Pedido ${pedido.id} por ${pedido.usuario.nombre}: ${productos}`;
        listaPedidos.appendChild(li);
    });
}

async function crearPedido() {
    const usuarioId = parseInt(document.getElementById("pedidoUsuario").value);
    const productosSeleccionados = Array.from(document.getElementById("pedidoProductos").selectedOptions)
        .map(option => parseInt(option.value));

    if (!usuarioId || productosSeleccionados.length === 0) {
        alert("Seleccione un usuario y al menos un producto.");
        return;
    }

    await fetch(`${apiBaseUrl}/Pedido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, productos: productosSeleccionados })
    });

    obtenerPedidos();  // Actualiza la lista de pedidos
}

// Inicializar los datos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    obtenerUsuarios();
    obtenerProductos();
    obtenerPedidos();
});
