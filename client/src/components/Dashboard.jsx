import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Activity, FileText, Calendar } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); 
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You are not logged in. Redirecting to login...');
        setLoading(false);
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.data); 
        console.log(userData);
        setMessage(response.data.message || 'Profile loaded successfully!');
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user profile:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Failed to load profile. Please log in again.');
        setLoading(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/login'), 1500);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading your dashboard data...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center">
          <p className="text-lg text-red-600 font-medium">Failed to load profile data.</p>
          <button className="mt-4 text-blue-600 underline" onClick={() => window.location.reload()}>Try Refreshing</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, User!</h1>
            <p className="text-slate-500">Manage your Profile</p>
          </div>
          
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-slate-400" />
              Account Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account ID</label>
                <p className="text-slate-700 font-mono text-sm truncate">{userData.userId}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
                <p className="text-slate-700 capitalize font-medium">{userData.role}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Patient Overview</h2>
            <div className="border-t border-slate-100 pt-4">
               <p className="text-slate-600 leading-relaxed mb-4">
                 Your personalized healthcare portal is active. Here you can view your diagnostic history and download reports securely.
               </p>
            </div>
            
            <div className="mt-8 flex gap-4">
               <button onClick={()=>navigate('/my-lab-tests')} className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl transition-all">
                 View History
               </button>
               <button onClick={()=>navigate('/services')} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-all">
                 Book New Test
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;