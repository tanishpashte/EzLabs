    // client/src/components/MyBookings.jsx
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    function MyBookings() {
      const navigate = useNavigate();
      const [bookings, setBookings] = useState([]);
      const [message, setMessage] = useState('');
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchBookings = async () => {
          const token = localStorage.getItem('token');
          if (!token) {
            setMessage('You are not logged in. Redirecting to login...');
            setLoading(false);
            setTimeout(() => navigate('/login'), 1500);
            return;
          }

          try {
            const response = await axios.get('http://localhost:5000/api/bookings/my', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setBookings(response.data.data); // Assuming response.data.data is the array of bookings
            setMessage('Bookings loaded successfully!');
            setLoading(false);
          } catch (error) {
            console.error('Failed to fetch user bookings:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Failed to load bookings. Please log in again.');
            setLoading(false);
            // If token is invalid or expired, remove it and redirect
            localStorage.removeItem('token');
            setTimeout(() => navigate('/login'), 1500);
          }
        };

        fetchBookings();
      }, [navigate]); // Add navigate to dependency array

      // Function to get appropriate styling based on booking status
      const getStatusClasses = (status) => {
        switch (status) {
          case 'pending':
            return 'bg-yellow-100 text-yellow-800';
          case 'confirmed':
            return 'bg-blue-100 text-blue-800';
          case 'sample collected':
          case 'sample processing':
          case 'reports generation':
            return 'bg-purple-100 text-purple-800';
          case 'completed':
            return 'bg-green-100 text-green-800';
          case 'cancelled':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };


      if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Loading your bookings...</p>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mt-8 mb-8">
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">My Booked Appointments</h2>

            {message && (
              <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            {bookings.length === 0 && !loading && message.includes('success') ? (
              <p className="text-lg text-gray-600 text-center">You have no bookings yet. <Link to="/book-appointment" className="text-blue-600 hover:underline">Book one now!</Link></p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
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
                        Status
                      </th>
                      <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Booked On
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          {booking.service}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          {booking.address.street}, {booking.address.city}, {booking.address.state} - {booking.address.zipCode}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(booking.status)} capitalize`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          {new Date(booking.createdAt).toLocaleDateString()}
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

    export default MyBookings;
    