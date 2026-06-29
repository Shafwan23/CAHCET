const fs = require('fs');
const file = 'frontend/src/admin/components/editors/research/ResearchEditor.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<\/div>\s*<div className="xl:col-span-4 hidden xl:block">/g,
  '<div className="xl:col-span-4 hidden xl:block">'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed Research syntax');
