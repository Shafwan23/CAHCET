import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Key, Shield, AlertTriangle, Eye, EyeOff, CheckCircle } from 'lucide-react';

// Sub-component for Forced Password Reset Flow
const ForcePasswordReset = () => {
  const { updatePassword, admin } = useAdminAuth();
  const [newPwd, setNewPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Basic policy check for UI meter
  const reqs = {
    length: newPwd.length >= 8,
    upper: /[A-Z]/.test(newPwd),
    lower: /[a-z]/.test(newPwd),
    number: /[0-9]/.test(newPwd),
    special: /[^A-Za-z0-9]/.test(newPwd)
  };
  const strength = Object.values(reqs).filter(Boolean).length;
  const colors = ['bg-amber-500', 'bg-amber-500', 'bg-amber-500', 'bg-blue-500', 'bg-amber-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 5) {
      setError('Password does not meet all complexity requirements.');
      return;
    }
    if (newPwd !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Pass null for current password to bypass verification since it's the first login force reset
      await updatePassword(null, newPwd);
      // Let the page reload or context re-evaluate
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Failed to update password');
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 bg-white transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-100">
        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Security Update Required</h2>
        <p className="text-sm text-slate-500 text-center mb-8">
          Welcome, <strong>{admin?.name}</strong>. For your security, you must change your default password before accessing the CMS.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl text-sm text-amber-600 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} value={newPwd} onChange={e => {setNewPwd(e.target.value); setError('');}} className={inputCls} placeholder="Enter secure password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Strength Meter */}
            <div className="mt-3 flex gap-1 h-1.5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`flex-1 rounded-full ${i <= strength ? colors[strength-1] : 'bg-slate-100'}`} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div className={`flex items-center gap-1.5 ${reqs.length ? 'text-amber-600' : 'text-slate-400'}`}>
                {reqs.length ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1" />}
                8+ Characters
              </div>
              <div className={`flex items-center gap-1.5 ${reqs.upper ? 'text-amber-600' : 'text-slate-400'}`}>
                {reqs.upper ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1" />}
                Uppercase Letter
              </div>
              <div className={`flex items-center gap-1.5 ${reqs.lower ? 'text-amber-600' : 'text-slate-400'}`}>
                {reqs.lower ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1" />}
                Lowercase Letter
              </div>
              <div className={`flex items-center gap-1.5 ${reqs.number ? 'text-amber-600' : 'text-slate-400'}`}>
                {reqs.number ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1" />}
                Number
              </div>
              <div className={`flex items-center gap-1.5 ${reqs.special ? 'text-amber-600' : 'text-slate-400'}`}>
                {reqs.special ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1" />}
                Special Character
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <input type={showPwd ? "text" : "password"} value={confirm} onChange={e => {setConfirm(e.target.value); setError('');}} className={inputCls} placeholder="Confirm secure password" />
          </div>

          <button type="submit" disabled={saving || strength < 5 || newPwd !== confirm} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {saving ? <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Key className="w-5 h-5" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, firstLoginRequired } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (firstLoginRequired) {
    return <ForcePasswordReset />;
  }

  return children;
};

export default ProtectedRoute;
