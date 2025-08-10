import React from 'react';
import Rate from '../shared/Rate';

const Footer = () => {
  return (
    <footer className="bg-surface/50 border-t border-secondary mt-auto py-4">
      <div className="container mx-auto text-center text-sm text-gray-400">
        <p>
          DSA Visualizer &copy; {new Date().getFullYear()}. Built by Costas Pinto and with React & Tailwind CSS.
        </p>
        <Rate />
      </div>
    </footer>
  );
};

export default Footer;
