/* app.js - Carrito profesional unificado (local + API) */
/* === Productos locales === */

const productosLocales = [
  { id: 'p1', nombre: "Etiopía Yirgacheffe Premium", precio: 18.50, imagen: "./img/cafe_img1.jpg", descripcion: "Un café de origen único" },
  { id: 'p2', nombre: "Prensa Francesa Clásica 1L", precio: 35.00, imagen: "./img/cafe_img2.jpeg", descripcion: "El mejor método para obtener u café." },
  { id: 'p3', nombre: "Set de Tazas de Cerámica Artesanal", precio: 12.99, imagen: "./img/tazas_img3.jpg", descripcion: "Tazas artesanales hechas a mano con cerámica de alta calidad, ideales para café o té y con un diseño único en cada pieza." },
  { id: 'p4', nombre: "Blend Tostado Intenso", precio: 18.50, imagen: "./img/img4.png", descripcion: "Tostado oscuro para café espresso" },
  { id: 'p5', nombre: "Café Exótico de Especialidad", precio: 35.00, imagen: "./img/img5.webp", descripcion: "Edición limitada, aromatico  y dulce" },
  { id: 'p6', nombre: "Café Consumo Diario", precio: 12.99, imagen: "./img/img6.webp", descripcion: "Nuestro blend unico que busca ser intenso." },
];

/* === Estado === */
localStorage.removeItem("carrito");
let catalogo = [];
let carrito = JSON.parse(localStorage.getItem('carrito_v1')) || [];

/* === Referencias DOM === */
const contenedorProductos = document.getElementById('contenedor-productos');
const carritoIcon = document.getElementById('carrito-icon');
const modal = document.getElementById('carrito-modal');
const carritoBackdrop = document.getElementById('carrito-backdrop');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarritoEl = document.getElementById('total-carrito');
const btnVaciar = document.getElementById('vaciar-carrito');
const btnCerrar = document.getElementById('cerrar-carrito');

/* === Inicialización === */
document.addEventListener('DOMContentLoaded', () => {
  // 1) Cargar catálogo (local + API)
  catalogo = [...productosLocales]; // empezamos con locales
  cargarProductosAPI(); // luego traemos la API y la mezclamos

  // 2) Render inicial con los locales (rápido)
  renderizarProductos(catalogo);

  // 3) Eventos UI carrito
  if (carritoIcon) carritoIcon.addEventListener('click', toggleCarrito);
  if (carritoBackdrop) carritoBackdrop.addEventListener('click', closeCarrito);
  if (btnVaciar) btnVaciar.addEventListener('click', clearCart);
  if (btnCerrar) btnCerrar.addEventListener('click', closeCarrito);

  // 4) Render carrito guardado
  actualizarCarritoUI();
  actualizarContadorCarrito();
})
;
function actualizarContadorCarrito() {
  const contador = document.getElementById('contador-carrito');
  
  let totalUnidades = 0;
  carrito.forEach(item => totalUnidades += item.cantidad);

  contador.textContent = totalUnidades;
}
/* =========================
   Renderizado de productos
   ========================= */
