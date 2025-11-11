import React, { useState } from 'react';
import { FaFire, FaUmbrellaBeach, FaMountain, FaCity, FaTree, FaHome, FaKey, FaSwimmingPool } from 'react-icons/fa';
import './CategoryFilter.css';

const categories = [
  { id: 'trending', name: 'Trending', icon: FaFire },
  { id: 'beach', name: 'Beach', icon: FaUmbrellaBeach },
  { id: 'camping', name: 'Camping', icon: FaMountain },
  { id: 'ski', name: 'Ski-in/out', icon: FaMountain },
  { id: 'luxe', name: 'Luxe', icon: FaKey },
  { id: 'top-cities', name: 'Top cities', icon: FaCity },
  { id: 'creative', name: 'Creative space', icon: FaTree },
  { id: 'rooms', name: 'Rooms', icon: FaHome },
  { id: 'pools', name: 'Pools', icon: FaSwimmingPool },
];

const CategoryFilter = ({ onFilterChange }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [roomType, setRoomType] = useState('');

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId === activeCategory ? '' : categoryId);
  };

  const handleApplyFilters = () => {
    onFilterChange({
      min_price: priceRange.min,
      max_price: priceRange.max,
      room_type: roomType
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setRoomType('');
    onFilterChange({
      min_price: '',
      max_price: '',
      room_type: ''
    });
  };

  return (
    <div className="category-filter-wrapper">
      <div className="container">
        <div className="category-scroll">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <Icon className="category-icon" />
                <span>{category.name}</span>
              </div>
            );
          })}
        </div>
        
        <button 
          className="filters-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-modal">
          <div className="filters-content">
            <div className="filters-header">
              <h2>Filters</h2>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>
            
            <div className="filter-section">
              <h3>Price range</h3>
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min price</label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                </div>
                <div className="price-input-group">
                  <label>Max price</label>
                  <input
                    type="number"
                    placeholder="$1000+"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3>Room type</h3>
              <select 
                value={roomType} 
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="">Any type</option>
                <option value="Entire home/apt">Entire home/apt</option>
                <option value="Private room">Private room</option>
                <option value="Shared room">Shared room</option>
              </select>
            </div>

            <div className="filters-footer">
              <button className="btn-secondary" onClick={handleClearFilters}>
                Clear all
              </button>
              <button className="btn-primary" onClick={handleApplyFilters}>
                Show stays
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;