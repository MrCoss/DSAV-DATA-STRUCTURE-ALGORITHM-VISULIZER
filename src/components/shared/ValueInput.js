import React from 'react';

const ValueInput = ({ value, onChange, placeholder, type = 'text', className = '' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        bg-background border-2 border-secondary rounded-lg px-4 py-2
        text-text placeholder-gray-500 w-32
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        transition-all duration-300
        ${className}
      `}
      autoComplete="off"
    />
  );
};

export default ValueInput;
