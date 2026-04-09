import { ArrowRight, Beaker, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400" />

      <main className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
          <ShieldCheck size={14} /> Trusted Lab Partners
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Diagnostics at your <span className="text-blue-600">Doorstep.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          Skip the clinic queues. EzLabs provides professional, hygienic, and convenient home lab visits for all your diagnostic needs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/services" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
          >
            Explore Services <ArrowRight size={20} />
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-4 px-8 rounded-2xl transition-all"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 ">
          <div className="flex flex-col items-center bg-slate-200 py-8 rounded-2xl">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-3">
              <Clock className="text-blue-500" size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-800">Fast Results</p>
          </div>
          <div className="flex flex-col items-center bg-slate-200 py-8 rounded-2xl">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-3">
              <Beaker className="text-teal-500" size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-800">Certified Labs</p>
          </div>
          <div className="flex flex-col items-center bg-slate-200 py-8 rounded-2xl">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-3">
              <ShieldCheck className="text-purple-500" size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-800">Secure Reports</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;