import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Phone } from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { slideUp } from '../../animations/variants';

const AdmissionsCTA = ({ data }) => {
  const { title, subtitle, buttonText, buttonLink } = data || {
    title: 'Secure Your <span className="text-accent-gold">Global Future</span> Today.',
    subtitle: 'Join a legacy of engineering excellence. Applications for the academic year 2026-27 are now open for all undergraduate and postgraduate programs.',
    buttonText: 'Apply Now',
    buttonLink: '/admissions/registration-2026#apply-process'
  };

  return (
    <Section className="pb-0 overflow-hidden">
      <Container>
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative bg-primary-900 rounded-[2rem] p-12 md:p-20 overflow-hidden"
        >
          {/* Background Patterns */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-gold/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-accent-gold mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-sm">Admissions Open 2026-27</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight" dangerouslySetInnerHTML={{ __html: title }}>
              </h2>
              <p className="text-xl text-primary-200 mb-10 leading-relaxed">
                {subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => window.location.href = buttonLink}
                  className="btn-accent px-10 py-4 text-lg"
                >
                  {buttonText}
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full transition-all">
                  <Phone className="w-5 h-5" />
                  Counseling: 1800-XXX-XXXX
                </button>
              </div>

              <div className="flex items-center gap-8 text-primary-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent-gold" />
                  <span className="text-sm font-medium">Last Date: 15 July 2026</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <h4 className="text-white font-bold text-xl mb-6">Why Choose CAHCET?</h4>
                <ul className="grid gap-4">
                  {[
                    '100% Placement Assistance',
                    'Industry 4.0 Oriented Labs',
                    'Merit Scholarships Available',
                    'Strong Alumni Network (15k+)',
                    'Eco-friendly 100 Acre Campus'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary-100">
                      <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-accent-gold rounded-full" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

export default AdmissionsCTA;
