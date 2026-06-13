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
    <div className="pb-32">
      {/* Header */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl text-center pt-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span>Academics</span>
            <span className="w-10 h-[2px] bg-accent-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">{data?.title || 'World-Class Infrastructure'}</h1>
          <p className="text-xl text-primary-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data?.content || 'We provide premium facilities to ensure a comfortable and enriching campus experience. Discover our state-of-the-art infrastructure.'}
          </p>
        </motion.div>
      </section>

      {/* Full-Width Feature Sections */}
      <section className="space-y-24">
        {facilities.map((facility, index) => {
          const Icon = typeof facility.icon === 'string' ? getIcon(facility.icon) : (facility.icon || Home);
          return (
            <div key={facility.id || index} className="relative group overflow-hidden">
              <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="bg-white/80 backdrop-blur-xl border border-primary-100 rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-700 flex flex-col lg:flex-row items-stretch min-h-[400px]">
                  
                  {/* Image Block */}
                  <div className="w-full lg:w-1/2 relative overflow-hidden">
                    <img 
                      src={facility.image || facility.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3'} 
                      alt={facility.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 to-transparent" />
                    <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="text-accent-gold text-xs font-bold uppercase tracking-widest">{facility.category || `Facility 0${index + 1}`}</div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-900">{facility.title}</h3>
                      <p className="text-primary-600 text-lg font-light leading-relaxed">{facility.description || facility.desc}</p>
                      
                      {facility.details && (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          {facility.details.map((detail, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                              <span className="text-sm text-primary-500 font-medium">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-sm font-bold text-primary-400 group-hover:text-accent-gold transition-colors pt-6">
                      <span>View Gallery</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default CampusFacilityPage;
