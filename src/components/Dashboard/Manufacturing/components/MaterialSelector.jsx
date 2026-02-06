import React from "react";

/**
 * MaterialSelector
 * -------------------------
 * Controlled input list for:
 * - Raw materials (inputs)
 * - By-products / scrap
 *
 * ERP rules:
 * - No duplicate materials
 * - Base unit enforced
 * - Quantity editable
 * - Select value ALWAYS string-safe
 */
function MaterialSelector({
  materials,
  setMaterials,
  products,
  allowedTypes = ["raw"],
  hint,
}) {
  /* ----------------------------------------
     STYLES
  ---------------------------------------- */
  const styles = {
    wrapper: {
      marginTop: "12px",
    },
    hint: {
      fontSize: "12px",
      color: "#6b7280",
      marginBottom: "8px",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr auto",
      gap: "10px",
      marginBottom: "10px",
      alignItems: "center",
    },
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      background: "#ffffff",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
    },
    unitInput: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      fontSize: "14px",
      background: "#f9fafb",
      cursor: "not-allowed",
    },
    button: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "800",
      fontSize: "14px",
    },
    addBtn: {
      background: "#2563eb",
      color: "white",
      marginTop: "10px",
    },
    removeBtn: {
      background: "#ef4444",
      color: "white",
    },
  };

  /* ----------------------------------------
     FILTER PRODUCTS BY TYPE
  ---------------------------------------- */
  const selectableProducts = products.filter((p) =>
    allowedTypes.includes(p.type),
  );

  /* ----------------------------------------
     HELPERS
  ---------------------------------------- */
  const updateRow = (index, patch) => {
    const next = [...materials];
    next[index] = { ...next[index], ...patch };
    setMaterials(next);
  };

  const addRow = () => {
    setMaterials([...materials, { productId: "", qty: "", unit: "" }]);
  };

  const removeRow = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const isDuplicate = (productId, index) =>
    materials.some(
      (m, i) =>
        i !== index &&
        String(m.productId || "") === String(productId || "") &&
        productId !== "",
    );

  /* ----------------------------------------
     RENDER
  ---------------------------------------- */
  return (
    <div style={styles.wrapper}>
      {hint && <div style={styles.hint}>{hint}</div>}

      {materials.map((row, index) => (
        <div key={index} style={styles.row}>
          {/* MATERIAL SELECT */}
          <select
            style={styles.select}
            value={String(row.productId || "")}
            onChange={(e) => {
              const selectedId = e.target.value;

              if (isDuplicate(selectedId, index)) return;

              const selected = selectableProducts.find(
                (p) => String(p.id) === selectedId,
              );

              updateRow(index, {
                productId: selectedId,
                unit: selected?.baseUnit || "",
              });
            }}
          >
            <option value="">Select Material</option>
            {selectableProducts.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>

          {/* QUANTITY */}
          <input
            type="number"
            min="0"
            placeholder="Qty"
            style={styles.input}
            value={row.qty}
            onChange={(e) => updateRow(index, { qty: e.target.value })}
          />

          {/* UNIT (LOCKED) */}
          <input disabled style={styles.unitInput} value={row.unit} />

          {/* REMOVE */}
          <button
            type="button"
            style={{ ...styles.button, ...styles.removeBtn }}
            onClick={() => removeRow(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        style={{ ...styles.button, ...styles.addBtn }}
        onClick={addRow}
      >
        + Add Material
      </button>
    </div>
  );
}

export default MaterialSelector;
