import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ChevronRight, Send, Check, Loader2, ExternalLink } from 'lucide-react';
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group hover:border-primary-600/30"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-accent-gold group-hover:text-primary-950 transition-colors text-primary-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary-950 mb-3">Mailing Address</h3>
                <p className="text-slate-600 font-light leading-relaxed text-sm whitespace-pre-wrap">
                  {cmsData.address || 'C. Abdul Hakeem College of Engineering & Technology,\nMelvisharam-632509, Vellore District,\nTamil Nadu, INDIA.'}
                </p>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group hover:border-primary-600/30"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-accent-gold group-hover:text-primary-950 transition-colors text-primary-600">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary-950 mb-3">Phone Numbers</h3>
                <div className="space-y-2 text-slate-600 font-light text-sm flex flex-col">
                  {cmsData.phones && cmsData.phones.length > 0 ? (
                    cmsData.phones.map((phone, idx) => (
                      <a key={idx} href={`tel:${phone}`} className="hover:text-primary-600 text-slate-800 transition-colors block font-medium">{phone}</a>
                    ))
                  ) : (
                    <p className="font-medium text-slate-800">+91-4172-267387</p>
                  )}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group hover:border-primary-600/30"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-accent-gold group-hover:text-primary-950 transition-colors text-primary-600">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary-950 mb-3">Email Support</h3>
                <div className="space-y-2 text-slate-600 font-light text-sm">
                  {cmsData.emails && cmsData.emails.length > 0 ? (
                    cmsData.emails.map((email, idx) => (
                      <p key={idx}><a href={`mailto:${email}`} className="hover:text-primary-600 text-slate-800 transition-colors block truncate font-medium">{email}</a></p>
                    ))
                  ) : (
                    <p><a href="mailto:info.cahcet@gmail.com" className="hover:text-primary-600 text-slate-800 transition-colors block truncate font-medium">info.cahcet@gmail.com</a></p>
                  )}
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
                <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
                  <div className="text-primary-600 text-sm font-bold tracking-widest uppercase mb-2">Send a Message</div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-950 mb-4">Admissions & Support</h2>
                  <p className="text-slate-500 font-light mb-10 text-base">Fill out the form below and our team will get back to you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-primary-600 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-800 font-light placeholder-transparent peer focus:ring-1 focus:ring-primary-600/20"
                          placeholder="First Name"
                        />
                        <label className="absolute left-4 top-3.5 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1">
                          First Name
                        </label>
                      </div>
                      {/* Last Name */}
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-primary-600 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-800 font-light placeholder-transparent peer focus:ring-1 focus:ring-primary-600/20"
                          placeholder="Last Name"
                        />
                        <label className="absolute left-4 top-3.5 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1">
                          Last Name
                        </label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(
                          "w-full bg-slate-50 border rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-800 font-light placeholder-transparent peer focus:ring-1",
                          errors.email ? "border-amber-500 focus:border-amber-500 focus:ring-amber-500/20" : "border-slate-200 focus:border-primary-600 focus:ring-primary-600/20"
                        )}
                        placeholder="Email Address"
                      />
                      <label className="absolute left-4 top-3.5 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1">
                        Email Address *
                      </label>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-amber-500 text-xs mt-1 absolute"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Subject */}
                    <div className="relative">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary-600 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-800 font-light placeholder-transparent peer focus:ring-1 focus:ring-primary-600/20"
                        placeholder="Subject"
                      />
                      <label className="absolute left-4 top-3.5 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1">
                        Subject
                      </label>
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={cn(
                          "w-full bg-slate-50 border rounded-xl px-4 py-3.5 outline-none transition-all duration-300 text-slate-800 font-light placeholder-transparent peer resize-none focus:ring-1",
                          errors.message ? "border-amber-500 focus:border-amber-500 focus:ring-amber-500/20" : "border-slate-200 focus:border-primary-600 focus:ring-primary-600/20"
                        )}
                        placeholder="Your Message"
                      />
                      <label className="absolute left-4 top-3.5 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary-600 peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary-600 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1">
                        Your Message *
                      </label>
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-amber-500 text-xs mt-1 absolute"
                          >
                            {errors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={cn(
                        "w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 border",
                        isSuccess 
                          ? "bg-amber-500 text-white border-transparent" 
                          : "bg-accent-gold text-primary-950 hover:bg-primary-950 hover:text-white border-transparent shadow-md"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Message Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Map Block */}
              <div className="w-full lg:w-5/12 flex">
                <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 flex flex-col justify-between min-h-[400px]">
                  {cmsData.mapUrl ? (
                    <iframe src={cmsData.mapUrl} className="absolute inset-0 w-full h-full border-0" allowFullScreen="" loading="lazy"></iframe>
                  ) : (
                    <div className="absolute inset-0 bg-primary-950 flex flex-col items-center justify-center p-8 text-center">
                      <MapPin className="w-12 h-12 text-accent-gold mb-4 animate-bounce" />
                      <h3 className="text-xl font-bold text-white mb-2">College Location</h3>
                      <p className="text-primary-200 font-light text-sm mb-6 max-w-sm">
                        Melvisharam, Vellore District, Tamil Nadu.
                      </p>
                    </div>
                  )}
                  
                  {/* Location Card Overlay */}
                  <div className="relative mt-auto m-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-slate-100 shadow-md text-slate-800">
                    <h4 className="text-sm font-bold text-slate-800 mb-1">C. Abdul Hakeem College</h4>
                    <p className="text-xs text-slate-500 font-light">Engineering & Technology</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(cmsData.departments || []).map((office, index) => {
                return (
                  <motion.div
                    key={office.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 flex flex-col justify-between min-h-[16rem] hover:-translate-y-1 group hover:border-primary-600/30"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-accent-gold group-hover:text-primary-950 transition-colors text-primary-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">{office.person}</h4>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{office.name}</h3>
                      <div className="space-y-1 mt-3 text-sm text-slate-500 font-light">
                        {office.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <a href={`mailto:${office.email}`} className="hover:text-primary-600 text-slate-600 transition-colors truncate">{office.email}</a>
                          </p>
                        )}
                        {office.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a href={`tel:${office.phone.split('#')[0].trim()}`} className="hover:text-primary-600 text-slate-600 transition-colors">{office.phone}</a>
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
