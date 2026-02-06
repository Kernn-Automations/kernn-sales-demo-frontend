// ProductionCreate.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

import SectionHeader from "../components/common/SectionHeader";
import InfoBox from "../components/common/InfoBox";
import MaterialSelector from "../components/MaterialSelector";
import OutputSummaryCard from "../components/OutputSummaryCard";
import YieldIndicator from "../components/YieldIndicator";
import UnitDisplay from "../components/UnitDisplay";

/**
 * ProductionCreate
 *
 * This screen PLANS a production batch.
 * Nothing is committed yet.
 *
 * ERP Concepts:
 * - Planned consumption
 * - Planned output
 * - Expected loss
 * - Batch multiplier
 */

function ProductionCreate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { state, createProduction } = useManufacturing();
  const { recipes, products } = state;

  const recipeIdFromUrl = Number(params.get("recipe"));

  const [recipeId, setRecipeId] = useState(recipeIdFromUrl || "");
  const [batchMultiplier, setBatchMultiplier] = useState(1);
  const [remarks, setRemarks] = useState("");

  const recipe = recipeId ? recipes.byId[recipeId] : null;

  const expectedOutputQty =
    typeof recipe?.expectedOutputQty === "number"
      ? recipe.expectedOutputQty
      : recipe?.expectedOutput?.qty || 0;

  const expectedOutputUnit =
    recipe?.expectedOutput?.unit ||
    products.find((p) => p.id === recipe?.outputProductId)?.baseUnit ||
    "";

  /* ----------------------------------------
     CALCULATIONS (pure, deterministic)
  ---------------------------------------- */
  const calculated = useMemo(() => {
    if (!recipe) return null;

    const inputs = recipe.inputs.map((i) => ({
      ...i,
      plannedQty: Number(i.qty) * batchMultiplier,
    }));

    const outputQty = expectedOutputQty * batchMultiplier;

    const lossQty =
      recipe.processLossPercent > 0
        ? Number(((outputQty * recipe.processLossPercent) / 100).toFixed(2))
        : 0;

    return {
      inputs,
      output: {
        productId: recipe.outputProductId,
        qty: outputQty,
        unit: expectedOutputUnit,
      },
      byProducts:
        recipe.byProducts?.map((b) => ({
          ...b,
          plannedQty: Number(b.qty) * batchMultiplier,
        })) || [],
      lossQty,
    };
  }, [recipe, batchMultiplier, expectedOutputQty, expectedOutputUnit]);

  /* ----------------------------------------
     ACTION
  ---------------------------------------- */
  const handleCreateProduction = () => {
    const production = {
      id: Date.now(),
      recipeId: recipe.id,
      batchMultiplier,
      plannedOutput: calculated.output,
      plannedInputs: calculated.inputs,
      plannedByProducts: calculated.byProducts,
      plannedLoss: calculated.lossQty,
      status: "PLANNED",
      remarks,
      timestamps: {
        createdAt: new Date().toISOString(),
      },
    };

    createProduction(production);
    navigate("/manufacturing/production");
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
    fieldRow: {
      display: "flex",
      gap: "16px",
      marginBottom: "16px",
    },
    field: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "12px",
      fontWeight: "700",
      marginBottom: "6px",
      color: "#334155",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #cbd5f5",
      fontSize: "14px",
    },
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #cbd5f5",
      fontSize: "14px",
    },
    textarea: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #cbd5f5",
      fontSize: "14px",
      minHeight: "70px",
    },
    primaryBtn: {
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

  return (
    <div style={styles.page}>
      <SectionHeader
        title="🏭 Plan Production Batch"
        subtitle="Define quantities, materials, yield & loss before execution"
      />

      <InfoBox>
        This screen only <strong>plans</strong> production.
        <br />
        No stock will be consumed until the batch is executed.
      </InfoBox>

      {/* RECIPE SELECTION */}
      <div style={styles.card}>
        <div style={styles.fieldRow}>
          <div style={styles.field}>
            <label style={styles.label}>Manufacturing Recipe</label>
            <select
              style={styles.select}
              value={recipeId}
              onChange={(e) => setRecipeId(Number(e.target.value))}
            >
              <option value="">Select recipe</option>
              {recipes.allIds.map((id) => (
                <option key={id} value={id}>
                  {recipes.byId[id].name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Batch Multiplier</label>
            <input
              type="number"
              min={1}
              style={styles.input}
              value={batchMultiplier}
              onChange={(e) => setBatchMultiplier(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* CALCULATED SECTIONS */}
      {recipe && calculated && (
        <>
          {/* INPUT MATERIALS */}
          <div style={styles.card}>
            <SectionHeader title="🧪 Planned Raw Material Consumption" />
            <MaterialSelector
              materials={calculated.inputs}
              products={products}
              readonly
              showPlanned
            />
          </div>

          {/* OUTPUT */}
          <div style={styles.card}>
            <OutputSummaryCard
              output={{
                finishedGoods: {
                  name: products.find(
                    (p) => p.id === calculated.output.productId,
                  )?.name,
                  qty: calculated.output.qty,
                  unit: calculated.output.unit,
                },
                byProducts: calculated.byProducts?.map((bp) => ({
                  name: products.find((p) => p.id === bp.productId)?.name,
                  qty: bp.plannedQty,
                  unit: bp.unit,
                  reusable: true, // or based on product.type later
                })),
                scrap: [], // future-ready
              }}
            />
          </div>

          {/* YIELD */}
          <div style={styles.card}>
            <YieldIndicator
              expectedQty={expectedOutputQty * batchMultiplier}
              actualQty={calculated.output.qty - calculated.lossQty}
              unit={calculated.output.unit}
            />
          </div>

          {/* REMARKS */}
          <div style={styles.card}>
            <label style={styles.label}>Production Notes / Remarks</label>
            <textarea
              style={styles.textarea}
              placeholder="Operator notes, quality expectations, constraints…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* ACTION */}
          <button style={styles.primaryBtn} onClick={handleCreateProduction}>
            Save Production Plan
          </button>
        </>
      )}
    </div>
  );
}

export default ProductionCreate;
