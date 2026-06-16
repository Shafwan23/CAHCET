const fs = require('fs');
const c = fs.readFileSync('../frontend/src/data/departments/cse.js', 'utf8');
const s = c.indexOf('"internationalJournal":');
const e = c.indexOf('"internationalConference":');
const journalBlock = c.substring(s + '"internationalJournal":'.length, e).trim().replace(/,\s*$/, '');
const journals = JSON.parse(journalBlock);

// Find the specific cards the user complained about
const mahalakshmi = journals.find(j => j.title.includes('Data Integrity'));
console.log('=== Data Integrity card ===');
console.log(JSON.stringify(mahalakshmi, null, 2));

const rna = journals.find(j => j.title.includes('RNA Sequence'));
console.log('\n=== RNA Sequence card ===');
console.log(JSON.stringify(rna, null, 2));

// Check all years are clean
const badYears = journals.filter(j => j.year.length > 10);
console.log('\n=== Cards with bad years ===');
console.log('Count:', badYears.length);
if (badYears.length > 0) {
    badYears.forEach(j => console.log(`  [${j.id}] year="${j.year.substring(0, 50)}" title="${j.title.substring(0, 40)}"`));
}

// Check for journal fields that duplicate title/author
const dupes = journals.filter(j => j.journal.includes(j.author) && j.author.length > 3);
console.log('\n=== Cards where journal field contains author name ===');
console.log('Count:', dupes.length);
