/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/cart.js
   Carrito + Wishlist + localStorage + checkout
   ══════════════════════════════════════════════ */

"use strict";

const LS_CART    = "pina_v2_cart";
const LS_WISH    = "pina_v2_wishlist";
const WA_NUMBER  = "56945802810";
const PLACEHOLDER = "https://placehold.co/60x60/162016/b3e600?text=🍍";

/* Estado compartido (en window para acceso global) */
window.cart     = [];
window.wishlist = [];

/* ══════════════════════════════════════════════
   CARRITO
   ══════════════════════════════════════════════ */

function addToCart(id) { addToCartQty(id, 1); }

function addToCartQty(id, qty) {
  const p = findProduct(id);
  if (!p) return;

  qty = Math.max(1, parseInt(qty) || 1);

  // Verificar stock
  if (p.stock === 0) { showToast("❌ Producto agotado"); return; }
  if (p.stock && qty > p.stock) { qty = p.stock; }

  const existing = window.cart.find(x => x.id === String(id));
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, p.stock || 999);
  } else {
    window.cart.push({
      id:     String(id),
      nombre: p.nombre,
      precio: Number(p.precio) || 0,
      imagen: (p.imagenes && p.imagenes[0]) ? p.imagenes[0] : (p.imagen || PLACEHOLDER),
      qty
    });
  }

  saveCartLocal();
  updateCartUI();
  animateBadge("cart-count");
  showToast(`✅ "${p.nombre}" agregado al carrito`);
  closeModal();
}

function removeFromCart(id) {
  window.cart = window.cart.filter(x => x.id !== String(id));
  saveCartLocal();
  updateCartUI();
}

function changeCartQty(id, delta) {
  const item = window.cart.find(x => x.id === String(id));
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCartLocal();
  updateCartUI();
}

function updateCartUI() {
  const itemsEl = document.getElementById("cart-items");
  const countEl = document.getElementById("cart-count");
  const totalEl = document.getElementById("cart-total");

  const totalQty = window.cart.reduce((s, x) => s + x.qty, 0);
  const totalAmt = window.cart.reduce((s, x) => s + x.precio * x.qty, 0);

  /* Badge */
  if (countEl) {
    countEl.textContent = totalQty;
    countEl.classList.toggle("hidden", totalQty === 0);
  }
  if (totalEl) totalEl.textContent = totalAmt ? `$${totalAmt.toLocaleString("es-CL")}` : "$0";

  if (!itemsEl) return;

  if (window.cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <p>🛒 Tu carrito está vacío</p>
        <button class="btn-primary btn-sm" onclick="toggleCart(); showSection('productos')">Ver productos</button>
      </div>`;
    return;
  }

  itemsEl.innerHTML = window.cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.imagen}" alt="${item.nombre}"
           onerror="this.src='${PLACEHOLDER}'">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.nombre}</span>
        <span class="cart-item-price">$${(item.precio * item.qty).toLocaleString("es-CL")}</span>
      </div>
      <div class="cart-item-qty">
        <button onclick="changeCartQty('${item.id}', -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeCartQty('${item.id}', 1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Eliminar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
        </svg>
      </button>
    </div>`).join("");
}

function checkout() {
  if (window.cart.length === 0) { showToast("🛒 Tu carrito está vacío"); return; }
  const lines = window.cart.map(x =>
    `• ${x.nombre} ×${x.qty} — $${(x.precio * x.qty).toLocaleString("es-CL")}`
  );
  const total = window.cart.reduce((s, x) => s + x.precio * x.qty, 0);
  const msg   = `¡Hola Piña GrowShop! 🍍\n\nMe gustaría hacer el siguiente pedido:\n\n${lines.join("\n")}\n\n*Total estimado: $${total.toLocaleString("es-CL")}*\n\n¿Tienen disponibilidad? Gracias 🙏`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ── LocalStorage cart ── */
function saveCartLocal() {
  try { localStorage.setItem(LS_CART, JSON.stringify(window.cart)); } catch (_) {}
}
function loadCartLocal() {
  try {
    const raw = localStorage.getItem(LS_CART);
    if (raw) window.cart = JSON.parse(raw);
  } catch (_) { window.cart = []; }
}

/* ══════════════════════════════════════════════
   WISHLIST
   ══════════════════════════════════════════════ */

function toggleWishlistItem(id) {
  if (!id) return;
  const sid = String(id);
  const idx = window.wishlist.indexOf(sid);
  if (idx === -1) {
    window.wishlist.push(sid);
    showToast("❤️ Guardado en favoritos");
  } else {
    window.wishlist.splice(idx, 1);
    showToast("💔 Quitado de favoritos");
  }
  saveWishlistLocal();
  updateWishlistUI();
  syncWishlistButtons();
  updateModalWishBtn();
}

function updateWishlistUI() {
  const itemsEl = document.getElementById("wishlist-items");
  const countEl = document.getElementById("wishlist-count");
  const navBtn  = document.querySelector(".wishlist-btn");

  const n = window.wishlist.length;
  if (countEl) {
    countEl.textContent = n;
    countEl.classList.toggle("hidden", n === 0);
  }
  if (navBtn) navBtn.classList.toggle("has-items", n > 0);

  if (!itemsEl) return;

  const productos = window.wishlist
    .map(id => findProduct(id))
    .filter(Boolean);

  if (productos.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <p>❤️ Tu lista de favoritos está vacía</p>
        <button class="btn-primary btn-sm" onclick="toggleWishlist(); showSection('productos')">Explorar productos</button>
      </div>`;
    return;
  }

  itemsEl.innerHTML = productos.map(p => {
    const id  = p.firestoreId || p.id;
    const img = (p.imagenes && p.imagenes[0]) ? p.imagenes[0] : (p.imagen || PLACEHOLDER);
    return `
      <div class="wish-item">
        <img src="${img}" alt="${p.nombre}" onerror="this.src='${PLACEHOLDER}'">
        <div class="wish-item-info">
          <span>${p.nombre}</span>
          <small>${formatPrecio(p.precio)}</small>
        </div>
        <div class="wish-item-actions">
          <button class="btn-primary btn-sm" onclick="addToCart('${id}')">🛒</button>
          <button class="btn-ghost btn-sm" onclick="toggleWishlistItem('${id}')">✕</button>
        </div>
      </div>`;
  }).join("");
}

function updateModalWishBtn() {
  const btn = document.getElementById("btn-modal-wish");
  if (!btn || !window._modalId) return;
  const wished = window.wishlist.includes(String(window._modalId));
  btn.classList.toggle("wishlisted", wished);
  btn.querySelector("svg").setAttribute("fill", wished ? "currentColor" : "none");
}

/* ── LocalStorage wishlist ── */
function saveWishlistLocal() {
  try { localStorage.setItem(LS_WISH, JSON.stringify(window.wishlist)); } catch (_) {}
}
function loadWishlistLocal() {
  try {
    const raw = localStorage.getItem(LS_WISH);
    if (raw) window.wishlist = JSON.parse(raw);
  } catch (_) { window.wishlist = []; }
}

/* ── Helpers ── */
function findProduct(id) {
  return window.catalogoGlobal.find(p => String(p.firestoreId || p.id) === String(id));
}

function formatPrecio(precio) {
  if (precio === undefined || precio === null || precio === "") return "Consultar";
  const n = Number(precio);
  return isNaN(n) ? "Consultar" : `$${n.toLocaleString("es-CL")}`;
}
