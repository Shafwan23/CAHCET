import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { applicantAuthService } from '../../services/applicantAuthService';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  KeyRound
} from 'lucide-react';
import logoImg from '../../assets/images/logo.jfif';
import cahcetHeroImg from '../../assets/images/cahcet.webp';

const ApplicationLoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await applicantAuthService.login(formData.email, formData.password, formData.rememberMe);

      setIsSubmitting(false);
      navigate('/admissions/application');
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ email: error.response?.data?.message || error.message || 'Login failed' });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setIsResetting(true);
    try {
      await applicantAuthService.forgotPassword(resetEmail);
      setIsResetting(false);
      setResetSent(true);
    } catch (error) {
      setIsResetting(false);
      setResetError(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!otp || !newPassword) {
      setResetError('Please enter OTP and new password.');
      return;
    }

    setIsResetting(true);
    try {
      await applicantAuthService.resetPassword(resetEmail, otp, newPassword);
      setIsResetting(false);
      // Reset state and go back to login
      setResetSent(false);
      setIsForgotMode(false);
      setResetEmail('');
      setOtp('');
      setNewPassword('');
    } catch (error) {
      setIsResetting(false);
      setResetError(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
        <Helmet>
          <title>Sign In | CAHCET Admissions</title>
        </Helmet>

        {/* Left Side: Image & Branding */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={cahcetHeroImg} 
              alt="Campus" 
              className="w-full h-full object-cover scale-105 transform-gpu motion-safe:animate-[pulse_20s_ease-in-out_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-primary-950/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-900/40 to-transparent" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-transform duration-300 group-hover:scale-105">
                <img src={logoImg} alt="CAHCET Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-xl font-display font-extrabold tracking-tight">CAHCET</span>
            </Link>
          </div>

          <div className="relative z-10 mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-display font-extrabold leading-tight mb-6">
                Welcome Back to Your Future.
              </h1>
              <p className="text-lg text-white/80 font-light max-w-md">
                Sign in to pick up where you left off, track your application status, or complete your fee payments.
              </p>
            </motion.div>
            
            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-white/60">
              <ShieldCheck className="w-5 h-5 text-accent-gold" />
              <span>Secure, encrypted portal access</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-md relative z-10 perspective-1000">
            <AnimatePresence mode="wait">
              {/* === SIGN IN FORM === */}
              {!isForgotMode && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-display font-extrabold text-primary-950 mb-2">Sign In</h2>
                    <p className="text-gray-500 font-light text-sm">Access your admissions dashboard.</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Your Email Here" 
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none transition-colors ${errors.email ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-accent-gold'}`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                        <input 
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password" 
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-12 text-sm text-gray-900 focus:outline-none transition-colors ${errors.password ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-accent-gold'}`}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 appearance-none border-2 border-gray-300 rounded peer checked:bg-accent-gold checked:border-accent-gold transition-colors"
                          />
                          <CheckCircle className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => setIsForgotMode(true)}
                        className="text-sm text-accent-gold font-bold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary-950 hover:bg-primary-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-950/20 transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                      Don't have an account?{' '}
                      <Link to="/admissions/register" className="text-accent-gold font-bold hover:underline">
                        Register
                      </Link>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* === FORGOT PASSWORD FORM === */}
              {isForgotMode && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                >
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-accent-gold/10 text-accent-gold rounded-full flex items-center justify-center mb-4">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-extrabold text-primary-950 mb-2">Reset Password</h2>
                    <p className="text-gray-500 font-light text-sm">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  {resetSent ? (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                        <p className="text-sm text-gray-500">
                          We have sent a 6-digit OTP to <span className="font-semibold">{resetEmail}</span>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Enter OTP</label>
                        <input 
                          type="text" 
                          placeholder="6-digit OTP" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className={`w-full bg-gray-50 border rounded-xl py-3 px-4 text-center text-tracking-widest font-mono text-lg text-gray-900 focus:outline-none transition-colors ${resetError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-accent-gold'}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                          <input 
                            type="password" 
                            placeholder="Create a new password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none transition-colors ${resetError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-accent-gold'}`}
                          />
                        </div>
                        {resetError && <p className="text-xs text-red-500 mt-1">{resetError}</p>}
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit" 
                          disabled={isResetting}
                          className="w-full bg-accent-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent-gold/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mb-4"
                        >
                          {isResetting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span>Reset Password</span>
                          )}
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setIsForgotMode(false);
                            setResetSent(false);
                            setResetEmail('');
                            setOtp('');
                            setNewPassword('');
                          }}
                          className="w-full bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                          <input 
                            type="email" 
                            placeholder="Enter your registered email" 
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none transition-colors ${resetError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-accent-gold'}`}
                          />
                        </div>
                        {resetError && <p className="text-xs text-red-500 mt-1">{resetError}</p>}
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit" 
                          disabled={isResetting}
                          className="w-full bg-accent-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent-gold/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mb-4"
                        >
                          {isResetting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span>Send Reset Link</span>
                          )}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsForgotMode(false)}
                          className="w-full bg-transparent hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ApplicationLoginPage;
