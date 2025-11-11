import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: searchTerm });
  };

  return (
    <div className="search-bar-wrapper">
      <div className="container">
        <form className="search-bar" onSubmit={handleSubmit}>
          <div className="search-section">
            <label>Where</label>
            <input
              type="text"
              placeholder="Search destinations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-section">
            <label>Check in</label>
            <input type="text" placeholder="Add dates" readOnly />
          </div>
          <div className="search-section">
            <label>Check out</label>
            <input type="text" placeholder="Add dates" readOnly />
          </div>
          <div className="search-section">
            <label>Who</label>
            <input type="text" placeholder="Add guests" readOnly />
          </div>
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;