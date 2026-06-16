const fs = require('fs');
const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

// Regex to remove the description property from the JSON objects inside cse.js
content = content.replace(/,\s*"description":\s*"[^"]*"/g, '');

fs.writeFileSync(path, content);
console.log('Descriptions removed');
