const fs = require('fs');
const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

// ============================================================
// CO-CURRICULAR — Name + Details table format
// ============================================================
const cocurLines = fs.readFileSync('data_cocur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const cocur = [];
let cocurYear = '2024-2025';
let cocurId = 1;
cocurLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        cocurYear = line.replace(/Academic Year\s*\(?/i, '').replace(/\)?$/, '').trim();
        return;
    }
    // Extract name: first word(s) before "successfully", "participated", "secured", "emerged", "was", "won"
    const nameMatch = line.match(/^(.+?)\s+(successfully|participated|secured|emerged|was the|won|from\s)/i);
    const name = nameMatch ? nameMatch[1].trim() : '';
    cocur.push({ id: cocurId++, author: name, title: line, year: cocurYear });
});

// ============================================================
// EXTRA-CURRICULAR — Name + Details table format
// ============================================================
const extraLines = fs.readFileSync('data_extracur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const extracur = [];
let extraYear = '2024-2025';
let extraId = 1;
extraLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        extraYear = line.replace(/Academic Year\s*\(?/i, '').replace(/\)?$/, '').trim();
        return;
    }
    const nameMatch = line.match(/^(.+?)\s+(was selected|won|secured|participated|from\s)/i);
    const name = nameMatch ? nameMatch[1].trim() : '';
    extracur.push({ id: extraId++, author: name, title: line, year: extraYear });
});

// ============================================================
// INTERNSHIP — Table with S.NO, NAME, COMPANY, TOPIC, DATE
// ============================================================
const internLines = fs.readFileSync('data_internship.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const internship = [];
let internYear = '2024-2025';
let internId = 1;
internLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        internYear = line.replace(/Academic Year\s*\(?/i, '').replace(/\)?$/, '').trim();
        return;
    }
    // Match lines starting with a number (S.NO)
    const match = line.match(/^\d+\t(.+)/);
    if (match) {
        const parts = match[1].split('\t');
        if (parts.length >= 3) {
            internship.push({
                id: internId++,
                author: parts[0].trim(),         // NAME
                company: parts[1].trim(),         // COMPANY
                title: parts[2] ? parts[2].trim() : '',  // TOPIC
                date: parts[3] ? parts[3].trim() : '',    // DATE
                year: internYear
            });
        }
    }
});

// ============================================================
// MOOC — Table with S.NO, STUDENT NAME, COMPANY NAME, COURSE NAME, DATE
// ============================================================
const moocLines = fs.readFileSync('data_mooc.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const mooc = [];
let moocYear = '2024-2025';
let moocId = 1;
moocLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        moocYear = line.replace(/Academic Year\s*\(?/i, '').replace(/\)?$/, '').trim();
        return;
    }
    const match = line.match(/^\d+\t(.+)/);
    if (match) {
        const parts = match[1].split('\t');
        if (parts.length >= 3) {
            mooc.push({
                id: moocId++,
                author: parts[0].trim(),          // STUDENT NAME
                company: parts[1].trim(),          // COMPANY NAME
                title: parts[2] ? parts[2].trim() : '',   // COURSE NAME
                date: parts[3] ? parts[3].trim() : '',     // DATE
                year: moocYear
            });
        }
    }
});

// ============================================================
// Keep faculty data unchanged — read existing
// ============================================================
const existingStart = content.indexOf('"faculty":');
const existingEnd = content.indexOf('"student":');
const facultyBlock = content.substring(existingStart + '"faculty":'.length, existingEnd).trim().replace(/,\s*$/, '');
let faculty;
try {
    faculty = JSON.parse(facultyBlock);
} catch(e) {
    console.error('Failed to parse existing faculty data, keeping old data');
    // Fallback: re-read the whole achievementsData
    const aStart = content.indexOf('"internationalJournal":');
    const aEnd = content.indexOf('"student":');
    faculty = null;
}

// Build achievementsData
let achievementsData;
if (faculty) {
    achievementsData = {
        faculty: faculty,
        student: {
            coCurricular: cocur,
            extraCurricular: extracur,
            internship: internship,
            mooc: mooc
        }
    };
} else {
    // If we can't parse faculty, just update student data
    // Parse the whole thing differently
    console.log('Using alternative approach...');
    const fullStart = content.indexOf('achievementsData: {') + 'achievementsData: '.length;
    const fullEnd = content.indexOf('galleryData: [');
    const fullBlock = content.substring(fullStart, fullEnd).trim().replace(/,\s*$/, '');
    const existing = JSON.parse(fullBlock);
    existing.student = {
        coCurricular: cocur,
        extraCurricular: extracur,
        internship: internship,
        mooc: mooc
    };
    achievementsData = existing;
}

const newStr = 'achievementsData: ' + JSON.stringify(achievementsData, null, 4).replace(/\n/g, '\n  ') + ',\n    ';
const startIdx = content.indexOf('achievementsData: {');
const endIdx = content.indexOf('galleryData: [');
content = content.substring(0, startIdx) + newStr + content.substring(endIdx);
fs.writeFileSync(path, content);

console.log('=== FINAL COUNTS ===');
console.log('Co-curricular:', cocur.length);
console.log('Extra-curricular:', extracur.length);
console.log('Internship:', internship.length);
console.log('MOOC:', mooc.length);

// Verify a few entries
console.log('\n=== CO-CURRICULAR SAMPLE ===');
cocur.slice(0, 3).forEach(c => console.log(`  [${c.year}] ${c.author} -> ${c.title.substring(0, 60)}...`));

console.log('\n=== EXTRA-CURRICULAR SAMPLE ===');
extracur.slice(0, 3).forEach(e => console.log(`  [${e.year}] ${e.author} -> ${e.title.substring(0, 60)}...`));

console.log('\n=== INTERNSHIP SAMPLE ===');
internship.slice(0, 3).forEach(i => console.log(`  [${i.year}] ${i.author} | ${i.company} | ${i.title} | ${i.date}`));

console.log('\n=== MOOC SAMPLE ===');
mooc.slice(0, 3).forEach(m => console.log(`  [${m.year}] ${m.author} | ${m.company} | ${m.title} | ${m.date}`));

// Check internship data from 2023-2024
const intern2324 = internship.filter(i => i.year === '2023-2024');
console.log('\n=== INTERNSHIP 2023-2024 COUNT ===', intern2324.length);
if (intern2324.length > 0) {
    console.log('  First:', intern2324[0].author, '|', intern2324[0].company, '|', intern2324[0].title);
}
