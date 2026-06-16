import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ChevronRight, Send, Check, Loader2, ExternalLink, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { cn } from '../utils/cn';
import { cmsService } from '../services/cmsService';

const ContactPage = () => {
  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await cmsService.getPage('contact');
        const content = {};
        if (res.data && res.data.sections) {
          res.data.sections.forEach(sec => {
            const key = sec.sectionKey.replace('contact.', '');
            try {
              content[key] = JSON.parse(sec.content);
            } catch {
              content[key] = sec.content;
            }
          });
        }
        setCmsData(content.main || {});
      } catch (err) {
        console.error("Failed to load contact data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      
      // Reset success state after a while
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col relative overflow-hidden font-sans">
      <Navbar />

      {/* Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary-50/30 rounded-full blur-[130px]" />
      </div>

      <main className="flex-1 relative z-10">
        {/* 1. Cinematic Hero Section */}
        <header className="relative pt-40 pb-24 overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white text-center rounded-b-[2.5rem] shadow-xl z-10">
          {/* Geometric structural circles/effects */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <div className="absolute -left-16 -top-16 w-64 h-64 border border-white rounded-full" />
            <div className="absolute right-10 bottom-5 w-80 h-80 border border-white/40 rounded-full" />
            <div className="absolute left-1/3 top-10 w-96 h-96 border border-white/20 rounded-full" />
          </div>
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-4xl px-6 mx-auto"
          >
            <div className="inline-flex items-center justify-center gap-2 text-accent-gold text-xs md:text-sm font-bold tracking-widest uppercase mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span>Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight text-white">
              {cmsData.title || 'Contact Us'}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              We are here to help. Reach out to us for admissions, support, or any inquiries about our institution.
            </p>
          </motion.div>
        </header>

        {/* 2. Contact Information Showcase */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
                className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-50 rounded-[2rem] p-8 shadow-xl hover:shadow-[0_20px_40px_rgba(30,58,138,0.12)] flex flex-col justify-between group relative overflow-hidden border-2 border-slate-100 hover:border-primary-200 transition-all duration-500"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl group-hover:bg-accent-gold/20 transition-colors duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all text-primary-600 shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Mailing Address</h3>
                  <a href="https://maps.app.goo.gl/88DFCxj4PDQGCSNm9" target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium leading-relaxed text-sm whitespace-pre-wrap hover:text-primary-600 transition-colors block">
                    {cmsData.address || 'C. Abdul Hakeem College of Engineering & Technology,\nMelvisharam-632509, Vellore District,\nTamil Nadu, INDIA.'}
                  </a>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-50 rounded-[2rem] p-8 shadow-xl hover:shadow-[0_20px_40px_rgba(30,58,138,0.12)] flex flex-col justify-between group relative overflow-hidden border-2 border-slate-100 hover:border-primary-200 transition-all duration-500"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl group-hover:bg-accent-gold/20 transition-colors duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all text-primary-600 shadow-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Phone Numbers</h3>
                  <div className="space-y-3 text-slate-600 font-medium text-sm flex flex-col">
                    {cmsData.phones && cmsData.phones.length > 0 ? (
                      cmsData.phones.map((phone, idx) => (
                        <a key={idx} href={`tel:${phone}`} className="inline-flex items-center gap-2 hover:text-primary-600 text-slate-800 transition-colors block font-bold bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-primary-100 shadow-sm w-fit">
                          <Phone className="w-4 h-4 text-primary-500" /> {phone}
                        </a>
                      ))
                    ) : (
                      <a href="tel:+914172267387" className="inline-flex items-center gap-2 hover:text-primary-600 text-slate-800 transition-colors block font-bold bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-primary-100 shadow-sm w-fit">
                        <Phone className="w-4 h-4 text-primary-500" /> +91-4172-267387
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-50 rounded-[2rem] p-8 shadow-xl hover:shadow-[0_20px_40px_rgba(30,58,138,0.12)] flex flex-col justify-between group relative overflow-hidden border-2 border-slate-100 hover:border-primary-200 transition-all duration-500"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl group-hover:bg-accent-gold/20 transition-colors duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all text-primary-600 shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Email Support</h3>
                  <div className="space-y-3 text-slate-600 font-medium text-sm">
                    {cmsData.emails && cmsData.emails.length > 0 ? (
                      cmsData.emails.map((email, idx) => (
                        <a key={idx} href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-primary-600 text-slate-800 transition-colors block truncate font-bold bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-primary-100 shadow-sm w-full">
                          <Mail className="w-4 h-4 text-primary-500" /> {email}
                        </a>
                      ))
                    ) : (
                      <a href="mailto:info.cahcet@gmail.com" className="inline-flex items-center gap-2 hover:text-primary-600 text-slate-800 transition-colors block truncate font-bold bg-slate-50 hover:bg-primary-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-primary-100 shadow-sm w-full">
                        <Mail className="w-4 h-4 text-primary-500" /> info.cahcet@gmail.com
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. Contact Form & Map Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12 items-stretch">
              {/* Form Block */}
              <div className="w-full lg:w-7/12">
                <div className="bg-gradient-to-br from-white via-primary-50/30 to-accent-gold/5 border-2 border-primary-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-accent-gold to-primary-600" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-primary-600 text-xs font-bold tracking-widest uppercase">Send a Message</div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-950">Admissions & Support</h2>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium mb-10 text-base">Fill out the form below and our team will get back to you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div className="relative group">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-slate-100 hover:border-primary-200 focus:border-primary-500 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-slate-800 font-medium placeholder-transparent peer focus:ring-4 focus:ring-primary-500/10 focus:shadow-md"
                          placeholder="First Name"
                        />
                        <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-2 rounded-full">
                          First Name
                        </label>
                      </div>
                      {/* Last Name */}
                      <div className="relative group">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-slate-100 hover:border-primary-200 focus:border-primary-500 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-slate-800 font-medium placeholder-transparent peer focus:ring-4 focus:ring-primary-500/10 focus:shadow-md"
                          placeholder="Last Name"
                        />
                        <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-2 rounded-full">
                          Last Name
                        </label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(
                          "w-full bg-white border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-slate-800 font-medium placeholder-transparent peer focus:ring-4 focus:shadow-md",
                          errors.email ? "border-amber-400 hover:border-amber-500 focus:border-amber-500 focus:ring-amber-500/10" : "border-slate-100 hover:border-primary-200 focus:border-primary-500 focus:ring-primary-500/10"
                        )}
                        placeholder="Email Address"
                      />
                      <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-2 rounded-full">
                        Email Address *
                      </label>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-amber-500 text-xs font-bold mt-1 absolute"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Subject */}
                    <div className="relative group">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white border-2 border-slate-100 hover:border-primary-200 focus:border-primary-500 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-slate-800 font-medium placeholder-transparent peer focus:ring-4 focus:ring-primary-500/10 focus:shadow-md"
                        placeholder="Subject"
                      />
                      <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-2 rounded-full">
                        Subject
                      </label>
                    </div>

                    {/* Message */}
                    <div className="relative group">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={cn(
                          "w-full bg-white border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-slate-800 font-medium placeholder-transparent peer resize-none focus:ring-4 focus:shadow-md",
                          errors.message ? "border-amber-400 hover:border-amber-500 focus:border-amber-500 focus:ring-amber-500/10" : "border-slate-100 hover:border-primary-200 focus:border-primary-500 focus:ring-primary-500/10"
                        )}
                        placeholder="Your Message"
                      />
                      <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all duration-300 pointer-events-none peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-2 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-2 rounded-full">
                        Your Message *
                      </label>
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-amber-500 text-xs font-bold mt-1 absolute"
                          >
                            {errors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={cn(
                        "w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 border-2",
                        isSuccess 
                          ? "bg-amber-500 text-white border-amber-600 shadow-lg" 
                          : "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white border-transparent shadow-[0_10px_20px_rgba(30,58,138,0.2)] hover:shadow-[0_15px_30px_rgba(30,58,138,0.3)]"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Message Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>

              {/* Map Block */}
              <div className="w-full lg:w-5/12 flex">
                <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border-2 border-primary-100 flex flex-col justify-between min-h-[400px]">
                  
                  {/* Floating Open In Maps Button */}
                  <div className="absolute top-6 right-6 z-10">
                    <a href="https://maps.app.goo.gl/88DFCxj4PDQGCSNm9" target="_blank" rel="noopener noreferrer" className="bg-white/95 backdrop-blur text-primary-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-primary-600 hover:text-white transition-all flex items-center gap-2 border border-primary-100 hover:scale-105 transform">
                      <ExternalLink className="w-4 h-4" /> Open in Maps
                    </a>
                  </div>

                  {cmsData.mapUrl ? (
                    <iframe src="https://maps.google.com/maps?q=C.%20Abdul%20Hakeem%20College%20of%20Engineering%20%26%20Technology&t=m&z=17&ie=UTF8&iwloc=&output=embed" className="absolute inset-0 w-full h-full border-0 grayscale-[10%] hover:grayscale-0 transition-all duration-700 hover:scale-105" allowFullScreen="" loading="lazy"></iframe>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-950 to-primary-900 flex flex-col items-center justify-center p-8 text-center">
                      <MapPin className="w-12 h-12 text-accent-gold mb-4 animate-bounce" />
                      <h3 className="text-xl font-bold text-white mb-2">College Location</h3>
                      <p className="text-primary-200 font-medium text-sm mb-6 max-w-sm">
                        Melvisharam, Vellore District, Tamil Nadu.
                      </p>
                    </div>
                  )}
                  
                  {/* Location Card Overlay */}
                  <div className="relative mt-auto m-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl border-2 border-primary-100 shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-slate-800 transform hover:-translate-y-1 transition-all duration-300">
                    <h4 className="text-base font-bold text-primary-950 mb-1">C. Abdul Hakeem College</h4>
                    <p className="text-sm text-primary-600 font-medium">Engineering & Technology</p>
                    <div className="mt-4 pt-4 border-t-2 border-primary-50 flex justify-between items-center text-sm font-bold">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-accent-gold" />
                        <span>{cmsData.timings || 'Mon - Sat: 9AM - 5PM'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Contact Centers / Offices Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-primary-600 text-xs font-bold tracking-widest uppercase mb-2">
                <span className="w-10 h-[2px] bg-primary-600" />
                <span>Directories</span>
                <span className="w-10 h-[2px] bg-primary-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-950">Contact Centers</h2>
              <p className="text-slate-500 mt-2 font-light text-lg">Direct lines to administrative and departmental heads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(cmsData.departments || []).map((office, index) => {
                return (
                  <motion.div
                    key={office.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                    className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-primary-50 border-2 border-slate-100 p-6 rounded-[2rem] shadow-xl hover:shadow-[0_20px_40px_rgba(30,58,138,0.12)] hover:border-primary-200 transition-all duration-500 flex flex-col justify-between min-h-[16rem] group relative overflow-hidden transform"
                  >
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl group-hover:bg-accent-gold/20 transition-colors duration-500" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all duration-300 shadow-sm text-primary-600 group-hover:scale-110">
                        <User className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2 bg-primary-50 border border-primary-100 inline-block px-3 py-1 rounded-full">{office.person}</h4>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors leading-tight mb-4">{office.name}</h3>
                      <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600 font-medium">
                        {office.email && (
                          <p className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 shadow-sm group-hover:border-primary-100 group-hover:bg-primary-50/30 transition-all">
                            <Mail className="w-4 h-4 text-primary-500" />
                            <a href={`mailto:${office.email}`} className="hover:text-primary-600 transition-colors truncate">{office.email}</a>
                          </p>
                        )}
                        {office.phone && (
                          <p className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 shadow-sm group-hover:border-primary-100 group-hover:bg-primary-50/30 transition-all">
                            <Phone className="w-4 h-4 text-primary-500" />
                            <a href={`tel:${office.phone.split('#')[0].trim()}`} className="hover:text-primary-600 transition-colors">{office.phone}</a>
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
