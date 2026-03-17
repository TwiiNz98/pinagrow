/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/animations.js
   GSAP: hero, ScrollTrigger, hover en cards
   ══════════════════════════════════════════════ */

"use strict";

function initAnimations() {
  if (typeof gsap === "undefined") {
    console.warn("[animations] GSAP no cargado");
    return;
  }

  /* ── Registrar ScrollTrigger ── */
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  initHeroAnimation();
  initScrollAnimations();
  initCardHovers();
}

/* ══════════════════════════════════════════════
   HERO — aparición secuencial al cargar
   ══════════════════════════════════════════════ */

function initHeroAnimation() {
  const els = document.querySelectorAll(".gsap-hero");
  if (!els.length) return;

  gsap.set(els, { opacity: 0, y: 36 });

  gsap.to(els, {
    opacity:  1,
    y:        0,
    duration: 0.7,
    ease:     "power3.out",
    stagger:  0.13,
    delay:    0.1
  });

  /* Anillo del hero — rotación continua amplificada */
  gsap.to(".ring-1", { rotation: 360, duration: 22, repeat: -1, ease: "none" });
  gsap.to(".ring-2", { rotation: -360, duration: 16, repeat: -1, ease: "none" });
  gsap.to(".ring-3", { rotation: 360, duration: 10, repeat: -1, ease: "none" });
}

/* ══════════════════════════════════════════════
   SCROLL — reveal de secciones
   (complementa el IntersectionObserver CSS)
   ══════════════════════════════════════════════ */

function initScrollAnimations() {
  if (typeof ScrollTrigger === "undefined") return;

  /* Títulos de sección */
  gsap.utils.toArray(".section-heading").forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      opacity: 0, y: 24, duration: 0.6, ease: "power2.out"
    });
  });

  /* Category tiles */
  gsap.utils.toArray(".cat-tile").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      opacity: 0, y: 30, scale: 0.96,
      duration: 0.5, ease: "back.out(1.5)", delay: i * 0.07
    });
  });

  /* Service cards */
  gsap.utils.toArray(".service-card").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      opacity: 0, x: -20, duration: 0.5, ease: "power2.out", delay: i * 0.08
    });
  });
}

/* ══════════════════════════════════════════════
   HOVER — cards de producto (delegación)
   ══════════════════════════════════════════════ */

function initCardHovers() {
  /* Usamos delegación en el contenedor para cubrir cards dinámicas */
  const grids = [
    document.getElementById("product-grid"),
    document.getElementById("featured-grid")
  ].filter(Boolean);

  grids.forEach(grid => {
    grid.addEventListener("mouseenter", e => {
      const card = e.target.closest(".product-card");
      if (!card) return;
      gsap.to(card, { y: -6, scale: 1.02, duration: 0.25, ease: "power2.out" });
    }, true);

    grid.addEventListener("mouseleave", e => {
      const card = e.target.closest(".product-card");
      if (!card) return;
      gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
    }, true);
  });
}

/* ══════════════════════════════════════════════
   ANIMACIÓN AL AGREGAR AL CARRITO
   (llamada desde cart.js vía addToCartQty)
   ══════════════════════════════════════════════ */

function animateAddToCart(cardEl) {
  if (!cardEl || typeof gsap === "undefined") return;
  gsap.timeline()
    .to(cardEl, { scale: 0.96, duration: 0.1, ease: "power2.in" })
    .to(cardEl, { scale: 1,    duration: 0.3, ease: "elastic.out(1, 0.5)" });
}

/* ══════════════════════════════════════════════
   RE-BIND después de renderProducts
   (llamado desde store.js)
   ══════════════════════════════════════════════ */

function refreshCardHovers() {
  /* No es necesario con delegación, pero se deja por si se cambia a bind directo */
}
