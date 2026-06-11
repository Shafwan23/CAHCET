import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { applicantAuthService } from '../../../services/applicantAuthService';

const PersonalDetailsPage = () => {
  const { applicant, currentApplication, fetchData } = useOutletContext();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: '',
    fatherName: '',
    motherName: '',
    address: '',
  });

  useEffect(() => {
    if (currentApplication) {
      setFormData({
        studentName: currentApplication.studentName || '',
        dob: currentApplication.personalDetails?.dob || '',
        gender: currentApplication.personalDetails?.gender || '',
        fatherName: currentApplication.personalDetails?.fatherName || '',
        motherName: currentApplication.personalDetails?.motherName || '',
        address: currentApplication.personalDetails?.address || '',
      });
    }
  }, [currentApplication]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await applicantAuthService.savePersonal(applicationId, formData);
      await fetchData(); // refresh context
      navigate(`/admissions/application/${applicationId}/academic`);
    } catch (error) {
      console.error(error);
      alert('Failed to save details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100"
    >
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary-950 mb-2">Personal Details</h1>
        <p className="text-gray-500">Please provide your background information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Student Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input 
              type="text" 
              name="studentName"
              required
              placeholder="Full name of the student"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input 
                type="date" 
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Gender</label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors appearance-none"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Father's Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input 
                type="text" 
                name="fatherName"
                required
                placeholder="Enter father's name"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mother's Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input 
                type="text" 
                name="motherName"
                required
                placeholder="Enter mother's name"
                value={formData.motherName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Permanent Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-4.5 h-4.5 text-gray-400" />
            <textarea 
              name="address"
              required
              rows="3"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors resize-none"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary-950 hover:bg-primary-900 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 group disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PersonalDetailsPage;
