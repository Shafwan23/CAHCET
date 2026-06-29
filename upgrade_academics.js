const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/admin/components/editors/academics';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Identify section key
  const sectionKeyMatch = content.match(/sectionKey:\s*'([^']+)'/);
  if (!sectionKeyMatch) continue;
  const sectionKey = sectionKeyMatch[1];

  // Imports
  if (!content.includes('useEditorStatus')) {
    content = content.replace(
      /import \{ cmsService \} from '([^']+)';/,
      "import { cmsService } from '$1';\nimport SectionPreviewModal from '../../ui/SectionPreviewModal';\nimport { useEditorStatus } from '../../../utils/useEditorStatus';\nimport { motion } from 'framer-motion';\nimport { ShieldAlert, Monitor } from 'lucide-react';"
    );
  }

  // State vars
  if (!content.includes('sectionsMap')) {
    content = content.replace(
      /const \[pageLoading, setPageLoading\] = useState\(true\);/,
      "const [pageLoading, setPageLoading] = useState(true);\n  const [sectionsMap, setSectionsMap] = useState({});\n  const [previewSection, setPreviewSection] = useState(null);"
    );
  }

  // Rewrite loadData
  const loadDataRegex = /const loadData = async \(\) => \{[\s\S]*?finally \{\s*setPageLoading\(false\);\s*\}\s*\};/;
  const fallbackFormMatch = content.match(/const \[form, setForm\] = useState\((.*?)\);/);
  const fallbackForm = fallbackFormMatch ? fallbackFormMatch[1] : '{}';
  
  content = content.replace(loadDataRegex, `const loadData = async () => {
    try {
      const res = await cmsService.getPage('academics');
      setPageId(res.data?.id);
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['${sectionKey}']) {
        setSectionId(map['${sectionKey}'].id);
        setForm(JSON.parse(map['${sectionKey}'].draftContent || map['${sectionKey}'].content || '{}') || ${fallbackForm});
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load.' });
    } finally {
      setPageLoading(false);
    }
  };`);

  // Rewrite handleSave
  const handleSaveRegex = /const handleSave = async \(\) => \{[\s\S]*?finally \{\s*setLoading\(false\);\s*\}\s*\};/;
  content = content.replace(handleSaveRegex, `const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionId || sectionsMap['${sectionKey}']) {
        const targetId = sectionId || sectionsMap['${sectionKey}'].id;
        await cmsService.updateSection(targetId, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const newSec = await cmsService.createSection({
          pageId,
          sectionKey: '${sectionKey}',
          title: '${file.replace('Editor.jsx', '')}',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionId(newSec.data?.id);
        setSectionsMap(prev => ({ ...prev, ['${sectionKey}']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };`);

  // Fix handlePublish
  content = content.replace(/const handlePublish = handleSave;/, '');

  // Add useEditorStatus hook right before return
  content = content.replace(
    /return \(/,
    `const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, '${sectionKey}', form);\n\n  return (`
  );

  // Update EditorPage props
  content = content.replace(
    /onSave=\{handleSave\}[\s\n]*onPublish=\{handlePublish\}/,
    `onSave={() => handleSaveDraft(false)}\n      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['${sectionKey}'] || {id: sectionId}); }}\n      status={status}\n      lastModified={lastModified}\n      validationIssues={validationIssues}`
  );

  // Wrap inside Grid
  content = content.replace(
    /<div className="space-y-6">/,
    `<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">\n        <div className="xl:col-span-8 space-y-6">\n          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">${sectionKey}</div></div>`
  );

  // Close grid and add preview pane
  content = content.replace(
    /<\/EditorPage>/,
    `      </div>\n        <div className="xl:col-span-4 hidden xl:block">\n           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">\n             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>\n             <div className="p-6 prose prose-sm max-w-none text-slate-600">\n               <h3 className="text-xl font-bold text-slate-900 mb-1">{form.title || 'Module Title'}</h3>\n               <div className="line-clamp-[12] whitespace-pre-wrap">{form.content || 'Start typing to see content preview here...'}</div>\n               {form.methods && <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono">{form.methods.length} items configured</div>}\n               {form.facilities && <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono">{form.facilities.length} items configured</div>}\n             </div>\n           </div>\n        </div>\n      </motion.div>\n      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); loadData();}} onRestore={loadData} />}\n    </EditorPage>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Upgraded', file);
}
