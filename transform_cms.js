const fs = require('fs');

const transformCMS = (filePath, config) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Add EditorPage import if not present
  if (!content.includes('EditorPage')) {
    content = content.replace(
      /(import \{.*?\} from 'lucide-react';)/,
      "$1\nimport EditorPage, { EditorCard } from '../ui/EditorPage';\nimport { ShieldAlert, Monitor } from 'lucide-react';\nimport { motion } from 'framer-motion';"
    );
  } else if (!content.includes('ShieldAlert')) {
    content = content.replace(
      /import EditorPage.*?/,
      "import EditorPage, { EditorCard } from '../ui/EditorPage';\nimport { ShieldAlert, Monitor } from 'lucide-react';\nimport { motion } from 'framer-motion';"
    );
  }

  // Common replacements for CMS module components (ContactUs, ChatbotSettings, ChatbotWelcome)
  if (config.type === 'cms') {
    content = content.replace(
      /return \(\s*<EditorPage[\s\S]*?>\s*<div className=\"space-y-8\">/,
      `return (
    <EditorPage
      title="${config.title}"
      description="${config.description}"
      breadcrumb={['Admin', 'Module', '${config.breadcrumb}']}
      onSave={handleSave}
      isLoading={saving}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">${config.badge}</div></div>`
    );
    
    // Fallback if the above replace didn't work exactly
    if (!content.includes('<motion.div')) {
      content = content.replace(
        /<EditorPage[\s\S]*?>\s*<div className=\"(p-6.*?|space-y.*?)\">/,
        `<EditorPage
      title="${config.title}"
      description="${config.description}"
      breadcrumb={['Admin', 'Module', '${config.breadcrumb}']}
      onSave={handleSave}
      isLoading={saving}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">${config.badge}</div></div>`
      );
    }
    
    // Add closing tags and Live Preview pane
    content = content.replace(
      /        <\/div>\s*<\/EditorPage>/,
      `        </div>
          <div className="xl:col-span-4 hidden xl:block">
           <div className="sticky top-40 bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
             <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400"/><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span></div>
             <div className="p-6 prose prose-sm max-w-none text-slate-600">
               <h3 className="text-xl font-bold text-slate-900 mb-1">Live Module Preview</h3>
               <div className="line-clamp-[12] whitespace-pre-wrap text-slate-400 italic">Preview updates as you type. Draft data is managed securely.</div>
             </div>
           </div>
        </div>
      </motion.div>
    </EditorPage>`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Transformed ${filePath}`);
};

const cmsFiles = [
  { path: 'frontend/src/admin/components/editors/contact/ContactUsEditor.jsx', title: 'Enterprise Contact Hub', description: 'Manage campus locations, contact info, and business hours.', breadcrumb: 'Contact Us', badge: 'module.contact', type: 'cms' },
  { path: 'frontend/src/admin/components/editors/ChatbotSettingsEditor.jsx', title: 'AI Assistant Configuration', description: 'Manage AI persona, knowledge base, and token constraints.', breadcrumb: 'AI Assistant', badge: 'module.ai', type: 'cms' },
  { path: 'frontend/src/admin/components/editors/ChatbotWelcomeEditor.jsx', title: 'AI Welcome Onboarding', description: 'Design interactive AI onboarding flows and quick links.', breadcrumb: 'AI Onboarding', badge: 'module.ai.welcome', type: 'cms' },
];

cmsFiles.forEach(f => transformCMS(f.path, f));

