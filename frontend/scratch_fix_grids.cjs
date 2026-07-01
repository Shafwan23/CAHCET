const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('dist')) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Replace naked grid-cols-2,3,4 with responsive versions.
      // E.g., class="... grid-cols-2 ..." -> class="... grid-cols-1 md:grid-cols-2 ..."
      // We must avoid replacing something like `md:grid-cols-2` or `sm:grid-cols-2`.
      
      // Look for grid-cols-2 with word boundaries, not preceded by ':'
      content = content.replace(/(?<!:)\bgrid-cols-2\b/g, 'grid-cols-1 sm:grid-cols-2');
      content = content.replace(/(?<!:)\bgrid-cols-3\b/g, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3');
      content = content.replace(/(?<!:)\bgrid-cols-4\b/g, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4');
      
      // Same for flex-row that might not wrap
      // If there's `flex-row` but no `flex-col`, it might be an issue. But it's risky to auto-replace `flex-row` 
      // without knowing context. Let's stick to fixing grids for now as they are the main culprits in forms.
      
      // Fix potential duplicate classes created
      content = content.replace(/grid-cols-1 sm:grid-cols-1 sm:grid-cols-2/g, 'grid-cols-1 sm:grid-cols-2');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed grids in', fullPath);
      }
    }
  }
}

processDir('c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\admin');
processDir('c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\pages');
processDir('c:\\Users\\91807\\Desktop\\Shafwan\\cahcet\\frontend\\src\\components');
