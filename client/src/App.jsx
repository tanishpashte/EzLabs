// client/src/App.jsx - Updates
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList'; // NEW: Import UserList

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white">
        <ul className="flex justify-center space-x-4">
          <li>
            <Link to="/register" className="hover:text-blue-300">Register</Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
          </li>
          <li>
            <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
          </li>
          <li> {/* NEW: Link to User List */}
            <Link to="/users" className="hover:text-blue-300">Users</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserList />} /> {/* NEW: Route for UserList */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to EzLabs!</h1>
            <p className="text-xl text-gray-700">Navigate using the links above.</p>
            <Link to="/login" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to Login
            </Link>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;