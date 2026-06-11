import { motion } from 'framer-motion';
import { Home, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';

export default function PlacementHeader({ stats, year }) {
  return (
    <header className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white rounded-b-[2.5rem] shadow-xl z-10 mb-10">
      {/* Geometric structural circles/effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute -left-16 -top-16 w-64 h-64 border border-white rounded-full" />
        <div className="absolute right-10 bottom-5 w-80 h-80 border border-white/40 rounded-full" />
        <div className="absolute left-1/3 top-10 w-96 h-96 border border-white/20 rounded-full" />
      </div>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs font-medium mb-6"
          aria-label="breadcrumb"
        >
          <a href="/" className="flex items-center gap-1 text-slate-350 hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" />
            Home
          </a>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-350">Placements</span>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-accent-gold">Students Placed</span>
        </motion.nav>

        {/* Main header row */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-gold" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/70">
                Placement Analytics Portal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
            >
              <span className="text-white">Students</span>{' '}
              <span className="text-accent-gold">
                Placements
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 text-white/80 font-light text-sm sm:text-base max-w-xl"
            >
              Real-time placement analytics — tracking every student&apos;s journey from campus to career.
              Powered by live recruitment data for Academic Year{' '}
              <span className="text-accent-gold font-semibold">{year}–{year + 1}</span>.
            </motion.p>
          </div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-shrink-0"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                <span className="text-xs font-semibold text-accent-gold uppercase tracking-wider">Live Data</span>
              </div>
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <TrendingUp className="w-3.5 h-3.5 text-accent-gold" />
                <span className="font-semibold text-white">{stats.placementPercentage}%</span> placed
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
