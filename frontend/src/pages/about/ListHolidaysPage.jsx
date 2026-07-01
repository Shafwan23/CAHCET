import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const HOLIDAYS = [
  { id: 1, occasion: "New Year's Day", date: 'January 1, 2026', day: 'Thursday', type: 'Public' },
  { id: 2, occasion: 'Pongal', date: 'January 14, 2026', day: 'Wednesday', type: 'Public' },
  { id: 3, occasion: 'Republic Day', date: 'January 26, 2026', day: 'Monday', type: 'National' },
  { id: 4, occasion: 'Good Friday', date: 'April 3, 2026', day: 'Friday', type: 'Public' },
  { id: 5, occasion: 'Independence Day', date: 'August 15, 2026', day: 'Saturday', type: 'National' },
  { id: 6, occasion: 'Gandhi Jayanti', date: 'October 2, 2026', day: 'Friday', type: 'National' },
  { id: 7, occasion: 'Diwali', date: 'November 8, 2026', day: 'Sunday', type: 'Public' },
  { id: 8, occasion: 'Christmas', date: 'December 25, 2026', day: 'Friday', type: 'Public' },
];

const ListHolidaysPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.holidays');
        if (section && section.content) {
          setData(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
        }
      } catch (error) {
        console.error('Error fetching holidays data:', error);
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

  const holidays = data?.holidays || HOLIDAYS;

  return (
    <div className="pb-32 bg-primary-50 min-h-screen">
      {/* Premium Parallax Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542382257-80da9fb9f5c5?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] max-w-full h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] max-w-full h-[400px] bg-red-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
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
              {data?.title || 'Academic Holidays'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
              {data?.description || 'Official list of holidays for the academic year. Plan your schedule accordingly with our comprehensive timeline.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline/Card List */}
      <section className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="space-y-6">
          {holidays.map((holiday, index) => (
            <motion.div
              key={holiday.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-luxury hover:shadow-glow-lg transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:-translate-y-1 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] z-10 pointer-events-none" />
              <div className="flex items-center gap-6 z-20">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center border transition-colors duration-500 ${
                  holiday.type === 'National' || holiday.category === 'National'
                    ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/50 group-hover:bg-accent-gold group-hover:text-white' 
                    : 'bg-primary-50 text-primary-600 border-primary-100 group-hover:bg-primary-100 group-hover:text-primary-900'
                }`}>
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-primary-900 group-hover:text-accent-gold transition-colors duration-300">{holiday.name || holiday.occasion}</h3>
                  <div className="flex items-center gap-3 text-sm text-primary-500 mt-1 font-medium">
                    <span className="text-primary-700">{holiday.date}</span>
                    <span className="text-primary-300">•</span>
                    <span>{holiday.day || new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  </div>
                </div>
              </div>
              <span className={`relative z-20 inline-block px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm transition-all duration-300 ${
                holiday.type === 'National' || holiday.category === 'National'
                  ? 'bg-gradient-to-r from-accent-gold to-yellow-600 text-white border border-transparent group-hover:shadow-glow-lg' 
                  : 'bg-white text-primary-700 border border-primary-200 group-hover:border-primary-400 group-hover:bg-primary-50'
              }`}>
                {holiday.type || holiday.category || 'Public'}
              </span>
            </motion.div>
          ))}
          
          {holidays.length === 0 && (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <p>No holidays currently listed.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ListHolidaysPage;
