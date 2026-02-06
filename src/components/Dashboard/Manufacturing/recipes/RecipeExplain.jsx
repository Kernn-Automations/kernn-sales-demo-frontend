// RecipeExplain.jsx
import React from "react";

/**
 * RecipeExplain
 *
 * This page explains what a Manufacturing Recipe really means
 * in industrial terms.
 *
 * It is intentionally verbose and strict because:
 * - Manufacturing is irreversible
 * - Stock movements must be auditable
 * - Output can NEVER exceed input unless explicitly added
 */

function RecipeExplain() {
  const styles = {
    page: {
      padding: "30px 40px",
      background: "#f8fafc",
      minHeight: "100vh",
      lineHeight: "1.65",
    },
    header: {
      fontSize: "26px",
      fontWeight: "800",
      marginBottom: "10px",
    },
    subHeader: {
      color: "#475569",
      maxWidth: "900px",
      marginBottom: "30px",
    },
    section: {
      background: "#ffffff",
      borderRadius: "16px",
      padding: "26px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      marginBottom: "30px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "800",
      marginBottom: "12px",
    },
    text: {
      fontSize: "14px",
      color: "#334155",
      maxWidth: "950px",
    },
    highlight: {
      background: "#f1f5f9",
      borderRadius: "12px",
      padding: "16px",
      marginTop: "14px",
      fontSize: "14px",
      fontWeight: "600",
    },
    warning: {
      background: "#fff7ed",
      borderLeft: "5px solid #f97316",
      padding: "16px",
      borderRadius: "10px",
      marginTop: "14px",
      fontSize: "14px",
      fontWeight: "600",
    },
    rule: {
      background: "#ecfeff",
      borderLeft: "5px solid #06b6d4",
      padding: "16px",
      borderRadius: "10px",
      marginTop: "14px",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>📘 Manufacturing Recipes — Explained</div>
      <div style={styles.subHeader}>
        A manufacturing recipe is not a formula or a suggestion. It is a
        **contractual definition of material transformation**.
      </div>

      {/* WHAT IS A RECIPE */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>What is a Manufacturing Recipe?</div>
        <div style={styles.text}>
          A recipe defines how **input materials** are converted into **finished
          goods**, **by-products**, and **process loss**.
          <br />
          <br />
          It establishes a **mass balance rule**:
        </div>

        <div style={styles.highlight}>
          Total Input Quantity = Finished Goods + By-Products + Process Loss
        </div>
      </div>

      {/* INPUT MATERIALS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Raw Material Inputs</div>
        <div style={styles.text}>
          Each recipe can have multiple input materials.
          <br />
          Inputs are defined with:
          <br />• Quantity
          <br />• Unit of Measure
          <br />• Conversion rules (kg ↔ g, L ↔ ml, etc.)
        </div>

        <div style={styles.rule}>
          Example:
          <br />
          10 kg Active Chemical + 5 kg Solvent = 14 kg Finished Product + 1 kg
          Process Loss
        </div>
      </div>

      {/* OUTPUT */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Finished Goods Output</div>
        <div style={styles.text}>
          The primary output is the main sellable product.
          <br />
          Output quantity is always expressed in a **base unit**.
        </div>

        <div style={styles.warning}>
          ❗ Output quantity can NEVER exceed total input quantity unless
          explicitly mixed with an additional material.
        </div>
      </div>

      {/* BY PRODUCTS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>By-Products & Scrap</div>
        <div style={styles.text}>
          By-products are unavoidable outputs of manufacturing.
          <br />
          They can be:
          <br />• Waste (discarded)
          <br />• Scrap (sold)
          <br />• Reusable input for another recipe
        </div>

        <div style={styles.highlight}>
          Example:
          <br />
          Steel cutting → Scrap steel
          <br />
          Milk processing → Whey
          <br />
          Chemical reaction → Residue
        </div>
      </div>

      {/* PROCESS LOSS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Process Loss</div>
        <div style={styles.text}>
          Process loss represents evaporation, spillage, heat loss, chemical
          loss, or inefficiencies.
          <br />
          It is always:
          <br />• Explicit
          <br />• Measurable
          <br />• Auditable
        </div>

        <div style={styles.warning}>
          Loss is NOT optional. If it exists physically, it must exist in
          records.
        </div>
      </div>

      {/* WHY THIS MATTERS */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Why Recipes Must Be Strict</div>
        <div style={styles.text}>
          • Prevents stock manipulation
          <br />
          • Ensures accurate costing
          <br />
          • Enables yield analysis
          <br />
          • Supports audits and compliance
          <br />• Works across industries without customization
        </div>
      </div>
    </div>
  );
}

export default RecipeExplain;
