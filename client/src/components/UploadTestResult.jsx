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
    status: 'pending review',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    if (role !== 'admin') {
      alert('Access Denied! You must be an administrator to upload test results.');
      navigate('/login');
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
      const response = await axios.post('http://localhost:5000/api/labresults', formData, {
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
        status: 'pending review',
      });
    } catch (error) {
      console.error('Upload test result error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to upload test result. Check user email or data.');
      setLoading(false);
    }
  };

  if (userRole === null || (userRole !== 'admin' && !loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-600">Checking access...</p>
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

          <div className="mb-4">
            <label htmlFor="testName" className="block text-gray-700 text-sm font-bold mb-2">
              Test Name:
            </label>
            <input
              type="text"
              id="testName"
              name="testName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.testName}
              onChange={handleChange}
              required
            />
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
              <option value="pending review">Pending Review</option>
              <option value="finalized">Finalized</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
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
