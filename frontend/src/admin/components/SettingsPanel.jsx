import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCcw, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from './ui/Toast';
import EditorPage, { EditorCard } from './ui/EditorPage';
import { AdminInput, AdminToggle, AdminButton } from './ui/AdminInput';
import { ConfirmDialog } from './ui/Modal';
import { cmsService } from '../../services/cmsService';

const SettingsPanel = () => {
  const { logout } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ websiteTitle: 'CAHCET', primaryColor: '#1e3a5f', accentColor: '#d4af37', logoUrl: '', maintenanceMode: false });
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await cmsService.getPage('system');
        const sections = res.data?.sections || [];
        const settingsSection = sections.find(s => s.sectionKey === 'system.settings');
        if (settingsSection) {
          setSectionId(settingsSection.id);
          setForm(JSON.parse(settingsSection.content));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const change = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      if (sectionId) {
        await cmsService.updateSection(sectionId, { content: JSON.stringify(form) });
      } else {
        // Need to create system page or section if not exists
      }
      toast({ type: 'success', title: 'Settings saved', message: 'Your preferences have been updated.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = async () => {
    setLoading(true);
    // Not implemented for MySQL
    setConfirmReset(false);
    toast({ type: 'warning', title: 'CMS Reset', message: 'Factory reset is not available in the MySQL version yet.' });
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading && !sectionId) return <div>Loading...</div>;

  return (
    <EditorPage title="Settings" description="Configure global admin and website settings." breadcrumb={['Admin', 'Settings']}
      onPublish={handleSave} isLoading={loading}>
      {/* Website Settings */}
      <EditorCard title="Website Information">
        <div className="space-y-4">
          <AdminInput label="Website Title" value={form.websiteTitle || ''} onChange={e => change('websiteTitle', e.target.value)} placeholder="CAHCET" hint="Used in browser tab and system references." />
          <AdminInput label="Logo URL" value={form.logoUrl || ''} onChange={e => change('logoUrl', e.target.value)} placeholder="https://..." hint="URL of the college logo image." />
          {form.logoUrl && <img src={form.logoUrl} alt="Logo preview" className="h-16 object-contain rounded-xl border border-slate-100 bg-slate-50 p-2" />}
        </div>
      </EditorCard>

      {/* Theme */}
      <EditorCard title="Theme Settings">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Primary Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor || '#1e3a5f'} onChange={e => change('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200" />
                <span className="text-sm text-slate-600 font-mono">{form.primaryColor || '#1e3a5f'}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Accent Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.accentColor || '#d4af37'} onChange={e => change('accentColor', e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200" />
                <span className="text-sm text-slate-600 font-mono">{form.accentColor || '#d4af37'}</span>
              </div>
            </div>
          </div>
          <AdminToggle label="Maintenance Mode" checked={!!form.maintenanceMode} onChange={v => change('maintenanceMode', v)} hint="When enabled, visitors see a maintenance page." />
        </div>
      </EditorCard>

      {/* Admin Account */}
      <EditorCard title="Admin Account">
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Current Account</p>
            <p className="text-xs text-slate-500 mt-0.5">Username: <span className="font-mono font-bold">admin</span></p>
            <p className="text-xs text-slate-500">Role: <span className="font-semibold">Super Administrator</span></p>
          </div>
          <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">Default credentials are set. For production use, update credentials in the source code (<code className="bg-amber-100 px-1 rounded">AdminAuthContext.jsx</code>).</p>
          </div>
          <AdminButton variant="secondary" icon={LogOut} onClick={() => setConfirmLogout(true)} className="w-full justify-center">
            Logout of Admin Panel
          </AdminButton>
        </div>
      </EditorCard>

      {/* Danger Zone */}
      <EditorCard title="Danger Zone">
        <div className="space-y-3">
          <div className="p-3.5 bg-primary-50 border border-primary-100 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-primary-700">Resetting all content will permanently revert <strong>all pages</strong> to their factory defaults. This cannot be undone.</p>
          </div>
          <AdminButton variant="danger" icon={RotateCcw} onClick={() => setConfirmReset(true)}>
            Reset All CMS Content to Defaults
          </AdminButton>
        </div>
      </EditorCard>

      <ConfirmDialog isOpen={confirmReset} onClose={() => setConfirmReset(false)} onConfirm={handleResetAll}
        title="Reset All Content" message="This will permanently revert all website content to factory defaults. All your changes will be lost. Are you absolutely sure?"
        confirmText="Yes, Reset Everything" confirmVariant="danger" isLoading={loading} />

      <ConfirmDialog isOpen={confirmLogout} onClose={() => setConfirmLogout(false)} onConfirm={handleLogout}
        title="Logout" message="Are you sure you want to logout from the admin panel?"
        confirmText="Logout" confirmVariant="danger" />
    </EditorPage>
  );
};

export default SettingsPanel;
