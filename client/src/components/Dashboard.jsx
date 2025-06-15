// client/src/components/Dashboard.jsx - CONSOLIDATED VERSION (replacing Profile.jsx content)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Will store { userId, secretInfo }
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in. Redirecting to login...');
        setLoading(false);
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // The response.data.data from /api/user/profile contains userId (which is an object {id, role})
        // and secretInfo.
        setUserData(response.data.data); // Store the entire data object received
        setMessage(response.data.message || 'Profile loaded successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user profile:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Failed to load profile. Please log in again.');
        setLoading(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading your dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Your Dashboard</h2>

        {message && (
          <p className={`mb-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {userData ? (
          <div className="text-gray-800 space-y-4">
            {/* Access the id and role from userData.userId object */}
            <p className="text-lg"><strong>User ID:</strong> {userData.userId.id}</p>
            <p className="text-lg"><strong>User Role:</strong> <span className="capitalize">{userData.userId.role}</span></p>
            <p className="text-lg"><strong>Secret Info:</strong> {userData.secretInfo}</p>
            <p className="text-sm text-gray-500 mt-6">This is your personal dashboard, displaying your core information.</p>
            {/* Future: Add more dashboard summaries or profile fields here */}
            {/* Example: <p className="text-lg mt-4"><strong>Your Next Appointment:</strong> [Show latest booking here]</p> */}
            {/* Example: <p className="text-lg"><strong>Total Bookings:</strong> [Count of user bookings]</p> */}
          </div>
        ) : (
          <p className="text-lg text-red-600 text-center">Failed to load user data.</p>
        )}

      </div>
    </div>
  );
}

export default Dashboard;