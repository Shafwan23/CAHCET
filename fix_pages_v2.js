const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/pages/about';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Pattern 1: newState.xyz = JSON.parse(xyz.content);
  content = content.replace(/(newState\.[a-zA-Z0-9_]+)\s*=\s*JSON\.parse\((.*?)\.content\)(;?)/g, 
    "try { if($2 && $2.content) { const _p = JSON.parse($2.content); if (Object.keys(_p).length) $1 = _p; } } catch(e) {}");

  // Pattern 2: const v = JSON.parse(valuesSec.content);
  content = content.replace(/const ([a-zA-Z0-9_]+) = JSON\.parse\((.*?)\.content\)(;?)/g, 
    "let $1 = {}; try { if($2 && $2.content) { $1 = JSON.parse($2.content); } } catch(e){}");

  // Pattern 3: setForm(JSON.parse(xyz.content))
  content = content.replace(/setForm\(JSON\.parse\((.*?)\.content\)\)(;?)/g, 
    "try { if($1 && $1.content) { const _p = JSON.parse($1.content); if(Object.keys(_p).length) setForm(_p); } } catch(e){}");

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
