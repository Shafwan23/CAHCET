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
    desc: "This scholarship is given to BC, MBC and BCM who are coming through single window admission(Counseling).",
    meta: "BC / MBC / BCM",
    icon: Users
  },
  {
    title: "Adi Draviddar and ST Scholarship",
    desc: "This Scholarship is given to all SC/ST/SC Converted Christian as well.",
    meta: "SC / ST / SCC",
    icon: GraduationCap
  },
  {
    title: "Merit-cum-Means Scholarship",
    desc: "This scholarship is given to all minority communities like Muslim, Christian, Sikh, etc…",
    meta: "Minority Communities",
    icon: DollarSign
  },
  {
    title: "First Graduate Scholarship",
    desc: "This scholarship is given to student(s) who is first graduate from his/her family and should be admitted through single window admission(Counseling).",
    meta: "First Graduate",
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
          <div className="absolute top-0 right-1/4 w-[600px] max-w-full h-[600px] bg-blue-100/50 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/4 w-[500px] max-w-full h-[500px] bg-accent-gold/5 rounded-full blur-[130px]" />
        </div>

        <FloatingParticles count={25} color="rgba(212, 175, 55, 0.12)" />

        {/* Premium Parallax Hero Section */}
        <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
            <div className="absolute top-1/4 left-1/4 w-[500px] max-w-full h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] max-w-full h-[400px] bg-amber-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-xs font-bold uppercase tracking-widest text-accent-gold mb-6 shadow-glow-sm backdrop-blur-md">
              <Award className="w-4.5 h-4.5" />
              Financial Assistance Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold leading-tight">
              {title}
            </h1>
            <p className="text-xl text-primary-200 font-light max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </motion.div>
        </header>

        <main className="flex-grow py-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-28">

          {/* Scholarship Categories Section (Moved to Top as Requested) */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-display font-extrabold text-primary-950 mb-6 tracking-tight"
              >
                Available Scholarships
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "8rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-2 bg-gradient-to-r from-accent-gold to-yellow-500 mx-auto mb-6 rounded-full shadow-glow-sm" 
              />
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-primary-600 font-light text-xl"
              >
                Explore the exclusive scholarship programs available for our students.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.15, duration: 0.7 }}
                    className="relative bg-white/90 backdrop-blur-2xl border border-primary-100 rounded-[3rem] p-10 shadow-luxury hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.2)] transition-all duration-700 group flex flex-col hover:-translate-y-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/15 transition-all duration-700 z-0 pointer-events-none" />
                    
                    <div className="flex items-start gap-6 mb-8 relative z-20">
                      <div className="w-20 h-20 bg-primary-50 text-primary-500 group-hover:bg-accent-gold group-hover:text-white rounded-[1.5rem] flex items-center justify-center shadow-sm duration-500 transition-all border border-primary-100 group-hover:border-accent-gold group-hover:shadow-glow-sm shrink-0">
                        <Icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="inline-block text-[10px] font-black tracking-widest text-accent-gold uppercase font-display bg-accent-gold/10 px-4 py-1.5 rounded-full border border-accent-gold/20 mb-3 shadow-inner">
                          {cat.meta}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-950 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-950 group-hover:to-accent-gold transition-all duration-500">
                          {cat.title}
                        </h3>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-primary-100/50 rounded-3xl p-6 relative z-20 flex-1 shadow-inner group-hover:bg-white transition-colors duration-500">
                      <p className="text-lg text-primary-700 font-light leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Academic Merit Concessions */}
          <div className="w-full relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-primary-950 mb-6">
                Academic Merit Concessions
              </h2>
              <div className="w-24 h-1.5 bg-accent-gold mx-auto mb-6 rounded-full shadow-glow-sm" />
              <p className="text-primary-600 font-light text-xl">
                Tuition fee waiver scale structured for B.E. / B.Tech courses matching 10+2 / HSC results.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="overflow-hidden rounded-[3rem] border border-white/60 shadow-luxury bg-white/80 backdrop-blur-xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-gold/5 pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative z-10 divide-y md:divide-y-0 md:divide-x divide-primary-100/50">
                {/* Left Side: Illustration / Info */}
                <div className="col-span-1 md:col-span-4 bg-primary-950 p-10 flex flex-col justify-center text-white relative overflow-hidden">
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl" />
                  <Award className="w-16 h-16 text-accent-gold mb-6" />
                  <h3 className="text-3xl font-display font-bold mb-4">Merit Scholarship</h3>
                  <p className="text-primary-200 font-light text-lg">Your hard work deserves to be rewarded. Maintain high academic standards to secure these annual fee waivers.</p>
                </div>
                
                {/* Right Side: The Table */}
                <div className="col-span-1 md:col-span-8 p-0 overflow-x-auto">
                  <div className="w-full overflow-x-auto">
<table className="w-full text-left border-collapse h-full min-w-[500px] max-w-full">
                    <thead>
                      <tr className="bg-primary-50/50 text-primary-500 font-display text-xs uppercase tracking-widest border-b border-primary-100/50">
                        <th className="py-6 px-8 font-black">10+2 / HSC Marks (Aggregate)</th>
                        <th className="py-6 px-8 font-black text-right">Fee Waiver Per Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100/30">
                      {scholarshipRates.map((rate, idx) => (
                        <motion.tr 
                          key={idx} 
                          whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                          className="transition-colors duration-300 text-primary-800 group"
                        >
                          <td className="py-6 px-8 font-bold text-xl text-primary-950">{rate.marks}</td>
                          <td className="py-6 px-8 text-right text-emerald-600 font-extrabold text-xl flex items-center justify-end gap-3">
                            <Percent className="w-5 h-5 text-emerald-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
                            <span className="group-hover:text-emerald-500 transition-colors">{rate.scholarship}</span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Eligibility Rules */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[3rem] p-10 md:p-16 shadow-luxury relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent z-0" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-full sm:w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" 
            />
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-primary-100/50 pb-8 relative z-10">
              <div className="p-5 bg-gradient-to-br from-accent-gold to-yellow-600 text-white rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary-950">
                  Eligibility Directives
                </h2>
                <p className="text-lg text-primary-500 font-light mt-2">
                  Important criteria governed by institutional and state regulations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {eligibilityRules.map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -5 }}
                    className="flex items-start gap-6 p-8 rounded-[2rem] bg-white border border-primary-100 shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:border-accent-gold/40 duration-500 transition-all group/rule"
                  >
                    <div className={`p-4 rounded-xl shrink-0 border border-primary-100 shadow-inner group-hover/rule:bg-accent-gold/10 group-hover/rule:border-accent-gold/30 transition-colors duration-500`}>
                      <Icon className={`w-8 h-8 ${rule.color} group-hover/rule:scale-110 transition-transform duration-300`} />
                    </div>
                    <p className="text-base md:text-lg text-primary-700 leading-relaxed font-medium pt-1">
                      {rule.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default ScholarshipPage;
