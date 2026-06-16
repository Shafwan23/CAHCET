const fs = require('fs');

const data = fs.readFileSync('student_extracurricular_raw.txt', 'utf8');
const lines = data.split('\
').map(l => l.trim()).filter(l => l.length > 0 && l !== 'Extra-Curricular Achievements');
const extracur = [];
let currentYear = "2024-2025";
let id = 1;

lines.forEach(line => {
  if (line.startsWith('Academic Year')) {
    const match = line.match(/\\((.*?)\\)/);
    if (match) currentYear = match[1];
    return;
  }

  // Author is the name at the start.
  let author = "";
  let title = line;
  
  const verbMatch = line.match(/^(.*?)(?:\\s+successfully|\\s+participated|\\s+secured|\\s+emerged|\\s+was|\\s+won)/i);
  if (verbMatch) {
    author = verbMatch[1].trim();
    // if there is "from", strip it out from author.
    const fromMatch = author.match(/^(.*?)\\s+from\\s+/i);
    if (fromMatch) {
      author = fromMatch[1].trim();
    }
    title = line.substring(verbMatch[1].length).trim();
    title = title.replace(/^(from\\s+[A-Za-z\\s]+\\s+)?(successfully\\s+)?(participated\\s+in\\s+|secured\\s+|emerged\\s+as\\s+|won\\s+|was\\s+)/i, '');
  }

  extracur.push({
    id: id++,
    title: title,
    author: author,
    year: currentYear
  });
});

fs.writeFileSync('parsed_student_extracur.json', JSON.stringify(extracur, null, 2));
