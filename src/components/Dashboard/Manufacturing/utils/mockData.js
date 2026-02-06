/* =========================================================
   MANUFACTURING MOCK DATA — ERP DEMO GRADE
   ========================================================= */

/* -----------------------------
   UNIT MASTER
------------------------------ */
export const units = {
  MASS: ["g", "kg", "ton"],
  VOLUME: ["ml", "L", "kl"],
  COUNT: ["pcs", "box", "drum"],
};

/* -----------------------------
   PRODUCT MASTER
------------------------------ */
export const products = [
  /* ===== RAW MATERIALS (20+) ===== */
  { id: 1, name: "Thiodicarb Technical", type: "raw", baseUnit: "kg" },
  { id: 2, name: "Sulphur Powder", type: "raw", baseUnit: "kg" },
  { id: 3, name: "Emulsifier A", type: "raw", baseUnit: "L" },
  { id: 4, name: "Emulsifier B", type: "raw", baseUnit: "L" },
  { id: 5, name: "Solvent X", type: "raw", baseUnit: "L" },
  { id: 6, name: "Solvent Y", type: "raw", baseUnit: "L" },
  { id: 7, name: "Dispersing Agent", type: "raw", baseUnit: "kg" },
  { id: 8, name: "Wetting Agent", type: "raw", baseUnit: "kg" },
  { id: 9, name: "Kaolin Filler", type: "raw", baseUnit: "kg" },
  { id: 10, name: "Silica Powder", type: "raw", baseUnit: "kg" },
  { id: 11, name: "Neem Extract", type: "raw", baseUnit: "L" },
  { id: 12, name: "Stabilizer", type: "raw", baseUnit: "kg" },
  { id: 13, name: "Binder Resin", type: "raw", baseUnit: "kg" },
  { id: 14, name: "Anti-Foaming Agent", type: "raw", baseUnit: "L" },
  { id: 15, name: "Packaging Liner", type: "raw", baseUnit: "pcs" },
  { id: 16, name: "Plastic Drum 25L", type: "raw", baseUnit: "pcs" },
  { id: 17, name: "Paper Sack 50kg", type: "raw", baseUnit: "pcs" },
  { id: 18, name: "Color Pigment", type: "raw", baseUnit: "kg" },
  { id: 19, name: "Fragrance Agent", type: "raw", baseUnit: "L" },
  { id: 20, name: "pH Adjuster", type: "raw", baseUnit: "kg" },

  /* ===== FINISHED GOODS (5) ===== */
  { id: 101, name: "Thiodicarb 75% WP", type: "finished", baseUnit: "kg" },
  { id: 102, name: "Sulphur 80% WP", type: "finished", baseUnit: "kg" },
  { id: 103, name: "Neem Oil EC 0.03%", type: "finished", baseUnit: "L" },
  { id: 104, name: "Combo Fungicide WG", type: "finished", baseUnit: "kg" },
  { id: 105, name: "Liquid Insecticide SC", type: "finished", baseUnit: "L" },

  /* ===== BY-PRODUCTS / WASTE (10) ===== */
  { id: 201, name: "Chemical Slurry", type: "byproduct", baseUnit: "kg" },
  { id: 202, name: "Recovered Solvent", type: "byproduct", baseUnit: "L" },
  { id: 203, name: "Dust Waste", type: "waste", baseUnit: "kg" },
  { id: 204, name: "Filter Cake", type: "waste", baseUnit: "kg" },
  { id: 205, name: "Wash Water", type: "waste", baseUnit: "L" },
  { id: 206, name: "Rejected Batch", type: "waste", baseUnit: "kg" },
  { id: 207, name: "Rework Material", type: "byproduct", baseUnit: "kg" },
  { id: 208, name: "Spent Catalyst", type: "waste", baseUnit: "kg" },
  { id: 209, name: "Off-Spec Powder", type: "byproduct", baseUnit: "kg" },
  { id: 210, name: "Evaporation Loss", type: "loss", baseUnit: "kg" },
];

