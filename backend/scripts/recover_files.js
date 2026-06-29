const fs = require('fs');
const lines = fs.readFileSync('C:/Users/91807/.gemini/antigravity-ide/brain/d0587d18-c52c-4b32-b306-a4dfd6878899/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

lines.forEach(l => {
  if (l.includes('write_to_file')) {
    try {
      const j = JSON.parse(l);
      if (j.tool_calls) {
        j.tool_calls.forEach(tc => {
          if (tc.name === 'write_to_file' && tc.args.TargetFile && (tc.args.TargetFile.includes('training') || tc.args.TargetFile.includes('student'))) {
            let p = tc.args.TargetFile;
            if (p.startsWith('"')) p = p.slice(1, -1);
            let c = tc.args.CodeContent;
            if (c.startsWith('"')) c = c.slice(1, -1);
            
            // Basic unescaping since args are stored as strings inside JSON sometimes.
            // Wait, if it's already parsed by JSON.parse, tc.args.TargetFile is a string.
            // But if it contains literal quotes, we slice them.
            c = c.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\"/g, '"').replace(/\\'/g, "'");
            
            fs.writeFileSync(p, c);
            console.log('Recovered: ' + p);
          }
        });
      }
    } catch(e) {
      // Ignore
    }
  }
});
