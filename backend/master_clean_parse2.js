const fs = require('fs');

const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

const p1 = fs.readFileSync('latest_faculty_p1.txt', 'utf8');
const p1_part2 = fs.readFileSync('latest_faculty_p1_part2.txt', 'utf8');
const p2 = fs.readFileSync('latest_faculty_p2.txt', 'utf8');

// --- Parse International Journals ---
const jSection = p1.split("International journal data")[1].split("International conference data")[0];
const journals = [];
let jId = 1;
let currentJYear = '2025';

// Split the section into blocks separated by \n\n
const rawBlocks = jSection.split(/\n\s*\n/);
for (const block of rawBlocks) {
    const cleanBlock = block.replace(/^'/, '').trim();
    if (!cleanBlock) continue;
    
    // Check if it's the academic year header
    if (cleanBlock.startsWith('Academic Year')) {
        currentJYear = cleanBlock.replace('Academic Year (', '').replace(')', '').trim().replace(/[^0-9-]/g, '');
        continue;
    }

    // Now, if this block contains multiple lines, it's either a multiline entry or multiple single-line entries.
    // The first 7 entries are multiline, but the single line entries are just one entry per line under the Academic Year headers.
    const lines = cleanBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    if (lines.length > 0 && lines[0].startsWith('Academic Year')) {
        currentJYear = lines[0].replace('Academic Year (', '').replace(')', '').trim().replace(/[^0-9-]/g, '');
        // process the rest of the lines
        for (let i = 1; i < lines.length; i++) {
            parseJournalLine(lines[i], currentJYear);
        }
        continue;
    }

    // If it's the Academic Year 2018-2019 block or later, the block has many lines, each representing one journal.
    // Let's distinguish by seeing if the lines contain quotes or look like single entries.
    // Actually, if we just check if it's before or after "Academic Year", it's easier.
    // But since `rawBlocks` splits by \n\n, if a block has multiple lines and NO `Academic Year`, is it one entry or multiple?
    // The first 7 entries have DOIs or are 3-4 lines each for ONE entry.
    // The later entries are 1 line per entry, but maybe separated by \n without \n\n.
    
    let isMultiLineEntry = false;
    if (lines.length > 1) {
        // If it has DOI on the last line, it's definitely a multiline single entry
        if (lines[lines.length - 1].toLowerCase().startsWith('doi:') || lines[lines.length - 1].toLowerCase().startsWith('issn:')) {
            isMultiLineEntry = true;
        } else if (lines.length <= 4 && !lines[0].includes('“') && !lines[0].includes('"')) {
             isMultiLineEntry = true;
        }
    }

    if (isMultiLineEntry) {
        let author = lines[0];
        let title = lines[1];
        let journalName = lines[2];
        let year = currentJYear;
        
        // Sometimes the first line is the whole thing: "T. Balaji, M. Abdulnaseer, A Review..."
        if (lines[0].includes(', A Review')) {
            author = lines[0].split(', A Review')[0];
            title = "A Review" + lines[0].split(', A Review')[1];
            journalName = title;
        } else if (lines[0].includes('Analysis of Android Malware')) {
            author = lines[0].split(', ')[0];
            title = lines[0].split(', ')[1];
            journalName = lines[1];
        }

        const yMatch = block.match(/\b(201\d|202\d)\b/);
        if (yMatch) year = yMatch[1];
        
        // Clean up title and journal
        const fullText = lines.filter(l => !l.toLowerCase().startsWith('doi:') && !l.toLowerCase().startsWith('issn:') && !l.toLowerCase().startsWith('conference:')).join(' ');

        journals.push({
            id: jId++,
            title: title,
            author: author,
            journal: fullText,
            year: year
        });
    } else {
        // It's either a single line block, or a block of many single-line entries
        for (const line of lines) {
            parseJournalLine(line, currentJYear);
        }
    }
}

function parseJournalLine(line, defaultYear) {
    if (line.toLowerCase().includes('doi:')) return;
    if (line.toLowerCase().startsWith('conference:')) return;
    if (line.toLowerCase().startsWith('issn:')) return;

    let author = '';
    let title = line;
    let year = defaultYear;

    if (line.includes('“') && line.includes('”')) {
        author = line.substring(0, line.indexOf('“')).replace(/,$/, '').trim();
        title = line.substring(line.indexOf('“') + 1, line.indexOf('”')).trim();
        let rest = line.substring(line.indexOf('”') + 1);
        const yMatch = rest.match(/\b(201\d|202\d)\b/);
        if (yMatch) year = yMatch[1];
    } else if (line.includes(', "')) {
        const parts = line.split(', "');
        author = parts[0].trim();
        title = parts[1].split('”')[0].split('"')[0].trim();
        let rest = parts[1];
        const yMatch = rest.match(/\b(201\d|202\d)\b/);
        if (yMatch) year = yMatch[1];
    } else if (line.includes(', ')) {
        const parts = line.split(', ');
        author = parts[0];
        title = parts.slice(1, -1).join(', ') || line;
        const yMatch = line.match(/\b(201\d|202\d)\b/);
        if (yMatch) year = yMatch[1];
    }

    journals.push({
        id: jId++,
        title: title,
        author: author,
        journal: line,
        year: year
    });
}

// Parse International Conferences
const iConfSection = p1_part2.split("International conference data")[1].split("National conference Data")[0];
const intConf = [];
let iConfId = 1;
iConfSection.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== "'").forEach(line => {
    let title = line;
    let author = '';
    let year = 'Unknown';
    if (line.includes('titled "')) {
        title = line.split('titled "')[1].split('"')[0];
        author = line.split('titled "')[0].split(',')[0].trim();
    } else if (line.includes('paper “')) {
        title = line.split('paper “')[1].split('”')[0];
        author = line.split('Presented')[0].trim();
    }
    const yMatch = line.match(/\b(201\d|202\d)\b/);
    if (yMatch) year = yMatch[1];

    intConf.push({
        id: iConfId++,
        title: title,
        author: author,
        conference: line,
        location: '',
        year: year
    });
});

