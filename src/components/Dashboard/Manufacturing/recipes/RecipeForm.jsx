import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useManufacturing } from "../context/ManufacturingContext";

import SectionHeader from "../components/common/SectionHeader";
import InfoBox from "../components/common/InfoBox";
import MaterialSelector from "../components/MaterialSelector";

/**
 * RecipeForm
 * -------------------------
 * Defines HOW materials are transformed.
 * Equivalent to BOM / Formula / SOP
 */
function RecipeForm() {
  const navigate = useNavigate();
  const { products, addRecipe } = useManufacturing();

  const [name, setName] = useState("");
  const [outputProductId, setOutputProductId] = useState("");
  const [expectedOutputQty, setExpectedOutputQty] = useState("");

  const normalizeRows = (rows) =>
    rows.map((r) => ({
      productId: r.productId ? String(r.productId) : "",
      qty: r.qty ?? "",
      unit: r.unit ?? "",
    }));

  const [inputs, setInputs] = useState(() =>
    normalizeRows([{ productId: "", qty: "", unit: "" }]),
  );

  const [byProducts, setByProducts] = useState(() => normalizeRows([]));

  const outputProduct = products.find(
    (p) => String(p.id) === String(outputProductId),
  );

  const outputUnit = outputProduct?.baseUnit || "";

  const styles = {
    page: {
      padding: "30px 40px",
      background: "#f8fafc",
      minHeight: "100vh",
    },
    card: {
      background: "#ffffff",
      borderRadius: "18px",
      padding: "28px",
      maxWidth: "1000px",
      margin: "0 auto",
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
    saveBtn: {
      background: "#16a34a",
      color: "white",
      padding: "12px 20px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "800",
      border: "none",
      cursor: "pointer",
      marginTop: "24px",
    },
  };

  const handleSave = () => {
    const recipe = {
      id: Date.now(),
      name,
      outputProductId: Number(outputProductId),
      expectedOutputQty: Number(expectedOutputQty),

      inputs: inputs.map((i) => ({
        productId: Number(i.productId),
        qty: Number(i.qty),
        unit: i.unit,
      })),

      byProducts: byProducts.map((b) => ({
        productId: Number(b.productId),
        qty: Number(b.qty),
        unit: b.unit,
      })),

      isActive: true,
    };

    addRecipe(recipe);
    navigate("/manufacturing/recipes");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <SectionHeader
          title="🧪 Define Manufacturing Recipe"
          subtitle="This recipe controls material consumption, yield and stock posting"
        />

        <InfoBox type="warning">
          Once a recipe is used in production, changes should be versioned.
          Editing active recipes affects audit trails and costing accuracy.
        </InfoBox>

        {/* RECIPE IDENTITY */}
        <SectionHeader title="Recipe Identity" />

        <div style={styles.fieldRow}>
          <div style={styles.field}>
            <label style={styles.label}>Recipe Name</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Industrial Adhesive – Batch A"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Output Product</label>
            <select
              style={styles.select}
              value={outputProductId}
              onChange={(e) => setOutputProductId(e.target.value)}
            >
              <option value="">Select Finished Product</option>
              {products
                .filter((p) => p.type === "finished")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div style={styles.fieldRow}>
          <div style={styles.field}>
            <label style={styles.label}>Expected Output Quantity</label>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* QTY */}
              <input
                type="number"
                style={{ ...styles.input, flex: 2 }}
                value={expectedOutputQty}
                onChange={(e) => setExpectedOutputQty(e.target.value)}
                placeholder="Base batch output"
                disabled={!outputProduct}
              />

              {/* UNIT (AUTO, LOCKED) */}
              <input
                style={{
                  ...styles.input,
                  flex: 1,
                  background: "#f9fafb",
                  cursor: "not-allowed",
                }}
                value={outputUnit}
                disabled
                placeholder="Unit"
              />
            </div>
          </div>
        </div>

        {/* INPUT MATERIALS */}
        <SectionHeader
          title="Raw Materials (Inputs)"
          subtitle="Materials consumed when production starts"
        />

        <MaterialSelector
          materials={inputs}
          setMaterials={setInputs}
          products={products}
          allowedTypes={["raw"]}
          hint="Materials consumed when one base batch is produced"
        />

        {/* BY PRODUCTS */}
        <SectionHeader
          title="By-Products / Scrap"
          subtitle="Secondary outputs, recoverables or waste"
        />

        <MaterialSelector
          materials={byProducts}
          setMaterials={setByProducts}
          products={products}
          allowedTypes={["byproduct", "waste"]}
          hint="Secondary outputs, recoverables or process waste"
        />

        <button style={styles.saveBtn} onClick={handleSave}>
          Save Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeForm;
