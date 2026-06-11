import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Users, Star, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

const SPORTS = [
  {
    id: 'cricket',
    name: 'Cricket',
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    desc: 'A state-of-the-art cricket ground with professional-grade pitch and pavilion facilities for intercollegiate and intramural matches.',
    achievements: ['Anna University Zonal Champions 2024', 'Tamil Nadu Inter-College Runners-up 2023', 'Best Emerging Team Award 2022'],
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
    desc: 'Well-maintained volleyball courts with permanent nets and marked courts for intramural tournaments and intercollegiate events.',
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
    desc: 'CAHCET\'s Chess Club trains students under FIDE-rated coaches, producing multiple university-level champions every year.',
    achievements: ['Anna University Chess Champion 2024', 'National Inter-University — Top 8 (2023)', 'Team Gold — Zonal Meet (2022)'],
  },
];

const STATS = [
  { icon: Trophy, value: '120+', label: 'Trophies Won' },
  { icon: Medal,  value: '340+', label: 'Individual Medals' },
  { icon: Users,  value: '800+', label: 'Student Athletes' },
  { icon: Star,   value: '18',   label: 'Sports Offered' },
];

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-7 rounded-2xl bg-white border border-slate-100 shadow-sm text-center gap-2">
      <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-1">
        <Icon className="w-5 h-5 text-primary-700" />
      </div>
      <span className="text-3xl font-extrabold text-primary-900">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

function SportCard({ sport, index }) {
  const isEven = index % 2 === 0;
  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col lg:flex-row items-stretch min-h-[340px]">
      <div className={`w-full lg:w-[45%] relative overflow-hidden ${isEven ? '' : 'lg:order-2'}`}>
        <img
          src={sport.image}
          alt={sport.name}
          className="w-full h-56 lg:h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-primary-800 text-[11px] font-bold uppercase tracking-wider">
          {sport.category}
        </span>
      </div>

      <div className={`w-full lg:w-[55%] p-8 flex flex-col justify-center gap-5 ${isEven ? '' : 'lg:order-1'}`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-1">Sports Program</p>
          <h3 className="text-2xl font-bold text-primary-900 mb-3">{sport.name}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{sport.desc}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-400 mb-3">Key Achievements</p>
          <ul className="space-y-2">
            {sport.achievements.map((ach, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-1.5 flex-shrink-0" />
                {ach}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.sports');
        if (section && section.content) {
          setData(section.content);
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
  
  // Array of stats mapping logic (handle object to array if needed)
  const statsArray = Array.isArray(stats) ? stats : (
    stats && typeof stats === 'object' 
      ? Object.entries(stats).map(([k, v]) => ({ label: k, value: v, icon: Trophy }))
      : STATS
  );

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl text-center pt-20 mb-16">
        <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
          <span className="w-10 h-[2px] bg-accent-gold" />
          <span>Academics & Student Life</span>
          <span className="w-10 h-[2px] bg-accent-gold" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-5">
          {data?.title || 'Sports at CAHCET'}
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed font-light max-w-3xl mx-auto">
          {data?.description || 'We believe in nurturing well-rounded individuals. Our world-class sports facilities and dedicated coaching staff empower students to excel both on the field and in the classroom.'}
        </p>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsArray.map((s, i) => <StatCard key={s.label || i} icon={s.icon || Trophy} value={s.value} label={s.label} />)}
        </div>
      </section>

      {/* Sport cards */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl space-y-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-2">Our Sports Programs</p>
          <h2 className="text-3xl font-bold text-primary-900">Featured Sports & Achievements</h2>
        </div>
        {sports.map((sport, i) => <SportCard key={sport.id || i} sport={sport} index={i} />)}
      </section>

      {/* Infrastructure */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl mt-20">
        <div className="bg-primary-950 rounded-3xl p-10 md:p-14 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-3">Infrastructure</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">World-Class Sports Infrastructure</h2>
          <p className="text-primary-300 text-base leading-relaxed max-w-2xl mx-auto mb-8">
            CAHCET provides dedicated sports grounds, indoor courts, a fully-equipped gymnasium, and coaching
            from experienced state-level coaches — ensuring every student athlete reaches their full potential.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Cricket Ground', 'Football Field', 'Basketball Courts', 'Indoor Badminton', 'Table Tennis', 'Gymnasium', 'Swimming Pool', 'Athletics Track'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
