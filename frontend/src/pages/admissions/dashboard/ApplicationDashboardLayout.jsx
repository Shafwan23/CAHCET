import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  LogOut,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { applicantAuthService } from '../../../services/applicantAuthService';

const STEPS = [
  { path: 'personal', label: 'Personal Details', icon: User, requiredStatus: 'REGISTERED', unlocksStatus: 'PERSONAL_DONE' },
  { path: 'academic', label: 'Academic Information', icon: GraduationCap, requiredStatus: 'PERSONAL_DONE', unlocksStatus: 'ACADEMIC_DONE' },
  { path: 'course', label: 'Choose Course', icon: BookOpen, requiredStatus: 'ACADEMIC_DONE', unlocksStatus: 'COURSE_SELECTED' },
  { path: 'payment', label: 'Payment', icon: CreditCard, requiredStatus: 'COURSE_SELECTED', unlocksStatus: 'COMPLETED' },
];

const STATUS_INDEX = {
  'REGISTERED': 0,
  'PERSONAL_DONE': 1,
  'ACADEMIC_DONE': 2,
  'COURSE_SELECTED': 3,
  'COMPLETED': 4
};

const ApplicationDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract applicationId from pathname because useParams doesn't see child params in v6
  const pathParts = location.pathname.split('/').filter(Boolean);
  const applicationId = pathParts.length > 2 ? pathParts[2] : null;

  const [applicant, setApplicant] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [applicationId, location.pathname]);

  const fetchData = async () => {
    try {
      // Always fetch base applicant data
      const data = await applicantAuthService.getMe();
      setApplicant(data.applicant);

      if (applicationId) {
        // Fetch specific application data
        const appData = await applicantAuthService.getApplication(applicationId);
        setCurrentApplication(appData.application);
      } else {
        setCurrentApplication(null);
      }
    } catch (error) {
      console.error(error);
      navigate('/admissions/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    applicantAuthService.logout();
    navigate('/admissions/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-950 rounded-full animate-spin" />
      </div>
    );
  }

  // If we are looking at the global list view, don't render the step-by-step sidebar
  const isListView = !applicationId;
  const currentStatusIndex = currentApplication ? (STATUS_INDEX[currentApplication.applicationStatus] || 0) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-primary-950 text-white md:min-h-screen flex flex-col shadow-2xl relative z-20">
        <div className="p-8 border-b border-white/10 relative">
          {!isListView && (
            <Link to="/admissions/application" className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <h2 className={`text-2xl font-display font-extrabold tracking-tight ${!isListView ? 'mt-4' : ''}`}>CAHCET Portal</h2>
          <p className="text-white/60 text-sm mt-1">Application Dashboard</p>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          {!isListView ? (
            <div className="space-y-2">
              <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-white/50 uppercase font-bold tracking-widest mb-1">Applying For</p>
                <p className="font-bold text-accent-gold">{currentApplication?.studentName || 'Student Name Pending'}</p>
              </div>

              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStatusIndex > index;
                const isActive = location.pathname.includes(step.path);
                const isLocked = currentStatusIndex < index;

                return (
                  <div 
                    key={step.path}
                    onClick={() => !isLocked && navigate(`/admissions/application/${applicationId}/${step.path}`)}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative
                      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}
                      ${isActive ? 'bg-accent-gold/20 border border-accent-gold/30 shadow-inner' : 'border border-transparent'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm
                      ${isActive ? 'bg-accent-gold text-primary-950' : 
                        isCompleted ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className={`font-bold text-sm ${isActive ? 'text-accent-gold' : 'text-white'}`}>
                        {step.label}
                      </h3>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                        {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                      </p>
                    </div>
                    
                    {!isCompleted && !isActive && !isLocked && (
                      <Clock className="w-4 h-4 text-white/30" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-50 text-center">
              <BookOpen className="w-16 h-16 mb-4 text-white/20" />
              <p className="text-sm">Select an application or start a new one to see progress steps.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-accent-gold font-bold uppercase">
              {applicant?.fullName?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm truncate max-w-[150px]">{applicant?.fullName}</p>
              <p className="text-xs text-white/50 truncate max-w-[150px]">{applicant?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors font-bold text-sm group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-900/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="p-6 md:p-12 relative z-10 max-w-5xl mx-auto h-full">
          <Outlet context={{ applicant, currentApplication, fetchData }} />
        </div>
      </main>

    </div>
  );
};

export default ApplicationDashboardLayout;
