/* =========================================================
   PRODUCTION CALCULATOR – ERP GRADE
   Generates standardized stock movements
   ========================================================= */

const round = (v) => Number(v.toFixed(3));

const scale = (qty, factor) => round(qty * factor);

export function calculateProduction(recipe, batchMultiplier = 1) {
  if (!recipe) throw new Error("Recipe missing");
  if (batchMultiplier <= 0) throw new Error("Invalid batch size");

  /* -----------------------------
     INPUT CONSUMPTION
  ------------------------------ */
  const inputs = recipe.inputs.map((i) => ({
    productId: i.productId,
    unit: i.unit,
    requiredQty: scale(i.qty, batchMultiplier),
  }));

  /* -----------------------------
     OUTPUT CALCULATION
  ------------------------------ */
  const plannedOutput = scale(recipe.expectedOutput.qty, batchMultiplier);

  const processLossQty = recipe.processLossPercent
    ? round((plannedOutput * recipe.processLossPercent) / 100)
    : 0;

  const actualOutput = round(plannedOutput - processLossQty);

  if (actualOutput <= 0) {
    throw new Error("Production loss exceeds output");
  }

  /* -----------------------------
     BY PRODUCTS
  ------------------------------ */
  const byProducts = (recipe.byProducts || []).map((bp) => ({
    productId: bp.productId,
    unit: bp.unit,
    qty: scale(bp.qty, batchMultiplier),
  }));

  /* -----------------------------
     STOCK MOVEMENTS
  ------------------------------ */
  const stockMovements = [];

  // RAW MATERIAL → WIP
  inputs.forEach((i) => {
    stockMovements.push({
      productId: i.productId,
      qty: -i.requiredQty,
      unit: i.unit,
      type: "RAW_CONSUMPTION",
    });
  });

  // WIP → FINISHED GOODS
  stockMovements.push({
    productId: recipe.outputProductId,
    qty: actualOutput,
    unit: recipe.expectedOutput.unit,
    type: "FG_RECEIPT",
  });

  // WIP → BY PRODUCTS
  byProducts.forEach((bp) => {
    stockMovements.push({
      productId: bp.productId,
      qty: bp.qty,
      unit: bp.unit,
      type: "BY_PRODUCT_RECEIPT",
    });
  });

  // WIP → LOSS
  if (processLossQty > 0) {
    stockMovements.push({
      productId: recipe.outputProductId,
      qty: -processLossQty,
      unit: recipe.expectedOutput.unit,
      type: "PROCESS_LOSS",
    });
  }

  /* -----------------------------
     RETURN STRUCTURE
  ------------------------------ */
  return {
    recipeId: recipe.id,
    batchMultiplier,

    inputs,
    output: {
      productId: recipe.outputProductId,
      plannedQty: plannedOutput,
      actualQty: actualOutput,
      unit: recipe.expectedOutput.unit,
    },

    byProducts,

    processLoss: {
      qty: processLossQty,
      percent: recipe.processLossPercent || 0,
    },

    stockMovements,
  };
}
