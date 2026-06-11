import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { applicantAuthService } from '../../services/applicantAuthService';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import logoImg from '../../assets/images/logo.jfif';
import cahcetHeroImg from '../../assets/images/cahcet.webp';

const ApplicationRegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (pass) => {
    // At least 8 characters, letters, numbers, symbols
    const minLength = pass.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasLetter && hasNumber && hasSymbol;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone, ensure +91 prefix
    if (name === 'phone') {
      let val = value;
      if (!val.startsWith('+91 ')) {
        val = '+91 ' + val.replace(/^\+91\s*/, '');
      }
      // only allow numbers and spaces after +91
      const numPart = val.substring(4).replace(/[^0-9]/g, '');
      val = '+91 ' + numPart;
      setFormData({ ...formData, [name]: val });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear specific error
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    
    const phoneNum = formData.phone.replace(/[^0-9]/g, '');
    if (phoneNum.length < 12) newErrors.phone = 'Valid 10-digit phone number is required';
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Must be at least 8 chars with letters, numbers, and symbols';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await applicantAuthService.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admissions/application');
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ email: error.response?.data?.message || error.message || 'Registration failed' });
    }
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
        <Helmet>
          <title>Register | CAHCET Admissions</title>
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
                Begin Your Journey to Excellence.
              </h1>
              <p className="text-lg text-white/80 font-light max-w-md">
                Create an account to access the CAHCET admission portal, explore programs, and submit your application securely.
              </p>
            </motion.div>
            
            <div className="mt-12 flex items-center gap-4 text-sm font-medium text-white/60">
              <ShieldCheck className="w-5 h-5 text-accent-gold" />
              <span>Secure, encrypted application process</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/5 rounded-full blur-3xl pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            {success ? (
              <div className="text-center bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                <p className="text-gray-500 font-light mb-8">
                  Your account has been created. Redirecting you to sign in...
                </p>
                <div className="w-8 h-8 border-4 border-gray-200 border-t-accent-gold rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-extrabold text-primary-950 mb-2">Sign Up</h2>
                  <p className="text-gray-500 font-light text-sm">Fill in your details to create your application account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${errors.fullName ? 'text-red-400' : 'text-gray-400'}`} />
                      <input 
                        type="text" 
                        name="fullName"
                        placeholder="Your Name Here" 
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none transition-colors ${errors.fullName ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-accent-gold'}`}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

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

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} />
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder="+91 9876543210" 
                        value={formData.phone || '+91 '}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-4 text-sm text-gray-900 focus:outline-none transition-colors ${errors.phone ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-accent-gold'}`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password" 
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
                    <p className={`text-[10px] sm:text-xs mt-1 ${errors.password ? 'text-red-500' : 'text-gray-500'}`}>
                      At least 8 characters with a mix of letters, numbers, and symbols
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Re-enter password" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full bg-gray-50 border rounded-xl py-3 pl-12 pr-12 text-sm text-gray-900 focus:outline-none transition-colors ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-accent-gold'}`}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary-950 hover:bg-primary-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-950/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Register Account</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/admissions/login" className="text-accent-gold font-bold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ApplicationRegisterPage;
