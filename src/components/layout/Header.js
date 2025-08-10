import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-text hover:bg-surface'
    }`;

  return (
    <header className="bg-surface/80 backdrop-blur-sm sticky top-0 z-50 border-b border-secondary">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="DSAV Logo" className="h-10" />
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <NavLink to="/array" className={navLinkClass}>
              Array
            </NavLink>
            <NavLink to="/stack" className={navLinkClass}>
              Stack
            </NavLink>
            <NavLink to="/queue" className={navLinkClass}>
              Queue
            </NavLink>
            <NavLink to="/linked-list" className={navLinkClass}>
              Linked List
            </NavLink>
             <NavLink to="/bst" className={navLinkClass}>
              BST
            </NavLink>
             <NavLink to="/graph" className={navLinkClass}>
              Graph
            </NavLink>
             <NavLink to="/sorting" className={navLinkClass}>
              Sorting
            </NavLink>
            <NavLink to="/hash-table" className={navLinkClass}>
              Hash Table
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
