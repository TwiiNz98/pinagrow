/* ==========================================================
   data.js — Donde Javier | Catálogo y zonas de despacho
   ========================================================== */

const CATEGORIES = [
  { id: 'todos',     label: 'Todo el menú' },
  { id: 'completos', label: 'Completos'    },
  { id: 'papas',     label: 'Papas Fritas' },
  { id: 'combos',    label: 'Combos'       },
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
    description: 'El balance justo entre el toque fresco del tomate y el sabor intenso del chucrut, sobre pan artesanal horneado cada día. El de siempre, bien hecho.',
    price: 1000,
    tag: null,
    hasSizes: false,
    image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?auto=format&fit=crop&w=900&q=85',
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
    description: 'Con palta natural trabajada a diario, tomate fresco y mayonesa casera sobre vienesa de primera. El más pedido del local, y con razón.',
    price: 1600,
    tag: 'el más pedido',
    hasSizes: false,
    image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=900&q=85',
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
    slug: 'combo-italiano-bebida',
    name: 'Italiano + Bebida',
    category: 'combos',
    description: 'El Italiano completo más una bebida individual bien fría de 350ml. La dupla ideal para el almuerzo o la once, al mejor precio del barrio.',
    price: 2000,
    tag: 'mejor precio',
    hasSizes: false,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=85',
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
    id: 4,
    slug: 'papas-fritas',
    name: 'Papas Fritas',
    category: 'papas',
    description: 'Papas de origen nacional, fritas en su punto exacto: crocantes por fuera y blanditas por dentro. Con sal de mar. Elige el tamaño que más te acomoda.',
    price: 1000,
    tag: null,
    hasSizes: true,
    sizes: [
      { id: 'personal', label: 'Porción Personal', sublabel: 'Ideal para uno',  price: 1000 },
      { id: 'familiar', label: 'Porción Familiar',  sublabel: 'Para compartir', price: 2000 },
    ],
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',
    ingredients: [
      { id: 'papa',   name: 'Papa nacional',  removable: false },
      { id: 'sal',    name: 'Sal de mar',     removable: true  },
      { id: 'aceite', name: 'Aceite vegetal', removable: false },
    ],
  },
];
