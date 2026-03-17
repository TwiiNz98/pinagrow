/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/store.js
   Estado global, Firestore listener (colección),
   render de productos
   ══════════════════════════════════════════════ */

"use strict";

/* ── ESTADO ── */
window.catalogoGlobal = [];
window.wishlist       = [];

const PLACEHOLDER = "https://placehold.co/400x300/162016/b3e600?text=🍍";

/* ══════════════════════════════════════════════
   FIRESTORE — escucha la colección "productos"
   Cada documento = un producto
   ══════════════════════════════════════════════ */

function initStore() {
  const db = window.db_cloud;
  const fm = window.firestoreModular;
  if (!db || !fm) { console.warn("[store] Firebase no disponible"); return; }

  const { collection, onSnapshot, query, orderBy } = fm;

  const q = query(collection(db, "productos"), orderBy("nombre", "asc"));

  onSnapshot(q, (snap) => {
    window.catalogoGlobal = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
    renderProducts();
    renderFeatured();
    if (typeof renderAdminList === "function") renderAdminList();
    setFirebaseStatus("🟢 Conectado", "var(--ok)");
  }, (err) => {
    console.error("[store] Firestore error:", err);
    setFirebaseStatus("🔴 Error de conexión", "var(--err)");
    showToast("⚠️ Sin conexión a Firebase");
  });
}

/* ══════════════════════════════════════════════
   CRUD FIRESTORE
   ══════════════════════════════════════════════ */

async function addProductoFS(data) {
  const db = window.db_cloud;
  const fm = window.firestoreModular;
  if (!db || !fm) return null;
  const { collection, addDoc, serverTimestamp } = fm;
  try {
    const ref = await addDoc(collection(db, "productos"), {
      ...data,
      creadoEn: serverTimestamp()
    });
    return ref.id;
  } catch (e) {
    console.error("[store] addDoc:", e);
    return null;
  }
}

async function updateProductoFS(firestoreId, data) {
  const db = window.db_cloud;
  const fm = window.firestoreModular;
  if (!db || !fm) return false;
  const { doc, updateDoc } = fm;
  try {
    await updateDoc(doc(db, "productos", firestoreId), data);
    return true;
  } catch (e) {
    console.error("[store] updateDoc:", e);
    return false;
  }
}

async function deleteProductoFS(firestoreId) {
  const db = window.db_cloud;
  const fm = window.firestoreModular;
  if (!db || !fm) return false;
  const { doc, deleteDoc } = fm;
  try {
    await deleteDoc(doc(db, "productos", firestoreId));
    return true;
  } catch (e) {
    console.error("[store] deleteDoc:", e);
    return false;
  }
}

/* ══════════════════════════════════════════════
   RENDER PRODUCTOS
   ══════════════════════════════════════════════ */

function renderProducts(lista) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const productos = lista !== undefined ? lista : getFilteredProducts();
  const info      = document.getElementById("results-info");

  if (info) {
    info.textContent = productos.length
      ? `${productos.length} producto${productos.length !== 1 ? "s" : ""} encontrado${productos.length !== 1 ? "s" : ""}`
      : "";
  }

  if (productos.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>😕 No encontramos productos con ese filtro.</p>
        <button class="btn-primary" onclick="resetFilters()">Ver todos</button>
      </div>`;
    return;
  }

  grid.innerHTML = productos.map(p => buildProductCard(p)).join("");
  initScrollReveal();
  syncWishlistButtons();
}

function renderFeatured() {
  const grid    = document.getElementById("featured-grid");
  const section = document.getElementById("featured-section");
  if (!grid || !section) return;

  const destacados = window.catalogoGlobal.filter(p => p.destacado === true);
  if (destacados.length === 0) {
    section.style.display = "none";
    return;
  }
  section.style.display = "";
  grid.innerHTML = destacados.slice(0, 4).map(p => buildProductCard(p)).join("");
  initScrollReveal();
  syncWishlistButtons();
}

/* Construye el HTML de una card de producto */
function buildProductCard(p) {
  const id    = p.firestoreId || p.id;
  const img   = (p.imagenes && p.imagenes[0]) ? p.imagenes[0] : (p.imagen || PLACEHOLDER);
  const precio = formatPrecio(p.precio);
  const stock  = stockBadge(p);
  const wished = window.wishlist.includes(String(id));

  return `
    <div class="product-card reveal-el" role="listitem" data-id="${id}">
      <div class="product-img-wrap" onclick="openModal('${id}')">
        <img src="${img}" class="product-img" alt="${p.nombre || "Producto"}" loading="lazy"
             onerror="this.src='${PLACEHOLDER}'">
        <div class="product-img-overlay">
          <span class="quickview-label">Vista Rápida</span>
        </div>
        ${stock}
        ${p.destacado ? '<span class="stock-badge featured">⭐ Destacado</span>' : ""}
        <button class="card-wish-btn ${wished ? "wishlisted" : ""}"
                onclick="event.stopPropagation(); toggleWishlistItem('${id}')"
                title="${wished ? "Quitar de favoritos" : "Agregar a favoritos"}">
          <svg viewBox="0 0 24 24" fill="${wished ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="product-card-body">
        <span class="chip">${p.categoria || ""}</span>
        <h3 class="product-name">${p.nombre || "Sin nombre"}</h3>
        <p class="product-price">${precio}</p>
        <button class="btn-add-cart" onclick="addToCart('${id}')"
                ${(p.stock === 0) ? "disabled" : ""}>
          ${(p.stock === 0) ? "Agotado" : "🛒 Agregar"}
        </button>
      </div>
    </div>`;
}

/* Helpers */
function formatPrecio(precio) {
  if (precio === undefined || precio === null || precio === "") return "Consultar";
  const n = Number(precio);
  return isNaN(n) ? "Consultar" : `$${n.toLocaleString("es-CL")}`;
}

function stockBadge(p) {
  const s = Number(p.stock);
  if (p.stock === undefined || p.stock === null || p.stock === "") return "";
  if (s === 0)   return `<span class="stock-badge out">Agotado</span>`;
  if (s <= 5)    return `<span class="stock-badge low">Últimas ${s}</span>`;
  return "";
}

/* Sincroniza corazones con wishlist actual */
function syncWishlistButtons() {
  document.querySelectorAll(".card-wish-btn").forEach(btn => {
    const card = btn.closest(".product-card");
    if (!card) return;
    const id = card.dataset.id;
    const wished = window.wishlist.includes(String(id));
    btn.classList.toggle("wishlisted", wished);
    btn.querySelector("svg").setAttribute("fill", wished ? "currentColor" : "none");
    btn.title = wished ? "Quitar de favoritos" : "Agregar a favoritos";
  });
}

/* ══════════════════════════════════════════════
   INICIO — espera Firebase
   ══════════════════════════════════════════════ */
if (window.db_cloud) {
  initStore();
} else {
  window.addEventListener("firebase-ready", initStore, { once: true });
  setTimeout(() => {
    if (window.db_cloud && !window.catalogoGlobal.length) initStore();
  }, 1000);
}
