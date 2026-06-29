const fs = require('fs');

const transformEditor = (filePath, config) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Add EditorPage import if not present
  if (!content.includes('EditorPage')) {
    content = content.replace(
      /(import \{.*?\} from 'lucide-react';)/,
      "$1\nimport EditorPage, { EditorCard } from '../ui/EditorPage';\nimport { ShieldAlert, Monitor } from 'lucide-react';"
    );
  }

  // Common replacements for Admin module components (ProfileSettings, ActivityLogs)
  if (config.type === 'admin') {
    content = content.replace(
      /<div className=\"(p-6.*?)\">\s*<div className=\"(flex.*?)\">([\s\S]*?)<\/div>\s*<\/div>/,
      `<EditorPage
      title="${config.title}"
      description="${config.description}"
      breadcrumb={['Admin', 'System', '${config.breadcrumb}']}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-12 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">Enterprise Module Manager</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">${config.badge}</div></div>
          <EditorCard title="${config.cardTitle}">`
    );
    
    // Add closing tags
    content = content.replace(
      /    <\/div>\s*<\/div>\s*\);\s*\};/,
      `        </EditorCard>\n        </div>\n      </motion.div>\n    </EditorPage>\n  );\n};`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Transformed ${filePath}`);
};

const adminFiles = [
  { path: 'frontend/src/admin/components/editors/admin/ProfileSettingsEditor.jsx', title: 'Enterprise Profile Center', description: 'Manage your account security and preferences.', breadcrumb: 'Profile', badge: 'system.profile', cardTitle: 'Profile Configuration' },
  { path: 'frontend/src/admin/components/editors/admin/ActivityLogsEditor.jsx', title: 'Enterprise Audit Logs', description: 'Monitor system-wide activity and security events.', breadcrumb: 'Audit Logs', badge: 'system.audit', cardTitle: 'Security Events' },
];

adminFiles.forEach(f => transformEditor(f.path, { ...f, type: 'admin' }));

// Transform UserManagement
let umFile = 'frontend/src/admin/components/editors/UserManagementEditor.jsx';
if (fs.existsSync(umFile)) {
  let umContent = fs.readFileSync(umFile, 'utf8');
  if (!umContent.includes('EditorPage')) {
    umContent = umContent.replace(
      /import \{ useAdminAuth \} from '\.\.\/\.\.\/context\/AdminAuthContext';/,
      "import { useAdminAuth } from '../../context/AdminAuthContext';\nimport EditorPage, { EditorCard } from '../ui/EditorPage';\nimport { ShieldAlert } from 'lucide-react';"
    );
  }
  
  umContent = umContent.replace(
    /<div className=\"p-6 space-y-5 h-full flex flex-col\">\s*<div className=\"flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0\">[\s\S]*?{\/\* Toolbar \*\/}/m,
    `<EditorPage
      title="Enterprise IAM Directory"
      description="Manage user identities, access roles, and granular department permissions."
      breadcrumb={['Admin', 'Security', 'User Management']}
    >
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="grid grid-cols-1 gap-6">
        <div className="xl:col-span-12 space-y-6">
          <div className="p-5 rounded-2xl border bg-slate-50 text-slate-700 border-slate-200 flex justify-between items-center"><div className="flex items-center gap-3"><ShieldAlert className="w-8 h-8 text-slate-400"/><span className="font-bold">IAM Control Center</span></div><div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold">security.iam</div></div>
        <EditorCard title="Identity Directory">
          {/* Toolbar */}`
  );
  
  umContent = umContent.replace(
    /      <ConfirmDialog ([\s\S]*?) \/>\r?\n    <\/div>\r?\n  \);\r?\n\};/m,
    `      <ConfirmDialog $1 />\n        </EditorCard>\n        </div>\n      </motion.div>\n    </EditorPage>\n  );\n};`
  );
  
  fs.writeFileSync(umFile, umContent, 'utf8');
  console.log('Transformed UserManagementEditor');
}
