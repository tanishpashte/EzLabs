// client/src/components/Services.jsx - REVISED FOR DYNAMIC FETCHING
import React, { useState, useEffect } from 'react'; // NEW: useEffect
import { Link } from 'react-router-dom';
import axios from 'axios'; // NEW: Import axios

function Services() {
  const [services, setServices] = useState([]); // State to store fetched services
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null);   // State for error messages

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data.data); // Assuming response.data.data is the array of services
        setLoading(false); // Done loading
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.'); // Set error message
        setLoading(false); // Done loading even on error
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 bg-opacity-70 text-red-700 p-4">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mt-8 mb-8 text-center">
        <h2 className="text-4xl font-bold text-purple-700 mb-8">Our Home Visit Services</h2>

        {services.length === 0 ? (
          <p className="text-lg text-gray-600">No services currently available. Please check back later.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service._id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="text-5xl mb-4">
                    {/* Simple emoji mapping based on type - customize as needed */}
                    {service.type === 'Blood Test' && '🩸'}
                    {service.type === 'Urine Test' && '💧'}
                    {service.type === 'ECG' && '❤️'}
                    {service.type === 'Health Package' && '✅'}
                    {service.type === 'Other' && '🔬'}
                    {!service.type && '❓'} {/* Fallback if type is missing */}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-xl font-bold text-green-700 mb-4">₹{service.price}</p> {/* Display price */}
                <Link
                  to="/book-appointment" // This link will take them to the booking page
                  className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-gray-600 text-lg">Ready to book your home visit? <Link to="/book-appointment" className="text-blue-600 hover:underline font-semibold">Proceed to Booking</Link></p>
      </div>
    </div>
  );
}

export default Services;