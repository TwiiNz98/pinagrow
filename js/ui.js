/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/ui.js
   Navegación, sidebars, toast, gate, scroll reveal
   ══════════════════════════════════════════════ */

"use strict";

/* ══════════════════════════════════════════════
   SECCIONES
   ══════════════════════════════════════════════ */

function showSection(id) {
  document.querySelectorAll(".page-section").forEach(sec => {
    sec.classList.toggle("active", sec.id === id);
  });
  document.querySelectorAll(".nav-link[data-section]").forEach(link => {
    link.classList.toggle("active", link.dataset.section === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeMobileMenu();
  closeSearch();

  /* Iniciar reveal para la sección recién activada */
  setTimeout(initScrollReveal, 60);
}

/* ══════════════════════════════════════════════
   SIDEBARS — CARRITO
   ══════════════════════════════════════════════ */

function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  const overlay = document.getElementById("cart-overlay");
  if (!sidebar) return;
  const open = sidebar.classList.toggle("open");
  overlay?.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function closeCart() {
  document.getElementById("cart-sidebar")?.classList.remove("open");
  document.getElementById("cart-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════════════
   SIDEBARS — WISHLIST
   ══════════════════════════════════════════════ */

function toggleWishlist() {
  const sidebar = document.getElementById("wishlist-sidebar");
  const overlay = document.getElementById("wishlist-overlay");
  if (!sidebar) return;
  const open = sidebar.classList.toggle("open");
  overlay?.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
  if (open) updateWishlistUI();
}

function closeWishlist() {
  document.getElementById("wishlist-sidebar")?.classList.remove("open");
  document.getElementById("wishlist-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════════════
   BÚSQUEDA
   ══════════════════════════════════════════════ */

function toggleSearch() {
  const bar = document.getElementById("search-bar");
  if (!bar) return;
  const open = bar.classList.toggle("open");
  if (open) {
    document.getElementById("global-search")?.focus();
  } else {
    const input = document.getElementById("global-search");
    if (input) input.value = "";
  }
}

function closeSearch() {
  document.getElementById("search-bar")?.classList.remove("open");
}

/* ══════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════ */

function toggleMobileMenu() {
  const nav = document.getElementById("main-nav");
  const btn = document.getElementById("hamburger");
  if (!nav) return;
  const open = nav.classList.toggle("open");
  btn?.classList.toggle("open", open);
  btn?.setAttribute("aria-expanded", String(open));
}

function closeMobileMenu() {
  const nav = document.getElementById("main-nav");
  const btn = document.getElementById("hamburger");
  nav?.classList.remove("open");
  btn?.classList.remove("open");
  btn?.setAttribute("aria-expanded", "false");
}

/* ══════════════════════════════════════════════
   NAVBAR SCROLL
   ══════════════════════════════════════════════ */

function initNavbarScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════ */

let revealObserver = null;

function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal-el:not(.visible)");
  if (!targets.length) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  }

  targets.forEach(el => revealObserver.observe(el));
}

/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */

function showToast(msg, duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ══════════════════════════════════════════════
   FIREBASE STATUS
   ══════════════════════════════════════════════ */

function setFirebaseStatus(msg, color) {
  const el = document.getElementById("firebase-status");
  if (!el) return;
  el.textContent = msg;
  el.style.color = color || "inherit";
}

/* ══════════════════════════════════════════════
   BADGE ANIMATION
   ══════════════════════════════════════════════ */

function animateBadge(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
  setTimeout(() => el.classList.remove("pop"), 500);
}

/* ══════════════════════════════════════════════
   GATE +18
   ══════════════════════════════════════════════ */

function closeGate() {
  const gate = document.getElementById("gate");
  if (!gate) return;
  gate.style.opacity = "0";
  gate.style.pointerEvents = "none";
  setTimeout(() => gate.remove(), 400);
  document.body.style.overflow = "";
}
