import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Building, 
  HandCoins, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  UserCheck, 
  CalendarClock,
  ChevronRight
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import FloatingParticles from '../../components/ui/FloatingParticles';
import { cmsService } from '../../services/cmsService';

const loanFeatures = [
  {
    title: "Loan Assistance Cell",
    desc: "A dedicated institutional unit providing official letters, fee structure break-ups, and documentation guidelines.",
    icon: Building
  },
  {
    title: "Bank Coordination Support",
    desc: "Active collaboration with nationalized and private banks to streamline processes and verify credentials.",
    icon: UserCheck
  },
  {
    title: "Fast Documentation Help",
    desc: "Immediate issuance of academic transcripts, bonafide certificates, and recognition sheets for bank validation.",
    icon: FileText
  },
  {
    title: "Student Financial Guidance",
    desc: "Personalized advice to help parents select interest-friendly educational credit schemes and installment profiles.",
    icon: HandCoins
  }
];

const cellOfferings = [
  "Official Bonafide certificates and Fee Structure breaks for loan validation",
  "Assistance in filling out Vidya Lakshmi Portal application forms",
  "Clarifications and bank replies regarding University affiliations or AICTE approvals",
  "Speedy disposal of loan verification requests initiated by banking officers"
];

const EducationLoanPage = () => {
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

  const providers = cmsData['admissions.loans']?.providers || [];
  const title = cmsData['admissions.loans']?.title || 'Education Loan Assistance';
  const description = cmsData['admissions.loans']?.description || 'Supporting students to achieve higher education through structured financial aid and banking cell assistance.';

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 text-gray-800 relative overflow-hidden flex flex-col justify-between selection:bg-accent-gold/30 selection:text-primary-950 font-sans">
        <Helmet>
          <title>Education Loan Assistance | CAHCET</title>
          <meta name="description" content="Get professional support from our dedicated Loan Assistance Cell to secure education loans from nationalized and private banks." />
        </Helmet>

        <Navbar />

        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[600px] max-w-full h-[600px] bg-blue-100/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] max-w-full h-[500px] bg-primary-50/30 rounded-full blur-[130px]" />
        </div>

        <FloatingParticles count={25} color="rgba(37, 99, 235, 0.1)" />

        {/* Premium Parallax Hero Section */}
        <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
            <div className="absolute top-1/4 left-1/4 w-[500px] max-w-full h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] max-w-full h-[400px] bg-emerald-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-xs font-bold uppercase tracking-widest text-accent-gold mb-6 shadow-glow-sm backdrop-blur-md">
              <HandCoins className="w-4.5 h-4.5" />
              Corporate Finance Collaboration
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold leading-tight">
              {title}
            </h1>
            <p className="text-xl text-primary-200 font-light max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </motion.div>
        </header>

        <main className="flex-grow py-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-24">

          {/* Core Features Grid */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-display font-bold text-primary-950 mb-6"
              >
                Comprehensive Loan Assistance
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1.5 bg-gradient-to-r from-accent-gold to-yellow-500 mx-auto mb-6 rounded-full shadow-glow-sm" 
              />
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-primary-600 font-light text-lg"
              >
                Our dedicated cell ensures your journey from application to approval is seamless and stress-free.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {loanFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10 }}
                    className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-sm hover:shadow-luxury transition-all duration-500 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent-gold/10 transition-all duration-500 shadow-inner border border-primary-100 group-hover:border-accent-gold/30">
                      <Icon className="w-8 h-8 text-primary-500 group-hover:text-accent-gold transition-colors duration-500" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-950 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-950 group-hover:to-primary-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-light text-primary-600 leading-relaxed relative z-10">
                      {feature.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Main Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/95 backdrop-blur-3xl border border-primary-100 rounded-[3rem] p-10 md:p-16 shadow-luxury relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-accent-gold/5 z-0" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-full sm:w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl z-0 pointer-events-none" 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-xs font-bold uppercase tracking-widest text-primary-600 w-fit">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Institutional Support
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-primary-950 leading-tight">
                  Easing the Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-600">Higher Education</span>
                </h2>
                
                <p className="text-lg text-primary-700 font-light leading-relaxed border-l-4 border-accent-gold pl-6">
                  C. Abdul Hakeem College of Engineering and Technology aims to support deserving / meritorious students in availing financial assistance for pursuing their higher education.
                </p>
                
                <p className="text-lg text-primary-600 font-light leading-relaxed">
                  To encourage students despite financial limitations, most nationalized and private banks provide attractive education loan facilities. We help students in speedy disposal of loan applications across the country.
                </p>
              </div>

              <div className="lg:col-span-5 bg-white border border-primary-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 rounded-[2.5rem] relative overflow-hidden group/card hover:border-accent-gold/40 transition-all duration-700 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-primary-50/50 z-0" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl z-0" />
                
                <h3 className="text-2xl font-display font-bold text-primary-950 mb-8 flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-primary-50 rounded-xl shadow-sm border border-primary-100 group-hover/card:bg-accent-gold/10 group-hover/card:border-accent-gold/30 transition-all duration-500">
                    <CalendarClock className="w-6 h-6 text-accent-gold" />
                  </div>
                  <span>Loan Cell Services</span>
                </h3>
                
                <ul className="flex flex-col gap-6 relative z-10">
                  {cellOfferings.map((offering, idx) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex gap-4 text-base text-primary-800 font-medium leading-relaxed group/item cursor-default"
                    >
                      <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500 group-hover/item:border-emerald-500 transition-colors duration-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 group-hover/item:text-white transition-colors duration-300" />
                      </div>
                      <span className="group-hover/item:text-primary-950 transition-colors duration-300">{offering}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Banking Partners */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-display font-bold text-primary-950 mb-6"
              >
                Partnered Banking Institutions
              </motion.h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1.5 bg-gradient-to-r from-accent-gold to-yellow-500 mx-auto mb-6 rounded-full shadow-glow-sm" 
              />
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-primary-600 font-light text-lg"
              >
                Discover the financial institutions providing educational loans to our students.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {providers.map((provider, idx) => (
                <motion.div
                  key={provider.id || idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.15, duration: 0.7 }}
                  className="relative bg-white/90 backdrop-blur-2xl border border-primary-100 rounded-[3rem] p-10 md:p-12 shadow-luxury hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.15)] transition-all duration-700 group flex flex-col hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_ease-in-out_infinite] z-10 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-accent-gold/10 transition-all duration-700 z-0 pointer-events-none" />

                  <div className="flex flex-col sm:flex-row gap-8 mb-10 relative z-20 items-start">
                    <div className="w-28 h-28 bg-white border border-primary-100 rounded-[2rem] p-4 shrink-0 flex items-center justify-center shadow-sm group-hover:border-accent-gold/40 group-hover:shadow-glow-sm transition-all duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {provider.logoUrl ? (
                        <img loading="lazy" decoding="async" src={provider.logoUrl} alt={provider.bankName} className="w-full h-full object-contain mix-blend-multiply relative z-10 group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <Building className="w-12 h-12 text-primary-300 relative z-10 group-hover:text-accent-gold transition-colors duration-500 group-hover:scale-110" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-3xl font-display font-black text-primary-950 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-950 group-hover:to-accent-gold transition-all duration-500">
                        {provider.bankName}
                      </h3>
                      {provider.contact && (
                         <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 shadow-inner group-hover:bg-accent-gold/5 group-hover:border-accent-gold/20 transition-colors duration-500">
                           <HelpCircle className="w-4 h-4 text-primary-400 group-hover:text-accent-gold transition-colors" />
                           <span className="text-sm font-bold text-primary-600">Contact: <span className="text-primary-950">{provider.contact}</span></span>
                         </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 relative z-20">
                    <div className="bg-white border border-primary-100 p-6 rounded-3xl shadow-sm group-hover:border-accent-gold/20 group-hover:shadow-md transition-all duration-500 hover:-translate-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-2">Interest Rate</div>
                      <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-700">{provider.interest || 'N/A'}</div>
                    </div>
                    <div className="bg-white border border-primary-100 p-6 rounded-3xl shadow-sm group-hover:border-accent-gold/20 group-hover:shadow-md transition-all duration-500 hover:-translate-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-2">Eligibility</div>
                      <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-700 line-clamp-2" title={provider.eligibility || 'Standard'}>{provider.eligibility || 'Standard'}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-primary-100 rounded-[2rem] p-8 mb-10 flex-1 relative z-20 group-hover:bg-white transition-colors duration-500 shadow-inner">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-4">Application Process</div>
                    <p className="text-base text-primary-700 font-medium leading-relaxed">
                      {provider.process}
                    </p>
                  </div>

                  {provider.documents && provider.documents.length > 0 && (
                    <div className="mt-auto pt-4 relative z-20">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-4 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Required Forms
                      </div>
                      <div className="flex flex-col gap-4">
                        {provider.documents.map((doc, dIdx) => (
                          <a 
                            key={dIdx}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-primary-200 hover:border-accent-gold hover:shadow-glow-sm transition-all duration-300 group/doc shadow-sm hover:-translate-y-1"
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover/doc:bg-accent-gold/10 transition-colors duration-300">
                              <FileText className="w-5 h-5 text-blue-500 group-hover/doc:text-accent-gold transition-colors duration-300" />
                            </div>
                            <span className="text-base font-bold text-primary-900 group-hover/doc:text-accent-gold transition-colors duration-300 flex-1">{doc.title || 'Download Document'}</span>
                            <div className="w-8 h-8 rounded-full border border-primary-200 flex items-center justify-center group-hover/doc:border-accent-gold group-hover/doc:bg-accent-gold transition-all duration-300">
                              <ChevronRight className="w-4 h-4 text-primary-400 group-hover/doc:text-white transition-colors duration-300 group-hover/doc:translate-x-0.5" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default EducationLoanPage;
