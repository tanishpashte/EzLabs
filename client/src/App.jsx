// client/src/App.jsx - UPDATED FOR ADMIN NAVIGATION CLEANUP
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import Services from './components/Services';
import BookAppointment from './components/BookAppointment';
import MyBookings from './components/MyBookings';
import AdminDashboard from './components/AdminDashboard';
import AllBookings from './components/AllBookings';
import ManageServices from './components/ManageServices';
import MyLabTests from './components/MyLabTests';
import UploadTestResult from './components/UploadTestResult';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
      if (role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsAdmin(false);
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white">
        <ul className="flex justify-center space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-300">Home</Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/register" className="hover:text-blue-300">Register</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-300">Login</Link>
              </li>
            </>
          ) : (
            <>
              {/* Dashboard link always visible when logged in */}
              <li>
                <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
              </li>
              {/* Users link visible only to admin */}
              {isAdmin && (
                <li>
                  <Link to="/users" className="hover:text-blue-300">Users</Link>
                </li>
              )}
              {/* Services link always visible (publicly browsable) */}
              <li>
                <Link to="/services" className="hover:text-blue-300">Services</Link>
              </li>

              {/* THESE LINKS ARE NOW CONDITIONAL FOR NON-ADMINS */}
              {!isAdmin && (
                <li>
                  <Link to="/book-appointment" className="hover:text-blue-300">Book Appointment</Link>
                </li>
              )}
              {!isAdmin && (
                <li>
                  <Link to="/my-bookings" className="hover:text-blue-300">My Bookings</Link>
                </li>
              )}
              {!isAdmin && (
                <li>
                  <Link to="/my-lab-tests" className="hover:text-blue-300">My Lab Tests</Link>
                </li>
              )}
              {/* Admin Dashboard link visible only to admin */}
              {isAdmin && (
                <li>
                  <Link to="/admin/dashboard" className="hover:text-blue-300 font-bold text-yellow-300">Admin Dashboard</Link>
                </li>
              )}
              {/* Logout button always visible when logged in */}
              <li>
                <button onClick={handleLogout} className="text-red-300 hover:text-red-500 font-bold">Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to EzLabs!</h1>
            <p className="text-xl text-gray-700">Providing convenient home lab visits.</p>
            <Link to="/services" className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded">
              View Our Services
            </Link>
          </div>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-lab-tests" element={<MyLabTests />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<AllBookings />} />
        <Route path="/admin/services" element={<ManageServices />} />
        <Route path="/admin/upload-result" element={<UploadTestResult />} />

        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Page Not Found!</h1>
            <p className="text-xl text-gray-700">Please check the URL or use the navigation.</p>
            <Link to="/" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go Home
            </Link>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;