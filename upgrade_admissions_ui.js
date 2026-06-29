const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/admin/components/editors/admissions';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add imports
  if (!content.includes('ShieldAlert')) {
    content = content.replace(
      /import \{ cmsService \} from '([^']+)';/,
      "import { cmsService } from '$1';\nimport { motion } from 'framer-motion';\nimport { ShieldAlert, Monitor } from 'lucide-react';"
    );
  }

  // Wrap with Two-Panel Grid
  content = content.replace(
    /<div className="space-y-8">/,
    `<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">\n        <div className="xl:col-span-8 space-y-8">\n          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">admissions</div></div>`
  );

  // Note: Some files use space-y-6 instead of space-y-8. Let's handle both.
  content = content.replace(
    /<div className="space-y-6">/,
    `<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">\n        <div className="xl:col-span-8 space-y-6">\n          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">admissions</div></div>`
  );

  // Close Grid
  content = content.replace(
    /<\/EditorPage>/,
    `      </div>\n        <div className="xl:col-span-4 hidden xl:block">\n           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">\n             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>\n             <div className="p-6 prose prose-sm max-w-none text-slate-600">\n               <h3 className="text-xl font-bold text-slate-900 mb-1">Live Module Preview</h3>\n               <div className="line-clamp-[12] whitespace-pre-wrap text-slate-400 italic">Preview updates as you type. Draft data is managed securely.</div>\n             </div>\n           </div>\n        </div>\n      </motion.div>\n    </EditorPage>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Upgraded UI for', file);
}
