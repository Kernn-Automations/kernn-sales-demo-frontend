// ProductionExplain.jsx
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

import SectionHeader from "../components/common/SectionHeader";
import InfoBox from "../components/common/InfoBox";
import OutputSummaryCard from "../components/OutputSummaryCard";
import YieldIndicator from "../components/YieldIndicator";
import UnitDisplay from "../components/UnitDisplay";

/**
 * ProductionExplain
 *
 * ZERO mutations.
 * This screen exists only to EXPLAIN:
 *
 * - What stock goes OUT
 * - What stock comes IN
 * - What is LOST
 * - What is recorded as BY-PRODUCT
 *
 * This is what builds client trust.
 */

function ProductionExplain() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { state } = useManufacturing();
  const { recipes, products } = state;

  const recipeId = Number(params.get("recipe"));
  const multiplier = Number(params.get("batch")) || 1;

  const recipe = recipes.byId[recipeId];
  if (!recipe) {
    return <div style={{ padding: 40 }}>Invalid recipe reference.</div>;
  }

  /* ----------------------------------------
     CALCULATIONS (mirror execution)
  ---------------------------------------- */
  const inputs = recipe.inputs.map((i) => ({
    ...i,
    plannedQty: i.qty * multiplier,
  }));

  const outputQty = recipe.expectedOutput.qty * multiplier;

  const byProducts =
    recipe.byProducts?.map((b) => ({
      ...b,
      plannedQty: b.qty * multiplier,
    })) || [];

  const lossQty =
    recipe.processLossPercent > 0
      ? ((outputQty * recipe.processLossPercent) / 100).toFixed(2)
      : 0;

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
      marginBottom: "20px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    th: {
      background: "#f1f5f9",
      textAlign: "left",
      padding: "12px",
      fontSize: "13px",
      fontWeight: "700",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
    },
    out: { color: "#b91c1c", fontWeight: "700" },
    in: { color: "#166534", fontWeight: "700" },
    neutral: { color: "#475569" },
    btn: {
      background: "#2563eb",
      color: "white",
      padding: "12px 22px",
      borderRadius: "12px",
      border: "none",
      fontWeight: "800",
      cursor: "pointer",
      marginTop: "20px",
    },
  };

  const getProduct = (id) => products.find((p) => p.id === id);

  return (
    <div style={styles.page}>
      <SectionHeader
        title="📘 Production Stock Impact Explanation"
        subtitle="Exactly how inventory will move when this batch is executed"
      />

      <InfoBox>
        This page performs a <strong>dry-run</strong> of stock movements.
        <br />
        No inventory is changed on this screen.
      </InfoBox>

      {/* RAW MATERIAL OUT */}
      <div style={styles.card}>
        <SectionHeader title="📉 Raw Materials — STOCK OUT" />

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Material</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Ledger Entry</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((i, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{getProduct(i.productId)?.name}</td>
                <td style={{ ...styles.td, ...styles.out }}>-{i.plannedQty}</td>
                <td style={styles.td}>
                  <UnitDisplay unit={i.unit} />
                </td>
                <td style={styles.td}>PRODUCTION_CONSUMPTION</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OUTPUT */}
      <div style={styles.card}>
        <SectionHeader title="📦 Finished Goods — STOCK IN" />

        <OutputSummaryCard
          product={getProduct(recipe.outputProductId)}
          qty={outputQty}
          unit={recipe.expectedOutput.unit}
        />
      </div>

      {/* BY PRODUCTS */}
      {byProducts.length > 0 && (
        <div style={styles.card}>
          <SectionHeader title="♻ By-Products / Recovered Material" />

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>By-Product</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Ledger Entry</th>
              </tr>
            </thead>
            <tbody>
              {byProducts.map((b, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>{getProduct(b.productId)?.name}</td>
                  <td style={{ ...styles.td, ...styles.in }}>
                    +{b.plannedQty}
                  </td>
                  <td style={styles.td}>
                    <UnitDisplay unit={b.unit} />
                  </td>
                  <td style={styles.td}>BY_PRODUCT_RECEIPT</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LOSS */}
      {lossQty > 0 && (
        <div style={styles.card}>
          <SectionHeader title="⚠ Process Loss / Wastage" />

          <InfoBox>
            This quantity is <strong>expected loss</strong> due to evaporation,
            trimming, dust, moisture or process inefficiency.
          </InfoBox>

          <div
            style={{ fontSize: "16px", fontWeight: "800", color: "#9a3412" }}
          >
            Loss Recorded: {lossQty}{" "}
            <UnitDisplay unit={recipe.expectedOutput.unit} />
          </div>
        </div>
      )}

      {/* YIELD */}
      <div style={styles.card}>
        <SectionHeader title="📊 Yield Efficiency" />
        <YieldIndicator
          inputItems={inputs}
          outputQty={outputQty}
          lossQty={lossQty}
        />
      </div>

      {/* ACTION */}
      <button
        style={styles.btn}
        onClick={() =>
          navigate(
            `/manufacturing/production/new?recipe=${recipe.id}&batch=${multiplier}`,
          )
        }
      >
        Proceed to Production Planning
      </button>
    </div>
  );
}

export default ProductionExplain;
