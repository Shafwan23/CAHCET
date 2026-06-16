const fs = require('fs');

const data = fs.readFileSync('student_cocurricular_raw.txt', 'utf8');
const lines = data.split('\
').map(l => l.trim()).filter(l => l.length > 0);
const cocur = [];
let currentYear = "2024-2025";
let id = 1;

lines.forEach(line => {
  if (line.startsWith('Academic Year')) {
    const match = line.match(/\\((.*?)\\)/);
    if (match) currentYear = match[1];
    return;
  }

  // Author is the name at the start. Usually "Name verb ..." 
  // Let's use a regex to capture up to the first known verb like participated, secured, emerged, successfully, was
  let author = "";
  let title = line;
  
  const verbMatch = line.match(/^(.*?)(?:\\s+successfully|\\s+participated|\\s+secured|\\s+emerged|\\s+was)/i);
  if (verbMatch) {
    author = verbMatch[1].trim();
    title = line.substring(author.length).trim();
  }

  cocur.push({
    id: id++,
    title: title,
    author: author,
    year: currentYear
  });
});

fs.writeFileSync('parsed_student_cocur.json', JSON.stringify(cocur, null, 2));
