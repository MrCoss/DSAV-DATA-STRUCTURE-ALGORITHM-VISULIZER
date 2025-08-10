import React from 'react';

const Controls = ({ children }) => {
  return (
    <div className="bg-surface/80 backdrop-blur-sm p-4 mt-8 rounded-xl border border-secondary shadow-lg">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
};

export default Controls;
