import React from 'react';
import { motion } from 'framer-motion';

const SvgArrow = ({ from, to }) => {
  if (!from || !to) return null;

  // Calculate the control point for a slight curve
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const ctrlX = midX;
  const ctrlY = midY - 30; // Adjust this value for more/less curve

  // Offset the start and end points to not overlap the nodes
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const startOffset = { x: from.x + 32 * Math.cos(angle), y: from.y + 32 * Math.sin(angle) };
  const endOffset = { x: to.x - 40 * Math.cos(angle), y: to.y - 40 * Math.sin(angle) };

  return (
    <motion.path
      d={`M ${startOffset.x} ${startOffset.y} Q ${ctrlX} ${ctrlY} ${endOffset.x} ${endOffset.y}`}
      stroke="url(#arrow-gradient)"
      strokeWidth="3"
      fill="none"
      markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      exit={{ pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
};

export default SvgArrow;
