import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Radio, Zap, Compass, Wrench, Database, BrainCircuit, Network, Terminal, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { applicantAuthService } from '../../../services/applicantAuthService';

const COURSES = [
  { id: 'cse', name: 'B.E. Computer Science and Engineering', icon: Cpu, type: 'UG' },
  { id: 'ece', name: 'B.E. Electronics & Communication', icon: Radio, type: 'UG' },
  { id: 'eee', name: 'B.E. Electrical & Electronics', icon: Zap, type: 'UG' },
  { id: 'civil', name: 'B.E. Civil Engineering', icon: Compass, type: 'UG' },
  { id: 'mech', name: 'B.E. Mechanical Engineering', icon: Wrench, type: 'UG' },
  { id: 'aids', name: 'B.Tech AI & Data Science', icon: Database, type: 'UG' },
  { id: 'aiml', name: 'B.Tech AI & Machine Learning', icon: BrainCircuit, type: 'UG' },
  { id: 'it', name: 'B.Tech Information Technology', icon: Network, type: 'UG' },
  { id: 'mca', name: 'Master of Computer Applications', icon: Terminal, type: 'PG' },
  { id: 'mba', name: 'Master of Business Administration', icon: Briefcase, type: 'PG' },
];

const CourseSelectionPage = () => {
  const { currentApplication, fetchData } = useOutletContext();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (currentApplication?.courseChoice) {
      setSelectedCourse(currentApplication.courseChoice);
    }
  }, [currentApplication]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a course to continue.");
      return;
    }
    setIsSubmitting(true);
    try {
      await applicantAuthService.saveCourse(applicationId, selectedCourse);
      await fetchData(); // refresh context
      navigate(`/admissions/application/${applicationId}/payment`);
    } catch (error) {
      console.error(error);
      alert('Failed to save course choice');
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
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary-950 mb-2">Choose Course</h1>
        <p className="text-gray-500">Select the program you wish to apply for.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 border-b pb-2">Under-Graduate Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSES.filter(c => c.type === 'UG').map(course => {
              const Icon = course.icon;
              const isSelected = selectedCourse === course.id;
              return (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`
                    cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4
                    ${isSelected ? 'border-accent-gold bg-accent-gold/5 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-accent-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-primary-950' : 'text-gray-700'}`}>{course.name}</h4>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-accent-gold" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 border-b pb-2">Post-Graduate Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSES.filter(c => c.type === 'PG').map(course => {
              const Icon = course.icon;
              const isSelected = selectedCourse === course.id;
              return (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`
                    cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4
                    ${isSelected ? 'border-accent-gold bg-accent-gold/5 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-accent-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-primary-950' : 'text-gray-700'}`}>{course.name}</h4>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-accent-gold" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 flex justify-between">
          <button 
            type="button" 
            onClick={() => navigate(`/admissions/application/${applicationId}/academic`)}
            className="text-gray-500 hover:text-gray-900 font-bold py-3.5 px-6 transition-colors"
          >
            Back
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting || !selectedCourse}
            className="bg-primary-950 hover:bg-primary-900 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
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

export default CourseSelectionPage;
