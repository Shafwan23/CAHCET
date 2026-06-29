const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/91807/Desktop/Shafwan/cahcet/frontend/src/admin/components/editors/departments';

const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Upgrade KPI Cards
  content = content.replace(
    /className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-28"/g,
    'className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between h-32 relative overflow-hidden group"'
  );

  // Upgrade Inner List Items
  content = content.replace(
    /className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-colors group overflow-hidden"/g,
    'className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all group overflow-hidden relative"'
  );

  // Upgrade motion initial configs
  content = content.replace(
    /initial={{ opacity: 0, scale: 0\.98 }}[\s\n]*animate={{ opacity: 1, scale: 1 }}[\s\n]*exit={{ opacity: 0, scale: 0\.95 }}/g,
    "initial={{ opacity: 0, y: 20, scale: 0.98 }}\n                    animate={{ opacity: 1, y: 0, scale: 1 }}\n                    exit={{ opacity: 0, scale: 0.95, y: -20 }}\n                    transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}"
  );

  // Upgrade header fonts
  content = content.replace(
    /className="text-sm font-bold text-slate-800 uppercase tracking-widest"/g,
    'className="text-[10px] font-bold text-slate-800 uppercase tracking-widest"'
  );
  
  // Replace old search bar
  content = content.replace(
    /className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400\/30 focus:border-amber-400 transition-all"/g,
    'className="w-full pl-10 pr-4 py-3 border border-slate-200/70 rounded-xl text-sm bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all duration-300"'
  );

  // Upgrade "Add" Buttons
  content = content.replace(
    /className="flex items-center justify-center gap-1\.5 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 shadow-lg shadow-amber-500\/20 transition-all active:scale-95 shrink-0"/g,
    'className="flex items-center justify-center gap-1.5 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all shrink-0"'
  );
  
  // Upgrade KPI Text from 3xl to 4xl
  content = content.replace(
    /className="text-3xl font-bold text-slate-800"/g,
    'className="text-4xl font-extrabold text-slate-900 tracking-tight"'
  );

  // Upgrade item header bg
  content = content.replace(
    /className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between"/g,
    'className="p-4 bg-slate-50/50 backdrop-blur-md border-b border-slate-100/50 flex items-center justify-between"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Upgraded', file);
}
