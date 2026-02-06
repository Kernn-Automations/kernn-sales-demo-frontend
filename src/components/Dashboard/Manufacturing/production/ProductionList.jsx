// ProductionList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

import SectionHeader from "../components/common/SectionHeader";
import EmptyState from "../components/common/EmptyState";
import BatchStatusBadge from "../components/BatchStatusBadge";
import UnitDisplay from "../components/UnitDisplay";

/**
 * ProductionList
 *
 * Central command screen for manufacturing.
 * Shows lifecycle of every batch.
 */

function ProductionList() {
  const navigate = useNavigate();
  const { state } = useManufacturing();
  const { productions, recipes, products } = state;

  const batches = productions.allIds.map((id) => productions.byId[id]);

  const styles = {
    page: {
      padding: "30px 40px",
      background: "#f8fafc",
      minHeight: "100vh",
    },
    card: {
      background: "#ffffff",
      borderRadius: "18px",
      padding: "24px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "16px",
    },
    th: {
      background: "#f1f5f9",
      padding: "12px",
      fontSize: "13px",
      fontWeight: "800",
      textAlign: "left",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
    },
    actions: {
      display: "flex",
      gap: "8px",
    },
    btn: {
      padding: "6px 12px",
      fontSize: "12px",
      fontWeight: "700",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    },
  };

  const getRecipe = (id) => recipes.byId[id];
  const getProduct = (id) => products.find((p) => p.id === id);

  if (batches.length === 0) {
    return (
      <div style={styles.page}>
        <SectionHeader
          title="🏭 Production Batches"
          subtitle="Track and control all manufacturing runs"
        />
        <EmptyState
          title="No production batches yet"
          description="Create a recipe and plan your first production batch."
          actionLabel="Go to Recipes"
          onAction={() => navigate("/manufacturing/recipes")}
        />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <SectionHeader
        title="🏭 Production Batches"
        subtitle="Real-time visibility into manufacturing execution"
      />

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Batch ID</th>
              <th style={styles.th}>Recipe</th>
              <th style={styles.th}>Output</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => {
              const recipe = getRecipe(b.recipeId);
              const product = recipe
                ? getProduct(recipe.outputProductId)
                : null;

              return (
                <tr key={b.id}>
                  <td style={styles.td}>#{b.id}</td>
                  <td style={styles.td}>{recipe?.name}</td>
                  <td style={styles.td}>
                    {product?.name} — {b.plannedOutput?.qty}{" "}
                    <UnitDisplay unit={b.plannedOutput?.unit} />
                  </td>
                  <td style={styles.td}>
                    <BatchStatusBadge status={b.status} />
                  </td>
                  <td style={styles.td}>
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={{ ...styles.btn, background: "#e5e7eb" }}
                        onClick={() =>
                          navigate(`/manufacturing/production/${b.id}`)
                        }
                      >
                        View
                      </button>

                      {b.status === "PLANNED" && (
                        <button
                          style={{
                            ...styles.btn,
                            background: "#dcfce7",
                            color: "#166534",
                          }}
                          onClick={() =>
                            navigate(
                              `/manufacturing/production/${b.id}/execute`,
                            )
                          }
                        >
                          Execute
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductionList;
