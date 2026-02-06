// ProductionExecute.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

import SectionHeader from "../components/common/SectionHeader";
import InfoBox from "../components/common/InfoBox";
import UnitDisplay from "../components/UnitDisplay";
import OutputSummaryCard from "../components/OutputSummaryCard";
import YieldIndicator from "../components/YieldIndicator";
import BatchStatusBadge from "../components/BatchStatusBadge";

/**
 * ProductionExecute
 *
 * FINAL execution screen.
 * This commits irreversible stock movements.
 */

function ProductionExecute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { state, startProduction, completeProduction, addStockTransaction } =
    useManufacturing();

  const batch = state.productions.byId[Number(id)];
  if (!batch) return <div style={{ padding: 40 }}>Batch not found.</div>;

  const recipe = state.recipes.byId[batch.recipeId];
  const product = state.products.find((p) => p.id === recipe.outputProductId);

  const [actualOutput, setActualOutput] = useState(batch.plannedOutput.qty);
  const [remarks, setRemarks] = useState("");

  const plannedQty = batch.plannedOutput.qty;
  const unit = batch.plannedOutput.unit;
  const lossQty = Math.max(plannedQty - actualOutput, 0);

  /* ----------------------------------------
     EXECUTION LOGIC
  ---------------------------------------- */
  const executeBatch = () => {
    startProduction(batch.id);

    // RAW MATERIAL ISSUE
    // RAW MATERIAL CONSUMPTION (MULTIPLIED)
    batch.plannedInputs.forEach((i) => {
      addStockTransaction({
        type: "ISSUE",
        productId: i.productId,
        qty: i.plannedQty, // ✅ multiplied qty
        unit: i.unit,
        reference: `PROD-${batch.id}`,
      });
    });

    // FINISHED GOODS RECEIPT
    addStockTransaction({
      type: "RECEIPT",
      productId: recipe.outputProductId,
      qty: actualOutput,
      unit,
      reference: `PROD-${batch.id}`,
    });

    // BY-PRODUCTS
    recipe.byProducts?.forEach((b) => {
      addStockTransaction({
        type: "BY_PRODUCT",
        productId: b.productId,
        qty: b.qty,
        unit: b.unit,
        reference: `PROD-${batch.id}`,
      });
    });

    // PROCESS LOSS
    if (lossQty > 0) {
      addStockTransaction({
        type: "LOSS",
        productId: recipe.outputProductId,
        qty: lossQty,
        unit,
        reference: `PROD-${batch.id}`,
        remarks,
      });
    }

    completeProduction(batch.id, {
      output: actualOutput,
      loss: lossQty,
      remarks,
    });

    navigate(`/manufacturing/production/${batch.id}`);
  };

  /* ----------------------------------------
     STYLES
  ---------------------------------------- */
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
    row: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px dashed #e2e8f0",
    },
    label: {
      fontWeight: "700",
      color: "#475569",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #cbd5f5",
      width: "140px",
      fontWeight: "700",
    },
    textarea: {
      width: "100%",
      minHeight: "80px",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5f5",
      marginTop: "10px",
    },
    btn: {
      background: "#dc2626",
      color: "white",
      padding: "14px 26px",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "900",
      border: "none",
      cursor: "pointer",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.page}>
      <SectionHeader
        title={`⚙ Execute Production Batch #${batch.id}`}
        subtitle="Confirm actual output and commit irreversible stock movements"
      />

      <BatchStatusBadge status={batch.status} />

      <InfoBox type="warning">
        This action will permanently affect stock balances and cannot be undone.
      </InfoBox>

      {/* BASIC INFO */}
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Recipe</span>
          <span>{recipe.name}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Planned Output</span>
          <UnitDisplay value={plannedQty} unit={unit} />
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Actual Output</span>
          <span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="number"
              min={0}
              style={styles.input}
              value={actualOutput}
              onChange={(e) => setActualOutput(Number(e.target.value))}
            />
            {unit}
          </span>
        </div>
      </div>

      {/* YIELD */}
      <div style={styles.card}>
        <YieldIndicator
          expectedQty={plannedQty}
          actualQty={actualOutput}
          unit={unit}
        />
      </div>

      {/* OUTPUT SUMMARY */}
      <div style={styles.card}>
        <OutputSummaryCard
          output={{
            finishedGoods: {
              name: product?.name,
              qty: actualOutput,
              unit,
            },

            byProducts:
              recipe.byProducts?.map((b) => ({
                name: state.products.find((p) => p.id === b.productId)?.name,
                qty: b.qty,
                unit: b.unit,
                reusable: true,
              })) || [],

            scrap:
              lossQty > 0
                ? [
                    {
                      name: "Process Loss",
                      qty: lossQty,
                      unit,
                    },
                  ]
                : [],
          }}
        />
      </div>

      {/* REMARKS */}
      <div style={styles.card}>
        <div style={styles.label}>Execution Remarks (Optional)</div>
        <textarea
          style={styles.textarea}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Explain deviations, losses, quality notes…"
        />
      </div>

      {/* ACTION */}
      <button style={styles.btn} onClick={executeBatch}>
        🔒 FINALIZE & POST STOCK
      </button>
    </div>
  );
}

export default ProductionExecute;
