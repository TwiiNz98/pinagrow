/* ==========================================================
   checkout.js — Donde Javier | Checkout, validación y WA
   ========================================================== */

const Checkout = (() => {

  const WA_NUMBER = '56944222079';

  /* ── DOM refs ── */
  const overlayEl = () => document.getElementById('checkout-overlay');
  const sheetEl   = () => document.getElementById('checkout-sheet');

  /* ─────────────────────────────────────────────────────── */
  function open() {
    if (Cart.getTotalCount() === 0) {
      Toast.show('Primero agrega productos a tu pedido po', 'error');
      return;
    }
    Cart.close(); // close drawer first
    renderSheet();
    setTimeout(() => {
      overlayEl().classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 80);
  }

  function close() {
    overlayEl().classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── RENDER CHECKOUT SHEET ── */
  function renderSheet() {
    sheetEl().innerHTML = `
      <div class="checkout-header">
        <div>
          <div class="drag"></div>
          <h2 class="checkout-title">Confirmemos tu pedido</h2>
        </div>
        <button class="checkout-close" onclick="Checkout.close()" aria-label="Cerrar">
          <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="checkout-body scrollbar-thin">

        <!-- Sección: Tu pedido -->
        <div class="form-section">
          <p class="form-section-title">Lo que pediste</p>
          <div class="order-summary-box" id="order-summary"></div>
        </div>

        <!-- Sección: Zona de entrega -->
        <div class="form-section">
          <p class="form-section-title">Zona de entrega</p>
          <div class="form-group">
            <label class="form-label" for="zone-select">¿A qué sector te mandamos?</label>
            <select class="form-input" id="zone-select" onchange="Checkout._onZoneChange()">
              <option value="">— Seleccionar zona —</option>
              ${ZONES.map(z => `<option value="${z.id}">${z.name}</option>`).join('')}
            </select>
            <p class="form-error" id="zone-error">Por favor selecciona tu zona de entrega.</p>
          </div>
          <div class="zone-info-box" id="zone-info">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div class="zone-info-content">
              <p id="zone-info-text"></p>
            </div>
          </div>
        </div>

        <!-- Sección: Datos del cliente -->
        <div class="form-section">
          <p class="form-section-title">Tus datos</p>
          <div class="form-input-row">
            <div class="form-group">
              <label class="form-label" for="client-name">Nombre</label>
              <input type="text" class="form-input" id="client-name"
                     placeholder="Tu nombre" autocomplete="given-name"
                     oninput="Checkout._clearError('name-error', 'client-name')">
              <p class="form-error" id="name-error">Ingresa tu nombre.</p>
            </div>
            <div class="form-group">
              <label class="form-label" for="client-phone">Teléfono</label>
              <input type="tel" class="form-input" id="client-phone"
                     placeholder="+56 9 ..."  autocomplete="tel"
                     oninput="Checkout._clearError('phone-error', 'client-phone')">
              <p class="form-error" id="phone-error">Ingresa un teléfono válido.</p>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="client-address">Dirección exacta</label>
            <input type="text" class="form-input" id="client-address"
                   placeholder="Calle, número, referencia"
                   autocomplete="street-address"
                   oninput="Checkout._clearError('address-error', 'client-address')">
            <p class="form-error" id="address-error">Ingresa tu dirección completa.</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="client-notes">Algo más que decirnos <span style="color:var(--text-3)">(opcional)</span></label>
            <input type="text" class="form-input" id="client-notes"
                   placeholder="Timbre, referencia, piso...">
          </div>
        </div>

        <!-- Totales -->
        <div class="form-section">
          <p class="form-section-title">Lo que vas a pagar</p>
          <div id="checkout-totals"></div>
          <button class="send-order-btn" id="send-order-btn" onclick="Checkout._submit()">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Enviar pedido por WhatsApp
          </button>
          <p class="checkout-footer-note">
            Te vamos a llevar directo al WhatsApp de Javier para confirmar.<br>
            El pago es contra entrega: efectivo o transferencia.
          </p>
        </div>

      </div>
    `;

    renderSummary();
    renderTotals();
  }

  /* ── Order summary ── */
  function renderSummary() {
    const el    = document.getElementById('order-summary');
    if (!el) return;
    const items = Cart.getItems();
    el.innerHTML = items.map(item => {
      const sub  = item.price * item.qty;
      const mods = item.removed.length > 0
        ? `<span class="osi-mods">Sin: ${item.removed.join(', ')}</span>` : '';
      return `
        <div class="order-summary-item">
          <span class="osi-name">${item.qty}× ${item.name}${mods}</span>
          <span class="osi-price">$${sub.toLocaleString('es-CL')}</span>
        </div>`;
    }).join('');
  }

  /* ── Totals ── */
  function renderTotals(deliveryCost = 0) {
    const el  = document.getElementById('checkout-totals');
    if (!el) return;
    const sub = Cart.getSubtotal();
    const tot = sub + deliveryCost;
    el.innerHTML = `
      <div class="checkout-total-row">
        <span>Subtotal productos</span>
        <span class="cta">$${sub.toLocaleString('es-CL')}</span>
      </div>
      <div class="checkout-total-row">
        <span>Delivery</span>
        <span class="cta">${deliveryCost > 0 ? `$${deliveryCost.toLocaleString('es-CL')}` : '<span style="color:var(--text-3)">Gratis</span>'}</span>
      </div>
      <div class="checkout-total-row grand-total">
        <span>Total a pagar</span>
        <span class="cta">$${tot.toLocaleString('es-CL')}</span>
      </div>`;
  }

  /* ── Zone change ── */
  function onZoneChange() {
    const select = document.getElementById('zone-select');
    const zoneId = select?.value;
    const zone   = ZONES.find(z => z.id === zoneId);
    const infoEl = document.getElementById('zone-info');
    const textEl = document.getElementById('zone-info-text');

    if (zone) {
      const deliveryCost = getDeliveryCost(zone);
      Cart.setDelivery(deliveryCost);
      renderTotals(deliveryCost);

      infoEl.classList.add('show');
      const freeMsg = zone.minFree
        ? ` · Gratis sobre $${zone.minFree.toLocaleString('es-CL')}`
        : '';
      const costMsg  = deliveryCost === 0 ? '🎉 Delivery <strong>gratis</strong> en tu pedido' : `Delivery: <strong>$${deliveryCost.toLocaleString('es-CL')}</strong>${freeMsg}`;
      textEl.innerHTML = `${costMsg} · ⏱ ${zone.eta}`;

      // clear zone error
      clearError('zone-error', 'zone-select');
    } else {
      infoEl.classList.remove('show');
      renderTotals(0);
      Cart.setDelivery(0);
    }
  }

  function getDeliveryCost(zone) {
    if (!zone) return 0;
    const subtotal = Cart.getSubtotal();
    if (zone.minFree && subtotal >= zone.minFree) return 0;
    return zone.cost;
  }

  /* ── VALIDATION ── */
  function validate() {
    let ok = true;

    const name    = document.getElementById('client-name')?.value.trim();
    const phone   = document.getElementById('client-phone')?.value.trim();
    const address = document.getElementById('client-address')?.value.trim();
    const zoneId  = document.getElementById('zone-select')?.value;

    if (!name || name.length < 2) {
      showError('name-error', 'client-name'); ok = false;
    }
    if (!phone || phone.length < 8) {
      showError('phone-error', 'client-phone'); ok = false;
    }
    if (!address || address.length < 5) {
      showError('address-error', 'client-address'); ok = false;
    }
    if (!zoneId) {
      showError('zone-error', 'zone-select'); ok = false;
    }

    return ok;
  }

  function showError(errId, fieldId) {
    const err   = document.getElementById(errId);
    const field = document.getElementById(fieldId);
    if (err)   err.classList.add('show');
    if (field) field.classList.add('error');
  }

  function clearError(errId, fieldId) {
    const err   = document.getElementById(errId);
    const field = document.getElementById(fieldId);
    if (err)   err.classList.remove('show');
    if (field) field.classList.remove('error');
  }

  /* ── SUBMIT ── */
  function submit() {
    if (!validate()) {
      Toast.show('Completa todos los campos requeridos', 'error');
      return;
    }

    const name    = document.getElementById('client-name').value.trim();
    const phone   = document.getElementById('client-phone').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const notes   = document.getElementById('client-notes')?.value.trim() || '';
    const zoneId  = document.getElementById('zone-select').value;
    const zone    = ZONES.find(z => z.id === zoneId);
    const items   = Cart.getItems();

    const btn = document.getElementById('send-order-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span style="opacity:.7">Preparando pedido…</span>';
    }

    const deliveryCost = zone ? getDeliveryCost(zone) : 0;
    const subtotal     = Cart.getSubtotal();
    const total        = subtotal + deliveryCost;
    const orderId      = generateOrderId();
    const now          = new Date();
    const dateStr      = now.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeStr      = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    /* ── Build WhatsApp message ── */
    let itemLines = '';
    items.forEach((item, i) => {
      const sub = item.price * item.qty;
      itemLines += `${i + 1}. *${item.name}* × ${item.qty}\n`;
      itemLines += `   Precio unitario: $${item.price.toLocaleString('es-CL')}\n`;
      if (item.removed.length > 0) {
        itemLines += `   ⚠️ _Sin: ${item.removed.join(', ')}_\n`;
      }
      itemLines += `   Subtotal: *$${sub.toLocaleString('es-CL')}*\n`;
      if (i < items.length - 1) itemLines += `\n`;
    });

    const deliveryLine = deliveryCost === 0
      ? `🚚 *Delivery:* Gratis`
      : `🚚 *Delivery:* $${deliveryCost.toLocaleString('es-CL')}`;

    const notesLine = notes ? `\n📝 *Notas:* ${notes}` : '';

    const message = [
      `🌭 *DONDE JAVIER — DELIVERY OSORNO*`,
      `${'─'.repeat(32)}`,
      `📋 *N° Pedido:* ${orderId}`,
      `📅 ${dateStr}  ·  🕐 ${timeStr}`,
      `${'─'.repeat(32)}`,
      ``,
      `👤 *Cliente:* ${name}`,
      `📞 *Teléfono:* ${phone}`,
      `📍 *Dirección:* ${address}`,
      `🗺 *Sector:* ${zone?.name || '—'}${notesLine}`,
      ``,
      `${'─'.repeat(32)}`,
      `🛒 *DETALLE DEL PEDIDO*`,
      `${'─'.repeat(32)}`,
      ``,
      itemLines,
      `${'─'.repeat(32)}`,
      `🧾 *Subtotal:* $${subtotal.toLocaleString('es-CL')}`,
      deliveryLine,
      `💰 *TOTAL A PAGAR: $${total.toLocaleString('es-CL')}*`,
      `${'─'.repeat(32)}`,
      ``,
      `_Tiempo estimado: ${zone?.eta || '25–40 min'}_`,
      `_¡Muchas gracias por pedirnos. Le confirmamos a la brevedad._ 🙏`,
    ].join('\n');

    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      Cart.clear();
      close();
      Toast.show('¡Pedido enviado por WhatsApp!', 'success');
    }, 300);
  }

  /* ── Helper ── */
  function generateOrderId() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const rnd = Math.floor(Math.random() * 900 + 100);
    return `DJ-${hrs}${min}-${rnd}`;
  }

  /* Public surface */
  return {
    open, close,
    _onZoneChange: onZoneChange,
    _submit:       submit,
    _clearError:   clearError,
  };

})();
