/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/filters.js
   Pills de categoría, filtros, búsqueda, sort
   ══════════════════════════════════════════════ */

"use strict";

const CATEGORIAS = {
  "Smoke":      ["Pipas","Bongs","Papelillos","Enroladores","Limpieza"],
  "Cultivo":    ["Sustratos","Fertilizantes","Carpas","Iluminación","Control de Plagas"],
  "Tabaquería": ["Cigarrillos","Tabaco","Pipas de tabaco","Accesorios"],
  "Aromas":     ["Inciensos","Aceites esenciales","Difusores","Velas"]
};

let searchTimer = null;

/* ── FILTRO ACTIVO DESDE PILLS ── */
function initCategoryPills() {
  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      const cat = pill.dataset.cat || "";
      const sel = document.getElementById("filter-cat");
      if (sel) { sel.value = cat; updateSubcats(); }
      applyFilters();
    });
  });
}

/* Sincroniza pills con el select (para filterQuick) */
function syncPills(cat) {
  document.querySelectorAll(".pill").forEach(p => {
    p.classList.toggle("active", (p.dataset.cat || "") === cat);
  });
}

/* ── FILTRO RÁPIDO desde botones de inicio ── */
function filterQuick(cat) {
  const sel = document.getElementById("filter-cat");
  if (sel) { sel.value = cat; updateSubcats(); }
  syncPills(cat);
  applyFilters();
  showSection("productos");
}

/* ── SUBCATEGORÍAS ── */
function updateSubcats() {
  const cat    = document.getElementById("filter-cat")?.value || "";
  const select = document.getElementById("filter-subcat");
  if (!select) return;

  select.innerHTML = `<option value="">Todas las subcategorías</option>`;
  const subs = CATEGORIAS[cat] || [];
  subs.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s; opt.textContent = s;
    select.appendChild(opt);
  });
  select.disabled = !cat;
}

function updateAdminSubcats() {
  const cat    = document.getElementById("admin-categoria")?.value || "";
  const select = document.getElementById("admin-subcategoria");
  if (!select) return;

  select.innerHTML = `<option value="">Seleccionar…</option>`;
  const subs = CATEGORIAS[cat] || [];
  subs.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s; opt.textContent = s;
    select.appendChild(opt);
  });
}

/* ── APLICAR FILTROS ── */
function applyFilters() {
  renderProducts(); // renderProducts usa getFilteredProducts() internamente
}

function getFilteredProducts() {
  const cat    = document.getElementById("filter-cat")?.value    || "";
  const subcat = document.getElementById("filter-subcat")?.value || "";
  const sortP  = document.getElementById("sort-price")?.value    || "";
  const sortA  = document.getElementById("sort-alpha")?.value    || "";
  const query  = (document.getElementById("global-search")?.value || "").toLowerCase().trim();

  let lista = [...window.catalogoGlobal];

  if (cat)    lista = lista.filter(p => p.categoria === cat);
  if (subcat) lista = lista.filter(p => p.subcategoria === subcat);
  if (query)  lista = lista.filter(p =>
    (p.nombre       || "").toLowerCase().includes(query) ||
    (p.descripcion  || "").toLowerCase().includes(query) ||
    (p.categoria    || "").toLowerCase().includes(query) ||
    (p.subcategoria || "").toLowerCase().includes(query)
  );

  if (sortP === "asc")  lista.sort((a, b) => (Number(a.precio)||0) - (Number(b.precio)||0));
  if (sortP === "desc") lista.sort((a, b) => (Number(b.precio)||0) - (Number(a.precio)||0));
  if (sortA === "az")   lista.sort((a, b) => (a.nombre||"").localeCompare(b.nombre||"", "es"));
  if (sortA === "za")   lista.sort((a, b) => (b.nombre||"").localeCompare(a.nombre||"", "es"));

  return lista;
}

/* ── BÚSQUEDA LIVE (debounce) ── */
function liveSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(applyFilters, 220);
}

/* ── RESET ── */
function resetFilters() {
  ["filter-cat","filter-subcat","sort-price","sort-alpha","global-search"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const subcat = document.getElementById("filter-subcat");
  if (subcat) subcat.disabled = true;
  syncPills("");
  renderProducts(window.catalogoGlobal);
}
