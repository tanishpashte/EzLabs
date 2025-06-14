// client/src/components/MyLabTests.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyLabTests() {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTestResults = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in. Redirecting to login...');
        setLoading(false);
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/labresults/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTestResults(response.data.data);
        setMessage('Your lab test results loaded successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch lab test results:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Failed to load results. Please log in again.');
        setLoading(false);
        localStorage.removeItem('token'); // Likely an expired/invalid token
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchMyTestResults();
  }, [navigate]);

  // Function to get appropriate styling based on result status
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending review':
        return 'bg-yellow-100 text-yellow-800';
      case 'finalized':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading your lab test results...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-50 to-pink-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl mt-8 mb-8">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">My Lab Test Results</h2>

        {message && (
          <p className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {testResults.length === 0 && !loading && message.includes('success') ? (
          <p className="text-lg text-gray-600 text-center">No lab test results found for your account.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Test Date
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reference Range
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Interpretation
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {result.testName}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {new Date(result.testDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {result.resultValue} {result.units}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {result.referenceRange || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {result.interpretation || 'No interpretation provided.'}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(result.status)} capitalize`}>
                        {result.status}
                      </span>
                    </td>
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

export default MyLabTests;
