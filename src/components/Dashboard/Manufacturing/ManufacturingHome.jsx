// ManufacturingHome.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useManufacturing } from "./context/ManufacturingContext";

/**
 * ManufacturingHome
 *
 * Executive / Control-room overview.
 * Read-only, derived metrics only.
 */

function ManufacturingHome() {
  const navigate = useNavigate();
  const { state } = useManufacturing();

  const { recipes, productions, stockLedger, products } = state;

  /* ----------------------------------------
     KPI DERIVATIONS
  ---------------------------------------- */
  const totalRecipes = recipes.allIds.length;

  const totalBatches = productions.allIds.length;

  const completedBatches = productions.allIds.filter(
    (id) => productions.byId[id].status === "COMPLETED",
  ).length;

  const totalProcessLoss = productions.allIds.reduce((sum, id) => {
    const loss = productions.byId[id]?.actuals?.loss || 0;
    return sum + loss;
  }, 0);

  /* ----------------------------------------
     RECENT STOCK AUDIT (last 6)
  ---------------------------------------- */
  const recentAudit = useMemo(() => {
    return [...stockLedger.entries]
      .slice(-6)
      .reverse()
      .map((e) => {
        const product = products.find((p) => p.id === e.productId);
        return {
          ...e,
          productName: product?.name || "Unknown",
        };
      });
  }, [stockLedger.entries, products]);

  const styles = {
    page: {
      padding: "30px 40px",
      background: "#f8fafc",
      minHeight: "100vh",
    },
    header: {
      fontSize: "26px",
      fontWeight: "800",
      marginBottom: "10px",
    },
    subHeader: {
      color: "#475569",
      marginBottom: "30px",
      maxWidth: "900px",
      lineHeight: "1.6",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    card: {
      background: "#ffffff",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    },
    cardTitle: {
      fontSize: "13px",
      fontWeight: "700",
      color: "#64748b",
      marginBottom: "8px",
      textTransform: "uppercase",
    },
    cardValue: {
      fontSize: "28px",
      fontWeight: "800",
    },
    section: {
      background: "#ffffff",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      marginBottom: "30px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "800",
      marginBottom: "12px",
    },
    infoText: {
      color: "#475569",
      fontSize: "14px",
      lineHeight: "1.6",
      maxWidth: "900px",
    },
    actionRow: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
      flexWrap: "wrap",
    },
    button: {
      background: "#2563eb",
      color: "#ffffff",
      border: "none",
      borderRadius: "10px",
      padding: "10px 18px",
      fontWeight: "700",
      cursor: "pointer",
    },
    secondaryBtn: {
      background: "#e2e8f0",
      color: "#0f172a",
      border: "none",
      borderRadius: "10px",
      padding: "10px 18px",
      fontWeight: "700",
      cursor: "pointer",
    },
    auditRow: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #e5e7eb",
      padding: "10px 0",
      fontSize: "14px",
    },
    auditTypeIn: { color: "#16a34a", fontWeight: "700" },
    auditTypeOut: { color: "#dc2626", fontWeight: "700" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>🏭 Manufacturing Control Center</div>
      <div style={styles.subHeader}>
        Executive overview of manufacturing activity.
        <br />
        <strong>
          All figures are derived from immutable production and stock-ledger
          data.
        </strong>
      </div>

      {/* KPI GRID */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Active Recipes</div>
          <div style={styles.cardValue}>{totalRecipes}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Production Batches</div>
          <div style={styles.cardValue}>{totalBatches}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Completed Batches</div>
          <div style={styles.cardValue}>{completedBatches}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Process Loss</div>
          <div style={styles.cardValue}>{totalProcessLoss}</div>
        </div>
      </div>

      {/* MODULE EXPLANATION */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          📘 What This Manufacturing Module Models
        </div>
        <div style={styles.infoText}>
          • Multi-input → multi-output production logic
          <br />
          • Unit-aware material consumption and yield
          <br />
          • By-products reusable across recipes
          <br />
          • Explicit wastage and loss tracking
          <br />
          • Immutable stock audit trail
          <br />• Industry-neutral (chemical, food, pharma, steel, textile)
        </div>

        <div style={styles.actionRow}>
          <button
            style={styles.button}
            onClick={() => navigate("/manufacturing/recipes")}
          >
            Manage Recipes
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/manufacturing/production")}
          >
            View Production Batches
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/manufacturing/recipes/explain")}
          >
            Explain Manufacturing Logic
          </button>
        </div>
      </div>

      {/* STOCK AUDIT PREVIEW */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          📊 Recent Stock Movements (Audit Preview)
        </div>

        {recentAudit.length === 0 && (
          <div style={styles.infoText}>No stock movements yet.</div>
        )}

        {recentAudit.map((entry, idx) => (
          <div key={idx} style={styles.auditRow}>
            <div>
              {entry.productName} — {entry.qty} {entry.unit}
            </div>
            <div
              style={
                entry.type === "INWARD"
                  ? styles.auditTypeIn
                  : styles.auditTypeOut
              }
            >
              {entry.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManufacturingHome;
