// Array completo de 6 productos
const productos = [
    { 
        id: 1, 
        nombre: "Etiopía Yirgacheffe Premium", 
        precio: 18.50, 
        imagen: "./img/cafe_img1.jpg",
        descripcion: "Un café de origen único, notas florales y toques cítricos. Tostado medio. Ideal para la mañana."
    },
    { 
        id: 2, 
        nombre: "Prensa Francesa Clásica 1L", 
        precio: 35.00, 
        imagen: "./img/cafe_img2.jpeg",
        descripcion: "El mejor método para una infusión rica y con cuerpo. Filtro de acero inoxidable, capacidad 1 litro."
    },
    { 
        id: 3, 
        nombre: "Set de Tazas de Cerámica Artesanal", 
        precio: 12.99, 
        imagen: "./img/tazas_img3.jpg",
        descripcion: "Tazas únicas hechas a mano, perfectas para tu espresso matutino. Disponibles en 3 colores."
    },
    { 
        id: 4, 
        nombre: "Blend Tostado Intenso", 
        precio: 18.50, 
        imagen: "./img/img4.png",
        descripcion: "Tostado oscuro, cuerpo completo. Perfecto para máquinas de espresso."
    },
    { 
        id: 5, 
        nombre: "Café Exótico de Especialidad", 
        precio: 35.00, 
        imagen: "./img/img5.webp",
        descripcion: "Edición limitada de origen africano con notas de bayas. Filtrado ideal."
    },
    { 
        id: 6, 
        nombre: "Café Consumo Diario", 
        precio: 12.99, 
        imagen: "./img/img6.webp",
        descripcion: "Nuestro blend más vendido, ideal para el día a día. Sabor balanceado y dulce."
    },
];

// Variables de control
const productosPorDefecto = 3;
let productosMostrados = 0; 

// Referencias del DOM
const contenedorProductos = document.getElementById('contenedor-productos');
const botonCargar = document.getElementById('btn-mostrar-productos');

function renderizarProductos(productosArray) {
    productosArray.forEach(producto => {
        const tarjeta = document.createElement('article');
        
        const titulo = document.createElement('h2'); 
        titulo.textContent = producto.nombre;

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = "Imagen de " + producto.nombre;

        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;
        
        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');

        const precioSpan = document.createElement('span');
        precioSpan.textContent = `$ ${producto.precio.toFixed(2)} USD`;

        const boton = document.createElement('button');
        boton.textContent = "Agregar al Carrito";
        boton.type = "submit";
        
        cardFooter.appendChild(precioSpan);
        cardFooter.appendChild(boton);

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(cardFooter);

        contenedorProductos.appendChild(tarjeta);
        productosMostrados++; // Incrementa el contador por cada tarjeta añadida
    });

    // Lógica para ocultar/actualizar el botón después de la renderización
    if (productosMostrados >= productos.length) {
        botonCargar.style.display = 'none'; // Oculta si ya no hay más productos
    } else {
        botonCargar.style.display = 'block';
        // Actualiza el texto para indicar cuántos quedan
        botonCargar.textContent = `Cargar Más Productos (${productos.length - productosMostrados} restantes)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const primerosProductos = productos.slice(0, productosPorDefecto);
    renderizarProductos(primerosProductos);
});

botonCargar.addEventListener('click', () => {
    const productosRestantes = productos.slice(productosMostrados);
    renderizarProductos(productosRestantes);
});
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    let total = 0;

    listaCarrito.innerHTML = '';
    
    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.textContent = `${producto.name} - $${producto.amount.toFixed(2)}`;
        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = '❌';
        botonEliminar.style.marginLeft = '10px';
        botonEliminar.style.cursor = 'pointer';
        botonEliminar.addEventListener('click', () => eliminarDelCarrito(index));
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        total += producto.amount;
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;
    contadorCarrito.textContent = carrito.length;
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(e) {
    const productId = parseInt(e.target.dataset.id);
    const productoAñadir = productosData.find(p => p.id === productId);

    if (productoAñadir) {
        carrito.push({...productoAñadir}); 
        actualizarCarrito();
        alert(`"${productoAñadir.name}" añadido al carrito.`);
    }
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    alert('Carrito vaciado.');
}

document.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById('carrito-icon');
    const modal = document.getElementById('carrito-modal');
    if (icon && modal) {
        icon.addEventListener('click', () => {
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        });
    }

    const botonVaciar = document.getElementById('vaciar-carrito');
    if (botonVaciar) {
        botonVaciar.addEventListener('click', vaciarCarrito);
    }
    
    actualizarCarrito();
});