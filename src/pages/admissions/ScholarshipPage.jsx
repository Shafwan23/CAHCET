import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Award, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  Percent, 
  Users, 
  ShieldAlert, 
  GraduationCap, 
  DollarSign 
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FloatingParticles from '../../components/ui/FloatingParticles';
import { cmsService } from '../../services/cmsService';

const eligibilityRules = [
  {
    text: "Only those students who put in 75% attendance are eligible for scholarships as per government order.",
    icon: CheckCircle,
    color: "text-amber-600"
  },
  {
    text: "Concessions granted are liable to be withdrawn if any misconduct or misbehavior is reported to the Principal.",
    icon: ShieldAlert,
    color: "text-amber-500"
  },
  {
    text: "Candidates with exceptional academic achievement are granted tuition fee financial assistance.",
    icon: Award,
    color: "text-accent-gold"
  },
  {
    text: "Students applying for B.E / B.Tech are evaluated based on 10+2 / HSC marks, and MBA / MCA applicants are evaluated based on undergraduate marks.",
    icon: BookOpen,
    color: "text-blue-500"
  }
];

const scholarshipRates = [
  { marks: "95% and above", scholarship: "35% Tuition Fee Waiver per year" },
  { marks: "90% to 94.9%", scholarship: "30% Tuition Fee Waiver per year" },
  { marks: "85% to 89.9%", scholarship: "20% Tuition Fee Waiver per year" },
  { marks: "80% to 84.9%", scholarship: "10% Tuition Fee Waiver per year" }
];

const categories = [
  {
    title: "Backward Class Scholarship",
    desc: "Available for BC, MBC, and BCM students admitted under the single-window government counseling admission path.",
    meta: "BC / MBC / BCM Candidates",
    icon: Users
  },
  {
    title: "Adi Dravidar & ST Scholarship",
    desc: "Full state government tuition waiver scheme for SC, ST, and SC Converted Christian students meeting eligibility requirements.",
    meta: "SC / ST / SCC Candidates",
    icon: GraduationCap
  },
  {
    title: "Merit-cum-Means Scholarship",
    desc: "National level financial aid allocated for meritorious students belonging to minority communities (Muslim, Christian, Sikh, etc.).",
    meta: "Minority Community Candidates",
    icon: DollarSign
  },
  {
    title: "First Graduate Scholarship",
    desc: "State concession scheme for students who are the first graduates in their family, admitted through counseling channels.",
    meta: "First Graduate Families",
    icon: Award
  }
];

