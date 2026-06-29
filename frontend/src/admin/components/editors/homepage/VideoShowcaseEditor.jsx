import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';
import SectionPreviewModal from '../../ui/SectionPreviewModal';
import { useEditorStatus } from '../../../utils/useEditorStatus';
import { Play } from 'lucide-react';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return url;
};

const VideoShowcaseEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    visible: true, title: 'Experience CAHCET', subtitle: 'Campus Media', description: 'Take a virtual tour of our sprawling campus and listen to the success stories of our students.',
    videos: [
      { url: 'https://www.youtube.com/embed/BYDRoSM7b1Q', title: 'Campus Tour', desc: 'Explore our world-class infrastructure and campus life.' },
      { url: 'https://www.youtube.com/embed/Zj7UNw7SX2U', title: 'Success Story', desc: 'Hear from our alumni about their journey at CAHCET.' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);

  const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('home');
      setPageId(res.data?.id);
      const sections = res.data?.sections || [];
      const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);

      if (map['home.videos']) {
        const dataStr = map['home.videos'].draftContent || map['home.videos'].content || '{}';
        setForm(JSON.parse(dataStr));
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load Video data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['home.videos']) {
        await cmsService.updateSection(sectionsMap['home.videos'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId, sectionKey: 'home.videos', title: 'Video Showcase', draftContent: content, _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, 'home.videos': newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Draft Saved', message: `Video changes saved securely to draft.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Video draft.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    await handleSave(true);
    const res = await cmsService.getPage('home');
    const updatedSec = res.data.sections.find(s => s.sectionKey === 'home.videos');
    setPreviewSection(updatedSec);
  };

  const handleReset = () => {
    setForm({
      visible: true,
      title: 'Experience CAHCET',
      subtitle: 'Campus Media',
      description: 'Take a virtual tour of our sprawling campus and listen to the success stories of our students.',
      videos: [
        {
          url: 'https://www.youtube.com/embed/BYDRoSM7b1Q',
          title: 'Campus Tour',
          desc: 'Explore our world-class infrastructure and campus life.'
        },
        {
          url: 'https://www.youtube.com/embed/Zj7UNw7SX2U',
          title: 'Success Story',
          desc: 'Hear from our alumni about their journey at CAHCET.'
        }
      ]
    });
    toast({ type: 'info', title: 'Reset', message: 'Video section reverted to defaults.' });
  };

  const addVideo = () => {
    change('videos', [...(form.videos || []), { url: '', title: '', desc: '' }]);
  };

  const removeVideo = (index) => {
    change('videos', (form.videos || []).filter((_, i) => i !== index));
  };

  const updateVideo = (index, field, value) => {
    const updated = (form.videos || []).map((vid, i) => i === index ? { ...vid, [field]: value } : vid);
    change('videos', updated);
  };

  const moveVideo = (index, direction) => {
    const videos = [...(form.videos || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= videos.length) return;
    const [moved] = videos.splice(index, 1);
    videos.splice(targetIdx, 0, moved);
    change('videos', videos);
  };

  const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, 'home.videos', form);

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Video Showcase Editor"
      description="Manage the campus media and success story videos on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Video Showcase']}
      onSave={() => handleSave(false)}
      onPublish={handlePublishClick}
      onReset={handleReset}
      isLoading={loading}
      status={status}
      lastModified={lastModified}
      validationIssues={validationIssues}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <EditorCard title="Section Text" description="Custom title, subtitle, and description.">
        <div className="space-y-4">
          <AdminToggle
            label="Section Visibility"
            checked={form.visible ?? true}
            onChange={v => change('visible', v)}
            hint="Show or hide the video showcase section on the homepage."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Section Title"
              value={form.title || ''}
              onChange={e => change('title', e.target.value)}
              placeholder="Experience CAHCET"
            />
            <AdminInput
              label="Section Subtitle"
              value={form.subtitle || ''}
              onChange={e => change('subtitle', e.target.value)}
              placeholder="Campus Media"
            />
          </div>
          <AdminTextarea
            label="Section Description"
            value={form.description || ''}
            onChange={e => change('description', e.target.value)}
            placeholder="Take a virtual tour..."
            rows={3}
          />
        </div>
      </EditorCard>

      <EditorCard title="Showcase Videos" description="Manage the YouTube videos displayed in this section. Note: Use YouTube Embed URLs (e.g., https://www.youtube.com/embed/XXXXXX)">
        <div className="space-y-4">
          {(form.videos || []).map((vid, index) => (
            <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Video {index + 1}</span>
                <button onClick={() => removeVideo(index)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <AdminInput
                    label="Video Title"
                    value={vid.title || ''}
                    onChange={e => updateVideo(index, 'title', e.target.value)}
                    placeholder="e.g. Campus Tour"
                  />
                  <AdminInput
                    label="YouTube Embed URL"
                    value={vid.url || ''}
                    onChange={e => updateVideo(index, 'url', e.target.value)}
                    placeholder="https://www.youtube.com/embed/BYDRoSM7b1Q"
                  />
                  <AdminTextarea
                    label="Video Description"
                    value={vid.desc || vid.description || ''}
                    onChange={e => updateVideo(index, 'desc', e.target.value)}
                    placeholder="Provide a brief description of the video content..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-center border border-slate-200 rounded-xl bg-black aspect-video relative overflow-hidden">
                  {vid.url ? (
                    <iframe
                      className="w-full h-full"
                      src={getEmbedUrl(vid.url)}
                      title={vid.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <span className="text-xs text-slate-400">Video Preview</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addVideo} 
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl text-sm font-semibold text-slate-500 hover:text-amber-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Video
          </button>
        </div>
      </EditorCard>
        </div>

        {/* Lightweight Preview Card */}
        <div className="xl:col-span-4">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Monitor className="w-4 h-4" /> Live Preview</h3>
            
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
              {/* Browser/Device Chrome */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-[10px] text-slate-400 font-mono flex-1 max-w-[200px] text-center truncate shadow-sm">
                  cahcet.edu.in
                </div>
              </div>

              <div className="bg-slate-50 p-6 text-center">
              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">{form.subtitle || 'Campus Media'}</h4>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{form.title || 'Experience CAHCET'}</h3>
              <p className="text-xs text-slate-600 mb-6">{form.description || 'Take a virtual tour...'}</p>
              
              <div className="space-y-4">
                {(form.videos || []).slice(0, 2).map((vid, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm text-left">
                    <div className="aspect-video bg-slate-200 relative group cursor-pointer">
                      {vid.url ? (
                        <iframe
                          className="w-full h-full pointer-events-none"
                          src={getEmbedUrl(vid.url)}
                          title={vid.title}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                          <Play className="w-8 h-8 opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white pl-1 shadow-lg">
                           <Play className="w-5 h-5" />
                         </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="font-bold text-slate-800 text-sm mb-1">{vid.title || 'Video Title'}</h5>
                      <p className="text-xs text-slate-500 line-clamp-2">{vid.desc || vid.description || 'Video description goes here.'}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {(form.videos || []).length > 2 && (
                <p className="text-xs text-slate-400 mt-4 italic">+ {(form.videos || []).length - 2} more videos hidden in preview</p>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {previewSection && (
        <SectionPreviewModal 
          section={previewSection}
          onClose={() => setPreviewSection(null)}
          onPublish={async (sec) => {
            await cmsService.publishSection(sec.id);
            setPreviewSection(null);
            fetchPage();
            toast({ type: 'success', title: 'Live', message: 'Changes pushed to production.' });
          }}
          onRestore={() => fetchPage()}
        />
      )}
    </EditorPage>
  );
};

export default VideoShowcaseEditor;
