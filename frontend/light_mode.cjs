const fs = require('fs');
const file = 'src/admin/components/dashboard/dashboards/SuperAdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement order matters.
content = content.replace(/bg-slate-950/g, 'bg-slate-50/50');
content = content.replace(/bg-slate-900/g, 'bg-white');
content = content.replace(/bg-slate-800\/50/g, 'bg-slate-50 border-slate-100');
content = content.replace(/bg-slate-800\/30/g, 'hover:bg-slate-50');
content = content.replace(/bg-slate-800/g, 'bg-slate-100');
content = content.replace(/border-slate-800/g, 'border-slate-100 shadow-sm');
content = content.replace(/border-slate-700/g, 'border-slate-200');

// Text Colors (Careful sequence)
content = content.replace(/text-slate-300/g, 'text-slate-600');
content = content.replace(/text-slate-400/g, 'TEMP_SLATE_400');
content = content.replace(/text-slate-500/g, 'text-slate-400');
content = content.replace(/TEMP_SLATE_400/g, 'text-slate-500');
content = content.replace(/text-white/g, 'text-slate-900');

// SVG strokes
content = content.replace(/stroke="#1e293b"/g, 'stroke="#e2e8f0"');

// Gradients
content = content.replace(/from-blue-900\/50 to-slate-900/g, 'from-blue-50 to-white');
content = content.replace(/from-emerald-900\/50 to-slate-900/g, 'from-emerald-50 to-white');
content = content.replace(/from-purple-900\/50 to-slate-900/g, 'from-purple-50 to-white');
content = content.replace(/from-amber-900\/50 to-slate-900/g, 'from-amber-50 to-white');

// Gradient borders
content = content.replace(/border-blue-800\/50/g, 'border-blue-100');
content = content.replace(/border-emerald-800\/50/g, 'border-emerald-100');
content = content.replace(/border-purple-800\/50/g, 'border-purple-100');
content = content.replace(/border-amber-800\/50/g, 'border-amber-100');

// Text Gradients
content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400/g, 'text-blue-600');

fs.writeFileSync(file, content);
console.log('Conversion successful!');
