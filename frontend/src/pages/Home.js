import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ListingCard from '../components/ListingCard';
import './Home.css';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    neighbourhood: '',
    room_type: '',
    min_price: '',
    max_price: '',
    search: ''
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/listings?${params.toString()}`);
      setListings(response.data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="home">
      <SearchBar onSearch={handleFilterChange} />
      <CategoryFilter onFilterChange={handleFilterChange} />
      
      <div className="container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="listings-header">
              <h2>{listings.length} stays found</h2>
            </div>
            <div className="listings-grid">
              {listings.map((listing) => (
                <Link 
                  key={listing._id} 
                  to={`/listing/${listing.id}`}
                  className="listing-link"
                >
                  <ListingCard listing={listing} />
                </Link>
              ))}
            </div>
            {listings.length === 0 && (
              <div className="no-results">
                <p>No listings found. Try adjusting your filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;