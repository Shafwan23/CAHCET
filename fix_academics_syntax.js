const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/admin/components/editors/academics';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Editor.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We accidentally added an extra </div> before the col-span-4 preview pane.
  content = content.replace(
    /<\/div>\s*<div className="xl:col-span-4 hidden xl:block">/g,
    '<div className="xl:col-span-4 hidden xl:block">'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed syntax in', file);
}
