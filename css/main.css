/* ==========================================================
   main.css — Donde Javier | Quiet Luxury Dark Theme
   ========================================================== */

/* ─── 1. CSS VARIABLES ─────────────────────────────────── */
:root {
  --bg:          #0A0A0A;
  --surface:     #111111;
  --surface-2:   #181818;
  --surface-3:   #202020;
  --border:      #1E1E1E;
  --border-2:    #282828;
  --text:        #EDE7DC;
  --text-2:      #A09890;
  --text-3:      #5A5650;
  --red:         #C41831;
  --red-dim:     rgba(196,24,49,0.12);
  --red-glow:    rgba(196,24,49,0.25);
  --gold:        #BFA882;
  --gold-dim:    rgba(191,168,130,0.1);
  --green:       #25D366;
  --radius-sm:   8px;
  --radius-md:   14px;
  --radius-lg:   20px;
  --radius-xl:   28px;
  --shadow-sm:   0 2px 8px rgba(0,0,0,0.5);
  --shadow-md:   0 8px 32px rgba(0,0,0,0.6);
  --shadow-lg:   0 24px 64px rgba(0,0,0,0.7);
  --transition:  0.2s cubic-bezier(0.4,0,0.2,1);
  --spring:      0.4s cubic-bezier(0.34,1.56,0.64,1);
}

/* ─── 2. RESET & BASE ──────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  overflow-x: hidden;
  padding-bottom: 88px;
}
img { display: block; width: 100%; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }
input, select, textarea { font-family: inherit; }
a { color: inherit; text-decoration: none; }

.scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 4px; }

/* ─── 3. HEADER ────────────────────────────────────────── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10,10,10,0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand { display: flex; align-items: center; gap: 12px; }
.brand-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, var(--red), #9B1224);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px var(--red-glow);
  transition: transform var(--transition);
}
.brand-icon:hover { transform: rotate(-8deg) scale(1.06); }
.brand-icon svg { width: 20px; height: 20px; color: white; }
.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  display: block;
  letter-spacing: -0.01em;
  line-height: 1.1;
}
.brand-location {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--red);
  display: block;
  margin-top: 2px;
}
.header-right { display: flex; align-items: center; gap: 10px; }
.status-pill {
  display: flex; align-items: center; gap: 6px;
  background: rgba(37,211,102,0.08);
  border: 1px solid rgba(37,211,102,0.15);
  border-radius: 99px;
  padding: 5px 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2ecc71;
}
.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #2ecc71;
  box-shadow: 0 0 0 0 rgba(46,204,113,0.6);
  animation: pulse-status 2s ease-in-out infinite;
}
@keyframes pulse-status {
  0%, 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0.6); }
  50%       { box-shadow: 0 0 0 5px rgba(46,204,113,0); }
}
.cart-header-btn {
  position: relative;
  width: 42px; height: 42px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border-2);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2);
  transition: all var(--transition);
}
.cart-header-btn:hover { border-color: var(--red); color: var(--text); }
.cart-header-btn svg { width: 20px; height: 20px; }
.cart-badge {
  position: absolute;
  top: -6px; right: -6px;
  background: var(--red);
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 99px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--bg);
  transform: scale(0);
  transition: transform var(--spring);
}
.cart-badge.visible { transform: scale(1); }

/* ─── 4. CATEGORY NAV ──────────────────────────────────── */
.category-nav {
  position: sticky;
  top: 60px;
  z-index: 90;
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.category-nav-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.category-nav-inner::-webkit-scrollbar { display: none; }
.cat-btn {
  flex-shrink: 0;
  padding: 10px 16px;
  border-radius: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-3);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}
.cat-btn:hover { color: var(--text-2); }
.cat-btn.active {
  color: var(--text);
  border-bottom-color: var(--red);
}

/* ─── 5. HERO ──────────────────────────────────────────── */
.hero {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 20px 40px;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -40px; right: -60px;
  width: 360px; height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(196,24,49,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.hero-eyebrow {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 16px;
  animation: fade-up 0.5s ease both;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(36px, 7vw, 56px);
  font-weight: 700;
  line-height: 1.05;
  color: var(--text);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  animation: fade-up 0.55s 0.05s ease both;
}
.hero-title span { color: var(--red); }
.hero-sub {
  font-size: 14px;
  color: var(--text-2);
  max-width: 320px;
  line-height: 1.7;
  margin-bottom: 28px;
  animation: fade-up 0.55s 0.1s ease both;
}
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--red);
  color: white;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
  padding: 13px 24px;
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px var(--red-glow);
  transition: all 0.2s ease;
  animation: fade-up 0.55s 0.15s ease both;
}
.hero-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px var(--red-glow); }
.hero-cta:active { transform: translateY(0); }

