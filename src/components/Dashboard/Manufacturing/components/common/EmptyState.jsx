import React from "react";

/**
 * EmptyState
 * --------------------
 * Shown when a list or section has no data.
 *
 * Props:
 * - title       : Short heading
 * - description : Explanation of why it's empty
 * - actionLabel : Optional CTA button text
 * - onAction    : Optional CTA handler
 */
function EmptyState({ title, description, actionLabel, onAction }) {
  const styles = {
    wrapper: {
      background: "#f9fafb",
      border: "1px dashed #d1d5db",
      borderRadius: "12px",
      padding: "30px",
      textAlign: "center",
      marginTop: "20px",
    },
    title: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
    },
    description: {
      fontSize: "13px",
      color: "#6b7280",
      maxWidth: "420px",
      margin: "0 auto 16px",
      lineHeight: "1.6",
    },
    button: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>{title}</div>
      <div style={styles.description}>{description}</div>

      {actionLabel && onAction && (
        <button style={styles.button} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
