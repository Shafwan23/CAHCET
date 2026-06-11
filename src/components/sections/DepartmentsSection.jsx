import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { 
  Code, 
  Cpu, 
  Database, 
  Settings, 
  Radio, 
  Zap, 
  BrainCircuit, 
  Building2 
} from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { slideUp, staggerContainer } from '../../animations/variants';

const ICON_MAP = {
  Code, Cpu, Database, Settings, Radio, Zap, BrainCircuit, Building2
};

const DepartmentsSection = ({ data }) => {
  const navigate = useNavigate();

  const defaultDepartments = [
    { name: 'Computer Science', code: 'CSE', icon: 'Code', color: 'from-blue-500 to-primary-600' },
    { name: 'AI & Data Science', code: 'AIDS', icon: 'Database', color: 'from-primary-500 to-pink-600' },
    { name: 'Information Technology', code: 'IT', icon: 'Cpu', color: 'from-cyan-500 to-blue-600' },
    { name: 'Mechanical Engineering', code: 'MECH', icon: 'Settings', color: 'from-amber-500 to-amber-600' },
    { name: 'Electronics & Comm.', code: 'ECE', icon: 'Radio', color: 'from-amber-500 to-primary-600' },
    { name: 'Electrical & Electronics', code: 'EEE', icon: 'Zap', color: 'from-yellow-500 to-amber-600' },
    { name: 'AI & Machine Learning', code: 'AIML', icon: 'BrainCircuit', color: 'from-violet-500 to-primary-600' },
    { name: 'Civil Engineering', code: 'CIVIL', icon: 'Building2', color: 'from-slate-500 to-slate-700' },
  ];

  const departments = data?.items || defaultDepartments;
  const { subtitle, title, description } = data || {
    subtitle: 'Academic Departments',
    title: 'Future-Ready Engineering Programs',
    description: 'Our departments are equipped with state-of-the-art laboratories and led by industry experts to provide a comprehensive learning experience.'
  };
  return (
    <Section id="departments" className="bg-primary-50">
      <Container>
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">
            {title}
          </h2>
          <p className="max-w-2xl mx-auto text-primary-600 text-lg">
            {description}
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {departments.map((dept, idx) => (
            <motion.div
              key={dept.code}
              variants={slideUp}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/departments/${dept.code.toLowerCase()}`)}
              className="group relative bg-white p-8 rounded-2xl shadow-sm border border-primary-100 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Card Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              {/* Animated Border Glow */}
              <div className={`absolute inset-0 border-2 border-transparent group-hover:border-accent-gold/20 rounded-2xl transition-colors duration-300`} />
              
              <div className={cn(
                "w-14 h-14 rounded-xl mb-6 flex items-center justify-center text-white bg-gradient-to-br shadow-lg transform group-hover:scale-110 transition-transform duration-300",
                dept.color
              )}>
                {React.createElement(ICON_MAP[dept.icon] || Code, { className: "w-8 h-8" })}
              </div>
              
              <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-accent-gold transition-colors">{dept.name}</h3>
              <p className="text-primary-500 text-sm mb-6">Excellence in {dept.name} with industry integrated curriculum.</p>
              
              <div className="inline-flex items-center text-primary-900 font-bold text-sm relative group/btn pb-1 mt-auto">
                <span className="relative z-10">Explore {dept.code}</span>
                <span className="ml-2 transform group-hover/btn:translate-x-1 transition-transform">→</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-gold group-hover:w-full transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
};

export default DepartmentsSection;
