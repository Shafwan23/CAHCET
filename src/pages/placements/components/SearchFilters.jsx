import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';

const selectStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#334155',
  borderRadius: '0.75rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  outline: 'none',
  cursor: 'pointer',
  minWidth: 140,
  appearance: 'none',
  WebkitAppearance: 'none',
};

function SelectFilter({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
        className="w-full pr-8 hover:border-blue-500/40 transition-colors focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20"
      >
        <option value="" className="bg-white text-slate-800">{placeholder}</option>
        {options.filter(Boolean).map((opt) => (
          <option key={opt} value={opt} className="bg-white text-slate-800">{opt}</option>
        ))}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-3 h-3 text-slate-500" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export default function SearchFilters({
  search, onSearchChange,
  deptFilter, onDeptChange,
  companyFilter, onCompanyChange,
  genderFilter, onGenderChange,
  departments, companies,
  onClear, resultCount,
}) {
  const inputRef = useRef(null);
  const hasFilters = search || deptFilter || companyFilter || genderFilter;

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 space-y-4 bg-white border border-slate-200 shadow-sm"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          Search & Filter
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            {resultCount.toLocaleString('en-IN')} results
          </span>
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-600 hover:bg-amber-500/10 border border-amber-500/25 transition-all"
              >
                <X className="w-3 h-3" />
                Clear All
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, reg. no, department or company…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium placeholder-slate-400 text-slate-800 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2">
          <SelectFilter
            value={deptFilter}
            onChange={onDeptChange}
            options={departments}
            placeholder="All Departments"
          />
          <SelectFilter
            value={companyFilter}
            onChange={onCompanyChange}
            options={companies}
            placeholder="All Companies"
          />
          <SelectFilter
            value={genderFilter}
            onChange={onGenderChange}
            options={['Male', 'Female']}
            placeholder="All Genders"
          />
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {[
              { label: search, type: 'Search', clear: () => onSearchChange('') },
              { label: deptFilter, type: 'Dept', clear: () => onDeptChange('') },
              { label: companyFilter, type: 'Company', clear: () => onCompanyChange('') },
              { label: genderFilter, type: 'Gender', clear: () => onGenderChange('') },
            ]
              .filter((f) => f.label)
              .map((f) => (
                <span
                  key={f.type}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-150"
                >
                  <Filter className="w-2.5 h-2.5 text-blue-600" />
                  {f.type}: {f.label.length > 20 ? f.label.slice(0, 20) + '…' : f.label}
                  <button onClick={f.clear} className="hover:text-blue-950 transition-colors ml-0.5">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
