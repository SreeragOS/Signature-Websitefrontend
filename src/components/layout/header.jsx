
import React from 'react';
import './header.css';

function Header() {
  return (
    <header className="hero-header w-full mx-auto">
      <img
        src="/pic4.jpg"
        alt="Hero"
        className="hero-image"
      />
      {/* Overlay removed as per user request */}
    </header>
  );
}

export default Header;