/* ─── 6. MENU SECTION ──────────────────────────────────── */
.menu-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px 40px;
}
.menu-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.menu-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}
.menu-count {
  font-size: 11px;
  color: var(--text-3);
  font-weight: 500;
}

/* ─── 7. PRODUCT GRID & CARDS ──────────────────────────── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 640px)  { .products-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
@media (min-width: 960px)  { .products-grid { grid-template-columns: repeat(4, 1fr); } }

.product-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.18s, box-shadow 0.2s;
  animation: fade-up 0.4s both;
}
.product-card:hover {
  border-color: var(--border-2);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}
.product-card:active { transform: translateY(0) scale(0.98); }
.card-img-wrap {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--surface-2);
}
.card-img-wrap img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.product-card:hover .card-img-wrap img { transform: scale(1.06); }
.card-tag {
  position: absolute;
  top: 8px; left: 8px;
  background: var(--red);
  color: white;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 99px;
}
.card-tag.tag-nuevo { background: #0984e3; }
.card-tag.tag-oferta { background: var(--red); }
.card-add-badge {
  position: absolute;
  bottom: 8px; right: 8px;
  width: 30px; height: 30px;
  background: white;
  color: var(--red);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-sm);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}
.card-add-badge svg { width: 16px; height: 16px; }
.product-card:hover .card-add-badge { opacity: 1; transform: scale(1); }
.card-body { padding: 12px; }
.card-name {
  font-weight: 700;
  font-size: 13px;
  color: var(--text);
  line-height: 1.3;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-desc {
  font-size: 11px;
  color: var(--text-3);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}
.card-price {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

/* ─── 8. PRODUCT MODAL (bottom sheet) ──────────────────── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 200;
  display: flex; align-items: flex-end; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
}
.modal-overlay.open { opacity: 1; pointer-events: auto; }

.product-modal {
  background: var(--surface);
  border: 1px solid var(--border-2);
  border-bottom: none;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%;
  max-width: 560px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.32,0,0.16,1);
}
.modal-overlay.open .product-modal { transform: translateY(0); }

.modal-drag { width: 36px; height: 4px; background: var(--border-2); border-radius: 2px; margin: 12px auto 0; flex-shrink: 0; }
.modal-img-wrap { position: relative; flex-shrink: 0; aspect-ratio: 16/9; overflow: hidden; background: var(--surface-2); }
.modal-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.modal-img-gradient { position: absolute; inset: 0; background: linear-gradient(to top, var(--surface) 0%, transparent 40%); }
.modal-close-btn {
  position: absolute; top: 12px; right: 12px;
  width: 34px; height: 34px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: white; z-index: 10;
  transition: transform 0.2s;
}
.modal-close-btn:hover { transform: rotate(90deg); }
.modal-close-btn svg { width: 16px; height: 16px; }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 0;
}
.modal-body::-webkit-scrollbar { display: none; }
.modal-tag { font-size: 9px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: var(--red); margin-bottom: 6px; }
.modal-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px; font-weight: 700;
  color: var(--text);
  line-height: 1.15;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.modal-price {
  font-family: 'Playfair Display', serif;
  font-size: 26px; font-weight: 700;
  color: var(--red);
  margin-bottom: 10px;
}
.modal-desc { font-size: 13px; color: var(--text-2); line-height: 1.7; margin-bottom: 20px; }

.ingredients-section { margin-bottom: 20px; }
.ingredients-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--text-3); margin-bottom: 10px;
  display: flex; align-items: center; gap: 6px;
}
.ingredients-label svg { width: 12px; height: 12px; }
.ingredients-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.ing-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid var(--border-2);
  background: var(--surface-2);
  font-size: 11px; font-weight: 600;
  color: var(--text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.ing-chip:hover { border-color: var(--text-3); color: var(--text); }
.ing-chip.removed {
  background: rgba(196,24,49,0.08);
  border-color: rgba(196,24,49,0.3);
  color: var(--red);
  text-decoration: line-through;
  opacity: 0.7;
}
.ing-chip.non-removable { opacity: 0.5; cursor: default; }
.ing-chip .chip-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.5; flex-shrink: 0; }
.ing-removed-note { margin-top: 8px; font-size: 11px; color: rgba(196,24,49,0.8); font-weight: 500; }

.modal-footer {
  padding: 14px 20px 24px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.qty-control {
  display: flex; align-items: center;
  background: var(--surface-2);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}
.qty-btn {
  width: 40px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2); font-size: 18px; font-weight: 300;
  transition: all 0.15s;
}
.qty-btn:hover { background: var(--surface-3); color: var(--text); }
.qty-btn:active { background: var(--red); color: white; transform: scale(0.9); }
.qty-value { font-weight: 700; font-size: 15px; color: var(--text); width: 36px; text-align: center; }
.add-cart-btn {
  flex: 1;
  background: var(--red);
  color: white;
  font-weight: 700;
  font-size: 14px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 20px var(--red-glow);
  transition: all 0.18s ease;
}
.add-cart-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
.add-cart-btn:active { transform: scale(0.97); filter: brightness(0.95); }
.add-cart-btn svg { width: 17px; height: 17px; }

/* ─── 9. CART DRAWER ───────────────────────────────────── */
.drawer-overlay {
  position: fixed; inset: 0; z-index: 180;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
}
.drawer-overlay.open { opacity: 1; pointer-events: auto; }
.cart-drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: min(400px, 100vw);
  background: var(--surface);
  border-left: 1px solid var(--border-2);
  z-index: 181;
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.38s cubic-bezier(0.32,0,0.16,1);
  box-shadow: -16px 0 64px rgba(0,0,0,0.5);
}
.cart-drawer.open { transform: translateX(0); }
.drawer-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.drawer-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px; font-weight: 700; color: var(--text);
  display: flex; align-items: center; gap: 8px;
}
.drawer-title svg { width: 18px; height: 18px; color: var(--red); }
.drawer-close {
  width: 34px; height: 34px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2);
  transition: all 0.15s;
}
.drawer-close:hover { border-color: var(--red); color: var(--text); }
.drawer-close svg { width: 15px; height: 15px; }
.cart-items-list { flex: 1; overflow-y: auto; padding: 8px 0; }
.cart-items-list::-webkit-scrollbar { display: none; }
.cart-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;
}
.cart-empty-icon {
  width: 64px; height: 64px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
  color: var(--text-3);
}
.cart-empty-icon svg { width: 28px; height: 28px; }
.cart-empty h4 { font-weight: 700; font-size: 15px; color: var(--text-2); margin-bottom: 6px; }
.cart-empty p { font-size: 12px; color: var(--text-3); line-height: 1.5; }
.cart-item-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  animation: fade-up 0.3s ease both;
}
.cart-item-thumb {
  width: 56px; height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden; flex-shrink: 0;
  background: var(--surface-2);
}
.cart-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
.cart-item-info { flex: 1; min-width: 0; }
.cart-item-name { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.3; margin-bottom: 2px; }
.cart-item-mods { font-size: 10px; color: var(--red); font-weight: 500; margin-bottom: 6px; }
.cart-item-price { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--red); }
.cart-item-controls { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.ci-qty-btn {
  width: 28px; height: 28px;
  background: var(--surface-2);
  border: 1px solid var(--border-2);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2); font-size: 14px;
  transition: all 0.15s;
}
.ci-qty-btn:hover { border-color: var(--red); color: var(--red); }
.ci-qty-btn:active { background: var(--red); color: white; transform: scale(0.88); }
.ci-qty { font-weight: 700; font-size: 13px; color: var(--text); width: 22px; text-align: center; }
.cart-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-2);
  background: var(--surface);
  flex-shrink: 0;
}
.cart-subtotal-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 6px 0;
  font-size: 13px; color: var(--text-2);
}
.cart-subtotal-row.total {
  font-size: 16px; font-weight: 700; color: var(--text);
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}
.cart-subtotal-row .amount { font-family: 'Playfair Display', serif; font-weight: 700; }
.cart-subtotal-row.total .amount { color: var(--red); font-size: 20px; }
.go-checkout-btn {
  width: 100%;
  margin-top: 14px;
  background: var(--red);
  color: white;
  font-weight: 700;
  font-size: 14px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 20px var(--red-glow);
  transition: all 0.18s;
}
.go-checkout-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
.go-checkout-btn:active { transform: scale(0.98); }
.go-checkout-btn svg { width: 18px; height: 18px; }

