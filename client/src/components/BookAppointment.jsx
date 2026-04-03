import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookAppointment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    appointmentDate: '',
    timeSlot: '', 
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India', 
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [services, setServices] = useState([]); 
  const [servicesLoading, setServicesLoading] = useState(true); 
  const [userRole, setUserRole] = useState(null); 

  const predefinedTimeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
  ];


  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role); 
    const token = localStorage.getItem('token');

    if (!token || role === 'admin') {
      setMessage('Access Denied or Not Logged In. Redirecting...');
      setServicesLoading(false); 
      setTimeout(() => navigate(role === 'admin' ? '/admin/dashboard' : '/login'), 1500);
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services`, {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setServices(response.data.data.filter(service => service.isActive));
        setServicesLoading(false);
      } catch (error) {
        console.error('Failed to fetch services:', error.response?.data || error.message);
        setMessage('Failed to load services. Please try again.');
        setServicesLoading(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchServices();
  }, [navigate]); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setLoading(true); 

    const token = localStorage.getItem('token');
    if (!token || userRole === 'admin') {
        setMessage('Unauthorized action. Please log in as a regular user.');
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        serviceName: formData.serviceName,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        streetAddress: formData.streetAddress, 
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        notes: formData.notes,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message || 'Appointment booked successfully!');
      setFormData({
        serviceName: '',
        appointmentDate: '',
        timeSlot: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India', 
        notes: '',
      });
    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to book appointment. Please check your details.');
    } finally {
      setLoading(false); 
    }
  };

  if (servicesLoading || userRole === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading appointment booking form...</p>
      </div>
    );
  }

  if (userRole === 'admin') {
      return (
          <div className="flex items-center justify-center min-h-screen bg-red-50 bg-opacity-70 text-red-700 p-4">
              <p className="text-lg font-semibold">Access Denied: Administrators cannot book appointments.</p>
          </div>
      );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"> 
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Book Your Home Visit</h2>

        {message && (
          <p className={`mb-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="serviceName" className="block text-gray-700 text-sm font-bold mb-2">
                Select Service:
              </label>
              <select
                id="serviceName"
                name="serviceName"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.serviceName}
                onChange={handleChange}
                required
              >
                <option value="">Select a Service</option>
                {services.length > 0 ? (
                  services.map((service) => (
                    <option key={service._id} value={service.name}>
                      {service.name} (₹{service.price})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No services available</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="appointmentDate" className="block text-gray-700 text-sm font-bold mb-2">
                Date:
              </label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="timeSlot" className="block text-gray-700 text-sm font-bold mb-2">
              Time Slot:
            </label>
            <select
              id="timeSlot"
              name="timeSlot"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select a Time Slot</option>
              {predefinedTimeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Your Address for Home Visit:</h3>
          <div className="mb-4">
            <label htmlFor="streetAddress" className="block text-gray-700 text-sm font-bold mb-2">
              Street Address:
            </label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.streetAddress}
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
                value={formData.city}
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
                value={formData.state}
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
                value={formData.zipCode}
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
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
