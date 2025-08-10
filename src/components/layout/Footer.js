import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface/50 border-t border-secondary mt-auto py-4">
      <div className="container mx-auto text-center text-sm text-gray-400">
        <p>
          DSA Visualizer &copy; {new Date().getFullYear()}. Build by Costas Pinto and Built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
