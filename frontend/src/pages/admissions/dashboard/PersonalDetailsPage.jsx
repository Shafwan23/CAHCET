import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { applicantAuthService } from '../../../services/applicantAuthService';

const FloatingInput = ({ icon: Icon, label, type = "text", name, value, onChange, required, error, as = "input", children }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== '';
  // Date and Select inputs always have some browser-rendered value, so keep label floated
  const isActive = isFocused || hasValue || as === 'select' || type === 'date';

  return (
    <div className="relative pb-4 w-full">
      <div 
        className={`relative flex items-start transition-all duration-300 rounded-xl overflow-hidden bg-white/90 backdrop-blur-md group ${
          isFocused ? 'ring-2 ring-accent-gold shadow-[0_8px_30px_rgb(212,175,55,0.15)] border-transparent' : 'border border-gray-300 shadow-sm hover:border-accent-gold/60'
        } ${error ? 'ring-2 ring-red-400 border-transparent shadow-[0_8px_30px_rgb(248,113,113,0.15)]' : ''}`}
      >
        <div className="pl-4 pr-3 pt-4 flex items-center justify-center text-gray-400 group-hover:text-accent-gold/80 transition-colors duration-300">
          <Icon className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-accent-gold' : ''} ${error ? 'text-red-400' : ''}`} />
        </div>
        
        <div className="relative flex-grow">
          <label 
            className={`absolute left-0 transition-all duration-300 pointer-events-none z-10 ${
              isActive ? 'top-1.5 text-[10px] uppercase font-bold tracking-wider text-accent-gold' : 'top-4 text-sm text-gray-500'
            } ${error ? 'text-red-500' : ''}`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          
          {as === 'input' ? (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent pt-5 pb-1.5 pr-4 text-gray-800 text-sm font-medium focus:outline-none placeholder-transparent"
              placeholder={label}
            />
          ) : as === 'select' ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full bg-transparent pt-5 pb-1.5 pr-4 text-sm font-medium focus:outline-none appearance-none cursor-pointer ${!hasValue ? 'text-gray-400' : 'text-gray-800'}`}
            >
              {children}
            </select>
          ) : (
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows="1"
              className="w-full bg-transparent pt-5 pb-1.5 pr-4 text-gray-800 text-sm font-medium focus:outline-none resize-none placeholder-transparent"
              placeholder={label}
            />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute bottom-1 left-2 text-xs text-red-500 flex items-center gap-1 font-medium"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Reusable Form Section Wrapper with animated border
const FormSection = ({ title, icon: Icon, children }) => (
  <motion.div variants={itemVariants} className="relative group rounded-3xl p-[1px] overflow-hidden bg-white/40">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 opacity-50 group-hover:from-accent-gold/50 group-hover:via-accent-gold/10 group-hover:to-accent-gold/50 transition-all duration-700 animate-pulse-slow"></div>
    <div className="relative bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-sm group-hover:shadow-lg transition-all duration-500 border border-white/50">
      <h3 className="text-xs font-black text-primary-950 mb-4 uppercase tracking-widest flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shadow-inner">
          <Icon className="w-4 h-4 text-accent-gold" />
        </div>
        {title}
      </h3>
      {children}
    </div>
  </motion.div>
);

const PersonalDetailsPage = () => {
  const { currentApplication, fetchData } = useOutletContext();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required";
    if (!formData.address.trim() || formData.address.length < 10) newErrors.address = 'Please enter a complete address';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await applicantAuthService.savePersonal(applicationId, formData);
      await fetchData(); 
      setSuccess(true);
      setTimeout(() => {
        navigate(`/admissions/application/${applicationId}/academic`);
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Failed to save details. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative group p-[2px] rounded-[2.5rem] overflow-hidden">
      {/* Outer pulsing animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 via-transparent to-accent-gold/20 group-hover:from-accent-gold/50 group-hover:via-accent-gold/20 group-hover:to-accent-gold/50 transition-all duration-1000 animate-pulse-slow"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-gray-50/90 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden w-full"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent-gold/20 to-transparent rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-900/10 to-transparent rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3" />

      <motion.div variants={itemVariants} initial="hidden" animate="show" className="mb-6 flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-50 to-white shadow-sm border border-primary-100 text-primary-800 text-[10px] font-black tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            Application Step 1 of 4
          </div>
          <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-800 tracking-tight drop-shadow-sm">Personal Details</h1>
        </div>
      </motion.div>

      <motion.form 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        onSubmit={handleSubmit} 
        className="space-y-4 relative z-10"
      >
        
        <FormSection title="Basic Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="md:col-span-2">
              <FloatingInput 
                icon={User} label="Student Full Name" name="studentName"
                value={formData.studentName} onChange={handleChange} required error={errors.studentName}
              />
            </div>
            
            <FloatingInput 
              icon={Calendar} label="Date of Birth" name="dob" type="date"
              value={formData.dob} onChange={handleChange} required error={errors.dob}
            />
            
            <FloatingInput 
              icon={User} label="Gender" name="gender" as="select"
              value={formData.gender} onChange={handleChange} required error={errors.gender}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </FloatingInput>
          </div>
        </FormSection>

        <FormSection title="Parent / Guardian Details" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <FloatingInput 
              icon={User} label="Father's Name" name="fatherName"
              value={formData.fatherName} onChange={handleChange} required error={errors.fatherName}
            />
            
            <FloatingInput 
              icon={User} label="Mother's Name" name="motherName"
              value={formData.motherName} onChange={handleChange} required error={errors.motherName}
            />
          </div>
        </FormSection>

        <FormSection title="Contact Information" icon={MapPin}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-2">
            <FloatingInput 
              icon={MapPin} label="Permanent Address" name="address" as="textarea"
              value={formData.address} onChange={handleChange} required error={errors.address}
            />
          </div>
        </FormSection>

        {errors.submit && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {errors.submit}
          </div>
        )}

        <motion.div variants={itemVariants} className="pt-2 flex justify-end">
          <motion.button 
            type="submit" 
            disabled={isSubmitting || success}
            whileHover={{ scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden font-black text-sm py-3 px-8 rounded-xl shadow-xl transition-all flex items-center gap-2 group disabled:opacity-80 ${
              success ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-emerald-500/30' : 'bg-gradient-to-r from-primary-950 to-primary-800 text-white shadow-primary-950/30'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Details...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <span>Save & Continue</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </>
            )}
            
            {/* High-end glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -inset-full top-0 z-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 group-hover:animate-shine" />
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
    </div>
  );
};

export default PersonalDetailsPage;
