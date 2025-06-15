// client/src/components/UploadTestResult.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UploadTestResult() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userEmail: '',
    testName: '',
    testDate: '',
    resultValue: '',
    units: '',
    referenceRange: '',
    interpretation: '',
    // Ensure this default matches an enum value in your schema
    status: 'pending review', // THIS MUST BE ONE OF THE ENUM VALUES
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [services, setServices] = useState([]); // State to store available services
  const [servicesLoading, setServicesLoading] = useState(true); // For fetching services

  // Valid status options for the dropdown, MUST match LabTestResult schema enum
  const testStatuses = ["pending review", "finalized", "published", "archived"];


  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    if (role !== 'admin') {
      alert('Access Denied! You must be an administrator to upload test results.');
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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        setServices(response.data.data.filter(service => service.isActive));
        setServicesLoading(false);
      } catch (error) {
        console.error('Failed to fetch services for dropdown:', error.response?.data || error.message);
        setMessage('Failed to load services for test name dropdown. Please try again.');
        setServicesLoading(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchServices();
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/labresults`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message || 'Lab test result uploaded successfully!');
      setLoading(false);
      // Clear form after successful upload
      setFormData({
        userEmail: '',
        testName: '',
        testDate: '',
        resultValue: '',
        units: '',
        referenceRange: '',
        interpretation: '',
        status: 'pending review', // Reset to default
      });
    } catch (error) {
      console.error('Upload test result error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to upload test result. Check user email or data.');
      setLoading(false);
    }
  };

  if (servicesLoading || userRole === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading upload form and services...</p>
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-6">Upload Lab Test Result</h2>

        {message && (
          <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block text-gray-700 text-sm font-bold mb-2">
              User Email (Patient):
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Test Name Dropdown */}
          <div className="mb-4">
            <label htmlFor="testName" className="block text-gray-700 text-sm font-bold mb-2">
              Test Name:
            </label>
            <select
              id="testName"
              name="testName"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.testName}
              onChange={handleChange}
              required
            >
              <option value="">Select a Service/Test</option>
              {services.length > 0 ? (
                services.map((service) => (
                  <option key={service._id} value={service.name}>
                    {service.name} (₹{service.price})
                  </option>
                ))
              ) : (
                <option value="" disabled>No active services available</option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="testDate" className="block text-gray-700 text-sm font-bold mb-2">
              Test Date:
            </label>
            <input
              type="date"
              id="testDate"
              name="testDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.testDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="resultValue" className="block text-gray-700 text-sm font-bold mb-2">
              Result Value:
            </label>
            <input
              type="text"
              id="resultValue"
              name="resultValue"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.resultValue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="units" className="block text-gray-700 text-sm font-bold mb-2">
                Units (Optional):
              </label>
              <input
                type="text"
                id="units"
                name="units"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.units}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="referenceRange" className="block text-gray-700 text-sm font-bold mb-2">
                Reference Range (Optional):
              </label>
              <input
                type="text"
                id="referenceRange"
                name="referenceRange"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.referenceRange}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="interpretation" className="block text-gray-700 text-sm font-bold mb-2">
              Interpretation (Optional):
            </label>
            <textarea
              id="interpretation"
              name="interpretation"
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.interpretation}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Status Dropdown - Ensure options match schema enum values exactly */}
          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
              Status:
            </label>
            <select
              id="status"
              name="status"
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {testStatuses.map(statusOption => (
                <option key={statusOption} value={statusOption}>{statusOption.replace(/\b\w/g, char => char.toUpperCase())}</option> // Capitalize for display, value remains lowercase
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Result'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadTestResult;
