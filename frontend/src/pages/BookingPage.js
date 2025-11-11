import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
    guestName: '',
    guestEmail: ''
  });

  const [error, setError] = useState('');
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    calculatePrice();
  }, [formData.checkIn, formData.checkOut, listing]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}`);
      setListing(response.data.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (formData.checkIn && formData.checkOut && listing) {
      const nights = Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24));
      setTotalNights(nights);
      setTotalPrice(nights * listing.price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (!formData.guestName || !formData.guestEmail) {
      setError('Please fill in all guest details');
      return;
    }

    if (totalNights < listing.minimum_nights) {
      setError(`Minimum stay is ${listing.minimum_nights} night(s)`);
      return;
    }

    try {
      setSubmitting(true);
      const bookingData = {
        listing_id: listing.id,
        check_in: formData.checkIn.toISOString().split('T')[0],
        check_out: formData.checkOut.toISOString().split('T')[0],
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guests: formData.guests
      };

      const response = await axios.post('/api/bookings', bookingData);
      
      if (response.data.success) {
        navigate(`/confirmation/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
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
    <div className="booking-page">
      <div className="container">
        <div className="booking-content">
          {/* Back Button */}
          <button 
            className="back-btn"
            onClick={() => navigate(`/listing/${id}`)}
          >
            ← Back to listing
          </button>

          <h1>Request to book</h1>

          <div className="booking-layout">
            {/* Booking Form */}
            <div className="booking-form-section">
              <form onSubmit={handleSubmit}>
                {/* Dates */}
                <div className="form-section">
                  <h2>Your trip</h2>
                  
                  <div className="date-inputs">
                    <div className="date-input-group">
                      <label>Check-in</label>
                      <DatePicker
                        selected={formData.checkIn}
                        onChange={(date) => setFormData({ ...formData, checkIn: date })}
                        minDate={new Date()}
                        placeholderText="Add date"
                        dateFormat="MMM d, yyyy"
                      />
                    </div>

                    <div className="date-input-group">
                      <label>Check-out</label>
                      <DatePicker
                        selected={formData.checkOut}
                        onChange={(date) => setFormData({ ...formData, checkOut: date })}
                        minDate={formData.checkIn || new Date()}
                        placeholderText="Add date"
                        dateFormat="MMM d, yyyy"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Guests</label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <hr />

                {/* Guest Details */}
                <div className="form-section">
                  <h2>Guest details</h2>
                  
                  <div className="form-group">
                    <label>Full name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Confirm and pay'}
                </button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="booking-summary">
              <div className="summary-card">
                <div className="summary-listing">
                  <img 
                    src={`https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=150`}
                    alt={listing.name}
                  />
                  <div>
                    <h3>{listing.name}</h3>
                    <p>{listing.room_type}</p>
                    <p className="location">{listing.neighbourhood}, {listing.neighbourhood_group}</p>
                  </div>
                </div>

                <hr />

                <h3>Price details</h3>
                
                {totalNights > 0 && (
                  <>
                    <div className="price-row">
                      <span>${listing.price} x {totalNights} night{totalNights > 1 ? 's' : ''}</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="price-row">
                      <span>Service fee</span>
                      <span>$0</span>
                    </div>
                    <hr />
                    <div className="price-row total">
                      <span>Total (USD)</span>
                      <span>${totalPrice}</span>
                    </div>
                  </>
                )}

                {totalNights === 0 && (
                  <p className="select-dates">Select dates to see price</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;