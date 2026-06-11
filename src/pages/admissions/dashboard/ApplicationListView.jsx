import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Clock, CheckCircle2, IndianRupee, ArrowRight, User, Trash2, Eye, Receipt, X } from 'lucide-react';
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
          <span>Start Another Application</span>
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
            Start Another Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.applicationStatus)}`}>
                  {getStatusLabel(app.applicationStatus)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">ID: CAHCET-{app.id.substring(0,6).toUpperCase()}</span>
                  {app.applicationStatus !== 'COMPLETED' && (
                    <button 
                      onClick={(e) => handleDelete(e, app.id)}
                      disabled={deletingId === app.id}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Delete Application"
                    >
                      {deletingId === app.id ? <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"/> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  {app.studentName || 'Unnamed Application'}
                </h3>
                {app.courseChoice && (
                  <p className="text-sm text-gray-500 font-medium">{app.courseChoice.toUpperCase()}</p>
                )}
              </div>

              {app.applicationStatus === 'COMPLETED' ? (
                <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
                  <button
                    onClick={() => setDetailsModal(app)}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                  <button
                    onClick={() => setReceiptModal(app)}
                    className="w-full bg-primary-950 hover:bg-primary-900 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <Receipt className="w-4 h-4" /> View Receipt
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleResume(app)}
                  className="w-full mt-auto bg-gray-50 hover:bg-gray-100 text-primary-950 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200"
                >
                  Resume Application <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
      {/* Details Modal */}
      <AnimatePresence>
        {detailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm"
              onClick={() => setDetailsModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent-gold" />
                  Application Details
                </h2>
                <button onClick={() => setDetailsModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-8 flex-grow">
                {/* Personal */}
                <section>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-gold"></div> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div><span className="block text-xs text-gray-500 mb-1">Student Name</span><span className="font-semibold text-gray-900">{detailsModal.studentName}</span></div>
                    <div><span className="block text-xs text-gray-500 mb-1">Date of Birth</span><span className="font-semibold text-gray-900">{detailsModal.personalDetails?.dob || '-'}</span></div>
                    <div><span className="block text-xs text-gray-500 mb-1">Gender</span><span className="font-semibold text-gray-900">{detailsModal.personalDetails?.gender || '-'}</span></div>
                    <div><span className="block text-xs text-gray-500 mb-1">Father's Name</span><span className="font-semibold text-gray-900">{detailsModal.personalDetails?.fatherName || '-'}</span></div>
                    <div className="sm:col-span-2"><span className="block text-xs text-gray-500 mb-1">Address</span><span className="font-semibold text-gray-900">{detailsModal.personalDetails?.address || '-'}</span></div>
                  </div>
                </section>

                {/* Academic */}
                <section>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-gold"></div> Academic Background
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="sm:col-span-2"><span className="block text-xs text-gray-500 mb-1">Institution</span><span className="font-semibold text-gray-900">{detailsModal.academicInfo?.institution || '-'}</span></div>
                    <div><span className="block text-xs text-gray-500 mb-1">Board</span><span className="font-semibold text-gray-900">{detailsModal.academicInfo?.board || '-'}</span></div>
                    <div><span className="block text-xs text-gray-500 mb-1">Year of Passing</span><span className="font-semibold text-gray-900">{detailsModal.academicInfo?.passingYear || '-'}</span></div>
                    <div><span className="block text-xs text-gray-500 mb-1">Percentage/CGPA</span><span className="font-semibold text-gray-900">{detailsModal.academicInfo?.percentage || '-'}</span></div>
                  </div>
                </section>

                {/* Course */}
                <section>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-gold"></div> Selected Course
                  </h3>
                  <div className="bg-primary-950/5 rounded-2xl p-5 border border-primary-950/10">
                    <span className="font-bold text-primary-950 text-lg">{detailsModal.courseChoice ? detailsModal.courseChoice.toUpperCase() : '-'}</span>
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
              className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm"
              onClick={() => setReceiptModal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col relative z-10 overflow-hidden"
            >
              <div className="bg-primary-950 p-8 text-center text-white relative">
                <button onClick={() => setReceiptModal(null)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                  <Receipt className="w-8 h-8 text-accent-gold" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Payment Receipt</h2>
                <p className="text-white/60 text-sm">CAHCET Admissions</p>
              </div>
              
              <div className="p-8 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-500 text-sm">Status</span>
                    <span className="font-bold text-green-500 text-sm flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                      <CheckCircle2 className="w-4 h-4"/> Success
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-500 text-sm">Transaction ID</span>
                    <span className="font-mono text-gray-900 text-sm font-bold">{receiptModal.transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-500 text-sm">Date</span>
                    <span className="text-gray-900 text-sm font-medium">{new Date(receiptModal.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-500 text-sm">Payment Method</span>
                    <span className="text-gray-900 text-sm font-medium uppercase">{receiptModal.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-500 font-medium">Amount Paid</span>
                    <span className="text-2xl font-bold text-primary-950 flex items-center">
                      <IndianRupee className="w-5 h-5"/> {receiptModal.amountPaid || 1000}
                    </span>
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
