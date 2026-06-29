const fs = require('fs');

const data = fs.readFileSync('journals_raw.txt', 'utf8');
const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
const journals = [];
let currentYear = "2025";
let id = 1;

lines.forEach(line => {
  if (line.startsWith('Academic Year')) {
    const match = line.match(/\((.*?)\)/);
    if (match) currentYear = match[1];
    return;
  }
  
  // Try to parse author and title if there are quotes
  const quoteMatch = line.match(/^(.*?),?\s*[“"](.*?)[”"],?\s*(.*)$/);
  if (quoteMatch) {
    journals.push({
      id: id++,
      author: quoteMatch[1].trim(),
      title: quoteMatch[2].trim(),
      journal: quoteMatch[3].trim(),
      year: currentYear
    });
    return;
  }

  // Without quotes, try to split by first comma, or just use as description.
  let author = "";
  let title = "";
  let journalInfo = "";
  
  const firstComma = line.indexOf(',');
  if (firstComma > 0 && firstComma < 60) {
    author = line.substring(0, firstComma).trim();
    title = line.substring(firstComma + 1).trim();
  } else {
    title = line;
  }

  journals.push({
    id: id++,
    title: title,
    author: author,
    year: currentYear,
    description: line // fallback
  });
});

fs.writeFileSync('parsed_journals.json', JSON.stringify(journals, null, 2));
