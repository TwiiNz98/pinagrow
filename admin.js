/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/admin.js
   Panel Admin: CRUD con Firestore por documentos
   + migración de formato v1
   ══════════════════════════════════════════════ */

"use strict";

const ADMIN_PASSWORD = "Pineapple420";

let _adminEditingId = null; // firestoreId del doc en edición (null = nuevo)
let _adminImages    = [];   // base64 de imágenes pendientes

/* ══════════════════════════════════════════════
   APERTURA / CIERRE
   ══════════════════════════════════════════════ */

function toggleAdmin() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;
  panel.classList.contains("open") ? closeAdmin() : openAdmin();
}

function openAdmin() {
  const pass = prompt("🔐 Contraseña de administrador:");
  if (pass === null) return;
  if (pass !== ADMIN_PASSWORD) { showToast("❌ Contraseña incorrecta"); return; }
  document.getElementById("admin-panel")?.classList.add("open");
  renderAdminList();
}

function closeAdmin() {
  document.getElementById("admin-panel")?.classList.remove("open");
}

/* ══════════════════════════════════════════════
   RENDER LISTA
   ══════════════════════════════════════════════ */

function renderAdminList() {
  const list     = document.getElementById("admin-list");
  const countEl  = document.getElementById("admin-count");
  if (!list) return;

  const productos = window.catalogoGlobal;
  if (countEl) countEl.textContent = productos.length;

  if (productos.length === 0) {
    list.innerHTML = `<p style="color:var(--txt-3);font-size:.85rem;padding:.75rem 0">No hay productos aún.</p>`;
    return;
  }

  list.innerHTML = productos.map(p => {
    const fid   = p.firestoreId || p.id;
    const img   = (p.imagenes && p.imagenes[0]) ? p.imagenes[0] : (p.imagen || "https://placehold.co/46x46/162016/b3e600?text=🍍");
    const precio = p.precio ? `$${Number(p.precio).toLocaleString("es-CL")}` : "Sin precio";
    const star   = p.destacado ? "⭐ " : "";
    return `
      <div class="admin-product-item">
        <img src="${img}" width="46" height="46" alt="${p.nombre}" onerror="this.src='https://placehold.co/46x46/162016/b3e600?text=🍍'">
        <div class="admin-product-info">
          <strong>${star}${p.nombre || "Sin nombre"}</strong>
          <span>${[p.categoria, p.subcategoria].filter(Boolean).join(" › ")} — ${precio} — Stock: ${p.stock ?? "N/A"}</span>
        </div>
        <div class="admin-product-btns">
          <button class="btn-admin-edit" onclick="editProduct('${fid}')" title="Editar">✏️</button>
          <button class="btn-admin-del"  onclick="deleteProduct('${fid}', '${(p.nombre||"").replace(/'/g,"\\'")}')" title="Eliminar">🗑️</button>
        </div>
      </div>`;
  }).join("");
}

/* ══════════════════════════════════════════════
   GUARDAR (add o update)
   ══════════════════════════════════════════════ */

async function saveProduct() {
  const nombre       = gf("admin-nombre").trim();
  const precio       = gf("admin-precio");
  const categoria    = gf("admin-categoria").trim();
  const subcategoria = gf("admin-subcategoria").trim();
  const descripcion  = gf("admin-descripcion").trim();
  const stock        = gf("admin-stock");
  const destacado    = document.getElementById("admin-destacado")?.checked || false;

  if (!nombre)    { showToast("⚠️ El nombre es obligatorio"); return; }
  if (!categoria) { showToast("⚠️ La categoría es obligatoria"); return; }

  const data = {
    nombre,
    precio:      precio !== "" ? parseFloat(precio) : null,
    categoria,
    subcategoria: subcategoria || "",
    descripcion,
    stock:       stock !== "" ? parseInt(stock) : null,
    destacado,
    imagenes:    _adminImages
  };

  const btn = document.getElementById("admin-save-btn");
  if (btn) btn.disabled = true;

  let ok = false;
  if (_adminEditingId) {
    /* UPDATE */
    ok = await updateProductoFS(_adminEditingId, data);
    if (ok) showToast("✅ Producto actualizado");
    else    showToast("❌ Error al actualizar");
  } else {
    /* ADD */
    const newId = await addProductoFS(data);
    ok = !!newId;
    if (ok) showToast("✅ Producto agregado");
    else    showToast("❌ Error al agregar");
  }

  if (btn) btn.disabled = false;
  if (ok) resetAdminForm();
}

/* ══════════════════════════════════════════════
   EDITAR
   ══════════════════════════════════════════════ */

