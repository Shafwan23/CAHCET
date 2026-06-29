const fs = require('fs');
const lines = fs.readFileSync('C:/Users/91807/.gemini/antigravity-ide/brain/d0587d18-c52c-4b32-b306-a4dfd6878899/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
lines.forEach(l => {
  if(l.includes('USER_INPUT') && l.includes('Abdulnaseer M')) {
    try {
      console.log(JSON.parse(l).content);
    } catch(e){}
  }
});