/* ─── 10. CHECKOUT MODAL ───────────────────────────────── */
.checkout-overlay {
  position: fixed; inset: 0; z-index: 300;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(10px);
  display: flex; align-items: flex-end; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s;
}
.checkout-overlay.open { opacity: 1; pointer-events: auto; }
.checkout-sheet {
  background: var(--surface);
  border: 1px solid var(--border-2); border-bottom: none;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%; max-width: 560px;
  max-height: 92vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  transform: translateY(100%);
  transition: transform 0.42s cubic-bezier(0.32,0,0.16,1);
}
.checkout-overlay.open .checkout-sheet { transform: translateY(0); }
.checkout-header {
  padding: 10px 20px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
}
.checkout-header .drag { width: 36px; height: 4px; background: var(--border-2); border-radius: 2px; margin: 0 auto 14px; }
.checkout-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px; font-weight: 700; color: var(--text);
}
.checkout-close {
  width: 34px; height: 34px;
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2);
  transition: all 0.15s;
}
.checkout-close:hover { border-color: var(--red); color: var(--text); }
.checkout-close svg { width: 15px; height: 15px; }
.checkout-body { flex: 1; overflow-y: auto; padding: 20px; }
.checkout-body::-webkit-scrollbar { display: none; }

.form-section { margin-bottom: 24px; }
.form-section-title {
  font-size: 9px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--text-3); margin-bottom: 12px;
  display: flex; align-items: center; gap: 8px;
}
.form-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

