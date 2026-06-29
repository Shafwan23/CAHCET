const fs = require('fs');

const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Journals
let journalsStr = fs.readFileSync('full_journals.txt', 'utf8');
const journals = [];
let jId = 1;
const jLines = journalsStr.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('<USER_REQUEST>') && !l.includes('</USER_REQUEST>') && !l.startsWith('this is the data of'));
for (let i = 0; i < jLines.length; i++) {
    const line = jLines[i];
    if (line.includes('DOI:') || line.includes('doi:')) continue; // skip standalone DOIs
    if (line.length > 30) {
        // extract title, author, journal, year
        let author = '';
        let title = line;
        let year = '2025';
        if (line.includes(', ')) {
            const parts = line.split(', ');
            author = parts[0];
            title = parts.slice(1, -1).join(', ') || line;
            year = parts[parts.length - 1].replace(/[^0-9]/g, '');
            if (!year) year = 'Unknown';
        }
        journals.push({
            id: jId++,
            title: title,
            author: author,
            journal: line,
            year: year
            // NO description field anymore
        });
    }
}

// 2. Trainings
const tLines = fs.readFileSync('full_trainings.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('<USER_REQUEST>') && !l.includes('</USER_REQUEST>') && !l.startsWith('this is the data of'));
const trainings = [];
let currentYear = '2024-2025';
let tId = 1;
tLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        currentYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim();
        // sanitize weird chars
        currentYear = currentYear.replace(/[^0-9-]/g, '');
    } else if (line.length > 10) {
        trainings.push({
            id: tId++,
            title: line,
            organizer: "",
            date: currentYear,
            year: currentYear
        });
    }
});

// 3. Co-curricular
const cLines = fs.readFileSync('full_cocur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('<USER_REQUEST>') && !l.includes('</USER_REQUEST>') && !l.startsWith('this is co curricular'));
const cocur = [];
let cYear = '2024-2025';
let cId = 1;
cLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        cYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim();
    } else if (line.length > 10) {
        cocur.push({
            id: cId++,
            title: line,
            author: "",
            year: cYear
        });
    }
});

// 4. Extra-curricular
const eLines = fs.readFileSync('full_extracur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('<USER_REQUEST>') && !l.includes('</USER_REQUEST>') && !l.startsWith('this is extra curricular'));
const extracur = [];
let eYear = '2024-2025';
let eId = 1;
eLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        eYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim();
    } else if (line.length > 10) {
        extracur.push({
            id: eId++,
            title: line,
            author: "",
            year: eYear
        });
    }
});

// 5. Internship
const iLines = fs.readFileSync('full_internship.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('<USER_REQUEST>') && !l.includes('</USER_REQUEST>') && !l.startsWith('this is the data'));
const internship = [];
let iId = 1;
const iRegex = /^\d+\s+(.*?)\s+(.*?)\s+(.*?)\s+(\d{1,2}\/\d{1,2}\/\d{4}.*)$/;
iLines.forEach(line => {
    if (/^\d+\s/.test(line)) {
        const parts = line.split('\t');
        if (parts.length >= 5) {
            internship.push({
                id: iId++,
                author: parts[1].trim(),
                organizer: parts[2].trim(),
                title: parts[3].trim(),
                date: parts[4].trim(),
                year: '2024-2025' // default
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
                    year: '2024-2025'
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
                        year: '2024-2025'
                    });
                 }
            }
        }
    }
});

// 6. MOOC
const mLines = fs.readFileSync('full_mooc.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.includes('<USER_REQUEST>') && !l.includes('</USER_REQUEST>') && !l.startsWith('add mooc'));
const mooc = [];
let mId = 1;
mLines.forEach(line => {
    if (/^\d+\s/.test(line)) {
        const parts = line.split('\t');
        if (parts.length >= 4) {
            mooc.push({
                id: mId++,
                author: parts[1].trim(),
                organizer: parts[2].trim(),
                title: parts[3].trim(),
                date: parts[4] ? parts[4].trim() : "",
                year: '2024-2025'
            });
        }
    }
});

const intConf = [
  {
    "id": 1,
    "title": "A Review on Impacts of Machine Learning in Diverse Fields",
    "author": "Abdulnaseer M and T Balaji",
    "conference": "International Conference on Artificial Intelligence Systems for Sustainable Solutions (AIS3 2023)",
    "location": "CAHCET",
    "year": "2023",
    "description": "Presented at AIS3 2023, CAHCET in January 2023."
  },
  {
    "id": 2,
    "title": "A Robust and Fast Symmetric Text Encryption Algorithm Based on Fermat's Two Squares Theorem",
    "author": "P. Revathi",
    "conference": "International Conference on Recent Advances in Electrical, Electronics, Ubiquitous Communication, and Computational Intelligence (RAEEUCCI)",
    "location": "CAHCET",
    "year": "2023",
    "description": "Presented at RAEEUCCI, CAHCET in April 2023."
  },
  {
    "id": 3,
    "title": "A Review on Impacts of Machine Learning in Diverse Fields (Co-authored)",
    "author": "T Balaji and Abdulnaseer M",
    "conference": "International Conference on Artificial Intelligence Systems for Sustainable Solutions (AIS3 2023)",
    "location": "CAHCET",
    "year": "2023",
    "description": "Presented at AIS3 2023, CAHCET in January 2023."
  },
  {
    "id": 4,
    "title": "Voting system using BlockChain",
    "author": "Dr. Inamul Hussain R Z",
    "conference": "4th International Conference on Technology and Advancement in computing Application (ICTACA 24)",
    "location": "",
    "year": "2024",
    "description": "Presented in ICTACA 24."
  },
  {
    "id": 5,
    "title": "Crowd Funding using BlockChain and Third Web Technology",
    "author": "Dr. Inamul Hussain R Z",
    "conference": "4th International Conference on Technology and Advancement in computing Application (ICTACA 24)",
    "location": "",
    "year": "2024",
    "description": "Presented in ICTACA 24."
  }
];

const natConf = [
  {
    "id": 1,
    "title": "Prediction of Groundwater Level to Improve Water Scarcity Using Deep Learning Algorithm",
    "author": "Dr. Inamul Hussain R Z and Dr. Abrar Ahmed K",
    "conference": "National Conference on Recent Trends in Artificial Intelligence and Soft Computing",
    "location": "Bannari Amman Institute of Technology",
    "year": "2024",
    "description": "Presented in January 2024."
  },
  {
    "id": 2,
    "title": "FRD: FRAGMENTATION AND REPLICATION OF DATA OVER MULTI-CLOUDS WITH OPTIMIST PERFORMANCE AND SECURITY",
    "author": "Mr. R. Sugumar",
    "conference": "National Conference on Emerging Trends in Science, Engineering and Technology",
    "location": "NTET, Coimbatore",
    "year": "2016",
    "description": "Presented on 4 March 2016."
  },
  {
    "id": 3,
    "title": "SECURED PUBLIC AUDITING SCHEME FOR REGENERATING CODE BASED CLOUD STORAGES",
    "author": "Mr. R. Sugumar",
    "conference": "National Conference on Recent Trends in Computer Technology NCRTCT’ 16",
    "location": "Sri Balaji Chockalingam Engineering College",
    "year": "2016",
    "description": "Presented on 18 March 2016."
  }
];

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
console.log('Fixed ALL DATA! Trainings count:', trainings.length, 'Journals count:', journals.length, 'Internship count:', internship.length, 'MOOC count:', mooc.length, 'Cocur:', cocur.length);
