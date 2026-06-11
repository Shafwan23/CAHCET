import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react';
import { navigationLinks } from '../../data/navigation';
import { cn } from '../../utils/cn';
import { useScroll } from '../../hooks/useScroll';
import { Container } from '../ui/Layout';
import logoImg from '../../assets/images/logo.jfif';
import { cmsService } from '../../services/cmsService';

const Navbar = () => {
  const [brandName, setBrandName] = useState('CAHCET');
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const scrolled = useScroll(20);
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await cmsService.getPage('system');
        const sections = res.data?.sections || [];
        const navbarSection = sections.find(s => s.sectionKey === 'system.navbar');
        if (navbarSection) {
          const content = JSON.parse(navbarSection.content);
          if (content.brandName) setBrandName(content.brandName);
        }
      } catch (err) {
        console.error("Failed to load navbar settings", err);
      }
    };
    fetchSettings();
  }, []);

  const heroPages = ['/', '/about/institution'];
  const hasHero = heroPages.includes(location.pathname);
  const isSolid = !hasHero || scrolled;

  const handleHomeClick = (e, href) => {
    if (href === '/') {
      e.preventDefault();
      if (window.location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-[100] transition-all duration-300',
          isSolid
            ? 'bg-primary-950/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3'
            : 'bg-gradient-to-b from-black/40 to-transparent py-6'
        )}
      >
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          className="flex items-center gap-3 group"
          onClick={(e) => handleHomeClick(e, '/')}
        >
          <div className="p-1 transition-transform duration-300 group-hover:scale-105">
            <img src={logoImg} alt="CAHCET Logo" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold leading-none text-white">{brandName || 'CAHCET'}</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-white/70">Engineering Excellence</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navigationLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => {
                setActiveDropdown(link.name);
                if (link.megaMenu) {
                  setActiveSubmenu(link.megaMenu[0].title);
                }
              }}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setActiveSubmenu(null);
              }}
            >
              <a
                href={link.href || '#'}
                onClick={(e) => handleHomeClick(e, link.href)}
                className={cn(
                  "flex items-center gap-1 font-medium text-sm transition-colors hover:text-accent-gold",
                  "text-white"
                )}
              >
                {link.name}
                {(link.dropdown || link.megaMenu) && <ChevronDown className="w-4 h-4" />}
              </a>

              <AnimatePresence>
                {activeDropdown === link.name && (link.dropdown || link.megaMenu) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute top-full pt-4",
                      link.megaMenu ? "-left-48 w-[600px]" : "left-0 w-64"
                    )}
                  >
                    <div className="bg-primary-950/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] rounded-xl p-6 text-white">
                      {link.dropdown && (
                        <div className="grid gap-2">
                          {link.dropdown.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="text-white/70 hover:text-accent-gold transition-colors block py-1 text-sm font-light"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      )}
                      {link.megaMenu && (
                        <div className="flex gap-4">
                          {/* Level 1: Categories */}
                          <div className="w-1/4 space-y-2">
                            {link.megaMenu.map((group) => (
                              <button
                                key={group.title}
                                onMouseEnter={() => setActiveSubmenu(group.title)}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                  activeSubmenu === group.title
                                    ? "bg-white/10 text-accent-gold"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                )}
                              >
                                {group.title}
                              </button>
                            ))}
                          </div>
                          
                          {/* Level 2: Links (Floating Submenu Area) */}
                          <div className="w-3/4 bg-primary-950 border border-white/10 rounded-lg p-4">
                            {link.megaMenu.map((group) => (
                              <div 
                                key={group.title}
                                className={cn(
                                  "grid grid-cols-2 gap-x-6 gap-y-2",
                                  activeSubmenu === group.title ? "grid" : "hidden"
                                )}
                              >
                                {group.links.map((item) => (
                                  <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-white/70 hover:text-accent-gold transition-colors text-sm font-light py-1"
                                  >
                                    {item.name}
                                  </a>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-3 -mr-3 text-white focus:outline-none flex items-center justify-center"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-7 h-7" />
        </button>
      </Container>
    </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 bg-primary-950 z-[110] lg:hidden overflow-y-auto"
          >
            <div className="p-6 flex flex-col min-h-screen">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <img src={logoImg} alt="CAHCET Logo" className="w-12 h-12 object-contain" />
                  <span className="text-white text-xl font-display font-bold">{brandName || 'CAHCET'}</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white p-2">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navigationLinks.map((link) => (
                  <MobileLink key={link.name} link={link} close={() => setIsOpen(false)} />
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileLink = ({ link, close }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSub = link.dropdown || link.megaMenu;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-3 border-b border-white/10">
        {hasSub ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl text-white font-medium text-left flex-1 py-1"
          >
            {link.name}
          </button>
        ) : (
          <a
            href={link.href}
            className="text-xl text-white font-medium flex-1 py-1"
            onClick={close}
          >
            {link.name}
          </a>
        )}
        {hasSub && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 -mr-3 flex items-center justify-center"
            aria-label={`Toggle ${link.name} submenu`}
          >
            <ChevronDown className={cn("text-white/50 w-6 h-6 transition-transform duration-300", isOpen && "rotate-180 text-accent-gold")} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && hasSub && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white/5 mt-2 rounded-xl"
          >
            <div className="p-4 grid gap-3">
              {link.name === 'Departments' && (
                <a 
                  href="/departments" 
                  onClick={close} 
                  className="text-accent-gold font-semibold text-base py-1 border-b border-white/5 block mb-2 hover:text-white transition-colors"
                >
                  Departments Overview
                </a>
              )}
              {link.dropdown && link.dropdown.map(item => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={close} 
                  className="text-white/70 hover:text-white transition-colors text-base py-1.5 block"
                >
                  {item.name}
                </a>
              ))}
              {link.megaMenu && link.megaMenu.map(group => (
                <div key={group.title} className="mb-4 last:mb-0">
                  <div className="text-accent-gold text-xs uppercase tracking-widest font-bold mb-2">{group.title}</div>
                  <div className="grid gap-2 pl-2">
                    {group.links.map(item => (
                      <a 
                        key={item.name} 
                        href={item.href} 
                        onClick={close} 
                        className="text-white/70 hover:text-white transition-colors py-1 block text-base"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
