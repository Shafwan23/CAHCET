import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { slideUp } from '../../animations/variants';
import apiClient from '../../services/authService';

const ContactSection = ({ data }) => {
  const visible = data?.visible ?? true;
  if (!visible) return null;

  const title = data?.title || "We're Here to Help You Grow";
  const address = data?.address || "Hakeem Nagar, Melvisharam - 632 509, Ranipet District, Tamil Nadu, India.";
  const phone = data?.phone || "+91 4172 267387 / 266487";
  const email = data?.email || "info@cahcet.in";

  const [formState, setFormState] = useState({ name: '', email: '', subject: 'Admissions Enquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiClient.post('/contact', formState);
      setSuccess(true);
      setFormState({ name: '', email: '', subject: 'Admissions Enquiry', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPhoneLink = (p) => {
    // Extract first valid sequence of numbers for the tel link
    const digits = p.match(/\+?\d[\d\-\s]+/);
    return digits ? `tel:${digits[0].replace(/[\s-]/g, '')}` : `tel:${p}`;
  };

  return (
    <Section id="contact" className="bg-primary-50 relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-8 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-primary-600 mb-12">
              Have questions about admissions, programs, or campus life? Reach out to us, and our team will get back to you within 24 hours.
            </p>
 
            <div className="space-y-8">
              <a href={`https://maps.google.com/?q=${encodeURIComponent('CAHCET ' + address)}`} target="_blank" rel="noreferrer" className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 group-hover:bg-primary-900 group-hover:text-white transition-colors">
                  <MapPin className="text-primary-900 group-hover:text-white transition-colors w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-900 mb-1 group-hover:text-accent-gold transition-colors">Visit Us</h4>
                  <p className="text-primary-500">{address}</p>
                </div>
              </a>
              <a href={getPhoneLink(phone)} className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 group-hover:bg-primary-900 group-hover:text-white transition-colors">
                  <Phone className="text-primary-900 group-hover:text-white transition-colors w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-900 mb-1 group-hover:text-accent-gold transition-colors">Call Us</h4>
                  <p className="text-primary-500">{phone}</p>
                </div>
              </a>
              <a href={`mailto:${email}`} className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 group-hover:bg-primary-900 group-hover:text-white transition-colors">
                  <Mail className="text-primary-900 group-hover:text-white transition-colors w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-900 mb-1 group-hover:text-accent-gold transition-colors">Email Us</h4>
                  <p className="text-primary-500">{email}</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-primary-100 relative overflow-hidden"
          >
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">Message Sent!</h3>
                  <p className="text-primary-600">Thank you for reaching out. Our team will get back to you shortly.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="grid gap-6">
              {error && <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-lg">{error}</div>}
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formState.name}
                    onChange={e => setFormState(p => ({...p, name: e.target.value}))}
                    placeholder="John Doe" 
                    className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors" 
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={formState.email}
                    onChange={e => setFormState(p => ({...p, email: e.target.value}))}
                    placeholder="john@example.com" 
                    className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors" 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Subject</label>
                <select 
                  value={formState.subject}
                  onChange={e => setFormState(p => ({...p, subject: e.target.value}))}
                  className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors"
                >
                  <option>Admissions Enquiry</option>
                  <option>General Information</option>
                  <option>Placements Enquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Message</label>
                <textarea 
                  required 
                  rows="4" 
                  value={formState.message}
                  onChange={e => setFormState(p => ({...p, message: e.target.value}))}
                  placeholder="How can we help you?" 
                  className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full group flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default ContactSection;
