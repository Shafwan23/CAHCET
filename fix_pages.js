const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/pages/about';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We want to replace lines like:
  // newState.college = JSON.parse(collegeSec.content);
  // or 
  // const v = JSON.parse(valuesSec.content);
  // with safe parsing. 
  
  // Actually, the simplest fix is to just define a safeParse helper at the top of the file if it's missing,
  // and replace JSON.parse with safeParse.
  // But wait! If we do: newState.college = safeParse(..., newState.college);
  
  // It's much easier to just do: 
  content = content.replace(/JSON\.parse\((.*?)\.content\)/g, "(($1 && $1.content) ? (()=>{ try { const p = JSON.parse($1.content); return Object.keys(p).length ? p : null; } catch(e){ return null; } })() : null)");

  // But then we have things like: newState.vision = ...
  // If the RHS is null, newState.vision becomes null, which crashes.
  // So we must do:
  // newState.vision = null || newState.vision;
  content = content.replace(/(newState\.[a-zA-Z0-9_]+)\s*=\s*(JSON\.parse\([^)]+\))/g, "$1 = $2 || $1");
  
  // Wait, let's just do it cleanly:
  content = content.replace(/(newState\.[a-zA-Z0-9_]+)\s*=\s*JSON\.parse\((.*?)\.content\)/g, 
    "try { if($2 && $2.content) { const _p = JSON.parse($2.content); if (Object.keys(_p).length) $1 = _p; } } catch(e) {}");

  // For ValuesPhilosophyPage:
  // const v = JSON.parse(valuesSec.content);
  content = content.replace(/const v = JSON\.parse\(valuesSec\.content\);/, 
    "let v = {}; try { if(valuesSec && valuesSec.content) { v = JSON.parse(valuesSec.content); } } catch(e){}");

  // For other edge cases:
  // Let's also do safe parse for data.form etc.
  content = content.replace(/setForm\(JSON\.parse\((.*?)\.content\)\)/g, 
    "try { if($1 && $1.content) { const _p = JSON.parse($1.content); if(Object.keys(_p).length) setForm(_p); } } catch(e){}");

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
