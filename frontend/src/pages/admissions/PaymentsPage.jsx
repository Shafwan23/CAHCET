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

  const paymentMethods = [
    {
      id: 'upi',
      tag: 'Quick Transfer',
      name: 'UPI Applications',
      desc: 'Pay directly using Google Pay, PhonePe, Paytm, or BHIM',
      icon: 'Smartphone',
      details: 'You will be redirected to your default UPI app to complete the transaction securely.',
      url: 'upi://pay?pa=cahcet@cityunionbank&pn=CAHCET'
    },
    {
      id: 'razorpay',
      tag: 'Payment Gateway',
      name: 'Razorpay',
      desc: 'Secure checkout via Cards, Netbanking, or Wallets',
      icon: 'CreditCard',
      details: 'You will be redirected to the secure Razorpay checkout page.',
      url: 'https://pages.razorpay.com/pl_SMeppbOQMZiZZQ/view'
    },
    {
      id: 'ccavenue',
      tag: 'Payment Gateway',
      name: 'CCAvenue',
      desc: 'Official City Union Bank Payment Gateway',
      icon: 'Building2',
      details: 'You will be redirected to the CCAvenue portal for C. Abdul Hakeem College.',
      url: 'https://formbuilder.ccavenue.com/live/city-union-bank/c-abdul-hakeem-college-of-engineering-and-technology'
    }
  ];
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
    setIsProcessing(true);
    
    // Redirect logic
    if (selectedMethod.url) {
      setTimeout(() => {
        setIsProcessing(false);
        if (selectedMethod.id === 'upi') {
          // Append amount to UPI intent
          window.location.href = `${selectedMethod.url}&am=${amount}&cu=INR`;
        } else {
          window.open(selectedMethod.url, '_blank');
        }
      }, 1500);
      return;
    }

    if (selectedMethod.id === 'upi' && !utrNumber && !selectedMethod.url) {
      alert("Please enter the UPI Transaction Reference / UTR Number to confirm direct bank transfer.");
      setIsProcessing(false);
      return;
    }

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
      <div className="min-h-screen bg-white text-gray-800 relative overflow-hidden flex flex-col justify-between selection:bg-accent-gold/30 selection:text-primary-950 font-sans">
        <Helmet>
          <title>Payments Portal | CAHCET</title>
          <meta name="description" content="Secure payments gateway portal for CAHCET college admissions fees, applications, and advancements." />
        </Helmet>

        <Navbar />

        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-blue-50/50 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[120px]" />
        </div>

        <FloatingParticles count={25} color="rgba(212, 175, 55, 0.15)" />

        {/* Premium Parallax Hero Section */}
        <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-primary-950 flex items-center min-h-[40vh] md:min-h-[50vh] rounded-b-[3rem] shadow-luxury z-10 mb-20">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-primary-950/50" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-xs font-bold uppercase tracking-widest text-accent-gold mb-6 shadow-glow-sm backdrop-blur-md">
              <ShieldCheck className="w-4.5 h-4.5" />
              Secured 256-Bit SSL Encryption
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-gold leading-tight">
              {title}
            </h1>
            <p className="text-xl text-primary-200 font-light max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </motion.div>
        </header>

        <main className="flex-grow py-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex flex-col gap-12">

          {/* Payment Flow Widget (Fintech Style) */}
          <div className="max-w-4xl mx-auto w-full">
            
            {/* Process Navigation Bar */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex justify-between items-center bg-white/95 backdrop-blur-xl border border-primary-100 rounded-3xl p-6 mb-10 shadow-lg overflow-hidden relative z-10 group"
            >
              {/* Dynamic Animated Background inside the nav bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-accent-gold/5 to-emerald-50/50 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div 
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(212,175,55,0.05)_50%,transparent_100%)] bg-[length:200%_100%] pointer-events-none" 
              />
              
              <div className="flex items-center gap-3 md:gap-4 relative z-10">
                <motion.span 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 transition-all duration-500 shadow-sm relative ${
                    step === 1 ? 'bg-gradient-to-br from-accent-gold to-yellow-600 text-white shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 'bg-primary-50 border border-primary-100 text-primary-400'
                  }`}
                >
                  {step === 1 && <span className="absolute inset-0 rounded-full border-2 border-accent-gold animate-ping opacity-30" />}
                  1
                </motion.span>
                <span className={`text-sm md:text-base font-extrabold hidden md:inline tracking-wide transition-colors duration-300 ${step === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-700' : 'text-gray-400'}`}>Amount Details</span>
              </div>

              {/* Animated Connector Line */}
              <div className="flex-1 max-w-[40px] md:max-w-none mx-2 md:mx-6 relative z-10 flex items-center">
                <div className="w-full h-1 bg-primary-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: step > 1 ? "100%" : "0%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-accent-gold to-emerald-400"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-4 relative z-10">
                <motion.span 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 transition-all duration-500 shadow-sm relative ${
                    step === 2 ? 'bg-gradient-to-br from-accent-gold to-yellow-600 text-white shadow-[0_0_20px_rgba(212,175,55,0.5)]' : step === 3 ? 'bg-gradient-to-br from-emerald-500 to-emerald-400 text-white' : 'bg-white border border-primary-100 text-gray-400'
                  }`}
                >
                  {step === 2 && <span className="absolute inset-0 rounded-full border-2 border-accent-gold animate-ping opacity-30" />}
                  2
                </motion.span>
                <span className={`text-sm md:text-base font-extrabold hidden md:inline tracking-wide transition-colors duration-300 ${step === 2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-700' : 'text-gray-400'}`}>Confirm Checkout</span>
              </div>

              {/* Animated Connector Line */}
              <div className="flex-1 max-w-[40px] md:max-w-none mx-2 md:mx-6 relative z-10 flex items-center">
                <div className="w-full h-1 bg-primary-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: step > 2 ? "100%" : "0%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-4 relative z-10">
                <motion.span 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 transition-all duration-500 shadow-sm relative ${
                    step === 3 ? 'bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-white border border-primary-100 text-gray-400'
                  }`}
                >
                  {step === 3 && <span className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-30" />}
                  3
                </motion.span>
                <span className={`text-sm md:text-base font-extrabold hidden md:inline tracking-wide transition-colors duration-300 ${step === 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500' : 'text-gray-400'}`}>Success Invoice</span>
              </div>
            </motion.div>

            {/* Widget Main Box */}
            <div className="bg-white/95 backdrop-blur-2xl border border-primary-50 rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-primary-50/50 z-0" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl group-hover:bg-accent-gold/10 transition-all duration-700 z-0 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl transition-all duration-700 z-0 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Amount Selection & Payment Method Picking */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col gap-10"
                  >
                    <div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-950 mb-2">1. Specify Payment Amount</h2>
                      <p className="text-sm md:text-base text-gray-500 font-light">Select a standard admission fee category or enter a custom amount.</p>
                    </div>

                    {/* Pre-filled selections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                      <button
                        onClick={() => handleAmountSelect('500')}
                        className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-center relative overflow-hidden group/btn ${
                          amount === '500' && !customAmount
                            ? 'bg-primary-950 border-primary-950 text-white shadow-luxury'
                            : 'bg-white border-primary-100 text-primary-800 hover:border-accent-gold/50 shadow-sm hover:shadow-md hover:-translate-y-1'
                        }`}
                      >
                        {amount === '500' && !customAmount && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
                        )}
                        <div className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${amount === '500' && !customAmount ? 'text-accent-gold' : 'text-primary-400'}`}>Application Fee</div>
                        <div className={`text-3xl font-black ${amount === '500' && !customAmount ? 'text-white' : 'text-primary-950 group-hover/btn:text-accent-gold transition-colors'}`}>₹ 500</div>
                      </button>

                      <button
                        onClick={() => handleAmountSelect('2000')}
                        className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-center relative overflow-hidden group/btn ${
                          amount === '2000' && !customAmount
                            ? 'bg-primary-950 border-primary-950 text-white shadow-luxury'
                            : 'bg-white border-primary-100 text-primary-800 hover:border-accent-gold/50 shadow-sm hover:shadow-md hover:-translate-y-1'
                        }`}
                      >
                        {amount === '2000' && !customAmount && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
                        )}
                        <div className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${amount === '2000' && !customAmount ? 'text-accent-gold' : 'text-primary-400'}`}>Seat Booking</div>
                        <div className={`text-3xl font-black ${amount === '2000' && !customAmount ? 'text-white' : 'text-primary-950 group-hover/btn:text-accent-gold transition-colors'}`}>₹ 2,000</div>
                      </button>

                      <div className="bg-white border border-primary-100 shadow-sm rounded-3xl p-6 flex flex-col justify-center focus-within:border-accent-gold/50 focus-within:shadow-md transition-all relative group/custom">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-primary-500 mb-3 block group-focus-within/custom:text-accent-gold transition-colors">Custom Amount (INR)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 font-bold text-lg group-focus-within/custom:text-accent-gold transition-colors">₹</span>
                          <input
                            type="text"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className="w-full bg-slate-50 border border-primary-100 rounded-2xl py-3 pl-10 pr-4 text-xl font-bold text-primary-950 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 transition-all shadow-inner placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-950 mb-2">2. Select Payment Method</h2>
                      <p className="text-sm md:text-base text-gray-500 font-light">Pick an authorized channel to complete payment of <span className="text-accent-gold font-bold">₹ {amount}</span>.</p>
                    </div>

                    {/* Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      {paymentMethods.map((method, idx) => {
                        const Icon = Icons[method.icon] || CreditCard;
                        return (
                          <button
                            key={method.id || idx}
                            onClick={() => handleSelectMethod(method)}
                            className="p-6 rounded-3xl border border-primary-100 bg-white shadow-sm hover:shadow-luxury hover:-translate-y-1 hover:border-accent-gold/50 duration-500 transition-all flex items-start gap-5 group relative overflow-hidden text-left"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-50/50 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_ease-in-out_infinite]" />
                            <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl text-primary-600 group-hover:bg-accent-gold/10 group-hover:text-accent-gold group-hover:border-accent-gold/30 duration-500 relative z-10 shadow-inner">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="relative z-10">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-primary-500 group-hover:text-accent-gold block mb-1.5 transition-colors">{method.tag}</span>
                              <h3 className="text-lg font-bold text-primary-950 mb-1.5 duration-300">{method.name}</h3>
                              <p className="text-sm text-primary-600 font-light leading-relaxed">{method.desc}</p>
                            </div>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalMethod(method);
                              }}
                              className="absolute top-5 right-5 text-primary-400 hover:text-accent-gold p-1.5 bg-white border border-primary-100 rounded-full shadow-sm z-20 transition-colors"
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
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-950 mb-2">Confirm Payment Particulars</h2>
                      <p className="text-sm md:text-base text-gray-500 font-light">Please verify transaction details before releasing funds.</p>
                    </div>

                    <div className="bg-white border border-primary-100 shadow-sm rounded-[2.5rem] p-8 flex flex-col gap-6 relative z-10">
                      <div className="flex justify-between items-center border-b border-primary-50 pb-4">
                        <span className="text-sm font-bold text-primary-500 uppercase tracking-widest">Billing Entity</span>
                        <span className="text-base font-bold text-primary-950">CAHCET Finance Block</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-primary-50 pb-4">
                        <span className="text-sm font-bold text-primary-500 uppercase tracking-widest">Selected Method</span>
                        <span className="text-base font-bold text-primary-950 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent-gold" />
                          {selectedMethod.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-primary-500 uppercase tracking-widest">Payable Amount (INR)</span>
                        <span className="text-4xl font-display font-black text-emerald-600 drop-shadow-sm">₹ {amount}</span>
                      </div>
                    </div>

                    {/* Specific UPI workflow with instruction QR Code (Only if not redirecting directly via App) */}
                    {selectedMethod.id === 'upi' && !selectedMethod.url && (
                      <div className="border border-primary-200 rounded-[2.5rem] p-8 bg-slate-50 flex flex-col items-center gap-6 text-center shadow-inner relative z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-accent-gold/10 blur-xl rounded-full" />
                          <QrCode className="w-40 h-40 text-primary-950 p-3 border border-primary-200 rounded-3xl bg-white relative z-10 shadow-sm" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary-950">Scan CAHCET UPI QR</div>
                          <div className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Complete your transaction using Google Pay, PhonePe, or BHIM.</div>
                        </div>
                        
                        <div className="w-full max-w-sm flex flex-col gap-2 text-left mt-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">UPI Transaction UTR / Ref Number</label>
                          <input
                            required
                            type="text"
                            placeholder="Enter 12-digit UTR"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-primary-200 rounded-2xl py-3 px-5 text-lg text-primary-950 focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/50 shadow-inner placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    )}

                    {isProcessing ? (
                      <div className="text-center py-10 relative z-10">
                        <div className="w-14 h-14 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin mx-auto mb-6 shadow-glow-sm" />
                        <p className="text-lg text-primary-600 font-light">Processing secure transaction. <br/><span className="text-accent-gold font-medium text-sm">Please do not close or reload window...</span></p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-5 relative z-10 mt-6">
                        <button
                          onClick={handleResetFlow}
                          className="flex-1 py-5 bg-white border border-primary-200 hover:bg-primary-50 text-primary-800 font-bold rounded-2xl text-center active:scale-98 transition-all shadow-sm"
                        >
                          Cancel / Back
                        </button>
                        <button
                          onClick={handleProcessPayment}
                          className="flex-[2] py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold rounded-2xl text-center active:scale-98 transition-all shadow-luxury hover:shadow-[0_10px_30px_rgba(16,185,129,0.3)] relative overflow-hidden group/pay border border-emerald-400/50"
                        >
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/pay:animate-[shimmer_1.5s_ease-in-out_infinite]" />
                          <span className="relative z-10 text-lg uppercase tracking-wider">Confirm & Pay ₹ {amount}</span>
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
                    <CheckCircle2 className="w-24 h-24 text-emerald-500 animate-bounce drop-shadow-sm" />
                    
                    <div>
                      <h2 className="text-3xl md:text-4xl font-display font-extrabold text-primary-950">Payment Successful!</h2>
                      <p className="text-base text-gray-500 mt-2 font-light">Your transaction has been authorized and securely verified.</p>
                    </div>

                    <div className="w-full max-w-md bg-white border border-primary-100 shadow-sm rounded-[2rem] p-8 text-left flex flex-col gap-4 font-light text-base text-gray-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl" />
                      <div className="flex justify-between items-center border-b border-primary-50 pb-3">
                        <span className="text-xs uppercase tracking-widest text-primary-400 font-bold">Invoice ID</span>
                        <span className="font-bold text-primary-950">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-primary-50 pb-3">
                        <span className="text-xs uppercase tracking-widest text-primary-400 font-bold">Paid Amount</span>
                        <span className="font-bold text-emerald-600 text-xl">₹ {amount}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-primary-50 pb-3">
                        <span className="text-xs uppercase tracking-widest text-primary-400 font-bold">Date / Time</span>
                        <span className="font-medium text-primary-950 text-sm">{new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs uppercase tracking-widest text-primary-400 font-bold">Status</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleResetFlow}
                      className="bg-accent-gold/10 hover:bg-accent-gold hover:text-white text-accent-gold font-bold px-10 py-4 rounded-2xl shadow-sm transition-all mt-6 active:scale-98"
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
                className="bg-white/95 backdrop-blur-3xl border border-primary-100 rounded-[2.5rem] p-10 max-w-md w-full relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] text-gray-800 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-primary-50/50 rounded-[2.5rem] pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />

                <button 
                  onClick={() => setModalMethod(null)}
                  className="absolute top-6 right-6 text-primary-400 hover:text-primary-950 bg-white border border-primary-100 rounded-full p-2 transition-all z-10 hover:bg-primary-50 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-display font-bold text-primary-950 mb-6 flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-accent-gold/10 rounded-2xl border border-accent-gold/20 shadow-sm">
                    <Info className="w-6 h-6 text-accent-gold" />
                  </div>
                  <span>{modalMethod.name}</span>
                </h3>

                <p className="text-base text-primary-600 leading-relaxed font-light mb-10 relative z-10">
                  {modalMethod.details}
                </p>

                <button
                  onClick={() => {
                    const selected = modalMethod;
                    setModalMethod(null);
                    handleSelectMethod(selected);
                  }}
                  className="w-full relative overflow-hidden group/modalbtn bg-primary-950 hover:bg-black text-white py-4 rounded-2xl font-extrabold text-base shadow-luxury hover:shadow-glow-sm transition-all z-10"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/modalbtn:animate-[shimmer_1.5s_ease-in-out_infinite]" />
                  <span className="relative z-10 tracking-wide">Proceed with {modalMethod.name}</span>
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
