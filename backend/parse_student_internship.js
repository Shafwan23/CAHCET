const fs = require('fs');

const data = fs.readFileSync('student_internship_raw.txt', 'utf8');
const lines = data.split('\
').map(l => l.trim()).filter(l => l.length > 0);
const internship = [];
let currentYear = "2024-2025";
let id = 1;
let currentFields = [];

lines.forEach(line => {
  if (line.startsWith('Academic Year')) {
    const match = line.match(/\\((.*?)\\)/);
    if (match) currentYear = match[1];
    return;
  }
  
  if (line.startsWith('S.NO')) {
    currentFields = line.split('\\t').map(f => f.trim().toUpperCase());
    return;
  }
  
  const cols = line.split('\\t').map(c => c.trim());
  
  let name = "";
  let company = "";
  let topic = "";
  let date = "";
  
  if (currentFields.includes('STUDENT NAME') || currentFields.includes('NAME')) {
    const nIdx = currentFields.includes('STUDENT NAME') ? currentFields.indexOf('STUDENT NAME') : currentFields.indexOf('NAME');
    name = cols[nIdx] || "";
  }
  
  if (currentFields.includes('COMPANY NAME') || currentFields.includes('COMPANY')) {
    const cIdx = currentFields.includes('COMPANY NAME') ? currentFields.indexOf('COMPANY NAME') : currentFields.indexOf('COMPANY');
    company = cols[cIdx] || "";
  }
  
  if (currentFields.includes('TOPIC')) {
    topic = cols[currentFields.indexOf('TOPIC')] || "";
  }
  
  if (currentFields.includes('DATE')) {
    date = cols[currentFields.indexOf('DATE')] || "";
  }
  
  internship.push({
    id: id++,
    author: name,
    company: company,
    topic: topic,
    title: topic && company ? `${topic} at ${company}` : (topic || company),
    date: date,
    year: currentYear
  });
});

fs.writeFileSync('parsed_internship.json', JSON.stringify(internship, null, 2));
