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
    <div className="pb-32">
      {/* Header */}
      <section className="container mx-auto px-4 md:px-8 max-w-5xl text-center pt-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-accent-gold text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-10 h-[2px] bg-accent-gold" />
            <span>Academics</span>
            <span className="w-10 h-[2px] bg-accent-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">{data?.title || 'Curriculum & Regulations'}</h1>
          <p className="text-xl text-primary-600 leading-relaxed font-light max-w-3xl mx-auto">
            {data?.description || 'Access department-wise syllabus and regulations. Stay updated with the latest curriculum.'}
          </p>
        </motion.div>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-primary-100 shadow-luxury hover:shadow-luxury-hover transition-all duration-500 group flex flex-col justify-between min-h-[14rem] h-auto relative overflow-hidden hover:border-accent-gold/20"
            >
              {/* Decorative background shape */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors duration-500" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-accent-gold/20 group-hover:text-accent-gold transition-colors">
                    <FileText className="w-6 h-6 text-primary-600 group-hover:text-accent-gold transition-colors" />
                  </div>
                  <div className="flex gap-1">
                    {dept.regulations && dept.regulations.map(reg => (
                      <span key={reg} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary-50 text-primary-500 border border-primary-100">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary-900 group-hover:text-accent-gold transition-colors">{dept.name}</h3>
                
                {dept.courses && dept.courses.length > 0 && (
                  <div className="mt-4 max-h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                    {dept.courses.map(c => (
                      <div key={c.id} className="flex justify-between items-center text-xs border-b border-primary-50 pb-1.5 last:border-b-0">
                        <span className="text-primary-800 font-medium">{c.course} <span className="text-primary-400 font-light">(Sem {c.semester})</span></span>
                        <a href={c.pdfUrl || '#'} target="_blank" rel="noreferrer" className="text-accent-gold hover:underline font-bold flex items-center gap-0.5 ml-2">
                          PDF <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-primary-50">
                <a href={dept.pdfUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-accent-gold transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Program PDF</span>
                </a>
                <a href={dept.pdfUrl || '#'} download className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-900 hover:text-white hover:shadow-md transition-all duration-300 border border-primary-100 hover:border-transparent">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
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
