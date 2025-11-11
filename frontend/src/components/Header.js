import React from 'react';
import { Link } from 'react-router-dom';
import { FaAirbnb, FaUserCircle, FaBars, FaGlobe } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <FaAirbnb className="logo-icon" />
          <span className="logo-text">JD</span>
        </Link>

        {/* Right Side */}
        <div className="header-right">
          <Link to="/" className="header-link">JD your home</Link>
          <button className="globe-btn">
            <FaGlobe />
          </button>
          <div className="user-menu">
            <FaBars className="menu-icon" />
            <FaUserCircle className="user-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;