/* -----------------------------
   RECIPE MASTER (5)
------------------------------ */
export const recipes = [
  {
    id: 1001,
    name: "Thiodicarb 75% WP – Std Batch",
    outputProductId: 101,
    expectedOutput: { qty: 100, unit: "kg" },
    inputs: [
      { productId: 1, qty: 75, unit: "kg" },
      { productId: 3, qty: 10, unit: "L" },
      { productId: 7, qty: 5, unit: "kg" },
      { productId: 9, qty: 10, unit: "kg" },
    ],
    byProducts: [{ productId: 201, qty: 2, unit: "kg" }],
    processLossPercent: 3,
    version: "v1.0",
  },

  {
    id: 1002,
    name: "Sulphur 80% WP – Powder Blend",
    outputProductId: 102,
    expectedOutput: { qty: 100, unit: "kg" },
    inputs: [
      { productId: 2, qty: 80, unit: "kg" },
      { productId: 9, qty: 15, unit: "kg" },
      { productId: 10, qty: 5, unit: "kg" },
    ],
    byProducts: [{ productId: 203, qty: 3, unit: "kg" }],
    processLossPercent: 2,
    version: "v2.1",
  },

  {
    id: 1003,
    name: "Neem Oil EC 0.03%",
    outputProductId: 103,
    expectedOutput: { qty: 500, unit: "L" },
    inputs: [
      { productId: 11, qty: 300, unit: "L" },
      { productId: 5, qty: 180, unit: "L" },
      { productId: 14, qty: 5, unit: "L" },
      { productId: 19, qty: 2, unit: "L" },
    ],
    byProducts: [{ productId: 202, qty: 15, unit: "L" }],
    processLossPercent: 1.5,
    version: "v1.0",
  },

  {
    id: 1004,
    name: "Combo Fungicide WG",
    outputProductId: 104,
    expectedOutput: { qty: 200, unit: "kg" },
    inputs: [
      { productId: 1, qty: 40, unit: "kg" },
      { productId: 2, qty: 50, unit: "kg" },
      { productId: 7, qty: 10, unit: "kg" },
      { productId: 12, qty: 5, unit: "kg" },
      { productId: 9, qty: 100, unit: "kg" },
    ],
    byProducts: [{ productId: 209, qty: 8, unit: "kg" }],
    processLossPercent: 4,
    version: "v1.3",
  },

  {
    id: 1005,
    name: "Liquid Insecticide SC",
    outputProductId: 105,
    expectedOutput: { qty: 1000, unit: "L" },
    inputs: [
      { productId: 1, qty: 120, unit: "kg" },
      { productId: 6, qty: 750, unit: "L" },
      { productId: 3, qty: 80, unit: "L" },
      { productId: 14, qty: 10, unit: "L" },
    ],
    byProducts: [{ productId: 205, qty: 40, unit: "L" }],
    processLossPercent: 2.5,
    version: "v1.0",
  },
];

/* -----------------------------
   PRODUCTION RECORDS (SEED)
------------------------------ */
export const productions = [
  {
    id: 9001,
    recipeId: 1001,
    date: "2026-01-10T09:00:00Z",
    batchMultiplier: 1,
    plannedOutput: { qty: 100, unit: "kg" },
    actualOutput: { qty: 96, unit: "kg" },
    status: "Completed",
    loss: { qty: 4, unit: "kg", reason: "Handling & moisture loss" },
  },
];

/* =========================================================
   INITIAL MANUFACTURING STATE
   (Normalized, Reducer-Compatible)
========================================================= */

const normalizeById = (items) => {
  const byId = {};
  const allIds = [];

  items.forEach((item) => {
    byId[item.id] = item;
    allIds.push(item.id);
  });

  return { byId, allIds };
};

/* -----------------------------
   INITIAL MANUFACTURING STATE
------------------------------ */
export const initialManufacturingState = {
  products, // flat array is fine (master data)
  units,

  recipes: {
    byId: Object.fromEntries(recipes.map((r) => [r.id, r])),
    allIds: recipes.map((r) => r.id),
  },

  productions: {
    byId: Object.fromEntries(productions.map((p) => [p.id, p])),
    allIds: productions.map((p) => p.id),
  },

  stockLedger: {
    entries: [],
  },

  stockBalances: {},

  ui: {
    lastError: null,
    loading: false,
  },
};
