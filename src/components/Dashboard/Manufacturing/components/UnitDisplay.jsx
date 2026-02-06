import React from "react";

/**
 * UnitDisplay
 * -------------------------
 * Standardized quantity + unit renderer
 * Used across recipes, production, stock, summaries
 */
function UnitDisplay({
  value,
  unit,
  precision = 2,
  muted = false,
  size = "normal",
}) {
  if (value === null || value === undefined) return "—";

  const styles = {
    wrapper: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: "4px",
      fontSize: size === "small" ? "12px" : "14px",
      fontWeight: 600,
      color: muted ? "#6b7280" : "#111827",
    },
    value: {
      fontVariantNumeric: "tabular-nums",
    },
    unit: {
      fontSize: size === "small" ? "11px" : "12px",
      color: "#6b7280",
      textTransform: "lowercase",
    },
  };

  const formattedValue =
    typeof value === "number" ? value.toFixed(precision) : value;

  return (
    <span style={styles.wrapper}>
      <span style={styles.value}>{formattedValue}</span>
      <span style={styles.unit}>{unit}</span>
    </span>
  );
}

export default UnitDisplay;
