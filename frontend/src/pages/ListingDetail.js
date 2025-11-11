import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// 'FaUserFriends' has been removed to fix the 'no-unused-vars' warning
import { FaStar, FaMapMarkerAlt, FaBed, FaHome } from 'react-icons/fa';
import './ListingDetail.css';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We move fetchListing INSIDE useEffect to fix the dependency warning
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/api/listings/${id}`);
        setListing(response.data.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]); // Now the hook correctly only depends on 'id'

  const getImageUrl = () => {
    if (!listing) return '';
    const images = {
      'Entire home/apt': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'Private room': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
      'Shared room': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'
    };
    return images[listing.room_type] || images['Entire home/apt'];
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!listing) {
    return <div className="error">Listing not found</div>;
  }

  return (
    <div className="listing-detail">
      <div className="container">
        {/* Header */}
        <div className="listing-detail-header">
          <h1>{listing.name}</h1>
          <div className="listing-detail-meta">
            <FaStar className="star-icon" />
            <span className="rating">{(4 + (listing.reviews_per_month || 0)).toFixed(2)}</span>
            <span className="reviews">· {listing.number_of_reviews} reviews</span>
            <span className="location">· {listing.neighbourhood}, {listing.neighbourhood_group}</span>
          </div>
        </div>

        {/* Images */}
        <div className="listing-images">
          <div className="main-image">
            <img src={getImageUrl()} alt={listing.name} />
          </div>
        </div>

        {/* Content */}
        <div className="listing-content">
          <div className="listing-main">
            {/* Host Info */}
            <div className="host-section">
              <div>
                <h2>{listing.room_type} hosted by {listing.host_name}</h2>
                {/* This is the line that was broken */}
                <p className="host-details">
                  Minimum {listing.minimum_nights} night{listing.minimum_nights > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <hr />

            {/* Features */}
            <div className="features-section">
              <div className="feature-item">
                <FaHome className="feature-icon" />
                <div>
                  <h3>{listing.room_type}</h3>
                  <p>You'll have the space to yourself</p>
                </div>
              </div>
              <div className="feature-item">
                <FaMapMarkerAlt className="feature-icon" />
                <div>
                  <h3>Great location</h3>
                  <p>{listing.neighbourhood}, {listing.neighbourhood_group}</p>
                </div>
              </div>
              <div className="feature-item">
                <FaBed className="feature-icon" />
                <div>
                  <h3>Available {listing.availability_365} days</h3>
                  <p>Book your stay anytime</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Description */}
            <div className="description-section">
              <h2>About this place</h2>
              <p>
                Welcome to this beautiful {listing.room_type.toLowerCase()} in {listing.neighbourhood}.
                Experience the charm of {listing.neighbourhood_group} with all the modern amenities you need.
                Perfect for travelers looking for comfort and convenience.
              </p>
            </div>

            <hr />

            {/* Reviews Summary */}
            <div className="reviews-section">
              <h2>
                <FaStar className="star-icon" />
                {(4 + (listing.reviews_per_month || 0)).toFixed(2)} · {listing.number_of_reviews} reviews
              </h2>
              {listing.number_of_reviews > 0 && (
                <p className="reviews-summary">
                  Guests love staying here! Average {listing.reviews_per_month} reviews per month.
                </p>
              )}
            </div>

            <hr />

            {/* Location */}
            <div className="location-section">
              <h2>Where you'll be</h2>
              <p>{listing.neighbourhood}, {listing.neighbourhood_group}</p>
              <p className="coordinates">
                Coordinates: {listing.latitude.toFixed(5)}, {listing.longitude.toFixed(5)}
              </p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="booking-card-header">
                <div className="price-section">
                  <span className="price">${listing.price}</span>
                  <span className="period"> night</span>
                </div>
                <div className="rating-small">
                  <FaStar className="star-icon" />
                  <span>{(4 + (listing.reviews_per_month || 0)).toFixed(2)}</span>
                  <span className="reviews-count">({listing.number_of_reviews})</span>
                </div>
              </div>

              <button
                className="btn-primary reserve-btn"
                onClick={() => navigate(`/booking/${listing.id}`)}
              >
                Reserve
              </button>

              <p className="no-charge">You won't be charged yet</p>

              <div className="booking-details">
                <div className="detail-row">
                  <span>Minimum nights</span>
                  <span>{listing.minimum_nights}</span>
                </div>
                <div className="detail-row">
                  <span>Availability</span>
                  <span>{listing.availability_365} days/year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;