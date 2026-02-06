import React from "react";

/**
 * SectionHeader
 * --------------------
 * Used to label logical sections within pages.
 *
 * Props:
 * - title        : Section title
 * - description  : Optional helper text
 * - actions      : Optional JSX (buttons, links, etc.)
 */
function SectionHeader({ title, description, actions }) {
  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "14px",
      marginTop: "26px",
    },
    left: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#111827",
    },
    description: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
      maxWidth: "520px",
      lineHeight: "1.5",
    },
    actions: {
      display: "flex",
      gap: "8px",
    },
    divider: {
      marginTop: "10px",
      borderBottom: "1px solid #e5e7eb",
    },
  };

  return (
    <div>
      <div style={styles.wrapper}>
        <div style={styles.left}>
          <div style={styles.title}>{title}</div>
          {description && <div style={styles.description}>{description}</div>}
        </div>

        {actions && <div style={styles.actions}>{actions}</div>}
      </div>

      <div style={styles.divider} />
    </div>
  );
}

export default SectionHeader;
