// ProductionView.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

import SectionHeader from "../components/common/SectionHeader";
import InfoBox from "../components/common/InfoBox";
import BatchStatusBadge from "../components/BatchStatusBadge";
import UnitDisplay from "../components/UnitDisplay";
import YieldIndicator from "../components/YieldIndicator";
import OutputSummaryCard from "../components/OutputSummaryCard";

/**
 * ProductionView
 *
 * Immutable audit view.
 * Shows EXACTLY what happened in a batch.
 */

function ProductionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useManufacturing();

  const batch = state.productions.byId[Number(id)];
  if (!batch) return <div style={{ padding: 40 }}>Batch not found.</div>;

  const recipe = state.recipes.byId[batch.recipeId];
  const product = state.products.find((p) => p.id === recipe.outputProductId);

  const ledgerEntries = state.stockLedger.entries.filter(
    (e) => e.reference === `PROD-${batch.id}`,
  );

  const plannedQty = batch.plannedOutput.qty;
  const actualQty = batch.actuals?.output || 0;
  const lossQty = batch.actuals?.loss || 0;

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
      padding: "8px 0",
      borderBottom: "1px dashed #e2e8f0",
    },
    label: {
      fontWeight: "700",
      color: "#475569",
    },
    value: {
      fontWeight: "800",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    th: {
      background: "#f1f5f9",
      padding: "10px",
      fontSize: "13px",
      fontWeight: "800",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
    },
    backBtn: {
      background: "#e5e7eb",
      border: "none",
      padding: "10px 16px",
      borderRadius: "10px",
      fontWeight: "700",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <SectionHeader
        title={`📦 Production Batch #${batch.id}`}
        subtitle="Manufacturing execution audit & stock traceability"
        action={
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        }
      />

      <BatchStatusBadge status={batch.status} />

      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Recipe Used</span>
          <span style={styles.value}>{recipe.name}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Started At</span>
          <span>{batch.timestamps?.startedAt || "—"}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Completed At</span>
          <span>{batch.timestamps?.completedAt || "—"}</span>
        </div>
      </div>

      {/* YIELD */}
      <div style={styles.card}>
        <YieldIndicator
          expectedQty={plannedQty}
          actualQty={actualQty}
          unit={batch.plannedOutput.unit}
        />
      </div>

      {/* OUTPUT SUMMARY */}
      <div style={styles.card}>
        <OutputSummaryCard
          output={{
            finishedGoods: {
              name: product?.name,
              qty: actualQty,
              unit: batch.plannedOutput.unit,
            },
            byProducts:
              batch.actuals?.byProducts?.map((bp) => ({
                name: state.products.find((p) => p.id === bp.productId)?.name,
                qty: bp.qty,
                unit: bp.unit,
                reusable: true, // can be derived later
              })) || [],
            scrap:
              lossQty > 0
                ? [
                    {
                      name: "Process Loss",
                      qty: lossQty,
                      unit: batch.plannedOutput.unit,
                    },
                  ]
                : [],
          }}
        />
      </div>

      {batch.actuals?.remarks && (
        <InfoBox type="info">
          <strong>Execution Remarks:</strong>
          <br />
          {batch.actuals.remarks}
        </InfoBox>
      )}

      {/* STOCK LEDGER */}
      <div style={styles.card}>
        <div style={{ fontWeight: "900", marginBottom: "10px" }}>
          📜 Stock Ledger Impact
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Transaction</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((e, idx) => {
              const prod = state.products.find((p) => p.id === e.productId);
              return (
                <tr key={idx}>
                  <td style={styles.td}>{e.type}</td>
                  <td style={styles.td}>{prod?.name}</td>
                  <td style={styles.td}>{e.qty}</td>
                  <td style={styles.td}>{e.unit || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <InfoBox type="warning">
        This batch record is immutable and retained for compliance, audit, and
        regulatory purposes.
      </InfoBox>
    </div>
  );
}

export default ProductionView;
