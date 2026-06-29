const fs = require('fs');
const c = fs.readFileSync('../frontend/src/data/departments/cse.js', 'utf8');
const s = c.indexOf('"internationalJournal":');
const e = c.indexOf('"internationalConference":');
const journalBlock = c.substring(s + '"internationalJournal":'.length, e).trim().replace(/,\s*$/, '');
const journals = JSON.parse(journalBlock);
console.log('Total journals:', journals.length);
console.log('\n=== First 10 journals ===');
journals.slice(0, 10).forEach((j, i) => {
    console.log(`\n--- Journal ${i+1} ---`);
    console.log('Title:', j.title ? j.title.substring(0, 80) : 'MISSING');
    console.log('Author:', j.author ? j.author.substring(0, 60) : 'MISSING');
    console.log('Journal:', j.journal ? j.journal.substring(0, 80) : 'MISSING');
    console.log('Year:', j.year);
});
