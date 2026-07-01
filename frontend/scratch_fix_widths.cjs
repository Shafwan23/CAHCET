const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('dist')) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Fix w-[XXXpx] to w-[XXXpx] max-w-full for numbers >= 250
      content = content.replace(/\bw-\[(\d+)px\]/g, (match, p1) => {
        if (parseInt(p1, 10) >= 250) {
          return `${match} max-w-full`;
        }
        return match;
      });

      // Fix min-w-[XXXpx] to min-w-[XXXpx] max-w-full for numbers >= 250
      content = content.replace(/\bmin-w-\[(\d+)px\]/g, (match, p1) => {
        if (parseInt(p1, 10) >= 250) {
          return `${match} max-w-full`;
        }
        return match;
      });

      // Fix w-96 to w-full sm:w-96
      content = content.replace(/\bw-96\b/g, 'w-full sm:w-96');

      // Deduplicate classes if we ran it multiple times (e.g. max-w-full max-w-full)
      content = content.replace(/max-w-full max-w-full/g, 'max-w-full');
      content = content.replace(/w-full sm:w-full sm:w-96/g, 'w-full sm:w-96');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed widths in', fullPath);
      }
    }
  }
}

processDir('c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src');
