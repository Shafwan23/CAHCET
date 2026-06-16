import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Wifi, Users, Globe, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const FACILITIES = [
  { 
    id: 'hostel', 
    title: 'Luxury Student Housing', 
    icon: Home, 
    desc: 'Separate, secure, and comfortable hostel facilities for boys and girls with all modern amenities. Experience a home away from home.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    details: ['Spacious Rooms', '24/7 Power Backup', 'Hygienic Mess', 'Recreation Areas']
  },
  { 
    id: 'wifi', 
    title: 'High-Speed Connected Campus', 
    icon: Wifi, 
    desc: 'High-speed campus-wide WiFi connectivity to support academic and research needs. Stay connected everywhere.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    details: ['1 Gbps Leased Line', 'Campus-wide Coverage', 'Secure Firewall', 'Tech Center']
  },
  { 
    id: 'space', 
    title: 'Grand Gathering Spaces', 
    icon: Users, 
    desc: 'State-of-the-art auditoriums, seminar halls, and open spaces for events and gatherings.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd24a645d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    details: ['1000+ Seating Auditorium', 'Multiple Seminar Halls', 'Open-air Amphitheater', 'Green Lounges']
  },
  { 
    id: 'others', 
    title: 'Complete Campus Ecosystem', 
    icon: Globe, 
    desc: 'Cafeteria, transport, banking, and medical facilities for a complete campus experience.',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    details: ['Modern Cafeteria', 'Extensive Bus Fleet', 'On-campus ATM', 'Medical Care']
  },
];

const CampusFacilityPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.facilities');
        if (section && section.content) {
          setData(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
        }
      } catch (error) {
        console.error('Error fetching campus facilities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-950">
        <div className="w-16 h-16 border-4 border-primary-800 border-t-accent-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const facilities = data?.facilities || FACILITIES;
  
  // Icon mapping helper
  const iconMap = { Home, Wifi, Users, Globe };
  const getIcon = (iconName) => iconMap[iconName] || Home;

  return (
    <div className="pb-32 bg-primary-50 min-h-screen">
      {/* Premium Parallax Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-[2px] bg-accent-gold" />
              <span>Academics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold mb-6 leading-tight tracking-tight">
              {data?.title || 'World-Class Infrastructure'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
              {data?.content || 'We provide premium facilities to ensure a comfortable and enriching campus experience. Discover our state-of-the-art infrastructure designed for excellence.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full-Width Feature Sections */}
      <section className="space-y-24">
        {facilities.map((facility, index) => {
          const Icon = typeof facility.icon === 'string' ? getIcon(facility.icon) : (facility.icon || Home);
          const isReversed = index % 2 !== 0;
          return (
            <div key={facility.id || index} className="relative group overflow-hidden py-4">
              <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-luxury hover:shadow-glow-lg transition-all duration-700 flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch min-h-[400px] hover:-translate-y-2 group`}
                >
                  
                  {/* Image Block */}
                  <div className="w-full lg:w-1/2 relative overflow-hidden h-64 lg:h-auto">
                    <div className="absolute inset-0 bg-accent-gold/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <img 
                      src={facility.image || facility.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3'} 
                      alt={facility.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-luxury"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-transparent z-10" />
                    <div className="absolute bottom-6 left-6 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 z-20 group-hover:bg-accent-gold/30 group-hover:border-accent-gold transition-colors duration-500">
                      <Icon className="w-8 h-8 drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden bg-white/50 z-0">
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20 pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/15 transition-colors duration-700 z-0" />
                    
                    <div className="space-y-6 z-10 relative">
                      <div className="inline-block px-4 py-1.5 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/20 shadow-sm">
                        {facility.category || `Facility 0${index + 1}`}
                      </div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-gold transition-all duration-500 leading-tight">
                        {facility.title}
                      </h3>
                      <p className="text-primary-600 text-lg md:text-xl font-light leading-relaxed">
                        {facility.description || facility.desc}
                      </p>
                      
                      {facility.details && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-primary-100/50">
                          {facility.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-3 group/item">
                              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100 group-hover/item:bg-accent-gold/10 group-hover/item:border-accent-gold/30 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-accent-gold shadow-sm" />
                              </div>
                              <span className="text-base text-primary-700 font-medium group-hover/item:text-primary-900 transition-colors">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-sm font-bold text-primary-400 group-hover:text-accent-gold transition-colors pt-10 z-10 relative cursor-pointer w-fit">
                      <span className="border-b border-transparent group-hover:border-accent-gold pb-0.5 transition-colors">Explore Area</span>
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>

                </motion.div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default CampusFacilityPage;