function renderizarProductos(lista) {
  // vaciamos y renderizamos todo (simple)
  contenedorProductos.innerHTML = '';
  lista.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${escapeHtml(prod.nombre)}">
      <h3>${escapeHtml(prod.nombre)}</h3>
        <p>${escapeHtml(prod.descripcion)}</p>
      <div class="card-footer">
        <span>$${prod.precio.toFixed(2)}</span>
        <button class="btn-agregar" data-id="${prod.id}">Agregar</button>
      </div>
    `;
    contenedorProductos.appendChild(card);
  });

  // Delegación de eventos para los botones agregar (más eficiente)
  contenedorProductos.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart(id);
    });
  });
}

/* =========================
   Funciones del carrito
   ========================= */
function addToCart(productId) {
  // buscar producto en catálogo por id
  const prod = catalogo.find(p => String(p.id) === String(productId));
  if (!prod) return console.warn('Producto no encontrado en catálogo:', productId);

  // buscar en carrito
  const existente = carrito.find(item => item.id === prod.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, imagen: prod.imagen, cantidad: 1 });
  }

  guardarYRender();
}

function changeQuantity(productId, delta) {
  const item = carrito.find(i => String(i.id) === String(productId));
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => String(i.id) !== String(productId));
  }
  guardarYRender();
}

function removeItem(productId) {
  carrito = carrito.filter(i => String(i.id) !== String(productId));
  guardarYRender();
}

function clearCart() {
  carrito = [];
  guardarYRender();
}

/* actualizar UI del carrito */
function actualizarCarritoUI() {
  // vaciar nodo
  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<li style="color:#666; padding:10px 0;">Tu carrito está vacío.</li>';
    totalCarritoEl.textContent = '$0.00';
    localStorage.setItem('carrito_v1', JSON.stringify(carrito));
    return;
  }

  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement('li');
    li.className = 'carrito-item';
    li.innerHTML = `
      <div class="item-info">
        <div class="nombre">${escapeHtml(item.nombre)}</div>
        <div class="meta">
          <div>$${item.precio.toFixed(2)} c/u</div>
          <div style="margin-left:auto; font-weight:700;">$${subtotal.toFixed(2)}</div>
        </div>
        <div style="margin-top:8px; display:flex; align-items:center; gap:8px;">
          <div class="qty-controls" data-id="${item.id}">
            <button class="btn-menos" data-id="${item.id}">−</button>
            <div style="min-width:28px; text-align:center;">${item.cantidad}</div>
            <button class="btn-mas" data-id="${item.id}">+</button>
          </div>
          <button class="btn-remove" data-id="${item.id}" title="Eliminar">❌</button>
        </div>
      </div>
    `;

    listaCarrito.appendChild(li);
  });

  totalCarritoEl.textContent = `$${total.toFixed(2)}`;
  localStorage.setItem('carrito_v1', JSON.stringify(carrito));

  // agregar listeners para + - eliminar
  listaCarrito.querySelectorAll('.btn-mas').forEach(b => {
    b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      changeQuantity(id, +1);
    });
  });
  listaCarrito.querySelectorAll('.btn-menos').forEach(b => {
    b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      changeQuantity(id, -1);
    });
  });
  listaCarrito.querySelectorAll('.btn-remove').forEach(b => {
    b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      removeItem(id);
    });
  });
}

/* helper guardar + re-render */
function guardarYRender() {
  actualizarCarritoUI();
  actualizarContadorCarrito();
}

/* abrir/cerrar carrito */
function openCarrito() {
  modal.style.display = 'block';
  if (carritoBackdrop) carritoBackdrop.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
}
function closeCarrito() {
  modal.style.display = 'none';
  if (carritoBackdrop) carritoBackdrop.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}
function toggleCarrito() {
  if (modal.style.display === 'block') closeCarrito();
  else openCarrito();
}

/* === Cargar productos desde API y añadir al catálogo === */
function cargarProductosAPI() {
  const url = 'https://fakestoreapi.com/products';
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(data => {
      // convertimos los productos de la API a nuestro formato y les damos id único
      const apiProducts = data.map(p => ({
        id: 'api-' + p.id,
        nombre: p.title,
        precio: parseFloat(p.price),
        imagen: p.image,
        descripcion: p.description
      }));
      // añadir al catálogo y re-render
      catalogo = [...productosLocales, ...apiProducts];
      renderizarProductos(catalogo);
    })
    .catch(err => {
      console.error('No se pudieron cargar productos API:', err);
      // dejamos solo los locales si falla
      catalogo = [...productosLocales];
      renderizarProductos(catalogo);
    });
}

/* pequeña utilidad para evitar inyección en nombres (seguro) */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
