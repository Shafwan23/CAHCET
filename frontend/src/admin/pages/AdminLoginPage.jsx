import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Shield, AlertTriangle, ArrowLeft, LogIn } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const FloatingOrb = ({ style }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
    style={style}
    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const PasswordStrength = ({ password }) => {
  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  if (!password) return null;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-amber-500', 'bg-amber-500', 'bg-blue-500', 'bg-amber-500'];

  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-slate-700'}`} />
        ))}
      </div>
      <p className={`text-[10px] font-medium ${['', 'text-amber-400', 'text-amber-400', 'text-blue-400', 'text-amber-400'][strength]}`}>
        {labels[strength]}
      </p>
    </div>
  );
};

const AdminLoginPage = () => {
  const { login, isAuthenticated, isLocked, lockMinutes, attempts, maxAttempts } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Please fill in all fields.');
      triggerShake();
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      triggerShake();
      return;
    }
    if (isLocked) {
      setError(`Account locked. Try again in ${lockMinutes} min.`);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = await login(form.username, form.password, form.remember);
      setSuccess(true);
      setTimeout(() => {
        let target = from === '/admin' ? '/admin/dashboard' : from;
        if (user.role === 'dept_admin' && user.deptKey) {
            target = `/admin/dashboard/departments/${user.deptKey}/overview`;
        } else if (user.role === 'faculty_editor' && user.deptKey) {
            target = `/admin/dashboard/departments/${user.deptKey}/overview`;
        }
        navigate(target, { replace: true });
      }, 800);
    } catch (err) {
      setError(err.message);
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || isLocked || !form.username || !form.password;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <FloatingOrb style={{ width: 500, height: 500, background: 'radial-gradient(circle, #d4af37, transparent)', top: -200, right: -200 }} />
      <FloatingOrb style={{ width: 400, height: 400, background: 'radial-gradient(circle, #1e3a8a, transparent)', bottom: -150, left: -150 }} />
      <FloatingOrb style={{ width: 300, height: 300, background: 'radial-gradient(circle, #7c3aed, transparent)', top: '40%', left: '30%' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
      >
        <motion.span whileHover={{ x: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
          <ArrowLeft className="w-4 h-4" />
        </motion.span>
        Back to Home
      </Link>

      {/* Login Card */}
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Card header gradient bar */}
          <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

          <div className="p-8">
            {/* Logo / Branding */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30"
              >
                <Shield className="w-8 h-8 text-slate-900" />
              </motion.div>
              <h1 className="text-2xl font-black text-white">Admin Portal</h1>
              <p className="text-slate-400 text-sm mt-1">CAHCET Content Management System</p>
            </div>

            {/* Lockout warning */}
            <AnimatePresence>
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-400">Account locked for {lockMinutes} min due to multiple failed attempts.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attempt warning */}
            <AnimatePresence>
              {attempts > 0 && !isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
                >
                  <p className="text-xs text-amber-400">{maxAttempts - attempts} attempt{maxAttempts - attempts === 1 ? '' : 's'} remaining before lockout.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center"
                >
                  <p className="text-sm text-amber-400 font-semibold">✓ Login successful! Redirecting...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={handleChange}
                    disabled={isLocked || isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={isLocked || isLoading}
                    className="w-full pl-10 pr-12 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-400/30"
                  />
                  <span className="text-xs text-slate-400">Remember me</span>
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                className={`
                  w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all
                  ${isDisabled
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In to Admin Panel
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer note */}
            <p className="text-center text-[10px] text-slate-600 mt-6">
              Protected area · Unauthorized access is prohibited
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
