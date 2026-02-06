import React from "react";

/**
 * BatchStatusBadge
 * -------------------------
 * Displays standardized production batch status.
 *
 * Props:
 * - status : string
 */
function BatchStatusBadge({ status }) {
  const STATUS_MAP = {
    DRAFT: {
      label: "Draft",
      bg: "#f3f4f6",
      color: "#374151",
    },
    IN_PROGRESS: {
      label: "In Progress",
      bg: "#eff6ff",
      color: "#1d4ed8",
    },
    COMPLETED: {
      label: "Completed",
      bg: "#ecfdf5",
      color: "#047857",
    },
    CANCELLED: {
      label: "Cancelled",
      bg: "#fef2f2",
      color: "#b91c1c",
    },
    ON_HOLD: {
      label: "On Hold",
      bg: "#fff7ed",
      color: "#c2410c",
    },
  };

  const config = STATUS_MAP[status] || {
    label: "Unknown",
    bg: "#e5e7eb",
    color: "#374151",
  };

  const styles = {
    badge: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.03em",
      backgroundColor: config.bg,
      color: config.color,
      textTransform: "uppercase",
      lineHeight: "1",
      whiteSpace: "nowrap",
    },
  };

  return <span style={styles.badge}>{config.label}</span>;
}

export default BatchStatusBadge;
