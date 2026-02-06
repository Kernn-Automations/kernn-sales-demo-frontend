import React from "react";

/**
 * InfoBox
 * --------------------
 * Contextual information container used across the Manufacturing module.
 *
 * Use cases:
 * - Explain what a screen/section does (demo context)
 * - Highlight business rules
 * - Warn about irreversible actions
 * - Show assumptions (since backend is not wired yet)
 *
 * Props:
 * - type    : "info" | "warning" | "success" | "danger"
 * - title   : Short heading
 * - children: Detailed explanation / content
 */
function InfoBox({ type = "info", title, children }) {
  const palette = {
    info: {
      bg: "#eff6ff",
      border: "#3b82f6",
      text: "#1e3a8a",
    },
    warning: {
      bg: "#fffbeb",
      border: "#f59e0b",
      text: "#92400e",
    },
    success: {
      bg: "#ecfdf5",
      border: "#16a34a",
      text: "#065f46",
    },
    danger: {
      bg: "#fef2f2",
      border: "#dc2626",
      text: "#7f1d1d",
    },
  };

  const styles = {
    wrapper: {
      background: palette[type].bg,
      borderLeft: `4px solid ${palette[type].border}`,
      padding: "14px 16px",
      borderRadius: "8px",
      marginBottom: "16px",
    },
    title: {
      fontSize: "14px",
      fontWeight: "700",
      color: palette[type].text,
      marginBottom: "6px",
    },
    content: {
      fontSize: "13px",
      color: "#374151",
      lineHeight: "1.6",
    },
  };

  return (
    <div style={styles.wrapper}>
      {title && <div style={styles.title}>{title}</div>}
      <div style={styles.content}>{children}</div>
    </div>
  );
}

export default InfoBox;
