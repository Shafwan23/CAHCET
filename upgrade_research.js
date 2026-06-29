const fs = require('fs');
const path = require('path');

const file = 'frontend/src/admin/components/editors/research/ResearchEditor.jsx';
let content = fs.readFileSync(file, 'utf8');

const sectionKey = 'research.research_main';

// Imports
if (!content.includes('useEditorStatus')) {
  content = content.replace(
    /import \{ cmsService \} from '([^']+)';/,
    "import { cmsService } from '$1';\nimport SectionPreviewModal from '../../ui/SectionPreviewModal';\nimport { useEditorStatus } from '../../../utils/useEditorStatus';\nimport { motion } from 'framer-motion';\nimport { ShieldAlert, Monitor } from 'lucide-react';"
  );
}

// State vars
if (!content.includes('previewSection')) {
  content = content.replace(
    /const \[sectionsMap, setSectionsMap\] = useState\(\{\}\);/,
    "const [sectionsMap, setSectionsMap] = useState({});\n  const [previewSection, setPreviewSection] = useState(null);"
  );
}

// loadData
const loadDataRegex = /const fetchPage = async \(\) => \{[\s\S]*?finally \{\s*setLoading\(false\);\s*\}\s*\};/;
content = content.replace(loadDataRegex, `const fetchPage = async () => {
    try {
      const res = await cmsService.getPage('research');
      const map = (res.data?.sections || []).reduce((acc, sec) => { acc[sec.sectionKey] = sec; return acc; }, {});
      setSectionsMap(map);
      if (map['${sectionKey}']) {
        setForm(JSON.parse(map['${sectionKey}'].draftContent || map['${sectionKey}'].content || '{}') || { title: '', content: '', stats: {}, sections: [], publications: [], labs: [], collaborations: [], functionalities: [], team: [], achievementsList: [] });
      }
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to load.' });
    } finally {
      setLoading(false);
    }
  };`);

// handleSave
const handleSaveRegex = /const handleSave = async \(publish = false\) => \{[\s\S]*?finally \{\s*setLoading\(false\);\s*\}\s*\};/;
content = content.replace(handleSaveRegex, `const handleSaveDraft = async (isSilent = false) => {
    setLoading(true);
    try {
      const content = JSON.stringify(form);
      if (sectionsMap['${sectionKey}']) {
        await cmsService.updateSection(sectionsMap['${sectionKey}'].id, { draftContent: content, _isSilentDraft: isSilent });
      } else {
        const res = await cmsService.getPage('research');
        const newSec = await cmsService.createSection({
          pageId: res.data?.id,
          sectionKey: '${sectionKey}',
          title: 'Research',
          type: 'json',
          draftContent: content,
          _isSilentDraft: isSilent
        });
        setSectionsMap(prev => ({ ...prev, ['${sectionKey}']: newSec.data }));
      }
      if (!isSilent) toast({ type: 'success', title: 'Saved', message: 'Draft saved securely.' });
    } catch (err) {
      toast({ type: 'error', title: 'Error', message: 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };`);

// Add useEditorStatus hook right before return
content = content.replace(
  /return \(/,
  `const { status, lastModified, validationIssues } = useEditorStatus(sectionsMap, '${sectionKey}', form);\n\n  return (`
);

// Update EditorPage props
content = content.replace(
  /onSave=\{[^\}]+\}[\s\n]*onPublish=\{[^\}]+\}/,
  `onSave={() => handleSaveDraft(false)}\n      onPublish={async () => { await handleSaveDraft(true); setPreviewSection(sectionsMap['${sectionKey}'] || {}); }}\n      status={status}\n      lastModified={lastModified}\n      validationIssues={validationIssues}`
);

// Wrap inside Grid
content = content.replace(
  /<div className="space-y-6">/,
  `<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">\n        <div className="xl:col-span-8 space-y-6">\n          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">${sectionKey}</div></div>`
);

// Close grid and add preview pane
content = content.replace(
  /<\/EditorPage>/,
  `      </div>\n        <div className="xl:col-span-4 hidden xl:block">\n           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">\n             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>\n             <div className="p-6 prose prose-sm max-w-none text-slate-600">\n               <h3 className="text-xl font-bold text-slate-900 mb-1">{form.title || 'Research Center'}</h3>\n               <div className="line-clamp-[12] whitespace-pre-wrap">{form.content || 'Start typing...'}</div>\n             </div>\n           </div>\n        </div>\n      </motion.div>\n      {previewSection && <SectionPreviewModal section={previewSection} onClose={()=>setPreviewSection(null)} onPublish={async (sec)=>{await cmsService.publishSection(sec.id); setPreviewSection(null); fetchPage();}} onRestore={fetchPage} />}\n    </EditorPage>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Upgraded', file);
