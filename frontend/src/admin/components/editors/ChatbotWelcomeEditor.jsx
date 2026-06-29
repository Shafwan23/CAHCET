import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Plus, Trash2, Layers, AlignLeft, TrendingUp, BarChart3, HelpCircle, Check, Eye, Save } from 'lucide-react';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { ShieldAlert, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { cmsService } from '../../../services/cmsService';
import { chatbotAnalyticsService } from '../../../services/chatbotAnalyticsService';
import { useToast } from '../ui/Toast';
import { useEditorStatus } from '../../utils/useEditorStatus';

const AVAILABLE_ICONS = [
  'GraduationCap', 'Briefcase', 'Brain', 'Building2', 'BookOpen', 'Languages',
  'HelpCircle', 'GitCompare', 'TrendingUp', 'Award', 'MapPin', 'Home', 'Compass',
  'Receipt', 'Phone', 'User', 'CheckCircle', 'MessageSquare', 'Sparkles', 'ChevronRight'
];

export default function ChatbotWelcomeEditor() {
  const toast = useToast();
  const [chatbot, setChatbot] = useState({});
  const [welcomeScreen, setWelcomeScreen] = useState({
    welcomeTitle: 'Welcome!',
    welcomeSubtitle: '',
    showCapabilities: true,
    capabilities: [],
    features: [],
    quickActions: [],
    suggestedPrompts: []
  });
  
  const [activeTab, setActiveTab] = useState('general');
  const [analytics, setAnalytics] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [sectionId, setSectionId] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    setAnalytics(chatbotAnalyticsService.getAnalytics());

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
          let defaultData = {};
          try {
            const ls = localStorage.getItem('cahcet_cms_draft') || localStorage.getItem('cahcet_cms_published');
            if (ls) {
              const parsed = JSON.parse(ls);
              if (parsed.chatbot) {
                defaultData = parsed.chatbot;
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
          const parsed = JSON.parse(contentToLoad);
          setChatbot(parsed);
          if (parsed.welcomeScreen) {
            setWelcomeScreen({ ...welcomeScreen, ...parsed.welcomeScreen });
          }
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load settings.' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateSystemPage();
  }, []);

  const handleUpdateGeneral = (field, value) => {
    setChatbot(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateWelcomeScreen = (field, value) => {
    setWelcomeScreen(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async (isSilent = false) => {
    if (!sectionId) return;
    setLoading(true);
    try {
      const dataToSave = {
        ...chatbot,
        welcomeScreen: welcomeScreen
      };
      await cmsService.updateSection(sectionId, { draftContent: JSON.stringify(dataToSave), _isSilentDraft: isSilent });
      if (!isSilent) toast({ type: 'success', title: 'Saved!', message: 'Draft saved successfully.' });
      
      setSectionsMap(prev => ({
        ...prev,
        'system.chatbot': {
          ...prev['system.chatbot'],
          draftContent: JSON.stringify(dataToSave)
        }
      }));
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save draft.' });
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
      toast({ type: 'success', title: 'Published!', message: 'Onboarding settings published to live.' });
      
      const dataToSave = {
        ...chatbot,
        welcomeScreen: welcomeScreen
      };
      setSectionsMap(prev => ({
        ...prev,
        'system.chatbot': {
          ...prev['system.chatbot'],
          content: JSON.stringify(dataToSave),
          draftContent: JSON.stringify(dataToSave)
        }
      }));
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to publish.' });
    } finally {
      setLoading(false);
    }
  };

  // Feature Cards Helpers
  const handleFeatureChange = (idx, field, value) => {
    const newFeatures = [...(welcomeScreen.features || [])];
    newFeatures[idx] = { ...newFeatures[idx], [field]: value };
    handleUpdateWelcomeScreen('features', newFeatures);
  };

  const addFeatureCard = () => {
    const newFeatures = [...(welcomeScreen.features || [])];
    if (newFeatures.length >= 6) {
      alert("Maximum 6 feature cards allowed for optimal layout.");
      return;
    }
    newFeatures.push({
      id: Date.now().toString(),
      icon: 'HelpCircle',
      title: 'New Feature',
      description: 'Feature description text details.',
      query: 'Tell me more about this'
    });
    handleUpdateWelcomeScreen('features', newFeatures);
  };

  const removeFeatureCard = (idx) => {
    const newFeatures = (welcomeScreen.features || []).filter((_, i) => i !== idx);
    handleUpdateWelcomeScreen('features', newFeatures);
  };

  // Quick Actions Helpers
  const handleQuickActionChange = (idx, field, value) => {
    const newActions = [...(welcomeScreen.quickActions || [])];
    newActions[idx] = { ...newActions[idx], [field]: value };
    handleUpdateWelcomeScreen('quickActions', newActions);
  };

  const addQuickAction = () => {
    const newActions = [...(welcomeScreen.quickActions || [])];
    newActions.push({
      id: Date.now().toString(),
      icon: 'HelpCircle',
      label: 'New Action',
      query: 'Tell me more'
    });
    handleUpdateWelcomeScreen('quickActions', newActions);
  };

  const removeQuickAction = (idx) => {
    const newActions = (welcomeScreen.quickActions || []).filter((_, i) => i !== idx);
    handleUpdateWelcomeScreen('quickActions', newActions);
  };

  // Capabilities Helpers
  const handleCapabilityChange = (idx, value) => {
    const newCaps = [...(welcomeScreen.capabilities || [])];
    newCaps[idx] = value;
    handleUpdateWelcomeScreen('capabilities', newCaps);
  };

  const addCapability = () => {
    const newCaps = [...(welcomeScreen.capabilities || [])];
    newCaps.push('New capability description');
    handleUpdateWelcomeScreen('capabilities', newCaps);
  };

  const removeCapability = (idx) => {
    const newCaps = (welcomeScreen.capabilities || []).filter((_, i) => i !== idx);
    handleUpdateWelcomeScreen('capabilities', newCaps);
  };

  // Suggested Prompts Helpers
  const handlePromptChange = (idx, value) => {
    const newPrompts = [...(welcomeScreen.suggestedPrompts || [])];
    newPrompts[idx] = value;
    handleUpdateWelcomeScreen('suggestedPrompts', newPrompts);
  };

  const addSuggestedPrompt = () => {
    const newPrompts = [...(welcomeScreen.suggestedPrompts || [])];
    newPrompts.push('New suggested question?');
    handleUpdateWelcomeScreen('suggestedPrompts', newPrompts);
  };

  const removeSuggestedPrompt = (idx) => {
    const newPrompts = (welcomeScreen.suggestedPrompts || []).filter((_, i) => i !== idx);
    handleUpdateWelcomeScreen('suggestedPrompts', newPrompts);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'system.chatbot', { ...chatbot, welcomeScreen });

  return (
    <EditorPage
      title="Chatbot Welcome Onboarding"
      description="Customize the interactive ChatGPT-style welcome onboarding layout for your AI counselor assistant."
      breadcrumb={['Admin', 'System', 'Chatbot Welcome']}
      onSave={() => handleSaveDraft(false)}
      onPublish={handlePublish}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
      isLoading={loading}
    >
      <div className="space-y-6">
        {/* Navigation tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'features'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Feature Cards
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'actions'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Quick Actions
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'prompts'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Suggested Prompts
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Onboarding Analytics
          </button>
        </div>

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <EditorCard title="Onboarding Header & Defaults" description="Configure core behavior and appearance.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Welcome Title</label>
                <input
                  type="text"
                  value={welcomeScreen.welcomeTitle || ''}
                  onChange={(e) => handleUpdateWelcomeScreen('welcomeTitle', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Online Status Description</label>
                <input
                  type="text"
                  value={chatbot.onlineStatusText || ''}
                  onChange={(e) => handleUpdateGeneral('onlineStatusText', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Welcome Subtitle</label>
                <textarea
                  value={welcomeScreen.welcomeSubtitle || ''}
                  onChange={(e) => handleUpdateWelcomeScreen('welcomeSubtitle', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bot Personality Persona</label>
                <select
                  value={chatbot.personality || 'friendly'}
                  onChange={(e) => handleUpdateGeneral('personality', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="advisor">Academic Advisor (Structured & Informative)</option>
                  <option value="friendly">Friendly Assistant (Encouraging & Conversational)</option>
                  <option value="professional">Professional Counselor (Concise & Direct)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Animation Intensity Level</label>
                <select
                  value={chatbot.animationIntensity || 'high'}
                  onChange={(e) => handleUpdateGeneral('animationIntensity', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="high">High (Full bounces, cascades, orb animations)</option>
                  <option value="low">Low (Framer stagers and simple slides only)</option>
                  <option value="none">None (Reduced motion, static placement)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Default Header Avatar</label>
                <select
                  value={chatbot.avatarUrl || 'bot'}
                  onChange={(e) => handleUpdateGeneral('avatarUrl', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="bot">AI Brain / Robot Logo</option>
                  <option value="sparkles">AI Sparkles / Glowing Orb</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Onboarding Capabilities Checklist</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={welcomeScreen.showCapabilities !== false}
                    onChange={(e) => handleUpdateWelcomeScreen('showCapabilities', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700">Display capabilities checklist on welcome screen</span>
                </div>
              </div>
            </div>

            {/* Capabilities Checklist Editing Block */}
            {welcomeScreen.showCapabilities !== false && (
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm">Edit Capabilities Checklist</h4>
                  <button
                    onClick={addCapability}
                    className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Cap Line
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(welcomeScreen.capabilities || []).map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cap}
                        onChange={(e) => handleCapabilityChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/10 outline-none"
                      />
                      <button
                        onClick={() => removeCapability(idx)}
                        className="p-2 text-amber-500 hover:text-amber-700 hover:bg-slate-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </EditorCard>
        )}

        {/* Feature Cards Tab */}
        {activeTab === 'features' && (
          <EditorCard title="Onboarding Feature Cards (Max 6)" description="Add feature cards to the onboarding.">
            <div className="flex justify-end mb-4">
              <button
                onClick={addFeatureCard}
                className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Feature Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(welcomeScreen.features || []).map((feature, idx) => (
                <div key={feature.id || idx} className="border border-slate-200 p-4 rounded-xl space-y-4 bg-slate-50/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-blue-100 text-blue-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Card #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeFeatureCard(idx)}
                      className="p-1.5 text-amber-500 hover:text-amber-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Icon Type</label>
                      <select
                        value={feature.icon}
                        onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                      >
                        {AVAILABLE_ICONS.map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Action Trigger Query</label>
                      <input
                        type="text"
                        value={feature.query}
                        onChange={(e) => handleFeatureChange(idx, 'query', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </EditorCard>
        )}

        {/* Quick Actions Tab */}
        {activeTab === 'actions' && (
          <EditorCard title="Scrolling Quick Action Buttons" description="Add scrolling chips below feature cards.">
            <div className="flex justify-end mb-4">
              <button
                onClick={addQuickAction}
                className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Quick Action
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(welcomeScreen.quickActions || []).map((action, idx) => (
                <div key={action.id || idx} className="flex gap-4 p-4 border border-slate-200 bg-slate-50/50 rounded-xl items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Chip Label</label>
                      <input
                        type="text"
                        value={action.label}
                        onChange={(e) => handleQuickActionChange(idx, 'label', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Lucide Icon</label>
                      <select
                        value={action.icon}
                        onChange={(e) => handleQuickActionChange(idx, 'icon', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                      >
                        {AVAILABLE_ICONS.map(i => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Trigger Query</label>
                      <input
                        type="text"
                        value={action.query}
                        onChange={(e) => handleQuickActionChange(idx, 'query', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeQuickAction(idx)}
                    className="p-2 text-amber-500 hover:text-amber-700 hover:bg-white rounded-lg transition-colors border border-slate-100 shrink-0 self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </EditorCard>
        )}

        {/* Suggested Prompts Tab */}
        {activeTab === 'prompts' && (
          <EditorCard title="Clickable Suggested Prompts" description="Add suggested question prompts.">
            <div className="flex justify-end mb-4">
              <button
                onClick={addSuggestedPrompt}
                className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Prompt
              </button>
            </div>

            <div className="space-y-3">
              {(welcomeScreen.suggestedPrompts || []).map((prompt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-400 w-8">#{idx + 1}</span>
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => handlePromptChange(idx, e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeSuggestedPrompt(idx)}
                    className="p-2 text-amber-500 hover:text-amber-700 hover:bg-slate-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </EditorCard>
        )}

        {/* Onboarding Analytics Tab */}
        {activeTab === 'analytics' && (
          <EditorCard title="Onboarding & Engagement Insights" description="View user interactions.">
            {analytics ? (
              <div className="space-y-8">
                {/* High-level counters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Interactions</p>
                    <p className="text-3xl font-black text-slate-800 mt-1">{analytics.totalInteractions}</p>
                  </div>
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Onboarding Abandons</p>
                    <p className="text-3xl font-black text-blue-800 mt-1">{analytics.onboardingAbandons}</p>
                  </div>
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Sessions Restored</p>
                    <p className="text-3xl font-black text-amber-800 mt-1">{analytics.sessionsRestored}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Leads Collected</p>
                    <p className="text-3xl font-black text-slate-800 mt-1">
                      {analytics.intentCounts?.LEAD_CAPTURE || 0}
                    </p>
                  </div>
                </div>

                {/* Click Counts Grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                  {/* Feature Click Tracking */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-700 flex items-center gap-1.5 border-b pb-2">
                      <Layers className="w-4 h-4 text-blue-500" /> Feature Card Clicks
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.onboardingClicks?.featureCards || {}).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No click data logged yet.</p>
                      ) : (
                        Object.entries(analytics.onboardingClicks?.featureCards).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-700 max-w-[80%] truncate">{key}</span>
                            <span className="bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-md">{val}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quick Actions Click Tracking */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-700 flex items-center gap-1.5 border-b pb-2">
                      <AlignLeft className="w-4 h-4 text-blue-500" /> Quick Action Clicks
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.onboardingClicks?.quickActions || {}).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No click data logged yet.</p>
                      ) : (
                        Object.entries(analytics.onboardingClicks?.quickActions).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-700 max-w-[80%] truncate">{key}</span>
                            <span className="bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-md">{val}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Suggested Prompts Click Tracking */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-700 flex items-center gap-1.5 border-b pb-2">
                      <HelpCircle className="w-4 h-4 text-blue-500" /> Prompt Clicks
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.onboardingClicks?.suggestedPrompts || {}).length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No click data logged yet.</p>
                      ) : (
                        Object.entries(analytics.onboardingClicks?.suggestedPrompts).map(([key, val]) => (
                          <div key={key} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-700 max-w-[80%] truncate">{key}</span>
                            <span className="bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-md">{val}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm">Loading analytics dashboard...</p>
            )}
          </EditorCard>
        )}
      </div>
    </EditorPage>
  );
}
