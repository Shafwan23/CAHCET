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
          setData(section.content);
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">{data?.title || 'Academic Holidays'}</h1>
          <p className="text-xl text-primary-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data?.description || 'Official list of holidays for the academic year. Plan your schedule accordingly.'}
          </p>
        </motion.div>
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
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-primary-100 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-accent-gold/20"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  holiday.type === 'National' || holiday.category === 'National'
                    ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/20' 
                    : 'bg-primary-50 text-primary-600 border-primary-100'
                }`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-900">{holiday.name || holiday.occasion}</h3>
                  <div className="flex items-center gap-2 text-sm text-primary-500">
                    <span>{holiday.date}</span>
                    <span className="text-primary-300">|</span>
                    <span>{holiday.day || new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  </div>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${
                holiday.type === 'National' || holiday.category === 'National'
                  ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20' 
                  : 'bg-primary-50 text-primary-600 border border-primary-100'
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
