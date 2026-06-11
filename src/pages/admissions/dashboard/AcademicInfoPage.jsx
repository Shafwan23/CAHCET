import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Award, CalendarDays, ArrowRight } from 'lucide-react';
import { applicantAuthService } from '../../../services/applicantAuthService';

const AcademicInfoPage = () => {
  const { currentApplication, fetchData } = useOutletContext();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    institution: '',
    board: '',
    passingYear: '',
    percentage: '',
  });

  useEffect(() => {
    if (currentApplication) {
      setFormData({
        institution: currentApplication.academicInfo?.institution || '',
        board: currentApplication.academicInfo?.board || '',
        passingYear: currentApplication.academicInfo?.passingYear || '',
        percentage: currentApplication.academicInfo?.percentage || '',
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
      await applicantAuthService.saveAcademic(applicationId, formData);
      await fetchData(); // refresh context
      navigate(`/admissions/application/${applicationId}/course`);
    } catch (error) {
      console.error(error);
      alert('Failed to save academic info');
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
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary-950 mb-2">Academic Information</h1>
        <p className="text-gray-500">Details of your previous educational qualifications.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Previous Institution Name</label>
          <div className="relative">
            <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input 
              type="text" 
              name="institution"
              required
              placeholder="E.g., ABC Higher Secondary School"
              value={formData.institution}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Board of Education</label>
          <select
            name="board"
            required
            value={formData.board}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors appearance-none"
          >
            <option value="" disabled>Select Board</option>
            <option value="State Board">State Board</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Year of Passing</label>
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input 
                type="number" 
                name="passingYear"
                min="2010"
                max="2030"
                required
                placeholder="E.g., 2024"
                value={formData.passingYear}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Percentage / CGPA</label>
            <div className="relative">
              <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input 
                type="number" 
                step="0.01"
                name="percentage"
                required
                placeholder="E.g., 85.5 or 8.5"
                value={formData.percentage}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-between">
          <button 
            type="button" 
            onClick={() => navigate(`/admissions/application/${applicationId}/personal`)}
            className="text-gray-500 hover:text-gray-900 font-bold py-3.5 px-6 transition-colors"
          >
            Back
          </button>
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

export default AcademicInfoPage;
