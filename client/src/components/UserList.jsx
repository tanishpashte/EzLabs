import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch user data from the backend
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      // If no token is found, the user is not logged in
      if (!token) {
        setMessage('You are not logged in. Redirecting to login...');
        // Redirect to the login page after a short delay
        setTimeout(() => navigate('/login'), 1500);
        return; 
      }

      try {
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}` // Send the token in 'Bearer TOKEN' format
          }
        });
        
        setUsers(response.data.data);
        setMessage('Users loaded successfully!');
      } catch (error) {
        console.error('Failed to fetch users:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Failed to load users. Please log in again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    // Call the fetchUsers function when the component mounts or 'navigate' dependency changes
    fetchUsers();
  }, [navigate]); 

  // Display a loading message while data is being fetched and there's no message yet
  if (!users.length && !message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-teal-50 to-emerald-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl mt-8">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">All Registered Users</h2>

        {/* Display success or error messages */}
        {message && (
          <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {/* Render the table only if there are users to display */}
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50"> {/* Key for list rendering */}
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {user._id.substring(0, 8)}... {/* Display a shortened version of the MongoDB _id */}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {user.name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {user.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Only show "No users found" if there's no success message 
          !message.includes('success') && (
            <p className="text-center text-gray-600 text-lg">No users found.</p>
          )
        )}
      </div>
    </div>
  );
}

export default UserList;
