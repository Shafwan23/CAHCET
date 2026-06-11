import React, { useState, useEffect } from 'react';
import { Upload, User, Mail, Phone, Briefcase, Building2, Save } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useToast } from '../../ui/Toast';
import { fileService } from '../../../services/fileService';

const ProfileSettingsEditor = () => {
  const { session, updateUser } = useAdminAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    name: '', email: '', phone: '', designation: '', bio: '', photoUrl: ''
  });

  useEffect(() => {
    if (session) {
      setForm({
        name: session.name || '',
        email: session.email || '',
        phone: session.phone || '',
        designation: session.designation || '',
        bio: session.bio || '',
        photoUrl: session.photoUrl || ''
      });
    }
  }, [session]);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      updateUser(session.userId, form);
      toast({ type: 'success', title: 'Profile Updated', message: 'Your profile has been successfully saved.' });
    } catch (err) {
      toast({ type: 'error', title: 'Update failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const rec = await fileService.upload(file, 'users', session.username);
      change('photoUrl', rec.url);
      updateUser(session.userId, { photoUrl: rec.url });
      toast({ type: 'success', title: 'Photo updated' });
    } catch {
      toast({ type: 'error', title: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information and account settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-primary-600" />
            <div className="px-6 pb-6 relative">
              <div className="w-24 h-24 -mt-12 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center relative group">
                {form.photoUrl ? (
                  <img src={form.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                    {session.initials}
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
                  <span className="text-[10px] mt-1 font-medium">{uploading ? 'Wait' : 'Upload'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files[0])} disabled={uploading} />
                </label>
              </div>
              
              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-bold text-slate-800">{form.name || session.username}</h3>
                <p className="text-sm text-slate-500 font-medium capitalize flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {form.designation || session.role.replace('_', ' ')}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-50 text-amber-600 text-[10px] font-bold rounded-lg uppercase tracking-wider mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Active Session
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Account Info</h4>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-slate-400" /></div>
              <div><p className="text-[10px] font-semibold text-slate-400 uppercase">Username</p><p className="font-medium text-slate-700">{session.username}</p></div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4 text-slate-400" /></div>
              <div><p className="text-[10px] font-semibold text-slate-400 uppercase">Department</p><p className="font-medium text-slate-700 uppercase">{session.deptKey || 'System Wide'}</p></div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-800">Edit Details</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.name} onChange={e => change('name', e.target.value)} required className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={form.email} onChange={e => change('email', e.target.value)} required className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.phone} onChange={e => change('phone', e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Designation / Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.designation} onChange={e => change('designation', e.target.value)} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Short Bio / About</label>
                <textarea 
                  value={form.bio} 
                  onChange={e => change('bio', e.target.value)} 
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  placeholder="Write a short bio about yourself..."
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsEditor;
