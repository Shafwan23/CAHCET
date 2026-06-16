import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Users, Star, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

// ── Sports data ───────────────────────────────────────────────────────────────
const SPORTS = [
  {
    id: 'cricket',
    name: 'Cricket',
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    desc: 'A state-of-the-art cricket ground with professional-grade pitch and pavilion facilities for intercollegiate and intramural matches.',
    achievements: ['Anna University Zonal Champions 2024', 'Tamil Nadu Inter-College runners-up 2023', 'Best Emerging Team Award 2022'],
  },
  {
    id: 'football',
    name: 'Football',
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1571042639164-22c89af1d02d?auto=format&fit=crop&w=1200&q=80',
    desc: 'Full-size football ground with floodlights for evening practice sessions. Our teams compete at district, state and Anna University levels.',
    achievements: ['District Level Champions 2024', 'Anna University South Zone — Semi Finals 2023', 'Inter-College Gold Medal 2022'],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1546519638701-a05f9d9a36e2?auto=format&fit=crop&w=1200&q=80',
    desc: 'Two professional basketball courts (outdoor and indoor) with high-quality flooring, providing year-round training opportunities.',
    achievements: ['Anna University Zone 8 Champions 2024', 'Tamil Nadu State Level — Top 4 (2023)', 'Best Team Spirit Award 2022'],
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    desc: 'Well-maintained volleyball courts with permanent nets and marked courts, used for both intramural tournaments and intercollegiate events.',
    achievements: ['Intercollegiate Gold (2024)', 'Zonal Tournament — Runners Up (2023)', 'Best Sportsmanship Trophy (2022)'],
  },
  {
    id: 'badminton',
    name: 'Badminton',
    category: 'Indoor',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    desc: 'Four dedicated indoor badminton courts with synthetic flooring, proper lighting, and equipment for professional-level play.',
    achievements: ['Anna University Individual Champion 2024', 'Doubles Gold Medal 2023', 'State Open — Quarter Finals (2022)'],
  },
  {
    id: 'chess',
    name: 'Chess',
    category: 'Indoor',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80',
    desc: "CAHCET's Chess Club trains students under FIDE-rated coaches, producing multiple university-level champions every year.",
    achievements: ['Anna University Chess Champion 2024', 'National Inter-University — Top 8 (2023)', 'Team Gold — Zonal Meet (2022)'],
  },
];

const STATS = [
  { icon: Trophy, value: '120+', label: 'Trophies Won' },
  { icon: Medal, value: '340+', label: 'Individual Medals' },
  { icon: Users, value: '800+', label: 'Student Athletes' },
  { icon: Star, value: '18', label: 'Sports Offered' },
];

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative flex flex-col items-center justify-center px-6 py-8 rounded-[2rem] bg-white/80 backdrop-blur-md border border-white/60 shadow-luxury hover:shadow-glow-lg transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-accent-gold/10 -z-10" />
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent z-10 pointer-events-none" />

      <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-3 border border-primary-100 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/50 transition-colors duration-500 z-20">
        <Icon className="w-6 h-6 text-primary-700 group-hover:text-accent-gold transition-colors duration-500" />
      </div>
      <span className="text-4xl font-display font-extrabold text-primary-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-gold transition-all duration-500 z-20">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mt-2 z-20">{label}</span>
    </motion.div>
  );
}

// ── Sport card ────────────────────────────────────────────────────────────────
function SportCard({ sport, index }) {
  const isEven = index % 2 === 0;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] overflow-hidden shadow-luxury hover:shadow-glow-lg transition-all duration-700 flex flex-col lg:flex-row items-stretch min-h-[380px] hover:-translate-y-2 group z-10`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/30 -z-10" />
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20 pointer-events-none" />

      {/* Image */}
      <div className={`w-full lg:w-[45%] relative overflow-hidden h-64 lg:h-auto ${isEven ? '' : 'lg:order-2'}`}>
        <div className="absolute inset-0 bg-accent-gold/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <img
          src={sport.image}
          alt={sport.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-luxury"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent z-10" />
        {/* Category badge */}
        <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold uppercase tracking-widest z-20 shadow-lg">
          {sport.category}
        </span>
      </div>

      {/* Content */}
      <div className={`w-full lg:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 ${isEven ? '' : 'lg:order-1'}`}>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/15 transition-colors duration-700 z-0" />
        
        <div className="relative z-10 space-y-6">
          <div>
            <p className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-[10px] font-bold uppercase tracking-widest rounded-full border border-accent-gold/20 shadow-sm mb-4">Sports Program</p>
            <h3 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-gold transition-all duration-500 leading-tight mb-4">{sport.name}</h3>
            <p className="text-primary-600 text-lg font-light leading-relaxed">{sport.desc}</p>
          </div>

          {/* Achievements */}
          <div className="pt-6 border-t border-primary-100/50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-4">Key Achievements</p>
            <ul className="space-y-3">
              {sport.achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary-700 font-medium group/item">
                  <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100 group-hover/item:bg-accent-gold/10 group-hover/item:border-accent-gold/30 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-sm" />
                  </div>
                  <span className="pt-0.5 group-hover/item:text-primary-900 transition-colors">{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.sports');
        if (section && section.content) {
          setData(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
        }
      } catch (error) {
        console.error('Error fetching sports data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-primary-800 border-t-accent-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const sports = data?.sports || SPORTS;
  const stats = data?.stats || STATS;

  const getStatLabel = (key) => {
    switch (key) {
      case 'grounds': return 'Total Grounds';
      case 'players': return 'Active Players';
      case 'tournaments': return 'Tournaments Won';
      case 'medals'    <div className="pb-32 bg-primary-50 min-h-screen">
      {/* Premium Parallax Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546519638701-a05f9d9a36e2?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
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
              <span>Academics & Student Life</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold mb-6 leading-tight tracking-tight">
              {data?.title || 'Sports at CAHCET'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
              {data?.description || 'We believe in nurturing well-rounded individuals. Our world-class sports facilities and dedicated coaching staff empower students to excel both on the field and in the classroom.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-8 max-w-6xl mb-24 relative z-20 -mt-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statsArray.map((s, i) => (
            <StatCard key={s.label || i} icon={s.icon || Trophy} value={s.value} label={s.label} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── SPORTS LIST ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl space-y-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs font-bold uppercase tracking-widest rounded-full border border-accent-gold/20 shadow-sm mb-4">Our Sports Programs</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900">Featured Sports & Achievements</h2>
        </motion.div>

        {sports.map((sport, i) => (
          <SportCard key={sport.id || i} sport={sport} index={i} />
        ))}
      </section>

      {/* ── FACILITIES NOTE ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-8 max-w-6xl mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-primary-950 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-luxury"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/80 to-primary-950" />
          
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-[10px] font-bold uppercase tracking-widest rounded-full border border-accent-gold/20 shadow-sm mb-6">Infrastructure</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-gold mb-6">World-Class Sports Infrastructure</h2>
            <p className="text-primary-200 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto mb-12">
              CAHCET provides dedicated sports grounds, indoor courts, a fully-equipped gymnasium, and coaching
              from experienced state-level coaches — ensuring every student athlete reaches their full potential.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Cricket Ground', 'Football Field', 'Basketball Courts', 'Indoor Badminton', 'Table Tennis', 'Gymnasium', 'Swimming Pool', 'Athletics Track'].map((f) => (
                <span key={f} className="px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-accent-gold/20 hover:border-accent-gold/50 transition-all duration-300 cursor-default">
                  {f}
                </span>
              ))}
            </div>
          </div>
      </section>
    </div>
  );
}
