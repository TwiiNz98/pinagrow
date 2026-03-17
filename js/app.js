/* =====================================================
   PIÑA GROWSHOP — app.js
   Stack: Vanilla JS · Firebase v10 Modular CDN
   WhatsApp: +56945802810
   Firestore: tienda > catalogo > productos[]
   ===================================================== */

"use strict";

/* ── CONSTANTES ── */
const ADMIN_PASSWORD = "Pineapple420";
const WA_NUMBER      = "56945802810";
const LS_CART_KEY    = "pina_cart";

const CATEGORIAS = {
  "Smoke":      ["Pipas","Bongs","Papelillos","Enroladores","Limpieza"],
  "Cultivo":    ["Sustratos","Fertilizantes","Carpas","Iluminación","Control de Plagas"],
  "Tabaquería": ["Cigarrillos","Tabaco","Pipas de tabaco","Accesorios"],
  "Aromas":     ["Inciensos","Aceites esenciales","Difusores","Velas"]
};

/* ── ESTADO GLOBAL ── */
let catalogoGlobal   = [];   // productos cargados desde Firestore
let cart             = [];   // [{id, nombre, precio, imagen, qty}]
let adminEditingId   = null; // id del producto en edición
let adminImages      = [];   // base64 de imágenes subidas

/* ══════════════════════════════════════════════════════
   FIREBASE / FIRESTORE
   ══════════════════════════════════════════════════════ */

/** Listener en tiempo real — puebla catalogoGlobal y re-renderiza */
function initApp() {
  const db = window.db_cloud;
  if (!db) { console.warn("Firestore no disponible"); return; }

  const { doc, onSnapshot } = window.firestoreModular || {};
  if (!doc || !onSnapshot) { console.warn("Módulos Firestore no encontrados"); return; }

  const ref = doc(db, "tienda", "catalogo");

  onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      catalogoGlobal = snap.data().productos || [];
    } else {
      catalogoGlobal = [];
    }
    renderProducts();
    renderAdminList();
    setFirebaseStatus("🟢 Conectado a Firebase", "#3ea843");
  }, (err) => {
    console.error("Firestore error:", err);
    setFirebaseStatus("🔴 Error de conexión", "#e53935");
  });
}

/** Guarda el catálogo completo en Firestore */
async function guardarCatalogo(productos) {
  const db = window.db_cloud;
  if (!db) { showToast("❌ Sin conexión a Firebase"); return; }

  const { doc, setDoc } = window.firestoreModular || {};
  if (!doc || !setDoc) return;

  try {
    await setDoc(doc(db, "tienda", "catalogo"), { productos });
    showToast("✅ Catálogo guardado correctamente");
  } catch (err) {
    console.error("Error guardando:", err);
    showToast("❌ Error al guardar. Intenta de nuevo.");
  }
}

/* ══════════════════════════════════════════════════════
   RENDER DE PRODUCTOS
   ══════════════════════════════════════════════════════ */

/**
 * Renderiza la grilla de productos.
 * Si se pasa `lista`, usa esa; si no, aplica los filtros activos.
 */
