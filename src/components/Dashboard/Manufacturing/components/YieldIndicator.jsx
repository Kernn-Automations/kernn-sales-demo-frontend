import React from "react";

/**
 * YieldIndicator
 * -------------------------
 * Shows production yield efficiency.
 *
 * Props:
 * - expectedQty : number
 * - actualQty   : number
 * - unit        : string (kg, L, pcs, etc.)
 */
function YieldIndicator({ expectedQty, actualQty, unit }) {
  if (!expectedQty || expectedQty <= 0) return null;

  const yieldPercent = ((actualQty / expectedQty) * 100).toFixed(2);
  const varianceQty = actualQty - expectedQty;
  const lossQty = expectedQty - actualQty;

  const isGood = yieldPercent >= 98;
  const isWarning = yieldPercent >= 95 && yieldPercent < 98;
  const isBad = yieldPercent < 95;

  const color = isGood ? "#047857" : isWarning ? "#b45309" : "#b91c1c";

  const bgColor = isGood ? "#ecfdf5" : isWarning ? "#fff7ed" : "#fef2f2";

  const styles = {
    container: {
      borderRadius: "12px",
      padding: "16px",
      background: bgColor,
      border: `1px solid ${color}`,
    },
    header: {
      fontSize: "14px",
      fontWeight: "700",
      marginBottom: "10px",
      color,
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "13px",
      marginBottom: "6px",
    },
    label: {
      color: "#374151",
      fontWeight: "600",
    },
    value: {
      fontWeight: "700",
      color: "#111827",
    },
    yieldValue: {
      fontSize: "20px",
      fontWeight: "800",
      color,
      marginTop: "8px",
      textAlign: "right",
    },
    note: {
      marginTop: "10px",
      fontSize: "12px",
      color: "#6b7280",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Yield Efficiency</div>

      <div style={styles.row}>
        <span style={styles.label}>Expected Output</span>
        <span style={styles.value}>
          {expectedQty} {unit}
        </span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Actual Output</span>
        <span style={styles.value}>
          {actualQty} {unit}
        </span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Variance</span>
        <span style={styles.value}>
          {varianceQty > 0 ? "+" : ""}
          {varianceQty} {unit}
        </span>
      </div>

      {lossQty > 0 && (
        <div style={styles.row}>
          <span style={styles.label}>Process Loss</span>
          <span style={{ ...styles.value, color: "#b91c1c" }}>
            {lossQty} {unit}
          </span>
        </div>
      )}

      <div style={styles.yieldValue}>{yieldPercent}%</div>

      <div style={styles.note}>
        {isGood && "Excellent yield. Process is stable."}
        {isWarning && "Minor losses detected. Monitor closely."}
        {isBad && "High loss detected. Investigation required."}
      </div>
    </div>
  );
}

export default YieldIndicator;
