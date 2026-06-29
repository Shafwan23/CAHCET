const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src/admin/components/dashboard/dashboards');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Clean up previous experiment
      content = content.replace(/ hover:-translate-y-2 hover:shadow-\[0_20px_40px_-15px_rgba\(59,130,246,0\.15\)\] transition-all duration-500 ease-out group ring-1 ring-transparent hover:ring-blue-500\/5/g, '');
      content = content.replace(/ border-slate-100\/50 hover:border-blue-500\/30/g, ' border-slate-200');

      // The new super premium Vercel/Linear shadow
      // This combines a sharp 1px colored ring acting as an inset border, plus a massive diffused outer shadow.
      const premiumClasses = ' hover:-translate-y-1 hover:border-indigo-300/50 hover:shadow-[0_0_0_2px_rgba(99,102,241,0.1),0_15px_40px_-10px_rgba(99,102,241,0.15)] transition-all duration-300 ease-out';

      const cardRegex = /className="([^"]*(?:bg-white[^"]*rounded-(?:3xl|\[2rem\]|\[2\.5rem\]))[^"]*)"/g;
      
      content = content.replace(cardRegex, (match, classes) => {
        // Ensure we don't duplicate
        if (!classes.includes('hover:shadow-[0_0_0_2px')) {
          const newClasses = classes + premiumClasses;
          return `className="${newClasses}"`;
        }
        return match;
      });

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Applied Premium Shadow in: ${file}`);
    }
  }
}

processDirectory(targetDir);
console.log('UI Premium Shadows complete.');
