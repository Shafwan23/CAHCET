import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Download, ExternalLink, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { cmsService } from '../../services/cmsService';

const DEPARTMENTS = [
  { id: 'cse', name: 'Computer Science & Engineering', regulations: ['R2021', 'R2024'] },
  { id: 'it', name: 'Information Technology', regulations: ['R2021', 'R2024'] },
  { id: 'ece', name: 'Electronics & Communication', regulations: ['R2021', 'R2024'] },
  { id: 'mech', name: 'Mechanical Engineering', regulations: ['R2021', 'R2019'] },
  { id: 'civil', name: 'Civil Engineering', regulations: ['R2021'] },
  { id: 'aiml', name: 'Artificial Intelligence & Machine Learning', regulations: ['R2024'] },
];

const SyllabusPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegulation, setSelectedRegulation] = useState('All');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await cmsService.getPage('academics');
        const section = pageData?.sections?.find(s => s.sectionKey === 'academics.syllabus');
        if (section && section.content) {
          setData(typeof section.content === 'string' ? JSON.parse(section.content) : section.content);
        }
      } catch (error) {
        console.error('Error fetching syllabus data:', error);
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

  // Group syllabus items by department
  const departments = [];
  if (data?.items) {
    const deptGroups = {};
    data.items.forEach(item => {
      const deptKey = (item.department || 'GEN').toLowerCase();
      if (!deptGroups[deptKey]) {
        const matched = DEPARTMENTS.find(d => d.id === deptKey || d.name.toLowerCase().includes(deptKey));
        deptGroups[deptKey] = {
          id: deptKey,
          name: matched ? matched.name : `${item.department} Department`,
          regulationsSet: new Set(),
          courses: []
        };
      }
      deptGroups[deptKey].courses.push(item);
      if (item.regulation) {
        const regStr = item.regulation.startsWith('R') ? item.regulation : `R${item.regulation}`;
        deptGroups[deptKey].regulationsSet.add(regStr);
      }
    });

    Object.keys(deptGroups).forEach(k => {
      const g = deptGroups[k];
      departments.push({
        id: g.id,
        name: g.name,
        regulations: Array.from(g.regulationsSet),
        pdfUrl: g.courses[0]?.pdfUrl || '#',
        courses: g.courses
      });
    });
  } else {
    departments.push(...DEPARTMENTS);
  }

  // Extract all unique regulations from departments for the filter
  const allRegs = new Set(['All']);
  departments.forEach(dept => {
    if (dept.regulations) {
      dept.regulations.forEach(reg => allRegs.add(reg));
    }
  });
  const regulations = Array.from(allRegs);

  const filteredDepts = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegulation = selectedRegulation === 'All' || (dept.regulations && dept.regulations.includes(selectedRegulation));
    return matchesSearch && matchesRegulation;
  });

  return (
    <div className="pb-32 bg-primary-50 min-h-screen">
      {/* Premium Parallax Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
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
              <span>Academics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold mb-6 leading-tight tracking-tight">
              {data?.title || 'Curriculum & Regulations'}
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
              {data?.description || 'Access department-wise syllabus and regulations. Stay updated with the latest academic curriculum.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Document Portal UI */}
      <section className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 justify-between mb-12">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-primary-100 bg-white/80 backdrop-blur-xl shadow-luxury focus:outline-none focus:border-accent-gold/50 text-sm transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {regulations.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegulation(reg)}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border whitespace-nowrap",
                  selectedRegulation === reg
                    ? "bg-primary-900 text-white border-primary-900 shadow-lg"
                    : "bg-white/80 backdrop-blur-xl text-primary-600 border-primary-100 hover:border-primary-300"
                )}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDepts.map((dept, index) => (
            <motion.div
              key={dept.id || index}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/60 shadow-luxury hover:shadow-glow-lg transition-all duration-700 group flex flex-col justify-between min-h-[16rem] hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50/50 -z-10" />
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/80 to-transparent z-10 pointer-events-none" />
              
              {/* Decorative background shape */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/15 transition-colors duration-700 z-0" />

              <div className="relative z-20">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-accent-gold/20 group-hover:border-accent-gold/50 transition-colors duration-500 shrink-0">
                    <FileText className="w-8 h-8 text-primary-600 group-hover:text-accent-gold transition-colors duration-500" />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {dept.regulations && dept.regulations.map(reg => (
                      <span key={reg} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white text-primary-600 border border-primary-200 shadow-sm group-hover:border-accent-gold/30 transition-colors">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-primary-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-900 group-hover:to-accent-gold transition-all duration-500 mb-2">{dept.name}</h3>
                
                {dept.courses && dept.courses.length > 0 && (
                  <div className="mt-6 max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-primary-200 hover:scrollbar-thumb-accent-gold transition-colors">
                    {dept.courses.map(c => (
                      <div key={c.id} className="flex justify-between items-center text-sm border-b border-primary-100/50 pb-2 last:border-b-0 group/item">
                        <span className="text-primary-800 font-medium group-hover/item:text-primary-900 transition-colors">{c.course} <span className="text-primary-400 font-light text-xs ml-1">(Sem {c.semester})</span></span>
                        <a href={c.pdfUrl || '#'} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-accent-gold font-bold flex items-center gap-1 transition-colors">
                          <span className="text-[10px] uppercase tracking-widest">PDF</span> <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-primary-100/50 relative z-20">
                <a href={dept.pdfUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-accent-gold transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span className="border-b border-transparent hover:border-accent-gold pb-0.5 transition-colors">Open Program PDF</span>
                </a>
                <a href={dept.pdfUrl || '#'} download className="relative overflow-hidden flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-accent-gold shadow-luxury hover:shadow-glow-lg transition-all duration-500 group/btn">
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                  <Download className="w-4 h-4 relative z-20 group-hover/btn:-translate-y-0.5 transition-transform" />
                  <span className="relative z-20">Download</span>
                </a>
              </div>
            </motion.div>
          ))}

          {filteredDepts.length === 0 && (
            <div className="col-span-full text-center py-12 text-primary-400">
              No departments found matching your criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SyllabusPage;
