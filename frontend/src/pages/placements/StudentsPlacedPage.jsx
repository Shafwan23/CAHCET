import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cmsService } from '../../services/cmsService';
import PlacementHeader from './components/PlacementHeader';
import YearSelector from './components/YearSelector';
import StatsCards from './components/StatsCards';
import SearchFilters from './components/SearchFilters';
import DataGrid from './components/DataGrid';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const PLACEMENT_YEARS = [2026, 2025, 2024, 2023];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function StudentsPlacedPage() {
  const [activeYear, setActiveYear] = useState(2026);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loading, setLoading] = useState(true);
  const [liveStudents, setLiveStudents] = useState([]);

  useEffect(() => {
    cmsService.getPage('placements')
      .then(res => {
        const sections = res.data?.sections || [];
        const sec = sections.find(s => s.sectionKey === 'placements.students');
        if (sec && sec.content) {
          const parsed = JSON.parse(sec.content);
          if (Array.isArray(parsed)) setLiveStudents(parsed);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const yearData = useMemo(() => {
    const filtered = liveStudents.filter(s => s.year === String(activeYear));
    const mapped = filtered.map((s, idx) => ({
      sl: idx + 1,
      regNo: s.id,
      name: s.studentName,
      gender: '',
      dept: s.department || 'General',
      company: s.companyName,
      salaryRaw: parseFloat(s.package) || 0,
      salary: s.package ? `${s.package} LPA` : 'TBD',
    }));

    const salaries = mapped.map(s => s.salaryRaw).filter(v => v > 0);
    const highest = salaries.length > 0 ? Math.max(...salaries) : 0;
    const avg = salaries.length > 0 ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;
    
    return {
      students: mapped,
      stats: {
        totalPlaced: mapped.length,
        highestSalary: highest > 0 ? `₹${highest} LPA` : 'N/A',
        averageSalary: avg > 0 ? `₹${avg.toFixed(1)} LPA` : 'N/A',
        totalRecruiters: new Set(mapped.map(s => s.company)).size,
        placementPercentage: 95,
        departments: new Set(mapped.map(s => s.dept)).size,
      }
    };
  }, [liveStudents, activeYear]);

  // Derived unique filter options
  const departments = useMemo(() => {
    const set = new Set(yearData.students.map((s) => s.dept));
    return ['', ...Array.from(set).sort()];
  }, [yearData]);

  const companies = useMemo(() => {
    const set = new Set(yearData.students.map((s) => s.company));
    return ['', ...Array.from(set).sort()];
  }, [yearData]);

  // Filtered + sorted data (salary descending)
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return yearData.students
      .filter((s) => {
        const matchSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.regNo.toLowerCase().includes(q) ||
          s.dept.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q);
        const matchDept = !deptFilter || s.dept === deptFilter;
        const matchCompany = !companyFilter || s.company === companyFilter;
        const matchGender = !genderFilter || s.gender === genderFilter;
        return matchSearch && matchDept && matchCompany && matchGender;
      })
      .sort((a, b) => b.salaryRaw - a.salaryRaw);
  }, [yearData, search, deptFilter, companyFilter, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePageNo = Math.min(page, totalPages);
  const paginatedRows = filtered.slice((safePageNo - 1) * rowsPerPage, safePageNo * rowsPerPage);

  const handleYearChange = useCallback((yr) => {
    setActiveYear(yr);
    setPage(1);
    setSearch('');
    setDeptFilter('');
    setCompanyFilter('');
    setGenderFilter('');
  }, []);

  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setDeptFilter('');
    setCompanyFilter('');
    setGenderFilter('');
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden font-sans relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-50/20 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium text-lg">Loading Live Placement Data...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <PlacementHeader stats={yearData.stats} year={activeYear} />

            {/* Content wrapper */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
              {/* Year Selector */}
              <YearSelector years={PLACEMENT_YEARS} active={activeYear} onChange={handleYearChange} />

          {/* Stats Cards */}
          <AnimatePresence mode="wait">
            <motion.div key={`stats-${activeYear}`} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <StatsCards stats={yearData.stats} />
            </motion.div>
          </AnimatePresence>

          {/* Search & Filters */}
          <SearchFilters
            search={search}
            onSearchChange={handleSearchChange}
            deptFilter={deptFilter}
            onDeptChange={(v) => { setDeptFilter(v); setPage(1); }}
            companyFilter={companyFilter}
            onCompanyChange={(v) => { setCompanyFilter(v); setPage(1); }}
            genderFilter={genderFilter}
            onGenderChange={(v) => { setGenderFilter(v); setPage(1); }}
            departments={departments}
            companies={companies}
            onClear={handleClearFilters}
            resultCount={filtered.length}
          />

          {/* Data Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={`grid-${activeYear}`} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <DataGrid
                rows={paginatedRows}
                allRows={filtered}
                page={safePageNo}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalRows={filtered.length}
                onPageChange={setPage}
                onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(1); }}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              />
            </motion.div>
            </AnimatePresence>
          </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
