/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/modal.js
   Modal de producto, productos relacionados
   ══════════════════════════════════════════════ */

"use strict";

const PLACEHOLDER_MODAL = "https://placehold.co/600x450/162016/b3e600?text=🍍";

window._modalId = null; // ID del producto actualmente en modal

/* ── ABRIR MODAL ── */
function openModal(id) {
  const p = findProduct(id);
  if (!p) return;

  window._modalId = String(id);

  const modal    = document.getElementById("product-modal");
  const imgEl    = document.getElementById("modal-img");
  const nameEl   = document.getElementById("modal-name");
  const descEl   = document.getElementById("modal-desc");
  const priceEl  = document.getElementById("modal-price");
  const catEl    = document.getElementById("modal-cat");
  const thumbsEl = document.getElementById("modal-thumbs");
  const stockEl  = document.getElementById("modal-stock-badge");
  const qtyInput = document.getElementById("modal-qty");
  const addBtn   = document.getElementById("btn-modal-add");

  const imgs   = p.imagenes?.length ? p.imagenes : (p.imagen ? [p.imagen] : []);
  const mainImg = imgs[0] || PLACEHOLDER_MODAL;

  if (imgEl)   { imgEl.src = mainImg; imgEl.alt = p.nombre || "Producto"; }
  if (nameEl)  nameEl.textContent = p.nombre || "Sin nombre";
  if (descEl)  descEl.textContent = p.descripcion || "Sin descripción disponible.";
  if (priceEl) priceEl.textContent = formatPrecio(p.precio);
  if (catEl)   catEl.textContent = [p.categoria, p.subcategoria].filter(Boolean).join(" › ");
  if (qtyInput) qtyInput.value = 1;

  /* Stock badge */
  if (stockEl) {
    const s = Number(p.stock);
    if (p.stock !== undefined && p.stock !== null && p.stock !== "") {
      if (s === 0)       stockEl.innerHTML = `<span class="stock-badge out">Agotado</span>`;
      else if (s <= 5)   stockEl.innerHTML = `<span class="stock-badge low">⚠️ Últimas ${s} unidades</span>`;
      else               stockEl.innerHTML = `<span class="stock-badge ok">✅ En stock</span>`;
    } else {
      stockEl.innerHTML = "";
    }
  }

  /* Botón agregar */
  if (addBtn) {
    const agotado = p.stock === 0;
    addBtn.disabled = agotado;
    addBtn.textContent = agotado ? "Agotado" : "🛒 Agregar al carrito";
    addBtn.onclick = () => addToCartQty(id, parseInt(qtyInput?.value || 1));
  }

  /* Thumbnails */
  if (thumbsEl) {
    thumbsEl.innerHTML = imgs.map((src, i) => `
      <img src="${src}" class="modal-thumb${i === 0 ? " active" : ""}"
           alt="Imagen ${i+1}" loading="lazy"
           onclick="switchModalImg(this,'${src}')"
           onerror="this.style.display='none'">`
    ).join("");
  }

  /* Wishlist button */
  updateModalWishBtn();

  /* Relacionados */
  renderRelatedProducts(p.categoria, id);

  /* Abrir */
  if (modal) { modal.classList.add("open"); document.body.style.overflow = "hidden"; }
}

/* ── CERRAR MODAL ── */
function closeModal() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
  window._modalId = null;
}

/* Click fuera del card cierra */
function handleModalClick(e) {
  if (e.target === document.getElementById("product-modal")) closeModal();
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("product-modal")?.addEventListener("click", handleModalClick);
});

/* ── CAMBIO DE IMAGEN ── */
function switchModalImg(el, src) {
  const imgEl = document.getElementById("modal-img");
  if (imgEl) { imgEl.src = src; imgEl.style.animation = "none"; void imgEl.offsetWidth; imgEl.style.animation = ""; }
  document.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
}

/* ── CANTIDAD ── */
function changeQty(delta) {
  const input = document.getElementById("modal-qty");
  if (!input) return;
  input.value = Math.max(1, (parseInt(input.value) || 1) + delta);
}

/* ── PRODUCTOS RELACIONADOS ── */
function renderRelatedProducts(categoria, excludeId) {
  const grid    = document.getElementById("related-grid");
  const wrapper = document.getElementById("modal-related-wrap");
  if (!grid) return;

  const relacionados = window.catalogoGlobal
    .filter(p => p.categoria === categoria && String(p.firestoreId || p.id) !== String(excludeId))
    .slice(0, 3);

  if (relacionados.length === 0) {
    if (wrapper) wrapper.style.display = "none";
    return;
  }
  if (wrapper) wrapper.style.display = "";

  grid.innerHTML = relacionados.map(p => {
    const rid = p.firestoreId || p.id;
    const img = (p.imagenes && p.imagenes[0]) ? p.imagenes[0] : (p.imagen || PLACEHOLDER_MODAL);
    return `
      <div class="related-card" onclick="openModal('${rid}')" title="${p.nombre}">
        <img src="${img}" alt="${p.nombre}" loading="lazy" onerror="this.src='${PLACEHOLDER_MODAL}'">
        <div class="related-card-name">${p.nombre}</div>
      </div>`;
  }).join("");
}

/* ── HELPER ── */
function formatPrecio(precio) {
  if (precio === undefined || precio === null || precio === "") return "Consultar precio";
  const n = Number(precio);
  return isNaN(n) ? "Consultar precio" : `$${n.toLocaleString("es-CL")}`;
}