.form-group { margin-bottom: 12px; }
.form-label { display: block; font-size: 11px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; }
.form-input {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-md);
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
}
.form-input::placeholder { color: var(--text-3); }
.form-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px var(--red-dim); }
.form-input.error { border-color: #e74c3c; box-shadow: 0 0 0 3px rgba(231,76,60,0.15); }
.form-error { font-size: 11px; color: #e74c3c; margin-top: 5px; display: none; }
.form-error.show { display: block; }
select.form-input { cursor: pointer; }
select.form-input option { background: var(--surface-2); color: var(--text); }
.form-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.zone-info-box {
  background: var(--gold-dim);
  border: 1px solid rgba(191,168,130,0.15);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  margin-top: 10px;
  display: none;
}
.zone-info-box.show { display: flex; align-items: flex-start; gap: 10px; }
.zone-info-box svg { width: 16px; height: 16px; color: var(--gold); flex-shrink: 0; margin-top: 1px; }
.zone-info-content p { font-size: 12px; color: var(--text-2); line-height: 1.5; }
.zone-info-content strong { color: var(--gold); }

.order-summary-box {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px;
  margin-bottom: 16px;
}
.order-summary-item {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}
.order-summary-item:last-child { border: none; }
.osi-name { color: var(--text-2); font-weight: 500; }
.osi-mods { display: block; font-size: 10px; color: rgba(196,24,49,0.7); margin-top: 2px; }
.osi-price { font-family: 'Playfair Display', serif; font-weight: 700; color: var(--text); flex-shrink: 0; }
.checkout-total-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0 4px;
  font-size: 13px; color: var(--text-2);
}
.checkout-total-row.grand-total {
  padding-top: 14px; margin-top: 4px;
  border-top: 1px solid var(--border-2);
  font-size: 15px; font-weight: 700; color: var(--text);
}
.checkout-total-row .cta { font-family: 'Playfair Display', serif; font-weight: 700; }
.checkout-total-row.grand-total .cta { color: var(--red); font-size: 22px; }

.send-order-btn {
  width: 100%;
  background: var(--green);
  color: white;
  font-weight: 700;
  font-size: 15px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 4px 20px rgba(37,211,102,0.25);
  transition: all 0.18s;
  margin-top: 16px;
}
.send-order-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
.send-order-btn:active { transform: scale(0.97); }
.send-order-btn svg { width: 20px; height: 20px; }
.checkout-footer-note { text-align: center; font-size: 11px; color: var(--text-3); margin-top: 10px; line-height: 1.5; }

/* ─── 11. FLOATING CART ────────────────────────────────── */
.floating-cart {
  position: fixed;
  bottom: 20px; left: 50%;
  transform: translateX(-50%) translateY(100px);
  z-index: 170;
  background: var(--red);
  color: white;
  border-radius: 99px;
  padding: 14px 24px;
  display: flex; align-items: center; gap: 16px;
  box-shadow: 0 8px 32px var(--red-glow), 0 2px 8px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: transform 0.42s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  min-width: 240px;
  justify-content: space-between;
}
.floating-cart.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}
.floating-cart:active { transform: translateX(-50%) scale(0.96); }
.fc-left { display: flex; align-items: center; gap: 8px; }
.fc-icon { width: 20px; height: 20px; }
.fc-label { font-size: 13px; font-weight: 600; }
.fc-badge {
  background: rgba(255,255,255,0.25);
  font-size: 12px; font-weight: 800;
  width: 22px; height: 22px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.fc-total { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }

/* ─── 12. TOAST ─────────────────────────────────────────── */
.toast-container {
  position: fixed;
  top: 16px; left: 50%;
  transform: translateX(-50%);
  z-index: 400;
  display: flex; flex-direction: column; align-items: center;
  gap: 8px;
  pointer-events: none;
}
.toast {
  background: var(--surface-3);
  border: 1px solid var(--border-2);
  color: var(--text);
  font-size: 12px; font-weight: 600;
  padding: 10px 18px;
  border-radius: 99px;
  box-shadow: var(--shadow-md);
  white-space: nowrap;
  animation: toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
  pointer-events: auto;
}
.toast.success { background: rgba(46,204,113,0.15); border-color: rgba(46,204,113,0.25); color: #2ecc71; }
.toast.error   { background: rgba(231,76,60,0.15);  border-color: rgba(231,76,60,0.25);  color: #e74c3c; }
.toast.out     { animation: toast-out 0.25s ease both; }

/* ─── 13. ANIMATIONS ───────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toast-in {
  from { opacity: 0; transform: translateY(-12px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toast-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.8); }
}
@keyframes badge-pop {
  0%   { transform: scale(0) rotate(-15deg); }
  70%  { transform: scale(1.25) rotate(5deg); }
  100% { transform: scale(1) rotate(0); }
}
.badge-pop-anim { animation: badge-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

/* ─── 14. FOOTER ───────────────────────────────────────── */
.site-footer {
  max-width: 960px; margin: 20px auto 0;
  padding: 32px 20px 40px;
  border-top: 1px solid var(--border);
  text-align: center;
}
.footer-brand { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.footer-sub  { font-size: 11px; color: var(--text-3); margin-bottom: 20px; letter-spacing: 0.08em; }
.footer-links { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.footer-link {
  display: flex; align-items: center; gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  font-size: 12px; font-weight: 600; color: var(--text-2);
  transition: all 0.2s;
}
.footer-link:hover { border-color: var(--border-2); color: var(--text); transform: translateY(-2px); }
.footer-link svg { width: 16px; height: 16px; }
.footer-copy { margin-top: 24px; font-size: 10px; color: var(--text-3); letter-spacing: 0.1em; }

/* ─── 15. RESPONSIVE ───────────────────────────────────── */
@media (min-width: 640px) {
  .modal-overlay, .checkout-overlay { align-items: center; padding: 20px; }
  .product-modal { max-height: 85vh; border-radius: var(--radius-xl); border: 1px solid var(--border-2); }
  .product-modal { transform: translateY(30px) scale(0.96); }
  .modal-overlay.open .product-modal { transform: translateY(0) scale(1); }
  .checkout-sheet { border-radius: var(--radius-xl); border: 1px solid var(--border-2); max-height: 85vh; }
  .checkout-sheet { transform: translateY(30px) scale(0.96); }
  .checkout-overlay.open .checkout-sheet { transform: translateY(0) scale(1); }
  .hero { padding: 64px 24px 56px; }
}
@media (min-width: 960px) {
  .product-modal { max-width: 680px; }
  .modal-img-wrap { aspect-ratio: 21/9; }
  .cart-drawer { width: 420px; }
}
