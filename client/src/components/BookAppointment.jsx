// client/src/components/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookAppointment() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]); // To store services fetched from backend
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India', // Default country
    },
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState(null);

  // Effect to fetch services when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data.data);
        setServiceLoading(false);
        if (response.data.data.length > 0) {
            setFormData(prev => ({ ...prev, service: response.data.data[0].name })); // Set default service
        }
      } catch (err) {
        console.error('Error fetching services for booking form:', err);
        setServiceError('Failed to load services for booking. Please try again.');
        setServiceLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) { // Handle nested address fields
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to book an appointment. Redirecting to login...');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message || 'Appointment booked successfully!');
      // Optionally clear form or redirect to 'my bookings'
      setFormData({
        service: services.length > 0 ? services[0].name : '', // Reset to first service or empty
        date: '',
        time: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
        },
        notes: '',
      });
      setLoading(false);
      // Optional: navigate('/my-bookings'); after a short delay
    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to book appointment. Please try again.');
      setLoading(false);
    }
  };

  if (serviceLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading booking form...</p>
      </div>
    );
  }

  if (serviceError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 bg-opacity-70 text-red-700 p-4">
        <p className="text-lg font-semibold">{serviceError}</p>
      </div>
    );
  }

  if (services.length === 0 && !serviceLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">No Services Available</h2>
          <p className="text-gray-600 mb-6">
            Please ask an administrator to add services before you can book.
          </p>
          <Link to="/services" className="text-blue-600 hover:underline">View Services Page</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Book Your Home Visit</h2>

        {message && (
          <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {/* Service Selection */}
        <div className="mb-4">
          <label htmlFor="service" className="block text-gray-700 text-sm font-bold mb-2">
            Select Service:
          </label>
          <select
            id="service"
            name="service"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.service}
            onChange={handleChange}
            required
          >
            {services.map(service => (
              <option key={service._id} value={service.name}>
                {service.name} (₹{service.price})
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
              Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">
              Time Slot:
            </label>
            <input
              type="text" // Or use a time picker if preferred, but text for simplicity now
              id="time"
              name="time"
              placeholder="e.g., 10:00 AM - 11:00 AM"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Address Fields */}
        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Your Address for Home Visit:</h3>
        <div className="mb-4">
          <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">
            Street Address:
          </label>
          <input
            type="text"
            id="street"
            name="street"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.address.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.address.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
              State:
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.address.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="zipCode" className="block text-gray-700 text-sm font-bold mb-2">
              Zip Code:
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.address.zipCode}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.address.country}
              onChange={handleChange}
              required
              readOnly // Make country read-only if default
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">
            Additional Notes (Optional):
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;