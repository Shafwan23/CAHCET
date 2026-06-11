import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Globe, Copy, IndianRupee } from 'lucide-react';
import { applicantAuthService } from '../../../services/applicantAuthService';

const PaymentPage = () => {
  const { currentApplication, fetchData } = useOutletContext();
  const navigate = useNavigate();
  const { applicationId } = useParams();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('card');

  useEffect(() => {
    if (currentApplication) {
      setPaymentSuccess(currentApplication.applicationStatus === 'COMPLETED');
    }
  }, [currentApplication]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Generate a mock transaction ID
    const mockTxnId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const paymentData = {
      paymentMethod: activeTab,
      transactionId: mockTxnId,
      amountPaid: 1000
    };

    // Mock processing delay
    setTimeout(async () => {
      try {
        await applicantAuthService.savePayment(applicationId, paymentData);
        await fetchData(); // refresh context
        setPaymentSuccess(true);
      } catch (error) {
        console.error(error);
        alert('Payment failed');
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 h-full flex flex-col"
    >
      <AnimatePresence mode="wait">
        {paymentSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 flex-grow flex flex-col justify-center"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Thank you for applying to CAHCET. Your application fee has been successfully processed.
            </p>
            <div className="p-6 bg-gray-50 rounded-2xl max-w-sm mx-auto text-left mb-8 shadow-inner">
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                <span className="text-gray-500 text-sm">Applicant Name</span>
                <span className="font-bold text-gray-900 text-sm truncate max-w-[150px]">{currentApplication?.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                <span className="text-gray-500 text-sm">Application ID</span>
                <span className="font-bold text-gray-900 text-sm">CAHCET-{currentApplication?.id.substring(0, 6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                <span className="text-gray-500 text-sm">Transaction ID</span>
                <span className="font-mono text-gray-900 text-sm">{currentApplication?.transactionId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                <span className="text-gray-500 text-sm">Amount Paid</span>
                <span className="font-bold text-gray-900 text-sm flex items-center"><IndianRupee className="w-3 h-3"/> 1,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Status</span>
                <span className="font-bold text-green-500 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4"/> Success
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/admissions/application"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Back to Dashboard
              </Link>
              <button 
                onClick={async () => {
                  try {
                    const data = await applicantAuthService.createApplication();
                    if (data.success) {
                      await fetchData();
                      navigate(`/admissions/application/${data.application.id}/personal`);
                      setPaymentSuccess(false);
                    }
                  } catch(e) {
                    alert("Error starting new application");
                  }
                }}
                className="bg-primary-950 hover:bg-primary-900 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Apply for another child
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-accent-gold/10 text-accent-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-display font-extrabold text-primary-950 mb-2">Application Fee</h1>
              <p className="text-gray-500 text-sm md:text-base">Pay the non-refundable processing fee of ₹1,000 to submit your application.</p>
            </div>

            <div className="max-w-xl mx-auto flex flex-col md:flex-row gap-8">
              {/* Left Side: Payment Tabs */}
              <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left min-w-[140px] ${activeTab === 'card' ? 'bg-primary-950 border-primary-950 text-white shadow-md' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm">Credit / Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left min-w-[140px] ${activeTab === 'upi' ? 'bg-primary-950 border-primary-950 text-white shadow-md' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  <Smartphone className="w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm">UPI Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('netbanking')}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left min-w-[140px] ${activeTab === 'netbanking' ? 'bg-primary-950 border-primary-950 text-white shadow-md' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  <Globe className="w-5 h-5 shrink-0" />
                  <span className="font-bold text-sm">Net Banking</span>
                </button>
              </div>

              {/* Right Side: Payment Form */}
              <div className="w-full md:w-2/3">
                <form onSubmit={handlePayment} className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <span className="text-gray-500 font-medium">Total Amount Payable</span>
                    <span className="text-2xl font-bold text-primary-950 flex items-center">
                      <IndianRupee className="w-5 h-5"/> 1,000
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'card' && (
                      <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Card Number</label>
                          <input 
                            type="text" 
                            required
                            placeholder="0000 0000 0000 0000" 
                            maxLength="19"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors font-mono tracking-widest"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Expiry (MM/YY)</label>
                            <input 
                              type="text" 
                              required
                              placeholder="MM/YY" 
                              maxLength="5"
                              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors text-center"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">CVV</label>
                            <input 
                              type="password" 
                              required
                              placeholder="***" 
                              maxLength="3"
                              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors text-center font-mono tracking-widest"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Name on Card</label>
                          <input 
                            type="text" 
                            required
                            placeholder="John Doe" 
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors uppercase"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'upi' && (
                      <motion.div key="upi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-4">
                        <div className="w-32 h-32 bg-white rounded-xl shadow-sm border border-gray-100 mx-auto flex items-center justify-center mb-4">
                           {/* Placeholder for QR Code */}
                           <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                             <span className="text-gray-400 text-xs">Scan QR</span>
                           </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Scan with any UPI app like GPay, PhonePe, Paytm etc.</p>
                        <div className="relative max-w-xs mx-auto">
                          <div className="flex items-center">
                            <div className="w-full h-[1px] bg-gray-200"></div>
                            <span className="px-3 text-xs text-gray-400 uppercase font-bold">OR</span>
                            <div className="w-full h-[1px] bg-gray-200"></div>
                          </div>
                        </div>
                        <div className="space-y-1.5 text-left max-w-xs mx-auto mt-4">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Enter UPI ID</label>
                          <input 
                            type="text" 
                            required
                            placeholder="username@bank" 
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'netbanking' && (
                      <motion.div key="netbanking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Select Bank</label>
                          <select 
                            required
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold transition-colors appearance-none"
                          >
                            <option value="">Select your bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed pt-2">
                          You will be redirected to your bank's secure website to complete the payment. After successful payment, you will automatically return to this page.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>256-bit secure encryption</span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-gray-200">
                    <button 
                      type="button" 
                      onClick={() => navigate(`/admissions/application/${applicationId}/course`)}
                      className="text-gray-500 hover:text-gray-900 font-bold py-3.5 px-6 transition-colors w-full sm:w-auto text-center"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full sm:w-auto flex-grow bg-primary-950 hover:bg-primary-900 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <span>Pay Securely</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentPage;
