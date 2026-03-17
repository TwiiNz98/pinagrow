/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/main.js
   Entry point: DOMContentLoaded, eventos globales
   ══════════════════════════════════════════════ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* ─── 1. Cargar estado persistido ─── */
  loadCartLocal();
  loadWishlistLocal();
  updateCartUI();
  updateWishlistUI();

  /* ─── 2. Sección inicial ─── */
  showSection("inicio");

  /* ─── 3. Animaciones ─── */
  initAnimations();   // GSAP hero + scroll
  initNavbarScroll(); // compact header
  initScrollReveal(); // IntersectionObserver CSS
  initCategoryPills(); // pill click handlers

  /* ─── 4. Gate +18 ─── */
  const gateYes = document.getElementById("gate-yes");
  const gateNo  = document.getElementById("gate-no");
  if (gateYes) gateYes.addEventListener("click", closeGate);
  if (gateNo)  gateNo.addEventListener("click", () => {
    window.location.replace("https://www.google.com");
  });
  document.body.style.overflow = "hidden"; // bloquear scroll mientras gate activo

  /* ─── 5. Nav links ─── */
  document.querySelectorAll(".nav-link[data-section]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  /* ─── 6. Filtros ─── */
  document.getElementById("filter-cat")?.addEventListener("change", () => {
    updateSubcats();
    applyFilters();
  });
  document.getElementById("filter-subcat")?.addEventListener("change", applyFilters);
  document.getElementById("sort-price")?.addEventListener("change", applyFilters);
  document.getElementById("sort-alpha")?.addEventListener("change", applyFilters);

  /* ─── 7. Overlays y cierre ─── */
  document.getElementById("cart-overlay")?.addEventListener("click", closeCart);
  document.getElementById("wishlist-overlay")?.addEventListener("click", closeWishlist);

  /* ─── 8. Teclado (Escape cierra todo) ─── */
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    closeModal();
    closeCart();
    closeWishlist();
    closeSearch();
    closeMobileMenu();
  });

  /* ─── 9. Click fuera del search ─── */
  document.addEventListener("click", e => {
    const bar = document.getElementById("search-bar");
    const btn = document.querySelector(".icon-btn[onclick*='toggleSearch']");
    if (bar?.classList.contains("open") && !bar.contains(e.target) && e.target !== btn) {
      closeSearch();
    }
  });

});

/* ══════════════════════════════════════════════
   ALIAS — normalizan nombres usados en HTML
   ══════════════════════════════════════════════ */

/* addToCartWithQty → alias de addToCartQty (compatibilidad HTML inline) */
function addToCartWithQty(id, qty) { addToCartQty(id, qty); }
