import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaCalendar, FaUserFriends, FaHome, FaEnvelope } from 'react-icons/fa';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="error">
        Booking not found
        <button className="btn-primary" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-content">
          {/* Success Icon */}
          <div className="success-icon">
            <FaCheckCircle />
          </div>

          <h1>Booking Confirmed!</h1>
          <p className="confirmation-subtitle">
            Your reservation has been successfully confirmed
          </p>

          {/* Booking Details Card */}
          <div className="confirmation-card">
            <div className="card-header">
              <h2>Booking Details</h2>
              <span className={`status-badge ${booking.status}`}>
                {booking.status}
              </span>
            </div>

            <div className="booking-info-grid">
              {/* Listing Info */}
              <div className="info-section">
                <div className="info-icon">
                  <FaHome />
                </div>
                <div>
                  <h3>Property</h3>
                  <p>{booking.listing_name}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="info-section">
                <div className="info-icon">
                  <FaCalendar />
                </div>
                <div>
                  <h3>Dates</h3>
                  <p>{formatDate(booking.check_in)} - {formatDate(booking.check_out)}</p>
                  <p className="nights">{booking.total_nights} night{booking.total_nights > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Guests */}
              <div className="info-section">
                <div className="info-icon">
                  <FaUserFriends />
                </div>
                <div>
                  <h3>Guests</h3>
                  <p>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Guest Info */}
              <div className="info-section">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div>
                  <h3>Guest Information</h3>
                  <p>{booking.guest_name}</p>
                  <p className="email">{booking.guest_email}</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Price Summary */}
            <div className="price-summary">
              <h3>Payment Summary</h3>
              <div className="price-row">
                <span>${booking.price_per_night} x {booking.total_nights} night{booking.total_nights > 1 ? 's' : ''}</span>
                <span>${booking.total_price}</span>
              </div>
              <div className="price-row">
                <span>Service fee</span>
                <span>$0</span>
              </div>
              <hr />
              <div className="price-row total">
                <span>Total (USD)</span>
                <span>${booking.total_price}</span>
              </div>
            </div>

            <hr />

            {/* Booking ID */}
            <div className="booking-id">
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p className="booking-date">
                Booked on {formatDate(booking.booking_date)}
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h2>What's next?</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div>
                  <h3>Confirmation email</h3>
                  <p>We've sent a confirmation email to {booking.guest_email}</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <div>
                  <h3>Prepare for your trip</h3>
                  <p>Check your check-in details and prepare for your stay</p>
                </div>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <div>
                  <h3>Enjoy your stay</h3>
                  <p>Have a wonderful time at your destination!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
            <button 
              className="btn-secondary"
              onClick={() => window.print()}
            >
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;