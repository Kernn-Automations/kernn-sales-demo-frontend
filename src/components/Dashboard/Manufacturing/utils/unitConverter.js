/* =========================================================
   UNIT CONVERTER – ERP GRADE
   Canonical, strict, auditable
   ========================================================= */

/**
 * Base units per dimension
 */
const BASE_UNITS = {
  mass: "kg",
  volume: "l",
  length: "m",
  count: "pcs",
};

/**
 * Conversion table relative to base unit
 */
const UNIT_DEFINITIONS = {
  // MASS
  kg: { dimension: "mass", factor: 1 },
  g: { dimension: "mass", factor: 0.001 },
  mg: { dimension: "mass", factor: 0.000001 },
  ton: { dimension: "mass", factor: 1000 },

  // VOLUME
  l: { dimension: "volume", factor: 1 },
  ml: { dimension: "volume", factor: 0.001 },
  kl: { dimension: "volume", factor: 1000 },
  gallon: { dimension: "volume", factor: 3.78541 },

  // LENGTH
  m: { dimension: "length", factor: 1 },
  cm: { dimension: "length", factor: 0.01 },
  mm: { dimension: "length", factor: 0.001 },

  // COUNT
  pcs: { dimension: "count", factor: 1 },
  box: { dimension: "count", factor: 10 }, // configurable
  dozen: { dimension: "count", factor: 12 },
};

/**
 * Validate unit existence
 */
function validateUnit(unit) {
  if (!UNIT_DEFINITIONS[unit]) {
    throw new Error(`Unsupported unit: ${unit}`);
  }
}

/**
 * Convert any unit to its base unit
 */
export function toBaseUnit(qty, unit) {
  validateUnit(unit);

  const def = UNIT_DEFINITIONS[unit];
  const baseUnit = BASE_UNITS[def.dimension];

  return {
    qty: round(qty * def.factor),
    unit: baseUnit,
    dimension: def.dimension,
  };
}

/**
 * Convert from base unit to target unit
 */
export function fromBaseUnit(qty, targetUnit) {
  validateUnit(targetUnit);

  const def = UNIT_DEFINITIONS[targetUnit];
  return round(qty / def.factor);
}

/**
 * Convert between units safely
 */
export function convertUnit(qty, fromUnit, toUnit) {
  validateUnit(fromUnit);
  validateUnit(toUnit);

  const fromDef = UNIT_DEFINITIONS[fromUnit];
  const toDef = UNIT_DEFINITIONS[toUnit];

  if (fromDef.dimension !== toDef.dimension) {
    throw new Error(`Invalid unit conversion: ${fromUnit} → ${toUnit}`);
  }

  const baseQty = qty * fromDef.factor;
  const converted = baseQty / toDef.factor;

  return round(converted);
}

/**
 * Utility: round consistently
 */
function round(value, precision = 3) {
  return Number(value.toFixed(precision));
}

/**
 * Get dimension of unit
 */
export function getUnitDimension(unit) {
  validateUnit(unit);
  return UNIT_DEFINITIONS[unit].dimension;
}

/**
 * Check if two units are compatible
 */
export function areUnitsCompatible(unitA, unitB) {
  validateUnit(unitA);
  validateUnit(unitB);
  return (
    UNIT_DEFINITIONS[unitA].dimension === UNIT_DEFINITIONS[unitB].dimension
  );
}
