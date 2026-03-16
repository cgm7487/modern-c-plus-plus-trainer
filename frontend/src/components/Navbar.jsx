import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, BookOpen, Code } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <Cpu size={24} />
        <span>Modern C++ Trainer</span>
      </Link>
      <div className="navbar-links">
        <Link
          to="/"
          className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <BookOpen size={16} />
          <span>學習主題</span>
        </Link>
        <a
          href="https://en.cppreference.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-link"
        >
          <Code size={16} />
          <span>參考文件</span>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
