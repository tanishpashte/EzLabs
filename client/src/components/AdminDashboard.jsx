import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access Denied! You must be an administrator to view this page.');
      navigate('/login');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-600">Redirecting... Access Denied.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-8">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/bookings"
            className="block p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-semibold mb-2">Manage All Bookings</h3>
            <p>View, filter, and update status of all patient appointments.</p>
          </Link>

          <Link
            to="/admin/services"
            className="block p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-semibold mb-2">Manage Services</h3>
            <p>Add, edit, or remove lab services and their pricing.</p>
          </Link>

          <Link // NEW LINK
            to="/admin/upload-result"
            className="block p-6 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-semibold mb-2">Upload Test Results</h3>
            <p>Add new lab test results for patients.</p>
          </Link>

          {/* Add more admin links here as needed */}
        </div>

        <p className="mt-10 text-gray-600 text-lg">
          Welcome, Administrator! Use the links above to manage the EzLabs system.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
