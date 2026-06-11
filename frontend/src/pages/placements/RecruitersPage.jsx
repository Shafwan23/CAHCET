import { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { AnimatePresence, motion } from 'framer-motion';
import { topRecruiters, placementActivities } from '../../data/recruiters';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Home, ChevronRight, CheckCircle2 } from 'lucide-react';

// ── Brand colours for initials fallback ──────────────────────────────────────
const BRAND_COLORS = [
  { bg: '#EEF2FF', accent: '#4F46E5' },
  { bg: '#FFF7ED', accent: '#EA580C' },
  { bg: '#F0FDF4', accent: '#16A34A' },
  { bg: '#EFF6FF', accent: '#2563EB' },
  { bg: '#FDF4FF', accent: '#9333EA' },
  { bg: '#FFF1F2', accent: '#E11D48' },
  { bg: '#ECFEFF', accent: '#0891B2' },
  { bg: '#F7FEE7', accent: '#65A30D' },
  { bg: '#FFF8DC', accent: '#D97706' },
  { bg: '#F0F9FF', accent: '#0369A1' },
];

// ── Recruiter card — NO animations ───────────────────────────────────────────
function RecruiterCard({ name, logo, fullName, index }) {
  const [imgError, setImgError] = useState(false);
  const color = BRAND_COLORS[index % BRAND_COLORS.length];
  const initials = name.split(/[\s&]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const showLogo = logo && !imgError;

  return (
    <div className="group flex flex-col items-center gap-3 rounded-2xl p-5 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-shadow duration-200 cursor-default">
      {/* Logo / Initials */}
      <div
        className="w-20 h-16 rounded-xl flex items-center justify-center overflow-hidden"
        style={
          showLogo
            ? { background: '#f8fafc', border: '1px solid #e2e8f0' }
            : { background: color.bg, border: `1.5px solid ${color.accent}30` }
        }
      >
        {showLogo ? (
          <img
            src={logo}
            alt={`${name} logo`}
            onError={() => setImgError(true)}
            className="w-14 h-12 object-contain"
          />
        ) : (
          <span className="text-xl font-black" style={{ color: color.accent }}>
            {initials}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
          {name}
        </span>
        <span className="block text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
          {fullName}
        </span>
      </div>
    </div>
  );
}

// ── Tab button ────────────────────────────────────────────────────────────────
function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {label}
    </button>
  );
}

// ── Stat badge ────────────────────────────────────────────────────────────────
function StatBadge({ value, label, color }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-4 rounded-xl text-center min-w-[110px]"
      style={{ background: `${color}18`, border: `1px solid ${color}35` }}
    >
      <span className="text-2xl font-extrabold" style={{ color }}>{value}</span>
      <span className="text-xs font-semibold text-white/70 mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RecruitersPage() {
  const [activeYear, setActiveYear] = useState(placementActivities[0].year);
  const activeData = placementActivities.find((a) => a.year === activeYear);
  const [loading, setLoading] = useState(true);
  const [liveRecruiters, setLiveRecruiters] = useState([]);

  useEffect(() => {
    cmsService.getPage('placements')
      .then(res => {
        const sections = res.data?.sections || [];
        const sec = sections.find(s => s.sectionKey === 'placements.recruiters');
        if (sec && sec.content) {
          const parsed = JSON.parse(sec.content);
          if (Array.isArray(parsed)) {
            setLiveRecruiters(parsed.map(r => ({
              name: r.companyName,
              logo: r.logoUrl || '',
              fullName: r.rolesOffered || 'Partner',
            })));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayRecruiters = liveRecruiters.length > 0 ? liveRecruiters : topRecruiters;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <main className="pt-20">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white rounded-b-[2.5rem] shadow-xl z-10 mb-10">
          {/* Geometric structural circles/effects */}
          <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
            <div className="absolute -left-16 -top-16 w-64 h-64 border border-white rounded-full" />
            <div className="absolute right-10 bottom-5 w-80 h-80 border border-white/40 rounded-full" />
            <div className="absolute left-1/3 top-10 w-96 h-96 border border-white/20 rounded-full" />
          </div>
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px]" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-350 mb-7">
              <a href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </a>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span>Placements</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="text-accent-gold">Recruiters</span>
            </nav>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3">
              Placement Cell — CAHCET
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Top Recruiters &{' '}
              <span className="text-accent-gold">Placement Activities</span>
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed mb-10">
              Here are some of our top recruiters who continuously support and recruit talented students
              from our institution, reflecting the trust and industry recognition CAHCET has earned over the years.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <StatBadge value="100+"    label="Companies Visited"          color="#60a5fa" />
              <StatBadge value="530+"    label="Students Placed (AY 25–26)" color="#34d399" />
              <StatBadge value="₹36 LPA" label="Highest Package"            color="#fbbf24" />
              <StatBadge value="93%"     label="Placement Rate"             color="#c084fc" />
            </div>
          </div>
        </header>

        {/* ── RECRUITER LOGOS ─────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Our Partners</p>
                <h2 className="text-2xl font-extrabold text-slate-900">Recruiting Companies</h2>
              </div>
              <span className="text-sm text-slate-400 font-medium">{displayRecruiters.length} active partners</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading live recruiters...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayRecruiters.map((rec, i) => (
                  <RecruiterCard key={rec.name + i} {...rec} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── PLACEMENT ACTIVITIES ────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Year-wise Overview</p>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Placement Activities</h2>
              <p className="text-slate-500 text-sm max-w-xl">
                A comprehensive record of our Placement Cell&apos;s initiatives, drives, and outcomes across recent academic years.
              </p>
            </div>

            {/* Year tabs */}
            <div className="flex flex-wrap gap-3 mb-7">
              {placementActivities.map((act) => (
                <TabButton
                  key={act.year}
                  label={`AY ${act.year}`}
                  isActive={activeYear === act.year}
                  onClick={() => setActiveYear(act.year)}
                />
              ))}
            </div>

            {/* Content — only the tab content switch has a subtle fade, everything else is static */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div
                  className="px-7 py-4 border-b border-slate-100"
                  style={{ background: 'linear-gradient(90deg, #eff6ff 0%, #f8fafc 100%)' }}
                >
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Placement Cell Activities — Academic Year {activeData.year}
                  </h3>
                </div>

                <div className="px-7 py-7">
                  <ol className="space-y-4">
                    {activeData.activities.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-slate-600 text-sm leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    All activities are conducted under the guidance of the Placement Officer, CAHCET.
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
