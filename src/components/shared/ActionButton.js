import React from 'react';
import { motion } from 'framer-motion';

const ActionButton = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold 
        text-white shadow-md transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
        ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-opacity-80 focus:ring-primary'}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default ActionButton;
