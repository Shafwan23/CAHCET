import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Plus, Trash2, Save } from 'lucide-react';
import { cmsService } from '../../../services/cmsService';
import { useToast } from '../ui/Toast';

export default function ChatbotSettingsEditor() {
  const toast = useToast();
  const [chatbot, setChatbot] = useState({
    botName: 'CAHCET Assistant',
    welcomeMode: 'popup',
    defaultTheme: 'brand',
    defaultLanguage: 'en',
    welcomeMessages: ['Hello! How can I help you today?'],
    quickActions: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const fetchOrCreateSystemPage = async () => {
      try {
        let page;
        try {
          const res = await cmsService.getPage('system');
          page = res.data;
        } catch (err) {
          if (err.response?.status === 404) {
            // Create system page
            const newPage = await cmsService.createPage({
              title: 'System Settings',
              slug: 'system',
              description: 'Global system settings',
              status: 'PUBLISHED'
            });
            page = newPage.data;
          } else {
            throw err;
          }
        }

        setPageId(page.id);

        let section = page.sections?.find(s => s.sectionKey === 'system.chatbot');
        if (!section) {
          // Attempt to get from localstorage if not in DB yet (migration fallback)
          let defaultData = chatbot;
          try {
            const ls = localStorage.getItem('cahcet_cms_draft') || localStorage.getItem('cahcet_cms_published');
            if (ls) {
              const parsed = JSON.parse(ls);
              if (parsed.chatbot) {
                defaultData = { ...chatbot, ...parsed.chatbot };
              }
            }
          } catch(e) {}

          const newSection = await cmsService.createSection({
            pageId: page.id,
            sectionKey: 'system.chatbot',
            title: 'Chatbot Settings',
            content: JSON.stringify(defaultData)
          });
          section = newSection.data;
        }

        setSectionId(section.id);
        if (section.content) {
          setChatbot({ ...chatbot, ...JSON.parse(section.content) });
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load chatbot settings.' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateSystemPage();
  }, []);

  const handleUpdate = (field, value) => {
    setChatbot(prev => ({ ...prev, [field]: value }));
  };

  const handleWelcomeMsgChange = (idx, value) => {
    const newMsgs = [...chatbot.welcomeMessages];
    newMsgs[idx] = value;
    handleUpdate('welcomeMessages', newMsgs);
  };

  const addWelcomeMsg = () => {
    handleUpdate('welcomeMessages', [...(chatbot.welcomeMessages || []), 'New welcome message']);
  };

  const removeWelcomeMsg = (idx) => {
    const newMsgs = (chatbot.welcomeMessages || []).filter((_, i) => i !== idx);
    handleUpdate('welcomeMessages', newMsgs);
  };

  const handleQuickActionChange = (idx, field, value) => {
    const newActions = [...(chatbot.quickActions || [])];
    newActions[idx] = { ...newActions[idx], [field]: value };
    handleUpdate('quickActions', newActions);
  };

  const addQuickAction = () => {
    const newAction = { id: Date.now().toString(), label: 'New Action', query: 'Tell me more' };
    handleUpdate('quickActions', [...(chatbot.quickActions || []), newAction]);
  };

  const removeQuickAction = (idx) => {
    const newActions = (chatbot.quickActions || []).filter((_, i) => i !== idx);
    handleUpdate('quickActions', newActions);
  };

  const handleSave = async () => {
    if (!sectionId) return;
    setSaving(true);
    try {
      await cmsService.updateSection(sectionId, { content: JSON.stringify(chatbot) });
      toast({ type: 'success', title: 'Saved!', message: 'Chatbot settings updated successfully.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-500" />
            Chatbot AI Settings
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage the enterprise chatbot personality and automated behaviors.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70"
        >
          {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            Bot Personality & Behavior
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bot Name</label>
              <input
                type="text"
                value={chatbot.botName || ''}
                onChange={(e) => handleUpdate('botName', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Welcome Mode</label>
              <select
                value={chatbot.welcomeMode || 'popup'}
                onChange={(e) => handleUpdate('welcomeMode', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="manual">Manual (Click to open)</option>
                <option value="popup">Popup Teaser Message</option>
                <option value="auto">Auto-Open Chat Window</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Default Theme</label>
              <select
                value={chatbot.defaultTheme || 'brand'}
                onChange={(e) => handleUpdate('defaultTheme', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="brand">CAHCET Brand (Blue/Gold)</option>
                <option value="light">Minimal Light</option>
                <option value="dark">Modern Dark</option>
                <option value="glass">Glassmorphism</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Default Language</label>
              <select
                value={chatbot.defaultLanguage || 'en'}
                onChange={(e) => handleUpdate('defaultLanguage', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="hi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            Rotating Welcome Messages
          </h3>
          <button onClick={addWelcomeMsg} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add Message
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {(chatbot.welcomeMessages || []).map((msg, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                value={msg}
                onChange={(e) => handleWelcomeMsgChange(idx, e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
              />
              <button onClick={() => removeWelcomeMsg(idx)} className="p-2 text-amber-400 hover:text-amber-600 hover:bg-primary-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Smart Quick Actions</h3>
          <button onClick={addQuickAction} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
            <Plus className="w-4 h-4" /> Add Action
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {(chatbot.quickActions || []).map((action, idx) => (
            <div key={action.id} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={action.label}
                    onChange={(e) => handleQuickActionChange(idx, 'label', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Trigger Query</label>
                  <input
                    type="text"
                    value={action.query}
                    onChange={(e) => handleQuickActionChange(idx, 'query', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none"
                  />
                </div>
              </div>
              <button onClick={() => removeQuickAction(idx)} className="p-2 text-amber-400 hover:text-amber-600 hover:bg-primary-50 rounded-lg h-fit">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
