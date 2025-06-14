    // client/src/App.jsx - Updates for MyBookings
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
    import Register from './components/Register';
    import Login from './components/Login';
    import Dashboard from './components/Dashboard';
    import UserList from './components/UserList';
    import Services from './components/Services';
    import BookAppointment from './components/BookAppointment';
    import MyBookings from './components/MyBookings'; // NEW: Import MyBookings

    function App() {
      return (
        <Router>
          <nav className="bg-gray-800 p-4 text-white">
            <ul className="flex justify-center space-x-4">
              <li>
                <Link to="/" className="hover:text-blue-300">Home</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-300">Register</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-300">Login</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
              </li>
              <li>
                <Link to="/users" className="hover:text-blue-300">Users</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-300">Services</Link>
              </li>
              <li> {/* NEW: Link to My Bookings */}
                <Link to="/my-bookings" className="hover:text-blue-300">My Bookings</Link>
              </li>
              {/* Optional: Add a direct "Book Now" link to nav if desired */}
              {/* <li>
                <Link to="/book-appointment" className="hover:text-blue-300">Book</Link>
              </li> */}
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
            <Route path="/my-bookings" element={<MyBookings />} /> {/* NEW: Route for MyBookings */}
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
    