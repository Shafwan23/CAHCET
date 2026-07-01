import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Plus, Trash2, Save } from 'lucide-react';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { ShieldAlert, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { cmsService } from '../../../services/cmsService';
import { useToast } from '../ui/Toast';
import { useEditorStatus } from '../../utils/useEditorStatus';

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
  const [sectionId, setSectionId] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchOrCreateSystemPage = async () => {
      try {
        let page;
        try {
          const res = await cmsService.getPage('system');
          page = res.data;
        } catch (err) {
          if (err.response?.status === 404) {
            const newPage = await cmsService.createPage({
              title: 'System Settings',
              slug: 'system',
              description: 'Global system settings',
              status: 'PUBLISHED',
              _isSilentDraft: true
            });
            page = newPage.data;
          } else {
            throw err;
          }
        }

        setPageId(page.id);
        const map = (page.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        let section = map['system.chatbot'];
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
            draftContent: JSON.stringify(defaultData),
            _isSilentDraft: true
          });
          section = newSection.data;
          setSectionsMap(prev => ({ ...prev, ['system.chatbot']: section }));
        }

        setSectionId(section.id);
        const contentToLoad = section.draftContent || section.content;
        if (contentToLoad) {
          setChatbot({ ...chatbot, ...(JSON.parse(contentToLoad) || {}) });
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

  const handleSaveDraft = async (isSilent = false) => {
    if (!sectionId) return;
    setLoading(true);
    try {
      await cmsService.updateSection(sectionId, { draftContent: JSON.stringify(chatbot), _isSilentDraft: isSilent });
      if (!isSilent) toast({ type: 'success', title: 'Saved!', message: 'Draft saved successfully.' });
      
      // Update local state map to trigger status badge recalculation
      setSectionsMap(prev => ({
        ...prev,
        'system.chatbot': {
          ...prev['system.chatbot'],
          draftContent: JSON.stringify(chatbot)
        }
      }));
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
     if (!sectionId) return;
     await handleSaveDraft(true);
     setLoading(true);
     try {
       await cmsService.publishSection(sectionId);
       toast({ type: 'success', title: 'Published!', message: 'Chatbot settings published to live.' });
       
       // Update local state map
       setSectionsMap(prev => ({
         ...prev,
         'system.chatbot': {
           ...prev['system.chatbot'],
           content: JSON.stringify(chatbot),
           draftContent: JSON.stringify(chatbot)
         }
       }));
     } catch(e) {
       toast({ type: 'error', title: 'Error', message: 'Failed to publish.' });
     } finally {
       setLoading(false);
     }
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'system.chatbot', chatbot);

  return (
    <EditorPage
      title="Chatbot AI Settings"
      description="Manage the enterprise chatbot personality and automated behaviors."
      breadcrumb={['Admin', 'System', 'Chatbot']}
      onSave={() => handleSaveDraft(false)}
      onPublish={handlePublish}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      isLoading={loading}
    >
      <div className="space-y-6">
        <EditorCard title="Bot Personality & Behavior" description="Configure core behavior and appearance.">
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
        </EditorCard>

        <EditorCard title="Rotating Welcome Messages" description="Add messages the bot uses to greet users.">
          <div className="flex justify-end mb-4">
             <button onClick={addWelcomeMsg} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
               <Plus className="w-4 h-4" /> Add Message
             </button>
          </div>
          <div className="space-y-4">
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
        </EditorCard>

        <EditorCard title="Smart Quick Actions" description="Preset queries users can click immediately.">
          <div className="flex justify-end mb-4">
            <button onClick={addQuickAction} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
              <Plus className="w-4 h-4" /> Add Action
            </button>
          </div>
          <div className="space-y-4">
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
        </EditorCard>
      </div>
    </EditorPage>
  );
}
