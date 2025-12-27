import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  // State for zoom percentage display
  const [zoomPercent, setZoomPercent] = useState(100);

  // Motion values for smooth transitions
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Springs for smooth movement
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });

  const ZOOM_SPEED = 0.001;
  const MIN_SCALE = 0.05;
  const MAX_SCALE = 2;

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const delta = -e.deltaY;
    const factor = Math.exp(delta * ZOOM_SPEED);
    let newScale = scale.get() * factor;
    
    // Clamp scale
    newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    
    scale.set(newScale);
    setZoomPercent(Math.round(newScale * 100));
  }, [scale]);

  const resetView = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    
    // Measure natural natural size (unscaled)
    const naturalWidth = contentRef.current.scrollWidth;
    const naturalHeight = contentRef.current.scrollHeight;

    const scaleX = (container.width * 0.9) / naturalWidth;
    const scaleY = (container.height * 0.9) / naturalHeight;
    const newScale = Math.min(scaleX, scaleY, 0.8); // Fit to 90% of screen, max 80% zoom

    scale.set(newScale);
    x.set(0);
    y.set(0);
    setZoomPercent(Math.round(newScale * 100));
  }, [x, y, scale]);

  // Initial fit to screen
  useEffect(() => {
    if (data && data.length > 0) {
      // Give DOM time to render
      const timer = setTimeout(resetView, 300);
      return () => clearTimeout(timer);
    }
  }, [data, resetView]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No organization data available</p>
      </div>
    );
  }

  return (
    <div 
      className={styles.organizationTree} 
      ref={containerRef}
      onWheel={handleWheel}
    >
      <div className={styles.instructions}>
        Zoom: Mouse Wheel | Pan: Click & Drag
      </div>

      <div className={styles.treeViewport}>
        <motion.div 
          className={styles.treeContainer}
          ref={contentRef}
          drag
          dragMomentum={true}
          style={{ x, y, scale }}
          onDragEnd={(e, info) => {
             // Framer motion updates x/y motion values automatically!
          }}
        >
          {data.map((rootNode, index) => (
            <TreeNode 
              key={rootNode.id || rootNode.employeeId || index} 
              node={rootNode} 
              level={0}
              branchIndex={index}
              onNodeClick={onNodeClick}
            />
          ))}
        </motion.div>
      </div>

      {/* Zoom Controls */}
      <div className={styles.zoomControls}>
        <button 
          className={styles.zoomBtn} 
          onClick={() => {
            const newScale = Math.min(scale.get() + 0.1, MAX_SCALE);
            scale.set(newScale);
            setZoomPercent(Math.round(newScale * 100));
          }}
          title="Zoom In"
        >+</button>
        <button 
          className={styles.zoomBtn} 
          onClick={() => {
            const newScale = Math.max(scale.get() - 0.1, MIN_SCALE);
            scale.set(newScale);
            setZoomPercent(Math.round(newScale * 100));
          }}
          title="Zoom Out"
        >-</button>
        <div className={styles.zoomPercentage}>{zoomPercent}%</div>
        <button className={styles.resetBtn} onClick={resetView}>Fit to Screen</button>
      </div>
    </div>
  );
};

export default OrganizationTree;

