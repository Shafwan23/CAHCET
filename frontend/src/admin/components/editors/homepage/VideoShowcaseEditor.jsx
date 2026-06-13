import React, { useState, useEffect } from 'react';
import { Monitor, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import EditorPage, { EditorCard } from '../../ui/EditorPage';
import { AdminInput, AdminTextarea, AdminToggle } from '../../ui/AdminInput';
import { cmsService } from '../../../../services/cmsService';

const VideoShowcaseEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('home');
        setPageId(res.data?.id);
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['home.videos']) {
          setForm(JSON.parse(map['home.videos'].content));
        }
      } catch (err) {
        toast({ type: 'error', title: 'Error', message: 'Failed to load Video data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const change = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['home.videos']) {
        await cmsService.updateSection(sectionsMap['home.videos'].id, { content });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: 'home.videos',
          title: 'Video Showcase',
          content
        });
        setSectionsMap(prev => ({ ...prev, 'home.videos': newSec.data }));
      }
      toast({ type: 'success', title: publish ? 'Published!' : 'Draft saved', message: `Video changes ${publish ? 'are now live' : 'saved'}.` });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save Video data.' });
    } finally {
      setLoading(false);
    }
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
    images.splice(targetIdx, 0, moved);
    change('videos', videos);
  };

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage
      title="Video Showcase Editor"
      description="Manage the campus media and success story videos on the homepage."
      breadcrumb={['Admin', 'Homepage', 'Video Showcase']}
      onSave={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      onReset={handleReset}
      isLoading={loading}
    >
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
                      src={vid.url}
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

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
        <Monitor className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Live Preview</p>
          <p className="text-xs mt-0.5">Videos will render side-by-side on the <a href="/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">homepage</a>.</p>
        </div>
      </div>
    </EditorPage>
  );
};

export default VideoShowcaseEditor;
