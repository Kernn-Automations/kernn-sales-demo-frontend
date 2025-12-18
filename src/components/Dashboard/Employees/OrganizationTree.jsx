import React from "react";
import styles from "./OrganizationTree.module.css";

// Color palette for different levels and branches
const LEVEL_COLORS = ['#6b5b4d', '#ff8c42', '#4a90e2', '#50c878'];
const BRANCH_COLORS = ['#ff8c42', '#4a90e2', '#50c878', '#9b59b6', '#e74c3c', '#f39c12'];

// Get initials from name
const getInitials = (name) => {
  if (!name) return "NA";
  const names = name.split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Get color based on level
const getColorForLevel = (level) => {
  if (level === 0) return LEVEL_COLORS[0]; // Top level - dark brown/grey
  return LEVEL_COLORS[(level % 3) + 1]; // Cycle through orange, blue, green
};

// Get branch color
const getBranchColor = (branchIndex) => {
  return BRANCH_COLORS[branchIndex % BRANCH_COLORS.length];
};

// Tree Node Component
const TreeNode = ({ node, level = 0, branchIndex = 0, onNodeClick }) => {
  const children = node.subordinates || node.children || [];
  const hasChildren = children.length > 0;
  const nodeColor = level === 0 ? getColorForLevel(level) : getBranchColor(branchIndex);

  return (
    <div className={styles.treeNode}>
      {/* Node Content */}
      <div className={styles.nodeContainer}>
        <div 
          className={styles.nodeCircle}
          style={{ borderColor: nodeColor, backgroundColor: `${nodeColor}15` }}
          onClick={() => onNodeClick && onNodeClick(node)}
          title={`Click to view details of ${node.name}`}
        >
          <div className={styles.avatar}>
            <div className={styles.avatarIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="#e0d5c7"/>
                <path d="M12 14C8 14 4 16 4 19v1h16v-1c0-3-4-5-8-5z" fill="#e0d5c7"/>
                <circle cx="12" cy="7.5" r="3" fill="#4a4a4a"/>
                <path d="M12 12.5c-2.5 0-5 1.5-5 3.5v1h10v-1c0-2-2.5-3.5-5-3.5z" fill="#4a4a4a"/>
              </svg>
            </div>
            {level < 3 && (
              <div className={styles.avatarInitials} style={{ color: nodeColor }}>
                {getInitials(node.name)}
              </div>
            )}
          </div>
        </div>
        <div className={styles.nodeName}>
          {node.name || node.employeeName || `Employee ${node.employeeId || node.id}`}
        </div>
        {node.role && (
          <div className={styles.nodeRole} style={{ color: nodeColor }}>
            {node.role}
          </div>
        )}
        {node.subordinateCount > 0 && (
          <div className={styles.subordinateCount}>
            {node.subordinateCount} {node.subordinateCount === 1 ? 'direct report' : 'direct reports'}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <div className={styles.childrenContainer}>
          <div className={styles.verticalLine} style={{ backgroundColor: nodeColor }}></div>
          <div className={styles.horizontalLine} style={{ backgroundColor: nodeColor }}></div>
          <div className={styles.children}>
            {children.map((child, index) => (
              <div key={child.id || child.employeeId || index} className={styles.childWrapper}>
                <div className={styles.childConnector} style={{ backgroundColor: nodeColor }}></div>
                <TreeNode 
                  node={child} 
                  level={level + 1} 
                  branchIndex={level === 0 ? index : branchIndex}
                  onNodeClick={onNodeClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Organization Tree Component
const OrganizationTree = ({ data, onNodeClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No organization data available</p>
      </div>
    );
  }

  return (
    <div className={styles.organizationTree}>
      <div className={styles.treeContainer}>
        {data.map((rootNode, index) => (
          <TreeNode 
            key={rootNode.id || rootNode.employeeId || index} 
            node={rootNode} 
            level={0}
            branchIndex={index}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationTree;

