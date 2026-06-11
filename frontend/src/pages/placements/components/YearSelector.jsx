import { motion } from 'framer-motion';

export default function YearSelector({ years, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-xs font-bold tracking-widest uppercase text-slate-500 mr-1">
        Academic Year
      </span>
      {years.map((yr) => {
        const isActive = yr === active;
        return (
          <motion.button
            key={yr}
            onClick={() => onChange(yr)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{
              background: isActive
                ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
                : '#ffffff',
              color: isActive ? '#fff' : '#475569',
              border: isActive
                ? '1px solid transparent'
                : '1px solid #e2e8f0',
              boxShadow: isActive
                ? '0 4px 12px rgba(37, 99, 235, 0.2)'
                : 'none',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="year-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{yr}–{yr + 1}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