function renderProducts(lista) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const productos = lista !== undefined ? lista : getFilteredProducts();

  if (productos.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>😕 No encontramos productos con ese filtro.</p>
        <button class="btn-primary" onclick="resetFilters()">Ver todos</button>
      </div>`;
    return;
  }

  grid.innerHTML = productos.map(p => {
    const img   = (p.imagenes && p.imagenes[0]) ? p.imagenes[0]
                : (p.imagen ? p.imagen : "https://placehold.co/400x300/1a2a1a/b3e600?text=🍍");
    const precio = typeof p.precio === "number"
                 ? `$${p.precio.toLocaleString("es-CL")}`
                 : (p.precio || "Consultar");

    return `
      <div class="product-card reveal-el" role="listitem" data-id="${p.id}">
        <div class="product-img-wrap" onclick="openModal('${p.id}')">
          <img src="${img}" class="product-img" alt="${p.nombre}" loading="lazy"
               onerror="this.src='https://placehold.co/400x300/1a2a1a/b3e600?text=🍍'">
          <div class="product-img-overlay">
            <span class="quickview-label">Vista Rápida</span>
          </div>
        </div>
        <div class="product-card-body">
          <span class="cat-chip">${p.categoria || ""}</span>
          <h3 class="product-name">${p.nombre}</h3>
          <p class="product-price">${precio}</p>
          <button class="btn-add-cart" onclick="addToCart('${p.id}')">🛒 Agregar</button>
        </div>
      </div>`;
  }).join("");

  // Re-iniciar scroll reveal para los nuevos cards
  initScrollReveal();
}

/* ══════════════════════════════════════════════════════
   FILTROS Y BÚSQUEDA
   ══════════════════════════════════════════════════════ */

/** Devuelve los productos filtrados según los controles activos */
function getFilteredProducts() {
  const cat    = document.getElementById("filter-cat")?.value    || "";
  const subcat = document.getElementById("filter-subcat")?.value || "";
  const sortP  = document.getElementById("sort-price")?.value    || "";
  const sortA  = document.getElementById("sort-alpha")?.value    || "";
  const query  = (document.getElementById("global-search")?.value || "").toLowerCase().trim();

  let lista = [...catalogoGlobal];

  if (cat)    lista = lista.filter(p => p.categoria === cat);
  if (subcat) lista = lista.filter(p => p.subcategoria === subcat);
  if (query)  lista = lista.filter(p =>
    (p.nombre        || "").toLowerCase().includes(query) ||
    (p.descripcion   || "").toLowerCase().includes(query) ||
    (p.categoria     || "").toLowerCase().includes(query) ||
    (p.subcategoria  || "").toLowerCase().includes(query)
  );

  // Ordenamiento precio
  if (sortP === "asc")  lista.sort((a, b) => (a.precio || 0) - (b.precio || 0));
  if (sortP === "desc") lista.sort((a, b) => (b.precio || 0) - (a.precio || 0));

  // Ordenamiento alfabético
  if (sortA === "az") lista.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"));
  if (sortA === "za") lista.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || "", "es"));

  return lista;
}

/** Aplica filtros y re-renderiza */
function applyFilters() {
  renderProducts();
}

/** Actualiza el select de subcategorías según la categoría seleccionada */
function updateSubcats() {
  const cat    = document.getElementById("filter-cat")?.value || "";
  const select = document.getElementById("filter-subcat");
  if (!select) return;

  select.innerHTML = `<option value="">Todas las subcategorías</option>`;
  const subs = CATEGORIAS[cat] || [];
  subs.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });

  select.disabled = !cat;
}

/** Búsqueda en tiempo real (debounce 200ms) */
let searchTimer = null;
function liveSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(applyFilters, 200);
}

/** Filtro rápido desde botones de categoría en el hero */
function filterQuick(cat) {
  const sel = document.getElementById("filter-cat");
  if (sel) {
    sel.value = cat;
    updateSubcats();
  }
  applyFilters();
  showSection("productos");
}

/** Limpia todos los filtros y vuelve a mostrar todo */
function resetFilters() {
  const ids = ["filter-cat", "filter-subcat", "sort-price", "sort-alpha", "global-search"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const subcat = document.getElementById("filter-subcat");
  if (subcat) subcat.disabled = true;
  renderProducts(catalogoGlobal);
}

/* ══════════════════════════════════════════════════════
   MODAL DE PRODUCTO
   ══════════════════════════════════════════════════════ */

function openModal(id) {
  const p = catalogoGlobal.find(x => String(x.id) === String(id));
  if (!p) return;

  const modal    = document.getElementById("product-modal");
  const imgEl    = document.getElementById("modal-img");
  const nameEl   = document.getElementById("modal-name");
  const descEl   = document.getElementById("modal-desc");
  const priceEl  = document.getElementById("modal-price");
  const catEl    = document.getElementById("modal-cat");
  const thumbs   = document.getElementById("modal-thumbs");
  const addBtn   = document.getElementById("btn-modal-add");
  const qtyInput = document.getElementById("modal-qty");

  const imgs = p.imagenes?.length ? p.imagenes : (p.imagen ? [p.imagen] : []);
  const mainImg = imgs[0] || "https://placehold.co/600x400/1a2a1a/b3e600?text=🍍";

  if (imgEl)   imgEl.src = mainImg;
  if (nameEl)  nameEl.textContent = p.nombre || "Sin nombre";
  if (descEl)  descEl.textContent = p.descripcion || "Sin descripción disponible.";
  if (priceEl) priceEl.textContent = p.precio
    ? `$${Number(p.precio).toLocaleString("es-CL")}`
    : "Consultar precio";
  if (catEl)   catEl.textContent = [p.categoria, p.subcategoria].filter(Boolean).join(" › ");
  if (qtyInput) qtyInput.value = 1;
  if (addBtn)   addBtn.onclick = () => addToCartWithQty(id, parseInt(qtyInput?.value || 1));

  // Thumbnails
  if (thumbs) {
    thumbs.innerHTML = imgs.map((src, i) => `
      <img src="${src}" class="modal-thumb${i === 0 ? " active" : ""}"
           alt="Imagen ${i+1}" onclick="switchModalImg(this, '${src}')"
           onerror="this.style.display='none'">`
    ).join("");
  }

  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function switchModalImg(el, src) {
  const imgEl = document.getElementById("modal-img");
  if (imgEl) imgEl.src = src;
  document.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

function changeQty(delta) {
  const input = document.getElementById("modal-qty");
  if (!input) return;
  const val = Math.max(1, (parseInt(input.value) || 1) + delta);
  input.value = val;
}

/* ══════════════════════════════════════════════════════
   CARRITO
   ══════════════════════════════════════════════════════ */

function addToCart(id) {
  const p = catalogoGlobal.find(x => String(x.id) === String(id));
  if (!p) return;
  addToCartWithQty(id, 1);
}

function addToCartWithQty(id, qty) {
  const p = catalogoGlobal.find(x => String(x.id) === String(id));
  if (!p) return;

  qty = Math.max(1, parseInt(qty) || 1);
  const existing = cart.find(x => String(x.id) === String(id));

  if (existing) {
    existing.qty += qty;
  } else {
    const img = (p.imagenes && p.imagenes[0]) ? p.imagenes[0]
              : (p.imagen || "https://placehold.co/80x80/1a2a1a/b3e600?text=🍍");
    cart.push({
      id:      String(p.id),
      nombre:  p.nombre,
      precio:  p.precio || 0,
      imagen:  img,
      qty
    });
  }

  updateCart();
  saveCartLocal();
  animateCartBadge();
  showToast(`✅ "${p.nombre}" agregado al carrito`);

  // Cerrar modal si está abierto
  closeModal();
}

function removeFromCart(id) {
  cart = cart.filter(x => String(x.id) !== String(id));
  updateCart();
  saveCartLocal();
}

function changeCartQty(id, delta) {
  const item = cart.find(x => String(x.id) === String(id));
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCart();
  saveCartLocal();
}

/** Re-dibuja el sidebar del carrito */
function updateCart() {
  const itemsEl = document.getElementById("cart-items");
  const countEl = document.getElementById("cart-count");
  const totalEl = document.getElementById("cart-total");

  const totalQty = cart.reduce((s, x) => s + x.qty, 0);
  const totalAmt = cart.reduce((s, x) => s + (x.precio * x.qty), 0);

  if (countEl) countEl.textContent = totalQty;

  if (totalEl) totalEl.textContent = totalAmt
    ? `$${totalAmt.toLocaleString("es-CL")}`
    : "$0";

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <p>Tu carrito está vacío 🛒</p>
        <button class="btn-primary" onclick="toggleCart(); showSection('productos')">
          Ver productos
        </button>
      </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item-img" src="${item.imagen}" alt="${item.nombre}"
           onerror="this.src='https://placehold.co/60x60/1a2a1a/b3e600?text=🍍'">
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
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>`).join("");
}

