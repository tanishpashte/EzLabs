// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setUserData(response.data);
        setMessage('Data loaded successfully!');
      } catch (error) {
        console.error('Failed to fetch user data:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Failed to load user data. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMessage('Logged out successfully!');
    setUserData(null); 
    navigate('/login'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">User Dashboard</h2>

        {message && (
          <p className={`mb-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {userData ? (
          <div className="text-gray-800">
            <p className="text-lg mb-2">Welcome, you are logged in!</p>
            <p className="text-md mb-2">Your User ID: <span className="font-semibold">{userData.data.userId}</span></p>
            <p className="text-md mb-6 italic">Secret Message: "{userData.data.secretInfo}"</p>
          </div>
        ) : (
          <p className="text-gray-600 text-lg">Loading user data...</p>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;