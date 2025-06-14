    // client/src/components/ManageServices.jsx
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    function ManageServices() {
      const navigate = useNavigate();
      const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        type: 'Other', // Default type
      });
      const [services, setServices] = useState([]); // State to hold existing services
      const [message, setMessage] = useState('');
      const [loading, setLoading] = useState(false);
      const [servicesLoading, setServicesLoading] = useState(true);
      const [userRole, setUserRole] = useState(null);

      // Effect to check admin role and fetch services on component mount
      useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);

        if (role !== 'admin') {
          alert('Access Denied! You must be an administrator to manage services.');
          navigate('/login');
          return;
        }

        const fetchServices = async () => {
          const token = localStorage.getItem('token');
          if (!token) {
            setMessage('You are not logged in. Redirecting to login...');
            setServicesLoading(false);
            setTimeout(() => navigate('/login'), 1500);
            return;
          }

          try {
            // This GET /api/services is public, but still good to use token if logged in
            const response = await axios.get('http://localhost:5000/api/services', {
              headers: { Authorization: `Bearer ${token}` } // Optional but good practice for logged-in users
            });
            setServices(response.data.data);
            setServicesLoading(false);
          } catch (error) {
            console.error('Failed to fetch services for management:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Failed to load services for management.');
            setServicesLoading(false);
            localStorage.removeItem('token'); // Likely an expired/invalid admin token
            localStorage.removeItem('role');
            setTimeout(() => navigate('/login'), 1500);
          }
        };

        if (role === 'admin') {
          fetchServices();
        }
      }, [navigate]);

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token || userRole !== 'admin') {
          setMessage('Unauthorized action. Please log in as an administrator.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.post('http://localhost:5000/api/services', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessage(response.data.message || 'Service added successfully!');
          setLoading(false);
          setFormData({ name: '', description: '', price: '', type: 'Other' }); // Clear form
          setServices([...services, response.data.data]); // Add new service to list immediately
        } catch (error) {
          console.error('Add service error:', error.response?.data || error.message);
          setMessage(error.response?.data?.message || 'Failed to add service. Check if name is unique.');
          setLoading(false);
        }
      };

      if (servicesLoading || userRole === null) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Loading service management panel...</p>
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
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mt-8 mb-8">
            <h2 className="text-3xl font-bold text-center text-emerald-700 mb-6">Manage Services</h2>

            {message && (
              <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            {/* Add New Service Form */}
            <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg shadow-inner bg-gray-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Service</h3>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Service Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                    Price (₹):
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                    Type:
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Blood Test">Blood Test</option>
                    <option value="Urine Test">Urine Test</option>
                    <option value="ECG">ECG</option>
                    <option value="Health Package">Health Package</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                disabled={loading}
              >
                {loading ? 'Adding Service...' : 'Add Service'}
              </button>
            </form>

            {/* List of Existing Services */}
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Existing Services</h3>
            {services.length === 0 ? (
              <p className="text-gray-600">No services added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service._id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          {service.name}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          {service.description}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          ₹{service.price}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          {service.type}
                        </td>
                        {/* Future: Add Edit/Delete buttons here */}
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

    export default ManageServices;
    