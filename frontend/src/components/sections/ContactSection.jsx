import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Section, Container } from '../ui/Layout';
import { slideUp } from '../../animations/variants';

const ContactSection = ({ data }) => {
  const visible = data?.visible ?? true;
  if (!visible) return null;

  const title = data?.title || "We're Here to Help You Grow";
  const address = data?.address || "Hakeem Nagar, Melvisharam - 632 509, Ranipet District, Tamil Nadu, India.";
  const phone = data?.phone || "+91 4172 267387 / 266487";
  const email = data?.email || "info@cahcet.in";

  return (
    <Section id="contact" className="bg-primary-50">
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
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                  <MapPin className="text-primary-900 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-900 mb-1">Visit Us</h4>
                  <p className="text-primary-500">{address}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                  <Phone className="text-primary-900 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-900 mb-1">Call Us</h4>
                  <p className="text-primary-500">{phone}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                  <Mail className="text-primary-900 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-900 mb-1">Email Us</h4>
                  <p className="text-primary-500">{email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-primary-100"
          >
            <form className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Full Name</label>
                  <input type="text" placeholder="John Doe" className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Subject</label>
                <select className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors">
                  <option>Admissions Enquiry</option>
                  <option>General Information</option>
                  <option>Placements Enquiry</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-primary-900 uppercase tracking-wider">Message</label>
                <textarea rows="4" placeholder="How can we help you?" className="bg-white border border-primary-100 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="btn-primary w-full group">
                Send Message
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default ContactSection;
