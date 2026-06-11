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
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary-50/30 rounded-full blur-[130px]" />
        </div>

        <FloatingParticles count={25} color="rgba(37, 99, 235, 0.1)" />

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
              <HandCoins className="w-4.5 h-4.5 text-accent-gold" />
              Corporate Finance Collaboration
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

          {/* Main Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-14 shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <h2 className="text-2xl md:text-3.5xl font-display font-extrabold text-primary-950 leading-tight">
                  Easing the Path to Higher Education
                </h2>
                
                <p className="text-gray-600 font-light leading-relaxed">
                  C. Abdul Hakeem College of Engineering and Technology aims to support deserving / meritorious students in availing financial assistance for pursuing their higher education.
                </p>
                
                <p className="text-gray-605 font-light leading-relaxed">
                  To encourage students despite financial limitations, most nationalized and private banks provide attractive education loan facilities. We help students in speedy disposal of loan applications across the country.
                </p>
              </div>

              <div className="lg:col-span-5 bg-slate-50 border border-gray-150 p-6 md:p-8 rounded-3xl">
                <h3 className="text-lg font-bold text-primary-950 mb-4 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-accent-gold" />
                  <span>Loan Cell Services</span>
                </h3>
                <ul className="flex flex-col gap-3">
                  {cellOfferings.map((offering, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-700 font-light leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-accent-gold shrink-0 mt-1" />
                      <span>{offering}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Banking Partners */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-primary-950 mb-4">
                Partnered Banking Institutions
              </h2>
              <p className="text-gray-600 font-light text-sm md:text-base">
                Discover the financial institutions providing educational loans to our students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {providers.map((provider, idx) => (
                <motion.div
                  key={provider.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-md hover:border-accent-gold/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden group flex flex-col"
                >
                  <div className="flex gap-6 mb-6">
                    <div className="w-20 h-20 bg-slate-50 border border-gray-100 rounded-2xl p-2 shrink-0 flex items-center justify-center">
                      {provider.logoUrl ? (
                        <img src={provider.logoUrl} alt={provider.bankName} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <Building className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-2xl font-bold text-primary-950 mb-2 group-hover:text-accent-gold transition-colors duration-300">
                        {provider.bankName}
                      </h3>
                      {provider.contact && (
                        <p className="text-sm font-semibold text-gray-500">
                          Contact: {provider.contact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Interest Rate</div>
                      <div className="text-sm font-semibold text-primary-900">{provider.interest || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Eligibility</div>
                      <div className="text-sm font-semibold text-primary-900">{provider.eligibility || 'Standard'}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 font-light leading-relaxed mb-6 flex-1">
                    {provider.process}
                  </p>

                  {provider.documents && provider.documents.length > 0 && (
                    <div className="mt-auto border-t border-gray-100 pt-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Required Forms</div>
                      <div className="flex flex-col gap-2">
                        {provider.documents.map((doc, dIdx) => (
                          <a 
                            key={dIdx}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors group/doc"
                          >
                            <FileText className="w-4 h-4 text-blue-500 group-hover/doc:scale-110 transition-transform" />
                            <span className="text-sm font-semibold text-blue-900 flex-1">{doc.title || 'Download Document'}</span>
                            <ChevronRight className="w-4 h-4 text-blue-300 group-hover/doc:translate-x-1 transition-transform" />
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
