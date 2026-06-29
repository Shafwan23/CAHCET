import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle, AdminSelect } from '../ui/AdminInput';
import { cmsService } from '../../../services/cmsService';
import { Globe, Share2, Code, Search, Twitter, Facebook } from 'lucide-react';

const SEOEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    title: '', description: '', keywords: '', canonicalUrl: '',
    ogTitle: '', ogDescription: '', ogImage: '',
    twitterTitle: '', twitterDescription: '', twitterImage: '', twitterCardType: 'summary_large_image',
    robotsIndex: true, robotsFollow: true,
  });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [previewTab, setPreviewTab] = useState('google');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('seo');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['seo.global']) {
          const raw = map['seo.global'].draftContent || map['seo.global'].content || '{}';
          try {
            const parsed = JSON.parse(raw) || {};
            setForm(prev => ({ ...prev, ...parsed }));
          } catch {
            // retain default form
          }
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load SEO data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const change = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      if (sectionsMap['seo.global']) {
        await cmsService.updateSection(sectionsMap['seo.global'].id, { content: JSON.stringify(form) });
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `SEO changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save SEO data.' });
    } finally {
      setLoading(false);
    }
  };

  const titleLength = (form.title || '').length;
  const descLength = (form.description || '').length;
  
  // Derived fallback values for previews
  const previewTitle = form.title || 'CAHCET | Engineering Excellence';
  const previewDesc = form.description || 'Official website of CAHCET...';
  const ogTitle = form.ogTitle || previewTitle;
  const ogDesc = form.ogDescription || previewDesc;
  const ogImage = form.ogImage || 'https://via.placeholder.com/1200x630/f8fafc/94a3b8?text=Default+Image';
  const twTitle = form.twitterTitle || ogTitle;
  const twDesc = form.twitterDescription || ogDesc;
  const twImage = form.twitterImage || form.ogImage || 'https://via.placeholder.com/1200x630/f8fafc/94a3b8?text=Default+Image';

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'social', label: 'Social (OG & Twitter)', icon: Share2 },
    { id: 'advanced', label: 'Advanced', icon: Code },
  ];

  const previewTabs = [
    { id: 'google', label: 'Google', icon: Search },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'twitter', label: 'Twitter', icon: Twitter },
  ];

  return (
    <EditorPage 
      title="SEO & Metadata Configuration" 
      description="Enterprise-grade control over how your institution appears in search engines and social platforms." 
      breadcrumb={['Admin', 'Site', 'SEO Settings']}
      onSave={() => handleSave(false)} 
      onPublish={() => handleSave(true)} 
      isLoading={loading}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative items-start">
        
        {/* Left Column: Editor Forms */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Tabs Navigation */}
          <div className="flex bg-slate-50/80 backdrop-blur-md rounded-2xl p-2 border border-slate-200/60 shadow-sm w-fit relative">
            {tabs.map(t => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors duration-300 z-10 ${
                    isActive ? 'text-amber-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.06)] border border-slate-200/50"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <t.icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-[1.7rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <EditorCard className="relative bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300" title="Core Search Engine Metadata" description="Primary data used by Google and Bing.">
                    <div className="space-y-6">
                    <div className="group">
                      <AdminInput 
                        label="Meta Title" 
                        value={form.title} 
                        onChange={e => change('title', e.target.value)} 
                        placeholder="CAHCET | Engineering Excellence"
                        hint={`${titleLength}/60 characters (recommended: 50-60)`} 
                      />
                      <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                        <div className={`h-full rounded-full transition-all duration-500 ease-out ${titleLength > 60 ? 'bg-rose-500' : titleLength >= 40 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                          style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }} />
                      </div>
                    </div>
                    
                    <div className="group">
                      <AdminTextarea 
                        label="Meta Description" 
                        value={form.description} 
                        onChange={e => change('description', e.target.value)} 
                        rows={3}
                        placeholder="Official website of CAHCET..." 
                        hint={`${descLength}/160 characters (recommended: 150-160)`} 
                      />
                      <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                        <div className={`h-full rounded-full transition-all duration-500 ease-out ${descLength > 160 ? 'bg-rose-500' : descLength >= 120 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                          style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }} />
                      </div>
                    </div>

                    <AdminInput 
                      label="Focus Keywords" 
                      value={form.keywords} 
                      onChange={e => change('keywords', e.target.value)} 
                      placeholder="CAHCET, engineering college, Tamil Nadu, admission 2026" 
                      hint="Comma-separated focus keywords." 
                    />
                  </div>
                </EditorCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div key="social" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[1.7rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <EditorCard className="relative bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300" title="Open Graph (Facebook/LinkedIn)" description="How the site looks when shared on Facebook, LinkedIn, etc. Leave blank to fallback to General settings.">
                    <div className="space-y-6">
                      <AdminInput label="OG Title" value={form.ogTitle} onChange={e => change('ogTitle', e.target.value)} placeholder={form.title} />
                      <AdminTextarea label="OG Description" value={form.ogDescription} onChange={e => change('ogDescription', e.target.value)} rows={2} placeholder={form.description} />
                      <AdminInput label="OG Image URL" value={form.ogImage} onChange={e => change('ogImage', e.target.value)} placeholder="https://example.com/image.jpg" hint="Optimal size: 1200 x 630 pixels." />
                    </div>
                  </EditorCard>
                </div>
                
                <div className="mt-6 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-[1.7rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <EditorCard className="relative bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300" title="Twitter Cards" description="How the site looks when shared on Twitter (X).">
                    <div className="space-y-6">
                      <AdminSelect 
                        label="Twitter Card Type" 
                        value={form.twitterCardType} 
                        onChange={e => change('twitterCardType', e.target.value)}
                        options={[{label: 'Summary with Large Image', value: 'summary_large_image'}, {label: 'Summary (Small Image)', value: 'summary'}]}
                      />
                      <AdminInput label="Twitter Title" value={form.twitterTitle} onChange={e => change('twitterTitle', e.target.value)} placeholder={form.ogTitle || form.title} />
                      <AdminTextarea label="Twitter Description" value={form.twitterDescription} onChange={e => change('twitterDescription', e.target.value)} rows={2} placeholder={form.ogDescription || form.description} />
                      <AdminInput label="Twitter Image URL" value={form.twitterImage} onChange={e => change('twitterImage', e.target.value)} placeholder={form.ogImage} hint="If left blank, falls back to OG Image." />
                    </div>
                  </EditorCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'advanced' && (
              <motion.div key="advanced" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-[1.7rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <EditorCard className="relative bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300" title="Crawling & Indexing Rules" description="Control how search engine bots behave on your home page.">
                    <div className="space-y-2">
                      <AdminToggle 
                        label="Allow Search Engines to Index (index)" 
                        hint="Turn off to hide the home page from Google. (Not recommended)" 
                        checked={form.robotsIndex} 
                        onChange={v => change('robotsIndex', v)} 
                      />
                      <AdminToggle 
                        label="Allow Search Engines to Follow Links (follow)" 
                        hint="Allow bots to crawl links found on the home page." 
                        checked={form.robotsFollow} 
                        onChange={v => change('robotsFollow', v)} 
                      />
                    </div>
                  </EditorCard>
                </div>
                
                <div className="mt-6 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-[1.7rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <EditorCard className="relative bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300" title="Canonicalization" description="Prevent duplicate content issues.">
                    <AdminInput 
                      label="Canonical URL" 
                      value={form.canonicalUrl} 
                      onChange={e => change('canonicalUrl', e.target.value)} 
                      placeholder="https://cahcet.edu.in/" 
                      hint="The preferred URL for the home page. Defaults to root URL." 
                    />
                  </EditorCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Live Previews (Sticky) */}
        <div className="xl:col-span-5 sticky top-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full max-h-[calc(100vh-100px)]">
            
            {/* Preview Header */}
            <div className="bg-slate-50 border-b border-slate-100 p-4 shrink-0">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Preview
              </h3>
              
              <div className="flex bg-slate-200/50 rounded-xl p-1 w-full">
                {previewTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPreviewTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition-all duration-300 ${
                      previewTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <t.icon className={`w-3 h-3 ${previewTab === t.id ? 'text-amber-500' : ''}`} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Content Area */}
            <div className="p-6 bg-slate-100 flex-1 overflow-y-auto flex items-start justify-center">
              
              <AnimatePresence mode="wait">
                {/* Google Preview */}
                {previewTab === 'google' && (
                  <motion.div key="google" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                        <Globe className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">CAHCET</p>
                        <p className="text-xs text-slate-500">{form.canonicalUrl || 'https://cahcet.edu.in'} <span className="text-slate-400">⋮</span></p>
                      </div>
                    </div>
                    <p className="text-[20px] text-[#1a0dab] font-normal leading-tight mb-1 cursor-pointer hover:underline break-words">
                      {previewTitle}
                    </p>
                    <p className="text-[14px] text-[#4d5156] leading-[1.58] line-clamp-2 break-words">
                      {previewDesc}
                    </p>
                  </motion.div>
                )}

                {/* Facebook/LinkedIn Preview */}
                {previewTab === 'facebook' && (
                  <motion.div key="facebook" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden font-sans">
                    <div className="w-full aspect-[1.91/1] bg-slate-200 border-b border-slate-200 relative overflow-hidden">
                      <img src={ogImage} alt="OG" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/1200x630/f8fafc/94a3b8?text=Image+Not+Found'} />
                    </div>
                    <div className="p-3 bg-slate-50/50">
                      <p className="text-[12px] text-slate-500 uppercase tracking-wide mb-1">cahcet.edu.in</p>
                      <p className="text-[16px] font-semibold text-slate-900 leading-tight mb-1 line-clamp-1">{ogTitle}</p>
                      <p className="text-[14px] text-slate-500 line-clamp-1">{ogDesc}</p>
                    </div>
                  </motion.div>
                )}

                {/* Twitter Preview */}
                {previewTab === 'twitter' && (
                  <motion.div key="twitter" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm bg-white rounded-xl border border-slate-300 overflow-hidden font-sans">
                    {form.twitterCardType === 'summary_large_image' ? (
                      <>
                        <div className="w-full aspect-[1.91/1] bg-slate-200 border-b border-slate-300 relative overflow-hidden">
                          <img src={twImage} alt="Twitter" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/1200x630/f8fafc/94a3b8?text=Image+Not+Found'} />
                        </div>
                        <div className="p-3">
                          <p className="text-[15px] text-slate-500 mb-0.5">cahcet.edu.in</p>
                          <p className="text-[15px] text-slate-900 line-clamp-1">{twTitle}</p>
                          <p className="text-[15px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{twDesc}</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-32">
                        <div className="w-32 h-32 bg-slate-200 border-r border-slate-300 shrink-0">
                          <img src={twImage} alt="Twitter" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150x150/f8fafc/94a3b8?text=Img'} />
                        </div>
                        <div className="p-3 flex flex-col justify-center min-w-0">
                          <p className="text-[15px] text-slate-500 mb-0.5 truncate">cahcet.edu.in</p>
                          <p className="text-[15px] text-slate-900 line-clamp-1">{twTitle}</p>
                          <p className="text-[15px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{twDesc}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

      </div>
    </EditorPage>
  );
};

export default SEOEditor;