// Parse National Conferences
const nConfSection = p1_part2.split("National conference Data")[1];
const natConf = [];
let nConfId = 1;
nConfSection.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== "'").forEach(line => {
    let title = line;
    let author = '';
    let year = 'Unknown';
    if (line.includes('titled "')) {
        title = line.split('titled "')[1].split('"')[0];
        author = line.split('titled "')[0].split(',')[0].trim();
    } else if (line.includes('entitled “')) {
        title = line.split('entitled “')[1].split('”')[0];
        author = line.split('has presented')[0].trim();
    }
    const yMatch = line.match(/\b(201\d|202\d)\b/);
    if (yMatch) year = yMatch[1];

    natConf.push({
        id: nConfId++,
        title: title,
        author: author,
        conference: line,
        location: '',
        year: year
    });
});

// Parse Trainings
const tSection = p2;
const trainings = [];
let tId = 1;
let currentTYear = '2024-2025';
tSection.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== "'").forEach(line => {
    if (line.startsWith('Academic Year')) {
        currentTYear = line.replace('Academic Year (', '').replace(')', '').trim().replace(/[^0-9-]/g, '');
    } else if (!line.startsWith('FDP & Webinar')) {
        trainings.push({
            id: tId++,
            title: line,
            organizer: '',
            date: currentTYear,
            year: currentTYear
        });
    }
});

// Parse Student Data (from clean_*.txt)
const cLines = fs.readFileSync('clean_cocur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const cocur = [];
let cYear = '2024-2025';
let cId = 1;
cLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        cYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[^0-9-]/g, '');
    } else if (line.length > 10) {
        cocur.push({
            id: cId++,
            title: line,
            author: "",
            year: cYear
        });
    }
});

const eLines = fs.readFileSync('clean_extracur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const extracur = [];
let eYear = '2024-2025';
let eId = 1;
eLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        eYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[^0-9-]/g, '');
    } else if (line.length > 10 && !line.startsWith('Extra-Curricular Achievements')) {
        extracur.push({
            id: eId++,
            title: line,
            author: "",
            year: eYear
        });
    }
});

const iLines = fs.readFileSync('clean_internship.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const internship = [];
let iId = 1;
let iYear = '2024-2025';
const iRegex = /^\d+\s+(.*?)\s+(.*?)\s+(.*?)\s+(\d{1,2}\/\d{1,2}\/\d{4}.*)$/;
iLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        iYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[^0-9-]/g, '');
    } else if (/^\d+\s/.test(line)) {
        const parts = line.split('\t');
        if (parts.length >= 5) {
            internship.push({
                id: iId++,
                author: parts[1].trim(),
                organizer: parts[2].trim(),
                title: parts[3].trim(),
                date: parts[4].trim(),
                year: iYear
            });
        } else {
            const m = line.match(iRegex);
            if (m) {
                internship.push({
                    id: iId++,
                    author: m[1].trim(),
                    organizer: m[2].trim(),
                    title: m[3].trim(),
                    date: m[4].trim(),
                    year: iYear
                });
            } else {
                 const p = line.split(/\s{2,}/);
                 if(p.length >= 5) {
                     internship.push({
                        id: iId++,
                        author: p[1].trim(),
                        organizer: p[2].trim(),
                        title: p[3].trim(),
                        date: p[4].trim(),
                        year: iYear
                    });
                 }
            }
        }
    }
});

const mLines = fs.readFileSync('clean_mooc.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const mooc = [];
let mId = 1;
let mYear = '2024-2025';
mLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        mYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[^0-9-]/g, '');
    } else if (/^\d+\s/.test(line)) {
        const parts = line.split('\t');
        if (parts.length >= 4) {
            mooc.push({
                id: mId++,
                author: parts[1].trim(),
                organizer: parts[2].trim(),
                title: parts[3].trim(),
                date: parts[4] ? parts[4].trim() : "",
                year: mYear
            });
        }
    }
});


const achievementsData = {
  faculty: {
    internationalJournal: journals,
    internationalConference: intConf,
    nationalConference: natConf,
    trainingProgram: trainings
  },
  student: {
    coCurricular: cocur,
    extraCurricular: extracur,
    internship: internship,
    mooc: mooc
  }
};

const newAchievementsDataStr = 'achievementsData: ' + JSON.stringify(achievementsData, null, 4).replace(/\n/g, '\n  ') + ',\n    ';
const startIdx = content.indexOf('achievementsData: {');
const endIdx = content.indexOf('galleryData: [');
content = content.substring(0, startIdx) + newAchievementsDataStr + content.substring(endIdx);
fs.writeFileSync(path, content);
console.log('Fixed EVERYTHING perfectly!');
console.log('Journals:', journals.length);
