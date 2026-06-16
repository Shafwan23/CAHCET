const fs = require('fs');

const csePath = '../frontend/src/data/departments/cse.js';
const moocData = fs.readFileSync('mooc_parsed.json', 'utf8');

let cseContent = fs.readFileSync(csePath, 'utf8');

const regex = /mooc:\s*\[[\s\S]*?\],/;
cseContent = cseContent.replace(regex, `mooc: ${moocData},`);

fs.writeFileSync(csePath, cseContent);
console.log('Successfully injected MOOC data into cse.js');
