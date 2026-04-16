/* ==========================================================
   app.js — Donde Javier | Bootstrap y utilidades globales
   ========================================================== */

/* ── Toast utility ── */
const Toast = (() => {
  const container = () => document.getElementById('toast-container');

  function show(msg, type = 'default') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container().appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  return { show };
})();

/* ── App init ── */
document.addEventListener('DOMContentLoaded', () => {

  /* Init modules */
  Menu.init();
  Cart.init();

  /* Keyboard: close modals on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      Menu.forceCloseModal();
      Cart.close();
      Checkout.close();
    }
  });

  /* Scroll: shrink header on scroll */
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s > 80) header.classList.add('scrolled');
    else        header.classList.remove('scrolled');
    lastScroll = s;
  }, { passive: true });

  /* Stagger card entrance on first paint */
  requestAnimationFrame(() => {
    document.querySelectorAll('.product-card').forEach((el, i) => {
      el.style.animationDelay = `${i * 55}ms`;
    });
  });

});
