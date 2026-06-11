import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Coins, 
  CheckCircle2, 
  Info, 
  X, 
  AlertCircle,
  QrCode,
  DollarSign
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import FloatingParticles from '../../components/ui/FloatingParticles';
import { cmsService } from '../../services/cmsService';
import * as Icons from 'lucide-react';

// Data will be fetched from CMS
const PaymentsPage = () => {
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

  const paymentMethods = cmsData['admissions.fees']?.methods || [];
  const title = 'Secure Payments Portal';
  const description = 'Pay admission registration and application fees safely using multiple validated payment channels.';

  const [step, setStep] = useState(1); // 1: Enter Amount, 2: Select Method, 3: Success Receipt
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('500'); // Default application fee
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalMethod, setModalMethod] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');


  const handleAmountSelect = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    setAmount(val);
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setStep(2);
  };

  const handleProcessPayment = () => {
    if (selectedMethod.id === 'upi' && !utrNumber) {
      alert("Please enter the UPI Transaction Reference / UTR Number to confirm direct bank transfer.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2500);
  };

  const handleResetFlow = () => {
    setStep(1);
    setSelectedMethod(null);
    setUtrNumber('');
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 text-gray-800 relative overflow-hidden flex flex-col justify-between selection:bg-primary-100 selection:text-emerald-950 font-sans">
        <Helmet>
          <title>Payments Portal | CAHCET</title>
          <meta name="description" content="Secure payments gateway portal for CAHCET college admissions fees, applications, and advancements." />
        </Helmet>

        <Navbar />

        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[130px]" />
        </div>

        <FloatingParticles count={20} color="rgba(16, 185, 129, 0.08)" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-[0.25em] text-amber-400 mb-6">
              <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
              Secured 256-Bit SSL Encryption
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mb-4 text-white">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
              {description}
            </p>
          </motion.div>
        </header>

        <main className="flex-grow py-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-12">

          {/* Payment Flow Widget (Fintech Style) */}
          <div className="max-w-4xl mx-auto w-full">
            
            {/* Process Navigation Bar */}
            <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-4 mb-8 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  step === 1 ? 'bg-primary-950 text-white' : 'bg-primary-100 text-emerald-700'
                }`}>
                  1
                </span>
                <span className={`text-sm font-semibold hidden md:inline ${step === 1 ? 'text-primary-950' : 'text-gray-500'}`}>Amount Details</span>
              </div>
              <div className="flex-1 max-w-[40px] md:max-w-none h-px bg-gray-300 mx-2 md:mx-4" />
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  step === 2 ? 'bg-primary-950 text-white' : step === 3 ? 'bg-primary-100 text-emerald-700' : 'bg-gray-155 border border-gray-300 text-gray-400'
                }`}>
                  2
                </span>
                <span className={`text-sm font-semibold hidden md:inline ${step === 2 ? 'text-primary-950' : 'text-gray-500'}`}>Confirm Checkout</span>
              </div>
              <div className="flex-1 max-w-[40px] md:max-w-none h-px bg-gray-300 mx-2 md:mx-4" />
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  step === 3 ? 'bg-amber-600 text-white' : 'bg-gray-155 border border-gray-300 text-gray-400'
                }`}>
                  3
                </span>
                <span className={`text-sm font-semibold hidden md:inline ${step === 3 ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>Success Invoice</span>
              </div>
            </div>

            {/* Widget Main Box */}
            <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-md relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Amount Selection & Payment Method Picking */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col gap-8"
                  >
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-950 mb-2">1. Specify Payment Amount</h2>
                      <p className="text-sm text-gray-500">Select a standard admission fee category or enter a custom amount.</p>
                    </div>

                    {/* Pre-filled selections */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleAmountSelect('500')}
                        className={`p-5 rounded-2xl border text-center transition-all ${
                          amount === '500' && !customAmount
                            ? 'bg-primary-950 border-primary-950 text-white shadow-md'
                            : 'bg-slate-50 border-gray-200 text-gray-700 hover:border-primary-950/30'
                        }`}
                      >
                        <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Application Fee</div>
                        <div className="text-2xl font-black">₹ 500</div>
                      </button>

                      <button
                        onClick={() => handleAmountSelect('2000')}
                        className={`p-5 rounded-2xl border text-center transition-all ${
                          amount === '2000' && !customAmount
                            ? 'bg-primary-950 border-primary-950 text-white shadow-md'
                            : 'bg-slate-50 border-gray-200 text-gray-700 hover:border-primary-950/30'
                        }`}
                      >
                        <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Seat Booking Deposit</div>
                        <div className="text-2xl font-black">₹ 2,000</div>
                      </button>

                      <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-center">
                        <label className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2 block">Custom Amount (INR)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                          <input
                            type="text"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-7 pr-3 text-base md:text-sm text-gray-900 focus:outline-none focus:border-accent-gold"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-950 mb-2">2. Select Payment Method</h2>
                      <p className="text-sm text-gray-500">Pick an authorized channel to complete payment of <span className="text-primary-900 font-bold">₹ {amount}</span>.</p>
                    </div>

                    {/* Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method, idx) => {
                        const Icon = Icons[method.icon] || CreditCard;
                        return (
                          <button
                            key={method.id || idx}
                            onClick={() => handleSelectMethod(method)}
                            className="p-5 rounded-2xl border border-gray-200 text-left bg-slate-50/50 hover:bg-slate-50 hover:border-accent-gold/50 duration-300 transition-all flex items-start gap-4 group relative overflow-hidden"
                          >
                            <div className="p-3 bg-white border border-gray-150 rounded-xl text-primary-900 group-hover:bg-accent-gold/15 group-hover:text-accent-gold duration-300">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-gold block mb-0.5">{method.tag}</span>
                              <h3 className="text-sm font-bold text-primary-950 mb-1 group-hover:text-accent-gold duration-300">{method.name}</h3>
                              <p className="text-xs text-gray-500 font-light leading-relaxed">{method.desc}</p>
                            </div>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalMethod(method);
                              }}
                              className="absolute top-4 right-4 text-gray-400 hover:text-primary-900 p-0.5"
                            >
                              <Info className="w-4 h-4" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Checkout Confirmation Screen */}
                {step === 2 && selectedMethod && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary-950 mb-2">Confirm Payment Particulars</h2>
                      <p className="text-sm text-gray-500">Please verify transaction details before releasing funds.</p>
                    </div>

                    <div className="bg-slate-50 border border-gray-200 rounded-3xl p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                        <span className="text-sm text-gray-500">Billing Entity</span>
                        <span className="text-sm font-bold text-primary-950">CAHCET Finance Block</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                        <span className="text-sm text-gray-500">Selected Method</span>
                        <span className="text-sm font-bold text-primary-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4.5 h-4.5 text-amber-600" />
                          {selectedMethod.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Payable Amount (INR)</span>
                        <span className="text-2xl font-black text-emerald-700">₹ {amount}</span>
                      </div>
                    </div>

                    {/* Specific UPI workflow with instruction QR Code */}
                    {selectedMethod.id === 'upi' && (
                      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 bg-white flex flex-col items-center gap-4 text-center">
                        <QrCode className="w-32 h-32 text-primary-950 p-2 border border-gray-150 rounded-2xl bg-slate-50" />
                        <div>
                          <div className="text-sm font-bold text-primary-950">Scan CAHCET UPI QR</div>
                          <div className="text-xs text-gray-500 mt-1">Complete your transaction using Google Pay / PhonePe / BHIM.</div>
                        </div>
                        
                        <div className="w-full max-w-sm flex flex-col gap-2 text-left mt-2">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">UPI Transaction UTR / Ref Number</label>
                          <input
                            required
                            type="text"
                            placeholder="Enter 12-digit transaction UTR"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 px-4 text-base md:text-sm text-gray-900 focus:outline-none focus:border-accent-gold"
                          />
                        </div>
                      </div>
                    )}

                    {isProcessing ? (
                      <div className="text-center py-6">
                        <div className="w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-gray-500">Processing secure transaction. Please do not close or reload window...</p>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={handleResetFlow}
                          className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-2xl text-center active:scale-98 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProcessPayment}
                          className="flex-[2] py-4 bg-amber-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-center active:scale-98 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
                        >
                          Confirm & Pay ₹ {amount}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: Success Screen with invoice generation */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-6 flex flex-col items-center gap-6"
                  >
                    <CheckCircle2 className="w-20 h-20 text-amber-600 animate-bounce" />
                    
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-primary-950">Payment Successful!</h2>
                      <p className="text-sm text-gray-500 mt-1">Your transaction has been authorized and securely verified.</p>
                    </div>

                    <div className="w-full max-w-md bg-slate-50 border border-gray-200 rounded-3xl p-6 text-left flex flex-col gap-3 font-light text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Invoice ID</span>
                        <span className="font-semibold text-primary-950">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Amount</span>
                        <span className="font-semibold text-emerald-700">₹ {amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date / Time</span>
                        <span className="font-semibold text-primary-950">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className="font-semibold text-amber-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-amber-600" /> Verified
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleResetFlow}
                      className="bg-primary-950 hover:bg-primary-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all mt-4"
                    >
                      Make Another Payment
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </div>

        </main>

        {/* Modal display for selected gateway info */}
        <AnimatePresence>
          {modalMethod && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-primary-950/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="bg-white border border-gray-200 rounded-[2rem] p-8 max-w-md w-full relative shadow-2xl text-gray-800"
              >
                <button 
                  onClick={() => setModalMethod(null)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>

                <h3 className="text-xl font-bold text-primary-950 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent-gold" />
                  <span>{modalMethod.name}</span>
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed font-light mb-6">
                  {modalMethod.details}
                </p>

                <button
                  onClick={() => {
                    const selected = modalMethod;
                    setModalMethod(null);
                    handleSelectMethod(selected);
                  }}
                  className="w-full bg-primary-950 hover:bg-primary-900 text-white py-3 rounded-xl font-bold text-sm"
                >
                  Proceed with {modalMethod.name}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default PaymentsPage;
