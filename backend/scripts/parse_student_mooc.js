const fs = require('fs');
let moocIdCounter = 1;

const data = fs.readFileSync('student_mooc_raw.txt', 'utf8');
const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const parsedData = [];
let currentYear = 'Academic Year (2024-2025)';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.startsWith('Academic Year')) {
    currentYear = line;
    continue;
  }
  
  if (line.startsWith('S.NO') || line.startsWith('S.No')) continue;
  
  // Format: 1\tR Abrar ul haque\tcoursera\tSetup Python\t3/13/2025
  const parts = line.split('\\t').map(p => p.trim());
  if (parts.length >= 4) {
    const sNo = parts[0];
    if (isNaN(parseInt(sNo))) continue; // skip non-data rows
    
    // Sometimes MOOC format for 2023-2024 has 5 columns: S.NO\tNAME OF THE STUDENT\tCOURSE NAME\tDATE OF COMPLETION\tMOOC
    // Let's check the company and title order.
    // 1\tAREEB AMAAR\tCLOUD PLATFORM VIRTUAL EXPERIENCE PROGRAM\t7/4/2023\tFORAGE
    // Here, part[2] is Course Name, part[3] is Date, part[4] is MOOC (Company).
    
    let author, company, title, date;
    
    if (currentYear.includes('2023-2024')) {
      // 1\tAREEB AMAAR\tCLOUD PLATFORM VIRTUAL EXPERIENCE PROGRAM\t7/4/2023\tFORAGE
      author = parts[1];
      title = parts[2];
      date = parts[3];
      company = parts[4] || '';
    } else {
      // 1\tR Abrar ul haque\tcoursera\tSetup Python\t3/13/2025
      author = parts[1];
      company = parts[2];
      title = parts[3];
      date = parts[4] || '';
    }

    parsedData.push({
      id: moocIdCounter++,
      category: 'mooc',
      author: author,
      company: company,
      title: title,
      date: date,
      year: currentYear
    });
  }
}

fs.writeFileSync('mooc_parsed.json', JSON.stringify(parsedData, null, 2));
console.log(`Parsed ${parsedData.length} mooc courses`);
