import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import EditorPage, { EditorCard } from '../ui/EditorPage';
import { AdminInput, AdminTextarea } from '../ui/AdminInput';
import { cmsService } from '../../../services/cmsService';

const SEOEditor = () => {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', description: '', keywords: '', ogImage: '' });
  const [loading, setLoading] = useState(true);
  const [sectionsMap, setSectionsMap] = useState({});

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await cmsService.getPage('seo');
        const sections = res.data?.sections || [];
        const map = sections.reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
        setSectionsMap(map);

        if (map['seo.global']) {
          setForm(JSON.parse(map['seo.global'].content));
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

  if (loading && !Object.keys(sectionsMap).length) return <div>Loading...</div>;

  return (
    <EditorPage title="SEO Settings" description="Manage meta tags and Open Graph settings for search engine optimization." breadcrumb={['Admin', 'Site', 'SEO']}
      onSave={() => handleSave(false)} onPublish={() => handleSave(true)} isLoading={loading}>
      <EditorCard title="Page Meta Tags">
        <div className="space-y-4">
          <div>
            <AdminInput label="Page Title" value={form.title || ''} onChange={e => change('title', e.target.value)} placeholder="CAHCET | Engineering Excellence"
              hint={`${titleLength}/60 characters (recommended: 50-60)`} />
            <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${titleLength > 60 ? 'bg-amber-400' : titleLength > 50 ? 'bg-amber-400' : 'bg-amber-400'}`}
                style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }} />
            </div>
          </div>
          <div>
            <AdminTextarea label="Meta Description" value={form.description || ''} onChange={e => change('description', e.target.value)} rows={3}
              placeholder="Official website of CAHCET..." hint={`${descLength}/160 characters (recommended: 150-160)`} />
            <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${descLength > 160 ? 'bg-amber-400' : descLength > 150 ? 'bg-amber-400' : 'bg-amber-400'}`}
                style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }} />
            </div>
          </div>
          <AdminTextarea label="Keywords" value={form.keywords || ''} onChange={e => change('keywords', e.target.value)} rows={2}
            placeholder="CAHCET, engineering college, Tamil Nadu, admission 2026" hint="Comma-separated keywords" />
          <AdminInput label="OG Image URL (Social Share Image)" value={form.ogImage || ''} onChange={e => change('ogImage', e.target.value)} placeholder="https://..." hint="Recommended: 1200x630px" />
          {form.ogImage && <img src={form.ogImage} alt="OG Preview" className="rounded-xl object-cover w-full max-h-40 border border-slate-200" />}
        </div>
      </EditorCard>

      {/* Preview card */}
      <EditorCard title="Search Result Preview">
        <div className="p-4 bg-white border border-slate-200 rounded-xl max-w-lg">
          <p className="text-xs text-slate-400 mb-1">cahcet.edu.in</p>
          <p className="text-blue-600 text-lg font-medium leading-tight mb-1 line-clamp-1">{form.title || 'Page Title'}</p>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{form.description || 'Meta description will appear here.'}</p>
        </div>
      </EditorCard>
    </EditorPage>
  );
};
export default SEOEditor;
