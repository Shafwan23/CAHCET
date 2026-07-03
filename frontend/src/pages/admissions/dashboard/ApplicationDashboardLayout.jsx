import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  LogOut,
  CheckCircle,
  Clock,
  ArrowLeft,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      const data = await applicantAuthService.getMe();
      setApplicant(data.applicant);

      if (applicationId) {
        const appData = await applicantAuthService.getApplication(applicationId);
        setCurrentApplication(appData.application);
      } else {
        setCurrentApplication(null);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('applicant');
      navigate('/admissions/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await applicantAuthService.logout();
    navigate('/admissions/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-accent-gold rounded-full animate-spin" />
      </div>
    );
  }

  const isListView = !applicationId;
  const currentStatusIndex = currentApplication ? (STATUS_INDEX[currentApplication.applicationStatus] || 0) : 0;

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-white/10 relative">
        {!isListView && (
          <Link to="/admissions/application" className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
        <h2 className={`text-3xl font-display font-extrabold tracking-tight text-white ${!isListView ? 'mt-4' : ''}`}>CAHCET</h2>
        <p className="text-accent-gold text-sm mt-1 font-semibold tracking-wide uppercase">Admissions Portal</p>
      </div>

      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
        {!isListView ? (
          <div className="space-y-4">
            <div className="mb-8 p-5 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-1">Applying For</p>
              <p className="font-bold text-accent-gold text-lg">{currentApplication?.studentName || 'Student Name Pending'}</p>
              
              <div className="mt-4 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(5, (currentStatusIndex / STEPS.length) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-accent-gold h-full"
                />
              </div>
              <p className="text-right text-[10px] text-white/40 mt-1 uppercase font-bold tracking-wider">
                {Math.round((currentStatusIndex / STEPS.length) * 100)}% Complete
              </p>
            </div>

            <div className="space-y-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStatusIndex > index;
                const isActive = location.pathname.includes(step.path);
                const isLocked = currentStatusIndex < index;

                return (
                  <motion.div 
                    whileHover={!isLocked ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    key={step.path}
                    onClick={() => {
                      if (!isLocked) {
                        navigate(`/admissions/application/${applicationId}/${step.path}`);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`
                      flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden
                      ${isLocked ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer hover:bg-white/5 hover:shadow-lg'}
                      ${isActive ? 'bg-gradient-to-r from-accent-gold/20 to-transparent border border-accent-gold/30 shadow-inner' : 'border border-transparent'}
                    `}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold rounded-r-full" 
                      />
                    )}
                    
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-colors duration-500
                      ${isActive ? 'bg-accent-gold text-primary-950' : 
                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/50'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className={`font-bold text-sm transition-colors duration-300 ${isActive ? 'text-accent-gold' : 'text-white'}`}>
                        {step.label}
                      </h3>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5 font-semibold">
                        {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                      </p>
                    </div>
                    
                    {!isCompleted && !isActive && !isLocked && (
                      <Clock className="w-4 h-4 text-white/30" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-50 text-center">
            <BookOpen className="w-20 h-20 mb-6 text-white/20" />
            <p className="text-sm font-medium px-4">Select an application or start a new one to see progress steps.</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/10 bg-primary-950/50 backdrop-blur-lg">
        <div className="flex items-center gap-4 mb-6 bg-white/5 p-3 rounded-2xl border border-white/5">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-yellow-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
            {applicant?.fullName?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-white truncate">{applicant?.fullName}</p>
            <p className="text-xs text-white/50 truncate">{applicant?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-sm group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 bg-primary-950 text-white flex-col shadow-2xl relative z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button & Overlay */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-950"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-950/80 backdrop-blur-sm z-40 md:hidden flex justify-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-4/5 max-w-sm bg-primary-950 text-white h-full flex flex-col shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow relative h-screen overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50/50">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-primary-900/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        <div className="p-6 md:p-12 lg:p-16 relative z-10 max-w-6xl mx-auto min-h-full">
          <Outlet context={{ applicant, currentApplication, fetchData }} />
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ApplicationDashboardLayout;
