import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, DollarSign, Building2, Percent, Layers,
} from 'lucide-react';

function useCountUp(target, duration = 1500) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const range = target;
    const step = Math.ceil(duration / 60);
    const increment = range / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return ref;
}

function StatCard({ icon: Icon, label, value, numericValue, accent, delay, suffix = '' }) {
  const countRef = useCountUp(numericValue ?? 0, 1400);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group overflow-hidden rounded-2xl p-5 flex flex-col gap-3 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${accent}10 0%, transparent 70%)`,
        }}
      />

      {/* Top gradient bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}10`, border: `1.5px solid ${accent}25` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>

      {/* Value */}
      <div>
        {numericValue !== undefined ? (
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-800">
            <span ref={countRef}>0</span>
            <span>{suffix}</span>
          </div>
        ) : (
          <div className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-800">{value}</div>
        )}
        <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: accent }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsCards({ stats }) {
  const cards = [
    {
      icon: Users,
      label: 'Total Students Placed',
      value: stats.totalPlaced.toLocaleString('en-IN'),
      numericValue: stats.totalPlaced,
      accent: '#2563eb', // Blue-600
      delay: 0,
    },
    {
      icon: TrendingUp,
      label: 'Highest Package',
      value: stats.highestSalary,
      accent: '#059669', // Emerald-600
      delay: 0.07,
    },
    {
      icon: DollarSign,
      label: 'Average Package',
      value: stats.averageSalary,
      accent: '#d97706', // Amber-600
      delay: 0.14,
    },
    {
      icon: Building2,
      label: 'Total Recruiters',
      value: String(stats.totalRecruiters),
      numericValue: stats.totalRecruiters,
      accent: '#7c3aed', // Violet-600
      delay: 0.21,
    },
    {
      icon: Percent,
      label: 'Placement Rate',
      value: `${stats.placementPercentage}%`,
      numericValue: stats.placementPercentage,
      suffix: '%',
      accent: '#db2777', // Pink-600
      delay: 0.28,
    },
    {
      icon: Layers,
      label: 'Departments',
      value: String(stats.departments),
      numericValue: stats.departments,
      accent: '#0891b2', // Cyan-600
      delay: 0.35,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
