import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronRight, Contact } from 'lucide-react';
import { departmentAnimations } from '../../../animations/departmentAnimations';
import OptimizedImage from '../../ui/OptimizedImage';
import PremiumEmptyState from '../../ui/PremiumEmptyState';

const ContactCard = ({ contact }) => {
  return (
    <motion.div 
      variants={departmentAnimations.fadeUp}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-luxury hover:shadow-luxury-hover flex flex-col md:flex-row items-center p-8 md:p-10 gap-10 border border-primary-100 hover:border-accent-gold/50 transition-all duration-500 group will-change-transform hover:-translate-y-2 relative"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-accent-gold/10 transition-colors duration-700" />

      <div className="w-40 h-40 md:w-48 md:h-48 shrink-0 relative">
        <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-xl group-hover:bg-accent-gold/30 transition-colors duration-500" />
        <OptimizedImage
          src={contact.photo}
          alt={contact.name}
          containerClassName="w-full h-full rounded-full border-[6px] border-white shadow-xl relative z-10"
        />
      </div>

      <div className="flex-1 text-center md:text-left z-10">
        <div className="inline-block px-4 py-1.5 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-accent-gold/20">
          {contact.role}
        </div>
        <h3 className="font-display font-bold text-3xl text-primary-900 mb-2">{contact.name}</h3>
        
        <div className="flex flex-col gap-4 mt-8">
          <a 
            href={`mailto:${contact.email}`}
            className="flex items-center justify-center md:justify-start gap-4 text-primary-600 hover:text-primary-900 transition-colors group/link"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center group-hover/link:bg-accent-gold/20 group-hover/link:text-accent-gold transition-colors border border-primary-100 group-hover/link:border-accent-gold/30">
              <Mail className="w-5 h-5" />
            </div>
            <span className="font-medium text-lg">{contact.email}</span>
          </a>
          <a 
            href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center md:justify-start gap-4 text-primary-600 hover:text-primary-900 transition-colors group/link"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center group-hover/link:bg-accent-gold/20 group-hover/link:text-accent-gold transition-colors border border-primary-100 group-hover/link:border-accent-gold/30">
              <Phone className="w-5 h-5" />
            </div>
            <span className="font-medium text-lg">{contact.phone}</span>
          </a>
        </div>
      </div>
      
      <div className="shrink-0 w-full md:w-auto mt-6 md:mt-0 z-10">
         <a 
            href={`mailto:${contact.email}`}
            className="block w-full text-center px-10 py-5 bg-primary-900 hover:bg-primary-950 text-white rounded-2xl font-bold transition-all shadow-luxury hover:shadow-luxury-hover border border-transparent hover:border-white/20"
          >
            Send Message
          </a>
      </div>
    </motion.div>
  );
};

const ContactSection = ({ data }) => {
  if (!data || data.length === 0) {
    return <PremiumEmptyState title="Contact Information Updating" message="Department contact details are currently being updated." icon={Contact} />;
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl pb-4 mb-8 border-b border-primary-100/50 pt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-400 text-xs font-bold tracking-widest uppercase mb-2">
            <span>Department</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-accent-gold">Contact Us</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-900">Get in Touch</h2>
        </div>
      </div>

      <motion.div 
        variants={departmentAnimations.staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {data.map((contact, index) => (
          <ContactCard key={index} contact={contact} />
        ))}
        
        {/* General Location Card */}
        <motion.div 
          variants={departmentAnimations.fadeUp}
          className="bg-primary-950 rounded-[2.5rem] p-10 flex items-center gap-8 text-white overflow-hidden relative shadow-luxury"
        >
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent-gold opacity-10 rounded-full blur-3xl animate-pulse" />
          
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center shrink-0 border border-white/20 relative z-10 backdrop-blur-md">
            <MapPin className="w-10 h-10 text-accent-gold" />
          </div>
          <div className="relative z-10">
            <h4 className="font-display font-bold text-2xl mb-2 text-white">Department Location</h4>
            <p className="text-primary-200 text-lg">Main Tech Block, CAHCET Campus, Melvisharam, Tamil Nadu 632509</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactSection;
