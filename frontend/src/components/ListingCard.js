import React, { useState } from 'react';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import './ListingCard.css';

const ListingCard = ({ listing }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample image based on room type
  const getImageUrl = () => {
    const images = {
      'Entire home/apt': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500',
      'Private room': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500',
      'Shared room': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500'
    };
    return images[listing.room_type] || images['Entire home/apt'];
  };

  return (
    <div className="listing-card">
      <div className="listing-image-container">
        <img 
          src={getImageUrl()} 
          alt={listing.name}
          className="listing-image"
        />
        <button 
          className="favorite-btn"
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
        >
          {isFavorite ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
        </button>
        {listing.number_of_reviews === 0 && (
          <div className="guest-favorite-badge">Guest Favourite</div>
        )}
      </div>
      
      <div className="listing-info">
        <div className="listing-header">
          <h3 className="listing-location">
            {listing.neighbourhood}, {listing.neighbourhood_group}
          </h3>
          {listing.number_of_reviews > 0 && (
            <div className="listing-rating">
              <FaStar className="star-icon" />
              <span>{listing.reviews_per_month ? (4 + listing.reviews_per_month).toFixed(2) : '4.85'}</span>
            </div>
          )}
        </div>
        
        <p className="listing-type">{listing.room_type}</p>
        <p className="listing-host">Hosted by {listing.host_name}</p>
        
        <div className="listing-price">
          <span className="price">${listing.price}</span>
          <span className="period"> night</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;