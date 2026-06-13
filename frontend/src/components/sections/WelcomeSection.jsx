import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { slideUp, fadeIn } from '../../animations/variants';
import principalImg from '../../assets/images/principal.png';

const WelcomeSection = ({ data }) => {
  const { 
    title, 
    subtitle, 
    description, 
    mission,
    principalName,
    principalDesignation,
    principalImage,
    stat1Value,
    stat1Label,
    stat1Desc,
    stat2Value,
    stat2Label,
    stat2Desc
  } = data || {};
  return (
    <Section id="about" className="bg-white overflow-hidden relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Layout */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={principalImage || principalImg}
                alt="Principal's Message"
                className="w-full h-[300px] md:h-[450px] lg:h-[600px] object-cover"
              />
            </div>
            {/* Accent Elements */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 md:w-64 md:h-64 bg-accent-gold/10 rounded-full blur-3xl -z-0 hidden sm:block" />
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-primary-900/5 rounded-full blur-2xl -z-0" />

            <div className="relative md:absolute mt-4 md:mt-0 bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-lg z-20 border border-primary-50">
              <Quote className="text-accent-gold w-8 h-8 mb-4 opacity-50" />
              <p className="text-primary-900 italic font-medium mb-4">
                "{mission || 'Our mission is to nurture engineers who are not only technically proficient but also socially responsible leaders.'}"
              </p>
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-bold text-primary-900 text-sm">{principalName || 'Dr. M. Sasikumar'}</h4>
                  <p className="text-primary-500 text-xs">{principalDesignation || 'Principal, CAHCET'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div>
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">{title || 'Welcome to CAHCET'}</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-8 leading-tight">
                {subtitle || 'A Legacy of Engineering Excellence Since 1998'}
              </h2>
              <p className="text-lg text-primary-600 mb-6 leading-relaxed">
                {description || 'C. Abdul Hakeem College of Engineering and Technology (CAHCET) has been at the forefront of technical education for over two decades. Our institution is dedicated to providing a holistic learning environment that fosters innovation, critical thinking, and practical expertise.'}
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <span className="text-primary-900 font-bold">{stat1Value || '25+'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900">{stat1Label || 'Years of Legacy'}</h4>
                    <p className="text-sm text-primary-500">{stat1Desc || 'Excellence in education'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <span className="text-primary-900 font-bold">{stat2Value || '15k+'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900">{stat2Label || 'Alumni Globally'}</h4>
                    <p className="text-sm text-primary-500">{stat2Desc || 'Shaping the future'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default WelcomeSection;
