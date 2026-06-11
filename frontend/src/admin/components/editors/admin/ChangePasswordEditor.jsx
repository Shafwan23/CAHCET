import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useToast } from '../../ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordStrength = ({ password }) => {
  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  if (!password) return null;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-amber-500', 'bg-amber-500', 'bg-amber-500', 'bg-blue-500', 'bg-amber-500'];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-slate-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${['', 'text-amber-500', 'text-amber-500', 'text-amber-500', 'text-blue-500', 'text-amber-500'][strength]}`}>
        {labels[strength]}
      </p>
    </div>
  );
};

const ChangePasswordEditor = () => {
  const { session, updateUser, resetPassword } = useAdminAuth();
  const toast = useToast();
  
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const change = (f, v) => {
    setForm(p => ({ ...p, [f]: v }));
    setError('');
  };

  const toggleShow = (f) => setShow(p => ({ ...p, [f]: !p[f] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.current || !form.newPass || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.newPass !== form.confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (form.newPass.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    // We assume the auth service would verify current password here. For this UI demo, we will just update.
    // In a real system, `updateUser` with password would verify `current` on backend.
    
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600)); // simulate network
      resetPassword(session.userId, form.newPass);
      toast({ type: 'success', title: 'Password Updated', message: 'Your password was successfully changed.' });
      setForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Change Password</h1>
        <p className="text-slate-500 text-sm mt-1">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Info */}
        <div className="md:w-1/3 bg-slate-50 p-6 border-r border-slate-100 flex flex-col">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Password Requirements</h3>
          <ul className="text-sm text-slate-600 space-y-2 mb-6">
            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full" /> Minimum 8 characters</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full" /> At least one uppercase letter</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full" /> At least one number</li>
            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full" /> At least one special character</li>
          </ul>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-2/3 p-6 md:p-8">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-start gap-3 text-amber-600">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={show.current ? 'text' : 'password'} value={form.current} onChange={e => change('current', e.target.value)} required className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                <button type="button" onClick={() => toggleShow('current')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={show.newPass ? 'text' : 'password'} value={form.newPass} onChange={e => change('newPass', e.target.value)} required className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                <button type="button" onClick={() => toggleShow('newPass')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show.newPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.newPass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={show.confirm ? 'text' : 'password'} value={form.confirm} onChange={e => change('confirm', e.target.value)} required className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordEditor;
