// RecipeList.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

/**
 * RecipeList
 *
 * Manufacturing Recipe Registry (BOM / Formula Master)
 * - Normalized data compatible
 * - Backend-ready
 * - Audit-safe
 */

function RecipeList() {
  const navigate = useNavigate();
  const { recipes, products } = useManufacturing();

  /* ----------------------------------------
     STYLES
  ---------------------------------------- */
  const styles = {
    page: {
      padding: "30px 40px",
      background: "#f8fafc",
      minHeight: "100vh",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "800",
    },
    subtitle: {
      color: "#475569",
      fontSize: "14px",
      marginTop: "4px",
    },
    addBtn: {
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "10px 18px",
      fontWeight: "700",
      cursor: "pointer",
    },
    tableWrap: {
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      background: "#f1f5f9",
      textAlign: "left",
      padding: "14px",
      fontSize: "13px",
      fontWeight: "700",
      borderBottom: "1px solid #e2e8f0",
    },
    td: {
      padding: "14px",
      fontSize: "14px",
      borderBottom: "1px solid #e2e8f0",
    },
    badge: {
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
      display: "inline-block",
    },
    actions: {
      display: "flex",
      gap: "8px",
    },
    actionBtn: {
      padding: "6px 10px",
      fontSize: "12px",
      fontWeight: "700",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    },
    empty: {
      padding: "30px",
      textAlign: "center",
      color: "#64748b",
      fontSize: "14px",
    },
  };

  /* ----------------------------------------
     HELPERS
  ---------------------------------------- */
  const getProductName = (id) => products.find((p) => p.id === id)?.name || "—";

  /* ----------------------------------------
     NORMALIZED → UI TRANSFORMATION
  ---------------------------------------- */
  const enrichedRecipes = useMemo(() => {
    if (!recipes?.allIds) return [];

    return recipes.allIds.map((id) => {
      const r = recipes.byId[id];

      const totalInput = r.inputs.reduce((sum, i) => sum + Number(i.qty), 0);

      const expectedQty =
        typeof r.expectedOutputQty === "number"
          ? r.expectedOutputQty
          : r.expectedOutput?.qty || 0;

      const yieldPercent = totalInput
        ? ((expectedQty / totalInput) * 100).toFixed(1)
        : "0.0";

      return {
        ...r,
        totalInput,
        expectedQty,
        yieldPercent,
      };
    });
  }, [recipes]);

  /* ----------------------------------------
     RENDER
  ---------------------------------------- */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.title}>🏭 Manufacturing Recipes</div>
          <div style={styles.subtitle}>
            Approved transformation rules governing stock movement & yield
          </div>
        </div>

        <button
          style={styles.addBtn}
          onClick={() => navigate("/manufacturing/recipes/new")}
        >
          + Create Recipe
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Recipe Name</th>
              <th style={styles.th}>Output Product</th>
              <th style={styles.th}>Total Input Qty</th>
              <th style={styles.th}>Expected Output</th>
              <th style={styles.th}>Yield %</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {enrichedRecipes.map((r) => (
              <tr key={r.id}>
                <td style={{ ...styles.td, fontWeight: "700" }}>{r.name}</td>
                <td style={styles.td}>{getProductName(r.outputProductId)}</td>
                <td style={styles.td}>{r.totalInput}</td>
                <td style={styles.td}>{r.expectedQty}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: r.yieldPercent >= 90 ? "#dcfce7" : "#fff7ed",
                      color: r.yieldPercent >= 90 ? "#166534" : "#9a3412",
                    }}
                  >
                    {r.yieldPercent}%
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      style={{
                        ...styles.actionBtn,
                        background: "#e5e7eb",
                      }}
                      onClick={() => navigate(`/manufacturing/recipes/${r.id}`)}
                    >
                      View
                    </button>
                    <button
                      style={{
                        ...styles.actionBtn,
                        background: "#dcfce7",
                        color: "#166534",
                      }}
                      onClick={() =>
                        navigate(`/manufacturing/production/new?recipe=${r.id}`)
                      }
                    >
                      Produce
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {recipes.allIds.length === 0 && (
              <tr>
                <td colSpan={6} style={styles.empty}>
                  No manufacturing recipes defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecipeList;
