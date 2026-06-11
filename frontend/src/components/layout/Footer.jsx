import React, { useState, useEffect } from 'react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Container } from '../ui/Layout';
import { footerLinks } from '../../data/navigation';
import logoImg from '../../assets/images/logo.jfif';
import { cmsService } from '../../services/cmsService';

const Footer = () => {
  const [footerData, setFooterData] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await cmsService.getPage('system');
        const sections = res.data?.sections || [];
        const footerSection = sections.find(s => s.sectionKey === 'system.footer');
        if (footerSection) {
          setFooterData(JSON.parse(footerSection.content));
        }
      } catch (err) {
        console.error("Failed to load footer settings", err);
      }
    };
    fetchSettings();
  }, []);

  const { tagline, facebook, twitter, instagram, linkedin, youtube } = footerData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-950 text-white pt-12 md:pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10 lg:mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoImg} alt="CAHCET Logo" className="w-14 h-14 object-contain" />
              <span className="text-2xl font-display font-bold">CAHCET</span>
            </div>
            <p className="text-primary-300 mb-8 leading-relaxed">
              {tagline || 'C. Abdul Hakeem College of Engineering and Technology is committed to providing world-class technical education and fostering innovation.'}
            </p>
            <div className="flex gap-4">
              {facebook && facebook !== '#' && <a href={facebook} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-gold hover:text-primary-950 transition-all"><Facebook className="w-5 h-5" /></a>}
              {twitter && twitter !== '#' && <a href={twitter} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-gold hover:text-primary-950 transition-all"><Twitter className="w-5 h-5" /></a>}
              {instagram && instagram !== '#' && <a href={instagram} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-gold hover:text-primary-950 transition-all"><Instagram className="w-5 h-5" /></a>}
              {linkedin && linkedin !== '#' && <a href={linkedin} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent-gold hover:text-primary-950 transition-all"><Linkedin className="w-5 h-5" /></a>}
              {/* Optional youtube icon if imported, leaving out for now as it's not in the original list but in CMS */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-4">
              {footerLinks.quickLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-300 hover:text-accent-gold transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Departments</h4>
            <ul className="space-y-4">
              {footerLinks.departments.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-300 hover:text-accent-gold transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">Newsletter</h4>
            <p className="text-primary-300 mb-6 text-sm">Subscribe to stay updated with the latest campus news and events.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-gold transition-colors text-white"
              />
              <button className="btn-primary w-full">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-primary-400 text-sm">
            © 2026 C. Abdul Hakeem College of Engineering and Technology. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 text-sm text-primary-400">
            <a
              href="/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-accent-gold transition-colors text-xs tracking-wider font-medium opacity-50 hover:opacity-100"
              title="Admin Panel"
            >
              Admin
            </a>
            <span className="text-primary-700 text-xs select-none hidden sm:inline">·</span>
            {footerLinks.legal.map(link => (
              <a key={link.name} href={link.href} className="hover:text-accent-gold transition-colors">{link.name}</a>
            ))}
          </div>
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center text-primary-950 hover:scale-110 transition-transform shadow-xl"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
