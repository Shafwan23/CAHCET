import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Clock, CheckCircle2, IndianRupee, ArrowRight, User, Trash2, Eye, Receipt, X, BookOpen } from 'lucide-react';
import { applicantAuthService } from '../../../services/applicantAuthService';

const ApplicationListView = () => {
  const { applicant } = useOutletContext();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await applicantAuthService.getApplications();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (error) {
        console.error("Failed to load applications", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      try {
        setDeletingId(id);
        const data = await applicantAuthService.deleteApplication(id);
        if (data.success) {
          setApplications(apps => apps.filter(app => app.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete application", error);
        alert(error.response?.data?.message || 'Failed to delete application');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleStartNew = async () => {
    try {
      setIsLoading(true);
      const data = await applicantAuthService.createApplication();
      if (data.success) {
        navigate(`/admissions/application/${data.application.id}/personal`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to start a new application');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'REGISTERED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Application Submitted';
      case 'REGISTERED': return 'Started';
      default: return 'In Progress';
    }
  };

  const handleResume = (app) => {
    
    // Resume to the correct step
    switch (app.applicationStatus) {
      case 'PERSONAL_DONE': navigate(`/admissions/application/${app.id}/academic`); break;
      case 'ACADEMIC_DONE': navigate(`/admissions/application/${app.id}/course`); break;
      case 'COURSE_SELECTED': navigate(`/admissions/application/${app.id}/payment`); break;
      default: navigate(`/admissions/application/${app.id}/personal`);
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-primary-950">My Applications</h1>
          <p className="text-gray-500">Manage admission applications for your children</p>
        </div>
        <button
          onClick={handleStartNew}
          disabled={isLoading}
          className="bg-accent-gold hover:bg-accent-gold-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>{applications.length === 0 ? 'Start Application' : 'Start Another Application'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't started any applications. Click the button below to start your first admission application.</p>
          <button
            onClick={handleStartNew}
            className="bg-primary-950 hover:bg-primary-900 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Start Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {applications.map((app, idx) => (
            <motion.div 
              key={app.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative bg-white rounded-[2rem] p-[2px] shadow-sm hover:shadow-[0_20px_40px_rgb(212,175,55,0.15)] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-100 opacity-50 group-hover:from-accent-gold/20 group-hover:via-white group-hover:to-accent-gold/5 transition-all duration-700 z-0"></div>
              
              <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-[2rem] h-full flex flex-col z-10 border border-white/50">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border ${getStatusColor(app.applicationStatus)}`}>
                    {getStatusLabel(app.applicationStatus)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 shadow-inner">
                      ID: CAHCET-{app.id.substring(0,6).toUpperCase()}
                    </span>
                    {app.applicationStatus !== 'COMPLETED' && (
                      <button 
                        onClick={(e) => handleDelete(e, app.id)}
                        disabled={deletingId === app.id}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 hover:shadow-inner p-2 rounded-xl transition-all duration-300"
                        title="Delete Application"
                      >
                        {deletingId === app.id ? <div className="w-5 h-5 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"/> : <Trash2 className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mb-8 flex-grow">
                  <h3 className="text-2xl font-display font-black text-primary-950 mb-2 flex items-center gap-3 group-hover:text-accent-gold transition-colors duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <User className="w-5 h-5 text-accent-gold" />
                    </div>
                    {app.studentName || 'Unnamed Application'}
                  </h3>
                  {app.courseChoice && (
                    <div className="inline-flex items-center gap-2 text-sm text-gray-600 font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm ml-13">
                      <BookOpen className="w-4 h-4 text-accent-gold" />
                      {app.courseChoice.toUpperCase()}
                    </div>
                  )}
                </div>

                {app.applicationStatus === 'COMPLETED' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDetailsModal(app)}
                      className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-accent-gold" /> View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setReceiptModal(app)}
                      className="w-full bg-gradient-to-r from-primary-950 to-primary-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary-950/20 hover:shadow-primary-950/40"
                    >
                      <Receipt className="w-4 h-4" /> View Receipt
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResume(app)}
                    className="w-full mt-auto bg-gradient-to-r from-gray-50 to-white hover:from-accent-gold/10 hover:to-white text-primary-950 font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-200 hover:border-accent-gold/30 shadow-sm hover:shadow-md group/btn"
                  >
                    Resume Application <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300 text-accent-gold" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
      {/* Details Modal */}
      <AnimatePresence>
        {detailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-950/60 backdrop-blur-md"
              onClick={() => setDetailsModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-3xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden border border-white"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
              
              <div className="p-8 border-b border-gray-100 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <User className="w-6 h-6 text-accent-gold" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-primary-950">Application Details</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: CAHCET-{detailsModal.id.substring(0,8).toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setDetailsModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-10 flex-grow custom-scrollbar relative z-10">
                {/* Personal */}
                <section>
                  <h3 className="text-sm font-black text-primary-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-white flex items-center justify-center shadow-sm border border-primary-50"><User className="w-4 h-4 text-accent-gold"/></div> 
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl -z-10 group-hover:bg-accent-gold/10 transition-colors duration-500" />
                    <div><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Student Name</span><span className="font-bold text-primary-950 text-lg">{detailsModal.studentName}</span></div>
                    <div><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Birth</span><span className="font-bold text-primary-950 text-lg">{detailsModal.personalDetails?.dob || '-'}</span></div>
                    <div><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gender</span><span className="font-bold text-primary-950 text-lg">{detailsModal.personalDetails?.gender || '-'}</span></div>
                    <div><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Father's Name</span><span className="font-bold text-primary-950 text-lg">{detailsModal.personalDetails?.fatherName || '-'}</span></div>
                    <div className="sm:col-span-2"><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</span><span className="font-bold text-primary-950 leading-relaxed">{detailsModal.personalDetails?.address || '-'}</span></div>
                  </div>
                </section>

                {/* Academic */}
                <section>
                  <h3 className="text-sm font-black text-primary-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-white flex items-center justify-center shadow-sm border border-primary-50"><BookOpen className="w-4 h-4 text-accent-gold"/></div> 
                    Academic Background
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl -z-10 group-hover:bg-accent-gold/10 transition-colors duration-500" />
                    <div className="sm:col-span-2"><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Institution</span><span className="font-bold text-primary-950 text-lg">{detailsModal.academicInfo?.institution || '-'}</span></div>
                    <div><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Board</span><span className="font-bold text-primary-950 text-lg">{detailsModal.academicInfo?.board || '-'}</span></div>
                    <div><span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Year of Passing</span><span className="font-bold text-primary-950 text-lg">{detailsModal.academicInfo?.passingYear || '-'}</span></div>
                    <div className="bg-accent-gold/5 p-4 rounded-2xl border border-accent-gold/20 flex flex-col justify-center"><span className="block text-[10px] font-black text-accent-gold uppercase tracking-widest mb-1">Percentage/CGPA</span><span className="font-black text-accent-gold text-2xl">{detailsModal.academicInfo?.percentage || '-'}</span></div>
                  </div>
                </section>

                {/* Course */}
                <section>
                  <h3 className="text-sm font-black text-primary-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-white flex items-center justify-center shadow-sm border border-primary-50"><CheckCircle2 className="w-4 h-4 text-accent-gold"/></div> 
                    Selected Course
                  </h3>
                  <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 rounded-3xl p-8 shadow-2xl relative overflow-hidden group border border-white/10">
                    <div className="absolute -right-8 -top-8 w-48 h-48 bg-gradient-to-br from-accent-gold/30 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute right-0 top-0 bottom-0 w-48 bg-accent-gold/10 skew-x-12 transform translate-x-24 border-l border-white/5" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Enrolled Program</span>
                        <span className="font-display font-black text-white text-3xl md:text-4xl tracking-tight drop-shadow-md">{detailsModal.courseChoice ? detailsModal.courseChoice.toUpperCase() : '-'}</span>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                        <CheckCircle2 className="w-8 h-8 text-accent-gold" />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {receiptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-950/60 backdrop-blur-md"
              onClick={() => setReceiptModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, rotateX: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              style={{ perspective: 1000 }}
              className="relative z-10 w-full max-w-sm"
            >
              {/* Receipt Ticket Container */}
              <div className="bg-white rounded-t-[2rem] shadow-2xl flex flex-col relative overflow-hidden border-t-8 border-accent-gold">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2" />
                
                <div className="p-8 text-center relative z-10">
                  <button onClick={() => setReceiptModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50/50">
                    <Receipt className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-display font-black text-primary-950 mb-1">Payment Receipt</h2>
                  <p className="text-accent-gold font-bold text-sm tracking-widest uppercase">CAHCET Admissions</p>
                </div>
                
                {/* Dashed Line Separator */}
                <div className="relative h-8 w-full flex items-center bg-white z-20">
                  <div className="absolute -left-4 w-8 h-8 bg-primary-950/60 backdrop-blur-md rounded-full shadow-inner" />
                  <div className="w-full border-t-2 border-dashed border-gray-200" />
                  <div className="absolute -right-4 w-8 h-8 bg-primary-950/60 backdrop-blur-md rounded-full shadow-inner" />
                </div>
                
                <div className="p-8 bg-gray-50/50 rounded-b-[2rem] z-10 relative">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-5">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Status</span>
                      <span className="font-bold text-emerald-600 text-xs flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                        <CheckCircle2 className="w-4 h-4"/> Payment Successful
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-5">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Transaction ID</span>
                      <span className="font-mono text-primary-950 text-sm font-bold bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{receiptModal.transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-5">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Date & Time</span>
                      <span className="text-primary-950 text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{new Date(receiptModal.paymentDate).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-5">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Payment Method</span>
                      <span className="text-primary-950 text-sm font-bold uppercase bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{receiptModal.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-gray-400 text-sm font-black uppercase tracking-widest">Total Paid</span>
                      <span className="text-4xl font-display font-black text-primary-950 flex items-center">
                        <IndianRupee className="w-6 h-6 mr-1 text-accent-gold"/> {receiptModal.amountPaid || 1000}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApplicationListView;
