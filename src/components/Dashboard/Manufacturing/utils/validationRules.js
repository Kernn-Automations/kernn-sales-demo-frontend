/* =========================================================
   VALIDATION RULES – MANUFACTURING (ERP GRADE)
   Centralized, strict, auditable
   ========================================================= */

import { areUnitsCompatible, getUnitDimension } from "./unitConverter";

/* ---------------------------------------------
   GENERIC HELPERS
---------------------------------------------- */
function error(message) {
  throw new Error(message);
}

/* ---------------------------------------------
   RECIPE VALIDATION
---------------------------------------------- */
export function validateRecipe(recipe) {
  if (!recipe) error("Recipe object missing");

  if (!recipe.name || recipe.name.trim().length < 3) {
    error("Recipe name must be at least 3 characters");
  }

  if (!recipe.outputProductId) {
    error("Recipe must have an output product");
  }

  if (!recipe.expectedOutput || recipe.expectedOutput.qty <= 0) {
    error("Expected output quantity must be greater than zero");
  }

  if (!recipe.expectedOutput.unit) {
    error("Expected output unit is required");
  }

  if (!Array.isArray(recipe.inputs) || recipe.inputs.length === 0) {
    error("Recipe must have at least one input material");
  }

  recipe.inputs.forEach((input, idx) => {
    if (!input.productId) {
      error(`Input material #${idx + 1} missing product`);
    }
    if (input.qty <= 0) {
      error(`Input quantity must be > 0 (material #${idx + 1})`);
    }
    if (!input.unit) {
      error(`Input unit missing for material #${idx + 1}`);
    }

    // Unit compatibility with output (mass ↔ mass etc.)
    if (!areUnitsCompatible(input.unit, recipe.expectedOutput.unit)) {
      error(
        `Unit mismatch: ${input.unit} cannot produce ${recipe.expectedOutput.unit}`,
      );
    }
  });

  if (recipe.processLossPercent < 0 || recipe.processLossPercent >= 100) {
    error("Process loss percent must be between 0 and 99");
  }

  /* ---------------------------------------------
     BY-PRODUCT VALIDATION
  ---------------------------------------------- */
  if (recipe.byProducts) {
    recipe.byProducts.forEach((bp, idx) => {
      if (!bp.productId) {
        error(`By-product #${idx + 1} missing product`);
      }
      if (bp.qty <= 0) {
        error(`By-product quantity must be > 0 (#${idx + 1})`);
      }
      if (!bp.unit) {
        error(`By-product unit missing (#${idx + 1})`);
      }

      if (!areUnitsCompatible(bp.unit, recipe.expectedOutput.unit)) {
        error(`By-product unit incompatible with output (#${idx + 1})`);
      }
    });
  }

  return true;
}

/* ---------------------------------------------
   PRODUCTION VALIDATION
---------------------------------------------- */
export function validateProductionRequest(recipe, batchQty) {
  if (!recipe) error("Recipe not selected");
  if (!batchQty || batchQty <= 0) {
    error("Batch quantity must be greater than zero");
  }

  if (!Number.isFinite(batchQty)) {
    error("Batch quantity must be a valid number");
  }

  return true;
}

/* ---------------------------------------------
   MASS / VOLUME BALANCE CHECK
---------------------------------------------- */
export function validateMassBalance({
  totalInputQty,
  totalOutputQty,
  totalByProductQty,
  processLossQty,
}) {
  const calculated = totalOutputQty + totalByProductQty + processLossQty;

  if (calculated > totalInputQty) {
    error(
      `Invalid mass balance:
       Inputs: ${totalInputQty}
       Outputs + Loss: ${calculated}`,
    );
  }

  return true;
}

/* ---------------------------------------------
   STOCK MOVEMENT VALIDATION
---------------------------------------------- */
export function validateStockMovements(movements) {
  if (!Array.isArray(movements)) {
    error("Stock movements must be an array");
  }

  movements.forEach((m, idx) => {
    if (!m.productId) {
      error(`Stock movement #${idx + 1} missing product`);
    }
    if (!m.unit) {
      error(`Stock movement #${idx + 1} missing unit`);
    }
    if (!m.type) {
      error(`Stock movement #${idx + 1} missing type`);
    }
    if (!Number.isFinite(m.qty) || m.qty === 0) {
      error(`Stock movement #${idx + 1} has invalid quantity`);
    }
  });

  return true;
}
