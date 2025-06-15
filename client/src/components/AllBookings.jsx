import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AllBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); 

  // Define all possible statuses for the dropdown
  const allStatuses = [
    'pending',
    'confirmed',
    'assigned',
    'on the way',
    'sample collected',
    'sample processing',
    'reports generation',
    'completed',
    'cancelled',
    'rescheduled'
  ];

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);

    if (role !== 'admin') {
      alert('Access Denied! You must be an administrator to view this page.');
      navigate('/login');
      return;
    }

    const fetchAllBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in. Redirecting to login...');
        setLoading(false);
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(response.data.data);
        setMessage('All bookings loaded successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch all bookings:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Failed to load bookings. Please log in again.');
        setLoading(false);
        localStorage.removeItem('token'); // Likely an expired/invalid admin token
        localStorage.removeItem('role');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    if (role === 'admin') { // Only fetch if role is confirmed admin
      fetchAllBookings();
    }
  }, [navigate]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token || userRole !== 'admin') {
      setMessage('Unauthorized action. Please log in as an administrator.');
      return;
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage(`Booking ${bookingId} status updated to ${newStatus}`);
      // Update the booking in the local state to reflect the change
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error('Failed to update booking status:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to update status.');
    }
  };

  // Function to get appropriate styling based on booking status (reused from MyBookings)
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
      case 'on the way':
        return 'bg-indigo-100 text-indigo-800';
      case 'sample collected':
      case 'sample processing':
      case 'reports generation':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || userRole === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading all bookings...</p>
      </div>
    );
  }

  if (userRole !== 'admin') { 
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 bg-opacity-70 text-red-700 p-4">
        <p className="text-lg font-semibold">Access Denied: Not an Administrator.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl mt-8 mb-8">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-6">Manage All Bookings</h2>

        {message && (
          <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {bookings.length === 0 ? (
          <p className="text-lg text-gray-600 text-center">No bookings found in the system.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Current Status
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Update Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {booking._id.substring(0, 8)}...
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {booking.user ? booking.user.name : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {booking.service}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {booking.address.street}, {booking.address.city}, {booking.address.zipCode}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(booking.status)} capitalize`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className="p-1 border rounded text-gray-700"
                      >
                        {allStatuses.map(statusOption => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllBookings;
