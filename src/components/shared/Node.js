import React from 'react';
import { motion } from 'framer-motion';

const Node = ({ children, isHighlighted = false, className = '' }) => {
  const highlightClass = isHighlighted ? 'bg-primary ring-4 ring-primary/50 shadow-lg scale-110' : 'bg-secondary';

  return (
    <motion.div
      className={`
        w-16 h-16 flex items-center justify-center rounded-full text-lg font-bold
        transition-all duration-300 ease-in-out
        ${highlightClass}
        ${className}
      `}
      layout
    >
      {children}
    </motion.div>
  );
};

export default Node;
