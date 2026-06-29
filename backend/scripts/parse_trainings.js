const fs = require('fs');

const data = fs.readFileSync('trainings_raw.txt', 'utf8');
const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== 'FDP & Webinar Attended:');
const trainings = [];
let currentYear = "2024– 2025";
let id = 1;

lines.forEach(line => {
  if (line.startsWith('Academic Year')) {
    const match = line.match(/\\((.*?)\\)/);
    if (match) currentYear = match[1];
    return;
  }

  // Attempt to parse "Name has [successfully] completed/participated in title organized by org date"
  // This text is very unstructured. Let's extract the author name roughly.
  let author = "";
  let title = line;
  
  // Try to find the person's name (starts line until "has" or "for successfully" or "Participated")
  const hasMatch = line.match(/^(.*?)(?:\\s+has\\s+|\\s+for\\s+successfully|\\s+Participated|\\s+successfully)/i);
  if (hasMatch) {
    author = hasMatch[1].trim();
    title = line.substring(author.length).trim();
    // remove leading words like "has successfully participated in"
    title = title.replace(/^(has\\s+)?(successfully\\s+)?(participated\\s+in\\s+|completed\\s+|completed\\s+a\\s+course\\s+on\\s+|participated\\s+|completed\\s+the\\s+course\\s+|attend\\s+e\\s+d\\s+a\\s+webinar\\s+on\\s+)/i, '');
  }

  trainings.push({
    id: id++,
    title: title,
    organizer: author, // swap them around to fit into the UI cleanly, but the UI expects `organizer`, `date`, `title`. Wait, it's better to just use `title` for the whole string and `author` if I can.
    // wait, the component expects `title`, `organizer`, `date`. But I don't have those neatly. I will just use `title` for the whole line, and `organizer` for the person, or just put the whole line in `title` and maybe leave organizer blank.
    // No, I'll put author in `organizer` field.
    date: currentYear
  });
});

fs.writeFileSync('parsed_trainings.json', JSON.stringify(trainings, null, 2));
