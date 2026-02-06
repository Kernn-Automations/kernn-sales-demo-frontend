import React from "react";

/**
 * OutputSummaryCard
 * -------------------------
 * Displays all production outputs:
 * - Finished goods
 * - By-products
 * - Scrap / waste
 */
function OutputSummaryCard({ output }) {
  if (!output) return null;

  const styles = {
    card: {
      background: "#ffffff",
      borderRadius: "14px",
      padding: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
      marginBottom: "20px",
    },
    header: {
      fontSize: "16px",
      fontWeight: "800",
      marginBottom: "14px",
      color: "#111827",
    },
    section: {
      marginBottom: "14px",
    },
    sectionTitle: {
      fontSize: "13px",
      fontWeight: "700",
      marginBottom: "8px",
      color: "#2563eb",
      textTransform: "uppercase",
      letterSpacing: "0.03em",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "13px",
      padding: "6px 0",
      borderBottom: "1px dashed #e5e7eb",
    },
    label: {
      fontWeight: "600",
      color: "#374151",
    },
    value: {
      fontWeight: "700",
      color: "#111827",
    },
    good: {
      color: "#047857",
    },
    warn: {
      color: "#b45309",
    },
    bad: {
      color: "#b91c1c",
    },
    empty: {
      fontSize: "13px",
      color: "#6b7280",
      fontStyle: "italic",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>Production Output Summary</div>

      {/* FINISHED GOODS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Finished Goods</div>

        {output.finishedGoods ? (
          <div style={styles.row}>
            <span style={styles.label}>{output.finishedGoods.name}</span>
            <span style={{ ...styles.value, ...styles.good }}>
              +{output.finishedGoods.qty} {output.finishedGoods.unit}
            </span>
          </div>
        ) : (
          <div style={styles.empty}>No finished goods recorded</div>
        )}
      </div>

      {/* BY PRODUCTS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>By-Products</div>

        {output.byProducts && output.byProducts.length > 0 ? (
          output.byProducts.map((bp, idx) => (
            <div style={styles.row} key={idx}>
              <span style={styles.label}>
                {bp.name} {bp.reusable ? "(Reusable)" : "(Non-reusable)"}
              </span>
              <span style={{ ...styles.value, ...styles.warn }}>
                +{bp.qty} {bp.unit}
              </span>
            </div>
          ))
        ) : (
          <div style={styles.empty}>No by-products generated</div>
        )}
      </div>

      {/* SCRAP / WASTE */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Scrap / Waste</div>

        {output.scrap && output.scrap.length > 0 ? (
          output.scrap.map((s, idx) => (
            <div style={styles.row} key={idx}>
              <span style={styles.label}>{s.name}</span>
              <span style={{ ...styles.value, ...styles.bad }}>
                -{s.qty} {s.unit}
              </span>
            </div>
          ))
        ) : (
          <div style={styles.empty}>No scrap recorded</div>
        )}
      </div>
    </div>
  );
}

export default OutputSummaryCard;