const ScholarshipPage = () => {
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await cmsService.getPage('admissions');
      const sectionsArray = res.data?.sections || [];
      const dataMap = {};
      sectionsArray.forEach(sec => {
        try {
          dataMap[sec.sectionKey] = JSON.parse(sec.content);
        } catch(e) {}
      });
      setCmsData(dataMap);
    } catch (err) {
      console.error('Failed to fetch admissions CMS data', err);
    } finally {
      setLoading(false);
    }
  };

  const scholarships = cmsData['admissions.scholarships']?.scholarships || [];
  const title = cmsData['admissions.scholarships']?.title || 'Scholarships & Awards';
  const description = cmsData['admissions.scholarships']?.description || 'Financial support for meritorious and deserving students to enable seamless academic achievements.';

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 text-gray-800 relative overflow-hidden flex flex-col justify-between selection:bg-accent-gold/30 selection:text-primary-950 font-sans">
        <Helmet>
          <title>Scholarships & Awards | CAHCET</title>
          <meta name="description" content="Discover scholarship schemes, eligibility parameters, and government financial aid details available at CAHCET." />
        </Helmet>

        <Navbar />

        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[130px]" />
        </div>

        <FloatingParticles count={25} color="rgba(212, 175, 55, 0.12)" />

        {/* Hero Section */}
        <header className="relative pt-40 pb-24 overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white text-center rounded-b-[2.5rem] shadow-xl z-10">
          {/* Geometric structural borders for premium design */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -left-16 -top-16 w-64 h-64 border-2 border-white rounded-full" />
            <div className="absolute right-10 bottom-5 w-80 h-80 border border-white/40 rounded-full" />
            <div className="absolute left-1/3 top-10 w-96 h-96 border border-white/20 rounded-full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl px-6 mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-[0.25em] text-accent-gold mb-6">
              <Award className="w-4.5 h-4.5 text-accent-gold" />
              Financial Assistance Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-4 text-white">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
              {description}
            </p>
          </motion.div>
        </header>

        <main className="flex-grow py-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-24">

          {/* Eligibility for Scholarship Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-14 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-10 border-b border-gray-100 pb-6">
              <div className="p-3.5 bg-accent-gold/15 text-accent-gold rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3.5xl font-display font-extrabold text-primary-950">
                  Eligibility for Scholarship
                </h2>
                <p className="text-sm text-gray-500 font-light mt-1">
                  Important directives and criteria governed by institutional and state regulations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eligibilityRules.map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-gray-150/70 hover:border-accent-gold/30 duration-300 transition-colors"
                  >
                    <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${rule.color}`} />
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-light">
                      {rule.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Scholarship Table Section */}
          <div className="w-full">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-primary-950 mb-4">
                Academic Merit Concessions
              </h2>
              <p className="text-gray-600 font-light text-sm md:text-base">
                Tuition fee waiver scale structured for B.E. / B.Tech courses matching 10+2 / HSC results.
              </p>
            </div>

            {/* Desktop Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="hidden md:block overflow-hidden rounded-[2rem] border border-gray-200 shadow-md bg-white"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary-950 text-white font-display text-sm uppercase tracking-wider">
                    <th className="py-6 px-10 border-b border-primary-900 font-bold">10+2 / HSC Marks (Aggregate Percentage)</th>
                    <th className="py-6 px-10 border-b border-primary-900 font-bold text-right">Scholarship / Fee Waiver Per Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scholarshipRates.map((rate, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-slate-50 transition-colors duration-200 text-gray-700"
                    >
                      <td className="py-6 px-10 font-semibold">{rate.marks}</td>
                      <td className="py-6 px-10 text-right text-primary-900 font-bold text-lg flex items-center justify-end gap-2">
                        <Percent className="w-5 h-5 text-accent-gold" />
                        <span>{rate.scholarship}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {scholarshipRates.map((rate, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2"
                >
                  <div className="text-xs uppercase tracking-wider font-bold text-gray-400">HSC Aggregate Marks</div>
                  <div className="text-lg font-bold text-primary-950">{rate.marks}</div>
                  <div className="border-t border-gray-100 my-2 pt-2 flex items-center gap-2 text-primary-900 font-bold text-base">
                    <Percent className="w-5 h-5 text-accent-gold" />
                    <span>{rate.scholarship}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarship Categories Section */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-primary-950 mb-4">
                Available Scholarships
              </h2>
              <p className="text-gray-600 font-light text-sm md:text-base">
                Explore government-assisted schemes and state education waivers supporting various student categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {scholarships.map((cat, idx) => {
                return (
                  <motion.div
                    key={cat.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5 }}
                    className={`bg-white border ${cat.featured ? 'border-accent-gold shadow-lg' : 'border-gray-200'} rounded-3xl p-8 relative overflow-hidden group hover:border-accent-gold/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/[0.03] rounded-full blur-xl group-hover:bg-accent-gold/5 transition-all duration-500" />
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-primary-50 text-primary-900 group-hover:bg-accent-gold/15 group-hover:text-accent-gold rounded-2xl w-fit shadow-inner duration-300 transition-all">
                        <Award className="w-6 h-6" />
                      </div>
                      {cat.images && cat.images.length > 0 && (
                        <div className="flex -space-x-3">
                          {cat.images.map((img, i) => (
                            <img key={i} src={img} alt="Badge" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-bold tracking-widest text-accent-gold block mb-2 uppercase font-display">
                      {cat.amount || 'Financial Aid'}
                    </span>
                    <h3 className="text-xl font-bold text-primary-950 mb-3 group-hover:text-accent-gold transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <div className="mb-3 text-xs font-semibold text-amber-600 bg-primary-50 w-fit px-3 py-1 rounded-md">
                      Eligibility: {cat.eligibility}
                    </div>
                    <p className="text-sm md:text-base text-gray-650 font-light leading-relaxed flex-1">
                      {cat.description}
                    </p>
                    {cat.pdfUrl && (
                      <a href={cat.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent-gold hover:text-amber-600 transition-colors bg-accent-gold/5 px-4 py-2 rounded-xl w-fit">
                        Download Application Form <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default ScholarshipPage;
