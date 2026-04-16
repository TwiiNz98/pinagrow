/* ==========================================================
   menu.js — Donde Javier | Menú y modal de producto
   ========================================================== */

const Menu = (() => {

  let activeCategory     = 'todos';
  let activeProduct      = null;
  let currentQty         = 1;
  let removedIngredients = [];
  let selectedSizeId     = null;   // para productos con hasSizes

  const gridEl    = () => document.getElementById('products-grid');
  const titleEl   = () => document.getElementById('menu-title');
  const countEl   = () => document.getElementById('menu-count');
  const catListEl = () => document.getElementById('category-list');
  const overlayEl = () => document.getElementById('product-overlay');
  const modalEl   = () => document.getElementById('product-modal');

  /* ── init ── */
  function init() {
    renderCategories();
    renderGrid();
    bindOverlayClose();
  }

  /* ── categorías ── */
  function renderCategories() {
    catListEl().innerHTML = CATEGORIES.map(cat => `
      <button class="cat-btn ${cat.id === activeCategory ? 'active' : ''}"
        data-cat="${cat.id}" onclick="Menu.filterBy('${cat.id}')">
        ${cat.label}
      </button>`).join('');
  }

  function filterBy(catId) {
    activeCategory = catId;
    renderCategories();
    renderGrid();
    const btn = catListEl().querySelector(`[data-cat="${catId}"]`);
    if (btn) btn.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });
  }

  /* ── grid ── */
  function renderGrid() {
    const list = activeCategory === 'todos'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === activeCategory);

    const cat = CATEGORIES.find(c => c.id === activeCategory);
    titleEl().textContent = activeCategory === 'todos' ? 'Toda la carta' : (cat?.label || '');
    countEl().textContent = `${list.length} producto${list.length !== 1 ? 's' : ''}`;

    if (list.length === 0) {
      gridEl().innerHTML = `<div style="grid-column:1/-1;padding:48px 0;text-align:center;color:var(--text-3);font-size:13px;">Sin productos en esta categoría.</div>`;
      return;
    }

    gridEl().innerHTML = list.map((p, i) => {
      const priceLabel = p.hasSizes
        ? `<span class="card-price-desde">Desde</span><span class="card-price">$${p.sizes[0].price.toLocaleString('es-CL')}</span>`
        : `<span class="card-price">$${p.price.toLocaleString('es-CL')}</span>`;

      const tagClass = p.tag ? `tag-${p.tag.replace(/\s+/g,'-')}` : '';

      return `
      <div class="product-card" style="animation-delay:${i*55}ms"
        onclick="Menu.openModal(${p.id})" role="button" tabindex="0"
        aria-label="Ver ${p.name}">
        <div class="card-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${p.tag ? `<span class="card-tag ${tagClass}">${p.tag}</span>` : ''}
          <div class="card-add-badge" aria-hidden="true">
            <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </div>
        <div class="card-body">
          <p class="card-name">${p.name}</p>
          <p class="card-desc">${p.description}</p>
          <div>${priceLabel}</div>
        </div>
      </div>`;
    }).join('');
  }

  /* ── modal ── */
  function openModal(productId) {
    activeProduct      = PRODUCTS.find(p => p.id === productId);
    currentQty         = 1;
    removedIngredients = [];
    selectedSizeId     = activeProduct?.hasSizes ? activeProduct.sizes[0].id : null;
    if (!activeProduct) return;
    renderModal();
    overlayEl().classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function forceCloseModal() {
    overlayEl().classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (modalEl()) modalEl().innerHTML = ''; activeProduct = null; }, 420);
  }

  function bindOverlayClose() {
    overlayEl().addEventListener('click', function(e) {
      if (e.target === this) forceCloseModal();
    });
  }

  /* ── renderModal ── */
  function renderModal() {
    if (!activeProduct) return;
    const p = activeProduct;
    const inCart = Cart.getCountFor(p.id);
    const btnLabel = inCart > 0 ? `Añadir más · ${inCart} ya en el pedido` : 'Añadir al pedido';

    /* precio display */
    const priceHtml = p.hasSizes
      ? `<p class="modal-price"><span class="modal-price-since">Desde</span>$${p.sizes[0].price.toLocaleString('es-CL')}</p>`
      : `<p class="modal-price">$${p.price.toLocaleString('es-CL')}</p>`;

    /* selector de tamaño */
    const sizesHtml = p.hasSizes ? `
      <div class="size-section">
        <p class="size-label">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
          </svg>
          Elige el tamaño
        </p>
        <div class="size-options" id="size-options">
          ${p.sizes.map(s => `
          <div class="size-option ${s.id === selectedSizeId ? 'selected' : ''}"
               onclick="Menu.selectSize('${s.id}')" id="sopt-${s.id}">
            <div class="size-option-left">
              <div class="size-radio"><div class="size-radio-dot"></div></div>
              <div>
                <p class="size-option-name">${s.label}</p>
                <p class="size-option-sub">${s.sublabel}</p>
              </div>
            </div>
            <span class="size-option-price">$${s.price.toLocaleString('es-CL')}</span>
          </div>`).join('')}
        </div>
      </div>` : '';

    /* ingredientes */
    const ingsHtml = p.ingredients.length > 0 ? `
      <div class="ingredients-section">
        <p class="ingredients-label">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Personaliza los ingredientes
        </p>
        <div class="ingredients-chips" id="ing-chips">
          ${p.ingredients.map(ing => `
          <button class="ing-chip ${!ing.removable ? 'non-removable' : ''}"
            id="chip-${ing.id}"
            ${ing.removable ? `onclick="Menu.toggleIngredient('${ing.id}')"` : 'disabled title="Ingrediente base, no se puede quitar"'}
            aria-pressed="false">
            <span class="chip-dot"></span>${ing.name}
            ${!ing.removable ? `<svg style="width:10px;height:10px;opacity:.35" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` : ''}
          </button>`).join('')}
        </div>
        <p class="ing-removed-note" id="ing-note" style="display:none"></p>
      </div>` : '';

    modalEl().innerHTML = `
      <div class="modal-drag"></div>
      <div class="modal-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="eager">
        <div class="modal-img-gradient"></div>
        <button class="modal-close-btn" onclick="Menu.forceCloseModal()" aria-label="Cerrar">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body scrollbar-thin">
        ${p.tag ? `<p class="modal-tag">${p.tag}</p>` : ''}
        <h2 class="modal-name">${p.name}</h2>
        ${priceHtml}
        <p class="modal-desc">${p.description}</p>
        ${sizesHtml}
        ${ingsHtml}
      </div>
      <div class="modal-footer">
        <div class="qty-control">
          <button class="qty-btn" onclick="Menu.updateQty(-1)" aria-label="Reducir cantidad">−</button>
          <span class="qty-value" id="modal-qty">1</span>
          <button class="qty-btn" onclick="Menu.updateQty(1)" aria-label="Aumentar cantidad">+</button>
        </div>
        <button class="add-cart-btn" id="modal-add-btn" onclick="Menu.addToCart()">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span id="modal-add-label">${btnLabel}</span>
        </button>
      </div>`;
  }

  /* ── selectSize ── */
  function selectSize(sizeId) {
    selectedSizeId = sizeId;
    activeProduct.sizes.forEach(s => {
      const opt = document.getElementById(`sopt-${s.id}`);
      if (opt) opt.classList.toggle('selected', s.id === sizeId);
    });
    /* actualizar precio en cabecera */
    const sel = activeProduct.sizes.find(s => s.id === sizeId);
    const priceEl = modalEl()?.querySelector('.modal-price');
    if (priceEl && sel) {
      priceEl.innerHTML = `<span class="modal-price-since">Desde</span>$${sel.price.toLocaleString('es-CL')}`;
    }
  }

  /* ── toggleIngredient ── */
  function toggleIngredient(ingId) {
    const ing = activeProduct?.ingredients.find(i => i.id === ingId);
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
      const names = removedIngredients
        .map(id => activeProduct.ingredients.find(i => i.id === id)?.name)
        .filter(Boolean);
      note.textContent = `Se omitirá: ${names.join(', ')}`;
      note.style.display = 'block';
    } else {
      note.style.display = 'none';
    }
  }

  /* ── qty ── */
  function updateQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    const el = document.getElementById('modal-qty');
    if (el) el.textContent = currentQty;
  }

  /* ── addToCart ── */
  function addToCart() {
    if (!activeProduct) return;

    /* Si tiene tamaños y no hay selección válida, no hace nada (el default siempre existe) */
    let finalPrice = activeProduct.price;
    let sizeName   = null;
    if (activeProduct.hasSizes && selectedSizeId) {
      const sel = activeProduct.sizes.find(s => s.id === selectedSizeId);
      if (sel) { finalPrice = sel.price; sizeName = sel.label; }
    }

    const removed = removedIngredients
      .map(id => activeProduct.ingredients.find(i => i.id === id)?.name)
      .filter(Boolean);

    Cart.add(
      { ...activeProduct, price: finalPrice },
      currentQty,
      removed,
      sizeName
    );

    forceCloseModal();
    const sizeStr = sizeName ? ` (${sizeName})` : '';
    Toast.show(`${currentQty}× ${activeProduct.name}${sizeStr} añadido`, 'success');
  }

  function scrollToMenu() {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  }

  return {
    init, filterBy, openModal, forceCloseModal,
    selectSize, toggleIngredient, updateQty, addToCart, scrollToMenu,
  };

})();
