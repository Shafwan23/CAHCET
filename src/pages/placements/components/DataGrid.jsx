import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  UserCheck, UserX,
} from 'lucide-react';

// ── Salary badge colour ────────────────────────────────────────────────────────
function salaryColor(raw) {
  if (!raw) return { bg: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
  if (raw >= 1500000) return { bg: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' };  // ₹15L+
  if (raw >= 700000)  return { bg: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };  // ₹7L+
  if (raw >= 400000)  return { bg: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' };  // ₹4L+
  return { bg: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
}

// ── Dept badge ────────────────────────────────────────────────────────────────
const DEPT_COLORS = {
  CSE:   '#2563eb', AIDS:  '#7c3aed', IT:    '#0891b2',
  ECE:   '#059669', EEE:   '#d97706', MECH:  '#dc2626',
  CIVIL: '#ea580c', AIML:  '#db2777', MCA:   '#0d9488', MBA: '#8b5cf6',
};

function DeptBadge({ dept }) {
  const color = DEPT_COLORS[dept] || '#475569';
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide"
      style={{ background: `${color}15`, color }}
    >
      {dept}
    </span>
  );
}

// ── Gender badge ─────────────────────────────────────────────────────────────
function GenderBadge({ gender }) {
  const isMale = gender === 'Male';
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border"
      style={{
        background: isMale ? '#eff6ff' : '#fdf2f8',
        color: isMale ? '#1d4ed8' : '#be185d',
        borderColor: isMale ? '#bfdbfe' : '#fbcfe8',
      }}
    >
      {isMale ? <UserCheck className="w-2.5 h-2.5" /> : <UserX className="w-2.5 h-2.5" />}
      {gender}
    </span>
  );
}

// ── Salary badge ──────────────────────────────────────────────────────────────
function SalaryBadge({ salary, raw }) {
  const { bg, color, border } = salaryColor(raw);
  return (
    <span
      className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold border"
      style={{ background: bg, color, border }}
    >
      {salary}
    </span>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalRows, rowsPerPage, rowsPerPageOptions, onPageChange, onRowsPerPageChange }) {
  const start = totalRows === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalRows);

  const pages = [];
  const delta = 2;
  const left = page - delta;
  const right = page + delta;
  let prev = null;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      if (prev !== null && i - prev > 1) pages.push('...');
      pages.push(i);
      prev = i;
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-2 border-t border-slate-200">
      {/* Info + rows-per-page */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>
          Showing <span className="text-slate-800 font-semibold">{start}–{end}</span> of{' '}
          <span className="text-slate-800 font-semibold">{totalRows.toLocaleString('en-IN')}</span> records
        </span>
        <div className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 focus:outline-none hover:border-blue-500/40 transition-colors cursor-pointer"
          >
            {rowsPerPageOptions.map((v) => (
              <option key={v} value={v} className="bg-white text-slate-800">{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Page nav */}
      <div className="flex items-center gap-1.5">
        <NavBtn onClick={() => onPageChange(1)} disabled={page === 1} title="First page">
          <ChevronsLeft className="w-3.5 h-3.5" />
        </NavBtn>
        <NavBtn onClick={() => onPageChange(page - 1)} disabled={page === 1} title="Previous page">
          <ChevronLeft className="w-3.5 h-3.5" />
        </NavBtn>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="px-1 text-slate-400 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                background: p === page ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : '#ffffff',
                color: p === page ? '#ffffff' : '#475569',
                border: p === page ? 'none' : '1px solid #e2e8f0',
                boxShadow: p === page ? '0 0 12px rgba(37,99,235,0.2)' : 'none',
              }}
            >
              {p}
            </button>
          )
        )}

        <NavBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages} title="Next page">
          <ChevronRight className="w-3.5 h-3.5" />
        </NavBtn>
        <NavBtn onClick={() => onPageChange(totalPages)} disabled={page === totalPages} title="Last page">
          <ChevronsRight className="w-3.5 h-3.5" />
        </NavBtn>
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-200 bg-white"
    >
      {children}
    </button>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <tr>
      <td colSpan={7}>
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
            <UserX className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold text-sm">No records match your filters</p>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filter criteria</p>
        </div>
      </td>
    </tr>
  );
}

// ── Main DataGrid ─────────────────────────────────────────────────────────────
const COLS = [
  { key: 'sl',      label: 'SL. No',     width: 'w-16'  },
  { key: 'regNo',   label: 'Register No', width: 'w-32'  },
  { key: 'name',    label: 'Student Name',width: 'min-w-[160px]' },
  { key: 'gender',  label: 'Gender',      width: 'w-28'  },
  { key: 'dept',    label: 'Dept.',       width: 'w-24'  },
  { key: 'company', label: 'Company',     width: 'min-w-[180px]' },
  { key: 'salary',  label: 'Package',     width: 'w-32'  },
];

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.012, duration: 0.25 } }),
};

export default function DataGrid({
  rows, page, totalPages, rowsPerPage, totalRows,
  onPageChange, onRowsPerPageChange, rowsPerPageOptions,
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm"
    >
      {/* Table wrapper — horizontal scroll on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          {/* Sticky header */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {COLS.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 sticky top-0 z-10 ${col.width}`}
                  style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence mode="wait">
              {rows.length === 0 ? (
                <EmptyState />
              ) : (
                rows.map((row, idx) => (
                  <motion.tr
                    key={row.regNo}
                    custom={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="group transition-all duration-200 cursor-default"
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        idx % 2 === 0 ? '#ffffff' : '#f8fafc';
                    }}
                  >
                    {/* SL */}
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs font-bold">
                      {(page - 1) * rowsPerPage + idx + 1}
                    </td>

                    {/* Reg No */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-blue-600 tracking-wider">
                        {row.regNo}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 text-sm">{row.name}</span>
                    </td>

                    {/* Gender */}
                    <td className="px-4 py-3">
                      <GenderBadge gender={row.gender} />
                    </td>

                    {/* Dept */}
                    <td className="px-4 py-3">
                      <DeptBadge dept={row.dept} />
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3">
                      <span className="text-slate-700 font-medium text-sm">{row.company}</span>
                    </td>

                    {/* Salary */}
                    <td className="px-4 py-3">
                      <SalaryBadge salary={row.salary} raw={row.salaryRaw} />
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 sm:px-6 pb-5">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </div>
    </div>
  );
}
