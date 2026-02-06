import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

import SectionHeader from "../components/common/SectionHeader";
import InfoBox from "../components/common/InfoBox";
import YieldIndicator from "../components/YieldIndicator";
import UnitDisplay from "../components/UnitDisplay";

/**
 * RecipeView
 *
 * Explains HOW a product is manufactured.
 * Used for:
 * - Review
 * - Audit
 * - Management understanding
 */
function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, products } = useManufacturing();

  const recipe = recipes?.byId?.[Number(id)];
  if (!recipe) {
    return <div style={{ padding: 40 }}>Recipe not found.</div>;
  }

  const getProduct = (pid) => products.find((p) => p.id === pid);

  const totalInputQty = recipe.inputs.reduce(
    (sum, i) => sum + Number(i.qty || 0),
    0,
  );

  const yieldPercent = totalInputQty
    ? (recipe.expectedOutputQty / totalInputQty) * 100
    : 0;

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
    actionBtn: {
      background: "#16a34a",
      color: "white",
      padding: "10px 18px",
      borderRadius: "10px",
      border: "none",
      fontWeight: "700",
      cursor: "pointer",
    },
    card: {
      background: "#ffffff",
      borderRadius: "18px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "800",
      marginBottom: "12px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px dashed #e2e8f0",
      fontSize: "14px",
    },
    label: {
      color: "#475569",
      fontWeight: "600",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    th: {
      textAlign: "left",
      background: "#f1f5f9",
      padding: "10px",
      fontSize: "13px",
      fontWeight: "700",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <SectionHeader
          title={recipe.name}
          subtitle="Manufacturing rule definition & yield explanation"
        />

        <button
          style={styles.actionBtn}
          onClick={() =>
            navigate(`/manufacturing/production/new?recipe=${recipe.id}`)
          }
        >
          Start Production
        </button>
      </div>

      {/* OUTPUT */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>🎯 Output Definition</div>

        <div style={styles.row}>
          <span style={styles.label}>Finished Product</span>
          <span>{getProduct(recipe.outputProductId)?.name}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Expected Output</span>
          <UnitDisplay
            value={recipe.expectedOutputQty}
            unit={recipe.inputs[0]?.unit || "unit"}
          />
        </div>

        <InfoBox>
          This quantity represents the **ideal expected yield** before
          accounting for process loss or inefficiencies.
        </InfoBox>
      </div>

      {/* INPUT MATERIALS */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>🧪 Raw Materials Consumption</div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Material</th>
              <th style={styles.th}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {recipe.inputs.map((i, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{getProduct(i.productId)?.name}</td>
                <td style={styles.td}>
                  <UnitDisplay value={i.qty} unit={i.unit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <InfoBox>
          Total material input across all raw materials:&nbsp;
          <strong>{totalInputQty}</strong>
        </InfoBox>
      </div>

      {/* BY PRODUCTS */}
      {recipe.byProducts?.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionTitle}>♻ By-Products / Scrap</div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>By-Product</th>
                <th style={styles.th}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {recipe.byProducts.map((b, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{getProduct(b.productId)?.name}</td>
                  <td style={styles.td}>
                    <UnitDisplay value={b.qty} unit={b.unit} muted />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <InfoBox>
            By-products may be reusable, recyclable, or classified as waste
            depending on downstream processes.
          </InfoBox>
        </div>
      )}

      {/* YIELD */}
      <div style={styles.card}>
        <div style={styles.sectionTitle}>📊 Yield & Efficiency</div>

        <div style={styles.row}>
          <span style={styles.label}>Total Input</span>
          <UnitDisplay
            value={totalInputQty}
            unit={recipe.inputs[0]?.unit || "unit"}
          />
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Expected Output</span>
          <UnitDisplay
            value={recipe.expectedOutputQty}
            unit={recipe.inputs[0]?.unit || "unit"}
          />
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Yield</span>
          <YieldIndicator value={yieldPercent} />
        </div>

        <InfoBox>
          Yield below 100% indicates **expected process loss** such as
          evaporation, trimming, chemical reaction loss, or scrap — depending on
          industry.
        </InfoBox>
      </div>
    </div>
  );
}

export default RecipeView;
