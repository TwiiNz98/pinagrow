/* ==========================================================
   cart.js — Donde Javier | Estado global del carrito
   ========================================================== */

const Cart = (() => {

  let items        = [];
  let drawerOpen   = false;
  let deliveryCost = 0;

  const drawerEl  = () => document.getElementById('cart-drawer');
  const overlayEl = () => document.getElementById('cart-overlay');
  const itemsEl   = () => document.getElementById('cart-items-list');
  const badgeEl   = () => document.getElementById('cart-badge');
  const footerEl  = () => document.getElementById('cart-totals');
  const floatEl   = () => document.getElementById('floating-cart');

  function init() {
    try {
      const saved = sessionStorage.getItem('dj_cart');
      if (saved) items = JSON.parse(saved);
    } catch(_) {}
    renderCart();
    updateBadge();
    updateFloating();
  }

  /* sizeName: string opcional, ej. "Porción Familiar" */
  function add(product, qty = 1, removed = [], sizeName = null) {
    items.push({
      uid:      Date.now() + Math.random(),
      id:       product.id,
      slug:     product.slug,
      name:     product.name,
      price:    product.price,
      image:    product.image,
      qty,
      removed,
      sizeName,
    });
    persist();
    renderCart();
    updateBadge(true);
    updateFloating();
  }

  function getCountFor(productId) {
    return items.filter(i => i.id === productId).reduce((s, i) => s + i.qty, 0);
  }

  function updateQty(uid, delta) {
    const idx = items.findIndex(i => i.uid === uid);
    if (idx < 0) return;
    items[idx].qty += delta;
    if (items[idx].qty <= 0) items.splice(idx, 1);
    persist(); renderCart(); updateBadge(); updateFloating();
  }

  function remove(uid) {
    items = items.filter(i => i.uid !== uid);
    persist(); renderCart(); updateBadge(); updateFloating();
  }

  function toggle() {
    drawerOpen = !drawerOpen;
    drawerEl().classList.toggle('open', drawerOpen);
    overlayEl().classList.toggle('open', drawerOpen);
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
  }

  function close() {
    drawerOpen = false;
    drawerEl().classList.remove('open');
    overlayEl().classList.remove('open');
    document.body.style.overflow = '';
  }

  function setDelivery(cost) {
    deliveryCost = cost;
    renderCart();
  }

  function getItems()      { return [...items]; }
  function getSubtotal()   { return items.reduce((s, i) => s + i.price * i.qty, 0); }
  function getTotal()      { return getSubtotal() + deliveryCost; }
  function getTotalCount() { return items.reduce((s, i) => s + i.qty, 0); }

  function renderCart() {
    const list   = itemsEl();
    const footer = footerEl();
    if (!list || !footer) return;

    if (items.length === 0) {
      list.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h4>Tu pedido está vacío</h4>
          <p>Agrega productos de la carta para armar tu pedido.</p>
        </div>`;
      footer.innerHTML = '';
    } else {
      list.innerHTML = items.map((item, idx) => {
        const sub   = item.price * item.qty;
        const mods  = item.removed.length > 0
          ? `<p class="cart-item-mods">Sin: ${item.removed.join(', ')}</p>` : '';
        const sizeTag = item.sizeName
          ? `<p class="cart-item-mods" style="color:var(--text-3)">${item.sizeName}</p>` : '';
        return `
        <div class="cart-item-row" style="animation-delay:${idx*40}ms">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            ${sizeTag}${mods}
            <p class="cart-item-price">$${sub.toLocaleString('es-CL')}</p>
          </div>
          <div class="cart-item-controls">
            <button class="ci-qty-btn" onclick="Cart._updateQty(${item.uid}, -1)" aria-label="Menos">−</button>
            <span class="ci-qty">${item.qty}</span>
            <button class="ci-qty-btn" onclick="Cart._updateQty(${item.uid}, 1)" aria-label="Más">+</button>
          </div>
        </div>`;
      }).join('');

      const sub = getSubtotal();
      const del = deliveryCost;
      const tot = getTotal();
      footer.innerHTML = `
        <div class="cart-subtotal-row">
          <span>Subtotal</span>
          <span class="amount">$${sub.toLocaleString('es-CL')}</span>
        </div>
        ${del > 0
          ? `<div class="cart-subtotal-row"><span>Delivery</span><span class="amount">$${del.toLocaleString('es-CL')}</span></div>`
          : `<div class="cart-subtotal-row"><span>Delivery</span><span class="amount" style="color:var(--text-3);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500">Se calcula al confirmar</span></div>`}
        <div class="cart-subtotal-row total">
          <span>Total</span>
          <span class="amount">$${tot.toLocaleString('es-CL')}</span>
        </div>
        <button class="go-checkout-btn" onclick="Checkout.open()">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.5 2 2 0 0 1 3.54 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Confirmar pedido · $${tot.toLocaleString('es-CL')}
        </button>`;
    }
  }

  function updateBadge(pop = false) {
    const n = getTotalCount();
    if (!badgeEl()) return;
    if (n === 0) {
      badgeEl().classList.remove('visible');
    } else {
      badgeEl().textContent = n > 99 ? '99+' : n;
      badgeEl().classList.add('visible');
      if (pop) {
        badgeEl().classList.remove('badge-pop-anim');
        void badgeEl().offsetWidth;
        badgeEl().classList.add('badge-pop-anim');
      }
    }
  }

  function updateFloating() {
    const el = floatEl();
    if (!el) return;
    const n   = getTotalCount();
    const tot = getTotal();
    if (n === 0) {
      el.classList.remove('visible');
    } else {
      el.querySelector('#fc-badge').textContent = n;
      el.querySelector('#fc-total').textContent = `$${tot.toLocaleString('es-CL')}`;
      el.classList.add('visible');
    }
  }

  function persist() {
    try { sessionStorage.setItem('dj_cart', JSON.stringify(items)); } catch(_) {}
  }

  function clear() {
    items = []; deliveryCost = 0;
    persist(); renderCart(); updateBadge(); updateFloating();
  }

  return {
    init, add, getCountFor, toggle, close,
    setDelivery, getItems, getSubtotal, getTotal, getTotalCount, clear,
    _updateQty: updateQty,
    _remove:    remove,
  };

})();