function editProduct(firestoreId) {
  const p = window.catalogoGlobal.find(x => (x.firestoreId || x.id) === firestoreId);
  if (!p) return;

  _adminEditingId = firestoreId;
  _adminImages    = p.imagenes || (p.imagen ? [p.imagen] : []);

  sf("admin-nombre",       p.nombre       || "");
  sf("admin-precio",       p.precio       ?? "");
  sf("admin-categoria",    p.categoria    || "");
  sf("admin-descripcion",  p.descripcion  || "");
  sf("admin-stock",        p.stock        ?? "");

  updateAdminSubcats();
  sf("admin-subcategoria", p.subcategoria || "");

  const check = document.getElementById("admin-destacado");
  if (check) check.checked = !!p.destacado;

  const titleEl = document.getElementById("admin-form-title");
  if (titleEl) titleEl.textContent = "✏️ Editando: " + (p.nombre || "Producto");

  const btn = document.getElementById("admin-save-btn");
  if (btn) btn.textContent = "💾 Guardar cambios";

  /* Scroll al formulario */
  document.getElementById("admin-save-btn")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ══════════════════════════════════════════════
   ELIMINAR
   ══════════════════════════════════════════════ */

async function deleteProduct(firestoreId, nombre) {
  if (!confirm(`¿Eliminar "${nombre}"? Esta acción es irreversible.`)) return;

  const ok = await deleteProductoFS(firestoreId);
  if (ok) showToast(`🗑️ "${nombre}" eliminado`);
  else    showToast("❌ Error al eliminar");
}

/* ══════════════════════════════════════════════
   RESET FORMULARIO
   ══════════════════════════════════════════════ */

function resetAdminForm() {
  _adminEditingId = null;
  _adminImages    = [];

  ["admin-nombre","admin-precio","admin-categoria",
   "admin-subcategoria","admin-descripcion","admin-stock"].forEach(id => sf(id, ""));

  const check = document.getElementById("admin-destacado");
  if (check) check.checked = false;

  const fileInput = document.getElementById("admin-files");
  if (fileInput) fileInput.value = "";

  const titleEl = document.getElementById("admin-form-title");
  if (titleEl) titleEl.textContent = "➕ Nuevo producto";

  const btn = document.getElementById("admin-save-btn");
  if (btn) { btn.textContent = "➕ Agregar"; btn.disabled = false; }
}

/* ══════════════════════════════════════════════
   IMÁGENES
   ══════════════════════════════════════════════ */

function handleAdminFilesChange(event) {
  const files = Array.from(event.target.files || []);
  _adminImages = [];

  let loaded = 0;
  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      _adminImages.push(e.target.result);
      loaded++;
    };
    reader.readAsDataURL(file);
  });
}

/* ══════════════════════════════════════════════
   MIGRACIÓN desde formato v1
   (tienda/catalogo → colección productos)
   ══════════════════════════════════════════════ */

async function migrateOldData() {
  const db = window.db_cloud;
  const fm = window.firestoreModular;
  if (!db || !fm) { showToast("❌ Firebase no disponible"); return; }

  if (!confirm("¿Migrar datos del formato v1 (tienda/catalogo)?\nEsto creará un documento en la colección 'productos' por cada producto del catálogo antiguo.\nLos datos existentes no serán eliminados.")) return;

  const { doc, getDoc, collection, addDoc } = fm;
  const ref = doc(db, "tienda", "catalogo");

  let snap;
  try {
    snap = await getDoc(ref);
  } catch (e) {
    showToast("❌ No se pudo leer el formato v1"); return;
  }

  if (!snap.exists()) { showToast("ℹ️ No hay datos v1 para migrar"); return; }

  const productos = snap.data().productos || [];
  if (productos.length === 0) { showToast("ℹ️ El catálogo v1 está vacío"); return; }

  showToast(`⏳ Migrando ${productos.length} productos…`);
  let count = 0;

  for (const p of productos) {
    try {
      await addDoc(collection(db, "productos"), {
        nombre:       p.nombre       || "",
        precio:       p.precio       || null,
        categoria:    p.categoria    || "",
        subcategoria: p.subcategoria || "",
        descripcion:  p.descripcion  || "",
        stock:        p.stock        ?? null,
        imagenes:     p.imagenes     || (p.imagen ? [p.imagen] : []),
        destacado:    p.destacado    || false
      });
      count++;
    } catch (_) {}
  }

  showToast(`✅ ${count} de ${productos.length} productos migrados`);
}

/* ── Helpers ── */
function gf(id)      { return document.getElementById(id)?.value || ""; }
function sf(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