/** Genera mensaje de WhatsApp y abre wa.me */
function checkout() {
  if (cart.length === 0) { showToast("🛒 Tu carrito está vacío"); return; }

  const lines = cart.map(x =>
    `• ${x.nombre} x${x.qty} — $${(x.precio * x.qty).toLocaleString("es-CL")}`
  );
  const total = cart.reduce((s, x) => s + (x.precio * x.qty), 0);
  const msg   = `¡Hola Piña GrowShop! 🍍\n\nMe gustaría pedir:\n\n${lines.join("\n")}\n\n*Total: $${total.toLocaleString("es-CL")}*\n\n¿Tienen disponibilidad?`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ── LocalStorage ── */
function saveCartLocal() {
  try { localStorage.setItem(LS_CART_KEY, JSON.stringify(cart)); } catch (_) {}
}

function loadCartLocal() {
  try {
    const raw = localStorage.getItem(LS_CART_KEY);
    if (raw) cart = JSON.parse(raw);
  } catch (_) { cart = []; }
}

/* ══════════════════════════════════════════════════════
   PANEL ADMINISTRADOR
   ══════════════════════════════════════════════════════ */

function checkAdminPassword() {
  const pass = prompt("🔐 Contraseña de administrador:");
  if (pass === null) return; // canceló
  if (pass === ADMIN_PASSWORD) {
    document.getElementById("admin-panel")?.classList.add("open");
    renderAdminList();
  } else {
    showToast("❌ Contraseña incorrecta");
  }
}

function toggleAdmin() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;
  if (panel.classList.contains("open")) {
    panel.classList.remove("open");
  } else {
    checkAdminPassword();
  }
}

