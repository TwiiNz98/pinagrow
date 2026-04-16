/* ==========================================================
   data.js — Donde Javier | Catálogo de productos y zonas
   Para agregar imágenes locales: reemplaza la URL en `image`
   por la ruta local: /images/[slug].jpg
   ========================================================== */

const CATEGORIES = [
  { id: 'todos',    label: 'Todo',      icon: '✦' },
  { id: 'completos',label: 'Completos', icon: '🌭' },
  { id: 'papas',    label: 'Papas',     icon: '🍟' },
  { id: 'combos',   label: 'Combos',    icon: '🎁' },
  { id: 'bebidas',  label: 'Bebidas',   icon: '🥤' },
];

const ZONES = [
  { id: 'sector-centro',  name: 'Sector Centro',             cost: 0,    minFree: 6000,  eta: '20–30 min' },
  { id: 'rahue-alto',     name: 'Rahue Alto',                cost: 1000, minFree: 8000,  eta: '25–35 min' },
  { id: 'rahue-bajo',     name: 'Rahue Bajo',                cost: 1500, minFree: 10000, eta: '30–40 min' },
  { id: 'villa-alegre',   name: 'Villa Alegre / Las Quemas', cost: 2000, minFree: null,  eta: '35–45 min' },
  { id: 'pampa-alegre',   name: 'Pampa Alegre',              cost: 2000, minFree: null,  eta: '35–45 min' },
  { id: 'los-cristales',  name: 'Los Cristales',             cost: 2500, minFree: null,  eta: '40–50 min' },
];

const PRODUCTS = [
  {
    id: 1,
    slug: 'completo-clasico',
    name: 'Completo Clásico',
    category: 'completos',
    description: 'El equilibrio exacto entre el frescor del tomate y el carácter intenso del chucrut. Pan artesanal horneado a diario.',
    price: 1000,
    tag: null,
    image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?auto=format&fit=crop&w=900&q=85',
    // 🖼 Reemplazar con: /images/completo-clasico.jpg
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate picado',   removable: true  },
      { id: 'chucrut', name: 'Chucrut',         removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
    ],
  },
  {
    id: 2,
    slug: 'completo-italiano',
    name: 'Completo Italiano',
    category: 'completos',
    description: 'Cremosa palta natural procesada diariamente sobre vienesa premium. El plato más solicitado de la casa.',
    price: 1600,
    tag: 'más pedido',
    image: 'https://www.bakelschile.cl/wp-content/uploads/sites/25/2024/05/MicrosoftTeams-image-40-560x370.jpg',
    // 🖼 Reemplazar con: /images/completo-italiano.jpg
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate fresco',   removable: true  },
      { id: 'palta',   name: 'Palta natural',   removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
    ],
  },
  {
    id: 3,
    slug: 'completo-as',
    name: 'Completo AS',
    category: 'completos',
    description: 'Con todo. Tomate, palta, chucrut y mayonesa. Para quienes no quieren elegir. El máximo.',
    price: 1800,
    tag: 'nuevo',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=85',
    // 🖼 Reemplazar con: /images/completo-as.jpg
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate fresco',   removable: true  },
      { id: 'palta',   name: 'Palta natural',   removable: true  },
      { id: 'chucrut', name: 'Chucrut',         removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
    ],
  },
  {
    id: 4,
    slug: 'papas-fritas',
    name: 'Papas Fritas',
    category: 'papas',
    description: 'Papas seleccionadas, fritas en su punto exacto. Crujientes por fuera, tiernas por dentro. Sal de mar.',
    price: 1500,
    tag: null,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',
    // 🖼 Reemplazar con: /images/papas-fritas.jpg
    ingredients: [
      { id: 'papa',  name: 'Papa seleccionada', removable: false },
      { id: 'sal',   name: 'Sal de mar',        removable: true  },
      { id: 'aceite',name: 'Aceite vegetal',    removable: false },
    ],
  },
  {
    id: 5,
    slug: 'papas-con-queso',
    name: 'Papas con Queso',
    category: 'papas',
    description: 'Papas crujientes bañadas en queso cheddar fundido. El snack más pedido para compartir en familia.',
    price: 2000,
    tag: null,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=85',
    // 🖼 Reemplazar con: /images/papas-con-queso.jpg
    ingredients: [
      { id: 'papa',  name: 'Papa seleccionada',    removable: false },
      { id: 'queso', name: 'Queso cheddar fundido', removable: true  },
      { id: 'sal',   name: 'Sal de mar',            removable: true  },
    ],
  },
  {
    id: 6,
    slug: 'combo-italiano',
    name: 'Combo Italiano + Bebida',
    category: 'combos',
    description: 'Nuestro Italiano completo + bebida individual 350ml helada. La combinación perfecta para el almuerzo.',
    price: 2000,
    tag: 'oferta',
    image: 'https://images.unsplash.com/photo-1623231307228-440268800995?auto=format&fit=crop&w=900&q=85',
    // 🖼 Reemplazar con: /images/combo-italiano.jpg
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate fresco',   removable: true  },
      { id: 'palta',   name: 'Palta natural',   removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
      { id: 'bebida',  name: 'Bebida 350ml',    removable: false },
    ],
  },
  {
    id: 7,
    slug: 'combo-clasico',
    name: 'Combo Clásico + Bebida',
    category: 'combos',
    description: 'El Clásico de toda la vida más bebida individual. Almuerzo completo al mejor precio del sector.',
    price: 1500,
    tag: null,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    // 🖼 Reemplazar con: /images/combo-clasico.jpg
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate picado',   removable: true  },
      { id: 'chucrut', name: 'Chucrut',         removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
      { id: 'bebida',  name: 'Bebida 350ml',    removable: false },
    ],
  },
  {
    id: 8,
    slug: 'bebida-350',
    name: 'Bebida 350ml',
    category: 'bebidas',
    description: 'Bebida individual bien fría. Disponible en Coca-Cola, Pepsi, Fanta y Sprite. Consultar disponibilidad.',
    price: 800,
    tag: null,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85',
    // 🖼 Reemplazar con: /images/bebida-350.jpg
    ingredients: [],
  },
];
