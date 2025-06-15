    // client/src/components/ManageServices.jsx - UPDATED WITH EDIT/DELETE
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
      const [services, setServices] = useState([]);
      const [message, setMessage] = useState('');
      const [loading, setLoading] = useState(false); // For add service form
      const [servicesLoading, setServicesLoading] = useState(true); // For fetching initial services
      const [userRole, setUserRole] = useState(null);

      // State for editing
      const [isEditing, setIsEditing] = useState(false);
      const [currentService, setCurrentService] = useState(null); // Holds data of service being edited
      const [editFormData, setEditFormData] = useState({ // For the edit form
        name: '',
        description: '',
        price: '',
        type: 'Other',
        isActive: true, // Add isActive for editing
      });

      // Valid service types (matches backend enum)
      const serviceTypes = ["Blood Test", "Urine Test", "ECG", "Health Package", "Other"];

      // Utility function to fetch all services
      const fetchServices = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('You are not logged in. Redirecting to login...');
          setServicesLoading(false);
          setTimeout(() => navigate('/login'), 1500);
          return;
        }

        try {
          const response = await axios.get('http://localhost:5000/api/services', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setServices(response.data.data);
          setServicesLoading(false);
        } catch (error) {
          console.error('Failed to fetch services for management:', error.response?.data || error.message);
          setMessage(error.response?.data?.message || 'Failed to load services for management. Please log in again.');
          setServicesLoading(false);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          setTimeout(() => navigate('/login'), 1500);
        }
      };

      // Initial load and role check
      useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);

        if (role !== 'admin') {
          alert('Access Denied! You must be an administrator to manage services.');
          navigate('/login');
          return;
        }
        fetchServices();
      }, [navigate]); // Depend on navigate to prevent infinite loop

      // Handle change for Add Service form
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      // Handle change for Edit Service form
      const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData({
          ...editFormData,
          [name]: type === 'checkbox' ? checked : value,
        });
      };

      // Handle Add Service submission
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
          fetchServices(); // Re-fetch services to update the list
        } catch (error) {
          console.error('Add service error:', error.response?.data || error.message);
          setMessage(error.response?.data?.message || 'Failed to add service. Check if name is unique.');
          setLoading(false);
        }
      };

      // Handle Edit Service submission
      const handleEditSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true); // Re-use loading state for edit action

        const token = localStorage.getItem('token');
        if (!token || userRole !== 'admin' || !currentService) {
          setMessage('Unauthorized or no service selected for edit.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.put(`http://localhost:5000/api/services/${currentService._id}`, editFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessage(response.data.message || 'Service updated successfully!');
          setLoading(false);
          setIsEditing(false); // Close edit modal
          setCurrentService(null); // Clear current service
          fetchServices(); // Re-fetch services to show updated data
        } catch (error) {
          console.error('Edit service error:', error.response?.data || error.message);
          setMessage(error.response?.data?.message || 'Failed to update service. Check data or if name is unique.');
          setLoading(false);
        }
      };


      // Handle Delete Service
      const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
          return; // User cancelled
        }

        setMessage('');
        const token = localStorage.getItem('token');
        if (!token || userRole !== 'admin') {
          setMessage('Unauthorized action. Please log in as an administrator.');
          return;
        }

        try {
          const response = await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessage(response.data.message || 'Service deleted successfully!');
          fetchServices(); // Re-fetch services to update the list
        } catch (error) {
          console.error('Delete service error:', error.response?.data || error.message);
          setMessage(error.response?.data?.message || 'Failed to delete service.');
        }
      };

      // Set up edit form when edit button is clicked
      const handleEditClick = (service) => {
        setIsEditing(true);
        setCurrentService(service);
        setEditFormData({
          name: service.name,
          description: service.description,
          price: service.price,
          type: service.type,
          isActive: service.isActive,
        });
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
                    {serviceTypes.map(typeOption => (
                        <option key={typeOption} value={typeOption}>{typeOption}</option>
                    ))}
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
                      <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Active
                      </th>
                      <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
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
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {service.isActive ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800 flex space-x-2">
                          <button
                            onClick={() => handleEditClick(service)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Edit Service Modal/Form */}
          {isEditing && currentService && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-2xl font-bold text-center text-indigo-700 mb-6">Edit Service</h3>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label htmlFor="editName" className="block text-gray-700 text-sm font-bold mb-2">
                      Service Name:
                    </label>
                    <input
                      type="text"
                      id="editName"
                      name="name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="editDescription" className="block text-gray-700 text-sm font-bold mb-2">
                      Description:
                    </label>
                    <textarea
                      id="editDescription"
                      name="description"
                      rows="3"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      required
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="editPrice" className="block text-gray-700 text-sm font-bold mb-2">
                        Price (₹):
                      </label>
                      <input
                        type="number"
                        id="editPrice"
                        name="price"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={editFormData.price}
                        onChange={handleEditChange}
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="editType" className="block text-gray-700 text-sm font-bold mb-2">
                        Type:
                      </label>
                      <select
                        id="editType"
                        name="type"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={editFormData.type}
                        onChange={handleEditChange}
                        required
                      >
                        {serviceTypes.map(typeOption => (
                            <option key={typeOption} value={typeOption}>{typeOption}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-6 flex items-center">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      name="isActive"
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={editFormData.isActive}
                      onChange={handleEditChange}
                    />
                    <label htmlFor="editIsActive" className="text-gray-700 text-sm font-bold">
                      Is Active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    export default ManageServices;
    