/** Lista de productos en el panel admin */
function renderAdminList() {
  const list = document.getElementById("admin-list");
  if (!list) return;

  if (catalogoGlobal.length === 0) {
    list.innerHTML = `<p class="admin-empty">No hay productos aún. ¡Agrega el primero!</p>`;
    return;
  }

  list.innerHTML = catalogoGlobal.map(p => {
    const img = (p.imagenes && p.imagenes[0]) ? p.imagenes[0]
              : (p.imagen || "https://placehold.co/46x46/1a2a1a/b3e600?text=🍍");
    const precio = p.precio ? `$${Number(p.precio).toLocaleString("es-CL")}` : "Sin precio";
    return `
      <div class="admin-product-item" data-id="${p.id}">
        <img src="${img}" width="46" height="46" alt="${p.nombre}"
             onerror="this.src='https://placehold.co/46x46/1a2a1a/b3e600?text=🍍'">
        <div class="admin-product-info">
          <strong>${p.nombre}</strong>
          <span>${[p.categoria, p.subcategoria].filter(Boolean).join(" › ")} — ${precio}</span>
        </div>
        <div class="admin-product-btns">
          <button class="btn-admin-edit" onclick="editProduct('${p.id}')" title="Editar">✏️</button>
          <button class="btn-admin-del"  onclick="deleteProduct('${p.id}')" title="Eliminar">🗑️</button>
        </div>
      </div>`;
  }).join("");
}

