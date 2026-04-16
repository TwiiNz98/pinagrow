/* ==========================================================
   menu.js — Donde Javier | Renderizado del menú y modal
   ========================================================== */

const Menu = (() => {

  let activeCategory   = 'todos';
  let activeProduct    = null;    // product object
  let currentQty       = 1;
  let removedIngredients = [];    // array of ingredient IDs removed by user

  /* ── DOM refs ── */
  const gridEl     = () => document.getElementById('products-grid');
  const titleEl    = () => document.getElementById('menu-title');
  const countEl    = () => document.getElementById('menu-count');
  const catListEl  = () => document.getElementById('category-list');
  const overlayEl  = () => document.getElementById('product-overlay');
  const modalEl    = () => document.getElementById('product-modal');

  /* ─────────────────────────────────────────────────────── */
  function init() {
    renderCategories();
    renderGrid();
    bindOverlayClose();
  }

  /* ── CATEGORIES ── */
  function renderCategories() {
    catListEl().innerHTML = CATEGORIES.map(cat => `
      <button
        class="cat-btn ${cat.id === activeCategory ? 'active' : ''}"
        data-cat="${cat.id}"
        onclick="Menu.filterBy('${cat.id}')">
        ${cat.label}
      </button>
    `).join('');
  }

  function filterBy(catId) {
    activeCategory = catId;
    renderCategories();
    renderGrid();
    // Scroll category button into view
    const btn = catListEl().querySelector(`[data-cat="${catId}"]`);
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  /* ── PRODUCT GRID ── */
  function renderGrid() {
    const list = activeCategory === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === activeCategory);

    const cat = CATEGORIES.find(c => c.id === activeCategory);

    titleEl().textContent = cat ? (activeCategory === 'todos' ? 'Toda la Carta' : cat.label) : 'Carta';
    countEl().textContent = `${list.length} producto${list.length !== 1 ? 's' : ''}`;

    if (list.length === 0) {
      gridEl().innerHTML = `<div style="grid-column:1/-1;padding:48px 0;text-align:center;color:var(--text-3);font-size:13px;">Sin productos en esta categoría.</div>`;
      return;
    }

    gridEl().innerHTML = list.map((p, i) => `
      <div
        class="product-card"
        style="animation-delay:${i * 55}ms"
        onclick="Menu.openModal(${p.id})"
        role="button"
        tabindex="0"
        aria-label="Ver ${p.name}">
        <div class="card-img-wrap">
          <img
            src="${p.image}"
            alt="${p.name}"
            loading="lazy"
            onerror="this.src='${p.image}'">
          ${p.tag ? `<span class="card-tag tag-${p.tag.replace(' ', '-')}">${p.tag}</span>` : ''}
          <div class="card-add-badge" aria-hidden="true">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </div>
        <div class="card-body">
          <p class="card-name">${p.name}</p>
          <p class="card-desc">${p.description}</p>
          <p class="card-price">$${p.price.toLocaleString('es-CL')}</p>
        </div>
      </div>
    `).join('');
  }

  /* ── PRODUCT MODAL ── */
  function openModal(productId) {
    activeProduct      = PRODUCTS.find(p => p.id === productId);
    currentQty         = 1;
    removedIngredients = [];
    if (!activeProduct) return;

    renderModal();
    overlayEl().classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(e) {
    // Only close if clicked on overlay itself or called directly
    if (e && e.target !== overlayEl()) return;
    overlayEl().classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalEl().innerHTML = '';
      activeProduct = null;
    }, 400);
  }

  function forceCloseModal() {
    overlayEl().classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (modalEl()) modalEl().innerHTML = ''; activeProduct = null; }, 400);
  }

  function renderModal() {
    if (!activeProduct) return;
    const p       = activeProduct;
    const inCart  = Cart.getCountFor(p.id);
    const btnLabel = inCart > 0 ? `Añadir más · ${inCart} en pedido` : 'Añadir al pedido';

    modalEl().innerHTML = `
      <div class="modal-drag"></div>

      <!-- Image -->
      <div class="modal-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="eager"
             onerror="this.src='${p.image}'">
        <div class="modal-img-gradient"></div>
        <button class="modal-close-btn" onclick="Menu.forceCloseModal()" aria-label="Cerrar">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body scrollbar-thin">
        ${p.tag ? `<p class="modal-tag">${p.tag}</p>` : ''}
        <h2 class="modal-name">${p.name}</h2>
        <p class="modal-price">$${p.price.toLocaleString('es-CL')}</p>
        <p class="modal-desc">${p.description}</p>

        ${p.ingredients.length > 0 ? `
        <div class="ingredients-section">
          <p class="ingredients-label">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Personalizar ingredientes
          </p>
          <div class="ingredients-chips" id="ing-chips">
            ${p.ingredients.map(ing => `
              <button
                class="ing-chip ${!ing.removable ? 'non-removable' : ''}"
                id="chip-${ing.id}"
                ${ing.removable ? `onclick="Menu.toggleIngredient('${ing.id}')"` : 'disabled title="Ingrediente fijo"'}
                aria-pressed="false">
                <span class="chip-dot"></span>
                ${ing.name}
                ${!ing.removable ? `<svg style="width:10px;height:10px;opacity:.4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` : ''}
              </button>
            `).join('')}
          </div>
          <p class="ing-removed-note" id="ing-note" style="display:none"></p>
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="qty-control">
          <button class="qty-btn" onclick="Menu.updateQty(-1)" aria-label="Reducir cantidad">−</button>
          <span class="qty-value" id="modal-qty">1</span>
          <button class="qty-btn" onclick="Menu.updateQty(1)" aria-label="Aumentar cantidad">+</button>
        </div>
        <button class="add-cart-btn" onclick="Menu.addToCart()" id="modal-add-btn">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span id="modal-add-label">${btnLabel}</span>
        </button>
      </div>
    `;
  }

  function toggleIngredient(ingId) {
    const ing  = activeProduct.ingredients.find(i => i.id === ingId);
    if (!ing || !ing.removable) return;

    const chip = document.getElementById(`chip-${ingId}`);
    if (!chip) return;

    if (removedIngredients.includes(ingId)) {
      removedIngredients = removedIngredients.filter(i => i !== ingId);
      chip.classList.remove('removed');
      chip.setAttribute('aria-pressed', 'false');
    } else {
      removedIngredients.push(ingId);
      chip.classList.add('removed');
      chip.setAttribute('aria-pressed', 'true');
    }

    const note = document.getElementById('ing-note');
    if (removedIngredients.length > 0) {
      const names = removedIngredients.map(id => activeProduct.ingredients.find(i => i.id === id)?.name).filter(Boolean);
      note.textContent = `Se omitirá: ${names.join(', ')}`;
      note.style.display = 'block';
    } else {
      note.style.display = 'none';
    }
  }

  function updateQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    const el = document.getElementById('modal-qty');
    if (el) el.textContent = currentQty;
  }

  function addToCart() {
    if (!activeProduct) return;
    const removed = removedIngredients.map(id => activeProduct.ingredients.find(i => i.id === id)?.name).filter(Boolean);
    Cart.add(activeProduct, currentQty, removed);
    forceCloseModal();
    Toast.show(`${currentQty}× ${activeProduct.name} añadido`, 'success');
    // Update button label next open
    activeProduct = null;
  }

  function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  }

  function bindOverlayClose() {
    overlayEl().addEventListener('click', function(e) {
      if (e.target === this) forceCloseModal();
    });
  }

  return {
    init, filterBy, openModal, closeModal, forceCloseModal,
    toggleIngredient, updateQty, addToCart, scrollToMenu,
  };

})();