/** Carga los datos de un producto en el formulario de edición */
function editProduct(id) {
  const p = catalogoGlobal.find(x => String(x.id) === String(id));
  if (!p) return;

  adminEditingId = String(id);
  adminImages    = p.imagenes || (p.imagen ? [p.imagen] : []);

  setField("admin-nombre",      p.nombre       || "");
  setField("admin-descripcion", p.descripcion  || "");
  setField("admin-precio",      p.precio       || "");
  setField("admin-categoria",   p.categoria    || "");
  setField("admin-subcategoria",p.subcategoria || "");
  setField("admin-stock",       p.stock        || "");

  const saveBtn = document.getElementById("admin-save-btn");
  if (saveBtn) saveBtn.textContent = "💾 Actualizar producto";

  // Scroll al formulario
  document.getElementById("admin-save-btn")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/** Agrega un producto nuevo o actualiza el existente */
function addProduct() {
  const nombre      = getField("admin-nombre").trim();
  const descripcion = getField("admin-descripcion").trim();
  const precio      = parseFloat(getField("admin-precio"));
  const categoria   = getField("admin-categoria").trim();
  const subcategoria= getField("admin-subcategoria").trim();
  const stock       = getField("admin-stock").trim();

  if (!nombre)    { showToast("⚠️ El nombre es obligatorio"); return; }
  if (!categoria) { showToast("⚠️ La categoría es obligatoria"); return; }

  if (adminEditingId) {
    // Actualizar existente
    const idx = catalogoGlobal.findIndex(x => String(x.id) === adminEditingId);
    if (idx !== -1) {
      catalogoGlobal[idx] = {
        ...catalogoGlobal[idx],
        nombre, descripcion, precio, categoria, subcategoria, stock,
        imagenes: adminImages
      };
    }
  } else {
    // Nuevo producto
    const nuevoId = `p_${Date.now()}`;
    catalogoGlobal.push({
      id: nuevoId,
      nombre, descripcion, precio, categoria, subcategoria, stock,
      imagenes: adminImages
    });
  }

  guardarCatalogo(catalogoGlobal);
  resetAdminForm();
}

/** Elimina un producto (pide confirmación) */
function deleteProduct(id) {
  const p = catalogoGlobal.find(x => String(x.id) === String(id));
  if (!p) return;
  if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;

  catalogoGlobal = catalogoGlobal.filter(x => String(x.id) !== String(id));
  guardarCatalogo(catalogoGlobal);
  showToast(`🗑️ "${p.nombre}" eliminado`);
}

/** Resetea el formulario de admin */
function resetAdminForm() {
  adminEditingId = null;
  adminImages    = [];
  ["admin-nombre","admin-descripcion","admin-precio",
   "admin-categoria","admin-subcategoria","admin-stock"].forEach(id => setField(id, ""));
  const saveBtn = document.getElementById("admin-save-btn");
  if (saveBtn) saveBtn.textContent = "➕ Agregar producto";
}

/** Maneja subida de imágenes → base64 */
function handleAdminFilesChange(event) {
  const files = Array.from(event.target.files || []);
  adminImages  = [];

  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      adminImages.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}

/* ── helpers de campos de formulario ── */
function getField(id)      { return document.getElementById(id)?.value || ""; }
function setField(id, val) { const el = document.getElementById(id); if (el) el.value = val; }

/* ══════════════════════════════════════════════════════
   NAVEGACIÓN Y UI
   ══════════════════════════════════════════════════════ */

/** Muestra una sección y oculta las demás */
function showSection(id) {
  document.querySelectorAll(".page-section").forEach(sec => {
    sec.classList.toggle("active", sec.id === id);
  });

  // Actualizar estado activo en nav links
  document.querySelectorAll(".nav-link[data-section]").forEach(link => {
    link.classList.toggle("active", link.dataset.section === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  closeMobileMenu();
}

/** Abre/cierra el sidebar del carrito */
function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("cart-overlay-bg");
  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle("open");
  if (overlay) overlay.classList.toggle("open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}

/** Abre/cierra el menú móvil */
function toggleMobileMenu() {
  const nav = document.getElementById("main-nav-links");
  const btn = document.getElementById("hamburger");
  if (!nav) return;

  const isOpen = nav.classList.toggle("open");
  if (btn) btn.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  const nav = document.getElementById("main-nav-links");
  const btn = document.getElementById("hamburger");
  if (nav) nav.classList.remove("open");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

/** Muestra un toast de notificación */
let toastTimer = null;
function showToast(msg) {
  const container = document.getElementById("toast-container") || createToastContainer();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const div = document.createElement("div");
  div.id = "toast-container";
  document.body.appendChild(div);
  return div;
}

/** Actualiza el indicador de estado de Firebase */
function setFirebaseStatus(msg, color) {
  const el = document.getElementById("firebase-status");
  if (!el) return;
  el.textContent = msg;
  el.style.color = color || "inherit";
}

/** Gate +18: acepta o redirige */
function closeGate() {
  const gate = document.getElementById("gate");
  if (gate) {
    gate.style.opacity = "0";
    setTimeout(() => gate.remove(), 400);
  }
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════════════════════
   ANIMACIONES Y EFECTOS
   ══════════════════════════════════════════════════════ */

/** Pulso en el badge del carrito */
function animateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  badge.classList.remove("pulse");
  void badge.offsetWidth; // reflow
  badge.classList.add("pulse");
}

/** IntersectionObserver para revelar elementos al hacer scroll */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-el:not(.is-visible)");
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(el => observer.observe(el));
}

/** Compact navbar al hacer scroll */
function initNavbarScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 60);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // ejecutar al inicio
}

/* ══════════════════════════════════════════════════════
   INIT — DOMContentLoaded
   ══════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. Carrito persistido */
  loadCartLocal();
  updateCart();

  /* 2. Gate +18 */
  const gateYes = document.getElementById("gate-yes");
  const gateNo  = document.getElementById("gate-no");

  if (gateYes) gateYes.addEventListener("click", closeGate);
  if (gateNo)  gateNo.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });

  /* 3. Sección inicial */
  showSection("inicio");

  /* 4. Scroll reveal + navbar */
  initScrollReveal();
  initNavbarScroll();

  /* 5. Filtros */
  document.getElementById("filter-cat")?.addEventListener("change", () => {
    updateSubcats();
    applyFilters();
  });
  document.getElementById("filter-subcat")?.addEventListener("change", applyFilters);
  document.getElementById("sort-price")?.addEventListener("change", applyFilters);
  document.getElementById("sort-alpha")?.addEventListener("change", applyFilters);
  document.getElementById("global-search")?.addEventListener("input", liveSearch);

  /* 6. Cerrar cart al hacer click en overlay */
  document.getElementById("cart-overlay-bg")?.addEventListener("click", toggleCart);

  /* 7. Cerrar modal con Escape o click fuera */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
      const sidebar = document.getElementById("cart-sidebar");
      if (sidebar?.classList.contains("open")) toggleCart();
    }
  });
  document.getElementById("product-modal")?.addEventListener("click", function(e) {
    if (e.target === this) closeModal();
  });

  /* 8. Nav links */
  document.querySelectorAll(".nav-link[data-section]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

});

/* ══════════════════════════════════════════════════════
   FIREBASE — espera inicialización
   ══════════════════════════════════════════════════════ */

if (window.db_cloud) {
  initApp();
} else {
  window.addEventListener("firebase-ready", initApp, { once: true });
  setTimeout(() => {
    if (window.db_cloud && !catalogoGlobal.length) initApp();
  }, 1000);
}
